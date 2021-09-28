import { useRecoilState } from 'recoil';
import useCanvas from '../../hook/useCanvas';
import { scheduleState } from '../../recoil/SCHEDULE';
import { clearCanvas, drawCircularSector } from '../../utils/canvas';
import {
  CANVAS_MIDDLE, CANVAS_SIZE, HOUR_PARTITION, THETA,
} from '../../utils/canvas_constant';
import { getAngleMovement, isClockwise } from '../../utils/vector';
import * as Styled from './Main.style';

const NewCircularSector = () => {
  const TIME_UNIT = 60 / HOUR_PARTITION;
  const [canvas, context] = useCanvas();
  const [schedule, setSchedule] = useRecoilState(scheduleState);

  const getAngleByMinutes = (minutes) => (minutes / TIME_UNIT) * THETA;

  const isFilled = (angle) => {
    let isFilledFlag = false;

    schedule.forEach(({ startMin, endMin }) => {
      const startAngle = getAngleByMinutes(startMin);
      const endAngle = getAngleByMinutes(endMin);
      if (angle >= startAngle && angle < endAngle) isFilledFlag = true;
      if (startAngle > endAngle && (angle >= startAngle || angle < endAngle)) isFilledFlag = true;
    });

    return isFilledFlag;
  };

  const getAngleByCoordinates = (x, y) => {
    const angle = Math.floor(Math.atan(x / y) / THETA) * THETA;

    if (x >= 0 && y >= 0) {
      return angle;
    }
    if (x >= 0 && y <= 0) {
      return Math.PI + angle;
    }
    if (x < 0 && y < 0) {
      return Math.PI + angle;
    }
    if (x <= 0 && y >= 0) {
      return 2 * Math.PI + angle;
    }
    return 0;
  };

  const getCoordinatesInCanvas = ({ clientX, clientY, target }) => {
    const x = (clientX - target.getBoundingClientRect().left) - CANVAS_MIDDLE;
    const y = CANVAS_MIDDLE - (clientY - target.getBoundingClientRect().top);
    return { x, y };
  };

  const getMovableRange = (angle) => {
    let minimum = 0;
    let maximum = 2 * Math.PI;

    schedule.forEach(({ startMin, endMin }) => {
      const startAngle = getAngleByMinutes(startMin);
      const endAngle = getAngleByMinutes(endMin);
      if (endAngle <= angle && endAngle > minimum) minimum = endAngle;
      if (startAngle >= angle && startAngle < maximum) maximum = startAngle;
    });

    if (minimum === 0) {
      minimum = schedule.reduce((acc, { endMin }) => {
        const endAngle = getAngleByMinutes(endMin);
        return (acc < endAngle ? endAngle : acc);
      }, 0);
    }
    if (maximum === 2 * Math.PI) {
      maximum = schedule.reduce((acc, { startMin }) => {
        const startAngle = getAngleByMinutes(startMin);
        return (acc > startAngle ? startAngle : acc);
      }, 2 * Math.PI);
    }

    if (minimum > maximum) maximum += Math.PI * 2;

    return [minimum, maximum];
  };

  const draw = (startAngle, endAngle, clockwise = true) => {
    clearCanvas(context);
    drawCircularSector(context, startAngle, endAngle, clockwise);
  };

  const move = (startX, startY, endX, endY, minAngle, maxAngle) => {
    const startAngle = getAngleByCoordinates(startX, startY);
    const clockwise = isClockwise(startX, startY, endX, endY);
    const angleMovement = getAngleMovement(startX, startY, endX, endY, clockwise);

    let adjustedStartAngle = startAngle;
    let adjustedEndAngle = startAngle + angleMovement * (clockwise ? 1 : -1);

    if (clockwise) {
      adjustedStartAngle = Math.max(adjustedStartAngle, minAngle);
      adjustedEndAngle = Math.min(adjustedEndAngle, maxAngle - THETA);
    } else {
      adjustedEndAngle = Math.max(adjustedEndAngle, minAngle + THETA);
    }

    draw(adjustedStartAngle, adjustedEndAngle, clockwise);
  };

  const onMouseDown = (mouseDownEvent) => {
    const { target } = mouseDownEvent;
    const { x: startX, y: startY } = getCoordinatesInCanvas(mouseDownEvent);
    const startAngle = getAngleByCoordinates(startX, startY);
    if (isFilled(startAngle)) {
      return;
    }

    const [minAngle, maxAngle] = getMovableRange(startAngle);

    const onMouseMove = (event) => {
      const { x: endX, y: endY } = getCoordinatesInCanvas(event);
      move(startX, startY, endX, endY, minAngle, maxAngle);
    };

    const onMouseUp = (event) => {
      target.removeEventListener('mousemove', onMouseMove);
      const { x: endX, y: endY } = getCoordinatesInCanvas(event);
      move(startX, startY, endX, endY, minAngle, maxAngle);
    };

    const onClick = () => target.removeEventListener('mouseup', onMouseUp);

    target.addEventListener('mousemove', onMouseMove);
    target.addEventListener('mouseup', onMouseUp);
    target.addEventListener('click', onClick);
  };

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
