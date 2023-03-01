import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { dragFix } from "helpers/dragFix";

describe("dragFix()", () => {
  beforeAll(() => {
    // Mock event listeners
    window.addEventListener = jest.fn();
  });

  afterEach(() => {
    // Clear mock implementations and reset mock event listeners
    jest.clearAllMocks();
  });

  it("should update the event properties", () => {
    // Set up a mock MouseEvent
    const mockMouseEvent = {
      clientX: 10,
      clientY: 20,
      pageX: 30,
      pageY: 40,
      offsetX: 50,
      offsetY: 60,
      screenX: 70,
      screenY: 80,
      layerX: 90,
      layerY: 100,
    };

    // Call the function
    dragFix();

    // Simulate a mousemove event
    window.dispatchEvent(new MouseEvent("mousemove", mockMouseEvent));

    // Verify that the event properties were updated
    expect(mockMouseEvent._ffix_cx).toBe(mockMouseEvent.clientX);
    expect(mockMouseEvent._ffix_cy).toBe(mockMouseEvent.clientY);
    expect(mockMouseEvent._ffix_px).toBe(mockMouseEvent.pageX);
    expect(mockMouseEvent._ffix_py).toBe(mockMouseEvent.pageY);
    expect(mockMouseEvent._ffix_ox).toBe(mockMouseEvent.offsetX);
    expect(mockMouseEvent._ffix_oy).toBe(mockMouseEvent.offsetY);
    expect(mockMouseEvent._ffix_sx).toBe(mockMouseEvent.screenX);
    expect(mockMouseEvent._ffix_sy).toBe(mockMouseEvent.screenY);
    expect(mockMouseEvent._ffix_lx).toBe(mockMouseEvent.layerX);
    expect(mockMouseEvent._ffix_ly).toBe(mockMouseEvent.layerY);
  });

  it("should assign the event properties", () => {
    // Set up a mock DragEvent
    const mockDragEvent = {};

    // Call the function
    dragFix();

    // Simulate a dragstart event
    window.dispatchEvent(new DragEvent("dragstart", mockDragEvent));

    // Verify that the event properties were assigned
    expect(mockDragEvent._ffix_cx).toBeDefined();
    expect(mockDragEvent._ffix_cy).toBeDefined();
    expect(mockDragEvent._ffix_px).toBeDefined();
    expect(mockDragEvent._ffix_py).toBeDefined();
    expect(mockDragEvent._ffix_ox).toBeDefined();
    expect(mockDragEvent._ffix_oy).toBeDefined();
    expect(mockDragEvent._ffix_sx).toBeDefined();
    expect(mockDragEvent._ffix_sy).toBeDefined();
    expect(mockDragEvent._ffix_lx).toBeDefined();
    expect(mockDragEvent._ffix_ly).toBeDefined();
  });

  // Add more test cases as needed
});
