import styled from 'styled-components';

const KeyContainer = styled.div`
  border: 3px solid
    ${props => (props.disabled ? props.theme.palette.text.disabled : props.theme.palette.primary.main)};
  border-radius: ${props => props.theme.shape.borderRadius}px;
  width: 50px;
  height: 45px;
`;

const KeyLetter = styled.div`
  padding: 7px;
  color: ${props => (props.disabled ? props.theme.palette.text.disabled : props.theme.palette.primary.light)};
  font-size: 1.7em;
  font-family: 'Roboto', 'Helvetica', 'Arial', 'sans-serif';
  text-align: center;
`;

export { KeyContainer, KeyLetter };
