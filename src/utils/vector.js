const getAngleByInnerProduct = (x1, y1, x2, y2) => {
  const numerator = x1 * x2 + y1 * y2;
  const denominator = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2);
  return Math.acos(numerator / denominator);
};

export const getAngleMovement = (x1, y1, x2, y2, clockwise = true) => {
  let rotatedX1;
  let rotatedY1;

  if (clockwise) {
    rotatedX1 = -y1;
    rotatedY1 = x1;
  } else {
    rotatedX1 = y1;
    rotatedY1 = -x1;
  }

  const rotatedAngle = getAngleByInnerProduct(rotatedX1, rotatedY1, x2, y2);
  const angle = getAngleByInnerProduct(x1, y1, x2, y2);
  if (rotatedAngle > Math.PI / 2) {
    return angle;
  }
  return 2 * Math.PI - angle;
};

const getRotateAngle = (x1, y1, x2, y2) => {
  const numerator = x1 * y2 - y1 * x2;
  const denominator = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2);
  return Math.asin(numerator / denominator);
};

export const isClockwise = (() => {
  let clockwise = true;

  return (x1, y1, x2, y2) => {
    const rotateAngle = (getRotateAngle(x1, y1, x2, y2));
    const movement = (getAngleMovement(x1, y1, x2, y2) * 180) / Math.PI;

    if (rotateAngle < 0.5 && rotateAngle > -0.5) {
      if (movement < 170 || movement > 190) {
        clockwise = rotateAngle < 0;
      }
    }
    return clockwise;
  };
})();
