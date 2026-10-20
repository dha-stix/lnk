"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** True once the element has scrolled into view (stays true). */
export function useInView<T extends Element>(options: IntersectionObserverInit = { threshold: 0.2 }): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return [ref, inView];
}

export function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Cycles 0..count-1 on an interval, e.g. for rotating headline words. */
export function useCycle(count: number, interval = 2000) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(id);
  }, [count, interval]);
  return index;
}

/** Eases a number from its previous value to `target` once `start` is true. */
export function useCountUp(target: number, start = true, duration = 1400) {
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (!start) return;
    const initial = from.current;
    const t0 = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(initial + (target - initial) * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
      else from.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start, duration]);

  return value;
}
