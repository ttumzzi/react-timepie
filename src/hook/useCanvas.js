import { useEffect, useRef, useState } from 'react';

const useCanvas = () => {
  const canvas = useRef(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (!canvas) return;

    setContext(canvas.current.getContext('2d'));
  }, [canvas]);

  return [canvas, context];
};
export default useCanvas;
