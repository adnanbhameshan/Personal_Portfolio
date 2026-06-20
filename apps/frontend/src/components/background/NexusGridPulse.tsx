import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface Pulse {
  x: number;
  y: number;
  startedAt: number;
}

export function NexusGridPulse() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return undefined;
    }

    let animationFrame = 0;
    let nextPulseAt = 0;
    let activePulse: Pulse | null = null;
    const spacing = 28;
    const pulseDuration = prefersReducedMotion ? 0 : 2_200;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * pixelRatio);
      canvas.height = Math.floor(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      context.clearRect(0, 0, width, height);

      if (!prefersReducedMotion && time > nextPulseAt) {
        activePulse = {
          x: Math.random() * width,
          y: Math.random() * Math.min(height, 760),
          startedAt: time,
        };
        nextPulseAt = time + 4_000 + Math.random() * 2_000;
      }

      const columns = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let xIndex = 0; xIndex < columns; xIndex += 1) {
        for (let yIndex = 0; yIndex < rows; yIndex += 1) {
          const x = xIndex * spacing;
          const y = yIndex * spacing;
          let alpha = 0.12;
          let radius = 1;

          if (activePulse) {
            const elapsed = time - activePulse.startedAt;
            const distance = Math.hypot(x - activePulse.x, y - activePulse.y);
            const rippleRadius = elapsed * 0.28;
            const distanceFromWave = Math.abs(distance - rippleRadius);
            const waveStrength = Math.max(0, 1 - distanceFromWave / 82) * Math.max(0, 1 - elapsed / pulseDuration);

            alpha += waveStrength * 0.34;
            radius += waveStrength * 0.9;

            if (elapsed > pulseDuration) {
              activePulse = null;
            }
          }

          context.beginPath();
          context.fillStyle = `rgba(96, 165, 250, ${alpha})`;
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [prefersReducedMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_12%,rgba(6,182,212,0.1),transparent_30rem)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-void to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-void to-transparent" />
    </div>
  );
}
