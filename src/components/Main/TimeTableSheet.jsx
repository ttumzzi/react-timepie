import { useEffect, useRef, useState } from 'react';
import * as Styled from './Main.style';
import COLOR from '../../utils/color';
import {
  CANVAS_SIZE, HOUR_PARTITION, PARTITION_COUNT, RADIUS, THETA, TIME_FONT_SIZE,
} from './canvas_constant';

const TimeTableSheet = () => {
  const canvas = useRef(null);
  const [context, setContext] = useState(null);

  const getCoordinatesFromRadius = (radius, theta) => {
    const x = CANVAS_SIZE / 2 + ((radius) * Math.sin(theta));
    const y = CANVAS_SIZE / 2 - ((radius) * Math.cos(theta));
    return { x, y };
  };

  const drawCircle = () => {
    context.beginPath();
    context.lineWidth = 0;
    context.fillStyle = '#f0f0f0';
    context.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, RADIUS, 0, Math.PI * 2, true);
    context.fill();
  };

  const drawDashLineAndTime = () => {
    context.strokeStyle = COLOR.lightGrey;
    context.fillStyle = '#bdbdbd';
    context.strokeStyle = 'white';
    context.font = `${TIME_FONT_SIZE} Fugaz One`;

    for (let i = 1; i <= PARTITION_COUNT; i += 1) {
      const { x, y } = getCoordinatesFromRadius(RADIUS, THETA * i);
      context.lineWidth = i % HOUR_PARTITION === 0 ? 1.5 : 0.5;
      context.beginPath();
      context.moveTo(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
      context.lineTo(x, y);
      context.stroke();

      // eslint-disable-next-line no-continue
      if (i % HOUR_PARTITION !== 0) continue;

      const time = i > (PARTITION_COUNT / 2)
        ? Math.ceil(i / HOUR_PARTITION) - 12
        : i / HOUR_PARTITION;
      const timeTextMeasure = context.measureText(time);
      const TIME_TEXT_MARGIN = 15;
      const TIME_TEXT_OFFSET = 7;
      const { x: timeX, y: timeY } = getCoordinatesFromRadius(RADIUS + TIME_TEXT_MARGIN, THETA * i);
      context.fillText(time, timeX - timeTextMeasure.width / 2, timeY + TIME_TEXT_OFFSET);
    }
  };

  const drawOutline = () => {
    if (!context) return;
    drawCircle();
    drawDashLineAndTime();
  };

  useEffect(() => {
    if (!context) return;

    drawOutline();
  }, [context]);

  useEffect(() => {
    if (!canvas) return;

    setContext(canvas.current.getContext('2d'));
  }, [canvas]);

  return (
    <Styled.Canvas
      ref={canvas}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
    />
  );
};

export default TimeTableSheet;
