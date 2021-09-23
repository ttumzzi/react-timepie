import { useRef } from 'react';
import { useEffect, useState } from 'react/cjs/react.development';
import { useRecoilState } from 'recoil';
import { scheduleState } from '../../recoil/SCHEDULE';
import { clearCanvas, drawCircularSectorByTime } from '../../utils/canvas';
import { CANVAS_MIDDLE, CANVAS_SIZE, THETA } from '../../utils/canvas_constant';
import * as Styled from './Main.style';

const NewCircularSector = () => {
  const canvas = useRef(null);
  const [context, setContext] = useState(null);
  const [currentStartMin, setStartMin] = useState();
  const [currentEndMin, setEndMin] = useState();
  const [schedule, setSchedule] = useRecoilState(scheduleState);

  const getTimeByCoordinates = (x, y) => {
    const adjustedX = x - CANVAS_MIDDLE;
    const adjustedY = CANVAS_MIDDLE - y;
    const angle = Math.atan(adjustedX / adjustedY);
    const time = Math.floor(angle / THETA);
    if (time >= 0 && adjustedX >= 0) {
      return time * 10;
    }
    if (time <= 0 && adjustedX >= 0) {
      return (72 + time) * 10;
    }
    if (time >= 0 && adjustedX <= 0) {
      return (72 + time) * 10;
    }
    if (time <= 0 && adjustedX <= 0) {
      return (144 + time) * 10;
    }
    return 0;
  };

  const getCoordinatesInCanvas = ({ clientX, clientY, target }) => {
    const x = clientX - target.getBoundingClientRect().left;
    const y = clientY - target.getBoundingClientRect().top;
    return { x, y };
  };

  const onMouseDown = (mouseDownEvent) => {
    const { target } = mouseDownEvent;
    const { x, y } = getCoordinatesInCanvas(mouseDownEvent);
    const startMin = getTimeByCoordinates(x, y);
    setStartMin(startMin);

    function handleMouseMove(mouseMoveEvent) {
      const { x: nextX, y: nextY } = getCoordinatesInCanvas(mouseMoveEvent);
      const endMin = getTimeByCoordinates(nextX, nextY);
      setEndMin(endMin);
    }

    function handleMouseUp(e) {
      target.removeEventListener('mousemove', handleMouseMove);
      const { x: endX, y: endY } = getCoordinatesInCanvas(e);
      const endMin = getTimeByCoordinates(endX, endY);
      setEndMin(endMin);

      setStartMin(null);
      setEndMin(null);
    }

    target.removeEventListener('mouseup', handleMouseUp);
    target.addEventListener('mousemove', handleMouseMove);
    target.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (!currentStartMin || !currentEndMin) return;
    clearCanvas(context);
    drawCircularSectorByTime(context, currentStartMin, currentEndMin);
  }, [currentStartMin, currentEndMin]);

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

export default NewCircularSector;
