module.exports = {
  timeHelper: preference => {
    if (preference == 1) {
      return '9AM - 11:30AM';
    } else if (preference == 2) {
      return '11:30AM - 2:30PM';
    } else return '2:30PM - 5:30PM';
  }
};
