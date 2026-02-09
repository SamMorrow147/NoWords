"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

const BRUSH_RADIUS = 80;        // outer reach of the heat
const BRUSH_CORE = 30;          // inner "hot" zone — fully thaws
const REFREEZE_SPEED = 0.009;
const REFREEZE_DELAY = 1200;
const CELL = 6;

export interface IceThawCanvasHandle {
  /** Set edge reveal: 0 = fully hidden, 1 = fully revealed. Controls the edge gradient masks. */
  setReveal: (progress: number) => void;
}

const IceThawCanvas = forwardRef<IceThawCanvasHandle, { maxOpacity?: number; onReady?: () => void }>(
  function IceThawCanvas({ maxOpacity = 0.12, onReady }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef({
      reveal: 0,           // 0–1: how far the edge masks have opened
      maxOpacity,
    });

    // Keep maxOpacity in sync
    stateRef.current.maxOpacity = maxOpacity;

    useImperativeHandle(ref, () => ({
      setReveal(p: number) {
        stateRef.current.reveal = Math.max(0, Math.min(1, p));
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let img: HTMLImageElement | null = null;
      let w = 0;
      let h = 0;
      let cols = 0;
      let rows = 0;
      let rafId = 0;
      let lastMove = 0;
      let mouseX = -999;
      let mouseY = -999;
      let isActive = false;
      let hasThaw = false;

      let grid: Float32Array;

      // Off-screen canvas for compositing the edge mask
      let maskCanvas: HTMLCanvasElement;
      let maskCtx: CanvasRenderingContext2D;

      // Pre-render a soft radial brush stamp (used for erasing thawed cells)
      const brushRes = 64;
      const softBrush = document.createElement("canvas");
      softBrush.width = brushRes;
      softBrush.height = brushRes;
      const bCtx = softBrush.getContext("2d")!;
      const half = brushRes / 2;
      const grad = bCtx.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.35, "rgba(0,0,0,0.7)");
      grad.addColorStop(0.65, "rgba(0,0,0,0.3)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      bCtx.fillStyle = grad;
      bCtx.fillRect(0, 0, brushRes, brushRes);

      function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

        maskCanvas = document.createElement("canvas");
        maskCanvas.width = w * dpr;
        maskCanvas.height = h * dpr;
        maskCtx = maskCanvas.getContext("2d")!;
        maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        cols = Math.ceil(w / CELL);
        rows = Math.ceil(h / CELL);
        grid = new Float32Array(cols * rows);
        grid.fill(1);
        hasThaw = false;
      }

      function draw() {
        if (!ctx || !maskCtx || !img || !img.complete) return;
        const { reveal, maxOpacity: mOp } = stateRef.current;

        ctx.clearRect(0, 0, w, h);

        // Nothing to show yet
        if (reveal <= 0) return;

        // Map reveal (0–1) to edge mask coverage and opacity (same 3-stage curve as CSS)
        let maskPctX: number, maskPctY: number, baseOpacity: number;
        if (reveal < 0.33) {
          const t = reveal / 0.33;
          maskPctX = t * 40;
          maskPctY = t * 35;
          baseOpacity = t * 0.05;
        } else if (reveal < 0.66) {
          const t = (reveal - 0.33) / 0.33;
          maskPctX = 40 + t * 30;
          maskPctY = 35 + t * 30;
          baseOpacity = 0.05 + t * 0.04;
        } else {
          const t = (reveal - 0.66) / 0.34;
          maskPctX = 70 + t * 30;
          maskPctY = 65 + t * 35;
          baseOpacity = 0.09 + t * (mOp - 0.09);
        }

        const edgeW = (maskPctX / 100) * w;
        const edgeH = (maskPctY / 100) * h;
        const softZone = 0.4;

        // --- Step 1: Build a UNION edge mask using additive blending ---
        // Each gradient represents one edge; "lighter" adds their alpha values
        // so the union of left + right + bottom edges is visible from the start.
        maskCtx.clearRect(0, 0, w, h);
        maskCtx.globalAlpha = 1;
        maskCtx.globalCompositeOperation = "lighter";

        // LEFT edge gradient
        const solidEndL = Math.max(0, (edgeW * (1 - softZone)) / w);
        const fadeEndL = Math.min(1, edgeW / w);
        const gradL = maskCtx.createLinearGradient(0, 0, w, 0);
        gradL.addColorStop(0, "rgba(255,255,255,1)");
        gradL.addColorStop(Math.min(solidEndL, fadeEndL), "rgba(255,255,255,1)");
        gradL.addColorStop(fadeEndL, "rgba(255,255,255,0)");
        if (fadeEndL < 1) gradL.addColorStop(1, "rgba(255,255,255,0)");
        maskCtx.fillStyle = gradL;
        maskCtx.fillRect(0, 0, w, h);

        // RIGHT edge gradient
        const gradR = maskCtx.createLinearGradient(w, 0, 0, 0);
        gradR.addColorStop(0, "rgba(255,255,255,1)");
        gradR.addColorStop(Math.min(solidEndL, fadeEndL), "rgba(255,255,255,1)");
        gradR.addColorStop(fadeEndL, "rgba(255,255,255,0)");
        if (fadeEndL < 1) gradR.addColorStop(1, "rgba(255,255,255,0)");
        maskCtx.fillStyle = gradR;
        maskCtx.fillRect(0, 0, w, h);

        // BOTTOM edge gradient
        const solidEndB = Math.max(0, (edgeH * (1 - softZone)) / h);
        const fadeEndB = Math.min(1, edgeH / h);
        const gradB = maskCtx.createLinearGradient(0, h, 0, 0);
        gradB.addColorStop(0, "rgba(255,255,255,1)");
        gradB.addColorStop(Math.min(solidEndB, fadeEndB), "rgba(255,255,255,1)");
        gradB.addColorStop(fadeEndB, "rgba(255,255,255,0)");
        if (fadeEndB < 1) gradB.addColorStop(1, "rgba(255,255,255,0)");
        maskCtx.fillStyle = gradB;
        maskCtx.fillRect(0, 0, w, h);

        // --- Step 2: Stamp the ice texture into the mask, keeping union alpha ---
        // "source-in" replaces RGB with the texture while keeping dst alpha
        maskCtx.globalCompositeOperation = "source-in";
        maskCtx.globalAlpha = baseOpacity;
        maskCtx.drawImage(img, 0, 0, w, h);

        // --- Step 3: Erase thawed cells ---
        if (hasThaw) {
          maskCtx.globalCompositeOperation = "destination-out";
          const half = CELL / 2;
          const stampSize = Math.ceil(CELL * 2.5);
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const a = grid[r * cols + c];
              if (a < 0.97) {
                const cx = c * CELL + half;
                const cy = r * CELL + half;
                maskCtx.globalAlpha = 1 - a;
                maskCtx.drawImage(
                  softBrush,
                  cx - stampSize / 2,
                  cy - stampSize / 2,
                  stampSize,
                  stampSize
                );
              }
            }
          }
        }

        // --- Step 4: Copy composited result to the visible canvas ---
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(maskCanvas, 0, 0, w, h);
      }

      // Simple seeded-ish noise for organic edges (deterministic per cell)
      function cellNoise(col: number, row: number) {
        const n = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
        return n - Math.floor(n); // 0–1
      }

      function thawAt(mx: number, my: number) {
        const r = BRUSH_RADIUS;
        const rCells = Math.ceil(r / CELL);
        const cc = Math.floor(mx / CELL);
        const cr = Math.floor(my / CELL);

        const c0 = Math.max(0, cc - rCells);
        const c1 = Math.min(cols - 1, cc + rCells);
        const r0 = Math.max(0, cr - rCells);
        const r1 = Math.min(rows - 1, cr + rCells);

        // Gaussian sigma: the "heat spread". Core is full strength, then gaussian decay.
        const sigma = (r - BRUSH_CORE) * 0.45;

        for (let row = r0; row <= r1; row++) {
          for (let col = c0; col <= c1; col++) {
            const cx = col * CELL + CELL / 2;
            const cy = row * CELL + CELL / 2;
            const dx = cx - mx;
            const dy = cy - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let strength: number;
            if (dist <= BRUSH_CORE) {
              // Inside the hot core: full strength
              strength = 1;
            } else if (dist < r) {
              // Gaussian falloff outside core — always soft, never a hard edge
              const d = dist - BRUSH_CORE;
              strength = Math.exp(-(d * d) / (2 * sigma * sigma));
            } else {
              continue;
            }

            // Add organic variation: noise warps the effective radius per-cell
            const noise = cellNoise(col, row);
            // Noise shrinks/grows the effective reach by ±25%
            const warpedR = r * (0.75 + noise * 0.5);
            if (dist > warpedR) {
              strength *= Math.max(0, 1 - (dist - warpedR) / (r * 0.3));
            }

            const idx = row * cols + col;
            grid[idx] = Math.max(0, grid[idx] - strength * 0.08);
            hasThaw = true;
          }
        }
      }

      function refreeze() {
        if (!hasThaw) return;
        const now = performance.now();
        if (now - lastMove < REFREEZE_DELAY) return;

        let anyThawed = false;
        for (let i = 0; i < grid.length; i++) {
          if (grid[i] < 1) {
            grid[i] = Math.min(1, grid[i] + REFREEZE_SPEED);
            anyThawed = true;
          }
        }
        hasThaw = anyThawed;
      }

      function tick() {
        if (isActive) thawAt(mouseX, mouseY);
        refreeze();
        draw();
        rafId = requestAnimationFrame(tick);
      }

      function handleMouseMove(e: MouseEvent) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMove = performance.now();
        isActive = true;
      }

      function handleMouseLeave() {
        isActive = false;
      }

      img = new Image();
      img.src = "/IceTexture.png";
      img.onload = () => {
        resize();
        rafId = requestAnimationFrame(tick);
        onReady?.();
      };

      window.addEventListener("resize", resize);
      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
        aria-hidden
      />
    );
  }
);

export default IceThawCanvas;
