import styled from 'styled-components';
import logoImage from '../../assets/logo.png';

const Img = styled.img`
    height: 10%;
`;

const Logo = () => (
  <Img src={logoImage} alt="logo" />
);

export default Logo;
