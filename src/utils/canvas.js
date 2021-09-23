import {
  CANVAS_MIDDLE, CANVAS_SIZE, HOUR_PARTITION, RADIUS, THETA,
} from './canvas_constant';
import { getColorById } from './utils';

export const clearCanvas = (context) => {
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
};

export const drawCircularSectorByTime = (context, startMin, endMin, color = null) => {
  console.log({ startMin, endMin });
  const HOUR24_TO_MIN = 24 * 60;
  const angleOffset = Math.PI * (3 / 2);

  const adjustedEndMin = startMin === endMin ? endMin + (60 / HOUR_PARTITION) : endMin;
  const startAngle = (startMin / HOUR24_TO_MIN) * (Math.PI * 2) + angleOffset;
  const endAngle = (adjustedEndMin / 720) * Math.PI + angleOffset;

  context.fillStyle = color || getColorById(startMin);
  context.beginPath();
  context.moveTo(CANVAS_MIDDLE, CANVAS_MIDDLE);
  context.arc(CANVAS_MIDDLE, CANVAS_MIDDLE, RADIUS, startAngle, endAngle, false);
  context.fill();
};

export const getTimeByCoordinates = (x, y) => {
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

export const getCoordinatesInCanvas = ({ clientX, clientY, target }) => {
  const x = clientX - target.getBoundingClientRect().left;
  const y = clientY - target.getBoundingClientRect().top;
  return { x, y };
};
