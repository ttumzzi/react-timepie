import React from 'react';
import PropTypes from 'prop-types';
import { Outer } from './Modal.style';

const Modal = ({ children }) => (
  <Outer>
    {children}
  </Outer>
);

Modal.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Modal;
