import {
  CANVAS_MIDDLE, CANVAS_SIZE, HOUR_PARTITION, RADIUS, THETA,
} from './canvas_constant';
import COLOR from './color';
import { getColorById } from './utils';

export const clearCanvas = (context) => {
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
};

export const drawCircularSectorByTime = (context, startMin, endMin, color = null) => {
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

export const drawCircularSector = (context,
  startAngle,
  endAngle,
  isClockwise,
  color = COLOR.primaryColor) => {
  const offsetAngle = Math.PI * (3 / 2);
  const newStartAngle = Math.ceil((startAngle + offsetAngle) / THETA) * THETA
  + THETA * (isClockwise ? 0 : 1);
  const newEndAngle = Math.ceil((endAngle + offsetAngle) / THETA) * THETA
  + THETA * (isClockwise ? 1 : -1);
  context.fillStyle = color || getColorById(startAngle);
  context.beginPath();
  context.moveTo(CANVAS_MIDDLE, CANVAS_MIDDLE);
  context.arc(CANVAS_MIDDLE, CANVAS_MIDDLE, RADIUS, newStartAngle, newEndAngle, !isClockwise);
  context.fill();
};
