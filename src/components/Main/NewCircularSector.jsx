import { useEffect, useState } from 'react/cjs/react.development';
import { useRecoilState } from 'recoil';
import useCanvas from '../../hook/useCanvas';
import { scheduleState } from '../../recoil/SCHEDULE';
import { clearCanvas, drawCircularSectorByTime } from '../../utils/canvas';
import {
  CANVAS_MIDDLE, CANVAS_SIZE, HOUR_PARTITION, THETA,
} from '../../utils/canvas_constant';
import COLOR from '../../utils/color';
import * as Styled from './Main.style';

const NewCircularSector = () => {
  const TIME_UNIT = 60 / HOUR_PARTITION;
  const [canvas, context] = useCanvas();
  const [currentStartTime, setStartTime] = useState();
  const [currentEndTime, setEndTime] = useState();
  const [schedule, setSchedule] = useRecoilState(scheduleState);

  const initTime = () => {
    setStartTime(null);
    setEndTime(null);
  };

  const isFilled = (minute) => {
    let isFilledFlag = false;

    schedule.forEach(({ startMin, endMin }) => {
      if (minute >= startMin && minute < endMin) isFilledFlag = true;
      if (startMin > endMin && (minute >= startMin || minute < endMin)) isFilledFlag = true;
    });

    return isFilledFlag;
  };

  const isOutOfRange = (startTime, endTime, minTimeRange, maxTimeRange) => startTime < minTimeRange
  || endTime > maxTimeRange;

  const isCounterClockwise = (startTime, endTime) => startTime >= endTime;

  const getTimeByCoordinates = (x, y) => {
    const SPACES_COUNT_IN_QUARTER = 6 * HOUR_PARTITION;
    const adjustedX = x - CANVAS_MIDDLE;
    const adjustedY = CANVAS_MIDDLE - y;
    const angle = Math.atan(adjustedX / adjustedY);
    const time = Math.floor(angle / THETA);
    if (time >= 0 && adjustedX >= 0) {
      return time * TIME_UNIT;
    }
    if (time <= 0 && adjustedX >= 0) {
      return (2 * SPACES_COUNT_IN_QUARTER + time) * TIME_UNIT;
    }
    if (time >= 0 && adjustedX <= 0) {
      return (2 * SPACES_COUNT_IN_QUARTER + time) * TIME_UNIT;
    }
    if (time <= 0 && adjustedX <= 0) {
      return (4 * SPACES_COUNT_IN_QUARTER + time) * TIME_UNIT;
    }
    return 0;
  };

  const getCoordinatesInCanvas = ({ clientX, clientY, target }) => {
    const x = clientX - target.getBoundingClientRect().left;
    const y = clientY - target.getBoundingClientRect().top;
    return { x, y };
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

  const getEndTimeByEvent = (event) => {
    const { x, y } = getCoordinatesInCanvas(event);
    const endTime = getTimeByCoordinates(x, y) + TIME_UNIT;
    return endTime;
  };

  const setAdjustedTime = (startTime, endTime, minTime, maxTime) => {
    let adjustedStartTime;
    let adjustedEndTime;

    if (isCounterClockwise(startTime, endTime)) {
      adjustedStartTime = Math.max(endTime, minTime) - TIME_UNIT;
      adjustedEndTime = startTime + TIME_UNIT;
    } else {
      adjustedStartTime = startTime;
      adjustedEndTime = Math.max(endTime, minTime);
    }

    if (isOutOfRange(adjustedStartTime, adjustedEndTime, minTime, maxTime)) return;

    setStartTime(adjustedStartTime);
    setEndTime(adjustedEndTime);
  };

  const onMouseDown = (mouseDownEvent) => {
    initTime();
    const { target } = mouseDownEvent;
    const { x, y } = getCoordinatesInCanvas(mouseDownEvent);
    const startTime = getTimeByCoordinates(x, y);
    if (isFilled(startTime)) return;

    const [minTime, maxTime] = getMovableRange(startTime);
    setStartTime(startTime);

    const onMouseMove = (event) => {
      const endTime = getEndTimeByEvent(event);
      setAdjustedTime(startTime, endTime, minTime, maxTime);
    };

    const onMouseUp = (event) => {
      target.removeEventListener('mousemove', onMouseMove);
      const endTime = getEndTimeByEvent(event);
      setAdjustedTime(startTime, endTime, minTime, maxTime);
    };

    const onClick = () => target.removeEventListener('mouseup', onMouseUp);

    target.addEventListener('mousemove', onMouseMove);
    target.addEventListener('mouseup', onMouseUp);
    target.addEventListener('click', onClick);
  };

  useEffect(() => {
    if (!currentStartTime || !currentEndTime) return;

    clearCanvas(context);
    drawCircularSectorByTime(context, currentStartTime, currentEndTime, COLOR.primaryColor);
  }, [currentStartTime, currentEndTime]);

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
