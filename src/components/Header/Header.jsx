import styled from 'styled-components';

const H1 = styled.h1`
    font-family: 'Fugaz One', cursive;
    font-size: 48px;
    margin: 10px 20px;
`;

const Header = () => (
  <header>
    <H1>Time Pie</H1>
  </header>
);

export default Header;
