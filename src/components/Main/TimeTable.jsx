import { useRef, useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import { getColorById } from '../../utils/utils';
import { CANVAS_SIZE, RADIUS, THETA } from './canvas_constant';
import * as Styled from './Main.style';

const TimeTable = () => {
  const MIDDLE = CANVAS_SIZE / 2;
  const fakeData = [
    {
      id: 1,
      name: 'sleep',
      startMin: 1320, // 22:00
      endMin: 360, // 6:00
    },
    {
      id: 2,
      name: 'workout',
      startMin: 620, // 10:20
      endMin: 670, // 11: 10
    },
    {
      id: 3,
      name: 'play with puppy💜',
      startMin: 870, // 14:30
      endMin: 890, // 14:50
    },
  ];

  const canvas = useRef(null);
  const [context, setContext] = useState(null);

  const getCoordinatesInCanvas = ({ clientX, clientY, target }) => {
    const x = clientX - target.getBoundingClientRect().left;
    const y = clientY - target.getBoundingClientRect().top;
    return { x, y };
  };

  const drawCircularSector = (startMin, endMin, color) => {
    const angleOffset = Math.PI * (3 / 2);
    const HOUR24_TO_MIN = 24 * 60;
    const startAngle = (startMin / HOUR24_TO_MIN) * (Math.PI * 2) + angleOffset;
    const endAngle = (endMin / 720) * Math.PI + angleOffset;

    context.fillStyle = color;
    context.beginPath();
    context.moveTo(MIDDLE, MIDDLE);
    context.arc(MIDDLE, MIDDLE, RADIUS, startAngle, endAngle, false);
    context.fill();
  };

  const drawCircularSectorUsingCoordinates = (x, y) => {
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
    drawCircularSectorUsingCoordinates(x, y);

    function handleMouseMove(mouseMoveEvent) {
      const { x: nextX, y: nextY } = getCoordinatesInCanvas(mouseMoveEvent);
      drawCircularSectorUsingCoordinates(nextX, nextY);
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
    fakeData.forEach(({ id, startMin, endMin }) => {
      const color = getColorById(id);
      drawCircularSector(startMin, endMin, color);
    });
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
