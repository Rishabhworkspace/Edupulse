import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  cleanup();
});

expect.extend({
  toHaveClasses(el, classes) {
    const actual = Array.from(el.classList);
    const expected = Array.isArray(classes) ? classes : classes.split(' ');
    const pass = expected.every(c => actual.includes(c));
    return {
      pass,
      message: () => `Expected element to have classes "${expected.join(', ')}"`
    };
  }
});