"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

const INTERVAL_MS = 5000;
// この距離（px）以上、横に指を動かしたらスワイプとみなす
const SWIPE_THRESHOLD = 40;

// 5秒ごとに右隣へ切り替え、最後の次は最初に戻る。スワイプでも切り替えられる。
// 1枚以下なら切り替えない
export function useSlideshow(count: number) {
  const [index, setIndex] = useState(0);
  // スワイプした後は、そこから5秒数え直す
  const [cycle, setCycle] = useState(0);
  const startXRef = useRef<number | null>(null);

  const current = count > 0 ? index % count : 0;

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, cycle]);

  function go(step: number) {
    if (count <= 1) return;
    setIndex((i) => (((i + step) % count) + count) % count);
    setCycle((c) => c + 1);
  }

  const swipeHandlers = {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      startXRef.current = event.clientX;
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      if (startXRef.current === null) return;
      const dx = event.clientX - startXRef.current;
      startXRef.current = null;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      go(dx < 0 ? 1 : -1);
    },
    onPointerCancel() {
      startXRef.current = null;
    },
  };

  return { current, swipeHandlers };
}
