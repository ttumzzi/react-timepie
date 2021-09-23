import { useRef, useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import { CANVAS_SIZE, RADIUS, THETA } from './canvas_constant';
import * as Styled from './Main.style';

const TimeTable = () => {
  const MIDDLE = CANVAS_SIZE / 2;

  const canvas = useRef(null);
  const [context, setContext] = useState(null);

  const getCoordinatesInCanvas = ({ clientX, clientY, target }) => {
    const x = clientX - target.getBoundingClientRect().left;
    const y = clientY - target.getBoundingClientRect().top;
    return { x, y };
  };

  const drawCircularSector = (x, y) => {
    const adjustedX = x - MIDDLE;
    const adjustedY = MIDDLE - y;
    const angle = Math.atan(adjustedX / adjustedY);
    const anlgeOffset = adjustedY > 0 ? Math.PI * (3 / 2) : Math.PI / 2;
    const startAngle = (Math.floor(angle / THETA) * THETA) + anlgeOffset;
    const endAngle = startAngle + THETA;

    context.beginPath();
    context.moveTo(MIDDLE, MIDDLE);
    context.arc(MIDDLE, MIDDLE, RADIUS, startAngle, endAngle, false);
    context.fill();
  };

  const onMouseDown = (mouseDownEvent) => {
    const { target } = mouseDownEvent;
    const { x, y } = getCoordinatesInCanvas(mouseDownEvent);
    drawCircularSector(x, y);

    function handleMouseMove(mouseMoveEvent) {
      const { x: nextX, y: nextY } = getCoordinatesInCanvas(mouseMoveEvent);
      drawCircularSector(nextX, nextY);
    }

    function handleMouseUp(e) {
      target.removeEventListener('mousemove', handleMouseMove);
      const { x: endX, y: endY } = getCoordinatesInCanvas(e);
      console.log(`endX: ${endX}, endY: ${endY}`);
    }

    target.removeEventListener('mouseup', handleMouseUp);
    target.addEventListener('mousemove', handleMouseMove);
    target.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (!context) return;

    console.log('context start');
  }, [context]);

  useEffect(() => {
    if (!canvas) return;

    setContext(canvas.current.getContext('2d'));
  }, [canvas]);

  return (
    <Styled.Canvas
      ref={canvas}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      onMouseDown={onMouseDown}
    />
  );
};

export default TimeTable;
