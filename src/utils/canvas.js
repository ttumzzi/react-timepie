import {
  CANVAS_MIDDLE, CANVAS_SIZE, HOUR_PARTITION, RADIUS,
} from './canvas_constant';
import { getColorById } from './utils';

export const clearCanvas = (context) => {
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
};

/* eslint-disable import/prefer-default-export */
export const drawCircularSectorByTime = (context, startMin, endMin) => {
  const HOUR24_TO_MIN = 24 * 60;
  const angleOffset = Math.PI * (3 / 2);

  const adjustedEndMin = startMin === endMin ? endMin + (60 / HOUR_PARTITION) : endMin;
  const startAngle = (startMin / HOUR24_TO_MIN) * (Math.PI * 2) + angleOffset;
  const endAngle = (adjustedEndMin / 720) * Math.PI + angleOffset;

  context.fillStyle = getColorById(startMin);
  context.beginPath();
  context.moveTo(CANVAS_MIDDLE, CANVAS_MIDDLE);
  context.arc(CANVAS_MIDDLE, CANVAS_MIDDLE, RADIUS, startAngle, endAngle, false);
  context.fill();
};
