const randomOTP = () => {
  return Math.floor(Math.random() * 899999) + 100000;
};
export { randomOTP };
