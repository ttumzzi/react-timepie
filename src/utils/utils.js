const getColorById = (id) => {
  const colors = [
    '#F9E284',
    '#F9B6F0',
    '#E1F9B6',
    '#B6D8F9',
    '#B66FF9',
    '#616FF9',
    '#45DEAE',
    '#93E6E1',
    '#E69E93',
    '#E0B296',
    '#16F27F',
    '#2EBEE8',
    '#416BF0',
    '#D448EC',
  ];
  const index = id % (colors.length);
  return colors[index];
};

// eslint-disable-next-line import/prefer-default-export
export { getColorById };
