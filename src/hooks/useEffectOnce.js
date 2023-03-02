import { useEffect } from 'react';

export default function useEffectOnce(cb) {
  useEffect(() => {
    let onDestroy = false;
    if (!onDestroy) {
      return cb();
    }
    return () => {
      onDestroy = true;
    };
  }, []);
}
