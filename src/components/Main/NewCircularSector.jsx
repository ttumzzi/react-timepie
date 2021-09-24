import { useRef } from 'react';
import { useEffect, useState } from 'react/cjs/react.development';
import { useRecoilState } from 'recoil';
import useCanvas from '../../hook/useCanvas';
import { scheduleState } from '../../recoil/SCHEDULE';
import {
  clearCanvas, drawCircularSectorByTime, getCoordinatesInCanvas, getTimeByCoordinates,
} from '../../utils/canvas';
import { CANVAS_SIZE } from '../../utils/canvas_constant';
import * as Styled from './Main.style';

const NewCircularSector = () => {
  const [canvas, context] = useCanvas();
  const [currentStartMin, setStartMin] = useState();
  const [currentEndMin, setEndMin] = useState();
  const [schedule, setSchedule] = useRecoilState(scheduleState);

  const initTime = () => {
    setStartMin(null);
    setEndMin(null);
  };

  const isFilled = (minute) => {
    let isFilledFlag = false;

    schedule.forEach(({ startMin, endMin }) => {
      if (minute >= startMin && minute < endMin) isFilledFlag = true;
      if (startMin > endMin && (minute >= startMin || minute < endMin)) isFilledFlag = true;
    });

    return isFilledFlag;
  };

  const getMovableRange = (currentMinute) => {
    let minimum = 0;
    let maximum = 60 * 24;

    schedule.forEach(({ startMin, endMin }) => {
      if (endMin <= currentMinute && endMin > minimum) minimum = endMin;
      if (startMin >= currentMinute && startMin < maximum) maximum = startMin;
    });

    return [minimum, maximum];
  };

  const onMouseDown = (mouseDownEvent) => {
    initTime();
    const { target } = mouseDownEvent;
    const { x, y } = getCoordinatesInCanvas(mouseDownEvent);
    const startMin = getTimeByCoordinates(x, y);
    if (isFilled(startMin)) return;

    const [minimum, maximum] = getMovableRange(startMin);
    setStartMin(startMin);

    function handleMouseMove(mouseMoveEvent) {
      const { x: nextX, y: nextY } = getCoordinatesInCanvas(mouseMoveEvent);
      const endMin = getTimeByCoordinates(nextX, nextY);
      if (endMin < minimum || endMin > maximum) return;
      setEndMin(endMin < startMin ? Math.max(endMin, minimum) : Math.min(endMin, maximum));
    }

    function handleMouseUp(e) {
      target.removeEventListener('mousemove', handleMouseMove);
      const { x: endX, y: endY } = getCoordinatesInCanvas(e);
      const endMin = getTimeByCoordinates(endX, endY);
      setEndMin(endMin < startMin ? Math.max(endMin, minimum) : Math.min(endMin, maximum));
    }

    target.removeEventListener('mouseup', handleMouseUp);
    target.addEventListener('mousemove', handleMouseMove);
    target.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (!currentStartMin || !currentEndMin) return;

    const color = '#FF488E';
    clearCanvas(context);
    drawCircularSectorByTime(context,
      Math.min(currentStartMin, currentEndMin),
      Math.max(currentStartMin, currentEndMin),
      color);
  }, [currentStartMin, currentEndMin]);

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
