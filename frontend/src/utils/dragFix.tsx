// @ts-nocheck

export function dragFix() {
  // patch for Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  var cx, cy, px, py, ox, oy, sx, sy, lx, ly;
  function update(e) {
    cx = e.clientX;
    cy = e.clientY;
    px = e.pageX;
    py = e.pageY;
    ox = e.offsetX;
    oy = e.offsetY;
    sx = e.screenX;
    sy = e.screenY;
    lx = e.layerX;
    ly = e.layerY;
  }
  function assign(e) {
    e._ffix_cx = cx;
    e._ffix_cy = cy;
    e._ffix_px = px;
    e._ffix_py = py;
    e._ffix_ox = ox;
    e._ffix_oy = oy;
    e._ffix_sx = sx;
    e._ffix_sy = sy;
    e._ffix_lx = lx;
    e._ffix_ly = ly;
  }
  window.addEventListener("mousemove", update, true);
  window.addEventListener("dragover", update, true);
  // bug #505521 identifies these three listeners as problematic:
  // (although tests show 'dragstart' seems to work now, keep to be compatible)
  window.addEventListener("dragstart", assign, true);
  window.addEventListener("drag", assign, true);
  window.addEventListener("dragend", assign, true);

  var me = Object.getOwnPropertyDescriptors(window.MouseEvent.prototype),
    ue = Object.getOwnPropertyDescriptors(window.UIEvent.prototype);
  function getter(prop, repl) {
    return function () {
      return (me[prop] && me[prop].get!.call(this)) || Number(this[repl]) || 0;
    };
  }
  function layerGetter(prop, repl) {
    return function () {
      return this.type === "dragover" && ue[prop]
        ? ue[prop].get!.call(this)
        : Number(this[repl]) || 0;
    };
  }
  Object.defineProperties(window.DragEvent.prototype, {
    clientX: { get: getter("clientX", "_ffix_cx") },
    clientY: { get: getter("clientY", "_ffix_cy") },
    pageX: { get: getter("pageX", "_ffix_px") },
    pageY: { get: getter("pageY", "_ffix_py") },
    offsetX: { get: getter("offsetX", "_ffix_ox") },
    offsetY: { get: getter("offsetY", "_ffix_oy") },
    screenX: { get: getter("screenX", "_ffix_sx") },
    screenY: { get: getter("screenY", "_ffix_sy") },
    x: { get: getter("x", "_ffix_cx") },
    y: { get: getter("y", "_ffix_cy") },
    layerX: { get: layerGetter("layerX", "_ffix_lx") },
    layerY: { get: layerGetter("layerY", "_ffix_ly") },
  });
}
