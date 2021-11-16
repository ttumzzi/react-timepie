import { useState } from 'react';
import { useRecoilState } from 'recoil';
import useCanvas from '../../hook/useCanvas';
import { scheduleState } from '../../recoil/schedule';
import { clearCanvas, drawCircularSector } from '../../utils/canvas';
import {
  CANVAS_MIDDLE, CANVAS_SIZE, HOUR_PARTITION, THETA,
} from '../../utils/canvas_constant';
import { getAngleMovement, isClockwise } from '../../utils/vector';
import NewItemModal from '../Modal/NewItemModal';
import * as Styled from './Main.style';

const NewCircularSector = () => {
  const TIME_UNIT = 60 / HOUR_PARTITION;
  const [canvas, context] = useCanvas();
  const [schedule, setSchedule] = useRecoilState(scheduleState);
  const [isModalOpen, setModalOpen] = useState(false);

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
    const angle = Math.atan(x / y);

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
    return [minimum, maximum];
  };

  const draw = (startAngle, endAngle, clockwise = true) => {
    clearCanvas(context);
    drawCircularSector(context, startAngle, endAngle, clockwise);
  };

  const move = ((startX, startY, endX, endY, minAngle, maxAngle) => {
    const clockwise = isClockwise(startX, startY, endX, endY);
    const angleMovement = getAngleMovement(startX, startY, endX, endY, clockwise);

    const startAngle = getAngleByCoordinates(startX, startY);
    let endAngle = startAngle + angleMovement * (clockwise ? 1 : -1);
    if (endAngle > 2 * Math.PI) endAngle -= 2 * Math.PI;
    if (endAngle < 0) endAngle += 2 * Math.PI;

    if (schedule.length === 0) {
      draw(startAngle, endAngle + (clockwise ? THETA : 0), clockwise);
      return;
    }

    if (clockwise) {
      if (minAngle > maxAngle) {
        if (startAngle > endAngle) {
          if (startAngle >= 0 && startAngle <= maxAngle) {
            draw(startAngle, maxAngle, clockwise);
            return;
          }
          draw(startAngle, Math.min(endAngle, maxAngle - THETA) + THETA, clockwise);
          return;
        }
        if (startAngle > minAngle && startAngle <= Math.PI * 2) {
          draw(startAngle, endAngle + THETA, clockwise);
          return;
        }
        draw(startAngle, Math.min(endAngle, maxAngle - THETA) + THETA, clockwise);
        return;
      }

      if (startAngle > endAngle) {
        draw(startAngle, maxAngle, clockwise);
        return;
      }

      if (endAngle > minAngle && endAngle < maxAngle) {
        draw(startAngle, Math.min(endAngle, maxAngle) + THETA, clockwise);
        return;
      }

      draw(startAngle, maxAngle, clockwise);
      return;
    }

    if (minAngle > maxAngle) {
      if (startAngle < endAngle) {
        if (startAngle >= minAngle && startAngle <= 2 * Math.PI) {
          draw(startAngle, minAngle, clockwise);
          return;
        }
        draw(startAngle, Math.max(endAngle, minAngle), clockwise);
        return;
      }
      if (startAngle >= 0 && startAngle < maxAngle) {
        draw(startAngle, endAngle, clockwise);
        return;
      }
      draw(startAngle, Math.max(endAngle, minAngle), clockwise);
      return;
    }

    if (startAngle < endAngle) {
      draw(startAngle, minAngle, clockwise);
      return;
    }

    if (endAngle > minAngle && endAngle < maxAngle) {
      draw(startAngle, Math.max(endAngle, minAngle), clockwise);
      return;
    }
    draw(startAngle, minAngle, clockwise);
  });

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
      const endAngle = getAngleByCoordinates(endX, endY);

      if (startAngle === endAngle) return;

      move(startX, startY, endX, endY, minAngle, maxAngle);
    };

    const onMouseUp = (event) => {
      target.removeEventListener('mousemove', onMouseMove);
      const { x: endX, y: endY } = getCoordinatesInCanvas(event);
      const endAngle = getAngleByCoordinates(endX, endY);

      if (startAngle === endAngle) {
        console.log({ startAngle, endAngle });
        draw(startAngle + THETA, endAngle + THETA, true);
        return;
      }
      move(startX, startY, endX, endY, minAngle, maxAngle);

      setModalOpen(true);
    };

    const onClick = () => target.removeEventListener('mouseup', onMouseUp);

    target.addEventListener('mousemove', onMouseMove);
    target.addEventListener('mouseup', onMouseUp);
    target.addEventListener('click', onClick);
  };

  return (
    <>
      <Styled.Canvas
        ref={canvas}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onMouseDown={onMouseDown}
      />
      {isModalOpen ? <NewItemModal setModalOpen={setModalOpen} /> : ''}
    </>
  );
};

export default NewCircularSector;
