/* eslint-disable import/prefer-default-export */
import { atom } from 'recoil';
import { RECOIL_KEY } from './Key';

export const scheduleState = atom({
  key: RECOIL_KEY.schedule.state,
  default: [],
});
