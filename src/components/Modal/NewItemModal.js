import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { useRecoilState } from 'recoil';
import Modal from './Modal';
import { Box, Button, Input } from './Modal.style';
import { scheduleState } from '../../recoil/schedule';
import { setSchedulesIntoLocalStorage } from '../../utils/utils';

const NewItemModal = ({ addCallback }) => {
  const [name, setName] = useState('');

  const onChange = (event) => {
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    addCallback(name);
  };

  return (
    <Modal>
      <Box onSubmit={onSubmit}>
        <h1>Add new schedule!</h1>
        <Input
          autoFocus
          maxLength="30"
          placeholder="Type new todo up to 30 characters"
          value={name}
          onChange={onChange}
        />
        <Button type="submit">add</Button>
      </Box>
    </Modal>
  );
};

NewItemModal.propTypes = {
  addCallback: PropTypes.func.isRequired,
};

export default NewItemModal;
