import { useRef, useMutationEffect, useLayoutEffect } from "react";

export const useAnimationFrame = callback => {
  const callbackRef = useRef(callback);
  useMutationEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const loop = useCallback(() => {
    frameRef.current = requestAnimationFrame(loop);
    const cb = callbackRef.current;
    cb();
  });

  const frameRef = useRef();
  useLayoutEffect(() => {
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [loop]);
};
