import { RecoilRoot } from 'recoil';
import styled from 'styled-components';
import Aside from './components/Aside/Aside';
import Logo from './components/Header/Logo';
import Main from './components/Main/Main';
import Navigation from './components/Navigation/Navigation';
import COLOR from './utils/color';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  height: 88%;
  
  nav {
    flex: 1;
    min-width: 250px;
    background-color: ${COLOR.pointColor};
  }

  main {
    flex: 4;
    min-width: 800px;
  }

  aside {
    flex: 1;
    min-width: 250px;
    background-color: ${COLOR.pointColor};
  }
`;

function App() {
  return (
    <RecoilRoot>
      <AppContainer>
        <Logo />
        <ContentContainer>
          <Navigation />
          <Main />
          <Aside />
        </ContentContainer>
      </AppContainer>
    </RecoilRoot>
  );
}

export default App;
