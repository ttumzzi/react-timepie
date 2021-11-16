const getColorById = (id) => {
  const colors = [
    '#52D08C',
    '#416BF0',
    '#16F27F',
    '#663AE6',
    '#6FE328',
    '#E1F9B6',
    '#616FF9',
    '#21C4DA',
    '#D448EC',
    '#473DE0',
    '#FF4560',
  ];
  const index = id % (colors.length);
  return colors[index];
};

const KEY = 'schedules';

const getSchdulesFromLocalStorage = () => {
  const item = localStorage.getItem(KEY);
  return JSON.parse(item);
};

const setSchedulesIntoLocalStorage = (schedules) => {
  const item = JSON.stringify(schedules);
  localStorage.setItem(KEY, item);
};

// eslint-disable-next-line import/prefer-default-export
export { getColorById, getSchdulesFromLocalStorage, setSchedulesIntoLocalStorage };
