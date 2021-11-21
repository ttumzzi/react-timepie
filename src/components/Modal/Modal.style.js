import styled from 'styled-components';
import COLOR from '../../utils/color';

export const Outer = styled.div`
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
position: absolute;
left: 0;
top: 0;
`;

export const Box = styled.form`
width: 500px;
height: 300px;
position: absolute;
left: 50%;
top: 50%;
background-color: white;
transform: translate(-50%, -50%);
border-radius: 30px;
box-shadow: 5px 5px 30px rgba(0,0,0,0.5);
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-evenly;
`;

export const Input = styled.input`
width: 70%;
outline: none;
border: none;
border-bottom: 2px solid ${COLOR.lightGrey};
padding: 10px;
margin: 0;
font-size: 20px;
text-align: center;

&:focus {
  border-bottom: 2px solid ${COLOR.primaryColor};
}
`;

export const Button = styled.button`
border: none;
background-color: ${COLOR.primaryColor};
padding: 10px 50px;
border-radius: 10px;
font-size: 16px;
color: white;
cursor: pointer;
`;
