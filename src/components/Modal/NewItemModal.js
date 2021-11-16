import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { useRecoilState } from 'recoil';
import Modal from './Modal';
import { Box, Button, Input } from './Modal.style';
import { scheduleState } from '../../recoil/schedule';
import { setSchedulesIntoLocalStorage } from '../../utils/utils';

const NewItemModal = ({ startTime, endTime, setModalOpen }) => {
  const [schedules, setSchedules] = useRecoilState(scheduleState);
  const [name, setName] = useState('');

  const getNewSchedule = () => ({
    id: uniqid('schdule_'),
    name,
    startMin: startTime,
    endMin: endTime,
  });

  const onChange = (event) => {
    setName(event.target.value);
  };

  const onClick = () => {
    const newSchedule = getNewSchedule();
    const newSchedules = [...schedules, newSchedule];
    setSchedulesIntoLocalStorage(newSchedules);
    setSchedules(newSchedules);
    setModalOpen(false);
  };

  return (
    <Modal>
      <Box>
        <h1>Add new schedule!</h1>
        <Input
          maxLength="30"
          placeholder="Type new todo up to 30 characters"
          value={name}
          onChange={onChange}
        />
        <Button type="button" onClick={onClick}>add</Button>
      </Box>
    </Modal>
  );
};

NewItemModal.propTypes = {
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

export default NewItemModal;
