const getColorById = (id) => {
  const colors = [
    '#FFB246',
    '#52D08C',
    '#DE3F87',
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

// eslint-disable-next-line import/prefer-default-export
export { getColorById };
