import { useEffect, useRef } from 'react';

export default function useUpdateEffect(callback, dependencies) {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    let onDestroy = false;
    if (!onDestroy) {
      if (firstRenderRef.current) {
        firstRenderRef.current = false;
        return;
      }
      return callback();
    }
    return () => {
      onDestroy = true;
    };
  }, dependencies);
}
