import { beforeAll, describe, expect, it, vi } from "vitest";
import { dragFix } from "helpers/dragFix";

const DragEventMock = vi.fn(() => ({
  prototype: vi.fn(),
}))

vi.stubGlobal('DragEvent', DragEventMock)


describe("dragFix testing", () => {
  let mockDragEvent; 

  beforeAll(() => {
    // Create a mock DragEvent constructor
    mockDragEvent = function(type, eventInitDict) {
      Object.defineProperty(this, 'clientX', { value: 100 });
      Object.defineProperty(this, 'clientY', { value: 200 });
      Object.defineProperty(this, 'pageX', { value: 300 });
      Object.defineProperty(this, 'pageY', { value: 400 });
      Object.defineProperty(this, 'offsetX', { value: 500 });
      Object.defineProperty(this, 'offsetY', { value: 600 });
      Object.defineProperty(this, 'screenX', { value: 700 });
      Object.defineProperty(this, 'screenY', { value: 800 });
      Object.defineProperty(this, 'x', { value: 900 });
      Object.defineProperty(this, 'y', { value: 1000 });
      Object.defineProperty(this, 'layerX', { value: 1100 });
      Object.defineProperty(this, 'layerY', { value: 1200 });
      Object.defineProperty(this, 'type', { value: type });
      Object.defineProperty(this, 'initEvent', {
        value: () => {
          return undefined;
        }
      });
    };

    // Attach Object.defineProperties to window.DragEvent.prototype
    dragFix();
  });

  it('should return the expected values for the getter functions', () => {
    const dragEvent = new mockDragEvent('drag');

    expect(dragEvent.clientX).toEqual(100);
    expect(dragEvent.clientY).toEqual(200);
    expect(dragEvent.pageX).toEqual(300);
    expect(dragEvent.pageY).toEqual(400);
    expect(dragEvent.offsetX).toEqual(500);
    expect(dragEvent.offsetY).toEqual(600);
    expect(dragEvent.screenX).toEqual(700);
    expect(dragEvent.screenY).toEqual(800);
    expect(dragEvent.x).toEqual(900);
    expect(dragEvent.y).toEqual(1000);
    expect(dragEvent.layerX).toEqual(1100);
    expect(dragEvent.layerY).toEqual(1200);
  });
});
