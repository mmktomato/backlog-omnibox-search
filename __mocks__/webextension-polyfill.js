module.exports = {
  history: {
    search: jest.fn(() => new Promise((resolve, reject) => reject())),
  }
};
