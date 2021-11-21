import { useState } from 'react';
import { useRecoilState } from 'recoil';
import uniqid from 'uniqid';
import useCanvas from '../../hook/useCanvas';
import { scheduleState } from '../../recoil/schedule';
import { clearCanvas, draw } from '../../utils/canvas';
import {
  CANVAS_MIDDLE, CANVAS_SIZE, THETA,
} from '../../utils/canvas_constant';
import COLOR from '../../utils/color';
import { setSchedulesIntoLocalStorage } from '../../utils/utils';
import { getAngleMovement } from '../../utils/vector';
import NewItemModal from '../Modal/NewItemModal';
import * as Styled from './Main.style';

const NewCircularSector = () => {
  const [canvas, context] = useCanvas();
  const [schedules, setSchedules] = useRecoilState(scheduleState);
  const [isModalOpen, setModalOpen] = useState(false);
  const [arc, setArc] = useState(null);

  const getAngle = (x, y) => {
    const angle = Math.atan(x / y);
    let adjustedAngle;

    if (x >= 0 && y >= 0) adjustedAngle = angle;
    else if (x >= 0 && y <= 0) adjustedAngle = Math.PI + angle;
    else if (x < 0 && y < 0) adjustedAngle = Math.PI + angle;
    else if (x <= 0 && y >= 0) adjustedAngle = 2 * Math.PI + angle;
    else adjustedAngle = 0;

    return Math.floor((adjustedAngle) / THETA) * THETA + THETA;
  };

  const getCoordinates = ({ clientX, clientY, target }) => {
    const x = (clientX - target.getBoundingClientRect().left) - CANVAS_MIDDLE;
    const y = CANVAS_MIDDLE - (clientY - target.getBoundingClientRect().top);
    return { x, y };
  };

  const getClockwise = (x1, y1, x2, y2) => {
    const angle = getAngleMovement(x1, y1, x2, y2);
    return angle < Math.PI;
  };

  const drawSector = (startAngle, endAngle, isClockwise) => {
    clearCanvas(context);
    draw(context, startAngle, endAngle, isClockwise, COLOR.primaryColor);
  };

  const isFilled = (angle) => schedules.reduce((acc, { startAngle: start, endAngle: end }) => {
    const TWO_PIE = Math.PI * 2;
    if ((angle > (start - THETA) && angle < (end + THETA))
      || (TWO_PIE + angle > (start - THETA) && TWO_PIE + angle < (end + THETA))) {
      return true;
    }
    return acc;
  }, false);

  const onMouseDown = (mouseDownEvent) => {
    const { target } = mouseDownEvent;
    const { x: startX, y: startY } = getCoordinates(mouseDownEvent);
    const startAngle = getAngle(startX, startY);
    setArc({ startAngle });

    if (isFilled(startAngle)) {
      return;
    }

    let lastEndX = startX;
    let lastEndY = startY;
    let lastAngleMovement;
    let isClockwise = null;

    let isClockwiseInEntry = null;
    let isMovable = true;
    let entryAngle = null;

    const lockMove = (angle) => {
      if (!isMovable) return;

      schedules.forEach(({ startAngle: start, endAngle: end }) => {
        const TWO_PIE = Math.PI * 2;
        if ((angle > (start - THETA) && angle < (end + THETA))
        || (TWO_PIE + angle > (start - THETA) && TWO_PIE + angle < (end + THETA))) {
          const adjustedEnd = end >= TWO_PIE ? end - TWO_PIE : end;
          isMovable = false;
          isClockwiseInEntry = isClockwise;
          entryAngle = isClockwise ? start : adjustedEnd;
        }
      });
    };

    const unlockMove = (angle) => {
      if (Math.abs(entryAngle - angle) >= 0.1) {
        return;
      }
      isMovable = true;
    };

    const move = (event) => {
      const { x: endX, y: endY } = getCoordinates(event);
      const endAngle = getAngle(endX, endY);

      lockMove(endAngle);

      if (!isMovable) {
        unlockMove(endAngle);
      } else {
        const currentAngleMovement = endAngle - startAngle;

        if (currentAngleMovement * lastAngleMovement <= 0) {
          isClockwise = null;
        }
        if (isClockwise === null) {
          isClockwise = getClockwise(lastEndX, lastEndY, endX, endY);
        }

        drawSector(startAngle, endAngle, isClockwise);

        lastAngleMovement = currentAngleMovement;
      }

      const { type } = event;
      if (type === 'mousemove') {
        lastEndX = endX;
        lastEndY = endY;
      } else {
        target.removeEventListener('mousemove', move);
        setArc({ startAngle, endAngle, isClockwise });
        setModalOpen(true);
      }
    };

    target.addEventListener('mousemove', move);
    target.addEventListener('mouseup', move);
  };

  const addCallback = (scheduleTitle) => {
    const { startAngle: start, endAngle: end, isClockwise } = arc;
    let startAngle;
    let endAngle;

    if (isClockwise) {
      startAngle = start;
      endAngle = start > end ? (end + 2 * Math.PI) : end;
    } else {
      startAngle = end;
      endAngle = end > start ? (start + 2 * Math.PI) : start;
    }

    const newSchedule = {
      id: uniqid('schedule_'),
      name: scheduleTitle,
      startAngle,
      endAngle,
    };
    const newSchedules = [...schedules, newSchedule];

    setSchedulesIntoLocalStorage(newSchedules);
    setSchedules(newSchedules);
    setModalOpen(false);

    clearCanvas(context);
    setArc(null);
  };

  return (
    <>
      <Styled.Canvas
        ref={canvas}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onMouseDown={onMouseDown}
      />
      {isModalOpen ? (
        <NewItemModal
          setModalOpen={setModalOpen}
          startAngle={arc.startAngle}
          endAngle={arc.endAngle}
          isClockwise={arc.isClockwise}
          addCallback={addCallback}
        />
      ) : ''}
    </>
  );
};

export default NewCircularSector;
