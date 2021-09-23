import TimeTableSheet from './TimeTableSheet';
import TitleBar from './TitleBar';
import * as Styled from './Main.style';
import TimeTable from './TimeTable';

const Main = () => (
  <Styled.Main>
    <TitleBar />
    <TimeTableSheet />
    <TimeTable />
  </Styled.Main>
);

export default Main;
