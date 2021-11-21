import {
  CANVAS_MIDDLE, CANVAS_SIZE, HOUR_PARTITION, RADIUS, THETA,
} from './canvas_constant';
import { getColor } from './utils';

export const clearCanvas = (context) => {
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
};

export const draw = (context,
  startAngle,
  endAngle,
  isClockwise = true,
  color) => {
  const colorId = Math.floor(startAngle * 100);
  context.fillStyle = color || getColor(colorId);

  const offsetAngle = Math.PI / 2;
  const adjustedStartAngle = startAngle + THETA * (isClockwise ? -1 : 0) - offsetAngle;
  const adjustedEndAngle = endAngle + THETA * (isClockwise ? 0 : -1) - offsetAngle;

  context.beginPath();
  context.moveTo(CANVAS_MIDDLE, CANVAS_MIDDLE);
  context.arc(CANVAS_MIDDLE, CANVAS_MIDDLE, RADIUS,
    adjustedStartAngle, adjustedEndAngle, !isClockwise);
  context.fill();
};
