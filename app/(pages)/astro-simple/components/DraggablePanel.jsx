"use client";

import { useEffect, useRef, useState } from "react";

export default function DraggablePanel({
  title = "הגדרות",
  children,
  initialTop = 100,
  initialLeft = 24,
  initialAlignRight = false,
  defaultCollapsed = false,
  onClose,
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ top: initialTop, left: initialLeft });
  const [collapsed, setCollapsed] = useState(!!defaultCollapsed);
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, origTop: 0, origLeft: 0 });

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragState.current.dragging) return;
      e.preventDefault();
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      updatePosition(dragState.current.origTop + dy, dragState.current.origLeft + dx);
    }
    function onMouseUp() {
      dragState.current.dragging = false;
    }
    function onTouchMove(e) {
      if (!dragState.current.dragging) return;
      const t = e.touches?.[0];
      if (!t) return;
      const dx = t.clientX - dragState.current.startX;
      const dy = t.clientY - dragState.current.startY;
      updatePosition(dragState.current.origTop + dy, dragState.current.origLeft + dx);
    }
    function onTouchEnd() {
      dragState.current.dragging = false;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // On first mount, if requested, align the panel to the right by computing its left position
  useEffect(() => {
    if (!initialAlignRight) return;
    const margin = 24;
    const placeRight = () => {
      const rect = panelRef.current?.getBoundingClientRect();
      const w = rect?.width || 360;
      const left = Math.max(8, window.innerWidth - w - margin);
      setPos((p) => ({ ...p, left }));
    };
    // try immediately and again on next frame to ensure correct width after render
    placeRight();
    const id = requestAnimationFrame(placeRight);
    return () => cancelAnimationFrame(id);
  }, [initialAlignRight]);

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  function updatePosition(nextTop, nextLeft) {
    const rect = panelRef.current?.getBoundingClientRect();
    const w = rect?.width || 360;
    const h = rect?.height || 400;
    const maxLeft = Math.max(0, window.innerWidth - w - 8);
    const maxTop = Math.max(0, window.innerHeight - 48); // allow header visible
    setPos({
      top: clamp(nextTop, 8, maxTop),
      left: clamp(nextLeft, 8, maxLeft),
    });
  }

  function startDrag(e) {
    e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    dragState.current = {
      dragging: true,
      startX: point.clientX,
      startY: point.clientY,
      origTop: pos.top,
      origLeft: pos.left,
    };
  }

  function toggleCollapsed() {
    setCollapsed((c) => !c);
  }

  return (
    <div
      ref={panelRef}
      className={
        "fixed z-50 max-h-[85vh] overflow-auto rounded-xl border shadow-2xl backdrop-blur bg-white/90 dark:bg-neutral-900/90 dark:border-neutral-800 " +
        (collapsed ? " w-auto" : " w-[360px] max-w-[95vw]")
      }
      style={{ top: pos.top, left: pos.left }}
    >
      <div
        className="sticky top-0 select-none border-b bg-white dark:bg-neutral-900 dark:border-neutral-800 px-3 py-2 rounded-t-xl flex items-center justify-between"
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onDoubleClick={toggleCollapsed}
        aria-expanded={!collapsed}
        role="toolbar"
      >
        <div className="flex items-center gap-2">
          <div className="font-semibold text-sm text-gray-800 dark:text-neutral-100">
            {title}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-neutral-400 hidden sm:block">ניתן לגרור (דאבל־קליק לכיווץ/הרחבה)</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
            title={collapsed ? "הגדל" : "הקטן"}
            aria-label={collapsed ? "הגדל" : "הקטן"}
            onClick={(e) => { e.stopPropagation(); toggleCollapsed(); }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {collapsed ? "＋" : "–"}
          </button>
          {typeof onClose === 'function' && (
            <button
              type="button"
              className="inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
              title="סגור"
              aria-label="סגור"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ×
            </button>
          )}
        </div>
      </div>
      {!collapsed && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}
