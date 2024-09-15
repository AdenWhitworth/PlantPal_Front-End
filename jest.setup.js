import '@testing-library/jest-dom';

module.exports = {
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
      "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
      "^d3-scale$": "<rootDir>/__mocks__/chartMock.js"
    }
  };
  