/* eslint-disable import/export */
import "@testing-library/jest-dom";
import { expect, afterEach } from "vitest";
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';
import matchers from "@testing-library/jest-dom/matchers";
import ResizeObserver from 'resize-observer-polyfill';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  });

// To make sure that the tests are working, it's important that you are using
// this implementation of ResizeObserver and DOMMatrixReadOnly


export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };

export { fireEvent as fireEvent };
export { waitFor as waitFor };
