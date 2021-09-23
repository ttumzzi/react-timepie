/* eslint-disable import/prefer-default-export */
import { atom } from 'recoil';
import { RECOIL_KEY } from './Key';

export const scheduleState = atom({
  key: RECOIL_KEY.SHCEDULE.STATE,
  default: [
    {
      id: 1,
      name: 'sleep',
      startMin: 1320, // 22:00
      endMin: 360, // 6:00
    },
    {
      id: 2,
      name: 'workout',
      startMin: 620, // 10:20
      endMin: 670, // 11: 10
    },
    {
      id: 3,
      name: 'play with puppy💜',
      startMin: 870, // 14:30
      endMin: 890, // 14:50
    },
  ],
});
