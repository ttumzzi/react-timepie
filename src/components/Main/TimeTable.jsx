import { useRef, useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import { useRecoilState } from 'recoil';
import { CANVAS_SIZE } from '../../utils/canvas_constant';
import * as Styled from './Main.style';
import { scheduleState } from '../../recoil/SCHEDULE';
import { clearCanvas, drawCircularSectorByTime } from '../../utils/canvas';

const TimeTable = () => {
  const [schedule, setSchedule] = useRecoilState(scheduleState);

  const canvas = useRef(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (!context || !schedule) return;

    clearCanvas(context);
    schedule.forEach(({ startMin, endMin }) => {
      drawCircularSectorByTime(context, startMin, endMin);
    });
  }, [context, schedule]);

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

export default TimeTable;
