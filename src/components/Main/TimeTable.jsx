import { useRef, useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import { useRecoilState } from 'recoil';
import { CANVAS_SIZE } from '../../utils/canvas_constant';
import * as Styled from './Main.style';
import { scheduleState } from '../../recoil/schedule';
import { clearCanvas, draw } from '../../utils/canvas';
import useCanvas from '../../hook/useCanvas';

const TimeTable = () => {
  const [schedule, setSchedule] = useRecoilState(scheduleState);
  const [canvas, context] = useCanvas();

  useEffect(() => {
    if (!context || !schedule) return;

    clearCanvas(context);
    schedule.forEach(({ startAngle, endAngle }) => {
      draw(context, startAngle, endAngle);
    });
  }, [context, schedule]);

  return (
    <Styled.Canvas
      ref={canvas}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
    />
  );
};

export default TimeTable;
