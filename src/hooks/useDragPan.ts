import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

/**
 * Drag to pan a zoomed image, with mouse or touch.
 *
 * Attach `stageRef` and `stageProps` to the element that clips the image, and
 * apply `transform` to the element that is scaled. Panning only starts once the
 * image is zoomed past 100%, and stops at the image's edges, so it can never be
 * dragged out of view. Below that the stage leaves touches alone and the page
 * scrolls as usual. `resetKey` recentres the image, e.g. when it changes.
 */
export function useDragPan(zoom: number, resetKey?: unknown) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ pointer: Point; pan: Point } | null>(null);
  const canPan = zoom > 1;

  // How far the scaled picture overhangs the stage on each side. An
  // object-contain image can be letterboxed inside its box, so measure the
  // picture from its own proportions rather than the box.
  const clamp = useCallback(
    (p: Point): Point => {
      const stage = stageRef.current;
      const img = stage?.querySelector('img');
      if (!stage || !img) return p;
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 0;
      const w = ratio ? Math.min(img.offsetWidth, img.offsetHeight * ratio) : img.offsetWidth;
      const h = ratio ? Math.min(img.offsetHeight, img.offsetWidth / ratio) : img.offsetHeight;
      const maxX = Math.max(0, (w * zoom - stage.clientWidth) / 2);
      const maxY = Math.max(0, (h * zoom - stage.clientHeight) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, p.x)),
        y: Math.min(maxY, Math.max(-maxY, p.y)),
      };
    },
    [zoom]
  );

  // Zooming out pulls the image back inside its edges.
  useEffect(() => setPan((p) => clamp(p)), [clamp]);
  useEffect(() => setPan({ x: 0, y: 0 }), [resetKey]);

  const end = () => {
    start.current = null;
    setDragging(false);
  };

  const stageProps = {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if (!canPan || e.button !== 0) return;
      // Controls laid over the stage keep their clicks.
      if ((e.target as HTMLElement).closest('button, a')) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      start.current = { pointer: { x: e.clientX, y: e.clientY }, pan };
      setDragging(true);
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      const s = start.current;
      if (!s) return;
      setPan(clamp({ x: s.pan.x + e.clientX - s.pointer.x, y: s.pan.y + e.clientY - s.pointer.y }));
    },
    onPointerUp: end,
    onPointerCancel: end,
    // The browser's own image drag would steal the gesture.
    onDragStart: (e: React.DragEvent) => e.preventDefault(),
    style: { touchAction: canPan ? 'none' : 'pan-y' } as React.CSSProperties,
  };

  return {
    stageRef,
    stageProps,
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    dragging,
    canPan,
  };
}
