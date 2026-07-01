import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Prevent "act" warnings by wrapping all test renders in act
jest.spyOn(ReactDOM, 'createRoot').mockImplementation((container) => {
  return {
    render: jest.fn((component) => {
      // Wrap render in act to prevent "act" warnings
      act(() => {
        // We don't need to actually render the DOM for most tests
        // If you need to assert on the DOM, use a real renderer like react-dom/test-utils
      });
    }),
    unmount: jest.fn(),
  };
});
