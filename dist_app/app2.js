var U = /* @__PURE__ */ ((i) => (i.Application = "application", i.WebGLPipes = "webgl-pipes", i.WebGLPipesAdaptor = "webgl-pipes-adaptor", i.WebGLSystem = "webgl-system", i.WebGPUPipes = "webgpu-pipes", i.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", i.WebGPUSystem = "webgpu-system", i.CanvasSystem = "canvas-system", i.CanvasPipesAdaptor = "canvas-pipes-adaptor", i.CanvasPipes = "canvas-pipes", i.Asset = "asset", i.LoadParser = "load-parser", i.ResolveParser = "resolve-parser", i.CacheParser = "cache-parser", i.DetectionParser = "detection-parser", i.MaskEffect = "mask-effect", i.BlendMode = "blend-mode", i.TextureSource = "texture-source", i.Environment = "environment", i.ShapeBuilder = "shape-builder", i.Batcher = "batcher", i))(U || {});
const mi = (i) => {
  if (typeof i == "function" || typeof i == "object" && i.extension) {
    if (!i.extension)
      throw new Error("Extension class must have an extension object");
    i = { ...typeof i.extension != "object" ? { type: i.extension } : i.extension, ref: i };
  }
  if (typeof i == "object")
    i = { ...i };
  else
    throw new Error("Invalid extension type");
  return typeof i.type == "string" && (i.type = [i.type]), i;
}, Xe = (i, t) => mi(i).priority ?? t, bt = {
  /** @ignore */
  _addHandlers: {},
  /** @ignore */
  _removeHandlers: {},
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed.
   * @returns {extensions} For chaining.
   */
  remove(...i) {
    return i.map(mi).forEach((t) => {
      t.type.forEach((e) => this._removeHandlers[e]?.(t));
    }), this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {extensions} For chaining.
   */
  add(...i) {
    return i.map(mi).forEach((t) => {
      t.type.forEach((e) => {
        const s = this._addHandlers, r = this._queue;
        s[e] ? s[e]?.(t) : (r[e] = r[e] || [], r[e]?.push(t));
      });
    }), this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
   * @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
   * @returns {extensions} For chaining.
   */
  handle(i, t, e) {
    const s = this._addHandlers, r = this._removeHandlers;
    if (s[i] || r[i])
      throw new Error(`Extension type ${i} already has a handler`);
    s[i] = t, r[i] = e;
    const n = this._queue;
    return n[i] && (n[i]?.forEach((o) => t(o)), delete n[i]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {extensions} For chaining.
   */
  handleByMap(i, t) {
    return this.handle(
      i,
      (e) => {
        e.name && (t[e.name] = e.ref);
      },
      (e) => {
        e.name && delete t[e.name];
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions with a `name` property.
   * @param type - Type of extension to handle.
   * @param map - The array of named extensions.
   * @param defaultPriority - Fallback priority if none is defined.
   * @returns {extensions} For chaining.
   */
  handleByNamedList(i, t, e = -1) {
    return this.handle(
      i,
      (s) => {
        t.findIndex((n) => n.name === s.name) >= 0 || (t.push({ name: s.name, value: s.ref }), t.sort((n, o) => Xe(o.value, e) - Xe(n.value, e)));
      },
      (s) => {
        const r = t.findIndex((n) => n.name === s.name);
        r !== -1 && t.splice(r, 1);
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns {extensions} For chaining.
   */
  handleByList(i, t, e = -1) {
    return this.handle(
      i,
      (s) => {
        t.includes(s.ref) || (t.push(s.ref), t.sort((r, n) => Xe(n, e) - Xe(r, e)));
      },
      (s) => {
        const r = t.indexOf(s.ref);
        r !== -1 && t.splice(r, 1);
      }
    );
  }
}, _a = {
  extension: {
    type: U.Environment,
    name: "browser",
    priority: -1
  },
  test: () => !0,
  load: async () => {
    await import("./browserAll.js");
  }
}, ba = {
  extension: {
    type: U.Environment,
    name: "webworker",
    priority: 0
  },
  test: () => typeof self < "u" && self.WorkerGlobalScope !== void 0,
  load: async () => {
    await import("./webworkerAll.js");
  }
};
class Bt {
  /**
   * Creates a new `ObservablePoint`
   * @param observer - Observer to pass to listen for change events.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t, e, s) {
    this._x = e || 0, this._y = s || 0, this._observer = t;
  }
  /**
   * Creates a clone of this point.
   * @param observer - Optional observer to pass to the new observable point.
   * @returns a copy of this observable point
   */
  clone(t) {
    return new Bt(t ?? this._observer, this._x, this._y);
  }
  /**
   * Sets the point to a new `x` and `y` position.
   * If `y` is omitted, both `x` and `y` will be set to `x`.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=x] - position of the point on the y axis
   * @returns The observable point instance itself
   */
  set(t = 0, e = t) {
    return (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies x and y from the given point (`p`)
   * @param p - The point to copy from. Can be any of type that is or extends `PointData`
   * @returns The observable point instance itself
   */
  copyFrom(t) {
    return (this._x !== t.x || this._y !== t.y) && (this._x = t.x, this._y = t.y, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies this point's x and y into that of the given point (`p`)
   * @param p - The point to copy to. Can be any of type that is or extends `PointData`
   * @returns The point (`p`) with values updated
   */
  copyTo(t) {
    return t.set(this._x, this._y), t;
  }
  /**
   * Accepts another point (`p`) and returns `true` if the given point is equal to this point
   * @param p - The point to check
   * @returns Returns `true` if both `x` and `y` are equal
   */
  equals(t) {
    return t.x === this._x && t.y === this._y;
  }
  toString() {
    return `[pixi.js/math:ObservablePoint x=0 y=0 scope=${this._observer}]`;
  }
  /** Position of the observable point on the x axis. */
  get x() {
    return this._x;
  }
  set x(t) {
    this._x !== t && (this._x = t, this._observer._onUpdate(this));
  }
  /** Position of the observable point on the y axis. */
  get y() {
    return this._y;
  }
  set y(t) {
    this._y !== t && (this._y = t, this._observer._onUpdate(this));
  }
}
var lr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ws(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var Es = { exports: {} }, cr;
function wa() {
  return cr || (cr = 1, function(i) {
    var t = Object.prototype.hasOwnProperty, e = "~";
    function s() {
    }
    Object.create && (s.prototype = /* @__PURE__ */ Object.create(null), new s().__proto__ || (e = !1));
    function r(h, c, l) {
      this.fn = h, this.context = c, this.once = l || !1;
    }
    function n(h, c, l, u, f) {
      if (typeof l != "function")
        throw new TypeError("The listener must be a function");
      var d = new r(l, u || h, f), g = e ? e + c : c;
      return h._events[g] ? h._events[g].fn ? h._events[g] = [h._events[g], d] : h._events[g].push(d) : (h._events[g] = d, h._eventsCount++), h;
    }
    function o(h, c) {
      --h._eventsCount === 0 ? h._events = new s() : delete h._events[c];
    }
    function a() {
      this._events = new s(), this._eventsCount = 0;
    }
    a.prototype.eventNames = function() {
      var c = [], l, u;
      if (this._eventsCount === 0) return c;
      for (u in l = this._events)
        t.call(l, u) && c.push(e ? u.slice(1) : u);
      return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(l)) : c;
    }, a.prototype.listeners = function(c) {
      var l = e ? e + c : c, u = this._events[l];
      if (!u) return [];
      if (u.fn) return [u.fn];
      for (var f = 0, d = u.length, g = new Array(d); f < d; f++)
        g[f] = u[f].fn;
      return g;
    }, a.prototype.listenerCount = function(c) {
      var l = e ? e + c : c, u = this._events[l];
      return u ? u.fn ? 1 : u.length : 0;
    }, a.prototype.emit = function(c, l, u, f, d, g) {
      var y = e ? e + c : c;
      if (!this._events[y]) return !1;
      var m = this._events[y], _ = arguments.length, M, S;
      if (m.fn) {
        switch (m.once && this.removeListener(c, m.fn, void 0, !0), _) {
          case 1:
            return m.fn.call(m.context), !0;
          case 2:
            return m.fn.call(m.context, l), !0;
          case 3:
            return m.fn.call(m.context, l, u), !0;
          case 4:
            return m.fn.call(m.context, l, u, f), !0;
          case 5:
            return m.fn.call(m.context, l, u, f, d), !0;
          case 6:
            return m.fn.call(m.context, l, u, f, d, g), !0;
        }
        for (S = 1, M = new Array(_ - 1); S < _; S++)
          M[S - 1] = arguments[S];
        m.fn.apply(m.context, M);
      } else {
        var C = m.length, L;
        for (S = 0; S < C; S++)
          switch (m[S].once && this.removeListener(c, m[S].fn, void 0, !0), _) {
            case 1:
              m[S].fn.call(m[S].context);
              break;
            case 2:
              m[S].fn.call(m[S].context, l);
              break;
            case 3:
              m[S].fn.call(m[S].context, l, u);
              break;
            case 4:
              m[S].fn.call(m[S].context, l, u, f);
              break;
            default:
              if (!M) for (L = 1, M = new Array(_ - 1); L < _; L++)
                M[L - 1] = arguments[L];
              m[S].fn.apply(m[S].context, M);
          }
      }
      return !0;
    }, a.prototype.on = function(c, l, u) {
      return n(this, c, l, u, !1);
    }, a.prototype.once = function(c, l, u) {
      return n(this, c, l, u, !0);
    }, a.prototype.removeListener = function(c, l, u, f) {
      var d = e ? e + c : c;
      if (!this._events[d]) return this;
      if (!l)
        return o(this, d), this;
      var g = this._events[d];
      if (g.fn)
        g.fn === l && (!f || g.once) && (!u || g.context === u) && o(this, d);
      else {
        for (var y = 0, m = [], _ = g.length; y < _; y++)
          (g[y].fn !== l || f && !g[y].once || u && g[y].context !== u) && m.push(g[y]);
        m.length ? this._events[d] = m.length === 1 ? m[0] : m : o(this, d);
      }
      return this;
    }, a.prototype.removeAllListeners = function(c) {
      var l;
      return c ? (l = e ? e + c : c, this._events[l] && o(this, l)) : (this._events = new s(), this._eventsCount = 0), this;
    }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = e, a.EventEmitter = a, i.exports = a;
  }(Es)), Es.exports;
}
var va = wa();
const Rt = /* @__PURE__ */ ws(va), Ma = Math.PI * 2, Sa = 180 / Math.PI, Aa = Math.PI / 180;
class Pt {
  /**
   * Creates a new `Point`
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t = 0, e = 0) {
    this.x = 0, this.y = 0, this.x = t, this.y = e;
  }
  /**
   * Creates a clone of this point
   * @returns A clone of this point
   */
  clone() {
    return new Pt(this.x, this.y);
  }
  /**
   * Copies `x` and `y` from the given point into this point
   * @param p - The point to copy from
   * @returns The point instance itself
   */
  copyFrom(t) {
    return this.set(t.x, t.y), this;
  }
  /**
   * Copies this point's x and y into the given point (`p`).
   * @param p - The point to copy to. Can be any of type that is or extends `PointData`
   * @returns The point (`p`) with values updated
   */
  copyTo(t) {
    return t.set(this.x, this.y), t;
  }
  /**
   * Accepts another point (`p`) and returns `true` if the given point is equal to this point
   * @param p - The point to check
   * @returns Returns `true` if both `x` and `y` are equal
   */
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  /**
   * Sets the point to a new `x` and `y` position.
   * If `y` is omitted, both `x` and `y` will be set to `x`.
   * @param {number} [x=0] - position of the point on the `x` axis
   * @param {number} [y=x] - position of the point on the `y` axis
   * @returns The point instance itself
   */
  set(t = 0, e = t) {
    return this.x = t, this.y = e, this;
  }
  toString() {
    return `[pixi.js/math:Point x=${this.x} y=${this.y}]`;
  }
  /**
   * A static Point object with `x` and `y` values of `0`. Can be used to avoid creating new objects multiple times.
   * @readonly
   */
  static get shared() {
    return Ls.x = 0, Ls.y = 0, Ls;
  }
}
const Ls = new Pt();
class et {
  /**
   * @param a - x scale
   * @param b - y skew
   * @param c - x skew
   * @param d - y scale
   * @param tx - x translation
   * @param ty - y translation
   */
  constructor(t = 1, e = 0, s = 0, r = 1, n = 0, o = 0) {
    this.array = null, this.a = t, this.b = e, this.c = s, this.d = r, this.tx = n, this.ty = o;
  }
  /**
   * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
   *
   * a = array[0]
   * b = array[1]
   * c = array[3]
   * d = array[4]
   * tx = array[2]
   * ty = array[5]
   * @param array - The array that the matrix will be populated from.
   */
  fromArray(t) {
    this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5];
  }
  /**
   * Sets the matrix properties.
   * @param a - Matrix component
   * @param b - Matrix component
   * @param c - Matrix component
   * @param d - Matrix component
   * @param tx - Matrix component
   * @param ty - Matrix component
   * @returns This matrix. Good for chaining method calls.
   */
  set(t, e, s, r, n, o) {
    return this.a = t, this.b = e, this.c = s, this.d = r, this.tx = n, this.ty = o, this;
  }
  /**
   * Creates an array from the current Matrix object.
   * @param transpose - Whether we need to transpose the matrix or not
   * @param [out=new Float32Array(9)] - If provided the array will be assigned to out
   * @returns The newly created array which contains the matrix
   */
  toArray(t, e) {
    this.array || (this.array = new Float32Array(9));
    const s = e || this.array;
    return t ? (s[0] = this.a, s[1] = this.b, s[2] = 0, s[3] = this.c, s[4] = this.d, s[5] = 0, s[6] = this.tx, s[7] = this.ty, s[8] = 1) : (s[0] = this.a, s[1] = this.c, s[2] = this.tx, s[3] = this.b, s[4] = this.d, s[5] = this.ty, s[6] = 0, s[7] = 0, s[8] = 1), s;
  }
  /**
   * Get a new position with the current transformation applied.
   * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
   * @param pos - The origin
   * @param {Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {Point} The new point, transformed through this matrix
   */
  apply(t, e) {
    e = e || new Pt();
    const s = t.x, r = t.y;
    return e.x = this.a * s + this.c * r + this.tx, e.y = this.b * s + this.d * r + this.ty, e;
  }
  /**
   * Get a new position with the inverse of the current transformation applied.
   * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
   * @param pos - The origin
   * @param {Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {Point} The new point, inverse-transformed through this matrix
   */
  applyInverse(t, e) {
    e = e || new Pt();
    const s = this.a, r = this.b, n = this.c, o = this.d, a = this.tx, h = this.ty, c = 1 / (s * o + n * -r), l = t.x, u = t.y;
    return e.x = o * c * l + -n * c * u + (h * n - a * o) * c, e.y = s * c * u + -r * c * l + (-h * s + a * r) * c, e;
  }
  /**
   * Translates the matrix on the x and y.
   * @param x - How much to translate x by
   * @param y - How much to translate y by
   * @returns This matrix. Good for chaining method calls.
   */
  translate(t, e) {
    return this.tx += t, this.ty += e, this;
  }
  /**
   * Applies a scale transformation to the matrix.
   * @param x - The amount to scale horizontally
   * @param y - The amount to scale vertically
   * @returns This matrix. Good for chaining method calls.
   */
  scale(t, e) {
    return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this;
  }
  /**
   * Applies a rotation transformation to the matrix.
   * @param angle - The angle in radians.
   * @returns This matrix. Good for chaining method calls.
   */
  rotate(t) {
    const e = Math.cos(t), s = Math.sin(t), r = this.a, n = this.c, o = this.tx;
    return this.a = r * e - this.b * s, this.b = r * s + this.b * e, this.c = n * e - this.d * s, this.d = n * s + this.d * e, this.tx = o * e - this.ty * s, this.ty = o * s + this.ty * e, this;
  }
  /**
   * Appends the given Matrix to this Matrix.
   * @param matrix - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  append(t) {
    const e = this.a, s = this.b, r = this.c, n = this.d;
    return this.a = t.a * e + t.b * r, this.b = t.a * s + t.b * n, this.c = t.c * e + t.d * r, this.d = t.c * s + t.d * n, this.tx = t.tx * e + t.ty * r + this.tx, this.ty = t.tx * s + t.ty * n + this.ty, this;
  }
  /**
   * Appends two matrix's and sets the result to this matrix. AB = A * B
   * @param a - The matrix to append.
   * @param b - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  appendFrom(t, e) {
    const s = t.a, r = t.b, n = t.c, o = t.d, a = t.tx, h = t.ty, c = e.a, l = e.b, u = e.c, f = e.d;
    return this.a = s * c + r * u, this.b = s * l + r * f, this.c = n * c + o * u, this.d = n * l + o * f, this.tx = a * c + h * u + e.tx, this.ty = a * l + h * f + e.ty, this;
  }
  /**
   * Sets the matrix based on all the available properties
   * @param x - Position on the x axis
   * @param y - Position on the y axis
   * @param pivotX - Pivot on the x axis
   * @param pivotY - Pivot on the y axis
   * @param scaleX - Scale on the x axis
   * @param scaleY - Scale on the y axis
   * @param rotation - Rotation in radians
   * @param skewX - Skew on the x axis
   * @param skewY - Skew on the y axis
   * @returns This matrix. Good for chaining method calls.
   */
  setTransform(t, e, s, r, n, o, a, h, c) {
    return this.a = Math.cos(a + c) * n, this.b = Math.sin(a + c) * n, this.c = -Math.sin(a - h) * o, this.d = Math.cos(a - h) * o, this.tx = t - (s * this.a + r * this.c), this.ty = e - (s * this.b + r * this.d), this;
  }
  /**
   * Prepends the given Matrix to this Matrix.
   * @param matrix - The matrix to prepend
   * @returns This matrix. Good for chaining method calls.
   */
  prepend(t) {
    const e = this.tx;
    if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
      const s = this.a, r = this.c;
      this.a = s * t.a + this.b * t.c, this.b = s * t.b + this.b * t.d, this.c = r * t.a + this.d * t.c, this.d = r * t.b + this.d * t.d;
    }
    return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
  }
  /**
   * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
   * @param transform - The transform to apply the properties to.
   * @returns The transform with the newly applied properties
   */
  decompose(t) {
    const e = this.a, s = this.b, r = this.c, n = this.d, o = t.pivot, a = -Math.atan2(-r, n), h = Math.atan2(s, e), c = Math.abs(a + h);
    return c < 1e-5 || Math.abs(Ma - c) < 1e-5 ? (t.rotation = h, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = a, t.skew.y = h), t.scale.x = Math.sqrt(e * e + s * s), t.scale.y = Math.sqrt(r * r + n * n), t.position.x = this.tx + (o.x * e + o.y * r), t.position.y = this.ty + (o.x * s + o.y * n), t;
  }
  /**
   * Inverts this matrix
   * @returns This matrix. Good for chaining method calls.
   */
  invert() {
    const t = this.a, e = this.b, s = this.c, r = this.d, n = this.tx, o = t * r - e * s;
    return this.a = r / o, this.b = -e / o, this.c = -s / o, this.d = t / o, this.tx = (s * this.ty - r * n) / o, this.ty = -(t * this.ty - e * n) / o, this;
  }
  /** Checks if this matrix is an identity matrix */
  isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
  }
  /**
   * Resets this Matrix to an identity (default) matrix.
   * @returns This matrix. Good for chaining method calls.
   */
  identity() {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
  }
  /**
   * Creates a new Matrix object with the same values as this one.
   * @returns A copy of this matrix. Good for chaining method calls.
   */
  clone() {
    const t = new et();
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Changes the values of the given matrix to be the same as the ones in this matrix
   * @param matrix - The matrix to copy to.
   * @returns The matrix given in parameter with its values updated.
   */
  copyTo(t) {
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Changes the values of the matrix to be the same as the ones in given matrix
   * @param matrix - The matrix to copy from.
   * @returns this
   */
  copyFrom(t) {
    return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this;
  }
  /**
   * check to see if two matrices are the same
   * @param matrix - The matrix to compare to.
   */
  equals(t) {
    return t.a === this.a && t.b === this.b && t.c === this.c && t.d === this.d && t.tx === this.tx && t.ty === this.ty;
  }
  toString() {
    return `[pixi.js:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
  }
  /**
   * A default (identity) matrix.
   *
   * This is a shared object, if you want to modify it consider creating a new `Matrix`
   * @readonly
   */
  static get IDENTITY() {
    return Ta.identity();
  }
  /**
   * A static Matrix that can be used to avoid creating new objects.
   * Will always ensure the matrix is reset to identity when requested.
   * Use this object for fast but temporary calculations, as it may be mutated later on.
   * This is a different object to the `IDENTITY` object and so can be modified without changing `IDENTITY`.
   * @readonly
   */
  static get shared() {
    return Ca.identity();
  }
}
const Ca = new et(), Ta = new et(), re = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], ne = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], oe = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], ae = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], gi = [], An = [], qe = Math.sign;
function Pa() {
  for (let i = 0; i < 16; i++) {
    const t = [];
    gi.push(t);
    for (let e = 0; e < 16; e++) {
      const s = qe(re[i] * re[e] + oe[i] * ne[e]), r = qe(ne[i] * re[e] + ae[i] * ne[e]), n = qe(re[i] * oe[e] + oe[i] * ae[e]), o = qe(ne[i] * oe[e] + ae[i] * ae[e]);
      for (let a = 0; a < 16; a++)
        if (re[a] === s && ne[a] === r && oe[a] === n && ae[a] === o) {
          t.push(a);
          break;
        }
    }
  }
  for (let i = 0; i < 16; i++) {
    const t = new et();
    t.set(re[i], ne[i], oe[i], ae[i], 0, 0), An.push(t);
  }
}
Pa();
const dt = {
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 0°       | East      |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  E: 0,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 45°↻     | Southeast |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  SE: 1,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 90°↻     | South     |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  S: 2,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 135°↻    | Southwest |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  SW: 3,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 180°     | West      |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  W: 4,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -135°/225°↻ | Northwest    |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  NW: 5,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -90°/270°↻  | North        |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  N: 6,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -45°/315°↻  | Northeast    |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  NE: 7,
  /**
   * Reflection about Y-axis.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MIRROR_VERTICAL: 8,
  /**
   * Reflection about the main diagonal.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MAIN_DIAGONAL: 10,
  /**
   * Reflection about X-axis.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MIRROR_HORIZONTAL: 12,
  /**
   * Reflection about reverse diagonal.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  REVERSE_DIAGONAL: 14,
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the U-axis
   *    after rotating the axes.
   */
  uX: (i) => re[i],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: (i) => ne[i],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: (i) => oe[i],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: (i) => ae[i],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotation - symmetry whose opposite
   *   is needed. Only rotations have opposite symmetries while
   *   reflections don't.
   * @returns {GD8Symmetry} The opposite symmetry of `rotation`
   */
  inv: (i) => i & 8 ? i & 15 : -i & 7,
  /**
   * Composes the two D8 operations.
   *
   * Taking `^` as reflection:
   *
   * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
   * |-------|-----|-----|-----|-----|------|-------|-------|-------|
   * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
   * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
   * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
   * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
   * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
   * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
   * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
   * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
   *
   * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation, which
   *   is the row in the above cayley table.
   * @param {GD8Symmetry} rotationFirst - First operation, which
   *   is the column in the above cayley table.
   * @returns {GD8Symmetry} Composed operation
   */
  add: (i, t) => gi[i][t],
  /**
   * Reverse of `add`.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation
   * @param {GD8Symmetry} rotationFirst - First operation
   * @returns {GD8Symmetry} Result
   */
  sub: (i, t) => gi[i][dt.inv(t)],
  /**
   * Adds 180 degrees to rotation, which is a commutative
   * operation.
   * @memberof maths.groupD8
   * @param {number} rotation - The number to rotate.
   * @returns {number} Rotated number
   */
  rotate180: (i) => i ^ 4,
  /**
   * Checks if the rotation angle is vertical, i.e. south
   * or north. It doesn't work for reflections.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotation - The number to check.
   * @returns {boolean} Whether or not the direction is vertical
   */
  isVertical: (i) => (i & 3) === 2,
  // rotation % 4 === 2
  /**
   * Approximates the vector `V(dx,dy)` into one of the
   * eight directions provided by `groupD8`.
   * @memberof maths.groupD8
   * @param {number} dx - X-component of the vector
   * @param {number} dy - Y-component of the vector
   * @returns {GD8Symmetry} Approximation of the vector into
   *  one of the eight symmetries.
   */
  byDirection: (i, t) => Math.abs(i) * 2 <= Math.abs(t) ? t >= 0 ? dt.S : dt.N : Math.abs(t) * 2 <= Math.abs(i) ? i > 0 ? dt.E : dt.W : t > 0 ? i > 0 ? dt.SE : dt.SW : i > 0 ? dt.NE : dt.NW,
  /**
   * Helps sprite to compensate texture packer rotation.
   * @memberof maths.groupD8
   * @param {Matrix} matrix - sprite world matrix
   * @param {GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   */
  matrixAppendRotationInv: (i, t, e = 0, s = 0) => {
    const r = An[dt.inv(t)];
    r.tx = e, r.ty = s, i.append(r);
  }
}, Ze = [new Pt(), new Pt(), new Pt(), new Pt()];
class wt {
  /**
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   */
  constructor(t = 0, e = 0, s = 0, r = 0) {
    this.type = "rectangle", this.x = Number(t), this.y = Number(e), this.width = Number(s), this.height = Number(r);
  }
  /** Returns the left edge of the rectangle. */
  get left() {
    return this.x;
  }
  /** Returns the right edge of the rectangle. */
  get right() {
    return this.x + this.width;
  }
  /** Returns the top edge of the rectangle. */
  get top() {
    return this.y;
  }
  /** Returns the bottom edge of the rectangle. */
  get bottom() {
    return this.y + this.height;
  }
  /** Determines whether the Rectangle is empty. */
  isEmpty() {
    return this.left === this.right || this.top === this.bottom;
  }
  /** A constant empty rectangle. This is a new object every time the property is accessed */
  static get EMPTY() {
    return new wt(0, 0, 0, 0);
  }
  /**
   * Creates a clone of this Rectangle
   * @returns a copy of the rectangle
   */
  clone() {
    return new wt(this.x, this.y, this.width, this.height);
  }
  /**
   * Converts a Bounds object to a Rectangle object.
   * @param bounds - The bounds to copy and convert to a rectangle.
   * @returns Returns itself.
   */
  copyFromBounds(t) {
    return this.x = t.minX, this.y = t.minY, this.width = t.maxX - t.minX, this.height = t.maxY - t.minY, this;
  }
  /**
   * Copies another rectangle to this one.
   * @param rectangle - The rectangle to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @param rectangle - The rectangle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rectangle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Rectangle
   */
  contains(t, e) {
    return this.width <= 0 || this.height <= 0 ? !1 : t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke, 0.5 by default
   * @returns Whether the x/y coordinates are within this rectangle
   */
  strokeContains(t, e, s, r = 0.5) {
    const { width: n, height: o } = this;
    if (n <= 0 || o <= 0)
      return !1;
    const a = this.x, h = this.y, c = s * (1 - r), l = s - c, u = a - c, f = a + n + c, d = h - c, g = h + o + c, y = a + l, m = a + n - l, _ = h + l, M = h + o - l;
    return t >= u && t <= f && e >= d && e <= g && !(t > y && t < m && e > _ && e < M);
  }
  /**
   * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
   * Returns true only if the area of the intersection is >0, this means that Rectangles
   * sharing a side are not overlapping. Another side effect is that an arealess rectangle
   * (width or height equal to zero) can't intersect any other rectangle.
   * @param {Rectangle} other - The Rectangle to intersect with `this`.
   * @param {Matrix} transform - The transformation matrix of `other`.
   * @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
   */
  intersects(t, e) {
    if (!e) {
      const v = this.x < t.x ? t.x : this.x;
      if ((this.right > t.right ? t.right : this.right) <= v)
        return !1;
      const N = this.y < t.y ? t.y : this.y;
      return (this.bottom > t.bottom ? t.bottom : this.bottom) > N;
    }
    const s = this.left, r = this.right, n = this.top, o = this.bottom;
    if (r <= s || o <= n)
      return !1;
    const a = Ze[0].set(t.left, t.top), h = Ze[1].set(t.left, t.bottom), c = Ze[2].set(t.right, t.top), l = Ze[3].set(t.right, t.bottom);
    if (c.x <= a.x || h.y <= a.y)
      return !1;
    const u = Math.sign(e.a * e.d - e.b * e.c);
    if (u === 0 || (e.apply(a, a), e.apply(h, h), e.apply(c, c), e.apply(l, l), Math.max(a.x, h.x, c.x, l.x) <= s || Math.min(a.x, h.x, c.x, l.x) >= r || Math.max(a.y, h.y, c.y, l.y) <= n || Math.min(a.y, h.y, c.y, l.y) >= o))
      return !1;
    const f = u * (h.y - a.y), d = u * (a.x - h.x), g = f * s + d * n, y = f * r + d * n, m = f * s + d * o, _ = f * r + d * o;
    if (Math.max(g, y, m, _) <= f * a.x + d * a.y || Math.min(g, y, m, _) >= f * l.x + d * l.y)
      return !1;
    const M = u * (a.y - c.y), S = u * (c.x - a.x), C = M * s + S * n, L = M * r + S * n, P = M * s + S * o, I = M * r + S * o;
    return !(Math.max(C, L, P, I) <= M * a.x + S * a.y || Math.min(C, L, P, I) >= M * l.x + S * l.y);
  }
  /**
   * Pads the rectangle making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @param paddingX - The horizontal padding amount.
   * @param paddingY - The vertical padding amount.
   * @returns Returns itself.
   */
  pad(t = 0, e = t) {
    return this.x -= t, this.y -= e, this.width += t * 2, this.height += e * 2, this;
  }
  /**
   * Fits this rectangle around the passed one.
   * @param rectangle - The rectangle to fit.
   * @returns Returns itself.
   */
  fit(t) {
    const e = Math.max(this.x, t.x), s = Math.min(this.x + this.width, t.x + t.width), r = Math.max(this.y, t.y), n = Math.min(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = Math.max(s - e, 0), this.y = r, this.height = Math.max(n - r, 0), this;
  }
  /**
   * Enlarges rectangle that way its corners lie on grid
   * @param resolution - resolution
   * @param eps - precision
   * @returns Returns itself.
   */
  ceil(t = 1, e = 1e-3) {
    const s = Math.ceil((this.x + this.width - e) * t) / t, r = Math.ceil((this.y + this.height - e) * t) / t;
    return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = s - this.x, this.height = r - this.y, this;
  }
  /**
   * Enlarges this rectangle to include the passed rectangle.
   * @param rectangle - The rectangle to include.
   * @returns Returns itself.
   */
  enlarge(t) {
    const e = Math.min(this.x, t.x), s = Math.max(this.x + this.width, t.x + t.width), r = Math.min(this.y, t.y), n = Math.max(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = s - e, this.y = r, this.height = n - r, this;
  }
  /**
   * Returns the framing rectangle of the rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t || (t = new wt()), t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
}
const Bs = {
  default: -1
};
function vt(i = "default") {
  return Bs[i] === void 0 && (Bs[i] = -1), ++Bs[i];
}
const ur = {}, yt = "8.0.0", Ia = "8.3.4";
function ot(i, t, e = 3) {
  if (ur[t])
    return;
  let s = new Error().stack;
  typeof s > "u" ? console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${i}`) : (s = s.split(`
`).splice(e).join(`
`), console.groupCollapsed ? (console.groupCollapsed(
    "%cPixiJS Deprecation Warning: %c%s",
    "color:#614108;background:#fffbe6",
    "font-weight:normal;color:#614108;background:#fffbe6",
    `${t}
Deprecated since v${i}`
  ), console.warn(s), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${i}`), console.warn(s))), ur[t] = !0;
}
const Cn = () => {
};
function xs(i) {
  return i += i === 0 ? 1 : 0, --i, i |= i >>> 1, i |= i >>> 2, i |= i >>> 4, i |= i >>> 8, i |= i >>> 16, i + 1;
}
function dr(i) {
  return !(i & i - 1) && !!i;
}
function ka(i) {
  const t = {};
  for (const e in i)
    i[e] !== void 0 && (t[e] = i[e]);
  return t;
}
const fr = /* @__PURE__ */ Object.create(null);
function Ea(i) {
  const t = fr[i];
  return t === void 0 && (fr[i] = vt("resource")), t;
}
const Tn = class Pn extends Rt {
  /**
   * @param options - options for the style
   */
  constructor(t = {}) {
    super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = !1, t = { ...Pn.defaultOptions, ...t }, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
  }
  set addressMode(t) {
    this.addressModeU = t, this.addressModeV = t, this.addressModeW = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this.addressModeU;
  }
  set wrapMode(t) {
    ot(yt, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = t;
  }
  get wrapMode() {
    return this.addressMode;
  }
  set scaleMode(t) {
    this.magFilter = t, this.minFilter = t, this.mipmapFilter = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this.magFilter;
  }
  /** Specifies the maximum anisotropy value clamp used by the sampler. */
  set maxAnisotropy(t) {
    this._maxAnisotropy = Math.min(t, 16), this._maxAnisotropy > 1 && (this.scaleMode = "linear");
  }
  get maxAnisotropy() {
    return this._maxAnisotropy;
  }
  // TODO - move this to WebGL?
  get _resourceId() {
    return this._sharedResourceId || this._generateResourceId();
  }
  update() {
    this.emit("change", this), this._sharedResourceId = null;
  }
  _generateResourceId() {
    const t = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
    return this._sharedResourceId = Ea(t), this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
  }
};
Tn.defaultOptions = {
  addressMode: "clamp-to-edge",
  scaleMode: "linear"
};
let La = Tn;
const In = class kn extends Rt {
  /**
   * @param options - options for creating a new TextureSource
   */
  constructor(t = {}) {
    super(), this.options = t, this.uid = vt("textureSource"), this._resourceType = "textureSource", this._resourceId = vt("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.antialias = !1, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = { ...kn.defaultOptions, ...t }, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new La(ka(t)), this.destroyed = !1, this._refreshPOT();
  }
  /** returns itself */
  get source() {
    return this;
  }
  /** the style of the texture */
  get style() {
    return this._style;
  }
  set style(t) {
    this.style !== t && (this._style?.off("change", this._onStyleChange, this), this._style = t, this._style?.on("change", this._onStyleChange, this), this._onStyleChange());
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this._style.addressMode;
  }
  set addressMode(t) {
    this._style.addressMode = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get repeatMode() {
    return this._style.addressMode;
  }
  set repeatMode(t) {
    this._style.addressMode = t;
  }
  /** Specifies the sampling behavior when the sample footprint is smaller than or equal to one texel. */
  get magFilter() {
    return this._style.magFilter;
  }
  set magFilter(t) {
    this._style.magFilter = t;
  }
  /** Specifies the sampling behavior when the sample footprint is larger than one texel. */
  get minFilter() {
    return this._style.minFilter;
  }
  set minFilter(t) {
    this._style.minFilter = t;
  }
  /** Specifies behavior for sampling between mipmap levels. */
  get mipmapFilter() {
    return this._style.mipmapFilter;
  }
  set mipmapFilter(t) {
    this._style.mipmapFilter = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMinClamp() {
    return this._style.lodMinClamp;
  }
  set lodMinClamp(t) {
    this._style.lodMinClamp = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMaxClamp() {
    return this._style.lodMaxClamp;
  }
  set lodMaxClamp(t) {
    this._style.lodMaxClamp = t;
  }
  _onStyleChange() {
    this.emit("styleChange", this);
  }
  /** call this if you have modified the texture outside of the constructor */
  update() {
    if (this.resource) {
      const t = this._resolution;
      if (this.resize(this.resourceWidth / t, this.resourceHeight / t))
        return;
    }
    this.emit("update", this);
  }
  /** Destroys this texture source */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this._style && (this._style.destroy(), this._style = null), this.uploadMethodId = null, this.resource = null, this.removeAllListeners();
  }
  /**
   * This will unload the Texture source from the GPU. This will free up the GPU memory
   * As soon as it is required fore rendering, it will be re-uploaded.
   */
  unload() {
    this._resourceId = vt("resource"), this.emit("change", this), this.emit("unload", this);
  }
  /** the width of the resource. This is the REAL pure number, not accounting resolution   */
  get resourceWidth() {
    const { resource: t } = this;
    return t.naturalWidth || t.videoWidth || t.displayWidth || t.width;
  }
  /** the height of the resource. This is the REAL pure number, not accounting resolution */
  get resourceHeight() {
    const { resource: t } = this;
    return t.naturalHeight || t.videoHeight || t.displayHeight || t.height;
  }
  /**
   * the resolution of the texture. Changing this number, will not change the number of pixels in the actual texture
   * but will the size of the texture when rendered.
   *
   * changing the resolution of this texture to 2 for example will make it appear twice as small when rendered (as pixel
   * density will have increased)
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(t) {
    this._resolution !== t && (this._resolution = t, this.width = this.pixelWidth / t, this.height = this.pixelHeight / t);
  }
  /**
   * Resize the texture, this is handy if you want to use the texture as a render texture
   * @param width - the new width of the texture
   * @param height - the new height of the texture
   * @param resolution - the new resolution of the texture
   * @returns - if the texture was resized
   */
  resize(t, e, s) {
    s || (s = this._resolution), t || (t = this.width), e || (e = this.height);
    const r = Math.round(t * s), n = Math.round(e * s);
    return this.width = r / s, this.height = n / s, this._resolution = s, this.pixelWidth === r && this.pixelHeight === n ? !1 : (this._refreshPOT(), this.pixelWidth = r, this.pixelHeight = n, this.emit("resize", this), this._resourceId = vt("resource"), this.emit("change", this), !0);
  }
  /**
   * Lets the renderer know that this texture has been updated and its mipmaps should be re-generated.
   * This is only important for RenderTexture instances, as standard Texture instances will have their
   * mipmaps generated on upload. You should call this method after you make any change to the texture
   *
   * The reason for this is is can be quite expensive to update mipmaps for a texture. So by default,
   * We want you, the developer to specify when this action should happen.
   *
   * Generally you don't want to have mipmaps generated on Render targets that are changed every frame,
   */
  updateMipmaps() {
    this.autoGenerateMipmaps && this.mipLevelCount > 1 && this.emit("updateMipmaps", this);
  }
  set wrapMode(t) {
    this._style.wrapMode = t;
  }
  get wrapMode() {
    return this._style.wrapMode;
  }
  set scaleMode(t) {
    this._style.scaleMode = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this._style.scaleMode;
  }
  /**
   * Refresh check for isPowerOfTwo texture based on size
   * @private
   */
  _refreshPOT() {
    this.isPowerOfTwo = dr(this.pixelWidth) && dr(this.pixelHeight);
  }
  static test(t) {
    throw new Error("Unimplemented");
  }
};
In.defaultOptions = {
  resolution: 1,
  format: "bgra8unorm",
  alphaMode: "premultiply-alpha-on-upload",
  dimensions: "2d",
  mipLevelCount: 1,
  autoGenerateMipmaps: !1,
  sampleCount: 1,
  antialias: !1,
  autoGarbageCollect: !1
};
let Kt = In;
class Gi extends Kt {
  constructor(t) {
    const e = t.resource || new Float32Array(t.width * t.height * 4);
    let s = t.format;
    s || (e instanceof Float32Array ? s = "rgba32float" : e instanceof Int32Array || e instanceof Uint32Array ? s = "rgba32uint" : e instanceof Int16Array || e instanceof Uint16Array ? s = "rgba16uint" : (e instanceof Int8Array, s = "bgra8unorm")), super({
      ...t,
      resource: e,
      format: s
    }), this.uploadMethodId = "buffer";
  }
  static test(t) {
    return t instanceof Int8Array || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array;
  }
}
Gi.extension = U.TextureSource;
const pr = new et();
class Ba {
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(t, e) {
    this.mapCoord = new et(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, typeof e > "u" ? this.clampMargin = t.width < 10 ? 0 : 0.5 : this.clampMargin = e, this.isSimple = !1, this.texture = t;
  }
  /** Texture property. */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    this.texture !== t && (this._texture?.removeListener("update", this.update, this), this._texture = t, this._texture.addListener("update", this.update, this), this.update());
  }
  /**
   * Multiplies uvs array to transform
   * @param uvs - mesh uvs
   * @param [out=uvs] - output
   * @returns - output
   */
  multiplyUvs(t, e) {
    e === void 0 && (e = t);
    const s = this.mapCoord;
    for (let r = 0; r < t.length; r += 2) {
      const n = t[r], o = t[r + 1];
      e[r] = n * s.a + o * s.c + s.tx, e[r + 1] = n * s.b + o * s.d + s.ty;
    }
    return e;
  }
  /**
   * Updates matrices if texture was changed
   * @returns - whether or not it was updated
   */
  update() {
    const t = this._texture;
    this._updateID++;
    const e = t.uvs;
    this.mapCoord.set(e.x1 - e.x0, e.y1 - e.y0, e.x3 - e.x0, e.y3 - e.y0, e.x0, e.y0);
    const s = t.orig, r = t.trim;
    r && (pr.set(
      s.width / r.width,
      0,
      0,
      s.height / r.height,
      -r.x / r.width,
      -r.y / r.height
    ), this.mapCoord.append(pr));
    const n = t.source, o = this.uClampFrame, a = this.clampMargin / n._resolution, h = this.clampOffset / n._resolution;
    return o[0] = (t.frame.x + a + h) / n.width, o[1] = (t.frame.y + a + h) / n.height, o[2] = (t.frame.x + t.frame.width - a + h) / n.width, o[3] = (t.frame.y + t.frame.height - a + h) / n.height, this.uClampOffset[0] = this.clampOffset / n.pixelWidth, this.uClampOffset[1] = this.clampOffset / n.pixelHeight, this.isSimple = t.frame.width === n.width && t.frame.height === n.height && t.rotate === 0, !0;
  }
}
class tt extends Rt {
  /**
   * @param {rendering.TextureOptions} options - Options for the texture
   */
  constructor({
    source: t,
    label: e,
    frame: s,
    orig: r,
    trim: n,
    defaultAnchor: o,
    defaultBorders: a,
    rotate: h,
    dynamic: c
  } = {}) {
    if (super(), this.uid = vt("texture"), this.uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 }, this.frame = new wt(), this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = e, this.source = t?.source ?? new Kt(), this.noFrame = !s, s)
      this.frame.copyFrom(s);
    else {
      const { width: l, height: u } = this._source;
      this.frame.width = l, this.frame.height = u;
    }
    this.orig = r || this.frame, this.trim = n, this.rotate = h ?? 0, this.defaultAnchor = o, this.defaultBorders = a, this.destroyed = !1, this.dynamic = c || !1, this.updateUvs();
  }
  set source(t) {
    this._source && this._source.off("resize", this.update, this), this._source = t, t.on("resize", this.update, this), this.emit("update", this);
  }
  /** the underlying source of the texture (equivalent of baseTexture in v7) */
  get source() {
    return this._source;
  }
  /** returns a TextureMatrix instance for this texture. By default, that object is not created because its heavy. */
  get textureMatrix() {
    return this._textureMatrix || (this._textureMatrix = new Ba(this)), this._textureMatrix;
  }
  /** The width of the Texture in pixels. */
  get width() {
    return this.orig.width;
  }
  /** The height of the Texture in pixels. */
  get height() {
    return this.orig.height;
  }
  /** Call this function when you have modified the frame of this texture. */
  updateUvs() {
    const { uvs: t, frame: e } = this, { width: s, height: r } = this._source, n = e.x / s, o = e.y / r, a = e.width / s, h = e.height / r;
    let c = this.rotate;
    if (c) {
      const l = a / 2, u = h / 2, f = n + l, d = o + u;
      c = dt.add(c, dt.NW), t.x0 = f + l * dt.uX(c), t.y0 = d + u * dt.uY(c), c = dt.add(c, 2), t.x1 = f + l * dt.uX(c), t.y1 = d + u * dt.uY(c), c = dt.add(c, 2), t.x2 = f + l * dt.uX(c), t.y2 = d + u * dt.uY(c), c = dt.add(c, 2), t.x3 = f + l * dt.uX(c), t.y3 = d + u * dt.uY(c);
    } else
      t.x0 = n, t.y0 = o, t.x1 = n + a, t.y1 = o, t.x2 = n + a, t.y2 = o + h, t.x3 = n, t.y3 = o + h;
  }
  /**
   * Destroys this texture
   * @param destroySource - Destroy the source when the texture is destroyed.
   */
  destroy(t = !1) {
    this._source && t && (this._source.destroy(), this._source = null), this._textureMatrix = null, this.destroyed = !0, this.emit("destroy", this), this.removeAllListeners();
  }
  /**
   * Call this if you have modified the `texture outside` of the constructor.
   *
   * If you have modified this texture's source, you must separately call `texture.source.update()` to see those changes.
   */
  update() {
    this.noFrame && (this.frame.width = this._source.width, this.frame.height = this._source.height), this.updateUvs(), this.emit("update", this);
  }
  /** @deprecated since 8.0.0 */
  get baseTexture() {
    return ot(yt, "Texture.baseTexture is now Texture.source"), this._source;
  }
}
tt.EMPTY = new tt({
  label: "EMPTY",
  source: new Kt({
    label: "EMPTY"
  })
});
tt.EMPTY.destroy = Cn;
tt.WHITE = new tt({
  source: new Gi({
    resource: new Uint8Array([255, 255, 255, 255]),
    width: 1,
    height: 1,
    alphaMode: "premultiply-alpha-on-upload",
    label: "WHITE"
  }),
  label: "WHITE"
});
tt.WHITE.destroy = Cn;
function Na(i, t, e, s) {
  const { width: r, height: n } = e.orig, o = e.trim;
  if (o) {
    const a = o.width, h = o.height;
    i.minX = o.x - t._x * r - s, i.maxX = i.minX + a, i.minY = o.y - t._y * n - s, i.maxY = i.minY + h;
  } else
    i.minX = -t._x * r - s, i.maxX = i.minX + r, i.minY = -t._y * n - s, i.maxY = i.minY + n;
}
const mr = new et();
class Xt {
  constructor(t = 1 / 0, e = 1 / 0, s = -1 / 0, r = -1 / 0) {
    this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = mr, this.minX = t, this.minY = e, this.maxX = s, this.maxY = r;
  }
  /**
   * Checks if bounds are empty.
   * @returns - True if empty.
   */
  isEmpty() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }
  /** The bounding rectangle of the bounds. */
  get rectangle() {
    this._rectangle || (this._rectangle = new wt());
    const t = this._rectangle;
    return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t;
  }
  /** Clears the bounds and resets. */
  clear() {
    return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = mr, this;
  }
  /**
   * Sets the bounds.
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   */
  set(t, e, s, r) {
    this.minX = t, this.minY = e, this.maxX = s, this.maxY = r;
  }
  /**
   * Adds sprite frame
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   * @param matrix
   */
  addFrame(t, e, s, r, n) {
    n || (n = this.matrix);
    const o = n.a, a = n.b, h = n.c, c = n.d, l = n.tx, u = n.ty;
    let f = this.minX, d = this.minY, g = this.maxX, y = this.maxY, m = o * t + h * e + l, _ = a * t + c * e + u;
    m < f && (f = m), _ < d && (d = _), m > g && (g = m), _ > y && (y = _), m = o * s + h * e + l, _ = a * s + c * e + u, m < f && (f = m), _ < d && (d = _), m > g && (g = m), _ > y && (y = _), m = o * t + h * r + l, _ = a * t + c * r + u, m < f && (f = m), _ < d && (d = _), m > g && (g = m), _ > y && (y = _), m = o * s + h * r + l, _ = a * s + c * r + u, m < f && (f = m), _ < d && (d = _), m > g && (g = m), _ > y && (y = _), this.minX = f, this.minY = d, this.maxX = g, this.maxY = y;
  }
  /**
   * Adds a rectangle to the bounds.
   * @param rect - The rectangle to be added.
   * @param matrix - The matrix to apply to the bounds.
   */
  addRect(t, e) {
    this.addFrame(t.x, t.y, t.x + t.width, t.y + t.height, e);
  }
  /**
   * Adds other {@link Bounds}.
   * @param bounds - The Bounds to be added
   * @param matrix
   */
  addBounds(t, e) {
    this.addFrame(t.minX, t.minY, t.maxX, t.maxY, e);
  }
  /**
   * Adds other Bounds, masked with Bounds.
   * @param mask - The Bounds to be added.
   */
  addBoundsMask(t) {
    this.minX = this.minX > t.minX ? this.minX : t.minX, this.minY = this.minY > t.minY ? this.minY : t.minY, this.maxX = this.maxX < t.maxX ? this.maxX : t.maxX, this.maxY = this.maxY < t.maxY ? this.maxY : t.maxY;
  }
  /**
   * Adds other Bounds, multiplied with matrix.
   * @param matrix - The matrix to apply to the bounds.
   */
  applyMatrix(t) {
    const e = this.minX, s = this.minY, r = this.maxX, n = this.maxY, { a: o, b: a, c: h, d: c, tx: l, ty: u } = t;
    let f = o * e + h * s + l, d = a * e + c * s + u;
    this.minX = f, this.minY = d, this.maxX = f, this.maxY = d, f = o * r + h * s + l, d = a * r + c * s + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY, f = o * e + h * n + l, d = a * e + c * n + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY, f = o * r + h * n + l, d = a * r + c * n + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY;
  }
  /**
   * Resizes the bounds object to include the given rectangle.
   * @param rect - The rectangle to be included.
   */
  fit(t) {
    return this.minX < t.left && (this.minX = t.left), this.maxX > t.right && (this.maxX = t.right), this.minY < t.top && (this.minY = t.top), this.maxY > t.bottom && (this.maxY = t.bottom), this;
  }
  /**
   * Resizes the bounds object to include the given bounds.
   * @param left - The left value of the bounds.
   * @param right - The right value of the bounds.
   * @param top - The top value of the bounds.
   * @param bottom - The bottom value of the bounds.
   */
  fitBounds(t, e, s, r) {
    return this.minX < t && (this.minX = t), this.maxX > e && (this.maxX = e), this.minY < s && (this.minY = s), this.maxY > r && (this.maxY = r), this;
  }
  /**
   * Pads bounds object, making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @param paddingX - The horizontal padding amount.
   * @param paddingY - The vertical padding amount.
   */
  pad(t, e = t) {
    return this.minX -= t, this.maxX += t, this.minY -= e, this.maxY += e, this;
  }
  /** Ceils the bounds. */
  ceil() {
    return this.minX = Math.floor(this.minX), this.minY = Math.floor(this.minY), this.maxX = Math.ceil(this.maxX), this.maxY = Math.ceil(this.maxY), this;
  }
  /** Clones the bounds. */
  clone() {
    return new Xt(this.minX, this.minY, this.maxX, this.maxY);
  }
  /**
   * Scales the bounds by the given values
   * @param x - The X value to scale by.
   * @param y - The Y value to scale by.
   */
  scale(t, e = t) {
    return this.minX *= t, this.minY *= e, this.maxX *= t, this.maxY *= e, this;
  }
  /** the x value of the bounds. */
  get x() {
    return this.minX;
  }
  set x(t) {
    const e = this.maxX - this.minX;
    this.minX = t, this.maxX = t + e;
  }
  /** the y value of the bounds. */
  get y() {
    return this.minY;
  }
  set y(t) {
    const e = this.maxY - this.minY;
    this.minY = t, this.maxY = t + e;
  }
  /** the width value of the bounds. */
  get width() {
    return this.maxX - this.minX;
  }
  set width(t) {
    this.maxX = this.minX + t;
  }
  /** the height value of the bounds. */
  get height() {
    return this.maxY - this.minY;
  }
  set height(t) {
    this.maxY = this.minY + t;
  }
  /** the left value of the bounds. */
  get left() {
    return this.minX;
  }
  /** the right value of the bounds. */
  get right() {
    return this.maxX;
  }
  /** the top value of the bounds. */
  get top() {
    return this.minY;
  }
  /** the bottom value of the bounds. */
  get bottom() {
    return this.maxY;
  }
  /** Is the bounds positive. */
  get isPositive() {
    return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
  }
  get isValid() {
    return this.minX + this.minY !== 1 / 0;
  }
  /**
   * Adds screen vertices from array
   * @param vertexData - calculated vertices
   * @param beginOffset - begin offset
   * @param endOffset - end offset, excluded
   * @param matrix
   */
  addVertexData(t, e, s, r) {
    let n = this.minX, o = this.minY, a = this.maxX, h = this.maxY;
    r || (r = this.matrix);
    const c = r.a, l = r.b, u = r.c, f = r.d, d = r.tx, g = r.ty;
    for (let y = e; y < s; y += 2) {
      const m = t[y], _ = t[y + 1], M = c * m + u * _ + d, S = l * m + f * _ + g;
      n = M < n ? M : n, o = S < o ? S : o, a = M > a ? M : a, h = S > h ? S : h;
    }
    this.minX = n, this.minY = o, this.maxX = a, this.maxY = h;
  }
  /**
   * Checks if the point is contained within the bounds.
   * @param x - x coordinate
   * @param y - y coordinate
   */
  containsPoint(t, e) {
    return this.minX <= t && this.minY <= e && this.maxX >= t && this.maxY >= e;
  }
  toString() {
    return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
  }
  /**
   * Copies the bounds from another bounds object.
   * @param bounds - The bounds to copy from.
   * @returns - This bounds object.
   */
  copyFrom(t) {
    return this.minX = t.minX, this.minY = t.minY, this.maxX = t.maxX, this.maxY = t.maxY, this;
  }
}
var Fa = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, Jt = function(i) {
  return typeof i == "string" ? i.length > 0 : typeof i == "number";
}, St = function(i, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * i) / e + 0;
}, Ot = function(i, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = 1), i > e ? e : i > t ? i : t;
}, En = function(i) {
  return (i = isFinite(i) ? i % 360 : 0) > 0 ? i : i + 360;
}, gr = function(i) {
  return { r: Ot(i.r, 0, 255), g: Ot(i.g, 0, 255), b: Ot(i.b, 0, 255), a: Ot(i.a) };
}, Ns = function(i) {
  return { r: St(i.r), g: St(i.g), b: St(i.b), a: St(i.a, 3) };
}, Oa = /^#([0-9a-f]{3,8})$/i, Ke = function(i) {
  var t = i.toString(16);
  return t.length < 2 ? "0" + t : t;
}, Ln = function(i) {
  var t = i.r, e = i.g, s = i.b, r = i.a, n = Math.max(t, e, s), o = n - Math.min(t, e, s), a = o ? n === t ? (e - s) / o : n === e ? 2 + (s - t) / o : 4 + (t - e) / o : 0;
  return { h: 60 * (a < 0 ? a + 6 : a), s: n ? o / n * 100 : 0, v: n / 255 * 100, a: r };
}, Bn = function(i) {
  var t = i.h, e = i.s, s = i.v, r = i.a;
  t = t / 360 * 6, e /= 100, s /= 100;
  var n = Math.floor(t), o = s * (1 - e), a = s * (1 - (t - n) * e), h = s * (1 - (1 - t + n) * e), c = n % 6;
  return { r: 255 * [s, a, o, o, h, s][c], g: 255 * [h, s, s, a, o, o][c], b: 255 * [o, o, h, s, s, a][c], a: r };
}, yr = function(i) {
  return { h: En(i.h), s: Ot(i.s, 0, 100), l: Ot(i.l, 0, 100), a: Ot(i.a) };
}, xr = function(i) {
  return { h: St(i.h), s: St(i.s), l: St(i.l), a: St(i.a, 3) };
}, _r = function(i) {
  return Bn((e = (t = i).s, { h: t.h, s: (e *= ((s = t.l) < 50 ? s : 100 - s) / 100) > 0 ? 2 * e / (s + e) * 100 : 0, v: s + e, a: t.a }));
  var t, e, s;
}, ze = function(i) {
  return { h: (t = Ln(i)).h, s: (r = (200 - (e = t.s)) * (s = t.v) / 100) > 0 && r < 200 ? e * s / 100 / (r <= 100 ? r : 200 - r) * 100 : 0, l: r / 2, a: t.a };
  var t, e, s, r;
}, Ra = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, za = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Da = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, ja = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, yi = { string: [[function(i) {
  var t = Oa.exec(i);
  return t ? (i = t[1]).length <= 4 ? { r: parseInt(i[0] + i[0], 16), g: parseInt(i[1] + i[1], 16), b: parseInt(i[2] + i[2], 16), a: i.length === 4 ? St(parseInt(i[3] + i[3], 16) / 255, 2) : 1 } : i.length === 6 || i.length === 8 ? { r: parseInt(i.substr(0, 2), 16), g: parseInt(i.substr(2, 2), 16), b: parseInt(i.substr(4, 2), 16), a: i.length === 8 ? St(parseInt(i.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(i) {
  var t = Da.exec(i) || ja.exec(i);
  return t ? t[2] !== t[4] || t[4] !== t[6] ? null : gr({ r: Number(t[1]) / (t[2] ? 100 / 255 : 1), g: Number(t[3]) / (t[4] ? 100 / 255 : 1), b: Number(t[5]) / (t[6] ? 100 / 255 : 1), a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1) }) : null;
}, "rgb"], [function(i) {
  var t = Ra.exec(i) || za.exec(i);
  if (!t) return null;
  var e, s, r = yr({ h: (e = t[1], s = t[2], s === void 0 && (s = "deg"), Number(e) * (Fa[s] || 1)), s: Number(t[3]), l: Number(t[4]), a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1) });
  return _r(r);
}, "hsl"]], object: [[function(i) {
  var t = i.r, e = i.g, s = i.b, r = i.a, n = r === void 0 ? 1 : r;
  return Jt(t) && Jt(e) && Jt(s) ? gr({ r: Number(t), g: Number(e), b: Number(s), a: Number(n) }) : null;
}, "rgb"], [function(i) {
  var t = i.h, e = i.s, s = i.l, r = i.a, n = r === void 0 ? 1 : r;
  if (!Jt(t) || !Jt(e) || !Jt(s)) return null;
  var o = yr({ h: Number(t), s: Number(e), l: Number(s), a: Number(n) });
  return _r(o);
}, "hsl"], [function(i) {
  var t = i.h, e = i.s, s = i.v, r = i.a, n = r === void 0 ? 1 : r;
  if (!Jt(t) || !Jt(e) || !Jt(s)) return null;
  var o = function(a) {
    return { h: En(a.h), s: Ot(a.s, 0, 100), v: Ot(a.v, 0, 100), a: Ot(a.a) };
  }({ h: Number(t), s: Number(e), v: Number(s), a: Number(n) });
  return Bn(o);
}, "hsv"]] }, br = function(i, t) {
  for (var e = 0; e < t.length; e++) {
    var s = t[e][0](i);
    if (s) return [s, t[e][1]];
  }
  return [null, void 0];
}, Ga = function(i) {
  return typeof i == "string" ? br(i.trim(), yi.string) : typeof i == "object" && i !== null ? br(i, yi.object) : [null, void 0];
}, Fs = function(i, t) {
  var e = ze(i);
  return { h: e.h, s: Ot(e.s + 100 * t, 0, 100), l: e.l, a: e.a };
}, Os = function(i) {
  return (299 * i.r + 587 * i.g + 114 * i.b) / 1e3 / 255;
}, wr = function(i, t) {
  var e = ze(i);
  return { h: e.h, s: e.s, l: Ot(e.l + 100 * t, 0, 100), a: e.a };
}, xi = function() {
  function i(t) {
    this.parsed = Ga(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return i.prototype.isValid = function() {
    return this.parsed !== null;
  }, i.prototype.brightness = function() {
    return St(Os(this.rgba), 2);
  }, i.prototype.isDark = function() {
    return Os(this.rgba) < 0.5;
  }, i.prototype.isLight = function() {
    return Os(this.rgba) >= 0.5;
  }, i.prototype.toHex = function() {
    return t = Ns(this.rgba), e = t.r, s = t.g, r = t.b, o = (n = t.a) < 1 ? Ke(St(255 * n)) : "", "#" + Ke(e) + Ke(s) + Ke(r) + o;
    var t, e, s, r, n, o;
  }, i.prototype.toRgb = function() {
    return Ns(this.rgba);
  }, i.prototype.toRgbString = function() {
    return t = Ns(this.rgba), e = t.r, s = t.g, r = t.b, (n = t.a) < 1 ? "rgba(" + e + ", " + s + ", " + r + ", " + n + ")" : "rgb(" + e + ", " + s + ", " + r + ")";
    var t, e, s, r, n;
  }, i.prototype.toHsl = function() {
    return xr(ze(this.rgba));
  }, i.prototype.toHslString = function() {
    return t = xr(ze(this.rgba)), e = t.h, s = t.s, r = t.l, (n = t.a) < 1 ? "hsla(" + e + ", " + s + "%, " + r + "%, " + n + ")" : "hsl(" + e + ", " + s + "%, " + r + "%)";
    var t, e, s, r, n;
  }, i.prototype.toHsv = function() {
    return t = Ln(this.rgba), { h: St(t.h), s: St(t.s), v: St(t.v), a: St(t.a, 3) };
    var t;
  }, i.prototype.invert = function() {
    return Ut({ r: 255 - (t = this.rgba).r, g: 255 - t.g, b: 255 - t.b, a: t.a });
    var t;
  }, i.prototype.saturate = function(t) {
    return t === void 0 && (t = 0.1), Ut(Fs(this.rgba, t));
  }, i.prototype.desaturate = function(t) {
    return t === void 0 && (t = 0.1), Ut(Fs(this.rgba, -t));
  }, i.prototype.grayscale = function() {
    return Ut(Fs(this.rgba, -1));
  }, i.prototype.lighten = function(t) {
    return t === void 0 && (t = 0.1), Ut(wr(this.rgba, t));
  }, i.prototype.darken = function(t) {
    return t === void 0 && (t = 0.1), Ut(wr(this.rgba, -t));
  }, i.prototype.rotate = function(t) {
    return t === void 0 && (t = 15), this.hue(this.hue() + t);
  }, i.prototype.alpha = function(t) {
    return typeof t == "number" ? Ut({ r: (e = this.rgba).r, g: e.g, b: e.b, a: t }) : St(this.rgba.a, 3);
    var e;
  }, i.prototype.hue = function(t) {
    var e = ze(this.rgba);
    return typeof t == "number" ? Ut({ h: t, s: e.s, l: e.l, a: e.a }) : St(e.h);
  }, i.prototype.isEqual = function(t) {
    return this.toHex() === Ut(t).toHex();
  }, i;
}(), Ut = function(i) {
  return i instanceof xi ? i : new xi(i);
}, vr = [], Wa = function(i) {
  i.forEach(function(t) {
    vr.indexOf(t) < 0 && (t(xi, yi), vr.push(t));
  });
};
function $a(i, t) {
  var e = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, s = {};
  for (var r in e) s[e[r]] = r;
  var n = {};
  i.prototype.toName = function(o) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
    var a, h, c = s[this.toHex()];
    if (c) return c;
    if (o?.closest) {
      var l = this.toRgb(), u = 1 / 0, f = "black";
      if (!n.length) for (var d in e) n[d] = new i(e[d]).toRgb();
      for (var g in e) {
        var y = (a = l, h = n[g], Math.pow(a.r - h.r, 2) + Math.pow(a.g - h.g, 2) + Math.pow(a.b - h.b, 2));
        y < u && (u = y, f = g);
      }
      return f;
    }
  }, t.string.push([function(o) {
    var a = o.toLowerCase(), h = a === "transparent" ? "#0000" : e[a];
    return h ? new i(h).toRgb() : null;
  }, "name"]);
}
Wa([$a]);
const xe = class Be {
  /**
   * @param {ColorSource} value - Optional value to use, if not provided, white is used.
   */
  constructor(t = 16777215) {
    this._value = null, this._components = new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = t;
  }
  /** Get red component (0 - 1) */
  get red() {
    return this._components[0];
  }
  /** Get green component (0 - 1) */
  get green() {
    return this._components[1];
  }
  /** Get blue component (0 - 1) */
  get blue() {
    return this._components[2];
  }
  /** Get alpha component (0 - 1) */
  get alpha() {
    return this._components[3];
  }
  /**
   * Set the value, suitable for chaining
   * @param value
   * @see Color.value
   */
  setValue(t) {
    return this.value = t, this;
  }
  /**
   * The current color source.
   *
   * When setting:
   * - Setting to an instance of `Color` will copy its color source and components.
   * - Otherwise, `Color` will try to normalize the color source and set the components.
   *   If the color source is invalid, an `Error` will be thrown and the `Color` will left unchanged.
   *
   * Note: The `null` in the setter's parameter type is added to match the TypeScript rule: return type of getter
   * must be assignable to its setter's parameter type. Setting `value` to `null` will throw an `Error`.
   *
   * When getting:
   * - A return value of `null` means the previous value was overridden (e.g., {@link Color.multiply multiply},
   *   {@link Color.premultiply premultiply} or {@link Color.round round}).
   * - Otherwise, the color source used when setting is returned.
   */
  set value(t) {
    if (t instanceof Be)
      this._value = this._cloneSource(t._value), this._int = t._int, this._components.set(t._components);
    else {
      if (t === null)
        throw new Error("Cannot set Color#value to null");
      (this._value === null || !this._isSourceEqual(this._value, t)) && (this._value = this._cloneSource(t), this._normalize(this._value));
    }
  }
  get value() {
    return this._value;
  }
  /**
   * Copy a color source internally.
   * @param value - Color source
   */
  _cloneSource(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof Number || t === null ? t : Array.isArray(t) || ArrayBuffer.isView(t) ? t.slice(0) : typeof t == "object" && t !== null ? { ...t } : t;
  }
  /**
   * Equality check for color sources.
   * @param value1 - First color source
   * @param value2 - Second color source
   * @returns `true` if the color sources are equal, `false` otherwise.
   */
  _isSourceEqual(t, e) {
    const s = typeof t;
    if (s !== typeof e)
      return !1;
    if (s === "number" || s === "string" || t instanceof Number)
      return t === e;
    if (Array.isArray(t) && Array.isArray(e) || ArrayBuffer.isView(t) && ArrayBuffer.isView(e))
      return t.length !== e.length ? !1 : t.every((n, o) => n === e[o]);
    if (t !== null && e !== null) {
      const n = Object.keys(t), o = Object.keys(e);
      return n.length !== o.length ? !1 : n.every((a) => t[a] === e[a]);
    }
    return t === e;
  }
  /**
   * Convert to a RGBA color object.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1, a: 1 }
   */
  toRgba() {
    const [t, e, s, r] = this._components;
    return { r: t, g: e, b: s, a: r };
  }
  /**
   * Convert to a RGB color object.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1 }
   */
  toRgb() {
    const [t, e, s] = this._components;
    return { r: t, g: e, b: s };
  }
  /** Convert to a CSS-style rgba string: `rgba(255,255,255,1.0)`. */
  toRgbaString() {
    const [t, e, s] = this.toUint8RgbArray();
    return `rgba(${t},${e},${s},${this.alpha})`;
  }
  toUint8RgbArray(t) {
    const [e, s, r] = this._components;
    return this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb), t[0] = Math.round(e * 255), t[1] = Math.round(s * 255), t[2] = Math.round(r * 255), t;
  }
  toArray(t) {
    this._arrayRgba || (this._arrayRgba = []), t || (t = this._arrayRgba);
    const [e, s, r, n] = this._components;
    return t[0] = e, t[1] = s, t[2] = r, t[3] = n, t;
  }
  toRgbArray(t) {
    this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb);
    const [e, s, r] = this._components;
    return t[0] = e, t[1] = s, t[2] = r, t;
  }
  /**
   * Convert to a hexadecimal number.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toNumber(); // returns 16777215
   */
  toNumber() {
    return this._int;
  }
  /**
   * Convert to a BGR number
   * @example
   * import { Color } from 'pixi.js';
   * new Color(0xffcc99).toBgrNumber(); // returns 0x99ccff
   */
  toBgrNumber() {
    const [t, e, s] = this.toUint8RgbArray();
    return (s << 16) + (e << 8) + t;
  }
  /**
   * Convert to a hexadecimal number in little endian format (e.g., BBGGRR).
   * @example
   * import { Color } from 'pixi.js';
   * new Color(0xffcc99).toLittleEndianNumber(); // returns 0x99ccff
   * @returns {number} - The color as a number in little endian format.
   */
  toLittleEndianNumber() {
    const t = this._int;
    return (t >> 16) + (t & 65280) + ((t & 255) << 16);
  }
  /**
   * Multiply with another color. This action is destructive, and will
   * override the previous `value` property to be `null`.
   * @param {ColorSource} value - The color to multiply by.
   */
  multiply(t) {
    const [e, s, r, n] = Be._temp.setValue(t)._components;
    return this._components[0] *= e, this._components[1] *= s, this._components[2] *= r, this._components[3] *= n, this._refreshInt(), this._value = null, this;
  }
  /**
   * Converts color to a premultiplied alpha format. This action is destructive, and will
   * override the previous `value` property to be `null`.
   * @param alpha - The alpha to multiply by.
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
   * @returns {Color} - Itself.
   */
  premultiply(t, e = !0) {
    return e && (this._components[0] *= t, this._components[1] *= t, this._components[2] *= t), this._components[3] = t, this._refreshInt(), this._value = null, this;
  }
  /**
   * Premultiplies alpha with current color.
   * @param {number} alpha - The alpha to multiply by.
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
   * @returns {number} tint multiplied by alpha
   */
  toPremultiplied(t, e = !0) {
    if (t === 1)
      return (255 << 24) + this._int;
    if (t === 0)
      return e ? 0 : this._int;
    let s = this._int >> 16 & 255, r = this._int >> 8 & 255, n = this._int & 255;
    return e && (s = s * t + 0.5 | 0, r = r * t + 0.5 | 0, n = n * t + 0.5 | 0), (t * 255 << 24) + (s << 16) + (r << 8) + n;
  }
  /**
   * Convert to a hexadecimal string.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toHex(); // returns "#ffffff"
   */
  toHex() {
    const t = this._int.toString(16);
    return `#${"000000".substring(0, 6 - t.length) + t}`;
  }
  /**
   * Convert to a hexadecimal string with alpha.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toHexa(); // returns "#ffffffff"
   */
  toHexa() {
    const e = Math.round(this._components[3] * 255).toString(16);
    return this.toHex() + "00".substring(0, 2 - e.length) + e;
  }
  /**
   * Set alpha, suitable for chaining.
   * @param alpha
   */
  setAlpha(t) {
    return this._components[3] = this._clamp(t), this;
  }
  /**
   * Normalize the input value into rgba
   * @param value - Input value
   */
  _normalize(t) {
    let e, s, r, n;
    if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
      const o = t;
      e = (o >> 16 & 255) / 255, s = (o >> 8 & 255) / 255, r = (o & 255) / 255, n = 1;
    } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t), [e, s, r, n = 1] = t;
    else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t, 0, 255), [e, s, r, n = 255] = t, e /= 255, s /= 255, r /= 255, n /= 255;
    else if (typeof t == "string" || typeof t == "object") {
      if (typeof t == "string") {
        const a = Be.HEX_PATTERN.exec(t);
        a && (t = `#${a[2]}`);
      }
      const o = Ut(t);
      o.isValid() && ({ r: e, g: s, b: r, a: n } = o.rgba, e /= 255, s /= 255, r /= 255);
    }
    if (e !== void 0)
      this._components[0] = e, this._components[1] = s, this._components[2] = r, this._components[3] = n, this._refreshInt();
    else
      throw new Error(`Unable to convert color ${t}`);
  }
  /** Refresh the internal color rgb number */
  _refreshInt() {
    this._clamp(this._components);
    const [t, e, s] = this._components;
    this._int = (t * 255 << 16) + (e * 255 << 8) + (s * 255 | 0);
  }
  /**
   * Clamps values to a range. Will override original values
   * @param value - Value(s) to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   */
  _clamp(t, e = 0, s = 1) {
    return typeof t == "number" ? Math.min(Math.max(t, e), s) : (t.forEach((r, n) => {
      t[n] = Math.min(Math.max(r, e), s);
    }), t);
  }
  /**
   * Check if the value is a color-like object
   * @param value - Value to check
   * @returns True if the value is a color-like object
   * @static
   * @example
   * import { Color } from 'pixi.js';
   * Color.isColorLike('white'); // returns true
   * Color.isColorLike(0xffffff); // returns true
   * Color.isColorLike([1, 1, 1]); // returns true
   */
  static isColorLike(t) {
    return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof Be || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
  }
};
xe.shared = new xe();
xe._temp = new xe();
xe.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let ut = xe;
const Ua = {
  cullArea: null,
  cullable: !1,
  cullableChildren: !0
};
class Wi {
  /**
   * Constructs a new Pool.
   * @param ClassType - The constructor of the items in the pool.
   * @param {number} [initialSize] - The initial size of the pool.
   */
  constructor(t, e) {
    this._pool = [], this._count = 0, this._index = 0, this._classType = t, e && this.prepopulate(e);
  }
  /**
   * Prepopulates the pool with a given number of items.
   * @param total - The number of items to add to the pool.
   */
  prepopulate(t) {
    for (let e = 0; e < t; e++)
      this._pool[this._index++] = new this._classType();
    this._count += t;
  }
  /**
   * Gets an item from the pool. Calls the item's `init` method if it exists.
   * If there are no items left in the pool, a new one will be created.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t) {
    let e;
    return this._index > 0 ? e = this._pool[--this._index] : e = new this._classType(), e.init?.(t), e;
  }
  /**
   * Returns an item to the pool. Calls the item's `reset` method if it exists.
   * @param {T} item - The item to return to the pool.
   */
  return(t) {
    t.reset?.(), this._pool[this._index++] = t;
  }
  /**
   * Gets the number of items in the pool.
   * @readonly
   * @member {number}
   */
  get totalSize() {
    return this._count;
  }
  /**
   * Gets the number of items in the pool that are free to use without needing to create more.
   * @readonly
   * @member {number}
   */
  get totalFree() {
    return this._index;
  }
  /**
   * Gets the number of items in the pool that are currently in use.
   * @readonly
   * @member {number}
   */
  get totalUsed() {
    return this._count - this._index;
  }
  /** clears the pool - mainly used for debugging! */
  clear() {
    this._pool.length = 0, this._index = 0;
  }
}
class Ha {
  constructor() {
    this._poolsByClass = /* @__PURE__ */ new Map();
  }
  /**
   * Prepopulates a specific pool with a given number of items.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {number} total - The number of items to add to the pool.
   */
  prepopulate(t, e) {
    this.getPool(t).prepopulate(e);
  }
  /**
   * Gets an item from a specific pool.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t, e) {
    return this.getPool(t).get(e);
  }
  /**
   * Returns an item to its respective pool.
   * @param {PoolItem} item - The item to return to the pool.
   */
  return(t) {
    this.getPool(t.constructor).return(t);
  }
  /**
   * Gets a specific pool based on the class type.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} ClassType - The constructor of the items in the pool.
   * @returns {Pool<T>} The pool of the given class type.
   */
  getPool(t) {
    return this._poolsByClass.has(t) || this._poolsByClass.set(t, new Wi(t)), this._poolsByClass.get(t);
  }
  /** gets the usage stats of each pool in the system */
  stats() {
    const t = {};
    return this._poolsByClass.forEach((e) => {
      const s = t[e._classType.name] ? e._classType.name + e._classType.ID : e._classType.name;
      t[s] = {
        free: e.totalFree,
        used: e.totalUsed,
        size: e.totalSize
      };
    }), t;
  }
}
const Qt = new Ha(), Ya = {
  /**
   * Is this container cached as a texture?
   * @readonly
   * @type {boolean}
   * @memberof scene.Container#
   */
  get isCachedAsTexture() {
    return !!this.renderGroup?.isCachedAsTexture;
  },
  cacheAsTexture(i) {
    typeof i == "boolean" && i === !1 ? this.disableRenderGroup() : (this.enableRenderGroup(), this.renderGroup.enableCacheAsTexture(i === !0 ? {} : i));
  },
  /**
   * Updates the cached texture. Will flag that this container's cached texture needs to be redrawn.
   * This will happen on the next render.
   * @memberof scene.Container#
   */
  updateCacheTexture() {
    this.renderGroup?.updateCacheTexture();
  },
  /**
   * Allows backwards compatibility with pixi.js below version v8. Use `cacheAsTexture` instead.
   * @deprecated
   */
  get cacheAsBitmap() {
    return this.isCachedAsTexture;
  },
  /**
   * @deprecated
   */
  set cacheAsBitmap(i) {
    ot("v8.6.0", "cacheAsBitmap is deprecated, use cacheAsTexture instead."), this.cacheAsTexture(i);
  }
};
function Va(i, t, e) {
  const s = i.length;
  let r;
  if (t >= s || e === 0)
    return;
  e = t + e > s ? s - t : e;
  const n = s - e;
  for (r = t; r < n; ++r)
    i[r] = i[r + e];
  i.length = n;
}
const Xa = {
  allowChildren: !0,
  /**
   * Removes all children from this container that are within the begin and end indexes.
   * @param beginIndex - The beginning position.
   * @param endIndex - The ending position. Default value is size of the container.
   * @returns - List of removed children
   * @memberof scene.Container#
   */
  removeChildren(i = 0, t) {
    const e = t ?? this.children.length, s = e - i, r = [];
    if (s > 0 && s <= e) {
      for (let o = e - 1; o >= i; o--) {
        const a = this.children[o];
        a && (r.push(a), a.parent = null);
      }
      Va(this.children, i, e);
      const n = this.renderGroup || this.parentRenderGroup;
      n && n.removeChildren(r);
      for (let o = 0; o < r.length; ++o)
        this.emit("childRemoved", r[o], this, o), r[o].emit("removed", this);
      return r;
    } else if (s === 0 && this.children.length === 0)
      return r;
    throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
  },
  /**
   * Removes a child from the specified index position.
   * @param index - The index to get the child from
   * @returns The child that was removed.
   * @memberof scene.Container#
   */
  removeChildAt(i) {
    const t = this.getChildAt(i);
    return this.removeChild(t);
  },
  /**
   * Returns the child at the specified index
   * @param index - The index to get the child at
   * @returns - The child at the given index, if any.
   * @memberof scene.Container#
   */
  getChildAt(i) {
    if (i < 0 || i >= this.children.length)
      throw new Error(`getChildAt: Index (${i}) does not exist.`);
    return this.children[i];
  },
  /**
   * Changes the position of an existing child in the container
   * @param child - The child Container instance for which you want to change the index number
   * @param index - The resulting index number for the child container
   * @memberof scene.Container#
   */
  setChildIndex(i, t) {
    if (t < 0 || t >= this.children.length)
      throw new Error(`The index ${t} supplied is out of bounds ${this.children.length}`);
    this.getChildIndex(i), this.addChildAt(i, t);
  },
  /**
   * Returns the index position of a child Container instance
   * @param child - The Container instance to identify
   * @returns - The index position of the child container to identify
   * @memberof scene.Container#
   */
  getChildIndex(i) {
    const t = this.children.indexOf(i);
    if (t === -1)
      throw new Error("The supplied Container must be a child of the caller");
    return t;
  },
  /**
   * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown.
   * If the child is already in this container, it will be moved to the specified index.
   * @param {Container} child - The child to add.
   * @param {number} index - The absolute index where the child will be positioned at the end of the operation.
   * @returns {Container} The child that was added.
   * @memberof scene.Container#
   */
  addChildAt(i, t) {
    this.allowChildren || ot(yt, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
    const { children: e } = this;
    if (t < 0 || t > e.length)
      throw new Error(`${i}addChildAt: The index ${t} supplied is out of bounds ${e.length}`);
    if (i.parent) {
      const r = i.parent.children.indexOf(i);
      if (i.parent === this && r === t)
        return i;
      r !== -1 && i.parent.children.splice(r, 1);
    }
    t === e.length ? e.push(i) : e.splice(t, 0, i), i.parent = this, i.didChange = !0, i._updateFlags = 15;
    const s = this.renderGroup || this.parentRenderGroup;
    return s && s.addChild(i), this.sortableChildren && (this.sortDirty = !0), this.emit("childAdded", i, this, t), i.emit("added", this), i;
  },
  /**
   * Swaps the position of 2 Containers within this container.
   * @param child - First container to swap
   * @param child2 - Second container to swap
   * @memberof scene.Container#
   */
  swapChildren(i, t) {
    if (i === t)
      return;
    const e = this.getChildIndex(i), s = this.getChildIndex(t);
    this.children[e] = t, this.children[s] = i;
    const r = this.renderGroup || this.parentRenderGroup;
    r && (r.structureDidChange = !0), this._didContainerChangeTick++;
  },
  /**
   * Remove the Container from its parent Container. If the Container has no parent, do nothing.
   * @memberof scene.Container#
   */
  removeFromParent() {
    this.parent?.removeChild(this);
  },
  /**
   * Reparent the child to this container, keeping the same worldTransform.
   * @param child - The child to reparent
   * @returns The first child that was reparented.
   * @memberof scene.Container#
   */
  reparentChild(...i) {
    return i.length === 1 ? this.reparentChildAt(i[0], this.children.length) : (i.forEach((t) => this.reparentChildAt(t, this.children.length)), i[0]);
  },
  /**
   * Reparent the child to this container at the specified index, keeping the same worldTransform.
   * @param child - The child to reparent
   * @param index - The index to reparent the child to
   * @memberof scene.Container#
   */
  reparentChildAt(i, t) {
    if (i.parent === this)
      return this.setChildIndex(i, t), i;
    const e = i.worldTransform.clone();
    i.removeFromParent(), this.addChildAt(i, t);
    const s = this.worldTransform.clone();
    return s.invert(), e.prepend(s), i.setFromMatrix(e), i;
  }
};
class Mr {
  constructor() {
    this.pipe = "filter", this.priority = 1;
  }
  destroy() {
    for (let t = 0; t < this.filters.length; t++)
      this.filters[t].destroy();
    this.filters = null, this.filterArea = null;
  }
}
class qa {
  constructor() {
    this._effectClasses = [], this._tests = [], this._initialized = !1;
  }
  init() {
    this._initialized || (this._initialized = !0, this._effectClasses.forEach((t) => {
      this.add({
        test: t.test,
        maskClass: t
      });
    }));
  }
  add(t) {
    this._tests.push(t);
  }
  getMaskEffect(t) {
    this._initialized || this.init();
    for (let e = 0; e < this._tests.length; e++) {
      const s = this._tests[e];
      if (s.test(t))
        return Qt.get(s.maskClass, t);
    }
    return t;
  }
  returnMaskEffect(t) {
    Qt.return(t);
  }
}
const _i = new qa();
bt.handleByList(U.MaskEffect, _i._effectClasses);
const Za = {
  _maskEffect: null,
  _maskOptions: {
    inverse: !1
  },
  _filterEffect: null,
  /**
   * @todo Needs docs.
   * @memberof scene.Container#
   * @type {Array<Effect>}
   */
  effects: [],
  _markStructureAsChanged() {
    const i = this.renderGroup || this.parentRenderGroup;
    i && (i.structureDidChange = !0);
  },
  /**
   * @todo Needs docs.
   * @param effect - The effect to add.
   * @memberof scene.Container#
   * @ignore
   */
  addEffect(i) {
    this.effects.indexOf(i) === -1 && (this.effects.push(i), this.effects.sort((e, s) => e.priority - s.priority), this._markStructureAsChanged(), this._updateIsSimple());
  },
  /**
   * @todo Needs docs.
   * @param effect - The effect to remove.
   * @memberof scene.Container#
   * @ignore
   */
  removeEffect(i) {
    const t = this.effects.indexOf(i);
    t !== -1 && (this.effects.splice(t, 1), this._markStructureAsChanged(), this._updateIsSimple());
  },
  set mask(i) {
    const t = this._maskEffect;
    t?.mask !== i && (t && (this.removeEffect(t), _i.returnMaskEffect(t), this._maskEffect = null), i != null && (this._maskEffect = _i.getMaskEffect(i), this.addEffect(this._maskEffect)));
  },
  /**
   * Used to set mask and control mask options.
   * @param options
   * @example
   * import { Graphics, Sprite } from 'pixi.js';
   *
   * const graphics = new Graphics();
   * graphics.beginFill(0xFF3300);
   * graphics.drawRect(50, 250, 100, 100);
   * graphics.endFill();
   *
   * const sprite = new Sprite(texture);
   * sprite.setMask({
   *     mask: graphics,
   *     inverse: true,
   * });
   * @memberof scene.Container#
   */
  setMask(i) {
    this._maskOptions = {
      ...this._maskOptions,
      ...i
    }, i.mask && (this.mask = i.mask), this._markStructureAsChanged();
  },
  /**
   * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
   * object to the shape of the mask applied to it. In PixiJS a regular mask must be a
   * {@link Graphics} or a {@link Sprite} object. This allows for much faster masking in canvas as it
   * utilities shape clipping. Furthermore, a mask of an object must be in the subtree of its parent.
   * Otherwise, `getLocalBounds` may calculate incorrect bounds, which makes the container's width and height wrong.
   * To remove a mask, set this property to `null`.
   *
   * For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.
   * @example
   * import { Graphics, Sprite } from 'pixi.js';
   *
   * const graphics = new Graphics();
   * graphics.beginFill(0xFF3300);
   * graphics.drawRect(50, 250, 100, 100);
   * graphics.endFill();
   *
   * const sprite = new Sprite(texture);
   * sprite.mask = graphics;
   * @memberof scene.Container#
   */
  get mask() {
    return this._maskEffect?.mask;
  },
  set filters(i) {
    !Array.isArray(i) && i && (i = [i]);
    const t = this._filterEffect || (this._filterEffect = new Mr());
    i = i;
    const e = i?.length > 0, s = t.filters?.length > 0, r = e !== s;
    i = Array.isArray(i) ? i.slice(0) : i, t.filters = Object.freeze(i), r && (e ? this.addEffect(t) : (this.removeEffect(t), t.filters = i ?? null));
  },
  /**
   * Sets the filters for the displayObject.
   * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
   * To remove filters simply set this property to `'null'`.
   * @memberof scene.Container#
   */
  get filters() {
    return this._filterEffect?.filters;
  },
  set filterArea(i) {
    this._filterEffect || (this._filterEffect = new Mr()), this._filterEffect.filterArea = i;
  },
  /**
   * The area the filter is applied to. This is used as more of an optimization
   * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.
   *
   * Also works as an interaction mask.
   * @memberof scene.Container#
   */
  get filterArea() {
    return this._filterEffect?.filterArea;
  }
}, Ka = {
  /**
   * The instance label of the object.
   * @memberof scene.Container#
   * @member {string} label
   */
  label: null,
  /**
   * The instance name of the object.
   * @deprecated since 8.0.0
   * @see scene.Container#label
   * @member {string} name
   * @memberof scene.Container#
   */
  get name() {
    return ot(yt, "Container.name property has been removed, use Container.label instead"), this.label;
  },
  set name(i) {
    ot(yt, "Container.name property has been removed, use Container.label instead"), this.label = i;
  },
  /**
   * @method getChildByName
   * @deprecated since 8.0.0
   * @param {string} name - Instance name.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @returns {Container} The child with the specified name.
   * @see scene.Container#getChildByLabel
   * @memberof scene.Container#
   */
  getChildByName(i, t = !1) {
    return this.getChildByLabel(i, t);
  },
  /**
   * Returns the first child in the container with the specified label.
   *
   * Recursive searches are done in a pre-order traversal.
   * @memberof scene.Container#
   * @param {string|RegExp} label - Instance label.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @returns {Container} The child with the specified label.
   */
  getChildByLabel(i, t = !1) {
    const e = this.children;
    for (let s = 0; s < e.length; s++) {
      const r = e[s];
      if (r.label === i || i instanceof RegExp && i.test(r.label))
        return r;
    }
    if (t)
      for (let s = 0; s < e.length; s++) {
        const n = e[s].getChildByLabel(i, !0);
        if (n)
          return n;
      }
    return null;
  },
  /**
   * Returns all children in the container with the specified label.
   * @memberof scene.Container#
   * @param {string|RegExp} label - Instance label.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @param {Container[]} [out=[]] - The array to store matching children in.
   * @returns {Container[]} An array of children with the specified label.
   */
  getChildrenByLabel(i, t = !1, e = []) {
    const s = this.children;
    for (let r = 0; r < s.length; r++) {
      const n = s[r];
      (n.label === i || i instanceof RegExp && i.test(n.label)) && e.push(n);
    }
    if (t)
      for (let r = 0; r < s.length; r++)
        s[r].getChildrenByLabel(i, !0, e);
    return e;
  }
}, kt = new Wi(et), _e = new Wi(Xt);
function Nn(i, t, e) {
  e.clear();
  let s, r;
  return i.parent ? t ? s = i.parent.worldTransform : (r = kt.get().identity(), s = $i(i, r)) : s = et.IDENTITY, Fn(i, e, s, t), r && kt.return(r), e.isValid || e.set(0, 0, 0, 0), e;
}
function Fn(i, t, e, s) {
  if (!i.visible || !i.measurable)
    return;
  let r;
  s ? r = i.worldTransform : (i.updateLocalTransform(), r = kt.get(), r.appendFrom(i.localTransform, e));
  const n = t, o = !!i.effects.length;
  if (o && (t = _e.get().clear()), i.boundsArea)
    t.addRect(i.boundsArea, r);
  else {
    i.bounds && (t.matrix = r, t.addBounds(i.bounds));
    for (let a = 0; a < i.children.length; a++)
      Fn(i.children[a], t, r, s);
  }
  if (o) {
    for (let a = 0; a < i.effects.length; a++)
      i.effects[a].addBounds?.(t);
    n.addBounds(t, et.IDENTITY), _e.return(t);
  }
  s || kt.return(r);
}
function $i(i, t) {
  const e = i.parent;
  return e && ($i(e, t), e.updateLocalTransform(), t.append(e.localTransform)), t;
}
function On(i, t) {
  if (i === 16777215 || !t)
    return t;
  if (t === 16777215 || !i)
    return i;
  const e = i >> 16 & 255, s = i >> 8 & 255, r = i & 255, n = t >> 16 & 255, o = t >> 8 & 255, a = t & 255, h = e * n / 255 | 0, c = s * o / 255 | 0, l = r * a / 255 | 0;
  return (h << 16) + (c << 8) + l;
}
const Sr = 16777215;
function Ar(i, t) {
  return i === Sr ? t : t === Sr ? i : On(i, t);
}
function cs(i) {
  return ((i & 255) << 16) + (i & 65280) + (i >> 16 & 255);
}
const Ja = {
  /**
   * Returns the global (compound) alpha of the container within the scene.
   * @param skipUpdate - Performance optimization flag:
   *   - If false (default): Recalculates the entire alpha chain through parents for accuracy
   *   - If true: Uses cached worldAlpha from the last render pass for better performance
   * @returns The resulting alpha value (between 0 and 1)
   * @example
   * // Accurate but slower - recalculates entire alpha chain
   * const preciseAlpha = container.getGlobalAlpha();
   *
   * // Faster but may be outdated - uses cached alpha
   * const cachedAlpha = container.getGlobalAlpha(true);
   */
  getGlobalAlpha(i) {
    if (i)
      return this.renderGroup ? this.renderGroup.worldAlpha : this.parentRenderGroup ? this.parentRenderGroup.worldAlpha * this.alpha : this.alpha;
    let t = this.alpha, e = this.parent;
    for (; e; )
      t *= e.alpha, e = e.parent;
    return t;
  },
  /**
   * Returns the global transform matrix of the container within the scene.
   * @param matrix - Optional matrix to store the result. If not provided, a new Matrix will be created.
   * @param skipUpdate - Performance optimization flag:
   *   - If false (default): Recalculates the entire transform chain for accuracy
   *   - If true: Uses cached worldTransform from the last render pass for better performance
   * @returns The resulting transformation matrix (either the input matrix or a new one)
   * @example
   * // Accurate but slower - recalculates entire transform chain
   * const preciseTransform = container.getGlobalTransform();
   *
   * // Faster but may be outdated - uses cached transform
   * const cachedTransform = container.getGlobalTransform(undefined, true);
   *
   * // Reuse existing matrix
   * const existingMatrix = new Matrix();
   * container.getGlobalTransform(existingMatrix);
   */
  getGlobalTransform(i, t) {
    if (t)
      return i.copyFrom(this.worldTransform);
    this.updateLocalTransform();
    const e = $i(this, kt.get().identity());
    return i.appendFrom(this.localTransform, e), kt.return(e), i;
  },
  /**
   * Returns the global (compound) tint color of the container within the scene.
   * @param skipUpdate - Performance optimization flag:
   *   - If false (default): Recalculates the entire tint chain through parents for accuracy
   *   - If true: Uses cached worldColor from the last render pass for better performance
   * @returns The resulting tint color as a 24-bit RGB number (0xRRGGBB)
   * @example
   * // Accurate but slower - recalculates entire tint chain
   * const preciseTint = container.getGlobalTint();
   *
   * // Faster but may be outdated - uses cached tint
   * const cachedTint = container.getGlobalTint(true);
   */
  getGlobalTint(i) {
    if (i)
      return this.renderGroup ? cs(this.renderGroup.worldColor) : this.parentRenderGroup ? cs(
        Ar(this.localColor, this.parentRenderGroup.worldColor)
      ) : this.tint;
    let t = this.localColor, e = this.parent;
    for (; e; )
      t = Ar(t, e.localColor), e = e.parent;
    return cs(t);
  }
};
let Rs = 0;
const Cr = 500;
function xt(...i) {
  Rs !== Cr && (Rs++, Rs === Cr ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...i));
}
function Rn(i, t, e) {
  return t.clear(), e || (e = et.IDENTITY), zn(i, t, e, i, !0), t.isValid || t.set(0, 0, 0, 0), t;
}
function zn(i, t, e, s, r) {
  let n;
  if (r)
    n = kt.get(), n = e.copyTo(n);
  else {
    if (!i.visible || !i.measurable)
      return;
    i.updateLocalTransform();
    const h = i.localTransform;
    n = kt.get(), n.appendFrom(h, e);
  }
  const o = t, a = !!i.effects.length;
  if (a && (t = _e.get().clear()), i.boundsArea)
    t.addRect(i.boundsArea, n);
  else {
    i.renderPipeId && (t.matrix = n, t.addBounds(i.bounds));
    const h = i.children;
    for (let c = 0; c < h.length; c++)
      zn(h[c], t, n, s, !1);
  }
  if (a) {
    for (let h = 0; h < i.effects.length; h++)
      i.effects[h].addLocalBounds?.(t, s);
    o.addBounds(t, et.IDENTITY), _e.return(t);
  }
  kt.return(n);
}
function Dn(i, t) {
  const e = i.children;
  for (let s = 0; s < e.length; s++) {
    const r = e[s], n = r.uid, o = (r._didViewChangeTick & 65535) << 16 | r._didContainerChangeTick & 65535, a = t.index;
    (t.data[a] !== n || t.data[a + 1] !== o) && (t.data[t.index] = n, t.data[t.index + 1] = o, t.didChange = !0), t.index = a + 2, r.children.length && Dn(r, t);
  }
  return t.didChange;
}
const Qa = new et(), th = {
  _localBoundsCacheId: -1,
  _localBoundsCacheData: null,
  _setWidth(i, t) {
    const e = Math.sign(this.scale.x) || 1;
    t !== 0 ? this.scale.x = i / t * e : this.scale.x = e;
  },
  _setHeight(i, t) {
    const e = Math.sign(this.scale.y) || 1;
    t !== 0 ? this.scale.y = i / t * e : this.scale.y = e;
  },
  /**
   * Retrieves the local bounds of the container as a Bounds object.
   * @returns - The bounding area.
   * @memberof scene.Container#
   */
  getLocalBounds() {
    this._localBoundsCacheData || (this._localBoundsCacheData = {
      data: [],
      index: 1,
      didChange: !1,
      localBounds: new Xt()
    });
    const i = this._localBoundsCacheData;
    return i.index = 1, i.didChange = !1, i.data[0] !== this._didViewChangeTick && (i.didChange = !0, i.data[0] = this._didViewChangeTick), Dn(this, i), i.didChange && Rn(this, i.localBounds, Qa), i.localBounds;
  },
  /**
   * Calculates and returns the (world) bounds of the display object as a [Rectangle]{@link Rectangle}.
   * @param skipUpdate - Setting to `true` will stop the transforms of the scene graph from
   *  being updated. This means the calculation returned MAY be out of date BUT will give you a
   *  nice performance boost.
   * @param bounds - Optional bounds to store the result of the bounds calculation.
   * @returns - The minimum axis-aligned rectangle in world space that fits around this object.
   * @memberof scene.Container#
   */
  getBounds(i, t) {
    return Nn(this, i, t || new Xt());
  }
}, eh = {
  _onRender: null,
  set onRender(i) {
    const t = this.renderGroup || this.parentRenderGroup;
    if (!i) {
      this._onRender && t?.removeOnRender(this), this._onRender = null;
      return;
    }
    this._onRender || t?.addOnRender(this), this._onRender = i;
  },
  /**
   * This callback is used when the container is rendered. This is where you should add your custom
   * logic that is needed to be run every frame.
   *
   * In v7 many users used `updateTransform` for this, however the way v8 renders objects is different
   * and "updateTransform" is no longer called every frame
   * @example
   * const container = new Container();
   * container.onRender = () => {
   *    container.rotation += 0.01;
   * };
   * @memberof scene.Container#
   */
  get onRender() {
    return this._onRender;
  }
}, sh = {
  _zIndex: 0,
  /**
   * Should children be sorted by zIndex at the next render call.
   *
   * Will get automatically set to true if a new child is added, or if a child's zIndex changes.
   * @type {boolean}
   * @memberof scene.Container#
   */
  sortDirty: !1,
  /**
   * If set to true, the container will sort its children by `zIndex` value
   * when the next render is called, or manually if `sortChildren()` is called.
   *
   * This actually changes the order of elements in the array, so should be treated
   * as a basic solution that is not performant compared to other solutions,
   * such as {@link https://github.com/pixijs/layers PixiJS Layers}
   *
   * Also be aware of that this may not work nicely with the `addChildAt()` function,
   * as the `zIndex` sorting may cause the child to automatically sorted to another position.
   * @type {boolean}
   * @memberof scene.Container#
   */
  sortableChildren: !1,
  /**
   * The zIndex of the container.
   *
   * Setting this value, will automatically set the parent to be sortable. Children will be automatically
   * sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
   * and thus rendered on top of other display objects within the same container.
   * @see scene.Container#sortableChildren
   * @memberof scene.Container#
   */
  get zIndex() {
    return this._zIndex;
  },
  set zIndex(i) {
    this._zIndex !== i && (this._zIndex = i, this.depthOfChildModified());
  },
  depthOfChildModified() {
    this.parent && (this.parent.sortableChildren = !0, this.parent.sortDirty = !0), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0);
  },
  /**
   * Sorts children by zIndex.
   * @memberof scene.Container#
   */
  sortChildren() {
    this.sortDirty && (this.sortDirty = !1, this.children.sort(ih));
  }
};
function ih(i, t) {
  return i._zIndex - t._zIndex;
}
const rh = {
  /**
   * Returns the global position of the container.
   * @param point - The optional point to write the global value to.
   * @param skipUpdate - Should we skip the update transform.
   * @returns - The updated point.
   * @memberof scene.Container#
   */
  getGlobalPosition(i = new Pt(), t = !1) {
    return this.parent ? this.parent.toGlobal(this._position, i, t) : (i.x = this._position.x, i.y = this._position.y), i;
  },
  /**
   * Calculates the global position of the container.
   * @param position - The world origin to calculate from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform.
   * @returns - A point object representing the position of this object.
   * @memberof scene.Container#
   */
  toGlobal(i, t, e = !1) {
    const s = this.getGlobalTransform(kt.get(), e);
    return t = s.apply(i, t), kt.return(s), t;
  },
  /**
   * Calculates the local position of the container relative to another point.
   * @param position - The world origin to calculate from.
   * @param from - The Container to calculate the global position from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform
   * @returns - A point object representing the position of this object
   * @memberof scene.Container#
   */
  toLocal(i, t, e, s) {
    t && (i = t.toGlobal(i, e, s));
    const r = this.getGlobalTransform(kt.get(), s);
    return e = r.applyInverse(i, e), kt.return(r), e;
  }
};
class jn {
  constructor() {
    this.uid = vt("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.gcTick = 0;
  }
  /** reset the instruction set so it can be reused set size back to 0 */
  reset() {
    this.instructionSize = 0;
  }
  /**
   * Add an instruction to the set
   * @param instruction - add an instruction to the set
   */
  add(t) {
    this.instructions[this.instructionSize++] = t;
  }
  /**
   * Log the instructions to the console (for debugging)
   * @internal
   * @ignore
   */
  log() {
    this.instructions.length = this.instructionSize, console.table(this.instructions, ["type", "action"]);
  }
}
let nh = 0;
class oh {
  /**
   * @param textureOptions - options that will be passed to BaseRenderTexture constructor
   * @param {SCALE_MODE} [textureOptions.scaleMode] - See {@link SCALE_MODE} for possible values.
   */
  constructor(t) {
    this._poolKeyHash = /* @__PURE__ */ Object.create(null), this._texturePool = {}, this.textureOptions = t || {}, this.enableFullScreen = !1;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   * @param antialias
   */
  createTexture(t, e, s) {
    const r = new Kt({
      ...this.textureOptions,
      width: t,
      height: e,
      resolution: 1,
      antialias: s,
      autoGarbageCollect: !0
    });
    return new tt({
      source: r,
      label: `texturePool_${nh++}`
    });
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param frameWidth - The minimum width of the render texture.
   * @param frameHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @param antialias
   * @returns The new render texture.
   */
  getOptimalTexture(t, e, s = 1, r) {
    let n = Math.ceil(t * s - 1e-6), o = Math.ceil(e * s - 1e-6);
    n = xs(n), o = xs(o);
    const a = (n << 17) + (o << 1) + (r ? 1 : 0);
    this._texturePool[a] || (this._texturePool[a] = []);
    let h = this._texturePool[a].pop();
    return h || (h = this.createTexture(n, o, r)), h.source._resolution = s, h.source.width = n / s, h.source.height = o / s, h.source.pixelWidth = n, h.source.pixelHeight = o, h.frame.x = 0, h.frame.y = 0, h.frame.width = t, h.frame.height = e, h.updateUvs(), this._poolKeyHash[h.uid] = a, h;
  }
  /**
   * Gets extra texture of the same size as input renderTexture
   * @param texture - The texture to check what size it is.
   * @param antialias - Whether to use antialias.
   * @returns A texture that is a power of two
   */
  getSameSizeTexture(t, e = !1) {
    const s = t.source;
    return this.getOptimalTexture(t.width, t.height, s._resolution, e);
  }
  /**
   * Place a render texture back into the pool.
   * @param renderTexture - The renderTexture to free
   */
  returnTexture(t) {
    const e = this._poolKeyHash[t.uid];
    this._texturePool[e].push(t);
  }
  /**
   * Clears the pool.
   * @param destroyTextures - Destroy all stored textures.
   */
  clear(t) {
    if (t = t !== !1, t)
      for (const e in this._texturePool) {
        const s = this._texturePool[e];
        if (s)
          for (let r = 0; r < s.length; r++)
            s[r].destroy(!0);
      }
    this._texturePool = {};
  }
}
const We = new oh();
class ah {
  constructor() {
    this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new et(), this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = /* @__PURE__ */ Object.create(null), this.updateTick = 0, this.gcTick = 0, this.childrenRenderablesToUpdate = { list: [], index: 0 }, this.structureDidChange = !0, this.instructionSet = new jn(), this._onRenderContainers = [], this.textureNeedsUpdate = !0, this.isCachedAsTexture = !1, this._matrixDirty = 7;
  }
  init(t) {
    this.root = t, t._onRender && this.addOnRender(t), t.didChange = !0;
    const e = t.children;
    for (let s = 0; s < e.length; s++) {
      const r = e[s];
      r._updateFlags = 15, this.addChild(r);
    }
  }
  enableCacheAsTexture(t = {}) {
    this.textureOptions = t, this.isCachedAsTexture = !0, this.textureNeedsUpdate = !0;
  }
  disableCacheAsTexture() {
    this.isCachedAsTexture = !1, this.texture && (We.returnTexture(this.texture), this.texture = null);
  }
  updateCacheTexture() {
    this.textureNeedsUpdate = !0;
  }
  reset() {
    this.renderGroupChildren.length = 0;
    for (const t in this.childrenToUpdate) {
      const e = this.childrenToUpdate[t];
      e.list.fill(null), e.index = 0;
    }
    this.childrenRenderablesToUpdate.index = 0, this.childrenRenderablesToUpdate.list.fill(null), this.root = null, this.updateTick = 0, this.structureDidChange = !0, this._onRenderContainers.length = 0, this.renderGroupParent = null, this.disableCacheAsTexture();
  }
  get localTransform() {
    return this.root.localTransform;
  }
  addRenderGroupChild(t) {
    t.renderGroupParent && t.renderGroupParent._removeRenderGroupChild(t), t.renderGroupParent = this, this.renderGroupChildren.push(t);
  }
  _removeRenderGroupChild(t) {
    const e = this.renderGroupChildren.indexOf(t);
    e > -1 && this.renderGroupChildren.splice(e, 1), t.renderGroupParent = null;
  }
  addChild(t) {
    if (this.structureDidChange = !0, t.parentRenderGroup = this, t.updateTick = -1, t.parent === this.root ? t.relativeRenderGroupDepth = 1 : t.relativeRenderGroupDepth = t.parent.relativeRenderGroupDepth + 1, t.didChange = !0, this.onChildUpdate(t), t.renderGroup) {
      this.addRenderGroupChild(t.renderGroup);
      return;
    }
    t._onRender && this.addOnRender(t);
    const e = t.children;
    for (let s = 0; s < e.length; s++)
      this.addChild(e[s]);
  }
  removeChild(t) {
    if (this.structureDidChange = !0, t._onRender && (t.renderGroup || this.removeOnRender(t)), t.parentRenderGroup = null, t.renderGroup) {
      this._removeRenderGroupChild(t.renderGroup);
      return;
    }
    const e = t.children;
    for (let s = 0; s < e.length; s++)
      this.removeChild(e[s]);
  }
  removeChildren(t) {
    for (let e = 0; e < t.length; e++)
      this.removeChild(t[e]);
  }
  onChildUpdate(t) {
    let e = this.childrenToUpdate[t.relativeRenderGroupDepth];
    e || (e = this.childrenToUpdate[t.relativeRenderGroupDepth] = {
      index: 0,
      list: []
    }), e.list[e.index++] = t;
  }
  updateRenderable(t) {
    t.globalDisplayStatus < 7 || (this.instructionSet.renderPipes[t.renderPipeId].updateRenderable(t), t.didViewUpdate = !1);
  }
  onChildViewUpdate(t) {
    this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = t;
  }
  get isRenderable() {
    return this.root.localDisplayStatus === 7 && this.worldAlpha > 0;
  }
  /**
   * adding a container to the onRender list will make sure the user function
   * passed in to the user defined 'onRender` callBack
   * @param container - the container to add to the onRender list
   */
  addOnRender(t) {
    this._onRenderContainers.push(t);
  }
  removeOnRender(t) {
    this._onRenderContainers.splice(this._onRenderContainers.indexOf(t), 1);
  }
  runOnRender() {
    for (let t = 0; t < this._onRenderContainers.length; t++)
      this._onRenderContainers[t]._onRender();
  }
  destroy() {
    this.disableCacheAsTexture(), this.renderGroupParent = null, this.root = null, this.childrenRenderablesToUpdate = null, this.childrenToUpdate = null, this.renderGroupChildren = null, this._onRenderContainers = null, this.instructionSet = null;
  }
  getChildren(t = []) {
    const e = this.root.children;
    for (let s = 0; s < e.length; s++)
      this._getChildren(e[s], t);
    return t;
  }
  _getChildren(t, e = []) {
    if (e.push(t), t.renderGroup)
      return e;
    const s = t.children;
    for (let r = 0; r < s.length; r++)
      this._getChildren(s[r], e);
    return e;
  }
  invalidateMatrices() {
    this._matrixDirty = 7;
  }
  /**
   * Returns the inverse of the world transform matrix.
   * @returns {Matrix} The inverse of the world transform matrix.
   */
  get inverseWorldTransform() {
    return this._matrixDirty & 1 ? (this._matrixDirty &= -2, this._inverseWorldTransform || (this._inverseWorldTransform = new et()), this._inverseWorldTransform.copyFrom(this.worldTransform).invert()) : this._inverseWorldTransform;
  }
  /**
   * Returns the inverse of the texture offset transform matrix.
   * @returns {Matrix} The inverse of the texture offset transform matrix.
   */
  get textureOffsetInverseTransform() {
    return this._matrixDirty & 2 ? (this._matrixDirty &= -3, this._textureOffsetInverseTransform || (this._textureOffsetInverseTransform = new et()), this._textureOffsetInverseTransform.copyFrom(this.inverseWorldTransform).translate(
      -this._textureBounds.x,
      -this._textureBounds.y
    )) : this._textureOffsetInverseTransform;
  }
  /**
   * Returns the inverse of the parent texture transform matrix.
   * This is used to properly transform coordinates when rendering into cached textures.
   * @returns {Matrix} The inverse of the parent texture transform matrix.
   */
  get inverseParentTextureTransform() {
    if (!(this._matrixDirty & 4))
      return this._inverseParentTextureTransform;
    this._matrixDirty &= -5;
    const t = this._parentCacheAsTextureRenderGroup;
    return t ? (this._inverseParentTextureTransform || (this._inverseParentTextureTransform = new et()), this._inverseParentTextureTransform.copyFrom(this.worldTransform).prepend(t.inverseWorldTransform).translate(
      -t._textureBounds.x,
      -t._textureBounds.y
    )) : this.worldTransform;
  }
  /**
   * Returns a matrix that transforms coordinates to the correct coordinate space of the texture being rendered to.
   * This is the texture offset inverse transform of the closest parent RenderGroup that is cached as a texture.
   * @returns {Matrix | null} The transform matrix for the cached texture coordinate space,
   * or null if no parent is cached as texture.
   */
  get cacheToLocalTransform() {
    return this._parentCacheAsTextureRenderGroup ? this._parentCacheAsTextureRenderGroup.textureOffsetInverseTransform : null;
  }
}
function hh(i, t, e = {}) {
  for (const s in t)
    !e[s] && t[s] !== void 0 && (i[s] = t[s]);
}
const zs = new Bt(null), Ds = new Bt(null), js = new Bt(null, 1, 1), Tr = 1, lh = 2, Gs = 4;
class Ct extends Rt {
  constructor(t = {}) {
    super(), this.uid = vt("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.updateTick = -1, this.localTransform = new et(), this.relativeGroupTransform = new et(), this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new Bt(this, 0, 0), this._scale = js, this._pivot = Ds, this._skew = zs, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], hh(this, t, {
      children: !0,
      parent: !0,
      effects: !0
    }), t.children?.forEach((e) => this.addChild(e)), t.parent?.addChild(this);
  }
  /**
   * Mixes all enumerable properties and methods from a source object to Container.
   * @param source - The source of properties and methods to mix in.
   */
  static mixin(t) {
    Object.defineProperties(Ct.prototype, Object.getOwnPropertyDescriptors(t));
  }
  /**
   * We now use the _didContainerChangeTick and _didViewChangeTick to track changes
   * @deprecated since 8.2.6
   * @ignore
   */
  set _didChangeId(t) {
    this._didViewChangeTick = t >> 12 & 4095, this._didContainerChangeTick = t & 4095;
  }
  get _didChangeId() {
    return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12;
  }
  /**
   * Adds one or more children to the container.
   *
   * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
   * @param {...Container} children - The Container(s) to add to the container
   * @returns {Container} - The first child that was added.
   */
  addChild(...t) {
    if (this.allowChildren || ot(yt, "addChild: Only Containers will be allowed to add children in v8.0.0"), t.length > 1) {
      for (let r = 0; r < t.length; r++)
        this.addChild(t[r]);
      return t[0];
    }
    const e = t[0], s = this.renderGroup || this.parentRenderGroup;
    return e.parent === this ? (this.children.splice(this.children.indexOf(e), 1), this.children.push(e), s && (s.structureDidChange = !0), e) : (e.parent && e.parent.removeChild(e), this.children.push(e), this.sortableChildren && (this.sortDirty = !0), e.parent = this, e.didChange = !0, e._updateFlags = 15, s && s.addChild(e), this.emit("childAdded", e, this, this.children.length - 1), e.emit("added", this), this._didViewChangeTick++, e._zIndex !== 0 && e.depthOfChildModified(), e);
  }
  /**
   * Removes one or more children from the container.
   * @param {...Container} children - The Container(s) to remove
   * @returns {Container} The first child that was removed.
   */
  removeChild(...t) {
    if (t.length > 1) {
      for (let r = 0; r < t.length; r++)
        this.removeChild(t[r]);
      return t[0];
    }
    const e = t[0], s = this.children.indexOf(e);
    return s > -1 && (this._didViewChangeTick++, this.children.splice(s, 1), this.renderGroup ? this.renderGroup.removeChild(e) : this.parentRenderGroup && this.parentRenderGroup.removeChild(e), e.parent = null, this.emit("childRemoved", e, this, s), e.emit("removed", this)), e;
  }
  /** @ignore */
  _onUpdate(t) {
    t && t === this._skew && this._updateSkew(), this._didContainerChangeTick++, !this.didChange && (this.didChange = !0, this.parentRenderGroup && this.parentRenderGroup.onChildUpdate(this));
  }
  set isRenderGroup(t) {
    !!this.renderGroup !== t && (t ? this.enableRenderGroup() : this.disableRenderGroup());
  }
  /**
   * Returns true if this container is a render group.
   * This means that it will be rendered as a separate pass, with its own set of instructions
   */
  get isRenderGroup() {
    return !!this.renderGroup;
  }
  /**
   * Calling this enables a render group for this container.
   * This means it will be rendered as a separate set of instructions.
   * The transform of the container will also be handled on the GPU rather than the CPU.
   */
  enableRenderGroup() {
    if (this.renderGroup)
      return;
    const t = this.parentRenderGroup;
    t?.removeChild(this), this.renderGroup = Qt.get(ah, this), this.groupTransform = et.IDENTITY, t?.addChild(this), this._updateIsSimple();
  }
  /** This will disable the render group for this container. */
  disableRenderGroup() {
    if (!this.renderGroup)
      return;
    const t = this.parentRenderGroup;
    t?.removeChild(this), Qt.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, t?.addChild(this), this._updateIsSimple();
  }
  /** @ignore */
  _updateIsSimple() {
    this.isSimple = !this.renderGroup && this.effects.length === 0;
  }
  /**
   * Current transform of the object based on world (parent) factors.
   * @readonly
   */
  get worldTransform() {
    return this._worldTransform || (this._worldTransform = new et()), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform;
  }
  /**
   * The position of the container on the x axis relative to the local coordinates of the parent.
   * An alias to position.x
   */
  get x() {
    return this._position.x;
  }
  set x(t) {
    this._position.x = t;
  }
  /**
   * The position of the container on the y axis relative to the local coordinates of the parent.
   * An alias to position.y
   */
  get y() {
    return this._position.y;
  }
  set y(t) {
    this._position.y = t;
  }
  /**
   * The coordinate of the object relative to the local coordinates of the parent.
   * @since 4.0.0
   */
  get position() {
    return this._position;
  }
  set position(t) {
    this._position.copyFrom(t);
  }
  /**
   * The rotation of the object in radians.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(t) {
    this._rotation !== t && (this._rotation = t, this._onUpdate(this._skew));
  }
  /**
   * The angle of the object in degrees.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get angle() {
    return this.rotation * Sa;
  }
  set angle(t) {
    this.rotation = t * Aa;
  }
  /**
   * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
   * is the projection of `pivot` in the parent's local space.
   *
   * By default, the pivot is the origin (0, 0).
   * @since 4.0.0
   */
  get pivot() {
    return this._pivot === Ds && (this._pivot = new Bt(this, 0, 0)), this._pivot;
  }
  set pivot(t) {
    this._pivot === Ds && (this._pivot = new Bt(this, 0, 0)), typeof t == "number" ? this._pivot.set(t) : this._pivot.copyFrom(t);
  }
  /**
   * The skew factor for the object in radians.
   * @since 4.0.0
   */
  get skew() {
    return this._skew === zs && (this._skew = new Bt(this, 0, 0)), this._skew;
  }
  set skew(t) {
    this._skew === zs && (this._skew = new Bt(this, 0, 0)), this._skew.copyFrom(t);
  }
  /**
   * The scale factors of this object along the local coordinate axes.
   *
   * The default scale is (1, 1).
   * @since 4.0.0
   */
  get scale() {
    return this._scale === js && (this._scale = new Bt(this, 1, 1)), this._scale;
  }
  set scale(t) {
    this._scale === js && (this._scale = new Bt(this, 0, 0)), typeof t == "number" ? this._scale.set(t) : this._scale.copyFrom(t);
  }
  /**
   * The width of the Container, setting this will actually modify the scale to achieve the value set.
   * @memberof scene.Container#
   */
  get width() {
    return Math.abs(this.scale.x * this.getLocalBounds().width);
  }
  set width(t) {
    const e = this.getLocalBounds().width;
    this._setWidth(t, e);
  }
  /**
   * The height of the Container, setting this will actually modify the scale to achieve the value set.
   * @memberof scene.Container#
   */
  get height() {
    return Math.abs(this.scale.y * this.getLocalBounds().height);
  }
  set height(t) {
    const e = this.getLocalBounds().height;
    this._setHeight(t, e);
  }
  /**
   * Retrieves the size of the container as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the container.
   * @memberof scene.Container#
   */
  getSize(t) {
    t || (t = {});
    const e = this.getLocalBounds();
    return t.width = Math.abs(this.scale.x * e.width), t.height = Math.abs(this.scale.y * e.height), t;
  }
  /**
   * Sets the size of the container to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   * @memberof scene.Container#
   */
  setSize(t, e) {
    const s = this.getLocalBounds();
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, s.width), e !== void 0 && this._setHeight(e, s.height);
  }
  /** Called when the skew or the rotation changes. */
  _updateSkew() {
    const t = this._rotation, e = this._skew;
    this._cx = Math.cos(t + e._y), this._sx = Math.sin(t + e._y), this._cy = -Math.sin(t - e._x), this._sy = Math.cos(t - e._x);
  }
  /**
   * Updates the transform properties of the container (accepts partial values).
   * @param {object} opts - The options for updating the transform.
   * @param {number} opts.x - The x position of the container.
   * @param {number} opts.y - The y position of the container.
   * @param {number} opts.scaleX - The scale factor on the x-axis.
   * @param {number} opts.scaleY - The scale factor on the y-axis.
   * @param {number} opts.rotation - The rotation of the container, in radians.
   * @param {number} opts.skewX - The skew factor on the x-axis.
   * @param {number} opts.skewY - The skew factor on the y-axis.
   * @param {number} opts.pivotX - The x coordinate of the pivot point.
   * @param {number} opts.pivotY - The y coordinate of the pivot point.
   */
  updateTransform(t) {
    return this.position.set(
      typeof t.x == "number" ? t.x : this.position.x,
      typeof t.y == "number" ? t.y : this.position.y
    ), this.scale.set(
      typeof t.scaleX == "number" ? t.scaleX || 1 : this.scale.x,
      typeof t.scaleY == "number" ? t.scaleY || 1 : this.scale.y
    ), this.rotation = typeof t.rotation == "number" ? t.rotation : this.rotation, this.skew.set(
      typeof t.skewX == "number" ? t.skewX : this.skew.x,
      typeof t.skewY == "number" ? t.skewY : this.skew.y
    ), this.pivot.set(
      typeof t.pivotX == "number" ? t.pivotX : this.pivot.x,
      typeof t.pivotY == "number" ? t.pivotY : this.pivot.y
    ), this;
  }
  /**
   * Updates the local transform using the given matrix.
   * @param matrix - The matrix to use for updating the transform.
   */
  setFromMatrix(t) {
    t.decompose(this);
  }
  /** Updates the local transform. */
  updateLocalTransform() {
    const t = this._didContainerChangeTick;
    if (this._didLocalTransformChangeId === t)
      return;
    this._didLocalTransformChangeId = t;
    const e = this.localTransform, s = this._scale, r = this._pivot, n = this._position, o = s._x, a = s._y, h = r._x, c = r._y;
    e.a = this._cx * o, e.b = this._sx * o, e.c = this._cy * a, e.d = this._sy * a, e.tx = n._x - (h * e.a + c * e.c), e.ty = n._y - (h * e.b + c * e.d);
  }
  // / ///// color related stuff
  set alpha(t) {
    t !== this.localAlpha && (this.localAlpha = t, this._updateFlags |= Tr, this._onUpdate());
  }
  /** The opacity of the object. */
  get alpha() {
    return this.localAlpha;
  }
  set tint(t) {
    const s = ut.shared.setValue(t ?? 16777215).toBgrNumber();
    s !== this.localColor && (this.localColor = s, this._updateFlags |= Tr, this._onUpdate());
  }
  /**
   * The tint applied to the sprite. This is a hex value.
   *
   * A value of 0xFFFFFF will remove any tint effect.
   * @default 0xFFFFFF
   */
  get tint() {
    return cs(this.localColor);
  }
  // / //////////////// blend related stuff
  set blendMode(t) {
    this.localBlendMode !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= lh, this.localBlendMode = t, this._onUpdate());
  }
  /**
   * The blend mode to be applied to the sprite. Apply a value of `'normal'` to reset the blend mode.
   * @default 'normal'
   */
  get blendMode() {
    return this.localBlendMode;
  }
  // / ///////// VISIBILITY / RENDERABLE /////////////////
  /** The visibility of the object. If false the object will not be drawn, and the transform will not be updated. */
  get visible() {
    return !!(this.localDisplayStatus & 2);
  }
  set visible(t) {
    const e = t ? 2 : 0;
    (this.localDisplayStatus & 2) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Gs, this.localDisplayStatus ^= 2, this._onUpdate());
  }
  /** @ignore */
  get culled() {
    return !(this.localDisplayStatus & 4);
  }
  /** @ignore */
  set culled(t) {
    const e = t ? 0 : 4;
    (this.localDisplayStatus & 4) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Gs, this.localDisplayStatus ^= 4, this._onUpdate());
  }
  /** Can this object be rendered, if false the object will not be drawn but the transform will still be updated. */
  get renderable() {
    return !!(this.localDisplayStatus & 1);
  }
  set renderable(t) {
    const e = t ? 1 : 0;
    (this.localDisplayStatus & 1) !== e && (this._updateFlags |= Gs, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate());
  }
  /** Whether or not the object should be rendered. */
  get isRenderable() {
    return this.localDisplayStatus === 7 && this.groupAlpha > 0;
  }
  /**
   * Removes all internal references and listeners as well as removes children from the display list.
   * Do not use a Container after calling `destroy`.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
   *  method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for children with textures e.g. Sprites. If options.children
   * is set to true it should destroy the texture of the child sprite
   * @param {boolean} [options.textureSource=false] - Only used for children with textures e.g. Sprites.
   * If options.children is set to true it should destroy the texture source of the child sprite
   * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
   * If options.children is set to true it should destroy the context of the child graphics
   */
  destroy(t = !1) {
    if (this.destroyed)
      return;
    this.destroyed = !0;
    let e;
    if (this.children.length && (e = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof t == "boolean" ? t : t?.children) && e)
      for (let r = 0; r < e.length; ++r)
        e[r].destroy(t);
    this.renderGroup?.destroy(), this.renderGroup = null;
  }
}
Ct.mixin(Xa);
Ct.mixin(rh);
Ct.mixin(eh);
Ct.mixin(th);
Ct.mixin(Za);
Ct.mixin(Ka);
Ct.mixin(sh);
Ct.mixin(Ua);
Ct.mixin(Ya);
Ct.mixin(Ja);
class ch extends Ct {
  constructor() {
    super(...arguments), this.canBundle = !0, this.allowChildren = !1, this._roundPixels = 0, this._lastUsed = -1, this._bounds = new Xt(0, 1, 0, 0), this._boundsDirty = !0;
  }
  /**
   * The local bounds of the view.
   * @type {rendering.Bounds}
   */
  get bounds() {
    return this._boundsDirty ? (this.updateBounds(), this._boundsDirty = !1, this._bounds) : this._bounds;
  }
  /**
   * Whether or not to round the x/y position of the sprite.
   * @type {boolean}
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  set roundPixels(t) {
    this._roundPixels = t ? 1 : 0;
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    const e = this.bounds, { x: s, y: r } = t;
    return s >= e.minX && s <= e.maxX && r >= e.minY && r <= e.maxY;
  }
  /** @private */
  onViewUpdate() {
    if (this._didViewChangeTick++, this._boundsDirty = !0, this.didViewUpdate)
      return;
    this.didViewUpdate = !0;
    const t = this.renderGroup || this.parentRenderGroup;
    t && t.onChildViewUpdate(this);
  }
  destroy(t) {
    super.destroy(t), this._bounds = null;
  }
}
class ue extends ch {
  /**
   * @param options - The options for creating the sprite.
   */
  constructor(t = tt.EMPTY) {
    t instanceof tt && (t = { texture: t });
    const { texture: e = tt.EMPTY, anchor: s, roundPixels: r, width: n, height: o, ...a } = t;
    super({
      label: "Sprite",
      ...a
    }), this.renderPipeId = "sprite", this.batched = !0, this._visualBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, this._anchor = new Bt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), s ? this.anchor = s : e.defaultAnchor && (this.anchor = e.defaultAnchor), this.texture = e, this.allowChildren = !1, this.roundPixels = r ?? !1, n !== void 0 && (this.width = n), o !== void 0 && (this.height = o);
  }
  /**
   * Helper function that creates a new sprite based on the source you provide.
   * The source can be - frame id, image, video, canvas element, video element, texture
   * @param source - Source to create texture from
   * @param [skipCache] - Whether to skip the cache or not
   * @returns The newly created sprite
   */
  static from(t, e = !1) {
    return t instanceof tt ? new ue(t) : new ue(tt.from(t, e));
  }
  set texture(t) {
    t || (t = tt.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this._width && this._setWidth(this._width, this._texture.orig.width), this._height && this._setHeight(this._height, this._texture.orig.height), this.onViewUpdate());
  }
  /** The texture that the sprite is using. */
  get texture() {
    return this._texture;
  }
  /**
   * The bounds of the sprite, taking the texture's trim into account.
   * @type {rendering.Bounds}
   */
  get visualBounds() {
    return Na(this._visualBounds, this._anchor, this._texture, 0), this._visualBounds;
  }
  /**
   * @deprecated
   */
  get sourceBounds() {
    return ot("8.6.1", "Sprite.sourceBounds is deprecated, use visualBounds instead."), this.visualBounds;
  }
  /** @private */
  updateBounds() {
    const t = this._anchor, e = this._texture, s = this._bounds, { width: r, height: n } = e.orig;
    s.minX = -t._x * r, s.maxX = s.minX + r, s.minY = -t._y * n, s.maxY = s.minY + n;
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(t = !1) {
    if (super.destroy(t), typeof t == "boolean" ? t : t?.texture) {
      const s = typeof t == "boolean" ? t : t?.textureSource;
      this._texture.destroy(s);
    }
    this._texture = null, this._visualBounds = null, this._bounds = null, this._anchor = null;
  }
  /**
   * The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
   * and passed to the constructor.
   *
   * The default is `(0,0)`, this means the sprite's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite({texture: Texture.WHITE});
   * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(t) {
    this._setWidth(t, this._texture.orig.width), this._width = t;
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(t) {
    this._setHeight(t, this._texture.orig.height), this._height = t;
  }
  /**
   * Retrieves the size of the Sprite as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the Sprite.
   */
  getSize(t) {
    return t || (t = {}), t.width = Math.abs(this.scale.x) * this._texture.orig.width, t.height = Math.abs(this.scale.y) * this._texture.orig.height, t;
  }
  /**
   * Sets the size of the Sprite to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, this._texture.orig.width), e !== void 0 && this._setHeight(e, this._texture.orig.height);
  }
}
const uh = new Xt();
function Gn(i, t, e) {
  const s = uh;
  i.measurable = !0, Nn(i, e, s), t.addBoundsMask(s), i.measurable = !1;
}
function Wn(i, t, e) {
  const s = _e.get();
  i.measurable = !0;
  const r = kt.get().identity(), n = $n(i, e, r);
  Rn(i, s, n), i.measurable = !1, t.addBoundsMask(s), kt.return(r), _e.return(s);
}
function $n(i, t, e) {
  return i ? (i !== t && ($n(i.parent, t, e), i.updateLocalTransform(), e.append(i.localTransform)), e) : (xt("Mask bounds, renderable is not inside the root container"), e);
}
class Un {
  constructor(t) {
    this.priority = 0, this.inverse = !1, this.pipe = "alphaMask", t?.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.renderMaskToTexture = !(t instanceof ue), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1;
  }
  reset() {
    this.mask.measurable = !0, this.mask = null;
  }
  addBounds(t, e) {
    this.inverse || Gn(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    Wn(this.mask, t, e);
  }
  containsPoint(t, e) {
    const s = this.mask;
    return e(s, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof ue;
  }
}
Un.extension = U.MaskEffect;
class Hn {
  constructor(t) {
    this.priority = 0, this.pipe = "colorMask", t?.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t;
  }
  destroy() {
  }
  static test(t) {
    return typeof t == "number";
  }
}
Hn.extension = U.MaskEffect;
class Yn {
  constructor(t) {
    this.priority = 0, this.pipe = "stencilMask", t?.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.mask.includeInBuild = !1, this.mask.measurable = !1;
  }
  reset() {
    this.mask.measurable = !0, this.mask.includeInBuild = !0, this.mask = null;
  }
  addBounds(t, e) {
    Gn(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    Wn(this.mask, t, e);
  }
  containsPoint(t, e) {
    const s = this.mask;
    return e(s, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof Ct;
  }
}
Yn.extension = U.MaskEffect;
const dh = {
  createCanvas: (i, t) => {
    const e = document.createElement("canvas");
    return e.width = i, e.height = t, e;
  },
  getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
  getWebGLRenderingContext: () => WebGLRenderingContext,
  getNavigator: () => navigator,
  getBaseUrl: () => document.baseURI ?? window.location.href,
  getFontFaceSet: () => document.fonts,
  fetch: (i, t) => fetch(i, t),
  parseXML: (i) => new DOMParser().parseFromString(i, "text/xml")
};
let Pr = dh;
const mt = {
  /**
   * Returns the current adapter.
   * @returns {environment.Adapter} The current adapter.
   */
  get() {
    return Pr;
  },
  /**
   * Sets the current adapter.
   * @param adapter - The new adapter.
   */
  set(i) {
    Pr = i;
  }
};
class Vn extends Kt {
  constructor(t) {
    t.resource || (t.resource = mt.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.uploadMethodId = "image", this.autoDensity = t.autoDensity, this.resizeCanvas(), this.transparent = !!t.transparent;
  }
  resizeCanvas() {
    this.autoDensity && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
  }
  resize(t = this.width, e = this.height, s = this._resolution) {
    const r = super.resize(t, e, s);
    return r && this.resizeCanvas(), r;
  }
  static test(t) {
    return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && t instanceof OffscreenCanvas;
  }
  /**
   * Returns the 2D rendering context for the canvas.
   * Caches the context after creating it.
   * @returns The 2D rendering context of the canvas.
   */
  get context2D() {
    return this._context2D || (this._context2D = this.resource.getContext("2d"));
  }
}
Vn.extension = U.TextureSource;
class ve extends Kt {
  constructor(t) {
    if (t.resource && globalThis.HTMLImageElement && t.resource instanceof HTMLImageElement) {
      const e = mt.get().createCanvas(t.resource.width, t.resource.height);
      e.getContext("2d").drawImage(t.resource, 0, 0, t.resource.width, t.resource.height), t.resource = e, xt("ImageSource: Image element passed, converting to canvas. Use CanvasSource instead.");
    }
    super(t), this.uploadMethodId = "image", this.autoGarbageCollect = !0;
  }
  static test(t) {
    return globalThis.HTMLImageElement && t instanceof HTMLImageElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap || globalThis.VideoFrame && t instanceof VideoFrame;
  }
}
ve.extension = U.TextureSource;
var bi = /* @__PURE__ */ ((i) => (i[i.INTERACTION = 50] = "INTERACTION", i[i.HIGH = 25] = "HIGH", i[i.NORMAL = 0] = "NORMAL", i[i.LOW = -25] = "LOW", i[i.UTILITY = -50] = "UTILITY", i))(bi || {});
class Ws {
  /**
   * Constructor
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting
   * @param once - If the handler should fire once
   */
  constructor(t, e = null, s = 0, r = !1) {
    this.next = null, this.previous = null, this._destroyed = !1, this._fn = t, this._context = e, this.priority = s, this._once = r;
  }
  /**
   * Simple compare function to figure out if a function and context match.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @returns `true` if the listener match the arguments
   */
  match(t, e = null) {
    return this._fn === t && this._context === e;
  }
  /**
   * Emit by calling the current function.
   * @param ticker - The ticker emitting.
   * @returns Next ticker
   */
  emit(t) {
    this._fn && (this._context ? this._fn.call(this._context, t) : this._fn(t));
    const e = this.next;
    return this._once && this.destroy(!0), this._destroyed && (this.next = null), e;
  }
  /**
   * Connect to the list.
   * @param previous - Input node, previous listener
   */
  connect(t) {
    this.previous = t, t.next && (t.next.previous = this), this.next = t.next, t.next = this;
  }
  /**
   * Destroy and don't use after this.
   * @param hard - `true` to remove the `next` reference, this
   *        is considered a hard destroy. Soft destroy maintains the next reference.
   * @returns The listener to redirect while emitting or removing.
   */
  destroy(t = !1) {
    this._destroyed = !0, this._fn = null, this._context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
    const e = this.next;
    return this.next = t ? null : e, this.previous = null, e;
  }
}
const Xn = class Lt {
  constructor() {
    this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new Ws(null, null, 1 / 0), this.deltaMS = 1 / Lt.targetFPMS, this.elapsedMS = 1 / Lt.targetFPMS, this._tick = (t) => {
      this._requestId = null, this.started && (this.update(t), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)));
    };
  }
  /**
   * Conditionally requests a new animation frame.
   * If a frame has not already been requested, and if the internal
   * emitter has listeners, a new frame is requested.
   * @private
   */
  _requestIfNeeded() {
    this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
  }
  /**
   * Conditionally cancels a pending animation frame.
   * @private
   */
  _cancelIfNeeded() {
    this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
  }
  /**
   * Conditionally requests a new animation frame.
   * If the ticker has been started it checks if a frame has not already
   * been requested, and if the internal emitter has listeners. If these
   * conditions are met, a new frame is requested. If the ticker has not
   * been started, but autoStart is `true`, then the ticker starts now,
   * and continues with the previous conditions to request a new frame.
   * @private
   */
  _startIfPossible() {
    this.started ? this._requestIfNeeded() : this.autoStart && this.start();
  }
  /**
   * Register a handler for tick events. Calls continuously unless
   * it is removed or the ticker is stopped.
   * @param fn - The listener function to be added for updates
   * @param context - The listener context
   * @param {number} [priority=UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  add(t, e, s = bi.NORMAL) {
    return this._addListener(new Ws(t, e, s));
  }
  /**
   * Add a handler for the tick event which is only execute once.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param {number} [priority=UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  addOnce(t, e, s = bi.NORMAL) {
    return this._addListener(new Ws(t, e, s, !0));
  }
  /**
   * Internally adds the event handler so that it can be sorted by priority.
   * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
   * before the rendering.
   * @private
   * @param listener - Current listener being added.
   * @returns This instance of a ticker
   */
  _addListener(t) {
    let e = this._head.next, s = this._head;
    if (!e)
      t.connect(s);
    else {
      for (; e; ) {
        if (t.priority > e.priority) {
          t.connect(s);
          break;
        }
        s = e, e = e.next;
      }
      t.previous || t.connect(s);
    }
    return this._startIfPossible(), this;
  }
  /**
   * Removes any handlers matching the function and context parameters.
   * If no handlers are left after removing, then it cancels the animation frame.
   * @param fn - The listener function to be removed
   * @param context - The listener context to be removed
   * @returns This instance of a ticker
   */
  remove(t, e) {
    let s = this._head.next;
    for (; s; )
      s.match(t, e) ? s = s.destroy() : s = s.next;
    return this._head.next || this._cancelIfNeeded(), this;
  }
  /**
   * The number of listeners on this ticker, calculated by walking through linked list
   * @readonly
   * @member {number}
   */
  get count() {
    if (!this._head)
      return 0;
    let t = 0, e = this._head;
    for (; e = e.next; )
      t++;
    return t;
  }
  /** Starts the ticker. If the ticker has listeners a new animation frame is requested at this point. */
  start() {
    this.started || (this.started = !0, this._requestIfNeeded());
  }
  /** Stops the ticker. If the ticker has requested an animation frame it is canceled at this point. */
  stop() {
    this.started && (this.started = !1, this._cancelIfNeeded());
  }
  /** Destroy the ticker and don't use after this. Calling this method removes all references to internal events. */
  destroy() {
    if (!this._protected) {
      this.stop();
      let t = this._head.next;
      for (; t; )
        t = t.destroy(!0);
      this._head.destroy(), this._head = null;
    }
  }
  /**
   * Triggers an update. An update entails setting the
   * current {@link ticker.Ticker#elapsedMS|elapsedMS},
   * the current {@link ticker.Ticker#deltaTime|deltaTime},
   * invoking all listeners with current deltaTime,
   * and then finally setting {@link ticker.Ticker#lastTime|lastTime}
   * with the value of currentTime that was provided.
   * This method will be called automatically by animation
   * frame callbacks if the ticker instance has been started
   * and listeners are added.
   * @param {number} [currentTime=performance.now()] - the current time of execution
   */
  update(t = performance.now()) {
    let e;
    if (t > this.lastTime) {
      if (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), e *= this.speed, this._minElapsedMS) {
        const n = t - this._lastFrame | 0;
        if (n < this._minElapsedMS)
          return;
        this._lastFrame = t - n % this._minElapsedMS;
      }
      this.deltaMS = e, this.deltaTime = this.deltaMS * Lt.targetFPMS;
      const s = this._head;
      let r = s.next;
      for (; r; )
        r = r.emit(this);
      s.next || this._cancelIfNeeded();
    } else
      this.deltaTime = this.deltaMS = this.elapsedMS = 0;
    this.lastTime = t;
  }
  /**
   * The frames per second at which this ticker is running.
   * The default is approximately 60 in most modern browsers.
   * **Note:** This does not factor in the value of
   * {@link ticker.Ticker#speed|speed}, which is specific
   * to scaling {@link ticker.Ticker#deltaTime|deltaTime}.
   * @member {number}
   * @readonly
   */
  get FPS() {
    return 1e3 / this.elapsedMS;
  }
  /**
   * Manages the maximum amount of milliseconds allowed to
   * elapse between invoking {@link ticker.Ticker#update|update}.
   * This value is used to cap {@link ticker.Ticker#deltaTime|deltaTime},
   * but does not effect the measured value of {@link ticker.Ticker#FPS|FPS}.
   * When setting this property it is clamped to a value between
   * `0` and `Ticker.targetFPMS * 1000`.
   * @member {number}
   * @default 10
   */
  get minFPS() {
    return 1e3 / this._maxElapsedMS;
  }
  set minFPS(t) {
    const e = Math.min(this.maxFPS, t), s = Math.min(Math.max(0, e) / 1e3, Lt.targetFPMS);
    this._maxElapsedMS = 1 / s;
  }
  /**
   * Manages the minimum amount of milliseconds required to
   * elapse between invoking {@link ticker.Ticker#update|update}.
   * This will effect the measured value of {@link ticker.Ticker#FPS|FPS}.
   * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
   * Otherwise it will be at least `minFPS`
   * @member {number}
   * @default 0
   */
  get maxFPS() {
    return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
  }
  set maxFPS(t) {
    if (t === 0)
      this._minElapsedMS = 0;
    else {
      const e = Math.max(this.minFPS, t);
      this._minElapsedMS = 1 / (e / 1e3);
    }
  }
  /**
   * The shared ticker instance used by {@link AnimatedSprite} and by
   * {@link VideoResource} to update animation frames / video textures.
   *
   * It may also be used by {@link Application} if created with the `sharedTicker` option property set to true.
   *
   * The property {@link ticker.Ticker#autoStart|autoStart} is set to `true` for this instance.
   * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
   * @example
   * import { Ticker } from 'pixi.js';
   *
   * const ticker = Ticker.shared;
   * // Set this to prevent starting this ticker when listeners are added.
   * // By default this is true only for the Ticker.shared instance.
   * ticker.autoStart = false;
   *
   * // FYI, call this to ensure the ticker is stopped. It should be stopped
   * // if you have not attempted to render anything yet.
   * ticker.stop();
   *
   * // Call this when you are ready for a running shared ticker.
   * ticker.start();
   * @example
   * import { autoDetectRenderer, Container } from 'pixi.js';
   *
   * // You may use the shared ticker to render...
   * const renderer = autoDetectRenderer();
   * const stage = new Container();
   * document.body.appendChild(renderer.view);
   * ticker.add((time) => renderer.render(stage));
   *
   * // Or you can just update it manually.
   * ticker.autoStart = false;
   * ticker.stop();
   * const animate = (time) => {
   *     ticker.update(time);
   *     renderer.render(stage);
   *     requestAnimationFrame(animate);
   * };
   * animate(performance.now());
   * @member {ticker.Ticker}
   * @readonly
   * @static
   */
  static get shared() {
    if (!Lt._shared) {
      const t = Lt._shared = new Lt();
      t.autoStart = !0, t._protected = !0;
    }
    return Lt._shared;
  }
  /**
   * The system ticker instance used by {@link BasePrepare} for core timing
   * functionality that shouldn't usually need to be paused, unlike the `shared`
   * ticker which drives visual animations and rendering which may want to be paused.
   *
   * The property {@link ticker.Ticker#autoStart|autoStart} is set to `true` for this instance.
   * @member {ticker.Ticker}
   * @readonly
   * @static
   */
  static get system() {
    if (!Lt._system) {
      const t = Lt._system = new Lt();
      t.autoStart = !0, t._protected = !0;
    }
    return Lt._system;
  }
};
Xn.targetFPMS = 0.06;
let Je = Xn, $s;
async function qn() {
  return $s ?? ($s = (async () => {
    const t = document.createElement("canvas").getContext("webgl");
    if (!t)
      return "premultiply-alpha-on-upload";
    const e = await new Promise((o) => {
      const a = document.createElement("video");
      a.onloadeddata = () => o(a), a.onerror = () => o(null), a.autoplay = !1, a.crossOrigin = "anonymous", a.preload = "auto", a.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", a.load();
    });
    if (!e)
      return "premultiply-alpha-on-upload";
    const s = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, s);
    const r = t.createFramebuffer();
    t.bindFramebuffer(t.FRAMEBUFFER, r), t.framebufferTexture2D(
      t.FRAMEBUFFER,
      t.COLOR_ATTACHMENT0,
      t.TEXTURE_2D,
      s,
      0
    ), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e);
    const n = new Uint8Array(4);
    return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, n), t.deleteFramebuffer(r), t.deleteTexture(s), t.getExtension("WEBGL_lose_context")?.loseContext(), n[0] <= n[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
  })()), $s;
}
const vs = class Zn extends Kt {
  constructor(t) {
    super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
      ...Zn.defaultOptions,
      ...t
    }, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), t.autoLoad !== !1 && this.load();
  }
  /** Update the video frame if the source is not destroyed and meets certain conditions. */
  updateFrame() {
    if (!this.destroyed) {
      if (this._updateFPS) {
        const t = Je.shared.elapsedMS * this.resource.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - t);
      }
      (!this._updateFPS || this._msToNextUpdate <= 0) && (this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0), this.isValid && this.update();
    }
  }
  /** Callback to update the video frame and potentially request the next frame update. */
  _videoFrameRequestCallback() {
    this.updateFrame(), this.destroyed ? this._videoFrameRequestCallbackHandle = null : this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    );
  }
  /**
   * Checks if the resource has valid dimensions.
   * @returns {boolean} True if width and height are set, otherwise false.
   */
  get isValid() {
    return !!this.resource.videoWidth && !!this.resource.videoHeight;
  }
  /**
   * Start preloading the video resource.
   * @returns {Promise<this>} Handle the validate event
   */
  async load() {
    if (this._load)
      return this._load;
    const t = this.resource, e = this.options;
    return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, !0)), this.alphaMode = await qn(), this._load = new Promise((s, r) => {
      this.isValid ? s(this) : (this._resolve = s, this._reject = r, e.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
        this._onError(new ErrorEvent(`Preload exceeded timeout of ${e.preloadTimeoutMs}ms`));
      })), t.load());
    }), this._load;
  }
  /**
   * Handle video error events.
   * @param event - The error event
   */
  _onError(t) {
    this.resource.removeEventListener("error", this._onError, !0), this.emit("error", t), this._reject && (this._reject(t), this._reject = null, this._resolve = null);
  }
  /**
   * Checks if the underlying source is playing.
   * @returns True if playing.
   */
  _isSourcePlaying() {
    const t = this.resource;
    return !t.paused && !t.ended;
  }
  /**
   * Checks if the underlying source is ready for playing.
   * @returns True if ready.
   */
  _isSourceReady() {
    return this.resource.readyState > 2;
  }
  /** Runs the update loop when the video is ready to play. */
  _onPlayStart() {
    this.isValid || this._mediaReady(), this._configureAutoUpdate();
  }
  /** Stops the update loop when a pause event is triggered. */
  _onPlayStop() {
    this._configureAutoUpdate();
  }
  /** Handles behavior when the video completes seeking to the current playback position. */
  _onSeeked() {
    this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0);
  }
  _onCanPlay() {
    this.resource.removeEventListener("canplay", this._onCanPlay), this._mediaReady();
  }
  _onCanPlayThrough() {
    this.resource.removeEventListener("canplaythrough", this._onCanPlay), this._preloadTimeout && (clearTimeout(this._preloadTimeout), this._preloadTimeout = void 0), this._mediaReady();
  }
  /** Fired when the video is loaded and ready to play. */
  _mediaReady() {
    const t = this.resource;
    this.isValid && (this.isReady = !0, this.resize(t.videoWidth, t.videoHeight)), this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0, this._resolve && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && this.resource.play();
  }
  /** Cleans up resources and event listeners associated with this texture. */
  destroy() {
    this._configureAutoUpdate();
    const t = this.resource;
    t && (t.removeEventListener("play", this._onPlayStart), t.removeEventListener("pause", this._onPlayStop), t.removeEventListener("seeked", this._onSeeked), t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlayThrough), t.removeEventListener("error", this._onError, !0), t.pause(), t.src = "", t.load()), super.destroy();
  }
  /** Should the base texture automatically update itself, set to true by default. */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(t) {
    t !== this._autoUpdate && (this._autoUpdate = t, this._configureAutoUpdate());
  }
  /**
   * How many times a second to update the texture from the video.
   * Leave at 0 to update at every render.
   * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
   */
  get updateFPS() {
    return this._updateFPS;
  }
  set updateFPS(t) {
    t !== this._updateFPS && (this._updateFPS = t, this._configureAutoUpdate());
  }
  /**
   * Configures the updating mechanism based on the current state and settings.
   *
   * This method decides between using the browser's native video frame callback or a custom ticker
   * for updating the video frame. It ensures optimal performance and responsiveness
   * based on the video's state, playback status, and the desired frames-per-second setting.
   *
   * - If `_autoUpdate` is enabled and the video source is playing:
   *   - It will prefer the native video frame callback if available and no specific FPS is set.
   *   - Otherwise, it will use a custom ticker for manual updates.
   * - If `_autoUpdate` is disabled or the video isn't playing, any active update mechanisms are halted.
   */
  _configureAutoUpdate() {
    this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (Je.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    ))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (Je.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (Je.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
  }
  static test(t) {
    return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement;
  }
};
vs.extension = U.TextureSource;
vs.defaultOptions = {
  ...Kt.defaultOptions,
  /** If true, the video will start loading immediately. */
  autoLoad: !0,
  /** If true, the video will start playing as soon as it is loaded. */
  autoPlay: !0,
  /** The number of times a second to update the texture from the video. Leave at 0 to update at every render. */
  updateFPS: 0,
  /** If true, the video will be loaded with the `crossorigin` attribute. */
  crossorigin: !0,
  /** If true, the video will loop when it ends. */
  loop: !1,
  /** If true, the video will be muted. */
  muted: !0,
  /** If true, the video will play inline. */
  playsinline: !0,
  /** If true, the video will be preloaded. */
  preload: !1
};
vs.MIME_TYPES = {
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/mp4"
};
let us = vs;
const Wt = (i, t, e = !1) => (Array.isArray(i) || (i = [i]), t ? i.map((s) => typeof s == "string" || e ? t(s) : s) : i);
class fh {
  constructor() {
    this._parsers = [], this._cache = /* @__PURE__ */ new Map(), this._cacheMap = /* @__PURE__ */ new Map();
  }
  /** Clear all entries. */
  reset() {
    this._cacheMap.clear(), this._cache.clear();
  }
  /**
   * Check if the key exists
   * @param key - The key to check
   */
  has(t) {
    return this._cache.has(t);
  }
  /**
   * Fetch entry by key
   * @param key - The key of the entry to get
   */
  get(t) {
    const e = this._cache.get(t);
    return e || xt(`[Assets] Asset id ${t} was not found in the Cache`), e;
  }
  /**
   * Set a value by key or keys name
   * @param key - The key or keys to set
   * @param value - The value to store in the cache or from which cacheable assets will be derived.
   */
  set(t, e) {
    const s = Wt(t);
    let r;
    for (let h = 0; h < this.parsers.length; h++) {
      const c = this.parsers[h];
      if (c.test(e)) {
        r = c.getCacheableAssets(s, e);
        break;
      }
    }
    const n = new Map(Object.entries(r || {}));
    r || s.forEach((h) => {
      n.set(h, e);
    });
    const o = [...n.keys()], a = {
      cacheKeys: o,
      keys: s
    };
    s.forEach((h) => {
      this._cacheMap.set(h, a);
    }), o.forEach((h) => {
      const c = r ? r[h] : e;
      this._cache.has(h) && this._cache.get(h) !== c && xt("[Cache] already has key:", h), this._cache.set(h, n.get(h));
    });
  }
  /**
   * Remove entry by key
   *
   * This function will also remove any associated alias from the cache also.
   * @param key - The key of the entry to remove
   */
  remove(t) {
    if (!this._cacheMap.has(t)) {
      xt(`[Assets] Asset id ${t} was not found in the Cache`);
      return;
    }
    const e = this._cacheMap.get(t);
    e.cacheKeys.forEach((r) => {
      this._cache.delete(r);
    }), e.keys.forEach((r) => {
      this._cacheMap.delete(r);
    });
  }
  /** All loader parsers registered */
  get parsers() {
    return this._parsers;
  }
}
const pt = new fh(), wi = [];
bt.handleByList(U.TextureSource, wi);
function Kn(i = {}) {
  const t = i && i.resource, e = t ? i.resource : i, s = t ? i : { resource: i };
  for (let r = 0; r < wi.length; r++) {
    const n = wi[r];
    if (n.test(e))
      return new n(s);
  }
  throw new Error(`Could not find a source type for resource: ${s.resource}`);
}
function ph(i = {}, t = !1) {
  const e = i && i.resource, s = e ? i.resource : i, r = e ? i : { resource: i };
  if (!t && pt.has(s))
    return pt.get(s);
  const n = new tt({ source: Kn(r) });
  return n.on("destroy", () => {
    pt.has(s) && pt.remove(s);
  }), t || pt.set(s, n), n;
}
function mh(i, t = !1) {
  return typeof i == "string" ? pt.get(i) : i instanceof Kt ? new tt({ source: i }) : ph(i, t);
}
tt.from = mh;
Kt.from = Kn;
bt.add(Un, Hn, Yn, us, ve, Vn, Gi);
var qt = /* @__PURE__ */ ((i) => (i[i.Low = 0] = "Low", i[i.Normal = 1] = "Normal", i[i.High = 2] = "High", i))(qt || {});
function jt(i) {
  if (typeof i != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(i)}`);
}
function Pe(i) {
  return i.split("?")[0].split("#")[0];
}
function gh(i) {
  return i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function yh(i, t, e) {
  return i.replace(new RegExp(gh(t), "g"), e);
}
function xh(i, t) {
  let e = "", s = 0, r = -1, n = 0, o = -1;
  for (let a = 0; a <= i.length; ++a) {
    if (a < i.length)
      o = i.charCodeAt(a);
    else {
      if (o === 47)
        break;
      o = 47;
    }
    if (o === 47) {
      if (!(r === a - 1 || n === 1)) if (r !== a - 1 && n === 2) {
        if (e.length < 2 || s !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
          if (e.length > 2) {
            const h = e.lastIndexOf("/");
            if (h !== e.length - 1) {
              h === -1 ? (e = "", s = 0) : (e = e.slice(0, h), s = e.length - 1 - e.lastIndexOf("/")), r = a, n = 0;
              continue;
            }
          } else if (e.length === 2 || e.length === 1) {
            e = "", s = 0, r = a, n = 0;
            continue;
          }
        }
      } else
        e.length > 0 ? e += `/${i.slice(r + 1, a)}` : e = i.slice(r + 1, a), s = a - r - 1;
      r = a, n = 0;
    } else o === 46 && n !== -1 ? ++n : n = -1;
  }
  return e;
}
const Nt = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   */
  toPosix(i) {
    return yh(i, "\\", "/");
  },
  /**
   * Checks if the path is a URL e.g. http://, https://
   * @param path - The path to check
   */
  isUrl(i) {
    return /^https?:/.test(this.toPosix(i));
  },
  /**
   * Checks if the path is a data URL
   * @param path - The path to check
   */
  isDataUrl(i) {
    return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(i);
  },
  /**
   * Checks if the path is a blob URL
   * @param path - The path to check
   */
  isBlobUrl(i) {
    return i.startsWith("blob:");
  },
  /**
   * Checks if the path has a protocol e.g. http://, https://, file:///, data:, blob:, C:/
   * This will return true for windows file paths
   * @param path - The path to check
   */
  hasProtocol(i) {
    return /^[^/:]+:/.test(this.toPosix(i));
  },
  /**
   * Returns the protocol of the path e.g. http://, https://, file:///, data:, blob:, C:/
   * @param path - The path to get the protocol from
   */
  getProtocol(i) {
    jt(i), i = this.toPosix(i);
    const t = /^file:\/\/\//.exec(i);
    if (t)
      return t[0];
    const e = /^[^/:]+:\/{0,2}/.exec(i);
    return e ? e[0] : "";
  },
  /**
   * Converts URL to an absolute path.
   * When loading from a Web Worker, we must use absolute paths.
   * If the URL is already absolute we return it as is
   * If it's not, we convert it
   * @param url - The URL to test
   * @param customBaseUrl - The base URL to use
   * @param customRootUrl - The root URL to use
   */
  toAbsolute(i, t, e) {
    if (jt(i), this.isDataUrl(i) || this.isBlobUrl(i))
      return i;
    const s = Pe(this.toPosix(t ?? mt.get().getBaseUrl())), r = Pe(this.toPosix(e ?? this.rootname(s)));
    return i = this.toPosix(i), i.startsWith("/") ? Nt.join(r, i.slice(1)) : this.isAbsolute(i) ? i : this.join(s, i);
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   */
  normalize(i) {
    if (jt(i), i.length === 0)
      return ".";
    if (this.isDataUrl(i) || this.isBlobUrl(i))
      return i;
    i = this.toPosix(i);
    let t = "";
    const e = i.startsWith("/");
    this.hasProtocol(i) && (t = this.rootname(i), i = i.slice(t.length));
    const s = i.endsWith("/");
    return i = xh(i), i.length > 0 && s && (i += "/"), e ? `/${i}` : t + i;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   */
  isAbsolute(i) {
    return jt(i), i = this.toPosix(i), this.hasProtocol(i) ? !0 : i.startsWith("/");
  },
  /**
   * Joins all given path segments together using the platform-specific separator as a delimiter,
   * then normalizes the resulting path
   * @param segments - The segments of the path to join
   */
  join(...i) {
    if (i.length === 0)
      return ".";
    let t;
    for (let e = 0; e < i.length; ++e) {
      const s = i[e];
      if (jt(s), s.length > 0)
        if (t === void 0)
          t = s;
        else {
          const r = i[e - 1] ?? "";
          this.joinExtensions.includes(this.extname(r).toLowerCase()) ? t += `/../${s}` : t += `/${s}`;
        }
    }
    return t === void 0 ? "." : this.normalize(t);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   */
  dirname(i) {
    if (jt(i), i.length === 0)
      return ".";
    i = this.toPosix(i);
    let t = i.charCodeAt(0);
    const e = t === 47;
    let s = -1, r = !0;
    const n = this.getProtocol(i), o = i;
    i = i.slice(n.length);
    for (let a = i.length - 1; a >= 1; --a)
      if (t = i.charCodeAt(a), t === 47) {
        if (!r) {
          s = a;
          break;
        }
      } else
        r = !1;
    return s === -1 ? e ? "/" : this.isUrl(o) ? n + i : n : e && s === 1 ? "//" : n + i.slice(0, s);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   */
  rootname(i) {
    jt(i), i = this.toPosix(i);
    let t = "";
    if (i.startsWith("/") ? t = "/" : t = this.getProtocol(i), this.isUrl(i)) {
      const e = i.indexOf("/", t.length);
      e !== -1 ? t = i.slice(0, e) : t = i, t.endsWith("/") || (t += "/");
    }
    return t;
  },
  /**
   * Returns the last portion of a path
   * @param path - The path to test
   * @param ext - Optional extension to remove
   */
  basename(i, t) {
    jt(i), t && jt(t), i = Pe(this.toPosix(i));
    let e = 0, s = -1, r = !0, n;
    if (t !== void 0 && t.length > 0 && t.length <= i.length) {
      if (t.length === i.length && t === i)
        return "";
      let o = t.length - 1, a = -1;
      for (n = i.length - 1; n >= 0; --n) {
        const h = i.charCodeAt(n);
        if (h === 47) {
          if (!r) {
            e = n + 1;
            break;
          }
        } else
          a === -1 && (r = !1, a = n + 1), o >= 0 && (h === t.charCodeAt(o) ? --o === -1 && (s = n) : (o = -1, s = a));
      }
      return e === s ? s = a : s === -1 && (s = i.length), i.slice(e, s);
    }
    for (n = i.length - 1; n >= 0; --n)
      if (i.charCodeAt(n) === 47) {
        if (!r) {
          e = n + 1;
          break;
        }
      } else s === -1 && (r = !1, s = n + 1);
    return s === -1 ? "" : i.slice(e, s);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   */
  extname(i) {
    jt(i), i = Pe(this.toPosix(i));
    let t = -1, e = 0, s = -1, r = !0, n = 0;
    for (let o = i.length - 1; o >= 0; --o) {
      const a = i.charCodeAt(o);
      if (a === 47) {
        if (!r) {
          e = o + 1;
          break;
        }
        continue;
      }
      s === -1 && (r = !1, s = o + 1), a === 46 ? t === -1 ? t = o : n !== 1 && (n = 1) : t !== -1 && (n = -1);
    }
    return t === -1 || s === -1 || n === 0 || n === 1 && t === s - 1 && t === e + 1 ? "" : i.slice(t, s);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   */
  parse(i) {
    jt(i);
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (i.length === 0)
      return t;
    i = Pe(this.toPosix(i));
    let e = i.charCodeAt(0);
    const s = this.isAbsolute(i);
    let r;
    t.root = this.rootname(i), s || this.hasProtocol(i) ? r = 1 : r = 0;
    let n = -1, o = 0, a = -1, h = !0, c = i.length - 1, l = 0;
    for (; c >= r; --c) {
      if (e = i.charCodeAt(c), e === 47) {
        if (!h) {
          o = c + 1;
          break;
        }
        continue;
      }
      a === -1 && (h = !1, a = c + 1), e === 46 ? n === -1 ? n = c : l !== 1 && (l = 1) : n !== -1 && (l = -1);
    }
    return n === -1 || a === -1 || l === 0 || l === 1 && n === a - 1 && n === o + 1 ? a !== -1 && (o === 0 && s ? t.base = t.name = i.slice(1, a) : t.base = t.name = i.slice(o, a)) : (o === 0 && s ? (t.name = i.slice(1, n), t.base = i.slice(1, a)) : (t.name = i.slice(o, n), t.base = i.slice(o, a)), t.ext = i.slice(n, a)), t.dir = this.dirname(i), t;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
function Jn(i, t, e, s, r) {
  const n = t[e];
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    e < t.length - 1 ? Jn(i.replace(s[e], a), t, e + 1, s, r) : r.push(i.replace(s[e], a));
  }
}
function _h(i) {
  const t = /\{(.*?)\}/g, e = i.match(t), s = [];
  if (e) {
    const r = [];
    e.forEach((n) => {
      const o = n.substring(1, n.length - 1).split(",");
      r.push(o);
    }), Jn(i, r, 0, e, s);
  } else
    s.push(i);
  return s;
}
const _s = (i) => !Array.isArray(i);
class Me {
  constructor() {
    this._defaultBundleIdentifierOptions = {
      connector: "-",
      createBundleAssetId: (t, e) => `${t}${this._bundleIdConnector}${e}`,
      extractAssetIdFromBundle: (t, e) => e.replace(`${t}${this._bundleIdConnector}`, "")
    }, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {};
  }
  /**
   * Override how the resolver deals with generating bundle ids.
   * must be called before any bundles are added
   * @param bundleIdentifier - the bundle identifier options
   */
  setBundleIdentifier(t) {
    if (this._bundleIdConnector = t.connector ?? this._bundleIdConnector, this._createBundleAssetId = t.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = t.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar")
      throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
  }
  /**
   * Let the resolver know which assets you prefer to use when resolving assets.
   * Multiple prefer user defined rules can be added.
   * @example
   * resolver.prefer({
   *     // first look for something with the correct format, and then then correct resolution
   *     priority: ['format', 'resolution'],
   *     params:{
   *         format:'webp', // prefer webp images
   *         resolution: 2, // prefer a resolution of 2
   *     }
   * })
   * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
   * resolver.resolveUrl('foo') // => 'bar@2x.webp'
   * @param preferOrders - the prefer options
   */
  prefer(...t) {
    t.forEach((e) => {
      this._preferredOrder.push(e), e.priority || (e.priority = Object.keys(e.params));
    }), this._resolverHash = {};
  }
  /**
   * Set the base path to prepend to all urls when resolving
   * @example
   * resolver.basePath = 'https://home.com/';
   * resolver.add('foo', 'bar.ong');
   * resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
   * @param basePath - the base path to use
   */
  set basePath(t) {
    this._basePath = t;
  }
  get basePath() {
    return this._basePath;
  }
  /**
   * Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
   * default value for browsers is `window.location.origin`
   * @example
   * // Application hosted on https://home.com/some-path/index.html
   * resolver.basePath = 'https://home.com/some-path/';
   * resolver.rootPath = 'https://home.com/';
   * resolver.add('foo', '/bar.png');
   * resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
   * @param rootPath - the root path to use
   */
  set rootPath(t) {
    this._rootPath = t;
  }
  get rootPath() {
    return this._rootPath;
  }
  /**
   * All the active URL parsers that help the parser to extract information and create
   * an asset object-based on parsing the URL itself.
   *
   * Can be added using the extensions API
   * @example
   * resolver.add('foo', [
   *     {
   *         resolution: 2,
   *         format: 'png',
   *         src: 'image@2x.png',
   *     },
   *     {
   *         resolution:1,
   *         format:'png',
   *         src: 'image.png',
   *     },
   * ]);
   *
   * // With a url parser the information such as resolution and file format could extracted from the url itself:
   * extensions.add({
   *     extension: ExtensionType.ResolveParser,
   *     test: loadTextures.test, // test if url ends in an image
   *     parse: (value: string) =>
   *     ({
   *         resolution: parseFloat(Resolver.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
   *         format: value.split('.').pop(),
   *         src: value,
   *     }),
   * });
   *
   * // Now resolution and format can be extracted from the url
   * resolver.add('foo', [
   *     'image@2x.png',
   *     'image.png',
   * ]);
   */
  get parsers() {
    return this._parsers;
  }
  /** Used for testing, this resets the resolver to its initial state */
  reset() {
    this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
  }
  /**
   * Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
   * @param searchParams - the default url parameters to append when resolving urls
   */
  setDefaultSearchParams(t) {
    if (typeof t == "string")
      this._defaultSearchParams = t;
    else {
      const e = t;
      this._defaultSearchParams = Object.keys(e).map((s) => `${encodeURIComponent(s)}=${encodeURIComponent(e[s])}`).join("&");
    }
  }
  /**
   * Returns the aliases for a given asset
   * @param asset - the asset to get the aliases for
   */
  getAlias(t) {
    const { alias: e, src: s } = t;
    return Wt(
      e || s,
      (n) => typeof n == "string" ? n : Array.isArray(n) ? n.map((o) => o?.src ?? o) : n?.src ? n.src : n,
      !0
    );
  }
  /**
   * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
   * generally a manifest would be built using a tool.
   * @param manifest - the manifest to add to the resolver
   */
  addManifest(t) {
    this._manifest && xt("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = t, t.bundles.forEach((e) => {
      this.addBundle(e.name, e.assets);
    });
  }
  /**
   * This adds a bundle of assets in one go so that you can resolve them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * resolver.addBundle('animals', [
   *  { alias: 'bunny', src: 'bunny.png' },
   *  { alias: 'chicken', src: 'chicken.png' },
   *  { alias: 'thumper', src: 'thumper.png' },
   * ]);
   * // or
   * resolver.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const resolvedAssets = await resolver.resolveBundle('animals');
   * @param bundleId - The id of the bundle to add
   * @param assets - A record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(t, e) {
    const s = [];
    let r = e;
    Array.isArray(e) || (r = Object.entries(e).map(([n, o]) => typeof o == "string" || Array.isArray(o) ? { alias: n, src: o } : { alias: n, ...o })), r.forEach((n) => {
      const o = n.src, a = n.alias;
      let h;
      if (typeof a == "string") {
        const c = this._createBundleAssetId(t, a);
        s.push(c), h = [a, c];
      } else {
        const c = a.map((l) => this._createBundleAssetId(t, l));
        s.push(...c), h = [...a, ...c];
      }
      this.add({
        ...n,
        alias: h,
        src: o
      });
    }), this._bundles[t] = s;
  }
  /**
   * Tells the resolver what keys are associated with witch asset.
   * The most important thing the resolver does
   * @example
   * // Single key, single asset:
   * resolver.add({alias: 'foo', src: 'bar.png');
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Multiple keys, single asset:
   * resolver.add({alias: ['foo', 'boo'], src: 'bar.png'});
   * resolver.resolveUrl('foo') // => 'bar.png'
   * resolver.resolveUrl('boo') // => 'bar.png'
   *
   * // Multiple keys, multiple assets:
   * resolver.add({alias: ['foo', 'boo'], src: ['bar.png', 'bar.webp']});
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Add custom data attached to the resolver
   * Resolver.add({
   *     alias: 'bunnyBooBooSmooth',
   *     src: 'bunny{png,webp}',
   *     data: { scaleMode:SCALE_MODES.NEAREST }, // Base texture options
   * });
   *
   * resolver.resolve('bunnyBooBooSmooth') // => { src: 'bunny.png', data: { scaleMode: SCALE_MODES.NEAREST } }
   * @param aliases - the UnresolvedAsset or array of UnresolvedAssets to add to the resolver
   */
  add(t) {
    const e = [];
    Array.isArray(t) ? e.push(...t) : e.push(t);
    let s;
    s = (n) => {
      this.hasKey(n) && xt(`[Resolver] already has key: ${n} overwriting`);
    }, Wt(e).forEach((n) => {
      const { src: o } = n;
      let { data: a, format: h, loadParser: c } = n;
      const l = Wt(o).map((d) => typeof d == "string" ? _h(d) : Array.isArray(d) ? d : [d]), u = this.getAlias(n);
      Array.isArray(u) ? u.forEach(s) : s(u);
      const f = [];
      l.forEach((d) => {
        d.forEach((g) => {
          let y = {};
          if (typeof g != "object") {
            y.src = g;
            for (let m = 0; m < this._parsers.length; m++) {
              const _ = this._parsers[m];
              if (_.test(g)) {
                y = _.parse(g);
                break;
              }
            }
          } else
            a = g.data ?? a, h = g.format ?? h, c = g.loadParser ?? c, y = {
              ...y,
              ...g
            };
          if (!u)
            throw new Error(`[Resolver] alias is undefined for this asset: ${y.src}`);
          y = this._buildResolvedAsset(y, {
            aliases: u,
            data: a,
            format: h,
            loadParser: c
          }), f.push(y);
        });
      }), u.forEach((d) => {
        this._assetMap[d] = f;
      });
    });
  }
  // TODO: this needs an overload like load did in Assets
  /**
   * If the resolver has had a manifest set via setManifest, this will return the assets urls for
   * a given bundleId or bundleIds.
   * @example
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * resolver.setManifest(manifest);
   * const resolved = resolver.resolveBundle('load-screen');
   * @param bundleIds - The bundle ids to resolve
   * @returns All the bundles assets or a hash of assets for each bundle specified
   */
  resolveBundle(t) {
    const e = _s(t);
    t = Wt(t);
    const s = {};
    return t.forEach((r) => {
      const n = this._bundles[r];
      if (n) {
        const o = this.resolve(n), a = {};
        for (const h in o) {
          const c = o[h];
          a[this._extractAssetIdFromBundle(r, h)] = c;
        }
        s[r] = a;
      }
    }), e ? s[t[0]] : s;
  }
  /**
   * Does exactly what resolve does, but returns just the URL rather than the whole asset object
   * @param key - The key or keys to resolve
   * @returns - The URLs associated with the key(s)
   */
  resolveUrl(t) {
    const e = this.resolve(t);
    if (typeof t != "string") {
      const s = {};
      for (const r in e)
        s[r] = e[r].src;
      return s;
    }
    return e.src;
  }
  resolve(t) {
    const e = _s(t);
    t = Wt(t);
    const s = {};
    return t.forEach((r) => {
      if (!this._resolverHash[r])
        if (this._assetMap[r]) {
          let n = this._assetMap[r];
          const o = this._getPreferredOrder(n);
          o?.priority.forEach((a) => {
            o.params[a].forEach((h) => {
              const c = n.filter((l) => l[a] ? l[a] === h : !1);
              c.length && (n = c);
            });
          }), this._resolverHash[r] = n[0];
        } else
          this._resolverHash[r] = this._buildResolvedAsset({
            alias: [r],
            src: r
          }, {});
      s[r] = this._resolverHash[r];
    }), e ? s[t[0]] : s;
  }
  /**
   * Checks if an asset with a given key exists in the resolver
   * @param key - The key of the asset
   */
  hasKey(t) {
    return !!this._assetMap[t];
  }
  /**
   * Checks if a bundle with the given key exists in the resolver
   * @param key - The key of the bundle
   */
  hasBundle(t) {
    return !!this._bundles[t];
  }
  /**
   * Internal function for figuring out what prefer criteria an asset should use.
   * @param assets
   */
  _getPreferredOrder(t) {
    for (let e = 0; e < t.length; e++) {
      const s = t[0], r = this._preferredOrder.find((n) => n.params.format.includes(s.format));
      if (r)
        return r;
    }
    return this._preferredOrder[0];
  }
  /**
   * Appends the default url parameters to the url
   * @param url - The url to append the default parameters to
   * @returns - The url with the default parameters appended
   */
  _appendDefaultSearchParams(t) {
    if (!this._defaultSearchParams)
      return t;
    const e = /\?/.test(t) ? "&" : "?";
    return `${t}${e}${this._defaultSearchParams}`;
  }
  _buildResolvedAsset(t, e) {
    const { aliases: s, data: r, loadParser: n, format: o } = e;
    return (this._basePath || this._rootPath) && (t.src = Nt.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = s ?? t.alias ?? [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = { ...r || {}, ...t.data }, t.loadParser = n ?? t.loadParser, t.format = o ?? t.format ?? bh(t.src), t;
  }
}
Me.RETINA_PREFIX = /@([0-9\.]+)x/;
function bh(i) {
  return i.split(".").pop().split("?").shift().split("#").shift();
}
const vi = (i, t) => {
  const e = t.split("?")[1];
  return e && (i += `?${e}`), i;
}, Qn = class Ne {
  /**
   * @param texture - Reference to the source BaseTexture object.
   * @param {object} data - Spritesheet image data.
   */
  constructor(t, e) {
    this.linkedSheets = [], this._texture = t instanceof tt ? t : null, this.textureSource = t.source, this.textures = {}, this.animations = {}, this.data = e;
    const s = parseFloat(e.meta.scale);
    s ? (this.resolution = s, t.source.resolution = this.resolution) : this.resolution = t.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
  }
  /**
   * Parser spritesheet from loaded data. This is done asynchronously
   * to prevent creating too many Texture within a single process.
   */
  parse() {
    return new Promise((t) => {
      this._callback = t, this._batchIndex = 0, this._frameKeys.length <= Ne.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    });
  }
  /**
   * Process a batch of frames
   * @param initialFrameIndex - The index of frame to start.
   */
  _processFrames(t) {
    let e = t;
    const s = Ne.BATCH_SIZE;
    for (; e - t < s && e < this._frameKeys.length; ) {
      const r = this._frameKeys[e], n = this._frames[r], o = n.frame;
      if (o) {
        let a = null, h = null;
        const c = n.trimmed !== !1 && n.sourceSize ? n.sourceSize : n.frame, l = new wt(
          0,
          0,
          Math.floor(c.w) / this.resolution,
          Math.floor(c.h) / this.resolution
        );
        n.rotated ? a = new wt(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.h) / this.resolution,
          Math.floor(o.w) / this.resolution
        ) : a = new wt(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        ), n.trimmed !== !1 && n.spriteSourceSize && (h = new wt(
          Math.floor(n.spriteSourceSize.x) / this.resolution,
          Math.floor(n.spriteSourceSize.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        )), this.textures[r] = new tt({
          source: this.textureSource,
          frame: a,
          orig: l,
          trim: h,
          rotate: n.rotated ? 2 : 0,
          defaultAnchor: n.anchor,
          defaultBorders: n.borders,
          label: r.toString()
        });
      }
      e++;
    }
  }
  /** Parse animations config. */
  _processAnimations() {
    const t = this.data.animations || {};
    for (const e in t) {
      this.animations[e] = [];
      for (let s = 0; s < t[e].length; s++) {
        const r = t[e][s];
        this.animations[e].push(this.textures[r]);
      }
    }
  }
  /** The parse has completed. */
  _parseComplete() {
    const t = this._callback;
    this._callback = null, this._batchIndex = 0, t.call(this, this.textures);
  }
  /** Begin the next batch of textures. */
  _nextBatch() {
    this._processFrames(this._batchIndex * Ne.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
      this._batchIndex * Ne.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
    }, 0);
  }
  /**
   * Destroy Spritesheet and don't use after this.
   * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
   */
  destroy(t = !1) {
    for (const e in this.textures)
      this.textures[e].destroy();
    this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && (this._texture?.destroy(), this.textureSource.destroy()), this._texture = null, this.textureSource = null, this.linkedSheets = [];
  }
};
Qn.BATCH_SIZE = 1e3;
let Ir = Qn;
const wh = [
  "jpg",
  "png",
  "jpeg",
  "avif",
  "webp",
  "basis",
  "etc2",
  "bc7",
  "bc6h",
  "bc5",
  "bc4",
  "bc3",
  "bc2",
  "bc1",
  "eac",
  "astc"
];
function to(i, t, e) {
  const s = {};
  if (i.forEach((r) => {
    s[r] = t;
  }), Object.keys(t.textures).forEach((r) => {
    s[r] = t.textures[r];
  }), !e) {
    const r = Nt.dirname(i[0]);
    t.linkedSheets.forEach((n, o) => {
      const a = to([`${r}/${t.data.meta.related_multi_packs[o]}`], n, !0);
      Object.assign(s, a);
    });
  }
  return s;
}
const vh = {
  extension: U.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (i) => i instanceof Ir,
    getCacheableAssets: (i, t) => to(i, t, !1)
  },
  /** Resolve the resolution of the asset. */
  resolver: {
    extension: {
      type: U.ResolveParser,
      name: "resolveSpritesheet"
    },
    test: (i) => {
      const e = i.split("?")[0].split("."), s = e.pop(), r = e.pop();
      return s === "json" && wh.includes(r);
    },
    parse: (i) => {
      const t = i.split(".");
      return {
        resolution: parseFloat(Me.RETINA_PREFIX.exec(i)?.[1] ?? "1"),
        format: t[t.length - 2],
        src: i
      };
    }
  },
  /**
   * Loader plugin that parses sprite sheets!
   * once the JSON has been loaded this checks to see if the JSON is spritesheet data.
   * If it is, we load the spritesheets image and parse the data into Spritesheet
   * All textures in the sprite sheet are then added to the cache
   */
  loader: {
    name: "spritesheetLoader",
    extension: {
      type: U.LoadParser,
      priority: qt.Normal,
      name: "spritesheetLoader"
    },
    async testParse(i, t) {
      return Nt.extname(t.src).toLowerCase() === ".json" && !!i.frames;
    },
    async parse(i, t, e) {
      const {
        texture: s,
        // if user need to use preloaded texture
        imageFilename: r
        // if user need to use custom filename (not from jsonFile.meta.image)
      } = t?.data ?? {};
      let n = Nt.dirname(t.src);
      n && n.lastIndexOf("/") !== n.length - 1 && (n += "/");
      let o;
      if (s instanceof tt)
        o = s;
      else {
        const c = vi(n + (r ?? i.meta.image), t.src);
        o = (await e.load([c]))[c];
      }
      const a = new Ir(
        o.source,
        i
      );
      await a.parse();
      const h = i?.meta?.related_multi_packs;
      if (Array.isArray(h)) {
        const c = [];
        for (const u of h) {
          if (typeof u != "string")
            continue;
          let f = n + u;
          t.data?.ignoreMultiPack || (f = vi(f, t.src), c.push(e.load({
            src: f,
            data: {
              ignoreMultiPack: !0
            }
          })));
        }
        const l = await Promise.all(c);
        a.linkedSheets = l, l.forEach((u) => {
          u.linkedSheets = [a].concat(a.linkedSheets.filter((f) => f !== u));
        });
      }
      return a;
    },
    async unload(i, t, e) {
      await e.unload(i.textureSource._sourceOrigin), i.destroy(!1);
    }
  }
};
bt.add(vh);
const Us = /* @__PURE__ */ Object.create(null), kr = /* @__PURE__ */ Object.create(null);
function Ui(i, t) {
  let e = kr[i];
  return e === void 0 && (Us[t] === void 0 && (Us[t] = 1), kr[i] = e = Us[t]++), e;
}
let Qe;
function eo() {
  return (!Qe || Qe?.isContextLost()) && (Qe = mt.get().createCanvas().getContext("webgl", {})), Qe;
}
let ts;
function Mh() {
  if (!ts) {
    ts = "mediump";
    const i = eo();
    i && i.getShaderPrecisionFormat && (ts = i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision ? "highp" : "mediump");
  }
  return ts;
}
function Sh(i, t, e) {
  return t ? i : e ? (i = i.replace("out vec4 finalColor;", ""), `
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${i}
        `) : `
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${i}
        `;
}
function Ah(i, t, e) {
  const s = e ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
  if (i.substring(0, 9) !== "precision") {
    let r = e ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
    return r === "highp" && s !== "highp" && (r = "mediump"), `precision ${r} float;
${i}`;
  } else if (s !== "highp" && i.substring(0, 15) === "precision highp")
    return i.replace("precision highp", "precision mediump");
  return i;
}
function Ch(i, t) {
  return t ? `#version 300 es
${i}` : i;
}
const Th = {}, Ph = {};
function Ih(i, { name: t = "pixi-program" }, e = !0) {
  t = t.replace(/\s+/g, "-"), t += e ? "-fragment" : "-vertex";
  const s = e ? Th : Ph;
  return s[t] ? (s[t]++, t += `-${s[t]}`) : s[t] = 1, i.indexOf("#define SHADER_NAME") !== -1 ? i : `${`#define SHADER_NAME ${t}`}
${i}`;
}
function kh(i, t) {
  return t ? i.replace("#version 300 es", "") : i;
}
const Hs = {
  // strips any version headers..
  stripVersion: kh,
  // adds precision string if not already present
  ensurePrecision: Ah,
  // add some defines if WebGL1 to make it more compatible with WebGL2 shaders
  addProgramDefines: Sh,
  // add the program name to the shader
  setProgramName: Ih,
  // add the version string to the shader header
  insertVersion: Ch
}, Ys = /* @__PURE__ */ Object.create(null), so = class Mi {
  /**
   * Creates a shiny new GlProgram. Used by WebGL renderer.
   * @param options - The options for the program.
   */
  constructor(t) {
    t = { ...Mi.defaultOptions, ...t };
    const e = t.fragment.indexOf("#version 300 es") !== -1, s = {
      stripVersion: e,
      ensurePrecision: {
        requestedFragmentPrecision: t.preferredFragmentPrecision,
        requestedVertexPrecision: t.preferredVertexPrecision,
        maxSupportedVertexPrecision: "highp",
        maxSupportedFragmentPrecision: Mh()
      },
      setProgramName: {
        name: t.name
      },
      addProgramDefines: e,
      insertVersion: e
    };
    let r = t.fragment, n = t.vertex;
    Object.keys(Hs).forEach((o) => {
      const a = s[o];
      r = Hs[o](r, a, !0), n = Hs[o](n, a, !1);
    }), this.fragment = r, this.vertex = n, this.transformFeedbackVaryings = t.transformFeedbackVaryings, this._key = Ui(`${this.vertex}:${this.fragment}`, "gl-program");
  }
  /** destroys the program */
  destroy() {
    this.fragment = null, this.vertex = null, this._attributeData = null, this._uniformData = null, this._uniformBlockData = null, this.transformFeedbackVaryings = null;
  }
  /**
   * Helper function that creates a program for a given source.
   * It will check the program cache if the program has already been created.
   * If it has that one will be returned, if not a new one will be created and cached.
   * @param options - The options for the program.
   * @returns A program using the same source
   */
  static from(t) {
    const e = `${t.vertex}:${t.fragment}`;
    return Ys[e] || (Ys[e] = new Mi(t)), Ys[e];
  }
};
so.defaultOptions = {
  preferredVertexPrecision: "highp",
  preferredFragmentPrecision: "mediump"
};
let Se = so;
const Er = {
  uint8x2: { size: 2, stride: 2, normalised: !1 },
  uint8x4: { size: 4, stride: 4, normalised: !1 },
  sint8x2: { size: 2, stride: 2, normalised: !1 },
  sint8x4: { size: 4, stride: 4, normalised: !1 },
  unorm8x2: { size: 2, stride: 2, normalised: !0 },
  unorm8x4: { size: 4, stride: 4, normalised: !0 },
  snorm8x2: { size: 2, stride: 2, normalised: !0 },
  snorm8x4: { size: 4, stride: 4, normalised: !0 },
  uint16x2: { size: 2, stride: 4, normalised: !1 },
  uint16x4: { size: 4, stride: 8, normalised: !1 },
  sint16x2: { size: 2, stride: 4, normalised: !1 },
  sint16x4: { size: 4, stride: 8, normalised: !1 },
  unorm16x2: { size: 2, stride: 4, normalised: !0 },
  unorm16x4: { size: 4, stride: 8, normalised: !0 },
  snorm16x2: { size: 2, stride: 4, normalised: !0 },
  snorm16x4: { size: 4, stride: 8, normalised: !0 },
  float16x2: { size: 2, stride: 4, normalised: !1 },
  float16x4: { size: 4, stride: 8, normalised: !1 },
  float32: { size: 1, stride: 4, normalised: !1 },
  float32x2: { size: 2, stride: 8, normalised: !1 },
  float32x3: { size: 3, stride: 12, normalised: !1 },
  float32x4: { size: 4, stride: 16, normalised: !1 },
  uint32: { size: 1, stride: 4, normalised: !1 },
  uint32x2: { size: 2, stride: 8, normalised: !1 },
  uint32x3: { size: 3, stride: 12, normalised: !1 },
  uint32x4: { size: 4, stride: 16, normalised: !1 },
  sint32: { size: 1, stride: 4, normalised: !1 },
  sint32x2: { size: 2, stride: 8, normalised: !1 },
  sint32x3: { size: 3, stride: 12, normalised: !1 },
  sint32x4: { size: 4, stride: 16, normalised: !1 }
};
function Eh(i) {
  return Er[i] ?? Er.float32;
}
const Lh = {
  f32: "float32",
  "vec2<f32>": "float32x2",
  "vec3<f32>": "float32x3",
  "vec4<f32>": "float32x4",
  vec2f: "float32x2",
  vec3f: "float32x3",
  vec4f: "float32x4",
  i32: "sint32",
  "vec2<i32>": "sint32x2",
  "vec3<i32>": "sint32x3",
  "vec4<i32>": "sint32x4",
  u32: "uint32",
  "vec2<u32>": "uint32x2",
  "vec3<u32>": "uint32x3",
  "vec4<u32>": "uint32x4",
  bool: "uint32",
  "vec2<bool>": "uint32x2",
  "vec3<bool>": "uint32x3",
  "vec4<bool>": "uint32x4"
};
function Bh({ source: i, entryPoint: t }) {
  const e = {}, s = i.indexOf(`fn ${t}`);
  if (s !== -1) {
    const r = i.indexOf("->", s);
    if (r !== -1) {
      const n = i.substring(s, r), o = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;
      let a;
      for (; (a = o.exec(n)) !== null; ) {
        const h = Lh[a[3]] ?? "float32";
        e[a[2]] = {
          location: parseInt(a[1], 10),
          format: h,
          stride: Eh(h).stride,
          offset: 0,
          instance: !1,
          start: 0
        };
      }
    }
  }
  return e;
}
function Vs(i) {
  const t = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, e = /@group\((\d+)\)/, s = /@binding\((\d+)\)/, r = /var(<[^>]+>)? (\w+)/, n = /:\s*(\w+)/, o = /struct\s+(\w+)\s*{([^}]+)}/g, a = /(\w+)\s*:\s*([\w\<\>]+)/g, h = /struct\s+(\w+)/, c = i.match(t)?.map((u) => ({
    group: parseInt(u.match(e)[1], 10),
    binding: parseInt(u.match(s)[1], 10),
    name: u.match(r)[2],
    isUniform: u.match(r)[1] === "<uniform>",
    type: u.match(n)[1]
  }));
  if (!c)
    return {
      groups: [],
      structs: []
    };
  const l = i.match(o)?.map((u) => {
    const f = u.match(h)[1], d = u.match(a).reduce((g, y) => {
      const [m, _] = y.split(":");
      return g[m.trim()] = _.trim(), g;
    }, {});
    return d ? { name: f, members: d } : null;
  }).filter(({ name: u }) => c.some((f) => f.type === u)) ?? [];
  return {
    groups: c,
    structs: l
  };
}
var Fe = /* @__PURE__ */ ((i) => (i[i.VERTEX = 1] = "VERTEX", i[i.FRAGMENT = 2] = "FRAGMENT", i[i.COMPUTE = 4] = "COMPUTE", i))(Fe || {});
function Nh({ groups: i }) {
  const t = [];
  for (let e = 0; e < i.length; e++) {
    const s = i[e];
    t[s.group] || (t[s.group] = []), s.isUniform ? t[s.group].push({
      binding: s.binding,
      visibility: Fe.VERTEX | Fe.FRAGMENT,
      buffer: {
        type: "uniform"
      }
    }) : s.type === "sampler" ? t[s.group].push({
      binding: s.binding,
      visibility: Fe.FRAGMENT,
      sampler: {
        type: "filtering"
      }
    }) : s.type === "texture_2d" && t[s.group].push({
      binding: s.binding,
      visibility: Fe.FRAGMENT,
      texture: {
        sampleType: "float",
        viewDimension: "2d",
        multisampled: !1
      }
    });
  }
  return t;
}
function Fh({ groups: i }) {
  const t = [];
  for (let e = 0; e < i.length; e++) {
    const s = i[e];
    t[s.group] || (t[s.group] = {}), t[s.group][s.name] = s.binding;
  }
  return t;
}
function Oh(i, t) {
  const e = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), r = [...i.structs, ...t.structs].filter((o) => e.has(o.name) ? !1 : (e.add(o.name), !0)), n = [...i.groups, ...t.groups].filter((o) => {
    const a = `${o.name}-${o.binding}`;
    return s.has(a) ? !1 : (s.add(a), !0);
  });
  return { structs: r, groups: n };
}
const Xs = /* @__PURE__ */ Object.create(null);
class se {
  /**
   * Create a new GpuProgram
   * @param options - The options for the gpu program
   */
  constructor(t) {
    this._layoutKey = 0, this._attributeLocationsKey = 0;
    const { fragment: e, vertex: s, layout: r, gpuLayout: n, name: o } = t;
    if (this.name = o, this.fragment = e, this.vertex = s, e.source === s.source) {
      const a = Vs(e.source);
      this.structsAndGroups = a;
    } else {
      const a = Vs(s.source), h = Vs(e.source);
      this.structsAndGroups = Oh(a, h);
    }
    this.layout = r ?? Fh(this.structsAndGroups), this.gpuLayout = n ?? Nh(this.structsAndGroups), this.autoAssignGlobalUniforms = this.layout[0]?.globalUniforms !== void 0, this.autoAssignLocalUniforms = this.layout[1]?.localUniforms !== void 0, this._generateProgramKey();
  }
  // TODO maker this pure
  _generateProgramKey() {
    const { vertex: t, fragment: e } = this, s = t.source + e.source + t.entryPoint + e.entryPoint;
    this._layoutKey = Ui(s, "program");
  }
  get attributeData() {
    return this._attributeData ?? (this._attributeData = Bh(this.vertex)), this._attributeData;
  }
  /** destroys the program */
  destroy() {
    this.gpuLayout = null, this.layout = null, this.structsAndGroups = null, this.fragment = null, this.vertex = null;
  }
  /**
   * Helper function that creates a program for a given source.
   * It will check the program cache if the program has already been created.
   * If it has that one will be returned, if not a new one will be created and cached.
   * @param options - The options for the program.
   * @returns A program using the same source
   */
  static from(t) {
    const e = `${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;
    return Xs[e] || (Xs[e] = new se(t)), Xs[e];
  }
}
const io = [
  "f32",
  "i32",
  "vec2<f32>",
  "vec3<f32>",
  "vec4<f32>",
  "mat2x2<f32>",
  "mat3x3<f32>",
  "mat4x4<f32>",
  "mat3x2<f32>",
  "mat4x2<f32>",
  "mat2x3<f32>",
  "mat4x3<f32>",
  "mat2x4<f32>",
  "mat3x4<f32>",
  "vec2<i32>",
  "vec3<i32>",
  "vec4<i32>"
], Rh = io.reduce((i, t) => (i[t] = !0, i), {});
function zh(i, t) {
  switch (i) {
    case "f32":
      return 0;
    case "vec2<f32>":
      return new Float32Array(2 * t);
    case "vec3<f32>":
      return new Float32Array(3 * t);
    case "vec4<f32>":
      return new Float32Array(4 * t);
    case "mat2x2<f32>":
      return new Float32Array([
        1,
        0,
        0,
        1
      ]);
    case "mat3x3<f32>":
      return new Float32Array([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ]);
    case "mat4x4<f32>":
      return new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ]);
  }
  return null;
}
const ro = class no {
  /**
   * Create a new Uniform group
   * @param uniformStructures - The structures of the uniform group
   * @param options - The optional parameters of this uniform group
   */
  constructor(t, e) {
    this._touched = 0, this.uid = vt("uniform"), this._resourceType = "uniformGroup", this._resourceId = vt("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, e = { ...no.defaultOptions, ...e }, this.uniformStructures = t;
    const s = {};
    for (const r in t) {
      const n = t[r];
      if (n.name = r, n.size = n.size ?? 1, !Rh[n.type])
        throw new Error(`Uniform type ${n.type} is not supported. Supported uniform types are: ${io.join(", ")}`);
      n.value ?? (n.value = zh(n.type, n.size)), s[r] = n.value;
    }
    this.uniforms = s, this._dirtyId = 1, this.ubo = e.ubo, this.isStatic = e.isStatic, this._signature = Ui(Object.keys(s).map(
      (r) => `${r}-${t[r].type}`
    ).join("-"), "uniform-group");
  }
  /** Call this if you want the uniform groups data to be uploaded to the GPU only useful if `isStatic` is true. */
  update() {
    this._dirtyId++;
  }
};
ro.defaultOptions = {
  /** if true the UniformGroup is handled as an Uniform buffer object. */
  ubo: !1,
  /** if true, then you are responsible for when the data is uploaded to the GPU by calling `update()` */
  isStatic: !1
};
let Ms = ro;
class ds {
  /**
   * Create a new instance eof the Bind Group.
   * @param resources - The resources that are bound together for use by a shader.
   */
  constructor(t) {
    this.resources = /* @__PURE__ */ Object.create(null), this._dirty = !0;
    let e = 0;
    for (const s in t) {
      const r = t[s];
      this.setResource(r, e++);
    }
    this._updateKey();
  }
  /**
   * Updates the key if its flagged as dirty. This is used internally to
   * match this bind group to a WebGPU BindGroup.
   * @internal
   * @ignore
   */
  _updateKey() {
    if (!this._dirty)
      return;
    this._dirty = !1;
    const t = [];
    let e = 0;
    for (const s in this.resources)
      t[e++] = this.resources[s]._resourceId;
    this._key = t.join("|");
  }
  /**
   * Set a resource at a given index. this function will
   * ensure that listeners will be removed from the current resource
   * and added to the new resource.
   * @param resource - The resource to set.
   * @param index - The index to set the resource at.
   */
  setResource(t, e) {
    const s = this.resources[e];
    t !== s && (s && t.off?.("change", this.onResourceChange, this), t.on?.("change", this.onResourceChange, this), this.resources[e] = t, this._dirty = !0);
  }
  /**
   * Returns the resource at the current specified index.
   * @param index - The index of the resource to get.
   * @returns - The resource at the specified index.
   */
  getResource(t) {
    return this.resources[t];
  }
  /**
   * Used internally to 'touch' each resource, to ensure that the GC
   * knows that all resources in this bind group are still being used.
   * @param tick - The current tick.
   * @internal
   * @ignore
   */
  _touch(t) {
    const e = this.resources;
    for (const s in e)
      e[s]._touched = t;
  }
  /** Destroys this bind group and removes all listeners. */
  destroy() {
    const t = this.resources;
    for (const e in t)
      t[e].off?.("change", this.onResourceChange, this);
    this.resources = null;
  }
  onResourceChange(t) {
    if (this._dirty = !0, t.destroyed) {
      const e = this.resources;
      for (const s in e)
        e[s] === t && (e[s] = null);
    } else
      this._updateKey();
  }
}
var $e = /* @__PURE__ */ ((i) => (i[i.WEBGL = 1] = "WEBGL", i[i.WEBGPU = 2] = "WEBGPU", i[i.BOTH = 3] = "BOTH", i))($e || {});
class Ss extends Rt {
  constructor(t) {
    super(), this._uniformBindMap = /* @__PURE__ */ Object.create(null), this._ownedBindGroups = [];
    let {
      gpuProgram: e,
      glProgram: s,
      groups: r,
      resources: n,
      compatibleRenderers: o,
      groupMap: a
    } = t;
    this.gpuProgram = e, this.glProgram = s, o === void 0 && (o = 0, e && (o |= $e.WEBGPU), s && (o |= $e.WEBGL)), this.compatibleRenderers = o;
    const h = {};
    if (!n && !r && (n = {}), n && r)
      throw new Error("[Shader] Cannot have both resources and groups");
    if (!e && r && !a)
      throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
    if (!e && r && a)
      for (const c in a)
        for (const l in a[c]) {
          const u = a[c][l];
          h[u] = {
            group: c,
            binding: l,
            name: u
          };
        }
    else if (e && r && !a) {
      const c = e.structsAndGroups.groups;
      a = {}, c.forEach((l) => {
        a[l.group] = a[l.group] || {}, a[l.group][l.binding] = l.name, h[l.name] = l;
      });
    } else if (n) {
      r = {}, a = {}, e && e.structsAndGroups.groups.forEach((u) => {
        a[u.group] = a[u.group] || {}, a[u.group][u.binding] = u.name, h[u.name] = u;
      });
      let c = 0;
      for (const l in n)
        h[l] || (r[99] || (r[99] = new ds(), this._ownedBindGroups.push(r[99])), h[l] = { group: 99, binding: c, name: l }, a[99] = a[99] || {}, a[99][c] = l, c++);
      for (const l in n) {
        const u = l;
        let f = n[l];
        !f.source && !f._resourceType && (f = new Ms(f));
        const d = h[u];
        d && (r[d.group] || (r[d.group] = new ds(), this._ownedBindGroups.push(r[d.group])), r[d.group].setResource(f, d.binding));
      }
    }
    this.groups = r, this._uniformBindMap = a, this.resources = this._buildResourceAccessor(r, h);
  }
  /**
   * Sometimes a resource group will be provided later (for example global uniforms)
   * In such cases, this method can be used to let the shader know about the group.
   * @param name - the name of the resource group
   * @param groupIndex - the index of the group (should match the webGPU shader group location)
   * @param bindIndex - the index of the bind point (should match the webGPU shader bind point)
   */
  addResource(t, e, s) {
    var r, n;
    (r = this._uniformBindMap)[e] || (r[e] = {}), (n = this._uniformBindMap[e])[s] || (n[s] = t), this.groups[e] || (this.groups[e] = new ds(), this._ownedBindGroups.push(this.groups[e]));
  }
  _buildResourceAccessor(t, e) {
    const s = {};
    for (const r in e) {
      const n = e[r];
      Object.defineProperty(s, n.name, {
        get() {
          return t[n.group].getResource(n.binding);
        },
        set(o) {
          t[n.group].setResource(o, n.binding);
        }
      });
    }
    return s;
  }
  /**
   * Use to destroy the shader when its not longer needed.
   * It will destroy the resources and remove listeners.
   * @param destroyPrograms - if the programs should be destroyed as well.
   * Make sure its not being used by other shaders!
   */
  destroy(t = !1) {
    this.emit("destroy", this), t && (this.gpuProgram?.destroy(), this.glProgram?.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach((e) => {
      e.destroy();
    }), this._ownedBindGroups = null, this.resources = null, this.groups = null;
  }
  static from(t) {
    const { gpu: e, gl: s, ...r } = t;
    let n, o;
    return e && (n = se.from(e)), s && (o = Se.from(s)), new Ss({
      gpuProgram: n,
      glProgram: o,
      ...r
    });
  }
}
const Dh = {
  normal: 0,
  add: 1,
  multiply: 2,
  screen: 3,
  overlay: 4,
  erase: 5,
  "normal-npm": 6,
  "add-npm": 7,
  "screen-npm": 8,
  min: 9,
  max: 10
}, qs = 0, Zs = 1, Ks = 2, Js = 3, Qs = 4, ti = 5, Si = class oo {
  constructor() {
    this.data = 0, this.blendMode = "normal", this.polygonOffset = 0, this.blend = !0, this.depthMask = !0;
  }
  /**
   * Activates blending of the computed fragment color values.
   * @default true
   */
  get blend() {
    return !!(this.data & 1 << qs);
  }
  set blend(t) {
    !!(this.data & 1 << qs) !== t && (this.data ^= 1 << qs);
  }
  /**
   * Activates adding an offset to depth values of polygon's fragments
   * @default false
   */
  get offsets() {
    return !!(this.data & 1 << Zs);
  }
  set offsets(t) {
    !!(this.data & 1 << Zs) !== t && (this.data ^= 1 << Zs);
  }
  /** The culling settings for this state none - No culling back - Back face culling front - Front face culling */
  set cullMode(t) {
    if (t === "none") {
      this.culling = !1;
      return;
    }
    this.culling = !0, this.clockwiseFrontFace = t === "front";
  }
  get cullMode() {
    return this.culling ? this.clockwiseFrontFace ? "front" : "back" : "none";
  }
  /**
   * Activates culling of polygons.
   * @default false
   */
  get culling() {
    return !!(this.data & 1 << Ks);
  }
  set culling(t) {
    !!(this.data & 1 << Ks) !== t && (this.data ^= 1 << Ks);
  }
  /**
   * Activates depth comparisons and updates to the depth buffer.
   * @default false
   */
  get depthTest() {
    return !!(this.data & 1 << Js);
  }
  set depthTest(t) {
    !!(this.data & 1 << Js) !== t && (this.data ^= 1 << Js);
  }
  /**
   * Enables or disables writing to the depth buffer.
   * @default true
   */
  get depthMask() {
    return !!(this.data & 1 << ti);
  }
  set depthMask(t) {
    !!(this.data & 1 << ti) !== t && (this.data ^= 1 << ti);
  }
  /**
   * Specifies whether or not front or back-facing polygons can be culled.
   * @default false
   */
  get clockwiseFrontFace() {
    return !!(this.data & 1 << Qs);
  }
  set clockwiseFrontFace(t) {
    !!(this.data & 1 << Qs) !== t && (this.data ^= 1 << Qs);
  }
  /**
   * The blend mode to be applied when this state is set. Apply a value of `normal` to reset the blend mode.
   * Setting this mode to anything other than NO_BLEND will automatically switch blending on.
   * @default 'normal'
   */
  get blendMode() {
    return this._blendMode;
  }
  set blendMode(t) {
    this.blend = t !== "none", this._blendMode = t, this._blendModeId = Dh[t] || 0;
  }
  /**
   * The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
   * @default 0
   */
  get polygonOffset() {
    return this._polygonOffset;
  }
  set polygonOffset(t) {
    this.offsets = !!t, this._polygonOffset = t;
  }
  toString() {
    return `[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`;
  }
  /**
   * A quickly getting an instance of a State that is configured for 2d rendering.
   * @returns a new State with values set for 2d rendering
   */
  static for2d() {
    const t = new oo();
    return t.depthTest = !1, t.blend = !0, t;
  }
};
Si.default2d = Si.for2d();
let jh = Si;
const ao = class Ai extends Ss {
  /**
   * @param options - The optional parameters of this filter.
   */
  constructor(t) {
    t = { ...Ai.defaultOptions, ...t }, super(t), this.enabled = !0, this._state = jh.for2d(), this.blendMode = t.blendMode, this.padding = t.padding, typeof t.antialias == "boolean" ? this.antialias = t.antialias ? "on" : "off" : this.antialias = t.antialias, this.resolution = t.resolution, this.blendRequired = t.blendRequired, this.clipToViewport = t.clipToViewport, this.addResource("uTexture", 0, 1);
  }
  /**
   * Applies the filter
   * @param filterManager - The renderer to retrieve the filter from
   * @param input - The input render target.
   * @param output - The target to output to.
   * @param clearMode - Should the output be cleared before rendering to it
   */
  apply(t, e, s, r) {
    t.applyFilter(this, e, s, r);
  }
  /**
   * Get the blend mode of the filter.
   * @default "normal"
   */
  get blendMode() {
    return this._state.blendMode;
  }
  /** Sets the blend mode of the filter. */
  set blendMode(t) {
    this._state.blendMode = t;
  }
  /**
   * A short hand function to create a filter based of a vertex and fragment shader src.
   * @param options
   * @returns A shiny new PixiJS filter!
   */
  static from(t) {
    const { gpu: e, gl: s, ...r } = t;
    let n, o;
    return e && (n = se.from(e)), s && (o = Se.from(s)), new Ai({
      gpuProgram: n,
      glProgram: o,
      ...r
    });
  }
};
ao.defaultOptions = {
  blendMode: "normal",
  resolution: 1,
  padding: 0,
  antialias: "off",
  blendRequired: !1,
  clipToViewport: !0
};
let As = ao;
const Ci = [];
bt.handleByNamedList(U.Environment, Ci);
async function Gh(i) {
  if (!i)
    for (let t = 0; t < Ci.length; t++) {
      const e = Ci[t];
      if (e.value.test()) {
        await e.value.load();
        return;
      }
    }
}
let Ie;
function Wh() {
  if (typeof Ie == "boolean")
    return Ie;
  try {
    Ie = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
  } catch {
    Ie = !1;
  }
  return Ie;
}
var es = { exports: {} }, Lr;
function $h() {
  if (Lr) return es.exports;
  Lr = 1, es.exports = i, es.exports.default = i;
  function i(p, x, w) {
    w = w || 2;
    var A = x && x.length, T = A ? x[0] * w : p.length, k = t(p, 0, T, w, !0), E = [];
    if (!k || k.next === k.prev) return E;
    var F, V, H, b, Q, G, at;
    if (A && (k = h(p, x, k, w)), p.length > 80 * w) {
      F = H = p[0], V = b = p[1];
      for (var K = w; K < T; K += w)
        Q = p[K], G = p[K + 1], Q < F && (F = Q), G < V && (V = G), Q > H && (H = Q), G > b && (b = G);
      at = Math.max(H - F, b - V), at = at !== 0 ? 32767 / at : 0;
    }
    return s(k, E, w, F, V, at, 0), E;
  }
  function t(p, x, w, A, T) {
    var k, E;
    if (T === zt(p, x, w, A) > 0)
      for (k = x; k < w; k += A) E = it(k, p[k], p[k + 1], E);
    else
      for (k = w - A; k >= x; k -= A) E = it(k, p[k], p[k + 1], E);
    return E && C(E, E.next) && (rt(E), E = E.next), E;
  }
  function e(p, x) {
    if (!p) return p;
    x || (x = p);
    var w = p, A;
    do
      if (A = !1, !w.steiner && (C(w, w.next) || S(w.prev, w, w.next) === 0)) {
        if (rt(w), w = x = w.prev, w === w.next) break;
        A = !0;
      } else
        w = w.next;
    while (A || w !== x);
    return x;
  }
  function s(p, x, w, A, T, k, E) {
    if (p) {
      !E && k && d(p, A, T, k);
      for (var F = p, V, H; p.prev !== p.next; ) {
        if (V = p.prev, H = p.next, k ? n(p, A, T, k) : r(p)) {
          x.push(V.i / w | 0), x.push(p.i / w | 0), x.push(H.i / w | 0), rt(p), p = H.next, F = H.next;
          continue;
        }
        if (p = H, p === F) {
          E ? E === 1 ? (p = o(e(p), x, w), s(p, x, w, A, T, k, 2)) : E === 2 && a(p, x, w, A, T, k) : s(e(p), x, w, A, T, k, 1);
          break;
        }
      }
    }
  }
  function r(p) {
    var x = p.prev, w = p, A = p.next;
    if (S(x, w, A) >= 0) return !1;
    for (var T = x.x, k = w.x, E = A.x, F = x.y, V = w.y, H = A.y, b = T < k ? T < E ? T : E : k < E ? k : E, Q = F < V ? F < H ? F : H : V < H ? V : H, G = T > k ? T > E ? T : E : k > E ? k : E, at = F > V ? F > H ? F : H : V > H ? V : H, K = A.next; K !== x; ) {
      if (K.x >= b && K.x <= G && K.y >= Q && K.y <= at && _(T, F, k, V, E, H, K.x, K.y) && S(K.prev, K, K.next) >= 0) return !1;
      K = K.next;
    }
    return !0;
  }
  function n(p, x, w, A) {
    var T = p.prev, k = p, E = p.next;
    if (S(T, k, E) >= 0) return !1;
    for (var F = T.x, V = k.x, H = E.x, b = T.y, Q = k.y, G = E.y, at = F < V ? F < H ? F : H : V < H ? V : H, K = b < Q ? b < G ? b : G : Q < G ? Q : G, W = F > V ? F > H ? F : H : V > H ? V : H, At = b > Q ? b > G ? b : G : Q > G ? Q : G, Z = y(at, K, x, w, A), B = y(W, At, x, w, A), D = p.prevZ, X = p.nextZ; D && D.z >= Z && X && X.z <= B; ) {
      if (D.x >= at && D.x <= W && D.y >= K && D.y <= At && D !== T && D !== E && _(F, b, V, Q, H, G, D.x, D.y) && S(D.prev, D, D.next) >= 0 || (D = D.prevZ, X.x >= at && X.x <= W && X.y >= K && X.y <= At && X !== T && X !== E && _(F, b, V, Q, H, G, X.x, X.y) && S(X.prev, X, X.next) >= 0)) return !1;
      X = X.nextZ;
    }
    for (; D && D.z >= Z; ) {
      if (D.x >= at && D.x <= W && D.y >= K && D.y <= At && D !== T && D !== E && _(F, b, V, Q, H, G, D.x, D.y) && S(D.prev, D, D.next) >= 0) return !1;
      D = D.prevZ;
    }
    for (; X && X.z <= B; ) {
      if (X.x >= at && X.x <= W && X.y >= K && X.y <= At && X !== T && X !== E && _(F, b, V, Q, H, G, X.x, X.y) && S(X.prev, X, X.next) >= 0) return !1;
      X = X.nextZ;
    }
    return !0;
  }
  function o(p, x, w) {
    var A = p;
    do {
      var T = A.prev, k = A.next.next;
      !C(T, k) && L(T, A, A.next, k) && O(T, k) && O(k, T) && (x.push(T.i / w | 0), x.push(A.i / w | 0), x.push(k.i / w | 0), rt(A), rt(A.next), A = p = k), A = A.next;
    } while (A !== p);
    return e(A);
  }
  function a(p, x, w, A, T, k) {
    var E = p;
    do {
      for (var F = E.next.next; F !== E.prev; ) {
        if (E.i !== F.i && M(E, F)) {
          var V = z(E, F);
          E = e(E, E.next), V = e(V, V.next), s(E, x, w, A, T, k, 0), s(V, x, w, A, T, k, 0);
          return;
        }
        F = F.next;
      }
      E = E.next;
    } while (E !== p);
  }
  function h(p, x, w, A) {
    var T = [], k, E, F, V, H;
    for (k = 0, E = x.length; k < E; k++)
      F = x[k] * A, V = k < E - 1 ? x[k + 1] * A : p.length, H = t(p, F, V, A, !1), H === H.next && (H.steiner = !0), T.push(m(H));
    for (T.sort(c), k = 0; k < T.length; k++)
      w = l(T[k], w);
    return w;
  }
  function c(p, x) {
    return p.x - x.x;
  }
  function l(p, x) {
    var w = u(p, x);
    if (!w)
      return x;
    var A = z(w, p);
    return e(A, A.next), e(w, w.next);
  }
  function u(p, x) {
    var w = x, A = p.x, T = p.y, k = -1 / 0, E;
    do {
      if (T <= w.y && T >= w.next.y && w.next.y !== w.y) {
        var F = w.x + (T - w.y) * (w.next.x - w.x) / (w.next.y - w.y);
        if (F <= A && F > k && (k = F, E = w.x < w.next.x ? w : w.next, F === A))
          return E;
      }
      w = w.next;
    } while (w !== x);
    if (!E) return null;
    var V = E, H = E.x, b = E.y, Q = 1 / 0, G;
    w = E;
    do
      A >= w.x && w.x >= H && A !== w.x && _(T < b ? A : k, T, H, b, T < b ? k : A, T, w.x, w.y) && (G = Math.abs(T - w.y) / (A - w.x), O(w, p) && (G < Q || G === Q && (w.x > E.x || w.x === E.x && f(E, w))) && (E = w, Q = G)), w = w.next;
    while (w !== V);
    return E;
  }
  function f(p, x) {
    return S(p.prev, p, x.prev) < 0 && S(x.next, p, p.next) < 0;
  }
  function d(p, x, w, A) {
    var T = p;
    do
      T.z === 0 && (T.z = y(T.x, T.y, x, w, A)), T.prevZ = T.prev, T.nextZ = T.next, T = T.next;
    while (T !== p);
    T.prevZ.nextZ = null, T.prevZ = null, g(T);
  }
  function g(p) {
    var x, w, A, T, k, E, F, V, H = 1;
    do {
      for (w = p, p = null, k = null, E = 0; w; ) {
        for (E++, A = w, F = 0, x = 0; x < H && (F++, A = A.nextZ, !!A); x++)
          ;
        for (V = H; F > 0 || V > 0 && A; )
          F !== 0 && (V === 0 || !A || w.z <= A.z) ? (T = w, w = w.nextZ, F--) : (T = A, A = A.nextZ, V--), k ? k.nextZ = T : p = T, T.prevZ = k, k = T;
        w = A;
      }
      k.nextZ = null, H *= 2;
    } while (E > 1);
    return p;
  }
  function y(p, x, w, A, T) {
    return p = (p - w) * T | 0, x = (x - A) * T | 0, p = (p | p << 8) & 16711935, p = (p | p << 4) & 252645135, p = (p | p << 2) & 858993459, p = (p | p << 1) & 1431655765, x = (x | x << 8) & 16711935, x = (x | x << 4) & 252645135, x = (x | x << 2) & 858993459, x = (x | x << 1) & 1431655765, p | x << 1;
  }
  function m(p) {
    var x = p, w = p;
    do
      (x.x < w.x || x.x === w.x && x.y < w.y) && (w = x), x = x.next;
    while (x !== p);
    return w;
  }
  function _(p, x, w, A, T, k, E, F) {
    return (T - E) * (x - F) >= (p - E) * (k - F) && (p - E) * (A - F) >= (w - E) * (x - F) && (w - E) * (k - F) >= (T - E) * (A - F);
  }
  function M(p, x) {
    return p.next.i !== x.i && p.prev.i !== x.i && !v(p, x) && // dones't intersect other edges
    (O(p, x) && O(x, p) && N(p, x) && // locally visible
    (S(p.prev, p, x.prev) || S(p, x.prev, x)) || // does not create opposite-facing sectors
    C(p, x) && S(p.prev, p, p.next) > 0 && S(x.prev, x, x.next) > 0);
  }
  function S(p, x, w) {
    return (x.y - p.y) * (w.x - x.x) - (x.x - p.x) * (w.y - x.y);
  }
  function C(p, x) {
    return p.x === x.x && p.y === x.y;
  }
  function L(p, x, w, A) {
    var T = I(S(p, x, w)), k = I(S(p, x, A)), E = I(S(w, A, p)), F = I(S(w, A, x));
    return !!(T !== k && E !== F || T === 0 && P(p, w, x) || k === 0 && P(p, A, x) || E === 0 && P(w, p, A) || F === 0 && P(w, x, A));
  }
  function P(p, x, w) {
    return x.x <= Math.max(p.x, w.x) && x.x >= Math.min(p.x, w.x) && x.y <= Math.max(p.y, w.y) && x.y >= Math.min(p.y, w.y);
  }
  function I(p) {
    return p > 0 ? 1 : p < 0 ? -1 : 0;
  }
  function v(p, x) {
    var w = p;
    do {
      if (w.i !== p.i && w.next.i !== p.i && w.i !== x.i && w.next.i !== x.i && L(w, w.next, p, x)) return !0;
      w = w.next;
    } while (w !== p);
    return !1;
  }
  function O(p, x) {
    return S(p.prev, p, p.next) < 0 ? S(p, x, p.next) >= 0 && S(p, p.prev, x) >= 0 : S(p, x, p.prev) < 0 || S(p, p.next, x) < 0;
  }
  function N(p, x) {
    var w = p, A = !1, T = (p.x + x.x) / 2, k = (p.y + x.y) / 2;
    do
      w.y > k != w.next.y > k && w.next.y !== w.y && T < (w.next.x - w.x) * (k - w.y) / (w.next.y - w.y) + w.x && (A = !A), w = w.next;
    while (w !== p);
    return A;
  }
  function z(p, x) {
    var w = new ft(p.i, p.x, p.y), A = new ft(x.i, x.x, x.y), T = p.next, k = x.prev;
    return p.next = x, x.prev = p, w.next = T, T.prev = w, A.next = w, w.prev = A, k.next = A, A.prev = k, A;
  }
  function it(p, x, w, A) {
    var T = new ft(p, x, w);
    return A ? (T.next = A.next, T.prev = A, A.next.prev = T, A.next = T) : (T.prev = T, T.next = T), T;
  }
  function rt(p) {
    p.next.prev = p.prev, p.prev.next = p.next, p.prevZ && (p.prevZ.nextZ = p.nextZ), p.nextZ && (p.nextZ.prevZ = p.prevZ);
  }
  function ft(p, x, w) {
    this.i = p, this.x = x, this.y = w, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
  }
  i.deviation = function(p, x, w, A) {
    var T = x && x.length, k = T ? x[0] * w : p.length, E = Math.abs(zt(p, 0, k, w));
    if (T)
      for (var F = 0, V = x.length; F < V; F++) {
        var H = x[F] * w, b = F < V - 1 ? x[F + 1] * w : p.length;
        E -= Math.abs(zt(p, H, b, w));
      }
    var Q = 0;
    for (F = 0; F < A.length; F += 3) {
      var G = A[F] * w, at = A[F + 1] * w, K = A[F + 2] * w;
      Q += Math.abs(
        (p[G] - p[K]) * (p[at + 1] - p[G + 1]) - (p[G] - p[at]) * (p[K + 1] - p[G + 1])
      );
    }
    return E === 0 && Q === 0 ? 0 : Math.abs((Q - E) / E);
  };
  function zt(p, x, w, A) {
    for (var T = 0, k = x, E = w - A; k < w; k += A)
      T += (p[E] - p[k]) * (p[k + 1] + p[E + 1]), E = k;
    return T;
  }
  return i.flatten = function(p) {
    for (var x = p[0][0].length, w = { vertices: [], holes: [], dimensions: x }, A = 0, T = 0; T < p.length; T++) {
      for (var k = 0; k < p[T].length; k++)
        for (var E = 0; E < x; E++) w.vertices.push(p[T][k][E]);
      T > 0 && (A += p[T - 1].length, w.holes.push(A));
    }
    return w;
  }, es.exports;
}
var Uh = $h();
const Hh = /* @__PURE__ */ ws(Uh);
var ho = /* @__PURE__ */ ((i) => (i[i.NONE = 0] = "NONE", i[i.COLOR = 16384] = "COLOR", i[i.STENCIL = 1024] = "STENCIL", i[i.DEPTH = 256] = "DEPTH", i[i.COLOR_DEPTH = 16640] = "COLOR_DEPTH", i[i.COLOR_STENCIL = 17408] = "COLOR_STENCIL", i[i.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", i[i.ALL = 17664] = "ALL", i))(ho || {});
class Yh {
  /**
   * @param name - The function name that will be executed on the listeners added to this Runner.
   */
  constructor(t) {
    this.items = [], this._name = t;
  }
  /* jsdoc/check-param-names */
  /**
   * Dispatch/Broadcast Runner to all listeners added to the queue.
   * @param {...any} params - (optional) parameters to pass to each listener
   */
  /* jsdoc/check-param-names */
  emit(t, e, s, r, n, o, a, h) {
    const { name: c, items: l } = this;
    for (let u = 0, f = l.length; u < f; u++)
      l[u][c](t, e, s, r, n, o, a, h);
    return this;
  }
  /**
   * Add a listener to the Runner
   *
   * Runners do not need to have scope or functions passed to them.
   * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
   * as the name provided to the Runner when it was created.
   *
   * Eg A listener passed to this Runner will require a 'complete' function.
   *
   * ```
   * import { Runner } from 'pixi.js';
   *
   * const complete = new Runner('complete');
   * ```
   *
   * The scope used will be the object itself.
   * @param {any} item - The object that will be listening.
   */
  add(t) {
    return t[this._name] && (this.remove(t), this.items.push(t)), this;
  }
  /**
   * Remove a single listener from the dispatch queue.
   * @param {any} item - The listener that you would like to remove.
   */
  remove(t) {
    const e = this.items.indexOf(t);
    return e !== -1 && this.items.splice(e, 1), this;
  }
  /**
   * Check to see if the listener is already in the Runner
   * @param {any} item - The listener that you would like to check.
   */
  contains(t) {
    return this.items.indexOf(t) !== -1;
  }
  /** Remove all listeners from the Runner */
  removeAll() {
    return this.items.length = 0, this;
  }
  /** Remove all references, don't use after this. */
  destroy() {
    this.removeAll(), this.items = null, this._name = null;
  }
  /**
   * `true` if there are no this Runner contains no listeners
   * @readonly
   */
  get empty() {
    return this.items.length === 0;
  }
  /**
   * The name of the runner.
   * @readonly
   */
  get name() {
    return this._name;
  }
}
const Vh = [
  "init",
  "destroy",
  "contextChange",
  "resolutionChange",
  "reset",
  "renderEnd",
  "renderStart",
  "render",
  "update",
  "postrender",
  "prerender"
], lo = class co extends Rt {
  /**
   * Set up a system with a collection of SystemClasses and runners.
   * Systems are attached dynamically to this class when added.
   * @param config - the config for the system manager
   */
  constructor(t) {
    super(), this.runners = /* @__PURE__ */ Object.create(null), this.renderPipes = /* @__PURE__ */ Object.create(null), this._initOptions = {}, this._systemsHash = /* @__PURE__ */ Object.create(null), this.type = t.type, this.name = t.name, this.config = t;
    const e = [...Vh, ...this.config.runners ?? []];
    this._addRunners(...e), this._unsafeEvalCheck();
  }
  /**
   * Initialize the renderer.
   * @param options - The options to use to create the renderer.
   */
  async init(t = {}) {
    const e = t.skipExtensionImports === !0 ? !0 : t.manageImports === !1;
    await Gh(e), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
    for (const s in this._systemsHash)
      t = { ...this._systemsHash[s].constructor.defaultOptions, ...t };
    t = { ...co.defaultOptions, ...t }, this._roundPixels = t.roundPixels ? 1 : 0;
    for (let s = 0; s < this.runners.init.items.length; s++)
      await this.runners.init.items[s].init(t);
    this._initOptions = t;
  }
  render(t, e) {
    let s = t;
    if (s instanceof Ct && (s = { container: s }, e && (ot(yt, "passing a second argument is deprecated, please use render options instead"), s.target = e.renderTexture)), s.target || (s.target = this.view.renderTarget), s.target === this.view.renderTarget && (this._lastObjectRendered = s.container, s.clearColor = this.background.colorRgba), s.clearColor) {
      const r = Array.isArray(s.clearColor) && s.clearColor.length === 4;
      s.clearColor = r ? s.clearColor : ut.shared.setValue(s.clearColor).toArray();
    }
    s.transform || (s.container.updateLocalTransform(), s.transform = s.container.localTransform), s.container.enableRenderGroup(), this.runners.prerender.emit(s), this.runners.renderStart.emit(s), this.runners.render.emit(s), this.runners.renderEnd.emit(s), this.runners.postrender.emit(s);
  }
  /**
   * Resizes the WebGL view to the specified width and height.
   * @param desiredScreenWidth - The desired width of the screen.
   * @param desiredScreenHeight - The desired height of the screen.
   * @param resolution - The resolution / device pixel ratio of the renderer.
   */
  resize(t, e, s) {
    const r = this.view.resolution;
    this.view.resize(t, e, s), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), s !== void 0 && s !== r && this.runners.resolutionChange.emit(s);
  }
  clear(t = {}) {
    const e = this;
    t.target || (t.target = e.renderTarget.renderTarget), t.clearColor || (t.clearColor = this.background.colorRgba), t.clear ?? (t.clear = ho.ALL);
    const { clear: s, clearColor: r, target: n } = t;
    ut.shared.setValue(r ?? this.background.colorRgba), e.renderTarget.clear(n, s, ut.shared.toArray());
  }
  /** The resolution / device pixel ratio of the renderer. */
  get resolution() {
    return this.view.resolution;
  }
  set resolution(t) {
    this.view.resolution = t, this.runners.resolutionChange.emit(t);
  }
  /**
   * Same as view.width, actual number of pixels in the canvas by horizontal.
   * @member {number}
   * @readonly
   * @default 800
   */
  get width() {
    return this.view.texture.frame.width;
  }
  /**
   * Same as view.height, actual number of pixels in the canvas by vertical.
   * @default 600
   */
  get height() {
    return this.view.texture.frame.height;
  }
  // NOTE: this was `view` in v7
  /**
   * The canvas element that everything is drawn to.
   * @type {environment.ICanvas}
   */
  get canvas() {
    return this.view.canvas;
  }
  /**
   * the last object rendered by the renderer. Useful for other plugins like interaction managers
   * @readonly
   */
  get lastObjectRendered() {
    return this._lastObjectRendered;
  }
  /**
   * Flag if we are rendering to the screen vs renderTexture
   * @readonly
   * @default true
   */
  get renderingToScreen() {
    return this.renderTarget.renderingToScreen;
  }
  /**
   * Measurements of the screen. (0, 0, screenWidth, screenHeight).
   *
   * Its safe to use as filterArea or hitArea for the whole stage.
   */
  get screen() {
    return this.view.screen;
  }
  /**
   * Create a bunch of runners based of a collection of ids
   * @param runnerIds - the runner ids to add
   */
  _addRunners(...t) {
    t.forEach((e) => {
      this.runners[e] = new Yh(e);
    });
  }
  _addSystems(t) {
    let e;
    for (e in t) {
      const s = t[e];
      this._addSystem(s.value, s.name);
    }
  }
  /**
   * Add a new system to the renderer.
   * @param ClassRef - Class reference
   * @param name - Property name for system, if not specified
   *        will use a static `name` property on the class itself. This
   *        name will be assigned as s property on the Renderer so make
   *        sure it doesn't collide with properties on Renderer.
   * @returns Return instance of renderer
   */
  _addSystem(t, e) {
    const s = new t(this);
    if (this[e])
      throw new Error(`Whoops! The name "${e}" is already in use`);
    this[e] = s, this._systemsHash[e] = s;
    for (const r in this.runners)
      this.runners[r].add(s);
    return this;
  }
  _addPipes(t, e) {
    const s = e.reduce((r, n) => (r[n.name] = n.value, r), {});
    t.forEach((r) => {
      const n = r.value, o = r.name, a = s[o];
      this.renderPipes[o] = new n(
        this,
        a ? new a() : null
      );
    });
  }
  destroy(t = !1) {
    this.runners.destroy.items.reverse(), this.runners.destroy.emit(t), Object.values(this.runners).forEach((e) => {
      e.destroy();
    }), this._systemsHash = null, this.renderPipes = null;
  }
  /**
   * Generate a texture from a container.
   * @param options - options or container target to use when generating the texture
   * @returns a texture
   */
  generateTexture(t) {
    return this.textureGenerator.generateTexture(t);
  }
  /**
   * Whether the renderer will round coordinates to whole pixels when rendering.
   * Can be overridden on a per scene item basis.
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  /**
   * Overridable function by `pixi.js/unsafe-eval` to silence
   * throwing an error if platform doesn't support unsafe-evals.
   * @private
   * @ignore
   */
  _unsafeEvalCheck() {
    if (!Wh())
      throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
};
lo.defaultOptions = {
  /**
   * Default resolution / device pixel ratio of the renderer.
   * @default 1
   */
  resolution: 1,
  /**
   * Should the `failIfMajorPerformanceCaveat` flag be enabled as a context option used in the `isWebGLSupported`
   * function. If set to true, a WebGL renderer can fail to be created if the browser thinks there could be
   * performance issues when using WebGL.
   *
   * In PixiJS v6 this has changed from true to false by default, to allow WebGL to work in as many
   * scenarios as possible. However, some users may have a poor experience, for example, if a user has a gpu or
   * driver version blacklisted by the
   * browser.
   *
   * If your application requires high performance rendering, you may wish to set this to false.
   * We recommend one of two options if you decide to set this flag to false:
   *
   * 1: Use the Canvas renderer as a fallback in case high performance WebGL is
   *    not supported.
   *
   * 2: Call `isWebGLSupported` (which if found in the utils package) in your code before attempting to create a
   *    PixiJS renderer, and show an error message to the user if the function returns false, explaining that their
   *    device & browser combination does not support high performance WebGL.
   *    This is a much better strategy than trying to create a PixiJS renderer and finding it then fails.
   * @default false
   */
  failIfMajorPerformanceCaveat: !1,
  /**
   * Should round pixels be forced when rendering?
   * @default false
   */
  roundPixels: !1
};
let uo = lo, ss;
function Xh(i) {
  return ss !== void 0 || (ss = (() => {
    const t = {
      stencil: !0,
      failIfMajorPerformanceCaveat: i ?? uo.defaultOptions.failIfMajorPerformanceCaveat
    };
    try {
      if (!mt.get().getWebGLRenderingContext())
        return !1;
      let s = mt.get().createCanvas().getContext("webgl", t);
      const r = !!s?.getContextAttributes()?.stencil;
      if (s) {
        const n = s.getExtension("WEBGL_lose_context");
        n && n.loseContext();
      }
      return s = null, r;
    } catch {
      return !1;
    }
  })()), ss;
}
let is;
async function qh(i = {}) {
  return is !== void 0 || (is = await (async () => {
    const t = mt.get().getNavigator().gpu;
    if (!t)
      return !1;
    try {
      return await (await t.requestAdapter(i)).requestDevice(), !0;
    } catch {
      return !1;
    }
  })()), is;
}
const Br = ["webgl", "webgpu", "canvas"];
async function Zh(i) {
  let t = [];
  i.preference ? (t.push(i.preference), Br.forEach((n) => {
    n !== i.preference && t.push(n);
  })) : t = Br.slice();
  let e, s = {};
  for (let n = 0; n < t.length; n++) {
    const o = t[n];
    if (o === "webgpu" && await qh()) {
      const { WebGPURenderer: a } = await import("./WebGPURenderer.js");
      e = a, s = { ...i, ...i.webgpu };
      break;
    } else if (o === "webgl" && Xh(
      i.failIfMajorPerformanceCaveat ?? uo.defaultOptions.failIfMajorPerformanceCaveat
    )) {
      const { WebGLRenderer: a } = await import("./WebGLRenderer.js");
      e = a, s = { ...i, ...i.webgl };
      break;
    } else if (o === "canvas")
      throw s = { ...i }, new Error("CanvasRenderer is not yet implemented");
  }
  if (delete s.webgpu, delete s.webgl, !e)
    throw new Error("No available renderer for the current environment");
  const r = new e();
  return await r.init(s), r;
}
const fo = "8.6.6";
class po {
  static init() {
    globalThis.__PIXI_APP_INIT__?.(this, fo);
  }
  static destroy() {
  }
}
po.extension = U.Application;
class Kh {
  constructor(t) {
    this._renderer = t;
  }
  init() {
    globalThis.__PIXI_RENDERER_INIT__?.(this._renderer, fo);
  }
  destroy() {
    this._renderer = null;
  }
}
Kh.extension = {
  type: [
    U.WebGLSystem,
    U.WebGPUSystem
  ],
  name: "initHook",
  priority: -10
};
const mo = class Ti {
  /** @ignore */
  constructor(...t) {
    this.stage = new Ct(), t[0] !== void 0 && ot(yt, "Application constructor options are deprecated, please use Application.init() instead.");
  }
  /**
   * @param options - The optional application and renderer parameters.
   */
  async init(t) {
    t = { ...t }, this.renderer = await Zh(t), Ti._plugins.forEach((e) => {
      e.init.call(this, t);
    });
  }
  /** Render the current stage. */
  render() {
    this.renderer.render({ container: this.stage });
  }
  /**
   * Reference to the renderer's canvas element.
   * @readonly
   * @member {HTMLCanvasElement}
   */
  get canvas() {
    return this.renderer.canvas;
  }
  /**
   * Reference to the renderer's canvas element.
   * @member {HTMLCanvasElement}
   * @deprecated since 8.0.0
   */
  get view() {
    return ot(yt, "Application.view is deprecated, please use Application.canvas instead."), this.renderer.canvas;
  }
  /**
   * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
   * @readonly
   */
  get screen() {
    return this.renderer.screen;
  }
  /**
   * Destroys the application and all of its resources.
   * @param {object|boolean}[rendererDestroyOptions=false] - The options for destroying the renderer.
   * @param {boolean}[rendererDestroyOptions.removeView=false] - Removes the Canvas element from the DOM.
   * @param {object|boolean} [options=false] - The options for destroying the stage.
   * @param {boolean} [options.children=false] - If set to true, all the children will have their destroy method
   * called as well. `options` will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for children with textures e.g. Sprites.
   * If options.children is set to true,
   * it should destroy the texture of the child sprite.
   * @param {boolean} [options.textureSource=false] - Only used for children with textures e.g. Sprites.
   *  If options.children is set to true,
   * it should destroy the texture source of the child sprite.
   * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
   * If options.children is set to true,
   * it should destroy the context of the child graphics.
   */
  destroy(t = !1, e = !1) {
    const s = Ti._plugins.slice(0);
    s.reverse(), s.forEach((r) => {
      r.destroy.call(this);
    }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
  }
};
mo._plugins = [];
let go = mo;
bt.handleByList(U.Application, go._plugins);
bt.add(po);
class yo extends Rt {
  constructor() {
    super(...arguments), this.chars = /* @__PURE__ */ Object.create(null), this.lineHeight = 0, this.fontFamily = "", this.fontMetrics = { fontSize: 0, ascent: 0, descent: 0 }, this.baseLineOffset = 0, this.distanceField = { type: "none", range: 0 }, this.pages = [], this.applyFillAsTint = !0, this.baseMeasurementFontSize = 100, this.baseRenderedFontSize = 100;
  }
  /**
   * The name of the font face.
   * @deprecated since 8.0.0 Use `fontFamily` instead.
   */
  get font() {
    return ot(yt, "BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead."), this.fontFamily;
  }
  /**
   * The map of base page textures (i.e., sheets of glyphs).
   * @deprecated since 8.0.0 Use `pages` instead.
   */
  get pageTextures() {
    return ot(yt, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  /**
   * The size of the font face in pixels.
   * @deprecated since 8.0.0 Use `fontMetrics.fontSize` instead.
   */
  get size() {
    return ot(yt, "BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead."), this.fontMetrics.fontSize;
  }
  /**
   * The kind of distance field for this font or "none".
   * @deprecated since 8.0.0 Use `distanceField.type` instead.
   */
  get distanceFieldRange() {
    return ot(yt, "BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead."), this.distanceField.range;
  }
  /**
   * The range of the distance field in pixels.
   * @deprecated since 8.0.0 Use `distanceField.range` instead.
   */
  get distanceFieldType() {
    return ot(yt, "BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead."), this.distanceField.type;
  }
  destroy(t = !1) {
    this.emit("destroy", this), this.removeAllListeners();
    for (const e in this.chars)
      this.chars[e].texture?.destroy();
    this.chars = null, t && (this.pages.forEach((e) => e.texture.destroy(!0)), this.pages = null);
  }
}
const xo = class Pi {
  constructor(t, e, s, r) {
    this.uid = vt("fillGradient"), this.type = "linear", this.gradientStops = [], this._styleKey = null, this.x0 = t, this.y0 = e, this.x1 = s, this.y1 = r;
  }
  addColorStop(t, e) {
    return this.gradientStops.push({ offset: t, color: ut.shared.setValue(e).toHexa() }), this._styleKey = null, this;
  }
  // TODO move to the system!
  buildLinearGradient() {
    if (this.texture)
      return;
    const t = Pi.defaultTextureSize, { gradientStops: e } = this, s = mt.get().createCanvas();
    s.width = t, s.height = t;
    const r = s.getContext("2d"), n = r.createLinearGradient(0, 0, Pi.defaultTextureSize, 1);
    for (let y = 0; y < e.length; y++) {
      const m = e[y];
      n.addColorStop(m.offset, m.color);
    }
    r.fillStyle = n, r.fillRect(0, 0, t, t), this.texture = new tt({
      source: new ve({
        resource: s,
        addressModeU: "clamp-to-edge",
        addressModeV: "repeat"
      })
    });
    const { x0: o, y0: a, x1: h, y1: c } = this, l = new et(), u = h - o, f = c - a, d = Math.sqrt(u * u + f * f), g = Math.atan2(f, u);
    l.translate(-o, -a), l.scale(1 / t, 1 / t), l.rotate(-g), l.scale(256 / d, 1), this.transform = l, this._styleKey = null;
  }
  get styleKey() {
    if (this._styleKey)
      return this._styleKey;
    const t = this.gradientStops.map((r) => `${r.offset}-${r.color}`).join("-"), e = this.texture.uid, s = this.transform.toArray().join("-");
    return `fill-gradient-${this.uid}-${t}-${e}-${s}-${this.x0}-${this.y0}-${this.x1}-${this.y1}`;
  }
};
xo.defaultTextureSize = 256;
let Ue = xo;
const Nr = {
  repeat: {
    addressModeU: "repeat",
    addressModeV: "repeat"
  },
  "repeat-x": {
    addressModeU: "repeat",
    addressModeV: "clamp-to-edge"
  },
  "repeat-y": {
    addressModeU: "clamp-to-edge",
    addressModeV: "repeat"
  },
  "no-repeat": {
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge"
  }
};
class Cs {
  constructor(t, e) {
    this.uid = vt("fillPattern"), this.transform = new et(), this._styleKey = null, this.texture = t, this.transform.scale(
      1 / t.frame.width,
      1 / t.frame.height
    ), e && (t.source.style.addressModeU = Nr[e].addressModeU, t.source.style.addressModeV = Nr[e].addressModeV);
  }
  setTransform(t) {
    const e = this.texture;
    this.transform.copyFrom(t), this.transform.invert(), this.transform.scale(
      1 / e.frame.width,
      1 / e.frame.height
    ), this._styleKey = null;
  }
  get styleKey() {
    return this._styleKey ? this._styleKey : (this._styleKey = `fill-pattern-${this.uid}-${this.texture.uid}-${this.transform.toArray().join("-")}`, this._styleKey);
  }
}
var ei, Fr;
function Jh() {
  if (Fr) return ei;
  Fr = 1, ei = e;
  var i = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, t = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
  function e(n) {
    var o = [];
    return n.replace(t, function(a, h, c) {
      var l = h.toLowerCase();
      for (c = r(c), l == "m" && c.length > 2 && (o.push([h].concat(c.splice(0, 2))), l = "l", h = h == "m" ? "l" : "L"); ; ) {
        if (c.length == i[l])
          return c.unshift(h), o.push(c);
        if (c.length < i[l]) throw new Error("malformed path data");
        o.push([h].concat(c.splice(0, i[l])));
      }
    }), o;
  }
  var s = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
  function r(n) {
    var o = n.match(s);
    return o ? o.map(Number) : [];
  }
  return ei;
}
var Qh = Jh();
const tl = /* @__PURE__ */ ws(Qh);
function el(i, t) {
  const e = tl(i), s = [];
  let r = null, n = 0, o = 0;
  for (let a = 0; a < e.length; a++) {
    const h = e[a], c = h[0], l = h;
    switch (c) {
      case "M":
        n = l[1], o = l[2], t.moveTo(n, o);
        break;
      case "m":
        n += l[1], o += l[2], t.moveTo(n, o);
        break;
      case "H":
        n = l[1], t.lineTo(n, o);
        break;
      case "h":
        n += l[1], t.lineTo(n, o);
        break;
      case "V":
        o = l[1], t.lineTo(n, o);
        break;
      case "v":
        o += l[1], t.lineTo(n, o);
        break;
      case "L":
        n = l[1], o = l[2], t.lineTo(n, o);
        break;
      case "l":
        n += l[1], o += l[2], t.lineTo(n, o);
        break;
      case "C":
        n = l[5], o = l[6], t.bezierCurveTo(
          l[1],
          l[2],
          l[3],
          l[4],
          n,
          o
        );
        break;
      case "c":
        t.bezierCurveTo(
          n + l[1],
          o + l[2],
          n + l[3],
          o + l[4],
          n + l[5],
          o + l[6]
        ), n += l[5], o += l[6];
        break;
      case "S":
        n = l[3], o = l[4], t.bezierCurveToShort(
          l[1],
          l[2],
          n,
          o
        );
        break;
      case "s":
        t.bezierCurveToShort(
          n + l[1],
          o + l[2],
          n + l[3],
          o + l[4]
        ), n += l[3], o += l[4];
        break;
      case "Q":
        n = l[3], o = l[4], t.quadraticCurveTo(
          l[1],
          l[2],
          n,
          o
        );
        break;
      case "q":
        t.quadraticCurveTo(
          n + l[1],
          o + l[2],
          n + l[3],
          o + l[4]
        ), n += l[3], o += l[4];
        break;
      case "T":
        n = l[1], o = l[2], t.quadraticCurveToShort(
          n,
          o
        );
        break;
      case "t":
        n += l[1], o += l[2], t.quadraticCurveToShort(
          n,
          o
        );
        break;
      case "A":
        n = l[6], o = l[7], t.arcToSvg(
          l[1],
          l[2],
          l[3],
          l[4],
          l[5],
          n,
          o
        );
        break;
      case "a":
        n += l[6], o += l[7], t.arcToSvg(
          l[1],
          l[2],
          l[3],
          l[4],
          l[5],
          n,
          o
        );
        break;
      case "Z":
      case "z":
        t.closePath(), s.length > 0 && (r = s.pop(), r ? (n = r.startX, o = r.startY) : (n = 0, o = 0)), r = null;
        break;
      default:
        xt(`Unknown SVG path command: ${c}`);
    }
    c !== "Z" && c !== "z" && r === null && (r = { startX: n, startY: o }, s.push(r));
  }
  return t;
}
class Hi {
  /**
   * @param x - The X coordinate of the center of this circle
   * @param y - The Y coordinate of the center of this circle
   * @param radius - The radius of the circle
   */
  constructor(t = 0, e = 0, s = 0) {
    this.type = "circle", this.x = t, this.y = e, this.radius = s;
  }
  /**
   * Creates a clone of this Circle instance
   * @returns A copy of the Circle
   */
  clone() {
    return new Hi(this.x, this.y, this.radius);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Circle
   */
  contains(t, e) {
    if (this.radius <= 0)
      return !1;
    const s = this.radius * this.radius;
    let r = this.x - t, n = this.y - e;
    return r *= r, n *= n, r + n <= s;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width - The width of the line to check
   * @param alignment - The alignment of the stroke, 0.5 by default
   * @returns Whether the x/y coordinates are within this Circle
   */
  strokeContains(t, e, s, r = 0.5) {
    if (this.radius === 0)
      return !1;
    const n = this.x - t, o = this.y - e, a = this.radius, h = (1 - r) * s, c = Math.sqrt(n * n + o * o);
    return c <= a + h && c > a - (s - h);
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t || (t = new wt()), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t;
  }
  /**
   * Copies another circle to this one.
   * @param circle - The circle to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.radius = t.radius, this;
  }
  /**
   * Copies this circle to another one.
   * @param circle - The circle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
  }
}
class Yi {
  /**
   * @param x - The X coordinate of the center of this ellipse
   * @param y - The Y coordinate of the center of this ellipse
   * @param halfWidth - The half width of this ellipse
   * @param halfHeight - The half height of this ellipse
   */
  constructor(t = 0, e = 0, s = 0, r = 0) {
    this.type = "ellipse", this.x = t, this.y = e, this.halfWidth = s, this.halfHeight = r;
  }
  /**
   * Creates a clone of this Ellipse instance
   * @returns {Ellipse} A copy of the ellipse
   */
  clone() {
    return new Yi(this.x, this.y, this.halfWidth, this.halfHeight);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coords are within this ellipse
   */
  contains(t, e) {
    if (this.halfWidth <= 0 || this.halfHeight <= 0)
      return !1;
    let s = (t - this.x) / this.halfWidth, r = (e - this.y) / this.halfHeight;
    return s *= s, r *= r, s + r <= 1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse including stroke
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke
   * @returns Whether the x/y coords are within this ellipse
   */
  strokeContains(t, e, s, r = 0.5) {
    const { halfWidth: n, halfHeight: o } = this;
    if (n <= 0 || o <= 0)
      return !1;
    const a = s * (1 - r), h = s - a, c = n - h, l = o - h, u = n + a, f = o + a, d = t - this.x, g = e - this.y, y = d * d / (c * c) + g * g / (l * l), m = d * d / (u * u) + g * g / (f * f);
    return y > 1 && m <= 1;
  }
  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t || (t = new wt()), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t;
  }
  /**
   * Copies another ellipse to this one.
   * @param ellipse - The ellipse to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.halfWidth = t.halfWidth, this.halfHeight = t.halfHeight, this;
  }
  /**
   * Copies this ellipse to another one.
   * @param ellipse - The ellipse to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Ellipse x=${this.x} y=${this.y} halfWidth=${this.halfWidth} halfHeight=${this.halfHeight}]`;
  }
}
function sl(i, t, e, s, r, n) {
  const o = i - e, a = t - s, h = r - e, c = n - s, l = o * h + a * c, u = h * h + c * c;
  let f = -1;
  u !== 0 && (f = l / u);
  let d, g;
  f < 0 ? (d = e, g = s) : f > 1 ? (d = r, g = n) : (d = e + f * h, g = s + f * c);
  const y = i - d, m = t - g;
  return y * y + m * m;
}
class De {
  /**
   * @param points - This can be an array of Points
   *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
   *  the arguments passed can be all the points of the polygon e.g.
   *  `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat
   *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
   */
  constructor(...t) {
    this.type = "polygon";
    let e = Array.isArray(t[0]) ? t[0] : t;
    if (typeof e[0] != "number") {
      const s = [];
      for (let r = 0, n = e.length; r < n; r++)
        s.push(e[r].x, e[r].y);
      e = s;
    }
    this.points = e, this.closePath = !0;
  }
  /**
   * Creates a clone of this polygon.
   * @returns - A copy of the polygon.
   */
  clone() {
    const t = this.points.slice(), e = new De(t);
    return e.closePath = this.closePath, e;
  }
  /**
   * Checks whether the x and y coordinates passed to this function are contained within this polygon.
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this polygon.
   */
  contains(t, e) {
    let s = !1;
    const r = this.points.length / 2;
    for (let n = 0, o = r - 1; n < r; o = n++) {
      const a = this.points[n * 2], h = this.points[n * 2 + 1], c = this.points[o * 2], l = this.points[o * 2 + 1];
      h > e != l > e && t < (c - a) * ((e - h) / (l - h)) + a && (s = !s);
    }
    return s;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this polygon including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke, 0.5 by default
   * @returns Whether the x/y coordinates are within this polygon
   */
  strokeContains(t, e, s, r = 0.5) {
    const n = s * s, o = n * (1 - r), a = n - o, { points: h } = this, c = h.length - (this.closePath ? 0 : 2);
    for (let l = 0; l < c; l += 2) {
      const u = h[l], f = h[l + 1], d = h[(l + 2) % h.length], g = h[(l + 3) % h.length], y = sl(t, e, u, f, d, g), m = Math.sign((d - u) * (e - f) - (g - f) * (t - u));
      if (y <= (m < 0 ? a : o))
        return !0;
    }
    return !1;
  }
  /**
   * Returns the framing rectangle of the polygon as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    t || (t = new wt());
    const e = this.points;
    let s = 1 / 0, r = -1 / 0, n = 1 / 0, o = -1 / 0;
    for (let a = 0, h = e.length; a < h; a += 2) {
      const c = e[a], l = e[a + 1];
      s = c < s ? c : s, r = c > r ? c : r, n = l < n ? l : n, o = l > o ? l : o;
    }
    return t.x = s, t.width = r - s, t.y = n, t.height = o - n, t;
  }
  /**
   * Copies another polygon to this one.
   * @param polygon - The polygon to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.points = t.points.slice(), this.closePath = t.closePath, this;
  }
  /**
   * Copies this polygon to another one.
   * @param polygon - The polygon to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:PolygoncloseStroke=${this.closePath}points=${this.points.reduce((t, e) => `${t}, ${e}`, "")}]`;
  }
  /**
   * Get the last X coordinate of the polygon
   * @readonly
   */
  get lastX() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the last Y coordinate of the polygon
   * @readonly
   */
  get lastY() {
    return this.points[this.points.length - 1];
  }
  /**
   * Get the first X coordinate of the polygon
   * @readonly
   */
  get x() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the first Y coordinate of the polygon
   * @readonly
   */
  get y() {
    return this.points[this.points.length - 1];
  }
}
const rs = (i, t, e, s, r, n, o) => {
  const a = i - e, h = t - s, c = Math.sqrt(a * a + h * h);
  return c >= r - n && c <= r + o;
};
class Vi {
  /**
   * @param x - The X coordinate of the upper-left corner of the rounded rectangle
   * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param width - The overall width of this rounded rectangle
   * @param height - The overall height of this rounded rectangle
   * @param radius - Controls the radius of the rounded corners
   */
  constructor(t = 0, e = 0, s = 0, r = 0, n = 20) {
    this.type = "roundedRectangle", this.x = t, this.y = e, this.width = s, this.height = r, this.radius = n;
  }
  /**
   * Returns the framing rectangle of the rounded rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t || (t = new wt()), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
  }
  /**
   * Creates a clone of this Rounded Rectangle.
   * @returns - A copy of the rounded rectangle.
   */
  clone() {
    return new Vi(this.x, this.y, this.width, this.height, this.radius);
  }
  /**
   * Copies another rectangle to this one.
   * @param rectangle - The rectangle to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @param rectangle - The rectangle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this Rounded Rectangle.
   */
  contains(t, e) {
    if (this.width <= 0 || this.height <= 0)
      return !1;
    if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
      const s = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
      if (e >= this.y + s && e <= this.y + this.height - s || t >= this.x + s && t <= this.x + this.width - s)
        return !0;
      let r = t - (this.x + s), n = e - (this.y + s);
      const o = s * s;
      if (r * r + n * n <= o || (r = t - (this.x + this.width - s), r * r + n * n <= o) || (n = e - (this.y + this.height - s), r * r + n * n <= o) || (r = t - (this.x + s), r * r + n * n <= o))
        return !0;
    }
    return !1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @param pX - The X coordinate of the point to test
   * @param pY - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke, 0.5 by default
   * @returns Whether the x/y coordinates are within this rectangle
   */
  strokeContains(t, e, s, r = 0.5) {
    const { x: n, y: o, width: a, height: h, radius: c } = this, l = s * (1 - r), u = s - l, f = n + c, d = o + c, g = a - c * 2, y = h - c * 2, m = n + a, _ = o + h;
    return (t >= n - l && t <= n + u || t >= m - u && t <= m + l) && e >= d && e <= d + y || (e >= o - l && e <= o + u || e >= _ - u && e <= _ + l) && t >= f && t <= f + g ? !0 : (
      // Top-left
      t < f && e < d && rs(
        t,
        e,
        f,
        d,
        c,
        u,
        l
      ) || t > m - c && e < d && rs(
        t,
        e,
        m - c,
        d,
        c,
        u,
        l
      ) || t > m - c && e > _ - c && rs(
        t,
        e,
        m - c,
        _ - c,
        c,
        u,
        l
      ) || t < f && e > _ - c && rs(
        t,
        e,
        f,
        _ - c,
        c,
        u,
        l
      )
    );
  }
  toString() {
    return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
  }
}
const il = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function rl(i) {
  let t = "";
  for (let e = 0; e < i; ++e)
    e > 0 && (t += `
else `), e < i - 1 && (t += `if(test == ${e}.0){}`);
  return t;
}
function nl(i, t) {
  if (i === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  const e = t.createShader(t.FRAGMENT_SHADER);
  try {
    for (; ; ) {
      const s = il.replace(/%forloop%/gi, rl(i));
      if (t.shaderSource(e, s), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS))
        i = i / 2 | 0;
      else
        break;
    }
  } finally {
    t.deleteShader(e);
  }
  return i;
}
let de = null;
function _o() {
  if (de)
    return de;
  const i = eo();
  return de = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), de = nl(
    de,
    i
  ), i.getExtension("WEBGL_lose_context")?.loseContext(), de;
}
const bo = {};
function ol(i, t) {
  let e = 2166136261;
  for (let s = 0; s < t; s++)
    e ^= i[s].uid, e = Math.imul(e, 16777619), e >>>= 0;
  return bo[e] || al(i, t, e);
}
let si = 0;
function al(i, t, e) {
  const s = {};
  let r = 0;
  si || (si = _o());
  for (let o = 0; o < si; o++) {
    const a = o < t ? i[o] : tt.EMPTY.source;
    s[r++] = a.source, s[r++] = a.style;
  }
  const n = new ds(s);
  return bo[e] = n, n;
}
class Or {
  constructor(t) {
    typeof t == "number" ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData), this.size = this.rawBinaryData.byteLength;
  }
  /** View on the raw binary data as a `Int8Array`. */
  get int8View() {
    return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
  }
  /** View on the raw binary data as a `Uint8Array`. */
  get uint8View() {
    return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
  }
  /**  View on the raw binary data as a `Int16Array`. */
  get int16View() {
    return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
  }
  /** View on the raw binary data as a `Int32Array`. */
  get int32View() {
    return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
  }
  /** View on the raw binary data as a `Float64Array`. */
  get float64View() {
    return this._float64Array || (this._float64Array = new Float64Array(this.rawBinaryData)), this._float64Array;
  }
  /** View on the raw binary data as a `BigUint64Array`. */
  get bigUint64View() {
    return this._bigUint64Array || (this._bigUint64Array = new BigUint64Array(this.rawBinaryData)), this._bigUint64Array;
  }
  /**
   * Returns the view of the given type.
   * @param type - One of `int8`, `uint8`, `int16`,
   *    `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - typed array of given type
   */
  view(t) {
    return this[`${t}View`];
  }
  /** Destroys all buffer references. Do not use after calling this. */
  destroy() {
    this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this.uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
  }
  /**
   * Returns the size of the given type in bytes.
   * @param type - One of `int8`, `uint8`, `int16`,
   *   `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - size of the type in bytes
   */
  static sizeOf(t) {
    switch (t) {
      case "int8":
      case "uint8":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int32":
      case "uint32":
      case "float32":
        return 4;
      default:
        throw new Error(`${t} isn't a valid view type`);
    }
  }
}
function Rr(i, t) {
  const e = i.byteLength / 8 | 0, s = new Float64Array(i, 0, e);
  new Float64Array(t, 0, e).set(s);
  const n = i.byteLength - e * 8;
  if (n > 0) {
    const o = new Uint8Array(i, e * 8, n);
    new Uint8Array(t, e * 8, n).set(o);
  }
}
const hl = {
  normal: "normal-npm",
  add: "add-npm",
  screen: "screen-npm"
};
var ll = /* @__PURE__ */ ((i) => (i[i.DISABLED = 0] = "DISABLED", i[i.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", i[i.MASK_ACTIVE = 2] = "MASK_ACTIVE", i[i.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", i[i.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", i[i.NONE = 5] = "NONE", i))(ll || {});
function zr(i, t) {
  return t.alphaMode === "no-premultiply-alpha" && hl[i] || i;
}
class cl {
  constructor() {
    this.ids = /* @__PURE__ */ Object.create(null), this.textures = [], this.count = 0;
  }
  /** Clear the textures and their locations. */
  clear() {
    for (let t = 0; t < this.count; t++) {
      const e = this.textures[t];
      this.textures[t] = null, this.ids[e.uid] = null;
    }
    this.count = 0;
  }
}
class ul {
  constructor() {
    this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new cl(), this.blendMode = "normal", this.topology = "triangle-strip", this.canBundle = !0;
  }
  destroy() {
    this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null;
  }
}
const wo = [];
let Ii = 0;
function Dr() {
  return Ii > 0 ? wo[--Ii] : new ul();
}
function jr(i) {
  wo[Ii++] = i;
}
let ke = 0;
const vo = class fs {
  constructor(t = {}) {
    this.uid = vt("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], fs.defaultOptions.maxTextures = fs.defaultOptions.maxTextures ?? _o(), t = { ...fs.defaultOptions, ...t };
    const { maxTextures: e, attributesInitialSize: s, indicesInitialSize: r } = t;
    this.attributeBuffer = new Or(s * 4), this.indexBuffer = new Uint16Array(r), this.maxTextures = e;
  }
  begin() {
    this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
    for (let t = 0; t < this.batchIndex; t++)
      jr(this.batches[t]);
    this.batchIndex = 0, this._batchIndexStart = 0, this._batchIndexSize = 0, this.dirty = !0;
  }
  add(t) {
    this._elements[this.elementSize++] = t, t._indexStart = this.indexSize, t._attributeStart = this.attributeSize, t._batcher = this, this.indexSize += t.indexSize, this.attributeSize += t.attributeSize * this.vertexSize;
  }
  checkAndUpdateTexture(t, e) {
    const s = t._batch.textures.ids[e._source.uid];
    return !s && s !== 0 ? !1 : (t._textureId = s, t.texture = e, !0);
  }
  updateElement(t) {
    this.dirty = !0;
    const e = this.attributeBuffer;
    t.packAsQuad ? this.packQuadAttributes(
      t,
      e.float32View,
      e.uint32View,
      t._attributeStart,
      t._textureId
    ) : this.packAttributes(
      t,
      e.float32View,
      e.uint32View,
      t._attributeStart,
      t._textureId
    );
  }
  /**
   * breaks the batcher. This happens when a batch gets too big,
   * or we need to switch to a different type of rendering (a filter for example)
   * @param instructionSet
   */
  break(t) {
    const e = this._elements;
    if (!e[this.elementStart])
      return;
    let s = Dr(), r = s.textures;
    r.clear();
    const n = e[this.elementStart];
    let o = zr(n.blendMode, n.texture._source), a = n.topology;
    this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
    const h = this.attributeBuffer.float32View, c = this.attributeBuffer.uint32View, l = this.indexBuffer;
    let u = this._batchIndexSize, f = this._batchIndexStart, d = "startBatch";
    const g = this.maxTextures;
    for (let y = this.elementStart; y < this.elementSize; ++y) {
      const m = e[y];
      e[y] = null;
      const M = m.texture._source, S = zr(m.blendMode, M), C = o !== S || a !== m.topology;
      if (M._batchTick === ke && !C) {
        m._textureId = M._textureBindLocation, u += m.indexSize, m.packAsQuad ? (this.packQuadAttributes(
          m,
          h,
          c,
          m._attributeStart,
          m._textureId
        ), this.packQuadIndex(
          l,
          m._indexStart,
          m._attributeStart / this.vertexSize
        )) : (this.packAttributes(
          m,
          h,
          c,
          m._attributeStart,
          m._textureId
        ), this.packIndex(
          m,
          l,
          m._indexStart,
          m._attributeStart / this.vertexSize
        )), m._batch = s;
        continue;
      }
      M._batchTick = ke, (r.count >= g || C) && (this._finishBatch(
        s,
        f,
        u - f,
        r,
        o,
        a,
        t,
        d
      ), d = "renderBatch", f = u, o = S, a = m.topology, s = Dr(), r = s.textures, r.clear(), ++ke), m._textureId = M._textureBindLocation = r.count, r.ids[M.uid] = r.count, r.textures[r.count++] = M, m._batch = s, u += m.indexSize, m.packAsQuad ? (this.packQuadAttributes(
        m,
        h,
        c,
        m._attributeStart,
        m._textureId
      ), this.packQuadIndex(
        l,
        m._indexStart,
        m._attributeStart / this.vertexSize
      )) : (this.packAttributes(
        m,
        h,
        c,
        m._attributeStart,
        m._textureId
      ), this.packIndex(
        m,
        l,
        m._indexStart,
        m._attributeStart / this.vertexSize
      ));
    }
    r.count > 0 && (this._finishBatch(
      s,
      f,
      u - f,
      r,
      o,
      a,
      t,
      d
    ), f = u, ++ke), this.elementStart = this.elementSize, this._batchIndexStart = f, this._batchIndexSize = u;
  }
  _finishBatch(t, e, s, r, n, o, a, h) {
    t.gpuBindGroup = null, t.bindGroup = null, t.action = h, t.batcher = this, t.textures = r, t.blendMode = n, t.topology = o, t.start = e, t.size = s, ++ke, this.batches[this.batchIndex++] = t, a.add(t);
  }
  finish(t) {
    this.break(t);
  }
  /**
   * Resizes the attribute buffer to the given size (1 = 1 float32)
   * @param size - the size in vertices to ensure (not bytes!)
   */
  ensureAttributeBuffer(t) {
    t * 4 <= this.attributeBuffer.size || this._resizeAttributeBuffer(t * 4);
  }
  /**
   * Resizes the index buffer to the given size (1 = 1 float32)
   * @param size - the size in vertices to ensure (not bytes!)
   */
  ensureIndexBuffer(t) {
    t <= this.indexBuffer.length || this._resizeIndexBuffer(t);
  }
  _resizeAttributeBuffer(t) {
    const e = Math.max(t, this.attributeBuffer.size * 2), s = new Or(e);
    Rr(this.attributeBuffer.rawBinaryData, s.rawBinaryData), this.attributeBuffer = s;
  }
  _resizeIndexBuffer(t) {
    const e = this.indexBuffer;
    let s = Math.max(t, e.length * 1.5);
    s += s % 2;
    const r = s > 65535 ? new Uint32Array(s) : new Uint16Array(s);
    if (r.BYTES_PER_ELEMENT !== e.BYTES_PER_ELEMENT)
      for (let n = 0; n < e.length; n++)
        r[n] = e[n];
    else
      Rr(e.buffer, r.buffer);
    this.indexBuffer = r;
  }
  packQuadIndex(t, e, s) {
    t[e] = s + 0, t[e + 1] = s + 1, t[e + 2] = s + 2, t[e + 3] = s + 0, t[e + 4] = s + 2, t[e + 5] = s + 3;
  }
  packIndex(t, e, s, r) {
    const n = t.indices, o = t.indexSize, a = t.indexOffset, h = t.attributeOffset;
    for (let c = 0; c < o; c++)
      e[s++] = r + n[c + a] - h;
  }
  destroy() {
    for (let t = 0; t < this.batches.length; t++)
      jr(this.batches[t]);
    this.batches = null;
    for (let t = 0; t < this._elements.length; t++)
      this._elements[t]._batch = null;
    this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
  }
};
vo.defaultOptions = {
  maxTextures: null,
  attributesInitialSize: 4,
  indicesInitialSize: 6
};
let dl = vo;
var Et = /* @__PURE__ */ ((i) => (i[i.MAP_READ = 1] = "MAP_READ", i[i.MAP_WRITE = 2] = "MAP_WRITE", i[i.COPY_SRC = 4] = "COPY_SRC", i[i.COPY_DST = 8] = "COPY_DST", i[i.INDEX = 16] = "INDEX", i[i.VERTEX = 32] = "VERTEX", i[i.UNIFORM = 64] = "UNIFORM", i[i.STORAGE = 128] = "STORAGE", i[i.INDIRECT = 256] = "INDIRECT", i[i.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", i[i.STATIC = 1024] = "STATIC", i))(Et || {});
class He extends Rt {
  /**
   * Creates a new Buffer with the given options
   * @param options - the options for the buffer
   */
  constructor(t) {
    let { data: e, size: s } = t;
    const { usage: r, label: n, shrinkToFit: o } = t;
    super(), this.uid = vt("buffer"), this._resourceType = "buffer", this._resourceId = vt("resource"), this._touched = 0, this._updateID = 1, this._dataInt32 = null, this.shrinkToFit = !0, this.destroyed = !1, e instanceof Array && (e = new Float32Array(e)), this._data = e, s ?? (s = e?.byteLength);
    const a = !!e;
    this.descriptor = {
      size: s,
      usage: r,
      mappedAtCreation: a,
      label: n
    }, this.shrinkToFit = o ?? !0;
  }
  /** the data in the buffer */
  get data() {
    return this._data;
  }
  set data(t) {
    this.setDataWithSize(t, t.length, !0);
  }
  get dataInt32() {
    return this._dataInt32 || (this._dataInt32 = new Int32Array(this.data.buffer)), this._dataInt32;
  }
  /** whether the buffer is static or not */
  get static() {
    return !!(this.descriptor.usage & Et.STATIC);
  }
  set static(t) {
    t ? this.descriptor.usage |= Et.STATIC : this.descriptor.usage &= ~Et.STATIC;
  }
  /**
   * Sets the data in the buffer to the given value. This will immediately update the buffer on the GPU.
   * If you only want to update a subset of the buffer, you can pass in the size of the data.
   * @param value - the data to set
   * @param size - the size of the data in bytes
   * @param syncGPU - should the buffer be updated on the GPU immediately?
   */
  setDataWithSize(t, e, s) {
    if (this._updateID++, this._updateSize = e * t.BYTES_PER_ELEMENT, this._data === t) {
      s && this.emit("update", this);
      return;
    }
    const r = this._data;
    if (this._data = t, this._dataInt32 = null, !r || r.length !== t.length) {
      !this.shrinkToFit && r && t.byteLength < r.byteLength ? s && this.emit("update", this) : (this.descriptor.size = t.byteLength, this._resourceId = vt("resource"), this.emit("change", this));
      return;
    }
    s && this.emit("update", this);
  }
  /**
   * updates the buffer on the GPU to reflect the data in the buffer.
   * By default it will update the entire buffer. If you only want to update a subset of the buffer,
   * you can pass in the size of the buffer to update.
   * @param sizeInBytes - the new size of the buffer in bytes
   */
  update(t) {
    this._updateSize = t ?? this._updateSize, this._updateID++, this.emit("update", this);
  }
  /** Destroys the buffer */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this._data = null, this.descriptor = null, this.removeAllListeners();
  }
}
function Mo(i, t) {
  if (!(i instanceof He)) {
    let e = t ? Et.INDEX : Et.VERTEX;
    i instanceof Array && (t ? (i = new Uint32Array(i), e = Et.INDEX | Et.COPY_DST) : (i = new Float32Array(i), e = Et.VERTEX | Et.COPY_DST)), i = new He({
      data: i,
      label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
      usage: e
    });
  }
  return i;
}
function fl(i, t, e) {
  const s = i.getAttribute(t);
  if (!s)
    return e.minX = 0, e.minY = 0, e.maxX = 0, e.maxY = 0, e;
  const r = s.buffer.data;
  let n = 1 / 0, o = 1 / 0, a = -1 / 0, h = -1 / 0;
  const c = r.BYTES_PER_ELEMENT, l = (s.offset || 0) / c, u = (s.stride || 2 * 4) / c;
  for (let f = l; f < r.length; f += u) {
    const d = r[f], g = r[f + 1];
    d > a && (a = d), g > h && (h = g), d < n && (n = d), g < o && (o = g);
  }
  return e.minX = n, e.minY = o, e.maxX = a, e.maxY = h, e;
}
function pl(i) {
  return (i instanceof He || Array.isArray(i) || i.BYTES_PER_ELEMENT) && (i = {
    buffer: i
  }), i.buffer = Mo(i.buffer, !1), i;
}
class ml extends Rt {
  /**
   * Create a new instance of a geometry
   * @param options - The options for the geometry.
   */
  constructor(t = {}) {
    super(), this.uid = vt("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new Xt(), this._boundsDirty = !0;
    const { attributes: e, indexBuffer: s, topology: r } = t;
    if (this.buffers = [], this.attributes = {}, e)
      for (const n in e)
        this.addAttribute(n, e[n]);
    this.instanceCount = t.instanceCount ?? 1, s && this.addIndex(s), this.topology = r || "triangle-list";
  }
  onBufferUpdate() {
    this._boundsDirty = !0, this.emit("update", this);
  }
  /**
   * Returns the requested attribute.
   * @param id - The name of the attribute required
   * @returns - The attribute requested.
   */
  getAttribute(t) {
    return this.attributes[t];
  }
  /**
   * Returns the index buffer
   * @returns - The index buffer.
   */
  getIndex() {
    return this.indexBuffer;
  }
  /**
   * Returns the requested buffer.
   * @param id - The name of the buffer required.
   * @returns - The buffer requested.
   */
  getBuffer(t) {
    return this.getAttribute(t).buffer;
  }
  /**
   * Used to figure out how many vertices there are in this geometry
   * @returns the number of vertices in the geometry
   */
  getSize() {
    for (const t in this.attributes) {
      const e = this.attributes[t];
      return e.buffer.data.length / (e.stride / 4 || e.size);
    }
    return 0;
  }
  /**
   * Adds an attribute to the geometry.
   * @param name - The name of the attribute to add.
   * @param attributeOption - The attribute option to add.
   */
  addAttribute(t, e) {
    const s = pl(e);
    this.buffers.indexOf(s.buffer) === -1 && (this.buffers.push(s.buffer), s.buffer.on("update", this.onBufferUpdate, this), s.buffer.on("change", this.onBufferUpdate, this)), this.attributes[t] = s;
  }
  /**
   * Adds an index buffer to the geometry.
   * @param indexBuffer - The index buffer to add. Can be a Buffer, TypedArray, or an array of numbers.
   */
  addIndex(t) {
    this.indexBuffer = Mo(t, !0), this.buffers.push(this.indexBuffer);
  }
  /** Returns the bounds of the geometry. */
  get bounds() {
    return this._boundsDirty ? (this._boundsDirty = !1, fl(this, "aPosition", this._bounds)) : this._bounds;
  }
  /**
   * destroys the geometry.
   * @param destroyBuffers - destroy the buffers associated with this geometry
   */
  destroy(t = !1) {
    this.emit("destroy", this), this.removeAllListeners(), t && this.buffers.forEach((e) => e.destroy()), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
  }
}
const gl = new Float32Array(1), yl = new Uint32Array(1);
class xl extends ml {
  constructor() {
    const e = new He({
      data: gl,
      label: "attribute-batch-buffer",
      usage: Et.VERTEX | Et.COPY_DST,
      shrinkToFit: !1
    }), s = new He({
      data: yl,
      label: "index-batch-buffer",
      usage: Et.INDEX | Et.COPY_DST,
      // | BufferUsage.STATIC,
      shrinkToFit: !1
    }), r = 6 * 4;
    super({
      attributes: {
        aPosition: {
          buffer: e,
          format: "float32x2",
          stride: r,
          offset: 0
        },
        aUV: {
          buffer: e,
          format: "float32x2",
          stride: r,
          offset: 2 * 4
        },
        aColor: {
          buffer: e,
          format: "unorm8x4",
          stride: r,
          offset: 4 * 4
        },
        aTextureIdAndRound: {
          buffer: e,
          format: "uint16x2",
          stride: r,
          offset: 5 * 4
        }
      },
      indexBuffer: s
    });
  }
}
function Gr(i, t, e) {
  if (i)
    for (const s in i) {
      const r = s.toLocaleLowerCase(), n = t[r];
      if (n) {
        let o = i[s];
        s === "header" && (o = o.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), e && n.push(`//----${e}----//`), n.push(o);
      } else
        xt(`${s} placement hook does not exist in shader`);
    }
}
const _l = /\{\{(.*?)\}\}/g;
function Wr(i) {
  const t = {};
  return (i.match(_l)?.map((s) => s.replace(/[{()}]/g, "")) ?? []).forEach((s) => {
    t[s] = [];
  }), t;
}
function $r(i, t) {
  let e;
  const s = /@in\s+([^;]+);/g;
  for (; (e = s.exec(i)) !== null; )
    t.push(e[1]);
}
function Ur(i, t, e = !1) {
  const s = [];
  $r(t, s), i.forEach((a) => {
    a.header && $r(a.header, s);
  });
  const r = s;
  e && r.sort();
  const n = r.map((a, h) => `       @location(${h}) ${a},`).join(`
`);
  let o = t.replace(/@in\s+[^;]+;\s*/g, "");
  return o = o.replace("{{in}}", `
${n}
`), o;
}
function Hr(i, t) {
  let e;
  const s = /@out\s+([^;]+);/g;
  for (; (e = s.exec(i)) !== null; )
    t.push(e[1]);
}
function bl(i) {
  const e = /\b(\w+)\s*:/g.exec(i);
  return e ? e[1] : "";
}
function wl(i) {
  const t = /@.*?\s+/g;
  return i.replace(t, "");
}
function vl(i, t) {
  const e = [];
  Hr(t, e), i.forEach((h) => {
    h.header && Hr(h.header, e);
  });
  let s = 0;
  const r = e.sort().map((h) => h.indexOf("builtin") > -1 ? h : `@location(${s++}) ${h}`).join(`,
`), n = e.sort().map((h) => `       var ${wl(h)};`).join(`
`), o = `return VSOutput(
            ${e.sort().map((h) => ` ${bl(h)}`).join(`,
`)});`;
  let a = t.replace(/@out\s+[^;]+;\s*/g, "");
  return a = a.replace("{{struct}}", `
${r}
`), a = a.replace("{{start}}", `
${n}
`), a = a.replace("{{return}}", `
${o}
`), a;
}
function Yr(i, t) {
  let e = i;
  for (const s in t) {
    const r = t[s];
    r.join(`
`).length ? e = e.replace(`{{${s}}}`, `//-----${s} START-----//
${r.join(`
`)}
//----${s} FINISH----//`) : e = e.replace(`{{${s}}}`, "");
  }
  return e;
}
const te = /* @__PURE__ */ Object.create(null), ii = /* @__PURE__ */ new Map();
let Ml = 0;
function Sl({
  template: i,
  bits: t
}) {
  const e = So(i, t);
  if (te[e])
    return te[e];
  const { vertex: s, fragment: r } = Cl(i, t);
  return te[e] = Ao(s, r, t), te[e];
}
function Al({
  template: i,
  bits: t
}) {
  const e = So(i, t);
  return te[e] || (te[e] = Ao(i.vertex, i.fragment, t)), te[e];
}
function Cl(i, t) {
  const e = t.map((o) => o.vertex).filter((o) => !!o), s = t.map((o) => o.fragment).filter((o) => !!o);
  let r = Ur(e, i.vertex, !0);
  r = vl(e, r);
  const n = Ur(s, i.fragment, !0);
  return {
    vertex: r,
    fragment: n
  };
}
function So(i, t) {
  return t.map((e) => (ii.has(e) || ii.set(e, Ml++), ii.get(e))).sort((e, s) => e - s).join("-") + i.vertex + i.fragment;
}
function Ao(i, t, e) {
  const s = Wr(i), r = Wr(t);
  return e.forEach((n) => {
    Gr(n.vertex, s, n.name), Gr(n.fragment, r, n.name);
  }), {
    vertex: Yr(i, s),
    fragment: Yr(t, r)
  };
}
const Tl = (
  /* wgsl */
  `
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}
        
        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);
       
        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`
), Pl = (
  /* wgsl */
  `
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;
   
    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {
        
        {{start}}

        var outColor:vec4<f32>;
      
        {{main}}
        
        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`
), Il = (
  /* glsl */
  `
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;
        
        {{start}}
        
        vColor = vec4(1.);
        
        {{main}}
        
        vUV = uv;
        
        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`
), kl = (
  /* glsl */
  `
   
    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {
        
        {{start}}

        vec4 outColor;
      
        {{main}}
        
        finalColor = outColor * vColor;
        
        {{end}}
    }
`
), El = {
  name: "global-uniforms-bit",
  vertex: {
    header: (
      /* wgsl */
      `
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `
    )
  }
}, Ll = {
  name: "global-uniforms-bit",
  vertex: {
    header: (
      /* glsl */
      `
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `
    )
  }
};
function Bl({ bits: i, name: t }) {
  const e = Sl({
    template: {
      fragment: Pl,
      vertex: Tl
    },
    bits: [
      El,
      ...i
    ]
  });
  return se.from({
    name: t,
    vertex: {
      source: e.vertex,
      entryPoint: "main"
    },
    fragment: {
      source: e.fragment,
      entryPoint: "main"
    }
  });
}
function Nl({ bits: i, name: t }) {
  return new Se({
    name: t,
    ...Al({
      template: {
        vertex: Il,
        fragment: kl
      },
      bits: [
        Ll,
        ...i
      ]
    })
  });
}
const Fl = {
  name: "color-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            @in aColor: vec4<f32>;
        `
    ),
    main: (
      /* wgsl */
      `
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `
    )
  }
}, Ol = {
  name: "color-bit",
  vertex: {
    header: (
      /* glsl */
      `
            in vec4 aColor;
        `
    ),
    main: (
      /* glsl */
      `
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `
    )
  }
}, ri = {};
function Rl(i) {
  const t = [];
  if (i === 1)
    t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
  else {
    let e = 0;
    for (let s = 0; s < i; s++)
      t.push(`@group(1) @binding(${e++}) var textureSource${s + 1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${e++}) var textureSampler${s + 1}: sampler;`);
  }
  return t.join(`
`);
}
function zl(i) {
  const t = [];
  if (i === 1)
    t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");
  else {
    t.push("switch vTextureId {");
    for (let e = 0; e < i; e++)
      e === i - 1 ? t.push("  default:{") : t.push(`  case ${e}:{`), t.push(`      outColor = textureSampleGrad(textureSource${e + 1}, textureSampler${e + 1}, vUV, uvDx, uvDy);`), t.push("      break;}");
    t.push("}");
  }
  return t.join(`
`);
}
function Dl(i) {
  return ri[i] || (ri[i] = {
    name: "texture-batch-bit",
    vertex: {
      header: `
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,
      main: `
                vTextureId = aTextureIdAndRound.y;
            `,
      end: `
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `
    },
    fragment: {
      header: `
                @in @interpolate(flat) vTextureId: u32;

                ${Rl(i)}
            `,
      main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${zl(i)}
            `
    }
  }), ri[i];
}
const ni = {};
function jl(i) {
  const t = [];
  for (let e = 0; e < i; e++)
    e > 0 && t.push("else"), e < i - 1 && t.push(`if(vTextureId < ${e}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${e}], vUV);`), t.push("}");
  return t.join(`
`);
}
function Gl(i) {
  return ni[i] || (ni[i] = {
    name: "texture-batch-bit",
    vertex: {
      header: `
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,
      main: `
                vTextureId = aTextureIdAndRound.y;
            `,
      end: `
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `
    },
    fragment: {
      header: `
                in float vTextureId;

                uniform sampler2D uTextures[${i}];

            `,
      main: `

                ${jl(i)}
            `
    }
  }), ni[i];
}
const Wl = {
  name: "round-pixels-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> 
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
    )
  }
}, $l = {
  name: "round-pixels-bit",
  vertex: {
    header: (
      /* glsl */
      `   
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {       
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
    )
  }
}, Vr = {};
function Ul(i) {
  let t = Vr[i];
  if (t)
    return t;
  const e = new Int32Array(i);
  for (let s = 0; s < i; s++)
    e[s] = s;
  return t = Vr[i] = new Ms({
    uTextures: { value: e, type: "i32", size: i }
  }, { isStatic: !0 }), t;
}
class Hl extends Ss {
  constructor(t) {
    const e = Nl({
      name: "batch",
      bits: [
        Ol,
        Gl(t),
        $l
      ]
    }), s = Bl({
      name: "batch",
      bits: [
        Fl,
        Dl(t),
        Wl
      ]
    });
    super({
      glProgram: e,
      gpuProgram: s,
      resources: {
        batchSamplers: Ul(t)
      }
    });
  }
}
let Xr = null;
const Co = class To extends dl {
  constructor() {
    super(...arguments), this.geometry = new xl(), this.shader = Xr || (Xr = new Hl(this.maxTextures)), this.name = To.extension.name, this.vertexSize = 6;
  }
  /**
   * Packs the attributes of a DefaultBatchableMeshElement into the provided views.
   * @param element - The DefaultBatchableMeshElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packAttributes(t, e, s, r, n) {
    const o = n << 16 | t.roundPixels & 65535, a = t.transform, h = a.a, c = a.b, l = a.c, u = a.d, f = a.tx, d = a.ty, { positions: g, uvs: y } = t, m = t.color, _ = t.attributeOffset, M = _ + t.attributeSize;
    for (let S = _; S < M; S++) {
      const C = S * 2, L = g[C], P = g[C + 1];
      e[r++] = h * L + l * P + f, e[r++] = u * P + c * L + d, e[r++] = y[C], e[r++] = y[C + 1], s[r++] = m, s[r++] = o;
    }
  }
  /**
   * Packs the attributes of a DefaultBatchableQuadElement into the provided views.
   * @param element - The DefaultBatchableQuadElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packQuadAttributes(t, e, s, r, n) {
    const o = t.texture, a = t.transform, h = a.a, c = a.b, l = a.c, u = a.d, f = a.tx, d = a.ty, g = t.bounds, y = g.maxX, m = g.minX, _ = g.maxY, M = g.minY, S = o.uvs, C = t.color, L = n << 16 | t.roundPixels & 65535;
    e[r + 0] = h * m + l * M + f, e[r + 1] = u * M + c * m + d, e[r + 2] = S.x0, e[r + 3] = S.y0, s[r + 4] = C, s[r + 5] = L, e[r + 6] = h * y + l * M + f, e[r + 7] = u * M + c * y + d, e[r + 8] = S.x1, e[r + 9] = S.y1, s[r + 10] = C, s[r + 11] = L, e[r + 12] = h * y + l * _ + f, e[r + 13] = u * _ + c * y + d, e[r + 14] = S.x2, e[r + 15] = S.y2, s[r + 16] = C, s[r + 17] = L, e[r + 18] = h * m + l * _ + f, e[r + 19] = u * _ + c * m + d, e[r + 20] = S.x3, e[r + 21] = S.y3, s[r + 22] = C, s[r + 23] = L;
  }
};
Co.extension = {
  type: [
    U.Batcher
  ],
  name: "default"
};
let Yl = Co;
function Vl(i, t, e, s, r, n, o, a = null) {
  let h = 0;
  e *= t, r *= n;
  const c = a.a, l = a.b, u = a.c, f = a.d, d = a.tx, g = a.ty;
  for (; h < o; ) {
    const y = i[e], m = i[e + 1];
    s[r] = c * y + u * m + d, s[r + 1] = l * y + f * m + g, r += n, e += t, h++;
  }
}
function Xl(i, t, e, s) {
  let r = 0;
  for (t *= e; r < s; )
    i[t] = 0, i[t + 1] = 0, t += e, r++;
}
function Po(i, t, e, s, r) {
  const n = t.a, o = t.b, a = t.c, h = t.d, c = t.tx, l = t.ty;
  e || (e = 0), s || (s = 2), r || (r = i.length / s - e);
  let u = e * s;
  for (let f = 0; f < r; f++) {
    const d = i[u], g = i[u + 1];
    i[u] = n * d + a * g + c, i[u + 1] = o * d + h * g + l, u += s;
  }
}
const ql = new et();
class Io {
  constructor() {
    this.packAsQuad = !1, this.batcherName = "default", this.topology = "triangle-list", this.applyTransform = !0, this.roundPixels = 0, this._batcher = null, this._batch = null;
  }
  get uvs() {
    return this.geometryData.uvs;
  }
  get positions() {
    return this.geometryData.vertices;
  }
  get indices() {
    return this.geometryData.indices;
  }
  get blendMode() {
    return this.applyTransform ? this.renderable.groupBlendMode : "normal";
  }
  get color() {
    const t = this.baseColor, e = t >> 16 | t & 65280 | (t & 255) << 16, s = this.renderable;
    return s ? On(e, s.groupColor) + (this.alpha * s.groupAlpha * 255 << 24) : e + (this.alpha * 255 << 24);
  }
  get transform() {
    return this.renderable?.groupTransform || ql;
  }
  copyTo(t) {
    t.indexOffset = this.indexOffset, t.indexSize = this.indexSize, t.attributeOffset = this.attributeOffset, t.attributeSize = this.attributeSize, t.baseColor = this.baseColor, t.alpha = this.alpha, t.texture = this.texture, t.geometryData = this.geometryData, t.topology = this.topology;
  }
  reset() {
    this.applyTransform = !0, this.renderable = null, this.topology = "triangle-list";
  }
}
const Ye = {
  extension: {
    type: U.ShapeBuilder,
    name: "circle"
  },
  build(i, t) {
    let e, s, r, n, o, a;
    if (i.type === "circle") {
      const C = i;
      e = C.x, s = C.y, o = a = C.radius, r = n = 0;
    } else if (i.type === "ellipse") {
      const C = i;
      e = C.x, s = C.y, o = C.halfWidth, a = C.halfHeight, r = n = 0;
    } else {
      const C = i, L = C.width / 2, P = C.height / 2;
      e = C.x + L, s = C.y + P, o = a = Math.max(0, Math.min(C.radius, Math.min(L, P))), r = L - o, n = P - a;
    }
    if (!(o >= 0 && a >= 0 && r >= 0 && n >= 0))
      return t;
    const h = Math.ceil(2.3 * Math.sqrt(o + a)), c = h * 8 + (r ? 4 : 0) + (n ? 4 : 0);
    if (c === 0)
      return t;
    if (h === 0)
      return t[0] = t[6] = e + r, t[1] = t[3] = s + n, t[2] = t[4] = e - r, t[5] = t[7] = s - n, t;
    let l = 0, u = h * 4 + (r ? 2 : 0) + 2, f = u, d = c, g = r + o, y = n, m = e + g, _ = e - g, M = s + y;
    if (t[l++] = m, t[l++] = M, t[--u] = M, t[--u] = _, n) {
      const C = s - y;
      t[f++] = _, t[f++] = C, t[--d] = C, t[--d] = m;
    }
    for (let C = 1; C < h; C++) {
      const L = Math.PI / 2 * (C / h), P = r + Math.cos(L) * o, I = n + Math.sin(L) * a, v = e + P, O = e - P, N = s + I, z = s - I;
      t[l++] = v, t[l++] = N, t[--u] = N, t[--u] = O, t[f++] = O, t[f++] = z, t[--d] = z, t[--d] = v;
    }
    g = r, y = n + a, m = e + g, _ = e - g, M = s + y;
    const S = s - y;
    return t[l++] = m, t[l++] = M, t[--d] = S, t[--d] = m, r && (t[l++] = _, t[l++] = M, t[--d] = S, t[--d] = _), t;
  },
  triangulate(i, t, e, s, r, n) {
    if (i.length === 0)
      return;
    let o = 0, a = 0;
    for (let l = 0; l < i.length; l += 2)
      o += i[l], a += i[l + 1];
    o /= i.length / 2, a /= i.length / 2;
    let h = s;
    t[h * e] = o, t[h * e + 1] = a;
    const c = h++;
    for (let l = 0; l < i.length; l += 2)
      t[h * e] = i[l], t[h * e + 1] = i[l + 1], l > 0 && (r[n++] = h, r[n++] = c, r[n++] = h - 1), h++;
    r[n++] = c + 1, r[n++] = c, r[n++] = h - 1;
  }
}, Zl = { ...Ye, extension: { ...Ye.extension, name: "ellipse" } }, Kl = { ...Ye, extension: { ...Ye.extension, name: "roundedRectangle" } }, ko = 1e-4, qr = 1e-4;
function Jl(i) {
  const t = i.length;
  if (t < 6)
    return 1;
  let e = 0;
  for (let s = 0, r = i[t - 2], n = i[t - 1]; s < t; s += 2) {
    const o = i[s], a = i[s + 1];
    e += (o - r) * (a + n), r = o, n = a;
  }
  return e < 0 ? -1 : 1;
}
function Zr(i, t, e, s, r, n, o, a) {
  const h = i - e * r, c = t - s * r, l = i + e * n, u = t + s * n;
  let f, d;
  o ? (f = s, d = -e) : (f = -s, d = e);
  const g = h + f, y = c + d, m = l + f, _ = u + d;
  return a.push(g, y), a.push(m, _), 2;
}
function ie(i, t, e, s, r, n, o, a) {
  const h = e - i, c = s - t;
  let l = Math.atan2(h, c), u = Math.atan2(r - i, n - t);
  a && l < u ? l += Math.PI * 2 : !a && l > u && (u += Math.PI * 2);
  let f = l;
  const d = u - l, g = Math.abs(d), y = Math.sqrt(h * h + c * c), m = (15 * g * Math.sqrt(y) / Math.PI >> 0) + 1, _ = d / m;
  if (f += _, a) {
    o.push(i, t), o.push(e, s);
    for (let M = 1, S = f; M < m; M++, S += _)
      o.push(i, t), o.push(
        i + Math.sin(S) * y,
        t + Math.cos(S) * y
      );
    o.push(i, t), o.push(r, n);
  } else {
    o.push(e, s), o.push(i, t);
    for (let M = 1, S = f; M < m; M++, S += _)
      o.push(
        i + Math.sin(S) * y,
        t + Math.cos(S) * y
      ), o.push(i, t);
    o.push(r, n), o.push(i, t);
  }
  return m * 2;
}
function Ql(i, t, e, s, r, n) {
  const o = ko;
  if (i.length === 0)
    return;
  const a = t;
  let h = a.alignment;
  if (t.alignment !== 0.5) {
    let A = Jl(i);
    h = (h - 0.5) * A + 0.5;
  }
  const c = new Pt(i[0], i[1]), l = new Pt(i[i.length - 2], i[i.length - 1]), u = s, f = Math.abs(c.x - l.x) < o && Math.abs(c.y - l.y) < o;
  if (u) {
    i = i.slice(), f && (i.pop(), i.pop(), l.set(i[i.length - 2], i[i.length - 1]));
    const A = (c.x + l.x) * 0.5, T = (l.y + c.y) * 0.5;
    i.unshift(A, T), i.push(A, T);
  }
  const d = r, g = i.length / 2;
  let y = i.length;
  const m = d.length / 2, _ = a.width / 2, M = _ * _, S = a.miterLimit * a.miterLimit;
  let C = i[0], L = i[1], P = i[2], I = i[3], v = 0, O = 0, N = -(L - I), z = C - P, it = 0, rt = 0, ft = Math.sqrt(N * N + z * z);
  N /= ft, z /= ft, N *= _, z *= _;
  const zt = h, p = (1 - zt) * 2, x = zt * 2;
  u || (a.cap === "round" ? y += ie(
    C - N * (p - x) * 0.5,
    L - z * (p - x) * 0.5,
    C - N * p,
    L - z * p,
    C + N * x,
    L + z * x,
    d,
    !0
  ) + 2 : a.cap === "square" && (y += Zr(C, L, N, z, p, x, !0, d))), d.push(
    C - N * p,
    L - z * p
  ), d.push(
    C + N * x,
    L + z * x
  );
  for (let A = 1; A < g - 1; ++A) {
    C = i[(A - 1) * 2], L = i[(A - 1) * 2 + 1], P = i[A * 2], I = i[A * 2 + 1], v = i[(A + 1) * 2], O = i[(A + 1) * 2 + 1], N = -(L - I), z = C - P, ft = Math.sqrt(N * N + z * z), N /= ft, z /= ft, N *= _, z *= _, it = -(I - O), rt = P - v, ft = Math.sqrt(it * it + rt * rt), it /= ft, rt /= ft, it *= _, rt *= _;
    const T = P - C, k = L - I, E = P - v, F = O - I, V = T * E + k * F, H = k * E - F * T, b = H < 0;
    if (Math.abs(H) < 1e-3 * Math.abs(V)) {
      d.push(
        P - N * p,
        I - z * p
      ), d.push(
        P + N * x,
        I + z * x
      ), V >= 0 && (a.join === "round" ? y += ie(
        P,
        I,
        P - N * p,
        I - z * p,
        P - it * p,
        I - rt * p,
        d,
        !1
      ) + 4 : y += 2, d.push(
        P - it * x,
        I - rt * x
      ), d.push(
        P + it * p,
        I + rt * p
      ));
      continue;
    }
    const Q = (-N + C) * (-z + I) - (-N + P) * (-z + L), G = (-it + v) * (-rt + I) - (-it + P) * (-rt + O), at = (T * G - E * Q) / H, K = (F * Q - k * G) / H, W = (at - P) * (at - P) + (K - I) * (K - I), At = P + (at - P) * p, Z = I + (K - I) * p, B = P - (at - P) * x, D = I - (K - I) * x, X = Math.min(T * T + k * k, E * E + F * F), R = b ? p : x, ks = X + R * R * M;
    W <= ks ? a.join === "bevel" || W / M > S ? (b ? (d.push(At, Z), d.push(P + N * x, I + z * x), d.push(At, Z), d.push(P + it * x, I + rt * x)) : (d.push(P - N * p, I - z * p), d.push(B, D), d.push(P - it * p, I - rt * p), d.push(B, D)), y += 2) : a.join === "round" ? b ? (d.push(At, Z), d.push(P + N * x, I + z * x), y += ie(
      P,
      I,
      P + N * x,
      I + z * x,
      P + it * x,
      I + rt * x,
      d,
      !0
    ) + 4, d.push(At, Z), d.push(P + it * x, I + rt * x)) : (d.push(P - N * p, I - z * p), d.push(B, D), y += ie(
      P,
      I,
      P - N * p,
      I - z * p,
      P - it * p,
      I - rt * p,
      d,
      !1
    ) + 4, d.push(P - it * p, I - rt * p), d.push(B, D)) : (d.push(At, Z), d.push(B, D)) : (d.push(P - N * p, I - z * p), d.push(P + N * x, I + z * x), a.join === "round" ? b ? y += ie(
      P,
      I,
      P + N * x,
      I + z * x,
      P + it * x,
      I + rt * x,
      d,
      !0
    ) + 2 : y += ie(
      P,
      I,
      P - N * p,
      I - z * p,
      P - it * p,
      I - rt * p,
      d,
      !1
    ) + 2 : a.join === "miter" && W / M <= S && (b ? (d.push(B, D), d.push(B, D)) : (d.push(At, Z), d.push(At, Z)), y += 2), d.push(P - it * p, I - rt * p), d.push(P + it * x, I + rt * x), y += 2);
  }
  C = i[(g - 2) * 2], L = i[(g - 2) * 2 + 1], P = i[(g - 1) * 2], I = i[(g - 1) * 2 + 1], N = -(L - I), z = C - P, ft = Math.sqrt(N * N + z * z), N /= ft, z /= ft, N *= _, z *= _, d.push(P - N * p, I - z * p), d.push(P + N * x, I + z * x), u || (a.cap === "round" ? y += ie(
    P - N * (p - x) * 0.5,
    I - z * (p - x) * 0.5,
    P - N * p,
    I - z * p,
    P + N * x,
    I + z * x,
    d,
    !1
  ) + 2 : a.cap === "square" && (y += Zr(P, I, N, z, p, x, !1, d)));
  const w = qr * qr;
  for (let A = m; A < y + m - 2; ++A)
    C = d[A * 2], L = d[A * 2 + 1], P = d[(A + 1) * 2], I = d[(A + 1) * 2 + 1], v = d[(A + 2) * 2], O = d[(A + 2) * 2 + 1], !(Math.abs(C * (I - O) + P * (O - L) + v * (L - I)) < w) && n.push(A, A + 1, A + 2);
}
function tc(i, t, e, s) {
  const r = ko;
  if (i.length === 0)
    return;
  const n = i[0], o = i[1], a = i[i.length - 2], h = i[i.length - 1], c = t || Math.abs(n - a) < r && Math.abs(o - h) < r, l = e, u = i.length / 2, f = l.length / 2;
  for (let d = 0; d < u; d++)
    l.push(i[d * 2]), l.push(i[d * 2 + 1]);
  for (let d = 0; d < u - 1; d++)
    s.push(f + d, f + d + 1);
  c && s.push(f + u - 1, f);
}
function Eo(i, t, e, s, r, n, o) {
  const a = Hh(i, t, 2);
  if (!a)
    return;
  for (let c = 0; c < a.length; c += 3)
    n[o++] = a[c] + r, n[o++] = a[c + 1] + r, n[o++] = a[c + 2] + r;
  let h = r * s;
  for (let c = 0; c < i.length; c += 2)
    e[h] = i[c], e[h + 1] = i[c + 1], h += s;
}
const ec = [], sc = {
  extension: {
    type: U.ShapeBuilder,
    name: "polygon"
  },
  build(i, t) {
    for (let e = 0; e < i.points.length; e++)
      t[e] = i.points[e];
    return t;
  },
  triangulate(i, t, e, s, r, n) {
    Eo(i, ec, t, e, s, r, n);
  }
}, ic = {
  extension: {
    type: U.ShapeBuilder,
    name: "rectangle"
  },
  build(i, t) {
    const e = i, s = e.x, r = e.y, n = e.width, o = e.height;
    return n >= 0 && o >= 0 && (t[0] = s, t[1] = r, t[2] = s + n, t[3] = r, t[4] = s + n, t[5] = r + o, t[6] = s, t[7] = r + o), t;
  },
  triangulate(i, t, e, s, r, n) {
    let o = 0;
    s *= e, t[s + o] = i[0], t[s + o + 1] = i[1], o += e, t[s + o] = i[2], t[s + o + 1] = i[3], o += e, t[s + o] = i[6], t[s + o + 1] = i[7], o += e, t[s + o] = i[4], t[s + o + 1] = i[5], o += e;
    const a = s / e;
    r[n++] = a, r[n++] = a + 1, r[n++] = a + 2, r[n++] = a + 1, r[n++] = a + 3, r[n++] = a + 2;
  }
}, rc = {
  extension: {
    type: U.ShapeBuilder,
    name: "triangle"
  },
  build(i, t) {
    return t[0] = i.x, t[1] = i.y, t[2] = i.x2, t[3] = i.y2, t[4] = i.x3, t[5] = i.y3, t;
  },
  triangulate(i, t, e, s, r, n) {
    let o = 0;
    s *= e, t[s + o] = i[0], t[s + o + 1] = i[1], o += e, t[s + o] = i[2], t[s + o + 1] = i[3], o += e, t[s + o] = i[4], t[s + o + 1] = i[5];
    const a = s / e;
    r[n++] = a, r[n++] = a + 1, r[n++] = a + 2;
  }
}, Ts = {};
bt.handleByMap(U.ShapeBuilder, Ts);
bt.add(ic, sc, rc, Ye, Zl, Kl);
const nc = new wt();
function oc(i, t) {
  const { geometryData: e, batches: s } = t;
  s.length = 0, e.indices.length = 0, e.vertices.length = 0, e.uvs.length = 0;
  for (let r = 0; r < i.instructions.length; r++) {
    const n = i.instructions[r];
    if (n.action === "texture")
      ac(n.data, s, e);
    else if (n.action === "fill" || n.action === "stroke") {
      const o = n.action === "stroke", a = n.data.path.shapePath, h = n.data.style, c = n.data.hole;
      o && c && Kr(c.shapePath, h, null, !0, s, e), Kr(a, h, c, o, s, e);
    }
  }
}
function ac(i, t, e) {
  const { vertices: s, uvs: r, indices: n } = e, o = n.length, a = s.length / 2, h = [], c = Ts.rectangle, l = nc, u = i.image;
  l.x = i.dx, l.y = i.dy, l.width = i.dw, l.height = i.dh;
  const f = i.transform;
  c.build(l, h), f && Po(h, f), c.triangulate(h, s, 2, a, n, o);
  const d = u.uvs;
  r.push(
    d.x0,
    d.y0,
    d.x1,
    d.y1,
    d.x3,
    d.y3,
    d.x2,
    d.y2
  );
  const g = Qt.get(Io);
  g.indexOffset = o, g.indexSize = n.length - o, g.attributeOffset = a, g.attributeSize = s.length / 2 - a, g.baseColor = i.style, g.alpha = i.alpha, g.texture = u, g.geometryData = e, t.push(g);
}
function Kr(i, t, e, s, r, n) {
  const { vertices: o, uvs: a, indices: h } = n, c = i.shapePrimitives.length - 1;
  i.shapePrimitives.forEach(({ shape: l, transform: u }, f) => {
    const d = h.length, g = o.length / 2, y = [], m = Ts[l.type];
    let _ = "triangle-list";
    if (m.build(l, y), u && Po(y, u), s) {
      const L = l.closePath ?? !0, P = t;
      P.pixelLine ? (tc(y, L, o, h), _ = "line-list") : Ql(y, P, !1, L, o, h);
    } else if (e && c === f) {
      c !== 0 && console.warn("[Pixi Graphics] only the last shape have be cut out");
      const L = [], P = y.slice();
      hc(e.shapePath).forEach((v) => {
        L.push(P.length / 2), P.push(...v);
      }), Eo(P, L, o, 2, g, h, d);
    } else
      m.triangulate(y, o, 2, g, h, d);
    const M = a.length / 2, S = t.texture;
    if (S !== tt.WHITE) {
      const L = t.matrix;
      L && (u && L.append(u.clone().invert()), Vl(o, 2, g, a, M, 2, o.length / 2 - g, L));
    } else
      Xl(a, M, 2, o.length / 2 - g);
    const C = Qt.get(Io);
    C.indexOffset = d, C.indexSize = h.length - d, C.attributeOffset = g, C.attributeSize = o.length / 2 - g, C.baseColor = t.color, C.alpha = t.alpha, C.texture = S, C.geometryData = n, C.topology = _, r.push(C);
  });
}
function hc(i) {
  if (!i)
    return [];
  const t = i.shapePrimitives, e = [];
  for (let s = 0; s < t.length; s++) {
    const r = t[s].shape, n = [];
    Ts[r.type].build(r, n), e.push(n);
  }
  return e;
}
class lc {
  constructor() {
    this.batches = [], this.geometryData = {
      vertices: [],
      uvs: [],
      indices: []
    };
  }
}
class cc {
  constructor() {
    this.batcher = new Yl(), this.instructions = new jn();
  }
  init() {
    this.instructions.reset();
  }
  /**
   * @deprecated since version 8.0.0
   * Use `batcher.geometry` instead.
   * @see {Batcher#geometry}
   */
  get geometry() {
    return ot(Ia, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry;
  }
}
const Xi = class ki {
  constructor(t) {
    this._gpuContextHash = {}, this._graphicsDataContextHash = /* @__PURE__ */ Object.create(null), t.renderableGC.addManagedHash(this, "_gpuContextHash"), t.renderableGC.addManagedHash(this, "_graphicsDataContextHash");
  }
  /**
   * Runner init called, update the default options
   * @ignore
   */
  init(t) {
    ki.defaultOptions.bezierSmoothness = t?.bezierSmoothness ?? ki.defaultOptions.bezierSmoothness;
  }
  getContextRenderData(t) {
    return this._graphicsDataContextHash[t.uid] || this._initContextRenderData(t);
  }
  // Context management functions
  updateGpuContext(t) {
    let e = this._gpuContextHash[t.uid] || this._initContext(t);
    if (t.dirty) {
      e ? this._cleanGraphicsContextData(t) : e = this._initContext(t), oc(t, e);
      const s = t.batchMode;
      t.customShader || s === "no-batch" ? e.isBatchable = !1 : s === "auto" && (e.isBatchable = e.geometryData.vertices.length < 400), t.dirty = !1;
    }
    return e;
  }
  getGpuContext(t) {
    return this._gpuContextHash[t.uid] || this._initContext(t);
  }
  _initContextRenderData(t) {
    const e = Qt.get(cc), { batches: s, geometryData: r } = this._gpuContextHash[t.uid], n = r.vertices.length, o = r.indices.length;
    for (let l = 0; l < s.length; l++)
      s[l].applyTransform = !1;
    const a = e.batcher;
    a.ensureAttributeBuffer(n), a.ensureIndexBuffer(o), a.begin();
    for (let l = 0; l < s.length; l++) {
      const u = s[l];
      a.add(u);
    }
    a.finish(e.instructions);
    const h = a.geometry;
    h.indexBuffer.setDataWithSize(a.indexBuffer, a.indexSize, !0), h.buffers[0].setDataWithSize(a.attributeBuffer.float32View, a.attributeSize, !0);
    const c = a.batches;
    for (let l = 0; l < c.length; l++) {
      const u = c[l];
      u.bindGroup = ol(u.textures.textures, u.textures.count);
    }
    return this._graphicsDataContextHash[t.uid] = e, e;
  }
  _initContext(t) {
    const e = new lc();
    return e.context = t, this._gpuContextHash[t.uid] = e, t.on("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid];
  }
  onGraphicsContextDestroy(t) {
    this._cleanGraphicsContextData(t), t.off("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid] = null;
  }
  _cleanGraphicsContextData(t) {
    const e = this._gpuContextHash[t.uid];
    e.isBatchable || this._graphicsDataContextHash[t.uid] && (Qt.return(this.getContextRenderData(t)), this._graphicsDataContextHash[t.uid] = null), e.batches && e.batches.forEach((s) => {
      Qt.return(s);
    });
  }
  destroy() {
    for (const t in this._gpuContextHash)
      this._gpuContextHash[t] && this.onGraphicsContextDestroy(this._gpuContextHash[t].context);
  }
};
Xi.extension = {
  type: [
    U.WebGLSystem,
    U.WebGPUSystem,
    U.CanvasSystem
  ],
  name: "graphicsContext"
};
Xi.defaultOptions = {
  /**
   * A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
   * @default 0.5
   */
  bezierSmoothness: 0.5
};
let Lo = Xi;
const uc = 8, ns = 11920929e-14, dc = 1;
function Bo(i, t, e, s, r, n, o, a, h, c) {
  const u = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, c ?? Lo.defaultOptions.bezierSmoothness)
  );
  let f = (dc - u) / 1;
  return f *= f, fc(t, e, s, r, n, o, a, h, i, f), i;
}
function fc(i, t, e, s, r, n, o, a, h, c) {
  Ei(i, t, e, s, r, n, o, a, h, c, 0), h.push(o, a);
}
function Ei(i, t, e, s, r, n, o, a, h, c, l) {
  if (l > uc)
    return;
  const u = (i + e) / 2, f = (t + s) / 2, d = (e + r) / 2, g = (s + n) / 2, y = (r + o) / 2, m = (n + a) / 2, _ = (u + d) / 2, M = (f + g) / 2, S = (d + y) / 2, C = (g + m) / 2, L = (_ + S) / 2, P = (M + C) / 2;
  if (l > 0) {
    let I = o - i, v = a - t;
    const O = Math.abs((e - o) * v - (s - a) * I), N = Math.abs((r - o) * v - (n - a) * I);
    if (O > ns && N > ns) {
      if ((O + N) * (O + N) <= c * (I * I + v * v)) {
        h.push(L, P);
        return;
      }
    } else if (O > ns) {
      if (O * O <= c * (I * I + v * v)) {
        h.push(L, P);
        return;
      }
    } else if (N > ns) {
      if (N * N <= c * (I * I + v * v)) {
        h.push(L, P);
        return;
      }
    } else if (I = L - (i + o) / 2, v = P - (t + a) / 2, I * I + v * v <= c) {
      h.push(L, P);
      return;
    }
  }
  Ei(i, t, u, f, _, M, L, P, h, c, l + 1), Ei(L, P, S, C, y, m, o, a, h, c, l + 1);
}
const pc = 8, mc = 11920929e-14, gc = 1;
function yc(i, t, e, s, r, n, o, a) {
  const c = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, a ?? Lo.defaultOptions.bezierSmoothness)
  );
  let l = (gc - c) / 1;
  return l *= l, xc(t, e, s, r, n, o, i, l), i;
}
function xc(i, t, e, s, r, n, o, a) {
  Li(o, i, t, e, s, r, n, a, 0), o.push(r, n);
}
function Li(i, t, e, s, r, n, o, a, h) {
  if (h > pc)
    return;
  const c = (t + s) / 2, l = (e + r) / 2, u = (s + n) / 2, f = (r + o) / 2, d = (c + u) / 2, g = (l + f) / 2;
  let y = n - t, m = o - e;
  const _ = Math.abs((s - n) * m - (r - o) * y);
  if (_ > mc) {
    if (_ * _ <= a * (y * y + m * m)) {
      i.push(d, g);
      return;
    }
  } else if (y = d - (t + n) / 2, m = g - (e + o) / 2, y * y + m * m <= a) {
    i.push(d, g);
    return;
  }
  Li(i, t, e, c, l, d, g, a, h + 1), Li(i, d, g, u, f, n, o, a, h + 1);
}
function No(i, t, e, s, r, n, o, a) {
  let h = Math.abs(r - n);
  (!o && r > n || o && n > r) && (h = 2 * Math.PI - h), a || (a = Math.max(6, Math.floor(6 * Math.pow(s, 1 / 3) * (h / Math.PI)))), a = Math.max(a, 3);
  let c = h / a, l = r;
  c *= o ? -1 : 1;
  for (let u = 0; u < a + 1; u++) {
    const f = Math.cos(l), d = Math.sin(l), g = t + f * s, y = e + d * s;
    i.push(g, y), l += c;
  }
}
function _c(i, t, e, s, r, n) {
  const o = i[i.length - 2], h = i[i.length - 1] - e, c = o - t, l = r - e, u = s - t, f = Math.abs(h * u - c * l);
  if (f < 1e-8 || n === 0) {
    (i[i.length - 2] !== t || i[i.length - 1] !== e) && i.push(t, e);
    return;
  }
  const d = h * h + c * c, g = l * l + u * u, y = h * l + c * u, m = n * Math.sqrt(d) / f, _ = n * Math.sqrt(g) / f, M = m * y / d, S = _ * y / g, C = m * u + _ * c, L = m * l + _ * h, P = c * (_ + M), I = h * (_ + M), v = u * (m + S), O = l * (m + S), N = Math.atan2(I - L, P - C), z = Math.atan2(O - L, v - C);
  No(
    i,
    C + t,
    L + e,
    n,
    N,
    z,
    c * l > u * h
  );
}
const je = Math.PI * 2, oi = {
  centerX: 0,
  centerY: 0,
  ang1: 0,
  ang2: 0
}, ai = ({ x: i, y: t }, e, s, r, n, o, a, h) => {
  i *= e, t *= s;
  const c = r * i - n * t, l = n * i + r * t;
  return h.x = c + o, h.y = l + a, h;
};
function bc(i, t) {
  const e = t === -1.5707963267948966 ? -0.551915024494 : 1.3333333333333333 * Math.tan(t / 4), s = t === 1.5707963267948966 ? 0.551915024494 : e, r = Math.cos(i), n = Math.sin(i), o = Math.cos(i + t), a = Math.sin(i + t);
  return [
    {
      x: r - n * s,
      y: n + r * s
    },
    {
      x: o + a * s,
      y: a - o * s
    },
    {
      x: o,
      y: a
    }
  ];
}
const Jr = (i, t, e, s) => {
  const r = i * s - t * e < 0 ? -1 : 1;
  let n = i * e + t * s;
  return n > 1 && (n = 1), n < -1 && (n = -1), r * Math.acos(n);
}, wc = (i, t, e, s, r, n, o, a, h, c, l, u, f) => {
  const d = Math.pow(r, 2), g = Math.pow(n, 2), y = Math.pow(l, 2), m = Math.pow(u, 2);
  let _ = d * g - d * m - g * y;
  _ < 0 && (_ = 0), _ /= d * m + g * y, _ = Math.sqrt(_) * (o === a ? -1 : 1);
  const M = _ * r / n * u, S = _ * -n / r * l, C = c * M - h * S + (i + e) / 2, L = h * M + c * S + (t + s) / 2, P = (l - M) / r, I = (u - S) / n, v = (-l - M) / r, O = (-u - S) / n, N = Jr(1, 0, P, I);
  let z = Jr(P, I, v, O);
  a === 0 && z > 0 && (z -= je), a === 1 && z < 0 && (z += je), f.centerX = C, f.centerY = L, f.ang1 = N, f.ang2 = z;
};
function vc(i, t, e, s, r, n, o, a = 0, h = 0, c = 0) {
  if (n === 0 || o === 0)
    return;
  const l = Math.sin(a * je / 360), u = Math.cos(a * je / 360), f = u * (t - s) / 2 + l * (e - r) / 2, d = -l * (t - s) / 2 + u * (e - r) / 2;
  if (f === 0 && d === 0)
    return;
  n = Math.abs(n), o = Math.abs(o);
  const g = Math.pow(f, 2) / Math.pow(n, 2) + Math.pow(d, 2) / Math.pow(o, 2);
  g > 1 && (n *= Math.sqrt(g), o *= Math.sqrt(g)), wc(
    t,
    e,
    s,
    r,
    n,
    o,
    h,
    c,
    l,
    u,
    f,
    d,
    oi
  );
  let { ang1: y, ang2: m } = oi;
  const { centerX: _, centerY: M } = oi;
  let S = Math.abs(m) / (je / 4);
  Math.abs(1 - S) < 1e-7 && (S = 1);
  const C = Math.max(Math.ceil(S), 1);
  m /= C;
  let L = i[i.length - 2], P = i[i.length - 1];
  const I = { x: 0, y: 0 };
  for (let v = 0; v < C; v++) {
    const O = bc(y, m), { x: N, y: z } = ai(O[0], n, o, u, l, _, M, I), { x: it, y: rt } = ai(O[1], n, o, u, l, _, M, I), { x: ft, y: zt } = ai(O[2], n, o, u, l, _, M, I);
    Bo(
      i,
      L,
      P,
      N,
      z,
      it,
      rt,
      ft,
      zt
    ), L = ft, P = zt, y += m;
  }
}
function Mc(i, t, e) {
  const s = (o, a) => {
    const h = a.x - o.x, c = a.y - o.y, l = Math.sqrt(h * h + c * c), u = h / l, f = c / l;
    return { len: l, nx: u, ny: f };
  }, r = (o, a) => {
    o === 0 ? i.moveTo(a.x, a.y) : i.lineTo(a.x, a.y);
  };
  let n = t[t.length - 1];
  for (let o = 0; o < t.length; o++) {
    const a = t[o % t.length], h = a.radius ?? e;
    if (h <= 0) {
      r(o, a), n = a;
      continue;
    }
    const c = t[(o + 1) % t.length], l = s(a, n), u = s(a, c);
    if (l.len < 1e-4 || u.len < 1e-4) {
      r(o, a), n = a;
      continue;
    }
    let f = Math.asin(l.nx * u.ny - l.ny * u.nx), d = 1, g = !1;
    l.nx * u.nx - l.ny * -u.ny < 0 ? f < 0 ? f = Math.PI + f : (f = Math.PI - f, d = -1, g = !0) : f > 0 && (d = -1, g = !0);
    const y = f / 2;
    let m, _ = Math.abs(
      Math.cos(y) * h / Math.sin(y)
    );
    _ > Math.min(l.len / 2, u.len / 2) ? (_ = Math.min(l.len / 2, u.len / 2), m = Math.abs(_ * Math.sin(y) / Math.cos(y))) : m = h;
    const M = a.x + u.nx * _ + -u.ny * m * d, S = a.y + u.ny * _ + u.nx * m * d, C = Math.atan2(l.ny, l.nx) + Math.PI / 2 * d, L = Math.atan2(u.ny, u.nx) - Math.PI / 2 * d;
    o === 0 && i.moveTo(
      M + Math.cos(C) * m,
      S + Math.sin(C) * m
    ), i.arc(M, S, m, C, L, g), n = a;
  }
}
function Sc(i, t, e, s) {
  const r = (a, h) => Math.sqrt((a.x - h.x) ** 2 + (a.y - h.y) ** 2), n = (a, h, c) => ({
    x: a.x + (h.x - a.x) * c,
    y: a.y + (h.y - a.y) * c
  }), o = t.length;
  for (let a = 0; a < o; a++) {
    const h = t[(a + 1) % o], c = h.radius ?? e;
    if (c <= 0) {
      a === 0 ? i.moveTo(h.x, h.y) : i.lineTo(h.x, h.y);
      continue;
    }
    const l = t[a], u = t[(a + 2) % o], f = r(l, h);
    let d;
    if (f < 1e-4)
      d = h;
    else {
      const m = Math.min(f / 2, c);
      d = n(
        h,
        l,
        m / f
      );
    }
    const g = r(u, h);
    let y;
    if (g < 1e-4)
      y = h;
    else {
      const m = Math.min(g / 2, c);
      y = n(
        h,
        u,
        m / g
      );
    }
    a === 0 ? i.moveTo(d.x, d.y) : i.lineTo(d.x, d.y), i.quadraticCurveTo(h.x, h.y, y.x, y.y, s);
  }
}
const Ac = new wt();
class Cc {
  constructor(t) {
    this.shapePrimitives = [], this._currentPoly = null, this._bounds = new Xt(), this._graphicsPath2D = t;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    return this.startPoly(t, e), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._ensurePoly();
    const s = this._currentPoly.points, r = s[s.length - 2], n = s[s.length - 1];
    return (r !== t || n !== e) && s.push(t, e), this;
  }
  /**
   * Adds an arc to the path. The arc is centered at (x, y)
   *  position with radius `radius` starting at `startAngle` and ending at `endAngle`.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The radius of the arc.
   * @param startAngle - The starting angle of the arc, in radians.
   * @param endAngle - The ending angle of the arc, in radians.
   * @param counterclockwise - Specifies whether the arc should be drawn in the anticlockwise direction. False by default.
   * @returns The instance of the current object for chaining.
   */
  arc(t, e, s, r, n, o) {
    this._ensurePoly(!1);
    const a = this._currentPoly.points;
    return No(a, t, e, s, r, n, o), this;
  }
  /**
   * Adds an arc to the path with the arc tangent to the line joining two specified points.
   * The arc radius is specified by `radius`.
   * @param x1 - The x-coordinate of the first point.
   * @param y1 - The y-coordinate of the first point.
   * @param x2 - The x-coordinate of the second point.
   * @param y2 - The y-coordinate of the second point.
   * @param radius - The radius of the arc.
   * @returns The instance of the current object for chaining.
   */
  arcTo(t, e, s, r, n) {
    this._ensurePoly();
    const o = this._currentPoly.points;
    return _c(o, t, e, s, r, n), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, s, r, n, o, a) {
    const h = this._currentPoly.points;
    return vc(
      h,
      this._currentPoly.lastX,
      this._currentPoly.lastY,
      o,
      a,
      t,
      e,
      s,
      r,
      n
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, s, r, n, o, a) {
    this._ensurePoly();
    const h = this._currentPoly;
    return Bo(
      this._currentPoly.points,
      h.lastX,
      h.lastY,
      t,
      e,
      s,
      r,
      n,
      o,
      a
    ), this;
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the control point.
   * @param cp1y - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothing - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, s, r, n) {
    this._ensurePoly();
    const o = this._currentPoly;
    return yc(
      this._currentPoly.points,
      o.lastX,
      o.lastY,
      t,
      e,
      s,
      r,
      n
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.endPoly(!0), this;
  }
  /**
   * Adds another path to the current path. This method allows for the combination of multiple paths into one.
   * @param path - The `GraphicsPath` object representing the path to add.
   * @param transform - An optional `Matrix` object to apply a transformation to the path before adding it.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    this.endPoly(), e && !e.isIdentity() && (t = t.clone(!0), t.transform(e));
    for (let s = 0; s < t.instructions.length; s++) {
      const r = t.instructions[s];
      this[r.action](...r.data);
    }
    return this;
  }
  /**
   * Finalizes the drawing of the current path. Optionally, it can close the path.
   * @param closePath - A boolean indicating whether to close the path after finishing. False by default.
   */
  finish(t = !1) {
    this.endPoly(t);
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, s, r, n) {
    return this.drawShape(new wt(t, e, s, r), n), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, s, r) {
    return this.drawShape(new Hi(t, e, s), r), this;
  }
  /**
   * Draws a polygon shape. This method allows for the creation of complex polygons by specifying a sequence of points.
   * @param points - An array of numbers, or or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  poly(t, e, s) {
    const r = new De(t);
    return r.closePath = e, this.drawShape(r, s), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, s, r, n = 0, o) {
    r = Math.max(r | 0, 3);
    const a = -1 * Math.PI / 2 + n, h = Math.PI * 2 / r, c = [];
    for (let l = 0; l < r; l++) {
      const u = a - l * h;
      c.push(
        t + s * Math.cos(u),
        e + s * Math.sin(u)
      );
    }
    return this.poly(c, !0, o), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param smoothness - Optional parameter to adjust the smoothness of the rounding.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, s, r, n, o = 0, a) {
    if (r = Math.max(r | 0, 3), n <= 0)
      return this.regularPoly(t, e, s, r, o);
    const h = s * Math.sin(Math.PI / r) - 1e-3;
    n = Math.min(n, h);
    const c = -1 * Math.PI / 2 + o, l = Math.PI * 2 / r, u = (r - 2) * Math.PI / r / 2;
    for (let f = 0; f < r; f++) {
      const d = f * l + c, g = t + s * Math.cos(d), y = e + s * Math.sin(d), m = d + Math.PI + u, _ = d - Math.PI - u, M = g + n * Math.cos(m), S = y + n * Math.sin(m), C = g + n * Math.cos(_), L = y + n * Math.sin(_);
      f === 0 ? this.moveTo(M, S) : this.lineTo(M, S), this.quadraticCurveTo(g, y, C, L, a);
    }
    return this.closePath();
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, s = !1, r) {
    return t.length < 3 ? this : (s ? Sc(this, t, e, r) : Mc(this, t, e), this.closePath());
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, s, r, n) {
    if (n === 0)
      return this.rect(t, e, s, r);
    const o = Math.min(s, r) / 2, a = Math.min(o, Math.max(-o, n)), h = t + s, c = e + r, l = a < 0 ? -a : 0, u = Math.abs(a);
    return this.moveTo(t, e + u).arcTo(t + l, e + l, t + u, e, u).lineTo(h - u, e).arcTo(h - l, e + l, h, e + u, u).lineTo(h, c - u).arcTo(h - l, c - l, t + s - u, c, u).lineTo(t + u, c).arcTo(t + l, c - l, t, c - u, u).closePath();
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, s, r, n, o) {
    if (n <= 0)
      return this.rect(t, e, s, r);
    const a = Math.min(n, Math.min(s, r) / 2), h = t + s, c = e + r, l = [
      t + a,
      e,
      h - a,
      e,
      h,
      e + a,
      h,
      c - a,
      h - a,
      c,
      t + a,
      c,
      t,
      c - a,
      t,
      e + a
    ];
    for (let u = l.length - 1; u >= 2; u -= 2)
      l[u] === l[u - 2] && l[u - 1] === l[u - 3] && l.splice(u - 1, 2);
    return this.poly(l, !0, o);
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @param transform - An optional `Matrix` object to apply a transformation to the ellipse. This can include rotations.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, s, r, n) {
    return this.drawShape(new Yi(t, e, s, r), n), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, s, r, n, o) {
    return this.drawShape(new Vi(t, e, s, r, n), o), this;
  }
  /**
   * Draws a given shape on the canvas.
   * This is a generic method that can draw any type of shape specified by the `ShapePrimitive` parameter.
   * An optional transformation matrix can be applied to the shape, allowing for complex transformations.
   * @param shape - The shape to draw, defined as a `ShapePrimitive` object.
   * @param matrix - An optional `Matrix` for transforming the shape. This can include rotations,
   * scaling, and translations.
   * @returns The instance of the current object for chaining.
   */
  drawShape(t, e) {
    return this.endPoly(), this.shapePrimitives.push({ shape: t, transform: e }), this;
  }
  /**
   * Starts a new polygon path from the specified starting point.
   * This method initializes a new polygon or ends the current one if it exists.
   * @param x - The x-coordinate of the starting point of the new polygon.
   * @param y - The y-coordinate of the starting point of the new polygon.
   * @returns The instance of the current object for chaining.
   */
  startPoly(t, e) {
    let s = this._currentPoly;
    return s && this.endPoly(), s = new De(), s.points.push(t, e), this._currentPoly = s, this;
  }
  /**
   * Ends the current polygon path. If `closePath` is set to true,
   * the path is closed by connecting the last point to the first one.
   * This method finalizes the current polygon and prepares it for drawing or adding to the shape primitives.
   * @param closePath - A boolean indicating whether to close the polygon by connecting the last point
   *  back to the starting point. False by default.
   * @returns The instance of the current object for chaining.
   */
  endPoly(t = !1) {
    const e = this._currentPoly;
    return e && e.points.length > 2 && (e.closePath = t, this.shapePrimitives.push({ shape: e })), this._currentPoly = null, this;
  }
  _ensurePoly(t = !0) {
    if (!this._currentPoly && (this._currentPoly = new De(), t)) {
      const e = this.shapePrimitives[this.shapePrimitives.length - 1];
      if (e) {
        let s = e.shape.x, r = e.shape.y;
        if (e.transform && !e.transform.isIdentity()) {
          const n = e.transform, o = s;
          s = n.a * s + n.c * r + n.tx, r = n.b * o + n.d * r + n.ty;
        }
        this._currentPoly.points.push(s, r);
      } else
        this._currentPoly.points.push(0, 0);
    }
  }
  /** Builds the path. */
  buildPath() {
    const t = this._graphicsPath2D;
    this.shapePrimitives.length = 0, this._currentPoly = null;
    for (let e = 0; e < t.instructions.length; e++) {
      const s = t.instructions[e];
      this[s.action](...s.data);
    }
    this.finish();
  }
  /** Gets the bounds of the path. */
  get bounds() {
    const t = this._bounds;
    t.clear();
    const e = this.shapePrimitives;
    for (let s = 0; s < e.length; s++) {
      const r = e[s], n = r.shape.getBounds(Ac);
      r.transform ? t.addRect(n, r.transform) : t.addRect(n);
    }
    return t;
  }
}
class be {
  /**
   * Creates a `GraphicsPath` instance optionally from an SVG path string or an array of `PathInstruction`.
   * @param instructions - An SVG path string or an array of `PathInstruction` objects.
   */
  constructor(t) {
    this.instructions = [], this.uid = vt("graphicsPath"), this._dirty = !0, typeof t == "string" ? el(t, this) : this.instructions = t?.slice() ?? [];
  }
  /**
   * Provides access to the internal shape path, ensuring it is up-to-date with the current instructions.
   * @returns The `ShapePath` instance associated with this `GraphicsPath`.
   */
  get shapePath() {
    return this._shapePath || (this._shapePath = new Cc(this)), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @param transform - An optional transformation to apply to the added path.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    return t = t.clone(), this.instructions.push({ action: "addPath", data: [t, e] }), this._dirty = !0, this;
  }
  arc(...t) {
    return this.instructions.push({ action: "arc", data: t }), this._dirty = !0, this;
  }
  arcTo(...t) {
    return this.instructions.push({ action: "arcTo", data: t }), this._dirty = !0, this;
  }
  arcToSvg(...t) {
    return this.instructions.push({ action: "arcToSvg", data: t }), this._dirty = !0, this;
  }
  bezierCurveTo(...t) {
    return this.instructions.push({ action: "bezierCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires two points: the second control point and the end point. The first control point is assumed to be
   * The starting point is the last point in the current path.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveToShort(t, e, s, r, n) {
    const o = this.instructions[this.instructions.length - 1], a = this.getLastPoint(Pt.shared);
    let h = 0, c = 0;
    if (!o || o.action !== "bezierCurveTo")
      h = a.x, c = a.y;
    else {
      h = o.data[2], c = o.data[3];
      const l = a.x, u = a.y;
      h = l + (l - h), c = u + (u - c);
    }
    return this.instructions.push({ action: "bezierCurveTo", data: [h, c, t, e, s, r, n] }), this._dirty = !0, this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.instructions.push({ action: "closePath", data: [] }), this._dirty = !0, this;
  }
  ellipse(...t) {
    return this.instructions.push({ action: "ellipse", data: t }), this._dirty = !0, this;
  }
  lineTo(...t) {
    return this.instructions.push({ action: "lineTo", data: t }), this._dirty = !0, this;
  }
  moveTo(...t) {
    return this.instructions.push({ action: "moveTo", data: t }), this;
  }
  quadraticCurveTo(...t) {
    return this.instructions.push({ action: "quadraticCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a quadratic curve to the path. It uses the previous point as the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveToShort(t, e, s) {
    const r = this.instructions[this.instructions.length - 1], n = this.getLastPoint(Pt.shared);
    let o = 0, a = 0;
    if (!r || r.action !== "quadraticCurveTo")
      o = n.x, a = n.y;
    else {
      o = r.data[0], a = r.data[1];
      const h = n.x, c = n.y;
      o = h + (h - o), a = c + (c - a);
    }
    return this.instructions.push({ action: "quadraticCurveTo", data: [o, a, t, e, s] }), this._dirty = !0, this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, s, r, n) {
    return this.instructions.push({ action: "rect", data: [t, e, s, r, n] }), this._dirty = !0, this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, s, r) {
    return this.instructions.push({ action: "circle", data: [t, e, s, r] }), this._dirty = !0, this;
  }
  roundRect(...t) {
    return this.instructions.push({ action: "roundRect", data: t }), this._dirty = !0, this;
  }
  poly(...t) {
    return this.instructions.push({ action: "poly", data: t }), this._dirty = !0, this;
  }
  regularPoly(...t) {
    return this.instructions.push({ action: "regularPoly", data: t }), this._dirty = !0, this;
  }
  roundPoly(...t) {
    return this.instructions.push({ action: "roundPoly", data: t }), this._dirty = !0, this;
  }
  roundShape(...t) {
    return this.instructions.push({ action: "roundShape", data: t }), this._dirty = !0, this;
  }
  filletRect(...t) {
    return this.instructions.push({ action: "filletRect", data: t }), this._dirty = !0, this;
  }
  chamferRect(...t) {
    return this.instructions.push({ action: "chamferRect", data: t }), this._dirty = !0, this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @param transform - An optional `Matrix` object to apply a transformation to the star.
   * This can include rotations, scaling, and translations.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  // eslint-disable-next-line max-len
  star(t, e, s, r, n, o, a) {
    n || (n = r / 2);
    const h = -1 * Math.PI / 2 + o, c = s * 2, l = Math.PI * 2 / c, u = [];
    for (let f = 0; f < c; f++) {
      const d = f % 2 ? n : r, g = f * l + h;
      u.push(
        t + d * Math.cos(g),
        e + d * Math.sin(g)
      );
    }
    return this.poly(u, !0, a), this;
  }
  /**
   * Creates a copy of the current `GraphicsPath` instance. This method supports both shallow and deep cloning.
   * A shallow clone copies the reference of the instructions array, while a deep clone creates a new array and
   * copies each instruction individually, ensuring that modifications to the instructions of the cloned `GraphicsPath`
   * do not affect the original `GraphicsPath` and vice versa.
   * @param deep - A boolean flag indicating whether the clone should be deep.
   * @returns A new `GraphicsPath` instance that is a clone of the current instance.
   */
  clone(t = !1) {
    const e = new be();
    if (!t)
      e.instructions = this.instructions.slice();
    else
      for (let s = 0; s < this.instructions.length; s++) {
        const r = this.instructions[s];
        e.instructions.push({ action: r.action, data: r.data.slice() });
      }
    return e;
  }
  clear() {
    return this.instructions.length = 0, this._dirty = !0, this;
  }
  /**
   * Applies a transformation matrix to all drawing instructions within the `GraphicsPath`.
   * This method enables the modification of the path's geometry according to the provided
   * transformation matrix, which can include translations, rotations, scaling, and skewing.
   *
   * Each drawing instruction in the path is updated to reflect the transformation,
   * ensuring the visual representation of the path is consistent with the applied matrix.
   *
   * Note: The transformation is applied directly to the coordinates and control points of the drawing instructions,
   * not to the path as a whole. This means the transformation's effects are baked into the individual instructions,
   * allowing for fine-grained control over the path's appearance.
   * @param matrix - A `Matrix` object representing the transformation to apply.
   * @returns The instance of the current object for chaining further operations.
   */
  transform(t) {
    if (t.isIdentity())
      return this;
    const e = t.a, s = t.b, r = t.c, n = t.d, o = t.tx, a = t.ty;
    let h = 0, c = 0, l = 0, u = 0, f = 0, d = 0, g = 0, y = 0;
    for (let m = 0; m < this.instructions.length; m++) {
      const _ = this.instructions[m], M = _.data;
      switch (_.action) {
        case "moveTo":
        case "lineTo":
          h = M[0], c = M[1], M[0] = e * h + r * c + o, M[1] = s * h + n * c + a;
          break;
        case "bezierCurveTo":
          l = M[0], u = M[1], f = M[2], d = M[3], h = M[4], c = M[5], M[0] = e * l + r * u + o, M[1] = s * l + n * u + a, M[2] = e * f + r * d + o, M[3] = s * f + n * d + a, M[4] = e * h + r * c + o, M[5] = s * h + n * c + a;
          break;
        case "quadraticCurveTo":
          l = M[0], u = M[1], h = M[2], c = M[3], M[0] = e * l + r * u + o, M[1] = s * l + n * u + a, M[2] = e * h + r * c + o, M[3] = s * h + n * c + a;
          break;
        case "arcToSvg":
          h = M[5], c = M[6], g = M[0], y = M[1], M[0] = e * g + r * y, M[1] = s * g + n * y, M[5] = e * h + r * c + o, M[6] = s * h + n * c + a;
          break;
        case "circle":
          M[4] = Ee(M[3], t);
          break;
        case "rect":
          M[4] = Ee(M[4], t);
          break;
        case "ellipse":
          M[8] = Ee(M[8], t);
          break;
        case "roundRect":
          M[5] = Ee(M[5], t);
          break;
        case "addPath":
          M[0].transform(t);
          break;
        case "poly":
          M[2] = Ee(M[2], t);
          break;
        default:
          xt("unknown transform action", _.action);
          break;
      }
    }
    return this._dirty = !0, this;
  }
  get bounds() {
    return this.shapePath.bounds;
  }
  /**
   * Retrieves the last point from the current drawing instructions in the `GraphicsPath`.
   * This method is useful for operations that depend on the path's current endpoint,
   * such as connecting subsequent shapes or paths. It supports various drawing instructions,
   * ensuring the last point's position is accurately determined regardless of the path's complexity.
   *
   * If the last instruction is a `closePath`, the method iterates backward through the instructions
   *  until it finds an actionable instruction that defines a point (e.g., `moveTo`, `lineTo`,
   * `quadraticCurveTo`, etc.). For compound paths added via `addPath`, it recursively retrieves
   * the last point from the nested path.
   * @param out - A `Point` object where the last point's coordinates will be stored.
   * This object is modified directly to contain the result.
   * @returns The `Point` object containing the last point's coordinates.
   */
  getLastPoint(t) {
    let e = this.instructions.length - 1, s = this.instructions[e];
    if (!s)
      return t.x = 0, t.y = 0, t;
    for (; s.action === "closePath"; ) {
      if (e--, e < 0)
        return t.x = 0, t.y = 0, t;
      s = this.instructions[e];
    }
    switch (s.action) {
      case "moveTo":
      case "lineTo":
        t.x = s.data[0], t.y = s.data[1];
        break;
      case "quadraticCurveTo":
        t.x = s.data[2], t.y = s.data[3];
        break;
      case "bezierCurveTo":
        t.x = s.data[4], t.y = s.data[5];
        break;
      case "arc":
      case "arcToSvg":
        t.x = s.data[5], t.y = s.data[6];
        break;
      case "addPath":
        s.data[0].getLastPoint(t);
        break;
    }
    return t;
  }
}
function Ee(i, t) {
  return i ? i.prepend(t) : t.clone();
}
function Tc(i, t) {
  if (typeof i == "string") {
    const s = document.createElement("div");
    s.innerHTML = i.trim(), i = s.querySelector("svg");
  }
  const e = {
    context: t,
    path: new be()
  };
  return Fo(i, e, null, null), t;
}
function Fo(i, t, e, s) {
  const r = i.children, { fillStyle: n, strokeStyle: o } = Pc(i);
  n && e ? e = { ...e, ...n } : n && (e = n), o && s ? s = { ...s, ...o } : o && (s = o), t.context.fillStyle = e, t.context.strokeStyle = s;
  let a, h, c, l, u, f, d, g, y, m, _, M, S, C, L, P, I;
  switch (i.nodeName.toLowerCase()) {
    case "path":
      C = i.getAttribute("d"), L = new be(C), t.context.path(L), e && t.context.fill(), s && t.context.stroke();
      break;
    case "circle":
      d = Mt(i, "cx", 0), g = Mt(i, "cy", 0), y = Mt(i, "r", 0), t.context.ellipse(d, g, y, y), e && t.context.fill(), s && t.context.stroke();
      break;
    case "rect":
      a = Mt(i, "x", 0), h = Mt(i, "y", 0), P = Mt(i, "width", 0), I = Mt(i, "height", 0), m = Mt(i, "rx", 0), _ = Mt(i, "ry", 0), m || _ ? t.context.roundRect(a, h, P, I, m || _) : t.context.rect(a, h, P, I), e && t.context.fill(), s && t.context.stroke();
      break;
    case "ellipse":
      d = Mt(i, "cx", 0), g = Mt(i, "cy", 0), m = Mt(i, "rx", 0), _ = Mt(i, "ry", 0), t.context.beginPath(), t.context.ellipse(d, g, m, _), e && t.context.fill(), s && t.context.stroke();
      break;
    case "line":
      c = Mt(i, "x1", 0), l = Mt(i, "y1", 0), u = Mt(i, "x2", 0), f = Mt(i, "y2", 0), t.context.beginPath(), t.context.moveTo(c, l), t.context.lineTo(u, f), s && t.context.stroke();
      break;
    case "polygon":
      S = i.getAttribute("points"), M = S.match(/\d+/g).map((v) => parseInt(v, 10)), t.context.poly(M, !0), e && t.context.fill(), s && t.context.stroke();
      break;
    case "polyline":
      S = i.getAttribute("points"), M = S.match(/\d+/g).map((v) => parseInt(v, 10)), t.context.poly(M, !1), s && t.context.stroke();
      break;
    case "g":
    case "svg":
      break;
    default: {
      console.info(`[SVG parser] <${i.nodeName}> elements unsupported`);
      break;
    }
  }
  for (let v = 0; v < r.length; v++)
    Fo(r[v], t, e, s);
}
function Mt(i, t, e) {
  const s = i.getAttribute(t);
  return s ? Number(s) : e;
}
function Pc(i) {
  const t = i.getAttribute("style"), e = {}, s = {};
  let r = !1, n = !1;
  if (t) {
    const o = t.split(";");
    for (let a = 0; a < o.length; a++) {
      const h = o[a], [c, l] = h.split(":");
      switch (c) {
        case "stroke":
          l !== "none" && (e.color = ut.shared.setValue(l).toNumber(), n = !0);
          break;
        case "stroke-width":
          e.width = Number(l);
          break;
        case "fill":
          l !== "none" && (r = !0, s.color = ut.shared.setValue(l).toNumber());
          break;
        case "fill-opacity":
          s.alpha = Number(l);
          break;
        case "stroke-opacity":
          e.alpha = Number(l);
          break;
        case "opacity":
          s.alpha = Number(l), e.alpha = Number(l);
          break;
      }
    }
  } else {
    const o = i.getAttribute("stroke");
    o && o !== "none" && (n = !0, e.color = ut.shared.setValue(o).toNumber(), e.width = Mt(i, "stroke-width", 1));
    const a = i.getAttribute("fill");
    a && a !== "none" && (r = !0, s.color = ut.shared.setValue(a).toNumber());
  }
  return {
    strokeStyle: n ? e : null,
    fillStyle: r ? s : null
  };
}
function Ic(i) {
  return ut.isColorLike(i);
}
function Qr(i) {
  return i instanceof Cs;
}
function tn(i) {
  return i instanceof Ue;
}
function kc(i, t, e) {
  const s = ut.shared.setValue(t ?? 0);
  return i.color = s.toNumber(), i.alpha = s.alpha === 1 ? e.alpha : s.alpha, i.texture = tt.WHITE, { ...e, ...i };
}
function en(i, t, e) {
  return i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, { ...e, ...i };
}
function sn(i, t, e) {
  return t.buildLinearGradient(), i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, { ...e, ...i };
}
function Ec(i, t) {
  const e = { ...t, ...i };
  if (e.texture) {
    if (e.texture !== tt.WHITE) {
      const n = e.matrix?.clone().invert() || new et();
      n.translate(e.texture.frame.x, e.texture.frame.y), n.scale(1 / e.texture.source.width, 1 / e.texture.source.height), e.matrix = n;
    }
    const r = e.texture.source.style;
    r.addressMode === "clamp-to-edge" && (r.addressMode = "repeat", r.update());
  }
  const s = ut.shared.setValue(e.color);
  return e.alpha *= s.alpha, e.color = s.toNumber(), e.matrix = e.matrix ? e.matrix.clone() : null, e;
}
function le(i, t) {
  if (i == null)
    return null;
  const e = {}, s = i;
  return Ic(i) ? kc(e, i, t) : Qr(i) ? en(e, i, t) : tn(i) ? sn(e, i, t) : s.fill && Qr(s.fill) ? en(s, s.fill, t) : s.fill && tn(s.fill) ? sn(s, s.fill, t) : Ec(s, t);
}
function bs(i, t) {
  const { width: e, alignment: s, miterLimit: r, cap: n, join: o, pixelLine: a, ...h } = t, c = le(i, h);
  return c ? {
    width: e,
    alignment: s,
    miterLimit: r,
    cap: n,
    join: o,
    pixelLine: a,
    ...c
  } : null;
}
const Lc = new Pt(), rn = new et(), qi = class Ht extends Rt {
  constructor() {
    super(...arguments), this.uid = vt("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this._activePath = new be(), this._transform = new et(), this._fillStyle = { ...Ht.defaultFillStyle }, this._strokeStyle = { ...Ht.defaultStrokeStyle }, this._stateStack = [], this._tick = 0, this._bounds = new Xt(), this._boundsDirty = !0;
  }
  /**
   * Creates a new GraphicsContext object that is a clone of this instance, copying all properties,
   * including the current drawing state, transformations, styles, and instructions.
   * @returns A new GraphicsContext instance with the same properties and state as this one.
   */
  clone() {
    const t = new Ht();
    return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = { ...this._fillStyle }, t._strokeStyle = { ...this._strokeStyle }, t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = !0, t;
  }
  /**
   * The current fill style of the graphics context. This can be a color, gradient, pattern, or a more complex style defined by a FillStyle object.
   */
  get fillStyle() {
    return this._fillStyle;
  }
  set fillStyle(t) {
    this._fillStyle = le(t, Ht.defaultFillStyle);
  }
  /**
   * The current stroke style of the graphics context. Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   */
  get strokeStyle() {
    return this._strokeStyle;
  }
  set strokeStyle(t) {
    this._strokeStyle = bs(t, Ht.defaultStrokeStyle);
  }
  /**
   * Sets the current fill style of the graphics context. The fill style can be a color, gradient,
   * pattern, or a more complex style defined by a FillStyle object.
   * @param style - The fill style to apply. This can be a simple color, a gradient or pattern object,
   *                or a FillStyle or ConvertedFillStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setFillStyle(t) {
    return this._fillStyle = le(t, Ht.defaultFillStyle), this;
  }
  /**
   * Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
   * encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   * @param style - The stroke style to apply. Can be defined as a color, a gradient or pattern,
   *                or a StrokeStyle or ConvertedStrokeStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setStrokeStyle(t) {
    return this._strokeStyle = le(t, Ht.defaultStrokeStyle), this;
  }
  texture(t, e, s, r, n, o) {
    return this.instructions.push({
      action: "texture",
      data: {
        image: t,
        dx: s || 0,
        dy: r || 0,
        dw: n || t.frame.width,
        dh: o || t.frame.height,
        transform: this._transform.clone(),
        alpha: this._fillStyle.alpha,
        style: e ? ut.shared.setValue(e).toNumber() : 16777215
      }
    }), this.onUpdate(), this;
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._activePath = new be(), this;
  }
  fill(t, e) {
    let s;
    const r = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && r && r.action === "stroke" ? s = r.data.path : s = this._activePath.clone(), s ? (t != null && (e !== void 0 && typeof t == "number" && (ot(yt, "GraphicsContext.fill(color, alpha) is deprecated, use GraphicsContext.fill({ color, alpha }) instead"), t = { color: t, alpha: e }), this._fillStyle = le(t, Ht.defaultFillStyle)), this.instructions.push({
      action: "fill",
      // TODO copy fill style!
      data: { style: this.fillStyle, path: s }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  _initNextPathLocation() {
    const { x: t, y: e } = this._activePath.getLastPoint(Pt.shared);
    this._activePath.clear(), this._activePath.moveTo(t, e);
  }
  /**
   * Strokes the current path with the current stroke style. This method can take an optional
   * FillInput parameter to define the stroke's appearance, including its color, width, and other properties.
   * @param style - (Optional) The stroke style to apply. Can be defined as a simple color or a more complex style object. If omitted, uses the current stroke style.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  stroke(t) {
    let e;
    const s = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && s && s.action === "fill" ? e = s.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = bs(t, Ht.defaultStrokeStyle)), this.instructions.push({
      action: "stroke",
      // TODO copy fill style!
      data: { style: this.strokeStyle, path: e }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path. If a hole is not completely in a shape, it will
   * fail to cut correctly!
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  cut() {
    for (let t = 0; t < 2; t++) {
      const e = this.instructions[this.instructions.length - 1 - t], s = this._activePath.clone();
      if (e && (e.action === "stroke" || e.action === "fill"))
        if (e.data.hole)
          e.data.hole.addPath(s);
        else {
          e.data.hole = s;
          break;
        }
    }
    return this._initNextPathLocation(), this;
  }
  /**
   * Adds an arc to the current path, which is centered at (x, y) with the specified radius,
   * starting and ending angles, and direction.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The arc's radius.
   * @param startAngle - The starting angle, in radians.
   * @param endAngle - The ending angle, in radians.
   * @param counterclockwise - (Optional) Specifies whether the arc is drawn counterclockwise (true) or clockwise (false). Defaults to false.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arc(t, e, s, r, n, o) {
    this._tick++;
    const a = this._transform;
    return this._activePath.arc(
      a.a * t + a.c * e + a.tx,
      a.b * t + a.d * e + a.ty,
      s,
      r,
      n,
      o
    ), this;
  }
  /**
   * Adds an arc to the current path with the given control points and radius, connected to the previous point
   * by a straight line if necessary.
   * @param x1 - The x-coordinate of the first control point.
   * @param y1 - The y-coordinate of the first control point.
   * @param x2 - The x-coordinate of the second control point.
   * @param y2 - The y-coordinate of the second control point.
   * @param radius - The arc's radius.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arcTo(t, e, s, r, n) {
    this._tick++;
    const o = this._transform;
    return this._activePath.arcTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * s + o.c * r + o.tx,
      o.b * s + o.d * r + o.ty,
      n
    ), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, s, r, n, o, a) {
    this._tick++;
    const h = this._transform;
    return this._activePath.arcToSvg(
      t,
      e,
      s,
      // should we rotate this with transform??
      r,
      n,
      h.a * o + h.c * a + h.tx,
      h.b * o + h.d * a + h.ty
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, s, r, n, o, a) {
    this._tick++;
    const h = this._transform;
    return this._activePath.bezierCurveTo(
      h.a * t + h.c * e + h.tx,
      h.b * t + h.d * e + h.ty,
      h.a * s + h.c * r + h.tx,
      h.b * s + h.d * r + h.ty,
      h.a * n + h.c * o + h.tx,
      h.b * n + h.d * o + h.ty,
      a
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this._tick++, this._activePath?.closePath(), this;
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, s, r) {
    return this._tick++, this._activePath.ellipse(t, e, s, r, this._transform.clone()), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, s) {
    return this._tick++, this._activePath.circle(t, e, s, this._transform.clone()), this;
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @returns The instance of the current object for chaining.
   */
  path(t) {
    return this._tick++, this._activePath.addPath(t, this._transform.clone()), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._tick++;
    const s = this._transform;
    return this._activePath.lineTo(
      s.a * t + s.c * e + s.tx,
      s.b * t + s.d * e + s.ty
    ), this;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    this._tick++;
    const s = this._transform, r = this._activePath.instructions, n = s.a * t + s.c * e + s.tx, o = s.b * t + s.d * e + s.ty;
    return r.length === 1 && r[0].action === "moveTo" ? (r[0].data[0] = n, r[0].data[1] = o, this) : (this._activePath.moveTo(
      n,
      o
    ), this);
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cpx - The x-coordinate of the control point.
   * @param cpy - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, s, r, n) {
    this._tick++;
    const o = this._transform;
    return this._activePath.quadraticCurveTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * s + o.c * r + o.tx,
      o.b * s + o.d * r + o.ty,
      n
    ), this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, s, r) {
    return this._tick++, this._activePath.rect(t, e, s, r, this._transform.clone()), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, s, r, n) {
    return this._tick++, this._activePath.roundRect(t, e, s, r, n, this._transform.clone()), this;
  }
  /**
   * Draws a polygon shape by specifying a sequence of points. This method allows for the creation of complex polygons,
   * which can be both open and closed. An optional transformation can be applied, enabling the polygon to be scaled,
   * rotated, or translated as needed.
   * @param points - An array of numbers, or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates, of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   */
  poly(t, e) {
    return this._tick++, this._activePath.poly(t, e, this._transform.clone()), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, s, r, n = 0, o) {
    return this._tick++, this._activePath.regularPoly(t, e, s, r, n, o), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, s, r, n, o) {
    return this._tick++, this._activePath.roundPoly(t, e, s, r, n, o), this;
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, s, r) {
    return this._tick++, this._activePath.roundShape(t, e, s, r), this;
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, s, r, n) {
    return this._tick++, this._activePath.filletRect(t, e, s, r, n), this;
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, s, r, n, o) {
    return this._tick++, this._activePath.chamferRect(t, e, s, r, n, o), this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  star(t, e, s, r, n = 0, o = 0) {
    return this._tick++, this._activePath.star(t, e, s, r, n, o, this._transform.clone()), this;
  }
  /**
   * Parses and renders an SVG string into the graphics context. This allows for complex shapes and paths
   * defined in SVG format to be drawn within the graphics context.
   * @param svg - The SVG string to be parsed and rendered.
   */
  svg(t) {
    return this._tick++, Tc(t, this), this;
  }
  /**
   * Restores the most recently saved graphics state by popping the top of the graphics state stack.
   * This includes transformations, fill styles, and stroke styles.
   */
  restore() {
    const t = this._stateStack.pop();
    return t && (this._transform = t.transform, this._fillStyle = t.fillStyle, this._strokeStyle = t.strokeStyle), this;
  }
  /** Saves the current graphics state, including transformations, fill styles, and stroke styles, onto a stack. */
  save() {
    return this._stateStack.push({
      transform: this._transform.clone(),
      fillStyle: { ...this._fillStyle },
      strokeStyle: { ...this._strokeStyle }
    }), this;
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * @returns The current transformation matrix.
   */
  getTransform() {
    return this._transform;
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing any transformations (rotation, scaling, translation) previously applied.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  resetTransform() {
    return this._transform.identity(), this;
  }
  /**
   * Applies a rotation transformation to the graphics context around the current origin.
   * @param angle - The angle of rotation in radians.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  rotate(t) {
    return this._transform.rotate(t), this;
  }
  /**
   * Applies a scaling transformation to the graphics context, scaling drawings by x horizontally and by y vertically.
   * @param x - The scale factor in the horizontal direction.
   * @param y - (Optional) The scale factor in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  scale(t, e = t) {
    return this._transform.scale(t, e), this;
  }
  setTransform(t, e, s, r, n, o) {
    return t instanceof et ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, s, r, n, o), this);
  }
  transform(t, e, s, r, n, o) {
    return t instanceof et ? (this._transform.append(t), this) : (rn.set(t, e, s, r, n, o), this._transform.append(rn), this);
  }
  /**
   * Applies a translation transformation to the graphics context, moving the origin by the specified amounts.
   * @param x - The amount to translate in the horizontal direction.
   * @param y - (Optional) The amount to translate in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  translate(t, e = t) {
    return this._transform.translate(t, e), this;
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it. This includes clearing the path,
   * and optionally resetting transformations to the identity matrix.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  clear() {
    return this._activePath.clear(), this.instructions.length = 0, this.resetTransform(), this.onUpdate(), this;
  }
  onUpdate() {
    this.dirty || (this.emit("update", this, 16), this.dirty = !0, this._boundsDirty = !0);
  }
  /** The bounds of the graphic shape. */
  get bounds() {
    if (!this._boundsDirty)
      return this._bounds;
    const t = this._bounds;
    t.clear();
    for (let e = 0; e < this.instructions.length; e++) {
      const s = this.instructions[e], r = s.action;
      if (r === "fill") {
        const n = s.data;
        t.addBounds(n.path.bounds);
      } else if (r === "texture") {
        const n = s.data;
        t.addFrame(n.dx, n.dy, n.dx + n.dw, n.dy + n.dh, n.transform);
      }
      if (r === "stroke") {
        const n = s.data, o = n.style.alignment, a = n.style.width * (1 - o), h = n.path.bounds;
        t.addFrame(
          h.minX - a,
          h.minY - a,
          h.maxX + a,
          h.maxY + a
        );
      }
    }
    return t;
  }
  /**
   * Check to see if a point is contained within this geometry.
   * @param point - Point to check if it's contained.
   * @returns {boolean} `true` if the point is contained within geometry.
   */
  containsPoint(t) {
    if (!this.bounds.containsPoint(t.x, t.y))
      return !1;
    const e = this.instructions;
    let s = !1;
    for (let r = 0; r < e.length; r++) {
      const n = e[r], o = n.data, a = o.path;
      if (!n.action || !a)
        continue;
      const h = o.style, c = a.shapePath.shapePrimitives;
      for (let l = 0; l < c.length; l++) {
        const u = c[l].shape;
        if (!h || !u)
          continue;
        const f = c[l].transform, d = f ? f.applyInverse(t, Lc) : t;
        if (n.action === "fill")
          s = u.contains(d.x, d.y);
        else {
          const y = h;
          s = u.strokeContains(d.x, d.y, y.width, y.alignment);
        }
        const g = o.hole;
        if (g) {
          const y = g.shapePath?.shapePrimitives;
          if (y)
            for (let m = 0; m < y.length; m++)
              y[m].shape.contains(d.x, d.y) && (s = !1);
        }
        if (s)
          return !0;
      }
    }
    return s;
  }
  /**
   * Destroys the GraphicsData object.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the fill/stroke style?
   * @param {boolean} [options.textureSource=false] - Should it destroy the texture source of the fill/stroke style?
   */
  destroy(t = !1) {
    if (this._stateStack.length = 0, this._transform = null, this.emit("destroy", this), this.removeAllListeners(), typeof t == "boolean" ? t : t?.texture) {
      const s = typeof t == "boolean" ? t : t?.textureSource;
      this._fillStyle.texture && this._fillStyle.texture.destroy(s), this._strokeStyle.texture && this._strokeStyle.texture.destroy(s);
    }
    this._fillStyle = null, this._strokeStyle = null, this.instructions = null, this._activePath = null, this._bounds = null, this._stateStack = null, this.customShader = null, this._transform = null;
  }
};
qi.defaultFillStyle = {
  /** The color to use for the fill. */
  color: 16777215,
  /** The alpha value to use for the fill. */
  alpha: 1,
  /** The texture to use for the fill. */
  texture: tt.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null
};
qi.defaultStrokeStyle = {
  /** The width of the stroke. */
  width: 1,
  /** The color to use for the stroke. */
  color: 16777215,
  /** The alpha value to use for the stroke. */
  alpha: 1,
  /** The alignment of the stroke. */
  alignment: 0.5,
  /** The miter limit to use. */
  miterLimit: 10,
  /** The line cap style to use. */
  cap: "butt",
  /** The line join style to use. */
  join: "miter",
  /** The texture to use for the fill. */
  texture: tt.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null,
  /** If the stroke is a pixel line. */
  pixelLine: !1
};
let he = qi;
const nn = [
  "align",
  "breakWords",
  "cssOverrides",
  "fontVariant",
  "fontWeight",
  "leading",
  "letterSpacing",
  "lineHeight",
  "padding",
  "textBaseline",
  "trim",
  "whiteSpace",
  "wordWrap",
  "wordWrapWidth",
  "fontFamily",
  "fontStyle",
  "fontSize"
];
function Bc(i) {
  const t = [];
  let e = 0;
  for (let s = 0; s < nn.length; s++) {
    const r = `_${nn[s]}`;
    t[e++] = i[r];
  }
  return e = Oo(i._fill, t, e), e = Nc(i._stroke, t, e), e = Fc(i.dropShadow, t, e), t.join("-");
}
function Oo(i, t, e) {
  return i && (t[e++] = i.color, t[e++] = i.alpha, t[e++] = i.fill?.styleKey), e;
}
function Nc(i, t, e) {
  return i && (e = Oo(i, t, e), t[e++] = i.width, t[e++] = i.alignment, t[e++] = i.cap, t[e++] = i.join, t[e++] = i.miterLimit), e;
}
function Fc(i, t, e) {
  return i && (t[e++] = i.alpha, t[e++] = i.angle, t[e++] = i.blur, t[e++] = i.distance, t[e++] = ut.shared.setValue(i.color).toNumber()), e;
}
const Zi = class fe extends Rt {
  constructor(t = {}) {
    super(), Oc(t);
    const e = { ...fe.defaultTextStyle, ...t };
    for (const s in e) {
      const r = s;
      this[r] = e[s];
    }
    this.update();
  }
  /**
   * Alignment for multiline text, does not affect single line text.
   * @member {'left'|'center'|'right'|'justify'}
   */
  get align() {
    return this._align;
  }
  set align(t) {
    this._align = t, this.update();
  }
  /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
  get breakWords() {
    return this._breakWords;
  }
  set breakWords(t) {
    this._breakWords = t, this.update();
  }
  /** Set a drop shadow for the text. */
  get dropShadow() {
    return this._dropShadow;
  }
  set dropShadow(t) {
    t !== null && typeof t == "object" ? this._dropShadow = this._createProxy({ ...fe.defaultDropShadow, ...t }) : this._dropShadow = t ? this._createProxy({ ...fe.defaultDropShadow }) : null, this.update();
  }
  /** The font family, can be a single font name, or a list of names where the first is the preferred font. */
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(t) {
    this._fontFamily = t, this.update();
  }
  /** The font size (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em') */
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(t) {
    typeof t == "string" ? this._fontSize = parseInt(t, 10) : this._fontSize = t, this.update();
  }
  /**
   * The font style.
   * @member {'normal'|'italic'|'oblique'}
   */
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(t) {
    this._fontStyle = t.toLowerCase(), this.update();
  }
  /**
   * The font variant.
   * @member {'normal'|'small-caps'}
   */
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(t) {
    this._fontVariant = t, this.update();
  }
  /**
   * The font weight.
   * @member {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(t) {
    this._fontWeight = t, this.update();
  }
  /** The space between lines. */
  get leading() {
    return this._leading;
  }
  set leading(t) {
    this._leading = t, this.update();
  }
  /** The amount of spacing between letters, default is 0. */
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(t) {
    this._letterSpacing = t, this.update();
  }
  /** The line height, a number that represents the vertical space that a letter uses. */
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(t) {
    this._lineHeight = t, this.update();
  }
  /**
   * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
   * by adding padding to all sides of the text.
   */
  get padding() {
    return this._padding;
  }
  set padding(t) {
    this._padding = t, this.update();
  }
  /** Trim transparent borders. This is an expensive operation so only use this if you have to! */
  get trim() {
    return this._trim;
  }
  set trim(t) {
    this._trim = t, this.update();
  }
  /**
   * The baseline of the text that is rendered.
   * @member {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(t) {
    this._textBaseline = t, this.update();
  }
  /**
   * How newlines and spaces should be handled.
   * Default is 'pre' (preserve, preserve).
   *
   *  value       | New lines     |   Spaces
   *  ---         | ---           |   ---
   * 'normal'     | Collapse      |   Collapse
   * 'pre'        | Preserve      |   Preserve
   * 'pre-line'   | Preserve      |   Collapse
   * @member {'normal'|'pre'|'pre-line'}
   */
  get whiteSpace() {
    return this._whiteSpace;
  }
  set whiteSpace(t) {
    this._whiteSpace = t, this.update();
  }
  /** Indicates if word wrap should be used. */
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(t) {
    this._wordWrap = t, this.update();
  }
  /** The width at which text will wrap, it needs wordWrap to be set to true. */
  get wordWrapWidth() {
    return this._wordWrapWidth;
  }
  set wordWrapWidth(t) {
    this._wordWrapWidth = t, this.update();
  }
  /** A fillstyle that will be used on the text e.g., 'red', '#00FF00'. */
  get fill() {
    return this._originalFill;
  }
  set fill(t) {
    t !== this._originalFill && (this._originalFill = t, this._isFillStyle(t) && (this._originalFill = this._createProxy({ ...he.defaultFillStyle, ...t }, () => {
      this._fill = le(
        { ...this._originalFill },
        he.defaultFillStyle
      );
    })), this._fill = le(
      t === 0 ? "black" : t,
      he.defaultFillStyle
    ), this.update());
  }
  /** A fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'. */
  get stroke() {
    return this._originalStroke;
  }
  set stroke(t) {
    t !== this._originalStroke && (this._originalStroke = t, this._isFillStyle(t) && (this._originalStroke = this._createProxy({ ...he.defaultStrokeStyle, ...t }, () => {
      this._stroke = bs(
        { ...this._originalStroke },
        he.defaultStrokeStyle
      );
    })), this._stroke = bs(t, he.defaultStrokeStyle), this.update());
  }
  _generateKey() {
    return this._styleKey = Bc(this), this._styleKey;
  }
  update() {
    this._styleKey = null, this.emit("update", this);
  }
  /** Resets all properties to the default values */
  reset() {
    const t = fe.defaultTextStyle;
    for (const e in t)
      this[e] = t[e];
  }
  get styleKey() {
    return this._styleKey || this._generateKey();
  }
  /**
   * Creates a new TextStyle object with the same values as this one.
   * @returns New cloned TextStyle object
   */
  clone() {
    return new fe({
      align: this.align,
      breakWords: this.breakWords,
      dropShadow: this._dropShadow ? { ...this._dropShadow } : null,
      fill: this._fill,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontVariant: this.fontVariant,
      fontWeight: this.fontWeight,
      leading: this.leading,
      letterSpacing: this.letterSpacing,
      lineHeight: this.lineHeight,
      padding: this.padding,
      stroke: this._stroke,
      textBaseline: this.textBaseline,
      whiteSpace: this.whiteSpace,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth
    });
  }
  /**
   * Destroys this text style.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the texture of the this style
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the this style
   */
  destroy(t = !1) {
    if (this.removeAllListeners(), typeof t == "boolean" ? t : t?.texture) {
      const s = typeof t == "boolean" ? t : t?.textureSource;
      this._fill?.texture && this._fill.texture.destroy(s), this._originalFill?.texture && this._originalFill.texture.destroy(s), this._stroke?.texture && this._stroke.texture.destroy(s), this._originalStroke?.texture && this._originalStroke.texture.destroy(s);
    }
    this._fill = null, this._stroke = null, this.dropShadow = null, this._originalStroke = null, this._originalFill = null;
  }
  _createProxy(t, e) {
    return new Proxy(t, {
      set: (s, r, n) => (s[r] = n, e?.(r, n), this.update(), !0)
    });
  }
  _isFillStyle(t) {
    return (t ?? null) !== null && !(ut.isColorLike(t) || t instanceof Ue || t instanceof Cs);
  }
};
Zi.defaultDropShadow = {
  /** Set alpha for the drop shadow */
  alpha: 1,
  /** Set a angle of the drop shadow */
  angle: Math.PI / 6,
  /** Set a shadow blur radius */
  blur: 0,
  /** A fill style to be used on the  e.g., 'red', '#00FF00' */
  color: "black",
  /** Set a distance of the drop shadow */
  distance: 5
};
Zi.defaultTextStyle = {
  /**
   * See {@link TextStyle.align}
   * @type {'left'|'center'|'right'|'justify'}
   */
  align: "left",
  /** See {@link TextStyle.breakWords} */
  breakWords: !1,
  /** See {@link TextStyle.dropShadow} */
  dropShadow: null,
  /**
   * See {@link TextStyle.fill}
   * @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
   */
  fill: "black",
  /**
   * See {@link TextStyle.fontFamily}
   * @type {string|string[]}
   */
  fontFamily: "Arial",
  /**
   * See {@link TextStyle.fontSize}
   * @type {number|string}
   */
  fontSize: 26,
  /**
   * See {@link TextStyle.fontStyle}
   * @type {'normal'|'italic'|'oblique'}
   */
  fontStyle: "normal",
  /**
   * See {@link TextStyle.fontVariant}
   * @type {'normal'|'small-caps'}
   */
  fontVariant: "normal",
  /**
   * See {@link TextStyle.fontWeight}
   * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  fontWeight: "normal",
  /** See {@link TextStyle.leading} */
  leading: 0,
  /** See {@link TextStyle.letterSpacing} */
  letterSpacing: 0,
  /** See {@link TextStyle.lineHeight} */
  lineHeight: 0,
  /** See {@link TextStyle.padding} */
  padding: 0,
  /**
   * See {@link TextStyle.stroke}
   * @type {string|number}
   */
  stroke: null,
  /**
   * See {@link TextStyle.textBaseline}
   * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  textBaseline: "alphabetic",
  /** See {@link TextStyle.trim} */
  trim: !1,
  /**
   * See {@link TextStyle.whiteSpace}
   * @type {'normal'|'pre'|'pre-line'}
   */
  whiteSpace: "pre",
  /** See {@link TextStyle.wordWrap} */
  wordWrap: !1,
  /** See {@link TextStyle.wordWrapWidth} */
  wordWrapWidth: 100
};
let Ve = Zi;
function Oc(i) {
  const t = i;
  if (typeof t.dropShadow == "boolean" && t.dropShadow) {
    const e = Ve.defaultDropShadow;
    i.dropShadow = {
      alpha: t.dropShadowAlpha ?? e.alpha,
      angle: t.dropShadowAngle ?? e.angle,
      blur: t.dropShadowBlur ?? e.blur,
      color: t.dropShadowColor ?? e.color,
      distance: t.dropShadowDistance ?? e.distance
    };
  }
  if (t.strokeThickness !== void 0) {
    ot(yt, "strokeThickness is now a part of stroke");
    const e = t.stroke;
    let s = {};
    if (ut.isColorLike(e))
      s.color = e;
    else if (e instanceof Ue || e instanceof Cs)
      s.fill = e;
    else if (Object.hasOwnProperty.call(e, "color") || Object.hasOwnProperty.call(e, "fill"))
      s = e;
    else
      throw new Error("Invalid stroke value.");
    i.stroke = {
      ...s,
      width: t.strokeThickness
    };
  }
  if (Array.isArray(t.fillGradientStops)) {
    ot(yt, "gradient fill is now a fill pattern: `new FillGradient(...)`");
    let e;
    i.fontSize == null ? i.fontSize = Ve.defaultTextStyle.fontSize : typeof i.fontSize == "string" ? e = parseInt(i.fontSize, 10) : e = i.fontSize;
    const s = new Ue(0, 0, 0, e * 1.7), r = t.fillGradientStops.map((n) => ut.shared.setValue(n).toNumber());
    r.forEach((n, o) => {
      const a = o / (r.length - 1);
      s.addColorStop(a, n);
    }), i.fill = {
      fill: s
    };
  }
}
class Rc {
  constructor(t) {
    this._canvasPool = /* @__PURE__ */ Object.create(null), this.canvasOptions = t || {}, this.enableFullScreen = !1;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   */
  _createCanvasAndContext(t, e) {
    const s = mt.get().createCanvas();
    s.width = t, s.height = e;
    const r = s.getContext("2d");
    return { canvas: s, context: r };
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture.
   * @param minHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @returns The new render texture.
   */
  getOptimalCanvasAndContext(t, e, s = 1) {
    t = Math.ceil(t * s - 1e-6), e = Math.ceil(e * s - 1e-6), t = xs(t), e = xs(e);
    const r = (t << 17) + (e << 1);
    this._canvasPool[r] || (this._canvasPool[r] = []);
    let n = this._canvasPool[r].pop();
    return n || (n = this._createCanvasAndContext(t, e)), n;
  }
  /**
   * Place a render texture back into the pool.
   * @param canvasAndContext
   */
  returnCanvasAndContext(t) {
    const e = t.canvas, { width: s, height: r } = e, n = (s << 17) + (r << 1);
    t.context.clearRect(0, 0, s, r), this._canvasPool[n].push(t);
  }
  clear() {
    this._canvasPool = {};
  }
}
const on = new Rc(), zc = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
];
function Bi(i) {
  const t = typeof i.fontSize == "number" ? `${i.fontSize}px` : i.fontSize;
  let e = i.fontFamily;
  Array.isArray(i.fontFamily) || (e = i.fontFamily.split(","));
  for (let s = e.length - 1; s >= 0; s--) {
    let r = e[s].trim();
    !/([\"\'])[^\'\"]+\1/.test(r) && !zc.includes(r) && (r = `"${r}"`), e[s] = r;
  }
  return `${i.fontStyle} ${i.fontVariant} ${i.fontWeight} ${t} ${e.join(",")}`;
}
const hi = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: !0
}, $t = class Y {
  /**
   * Checking that we can use modern canvas 2D API.
   *
   * Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
   * @see TextMetrics.experimentalLetterSpacing
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ICanvasRenderingContext2D/letterSpacing
   * @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
   */
  static get experimentalLetterSpacingSupported() {
    let t = Y._experimentalLetterSpacingSupported;
    if (t !== void 0) {
      const e = mt.get().getCanvasRenderingContext2D().prototype;
      t = Y._experimentalLetterSpacingSupported = "letterSpacing" in e || "textLetterSpacing" in e;
    }
    return t;
  }
  /**
   * @param text - the text that was measured
   * @param style - the style that was measured
   * @param width - the measured width of the text
   * @param height - the measured height of the text
   * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
   * @param lineWidths - an array of the line widths for each line matched to `lines`
   * @param lineHeight - the measured line height for this style
   * @param maxLineWidth - the maximum line width for all measured lines
   * @param {FontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
   */
  constructor(t, e, s, r, n, o, a, h, c) {
    this.text = t, this.style = e, this.width = s, this.height = r, this.lines = n, this.lineWidths = o, this.lineHeight = a, this.maxLineWidth = h, this.fontProperties = c;
  }
  /**
   * Measures the supplied string of text and returns a Rectangle.
   * @param text - The text to measure.
   * @param style - The text style to use for measuring
   * @param canvas - optional specification of the canvas to use for measuring.
   * @param wordWrap
   * @returns Measured width and height of the text.
   */
  static measureText(t = " ", e, s = Y._canvas, r = e.wordWrap) {
    const n = `${t}:${e.styleKey}`;
    if (Y._measurementCache[n])
      return Y._measurementCache[n];
    const o = Bi(e), a = Y.measureFont(o);
    a.fontSize === 0 && (a.fontSize = e.fontSize, a.ascent = e.fontSize);
    const h = Y.__context;
    h.font = o;
    const l = (r ? Y._wordWrap(t, e, s) : t).split(/(?:\r\n|\r|\n)/), u = new Array(l.length);
    let f = 0;
    for (let M = 0; M < l.length; M++) {
      const S = Y._measureText(l[M], e.letterSpacing, h);
      u[M] = S, f = Math.max(f, S);
    }
    const d = e._stroke?.width || 0;
    let g = f + d;
    e.dropShadow && (g += e.dropShadow.distance);
    const y = e.lineHeight || a.fontSize;
    let m = Math.max(y, a.fontSize + d) + (l.length - 1) * (y + e.leading);
    return e.dropShadow && (m += e.dropShadow.distance), new Y(
      t,
      e,
      g,
      m,
      l,
      u,
      y + e.leading,
      f,
      a
    );
  }
  static _measureText(t, e, s) {
    let r = !1;
    Y.experimentalLetterSpacingSupported && (Y.experimentalLetterSpacing ? (s.letterSpacing = `${e}px`, s.textLetterSpacing = `${e}px`, r = !0) : (s.letterSpacing = "0px", s.textLetterSpacing = "0px"));
    const n = s.measureText(t);
    let o = n.width;
    const a = -n.actualBoundingBoxLeft;
    let c = n.actualBoundingBoxRight - a;
    if (o > 0)
      if (r)
        o -= e, c -= e;
      else {
        const l = (Y.graphemeSegmenter(t).length - 1) * e;
        o += l, c += l;
      }
    return Math.max(o, c);
  }
  /**
   * Applies newlines to a string to have it optimally fit into the horizontal
   * bounds set by the Text object's wordWrapWidth property.
   * @param text - String to apply word wrapping to
   * @param style - the style to use when wrapping
   * @param canvas - optional specification of the canvas to use for measuring.
   * @returns New string with new lines applied where required
   */
  static _wordWrap(t, e, s = Y._canvas) {
    const r = s.getContext("2d", hi);
    let n = 0, o = "", a = "";
    const h = /* @__PURE__ */ Object.create(null), { letterSpacing: c, whiteSpace: l } = e, u = Y._collapseSpaces(l), f = Y._collapseNewlines(l);
    let d = !u;
    const g = e.wordWrapWidth + c, y = Y._tokenize(t);
    for (let m = 0; m < y.length; m++) {
      let _ = y[m];
      if (Y._isNewline(_)) {
        if (!f) {
          a += Y._addLine(o), d = !u, o = "", n = 0;
          continue;
        }
        _ = " ";
      }
      if (u) {
        const S = Y.isBreakingSpace(_), C = Y.isBreakingSpace(o[o.length - 1]);
        if (S && C)
          continue;
      }
      const M = Y._getFromCache(_, c, h, r);
      if (M > g)
        if (o !== "" && (a += Y._addLine(o), o = "", n = 0), Y.canBreakWords(_, e.breakWords)) {
          const S = Y.wordWrapSplit(_);
          for (let C = 0; C < S.length; C++) {
            let L = S[C], P = L, I = 1;
            for (; S[C + I]; ) {
              const O = S[C + I];
              if (!Y.canBreakChars(P, O, _, C, e.breakWords))
                L += O;
              else
                break;
              P = O, I++;
            }
            C += I - 1;
            const v = Y._getFromCache(L, c, h, r);
            v + n > g && (a += Y._addLine(o), d = !1, o = "", n = 0), o += L, n += v;
          }
        } else {
          o.length > 0 && (a += Y._addLine(o), o = "", n = 0);
          const S = m === y.length - 1;
          a += Y._addLine(_, !S), d = !1, o = "", n = 0;
        }
      else
        M + n > g && (d = !1, a += Y._addLine(o), o = "", n = 0), (o.length > 0 || !Y.isBreakingSpace(_) || d) && (o += _, n += M);
    }
    return a += Y._addLine(o, !1), a;
  }
  /**
   * Convenience function for logging each line added during the wordWrap method.
   * @param line    - The line of text to add
   * @param newLine - Add new line character to end
   * @returns A formatted line
   */
  static _addLine(t, e = !0) {
    return t = Y._trimRight(t), t = e ? `${t}
` : t, t;
  }
  /**
   * Gets & sets the widths of calculated characters in a cache object
   * @param key            - The key
   * @param letterSpacing  - The letter spacing
   * @param cache          - The cache
   * @param context        - The canvas context
   * @returns The from cache.
   */
  static _getFromCache(t, e, s, r) {
    let n = s[t];
    return typeof n != "number" && (n = Y._measureText(t, e, r) + e, s[t] = n), n;
  }
  /**
   * Determines whether we should collapse breaking spaces.
   * @param whiteSpace - The TextStyle property whiteSpace
   * @returns Should collapse
   */
  static _collapseSpaces(t) {
    return t === "normal" || t === "pre-line";
  }
  /**
   * Determines whether we should collapse newLine chars.
   * @param whiteSpace - The white space
   * @returns should collapse
   */
  static _collapseNewlines(t) {
    return t === "normal";
  }
  /**
   * Trims breaking whitespaces from string.
   * @param text - The text
   * @returns Trimmed string
   */
  static _trimRight(t) {
    if (typeof t != "string")
      return "";
    for (let e = t.length - 1; e >= 0; e--) {
      const s = t[e];
      if (!Y.isBreakingSpace(s))
        break;
      t = t.slice(0, -1);
    }
    return t;
  }
  /**
   * Determines if char is a newline.
   * @param char - The character
   * @returns True if newline, False otherwise.
   */
  static _isNewline(t) {
    return typeof t != "string" ? !1 : Y._newlines.includes(t.charCodeAt(0));
  }
  /**
   * Determines if char is a breaking whitespace.
   *
   * It allows one to determine whether char should be a breaking whitespace
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param char - The character
   * @param [_nextChar] - The next character
   * @returns True if whitespace, False otherwise.
   */
  static isBreakingSpace(t, e) {
    return typeof t != "string" ? !1 : Y._breakingSpaces.includes(t.charCodeAt(0));
  }
  /**
   * Splits a string into words, breaking-spaces and newLine characters
   * @param text - The text
   * @returns A tokenized array
   */
  static _tokenize(t) {
    const e = [];
    let s = "";
    if (typeof t != "string")
      return e;
    for (let r = 0; r < t.length; r++) {
      const n = t[r], o = t[r + 1];
      if (Y.isBreakingSpace(n, o) || Y._isNewline(n)) {
        s !== "" && (e.push(s), s = ""), e.push(n);
        continue;
      }
      s += n;
    }
    return s !== "" && e.push(s), e;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to customise which words should break
   * Examples are if the token is CJK or numbers.
   * It must return a boolean.
   * @param _token - The token
   * @param breakWords - The style attr break words
   * @returns Whether to break word or not
   */
  static canBreakWords(t, e) {
    return e;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to determine whether a pair of characters
   * should be broken by newlines
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param _char - The character
   * @param _nextChar - The next character
   * @param _token - The token/word the characters are from
   * @param _index - The index in the token of the char
   * @param _breakWords - The style attr break words
   * @returns whether to break word or not
   */
  static canBreakChars(t, e, s, r, n) {
    return !0;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It is called when a token (usually a word) has to be split into separate pieces
   * in order to determine the point to break a word.
   * It must return an array of characters.
   * @param token - The token to split
   * @returns The characters of the token
   * @see CanvasTextMetrics.graphemeSegmenter
   */
  static wordWrapSplit(t) {
    return Y.graphemeSegmenter(t);
  }
  /**
   * Calculates the ascent, descent and fontSize of a given font-style
   * @param font - String representing the style of the font
   * @returns Font properties object
   */
  static measureFont(t) {
    if (Y._fonts[t])
      return Y._fonts[t];
    const e = Y._context;
    e.font = t;
    const s = e.measureText(Y.METRICS_STRING + Y.BASELINE_SYMBOL), r = {
      ascent: s.actualBoundingBoxAscent,
      descent: s.actualBoundingBoxDescent,
      fontSize: s.actualBoundingBoxAscent + s.actualBoundingBoxDescent
    };
    return Y._fonts[t] = r, r;
  }
  /**
   * Clear font metrics in metrics cache.
   * @param {string} [font] - font name. If font name not set then clear cache for all fonts.
   */
  static clearMetrics(t = "") {
    t ? delete Y._fonts[t] : Y._fonts = {};
  }
  /**
   * Cached canvas element for measuring text
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _canvas() {
    if (!Y.__canvas) {
      let t;
      try {
        const e = new OffscreenCanvas(0, 0);
        if (e.getContext("2d", hi)?.measureText)
          return Y.__canvas = e, e;
        t = mt.get().createCanvas();
      } catch {
        t = mt.get().createCanvas();
      }
      t.width = t.height = 10, Y.__canvas = t;
    }
    return Y.__canvas;
  }
  /**
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _context() {
    return Y.__context || (Y.__context = Y._canvas.getContext("2d", hi)), Y.__context;
  }
};
$t.METRICS_STRING = "|ÉqÅ";
$t.BASELINE_SYMBOL = "M";
$t.BASELINE_MULTIPLIER = 1.4;
$t.HEIGHT_MULTIPLIER = 2;
$t.graphemeSegmenter = (() => {
  if (typeof Intl?.Segmenter == "function") {
    const i = new Intl.Segmenter();
    return (t) => [...i.segment(t)].map((e) => e.segment);
  }
  return (i) => [...i];
})();
$t.experimentalLetterSpacing = !1;
$t._fonts = {};
$t._newlines = [
  10,
  // line feed
  13
  // carriage return
];
$t._breakingSpaces = [
  9,
  // character tabulation
  32,
  // space
  8192,
  // en quad
  8193,
  // em quad
  8194,
  // en space
  8195,
  // em space
  8196,
  // three-per-em space
  8197,
  // four-per-em space
  8198,
  // six-per-em space
  8200,
  // punctuation space
  8201,
  // thin space
  8202,
  // hair space
  8287,
  // medium mathematical space
  12288
  // ideographic space
];
$t._measurementCache = {};
let an = $t;
function hn(i, t) {
  if (i.texture === tt.WHITE && !i.fill)
    return ut.shared.setValue(i.color).setAlpha(i.alpha ?? 1).toHexa();
  if (i.fill) {
    if (i.fill instanceof Cs) {
      const e = i.fill, s = t.createPattern(e.texture.source.resource, "repeat"), r = e.transform.copyTo(et.shared);
      return r.scale(
        e.texture.frame.width,
        e.texture.frame.height
      ), s.setTransform(r), s;
    } else if (i.fill instanceof Ue) {
      const e = i.fill;
      if (e.type === "linear") {
        const s = t.createLinearGradient(
          e.x0,
          e.y0,
          e.x1,
          e.y1
        );
        return e.gradientStops.forEach((r) => {
          s.addColorStop(r.offset, ut.shared.setValue(r.color).toHex());
        }), s;
      }
    }
  } else {
    const e = t.createPattern(i.texture.source.resource, "repeat"), s = i.matrix.copyTo(et.shared);
    return s.scale(i.texture.frame.width, i.texture.frame.height), e.setTransform(s), e;
  }
  return xt("FillStyle not recognised", i), "red";
}
function Ro(i) {
  if (i === "")
    return [];
  typeof i == "string" && (i = [i]);
  const t = [];
  for (let e = 0, s = i.length; e < s; e++) {
    const r = i[e];
    if (Array.isArray(r)) {
      if (r.length !== 2)
        throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${r.length}.`);
      if (r[0].length === 0 || r[1].length === 0)
        throw new Error("[BitmapFont]: Invalid character delimiter.");
      const n = r[0].charCodeAt(0), o = r[1].charCodeAt(0);
      if (o < n)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (let a = n, h = o; a <= h; a++)
        t.push(String.fromCharCode(a));
    } else
      t.push(...Array.from(r));
  }
  if (t.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return t;
}
const zo = class Do extends yo {
  /**
   * @param options - The options for the dynamic bitmap font.
   */
  constructor(t) {
    super(), this.resolution = 1, this.pages = [], this._padding = 0, this._measureCache = /* @__PURE__ */ Object.create(null), this._currentChars = [], this._currentX = 0, this._currentY = 0, this._currentPageIndex = -1, this._skipKerning = !1;
    const e = { ...Do.defaultOptions, ...t };
    this._textureSize = e.textureSize, this._mipmap = e.mipmap;
    const s = e.style.clone();
    e.overrideFill && (s._fill.color = 16777215, s._fill.alpha = 1, s._fill.texture = tt.WHITE, s._fill.fill = null), this.applyFillAsTint = e.overrideFill;
    const r = s.fontSize;
    s.fontSize = this.baseMeasurementFontSize;
    const n = Bi(s);
    e.overrideSize ? s._stroke && (s._stroke.width *= this.baseRenderedFontSize / r) : s.fontSize = this.baseRenderedFontSize = r, this._style = s, this._skipKerning = e.skipKerning ?? !1, this.resolution = e.resolution ?? 1, this._padding = e.padding ?? 4, this.fontMetrics = an.measureFont(n), this.lineHeight = s.lineHeight || this.fontMetrics.fontSize || s.fontSize;
  }
  ensureCharacters(t) {
    const e = Ro(t).filter((m) => !this._currentChars.includes(m)).filter((m, _, M) => M.indexOf(m) === _);
    if (!e.length)
      return;
    this._currentChars = [...this._currentChars, ...e];
    let s;
    this._currentPageIndex === -1 ? s = this._nextPage() : s = this.pages[this._currentPageIndex];
    let { canvas: r, context: n } = s.canvasAndContext, o = s.texture.source;
    const a = this._style;
    let h = this._currentX, c = this._currentY;
    const l = this.baseRenderedFontSize / this.baseMeasurementFontSize, u = this._padding * l;
    let f = 0, d = !1;
    const g = r.width / this.resolution, y = r.height / this.resolution;
    for (let m = 0; m < e.length; m++) {
      const _ = e[m], M = an.measureText(_, a, r, !1);
      M.lineHeight = M.height;
      const S = M.width * l, C = Math.ceil((a.fontStyle === "italic" ? 2 : 1) * S), L = M.height * l, P = C + u * 2, I = L + u * 2;
      if (d = !1, _ !== `
` && _ !== "\r" && _ !== "	" && _ !== " " && (d = !0, f = Math.ceil(Math.max(I, f))), h + P > g && (c += f, f = I, h = 0, c + f > y)) {
        o.update();
        const O = this._nextPage();
        r = O.canvasAndContext.canvas, n = O.canvasAndContext.context, o = O.texture.source, c = 0;
      }
      const v = S / l - (a.dropShadow?.distance ?? 0) - (a._stroke?.width ?? 0);
      if (this.chars[_] = {
        id: _.codePointAt(0),
        xOffset: -this._padding,
        yOffset: -this._padding,
        xAdvance: v,
        kerning: {}
      }, d) {
        this._drawGlyph(
          n,
          M,
          h + u,
          c + u,
          l,
          a
        );
        const O = o.width * l, N = o.height * l, z = new wt(
          h / O * o.width,
          c / N * o.height,
          P / O * o.width,
          I / N * o.height
        );
        this.chars[_].texture = new tt({
          source: o,
          frame: z
        }), h += Math.ceil(P);
      }
    }
    o.update(), this._currentX = h, this._currentY = c, this._skipKerning && this._applyKerning(e, n);
  }
  /**
   * @deprecated since 8.0.0
   * The map of base page textures (i.e., sheets of glyphs).
   */
  get pageTextures() {
    return ot(yt, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  _applyKerning(t, e) {
    const s = this._measureCache;
    for (let r = 0; r < t.length; r++) {
      const n = t[r];
      for (let o = 0; o < this._currentChars.length; o++) {
        const a = this._currentChars[o];
        let h = s[n];
        h || (h = s[n] = e.measureText(n).width);
        let c = s[a];
        c || (c = s[a] = e.measureText(a).width);
        let l = e.measureText(n + a).width, u = l - (h + c);
        u && (this.chars[n].kerning[a] = u), l = e.measureText(n + a).width, u = l - (h + c), u && (this.chars[a].kerning[n] = u);
      }
    }
  }
  _nextPage() {
    this._currentPageIndex++;
    const t = this.resolution, e = on.getOptimalCanvasAndContext(
      this._textureSize,
      this._textureSize,
      t
    );
    this._setupContext(e.context, this._style, t);
    const s = t * (this.baseRenderedFontSize / this.baseMeasurementFontSize), r = new tt({
      source: new ve({
        resource: e.canvas,
        resolution: s,
        alphaMode: "premultiply-alpha-on-upload",
        autoGenerateMipmaps: this._mipmap
      })
    }), n = {
      canvasAndContext: e,
      texture: r
    };
    return this.pages[this._currentPageIndex] = n, n;
  }
  // canvas style!
  _setupContext(t, e, s) {
    e.fontSize = this.baseRenderedFontSize, t.scale(s, s), t.font = Bi(e), e.fontSize = this.baseMeasurementFontSize, t.textBaseline = e.textBaseline;
    const r = e._stroke, n = r?.width ?? 0;
    if (r && (t.lineWidth = n, t.lineJoin = r.join, t.miterLimit = r.miterLimit, t.strokeStyle = hn(r, t)), e._fill && (t.fillStyle = hn(e._fill, t)), e.dropShadow) {
      const o = e.dropShadow, a = ut.shared.setValue(o.color).toArray(), h = o.blur * s, c = o.distance * s;
      t.shadowColor = `rgba(${a[0] * 255},${a[1] * 255},${a[2] * 255},${o.alpha})`, t.shadowBlur = h, t.shadowOffsetX = Math.cos(o.angle) * c, t.shadowOffsetY = Math.sin(o.angle) * c;
    } else
      t.shadowColor = "black", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0;
  }
  _drawGlyph(t, e, s, r, n, o) {
    const a = e.text, h = e.fontProperties, l = (o._stroke?.width ?? 0) * n, u = s + l / 2, f = r - l / 2, d = h.descent * n, g = e.lineHeight * n;
    o.stroke && l && t.strokeText(a, u, f + g - d), o._fill && t.fillText(a, u, f + g - d);
  }
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { canvasAndContext: e, texture: s } = this.pages[t];
      on.returnCanvasAndContext(e), s.destroy(!0);
    }
    this.pages = null;
  }
};
zo.defaultOptions = {
  textureSize: 512,
  style: new Ve(),
  mipmap: !0
};
let ln = zo;
function Dc(i, t, e, s) {
  const r = {
    width: 0,
    height: 0,
    offsetY: 0,
    scale: t.fontSize / e.baseMeasurementFontSize,
    lines: [{
      width: 0,
      charPositions: [],
      spaceWidth: 0,
      spacesIndex: [],
      chars: []
    }]
  };
  r.offsetY = e.baseLineOffset;
  let n = r.lines[0], o = null, a = !0;
  const h = {
    spaceWord: !1,
    width: 0,
    start: 0,
    index: 0,
    // use index to not modify the array as we use it a lot!
    positions: [],
    chars: []
  }, c = (g) => {
    const y = n.width;
    for (let m = 0; m < h.index; m++) {
      const _ = g.positions[m];
      n.chars.push(g.chars[m]), n.charPositions.push(_ + y);
    }
    n.width += g.width, a = !1, h.width = 0, h.index = 0, h.chars.length = 0;
  }, l = () => {
    let g = n.chars.length - 1;
    if (s) {
      let y = n.chars[g];
      for (; y === " "; )
        n.width -= e.chars[y].xAdvance, y = n.chars[--g];
    }
    r.width = Math.max(r.width, n.width), n = {
      width: 0,
      charPositions: [],
      chars: [],
      spaceWidth: 0,
      spacesIndex: []
    }, a = !0, r.lines.push(n), r.height += e.lineHeight;
  }, u = e.baseMeasurementFontSize / t.fontSize, f = t.letterSpacing * u, d = t.wordWrapWidth * u;
  for (let g = 0; g < i.length + 1; g++) {
    let y;
    const m = g === i.length;
    m || (y = i[g]);
    const _ = e.chars[y] || e.chars[" "];
    if (/(?:\s)/.test(y) || y === "\r" || y === `
` || m) {
      if (!a && t.wordWrap && n.width + h.width - f > d ? (l(), c(h), m || n.charPositions.push(0)) : (h.start = n.width, c(h), m || n.charPositions.push(0)), y === "\r" || y === `
`)
        n.width !== 0 && l();
      else if (!m) {
        const L = _.xAdvance + (_.kerning[o] || 0) + f;
        n.width += L, n.spaceWidth = L, n.spacesIndex.push(n.charPositions.length), n.chars.push(y);
      }
    } else {
      const C = _.kerning[o] || 0, L = _.xAdvance + C + f;
      h.positions[h.index++] = h.width + C, h.chars.push(y), h.width += L;
    }
    o = y;
  }
  return l(), t.align === "center" ? jc(r) : t.align === "right" ? Gc(r) : t.align === "justify" && Wc(r), r;
}
function jc(i) {
  for (let t = 0; t < i.lines.length; t++) {
    const e = i.lines[t], s = i.width / 2 - e.width / 2;
    for (let r = 0; r < e.charPositions.length; r++)
      e.charPositions[r] += s;
  }
}
function Gc(i) {
  for (let t = 0; t < i.lines.length; t++) {
    const e = i.lines[t], s = i.width - e.width;
    for (let r = 0; r < e.charPositions.length; r++)
      e.charPositions[r] += s;
  }
}
function Wc(i) {
  const t = i.width;
  for (let e = 0; e < i.lines.length; e++) {
    const s = i.lines[e];
    let r = 0, n = s.spacesIndex[r++], o = 0;
    const a = s.spacesIndex.length, c = (t - s.width) / a;
    for (let l = 0; l < s.charPositions.length; l++)
      l === n && (n = s.spacesIndex[r++], o += c), s.charPositions[l] += o;
  }
}
let os = 0;
class $c {
  constructor() {
    this.ALPHA = [["a", "z"], ["A", "Z"], " "], this.NUMERIC = [["0", "9"]], this.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "], this.ASCII = [[" ", "~"]], this.defaultOptions = {
      chars: this.ALPHANUMERIC,
      resolution: 1,
      padding: 4,
      skipKerning: !1
    };
  }
  /**
   * Get a font for the specified text and style.
   * @param text - The text to get the font for
   * @param style - The style to use
   */
  getFont(t, e) {
    let s = `${e.fontFamily}-bitmap`, r = !0;
    if (e._fill.fill && !e._stroke)
      s += e._fill.fill.styleKey, r = !1;
    else if (e._stroke || e.dropShadow) {
      let o = e.styleKey;
      o = o.substring(0, o.lastIndexOf("-")), s = `${o}-bitmap`, r = !1;
    }
    if (!pt.has(s)) {
      const o = new ln({
        style: e,
        overrideFill: r,
        overrideSize: !0,
        ...this.defaultOptions
      });
      os++, os > 50 && xt("BitmapText", `You have dynamically created ${os} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``), o.once("destroy", () => {
        os--, pt.remove(s);
      }), pt.set(
        s,
        o
      );
    }
    const n = pt.get(s);
    return n.ensureCharacters?.(t), n;
  }
  /**
   * Get the layout of a text for the specified style.
   * @param text - The text to get the layout for
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  getLayout(t, e, s = !0) {
    const r = this.getFont(t, e);
    return Dc([...t], e, r, s);
  }
  /**
   * Measure the text using the specified style.
   * @param text - The text to measure
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  measureText(t, e, s = !0) {
    return this.getLayout(t, e, s);
  }
  // eslint-disable-next-line max-len
  install(...t) {
    let e = t[0];
    typeof e == "string" && (e = {
      name: e,
      style: t[1],
      chars: t[2]?.chars,
      resolution: t[2]?.resolution,
      padding: t[2]?.padding,
      skipKerning: t[2]?.skipKerning
    }, ot(yt, "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})"));
    const s = e?.name;
    if (!s)
      throw new Error("[BitmapFontManager] Property `name` is required.");
    e = { ...this.defaultOptions, ...e };
    const r = e.style, n = r instanceof Ve ? r : new Ve(r), o = n._fill.fill !== null && n._fill.fill !== void 0, a = new ln({
      style: n,
      overrideFill: o,
      skipKerning: e.skipKerning,
      padding: e.padding,
      resolution: e.resolution,
      overrideSize: !1
    }), h = Ro(e.chars);
    return a.ensureCharacters(h.join("")), pt.set(`${s}-bitmap`, a), a.once("destroy", () => pt.remove(`${s}-bitmap`)), a;
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  uninstall(t) {
    const e = `${t}-bitmap`, s = pt.get(e);
    s && s.destroy();
  }
}
const cn = new $c();
class jo extends yo {
  constructor(t, e) {
    super();
    const { textures: s, data: r } = t;
    Object.keys(r.pages).forEach((n) => {
      const o = r.pages[parseInt(n, 10)], a = s[o.id];
      this.pages.push({ texture: a });
    }), Object.keys(r.chars).forEach((n) => {
      const o = r.chars[n], {
        frame: a,
        source: h
      } = s[o.page], c = new wt(
        o.x + a.x,
        o.y + a.y,
        o.width,
        o.height
      ), l = new tt({
        source: h,
        frame: c
      });
      this.chars[n] = {
        id: n.codePointAt(0),
        xOffset: o.xOffset,
        yOffset: o.yOffset,
        xAdvance: o.xAdvance,
        kerning: o.kerning ?? {},
        texture: l
      };
    }), this.baseRenderedFontSize = r.fontSize, this.baseMeasurementFontSize = r.fontSize, this.fontMetrics = {
      ascent: 0,
      descent: 0,
      fontSize: r.fontSize
    }, this.baseLineOffset = r.baseLineOffset, this.lineHeight = r.lineHeight, this.fontFamily = r.fontFamily, this.distanceField = r.distanceField ?? {
      type: "none",
      range: 0
    }, this.url = e;
  }
  /** Destroys the BitmapFont object. */
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { texture: e } = this.pages[t];
      e.destroy(!0);
    }
    this.pages = null;
  }
  /**
   * Generates a bitmap-font for the given style and character set
   * @param options - Setup options for font generation.
   * @returns Font generated by style options.
   * @example
   * import { BitmapFont, BitmapText } from 'pixi.js';
   *
   * BitmapFont.install('TitleFont', {
   *     fontFamily: 'Arial',
   *     fontSize: 12,
   *     strokeThickness: 2,
   *     fill: 'purple',
   * });
   *
   * const title = new BitmapText({ text: 'This is the title', fontFamily: 'TitleFont' });
   */
  static install(t) {
    cn.install(t);
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  static uninstall(t) {
    cn.uninstall(t);
  }
}
const li = {
  test(i) {
    return typeof i == "string" && i.startsWith("info face=");
  },
  parse(i) {
    const t = i.match(/^[a-z]+\s+.+$/gm), e = {
      info: [],
      common: [],
      page: [],
      char: [],
      chars: [],
      kerning: [],
      kernings: [],
      distanceField: []
    };
    for (const u in t) {
      const f = t[u].match(/^[a-z]+/gm)[0], d = t[u].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), g = {};
      for (const y in d) {
        const m = d[y].split("="), _ = m[0], M = m[1].replace(/"/gm, ""), S = parseFloat(M), C = isNaN(S) ? M : S;
        g[_] = C;
      }
      e[f].push(g);
    }
    const s = {
      chars: {},
      pages: [],
      lineHeight: 0,
      fontSize: 0,
      fontFamily: "",
      distanceField: null,
      baseLineOffset: 0
    }, [r] = e.info, [n] = e.common, [o] = e.distanceField ?? [];
    o && (s.distanceField = {
      range: parseInt(o.distanceRange, 10),
      type: o.fieldType
    }), s.fontSize = parseInt(r.size, 10), s.fontFamily = r.face, s.lineHeight = parseInt(n.lineHeight, 10);
    const a = e.page;
    for (let u = 0; u < a.length; u++)
      s.pages.push({
        id: parseInt(a[u].id, 10) || 0,
        file: a[u].file
      });
    const h = {};
    s.baseLineOffset = s.lineHeight - parseInt(n.base, 10);
    const c = e.char;
    for (let u = 0; u < c.length; u++) {
      const f = c[u], d = parseInt(f.id, 10);
      let g = f.letter ?? f.char ?? String.fromCharCode(d);
      g === "space" && (g = " "), h[d] = g, s.chars[g] = {
        id: d,
        // texture deets..
        page: parseInt(f.page, 10) || 0,
        x: parseInt(f.x, 10),
        y: parseInt(f.y, 10),
        width: parseInt(f.width, 10),
        height: parseInt(f.height, 10),
        xOffset: parseInt(f.xoffset, 10),
        yOffset: parseInt(f.yoffset, 10),
        xAdvance: parseInt(f.xadvance, 10),
        kerning: {}
      };
    }
    const l = e.kerning || [];
    for (let u = 0; u < l.length; u++) {
      const f = parseInt(l[u].first, 10), d = parseInt(l[u].second, 10), g = parseInt(l[u].amount, 10);
      s.chars[h[d]].kerning[h[f]] = g;
    }
    return s;
  }
}, un = {
  test(i) {
    const t = i;
    return typeof t != "string" && "getElementsByTagName" in t && t.getElementsByTagName("page").length && t.getElementsByTagName("info")[0].getAttribute("face") !== null;
  },
  parse(i) {
    const t = {
      chars: {},
      pages: [],
      lineHeight: 0,
      fontSize: 0,
      fontFamily: "",
      distanceField: null,
      baseLineOffset: 0
    }, e = i.getElementsByTagName("info")[0], s = i.getElementsByTagName("common")[0], r = i.getElementsByTagName("distanceField")[0];
    r && (t.distanceField = {
      type: r.getAttribute("fieldType"),
      range: parseInt(r.getAttribute("distanceRange"), 10)
    });
    const n = i.getElementsByTagName("page"), o = i.getElementsByTagName("char"), a = i.getElementsByTagName("kerning");
    t.fontSize = parseInt(e.getAttribute("size"), 10), t.fontFamily = e.getAttribute("face"), t.lineHeight = parseInt(s.getAttribute("lineHeight"), 10);
    for (let c = 0; c < n.length; c++)
      t.pages.push({
        id: parseInt(n[c].getAttribute("id"), 10) || 0,
        file: n[c].getAttribute("file")
      });
    const h = {};
    t.baseLineOffset = t.lineHeight - parseInt(s.getAttribute("base"), 10);
    for (let c = 0; c < o.length; c++) {
      const l = o[c], u = parseInt(l.getAttribute("id"), 10);
      let f = l.getAttribute("letter") ?? l.getAttribute("char") ?? String.fromCharCode(u);
      f === "space" && (f = " "), h[u] = f, t.chars[f] = {
        id: u,
        // texture deets..
        page: parseInt(l.getAttribute("page"), 10) || 0,
        x: parseInt(l.getAttribute("x"), 10),
        y: parseInt(l.getAttribute("y"), 10),
        width: parseInt(l.getAttribute("width"), 10),
        height: parseInt(l.getAttribute("height"), 10),
        // render deets..
        xOffset: parseInt(l.getAttribute("xoffset"), 10),
        yOffset: parseInt(l.getAttribute("yoffset"), 10),
        // + baseLineOffset,
        xAdvance: parseInt(l.getAttribute("xadvance"), 10),
        kerning: {}
      };
    }
    for (let c = 0; c < a.length; c++) {
      const l = parseInt(a[c].getAttribute("first"), 10), u = parseInt(a[c].getAttribute("second"), 10), f = parseInt(a[c].getAttribute("amount"), 10);
      t.chars[h[u]].kerning[h[l]] = f;
    }
    return t;
  }
}, dn = {
  test(i) {
    return typeof i == "string" && i.includes("<font>") ? un.test(mt.get().parseXML(i)) : !1;
  },
  parse(i) {
    return un.parse(mt.get().parseXML(i));
  }
}, Uc = [".xml", ".fnt"], Hc = {
  extension: {
    type: U.CacheParser,
    name: "cacheBitmapFont"
  },
  test: (i) => i instanceof jo,
  getCacheableAssets(i, t) {
    const e = {};
    return i.forEach((s) => {
      e[s] = t, e[`${s}-bitmap`] = t;
    }), e[`${t.fontFamily}-bitmap`] = t, e;
  }
}, Yc = {
  extension: {
    type: U.LoadParser,
    priority: qt.Normal
  },
  name: "loadBitmapFont",
  test(i) {
    return Uc.includes(Nt.extname(i).toLowerCase());
  },
  async testParse(i) {
    return li.test(i) || dn.test(i);
  },
  async parse(i, t, e) {
    const s = li.test(i) ? li.parse(i) : dn.parse(i), { src: r } = t, { pages: n } = s, o = [], a = s.distanceField ? {
      scaleMode: "linear",
      alphaMode: "premultiply-alpha-on-upload",
      autoGenerateMipmaps: !1,
      resolution: 1
    } : {};
    for (let u = 0; u < n.length; ++u) {
      const f = n[u].file;
      let d = Nt.join(Nt.dirname(r), f);
      d = vi(d, r), o.push({
        src: d,
        data: a
      });
    }
    const h = await e.load(o), c = o.map((u) => h[u.src]);
    return new jo({
      data: s,
      textures: c
    }, r);
  },
  async load(i, t) {
    return await (await mt.get().fetch(i)).text();
  },
  async unload(i, t, e) {
    await Promise.all(i.pages.map((s) => e.unload(s.texture.source._sourceOrigin))), i.destroy();
  }
};
class Vc {
  /**
   * @param loader
   * @param verbose - should the loader log to the console
   */
  constructor(t, e = !1) {
    this._loader = t, this._assetList = [], this._isLoading = !1, this._maxConcurrent = 1, this.verbose = e;
  }
  /**
   * Adds an array of assets to load.
   * @param assetUrls - assets to load
   */
  add(t) {
    t.forEach((e) => {
      this._assetList.push(e);
    }), this.verbose && console.log("[BackgroundLoader] assets: ", this._assetList), this._isActive && !this._isLoading && this._next();
  }
  /**
   * Loads the next set of assets. Will try to load as many assets as it can at the same time.
   *
   * The max assets it will try to load at one time will be 4.
   */
  async _next() {
    if (this._assetList.length && this._isActive) {
      this._isLoading = !0;
      const t = [], e = Math.min(this._assetList.length, this._maxConcurrent);
      for (let s = 0; s < e; s++)
        t.push(this._assetList.pop());
      await this._loader.load(t), this._isLoading = !1, this._next();
    }
  }
  /**
   * Activate/Deactivate the loading. If set to true then it will immediately continue to load the next asset.
   * @returns whether the class is active
   */
  get active() {
    return this._isActive;
  }
  set active(t) {
    this._isActive !== t && (this._isActive = t, t && !this._isLoading && this._next());
  }
}
const Xc = {
  extension: {
    type: U.CacheParser,
    name: "cacheTextureArray"
  },
  test: (i) => Array.isArray(i) && i.every((t) => t instanceof tt),
  getCacheableAssets: (i, t) => {
    const e = {};
    return i.forEach((s) => {
      t.forEach((r, n) => {
        e[s + (n === 0 ? "" : n + 1)] = r;
      });
    }), e;
  }
};
async function Go(i) {
  if ("Image" in globalThis)
    return new Promise((t) => {
      const e = new Image();
      e.onload = () => {
        t(!0);
      }, e.onerror = () => {
        t(!1);
      }, e.src = i;
    });
  if ("createImageBitmap" in globalThis && "fetch" in globalThis) {
    try {
      const t = await (await fetch(i)).blob();
      await createImageBitmap(t);
    } catch {
      return !1;
    }
    return !0;
  }
  return !1;
}
const qc = {
  extension: {
    type: U.DetectionParser,
    priority: 1
  },
  test: async () => Go(
    // eslint-disable-next-line max-len
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  ),
  add: async (i) => [...i, "avif"],
  remove: async (i) => i.filter((t) => t !== "avif")
}, fn = ["png", "jpg", "jpeg"], Zc = {
  extension: {
    type: U.DetectionParser,
    priority: -1
  },
  test: () => Promise.resolve(!0),
  add: async (i) => [...i, ...fn],
  remove: async (i) => i.filter((t) => !fn.includes(t))
}, Kc = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function Ki(i) {
  return Kc ? !1 : document.createElement("video").canPlayType(i) !== "";
}
const Jc = {
  extension: {
    type: U.DetectionParser,
    priority: 0
  },
  test: async () => Ki("video/mp4"),
  add: async (i) => [...i, "mp4", "m4v"],
  remove: async (i) => i.filter((t) => t !== "mp4" && t !== "m4v")
}, Qc = {
  extension: {
    type: U.DetectionParser,
    priority: 0
  },
  test: async () => Ki("video/ogg"),
  add: async (i) => [...i, "ogv"],
  remove: async (i) => i.filter((t) => t !== "ogv")
}, tu = {
  extension: {
    type: U.DetectionParser,
    priority: 0
  },
  test: async () => Ki("video/webm"),
  add: async (i) => [...i, "webm"],
  remove: async (i) => i.filter((t) => t !== "webm")
}, eu = {
  extension: {
    type: U.DetectionParser,
    priority: 0
  },
  test: async () => Go(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ),
  add: async (i) => [...i, "webp"],
  remove: async (i) => i.filter((t) => t !== "webp")
};
class su {
  constructor() {
    this._parsers = [], this._parsersValidated = !1, this.parsers = new Proxy(this._parsers, {
      set: (t, e, s) => (this._parsersValidated = !1, t[e] = s, !0)
    }), this.promiseCache = {};
  }
  /** function used for testing */
  reset() {
    this._parsersValidated = !1, this.promiseCache = {};
  }
  /**
   * Used internally to generate a promise for the asset to be loaded.
   * @param url - The URL to be loaded
   * @param data - any custom additional information relevant to the asset being loaded
   * @returns - a promise that will resolve to an Asset for example a Texture of a JSON object
   */
  _getLoadPromiseAndParser(t, e) {
    const s = {
      promise: null,
      parser: null
    };
    return s.promise = (async () => {
      let r = null, n = null;
      if (e.loadParser && (n = this._parserHash[e.loadParser], n || xt(`[Assets] specified load parser "${e.loadParser}" not found while loading ${t}`)), !n) {
        for (let o = 0; o < this.parsers.length; o++) {
          const a = this.parsers[o];
          if (a.load && a.test?.(t, e, this)) {
            n = a;
            break;
          }
        }
        if (!n)
          return xt(`[Assets] ${t} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`), null;
      }
      r = await n.load(t, e, this), s.parser = n;
      for (let o = 0; o < this.parsers.length; o++) {
        const a = this.parsers[o];
        a.parse && a.parse && await a.testParse?.(r, e, this) && (r = await a.parse(r, e, this) || r, s.parser = a);
      }
      return r;
    })(), s;
  }
  async load(t, e) {
    this._parsersValidated || this._validateParsers();
    let s = 0;
    const r = {}, n = _s(t), o = Wt(t, (c) => ({
      alias: [c],
      src: c,
      data: {}
    })), a = o.length, h = o.map(async (c) => {
      const l = Nt.toAbsolute(c.src);
      if (!r[c.src])
        try {
          this.promiseCache[l] || (this.promiseCache[l] = this._getLoadPromiseAndParser(l, c)), r[c.src] = await this.promiseCache[l].promise, e && e(++s / a);
        } catch (u) {
          throw delete this.promiseCache[l], delete r[c.src], new Error(`[Loader.load] Failed to load ${l}.
${u}`);
        }
    });
    return await Promise.all(h), n ? r[o[0].src] : r;
  }
  /**
   * Unloads one or more assets. Any unloaded assets will be destroyed, freeing up memory for your app.
   * The parser that created the asset, will be the one that unloads it.
   * @example
   * // Single asset:
   * const asset = await Loader.load('cool.png');
   *
   * await Loader.unload('cool.png');
   *
   * console.log(asset.destroyed); // true
   * @param assetsToUnloadIn - urls that you want to unload, or a single one!
   */
  async unload(t) {
    const s = Wt(t, (r) => ({
      alias: [r],
      src: r
    })).map(async (r) => {
      const n = Nt.toAbsolute(r.src), o = this.promiseCache[n];
      if (o) {
        const a = await o.promise;
        delete this.promiseCache[n], await o.parser?.unload?.(a, r, this);
      }
    });
    await Promise.all(s);
  }
  /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
  _validateParsers() {
    this._parsersValidated = !0, this._parserHash = this._parsers.filter((t) => t.name).reduce((t, e) => (e.name ? t[e.name] && xt(`[Assets] loadParser name conflict "${e.name}"`) : xt("[Assets] loadParser should have a name"), { ...t, [e.name]: e }), {});
  }
}
function Ae(i, t) {
  if (Array.isArray(t)) {
    for (const e of t)
      if (i.startsWith(`data:${e}`))
        return !0;
    return !1;
  }
  return i.startsWith(`data:${t}`);
}
function Ce(i, t) {
  const e = i.split("?")[0], s = Nt.extname(e).toLowerCase();
  return Array.isArray(t) ? t.includes(s) : s === t;
}
const iu = ".json", ru = "application/json", nu = {
  extension: {
    type: U.LoadParser,
    priority: qt.Low
  },
  name: "loadJson",
  test(i) {
    return Ae(i, ru) || Ce(i, iu);
  },
  async load(i) {
    return await (await mt.get().fetch(i)).json();
  }
}, ou = ".txt", au = "text/plain", hu = {
  name: "loadTxt",
  extension: {
    type: U.LoadParser,
    priority: qt.Low,
    name: "loadTxt"
  },
  test(i) {
    return Ae(i, au) || Ce(i, ou);
  },
  async load(i) {
    return await (await mt.get().fetch(i)).text();
  }
}, lu = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
], cu = [".ttf", ".otf", ".woff", ".woff2"], uu = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
], du = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function fu(i) {
  const t = Nt.extname(i), r = Nt.basename(i, t).replace(/(-|_)/g, " ").toLowerCase().split(" ").map((a) => a.charAt(0).toUpperCase() + a.slice(1));
  let n = r.length > 0;
  for (const a of r)
    if (!a.match(du)) {
      n = !1;
      break;
    }
  let o = r.join(" ");
  return n || (o = `"${o.replace(/[\\"]/g, "\\$&")}"`), o;
}
const pu = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function mu(i) {
  return pu.test(i) ? i : encodeURI(i);
}
const gu = {
  extension: {
    type: U.LoadParser,
    priority: qt.Low
  },
  name: "loadWebFont",
  test(i) {
    return Ae(i, uu) || Ce(i, cu);
  },
  async load(i, t) {
    const e = mt.get().getFontFaceSet();
    if (e) {
      const s = [], r = t.data?.family ?? fu(i), n = t.data?.weights?.filter((a) => lu.includes(a)) ?? ["normal"], o = t.data ?? {};
      for (let a = 0; a < n.length; a++) {
        const h = n[a], c = new FontFace(r, `url(${mu(i)})`, {
          ...o,
          weight: h
        });
        await c.load(), e.add(c), s.push(c);
      }
      return pt.set(`${r}-and-url`, {
        url: i,
        fontFaces: s
      }), s.length === 1 ? s[0] : s;
    }
    return xt("[loadWebFont] FontFace API is not supported. Skipping loading font"), null;
  },
  unload(i) {
    (Array.isArray(i) ? i : [i]).forEach((t) => {
      pt.remove(`${t.family}-and-url`), mt.get().getFontFaceSet().delete(t);
    });
  }
};
function Ji(i, t = 1) {
  const e = Me.RETINA_PREFIX?.exec(i);
  return e ? parseFloat(e[1]) : t;
}
function Qi(i, t, e) {
  i.label = e, i._sourceOrigin = e;
  const s = new tt({
    source: i,
    label: e
  }), r = () => {
    delete t.promiseCache[e], pt.has(e) && pt.remove(e);
  };
  return s.source.once("destroy", () => {
    t.promiseCache[e] && (xt("[Assets] A TextureSource managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the TextureSource."), r());
  }), s.once("destroy", () => {
    i.destroyed || (xt("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), r());
  }), s;
}
const yu = ".svg", xu = "image/svg+xml", _u = {
  extension: {
    type: U.LoadParser,
    priority: qt.Low,
    name: "loadSVG"
  },
  name: "loadSVG",
  config: {
    crossOrigin: "anonymous",
    parseAsGraphicsContext: !1
  },
  test(i) {
    return Ae(i, xu) || Ce(i, yu);
  },
  async load(i, t, e) {
    return t.data.parseAsGraphicsContext ?? this.config.parseAsGraphicsContext ? wu(i) : bu(i, t, e, this.config.crossOrigin);
  },
  unload(i) {
    i.destroy(!0);
  }
};
async function bu(i, t, e, s) {
  const n = await (await mt.get().fetch(i)).blob(), o = URL.createObjectURL(n), a = new Image();
  a.src = o, a.crossOrigin = s, await a.decode(), URL.revokeObjectURL(o);
  const h = document.createElement("canvas"), c = h.getContext("2d"), l = t.data?.resolution || Ji(i), u = t.data?.width ?? a.width, f = t.data?.height ?? a.height;
  h.width = u * l, h.height = f * l, c.drawImage(a, 0, 0, u * l, f * l);
  const { parseAsGraphicsContext: d, ...g } = t.data, y = new ve({
    resource: h,
    alphaMode: "premultiply-alpha-on-upload",
    resolution: l,
    ...g
  });
  return Qi(y, e, i);
}
async function wu(i) {
  const e = await (await mt.get().fetch(i)).text(), s = new he();
  return s.svg(e), s;
}
const vu = `(function () {
    'use strict';

    const WHITE_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
    async function checkImageBitmap() {
      try {
        if (typeof createImageBitmap !== "function")
          return false;
        const response = await fetch(WHITE_PNG);
        const imageBlob = await response.blob();
        const imageBitmap = await createImageBitmap(imageBlob);
        return imageBitmap.width === 1 && imageBitmap.height === 1;
      } catch (_e) {
        return false;
      }
    }
    void checkImageBitmap().then((result) => {
      self.postMessage(result);
    });

})();
`;
let ge = null, Ni = class {
  constructor() {
    ge || (ge = URL.createObjectURL(new Blob([vu], { type: "application/javascript" }))), this.worker = new Worker(ge);
  }
};
Ni.revokeObjectURL = function() {
  ge && (URL.revokeObjectURL(ge), ge = null);
};
const Mu = `(function () {
    'use strict';

    async function loadImageBitmap(url, alphaMode) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`[WorkerManager.loadImageBitmap] Failed to fetch \${url}: \${response.status} \${response.statusText}\`);
      }
      const imageBlob = await response.blob();
      return alphaMode === "premultiplied-alpha" ? createImageBitmap(imageBlob, { premultiplyAlpha: "none" }) : createImageBitmap(imageBlob);
    }
    self.onmessage = async (event) => {
      try {
        const imageBitmap = await loadImageBitmap(event.data.data[0], event.data.data[1]);
        self.postMessage({
          data: imageBitmap,
          uuid: event.data.uuid,
          id: event.data.id
        }, [imageBitmap]);
      } catch (e) {
        self.postMessage({
          error: e,
          uuid: event.data.uuid,
          id: event.data.id
        });
      }
    };

})();
`;
let ye = null;
class Wo {
  constructor() {
    ye || (ye = URL.createObjectURL(new Blob([Mu], { type: "application/javascript" }))), this.worker = new Worker(ye);
  }
}
Wo.revokeObjectURL = function() {
  ye && (URL.revokeObjectURL(ye), ye = null);
};
let pn = 0, ci;
class Su {
  constructor() {
    this._initialized = !1, this._createdWorkers = 0, this._workerPool = [], this._queue = [], this._resolveHash = {};
  }
  isImageBitmapSupported() {
    return this._isImageBitmapSupported !== void 0 ? this._isImageBitmapSupported : (this._isImageBitmapSupported = new Promise((t) => {
      const { worker: e } = new Ni();
      e.addEventListener("message", (s) => {
        e.terminate(), Ni.revokeObjectURL(), t(s.data);
      });
    }), this._isImageBitmapSupported);
  }
  loadImageBitmap(t, e) {
    return this._run("loadImageBitmap", [t, e?.data?.alphaMode]);
  }
  async _initWorkers() {
    this._initialized || (this._initialized = !0);
  }
  _getWorker() {
    ci === void 0 && (ci = navigator.hardwareConcurrency || 4);
    let t = this._workerPool.pop();
    return !t && this._createdWorkers < ci && (this._createdWorkers++, t = new Wo().worker, t.addEventListener("message", (e) => {
      this._complete(e.data), this._returnWorker(e.target), this._next();
    })), t;
  }
  _returnWorker(t) {
    this._workerPool.push(t);
  }
  _complete(t) {
    t.error !== void 0 ? this._resolveHash[t.uuid].reject(t.error) : this._resolveHash[t.uuid].resolve(t.data), this._resolveHash[t.uuid] = null;
  }
  async _run(t, e) {
    await this._initWorkers();
    const s = new Promise((r, n) => {
      this._queue.push({ id: t, arguments: e, resolve: r, reject: n });
    });
    return this._next(), s;
  }
  _next() {
    if (!this._queue.length)
      return;
    const t = this._getWorker();
    if (!t)
      return;
    const e = this._queue.pop(), s = e.id;
    this._resolveHash[pn] = { resolve: e.resolve, reject: e.reject }, t.postMessage({
      data: e.arguments,
      uuid: pn++,
      id: s
    });
  }
}
const mn = new Su(), Au = [".jpeg", ".jpg", ".png", ".webp", ".avif"], Cu = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function Tu(i, t) {
  const e = await mt.get().fetch(i);
  if (!e.ok)
    throw new Error(`[loadImageBitmap] Failed to fetch ${i}: ${e.status} ${e.statusText}`);
  const s = await e.blob();
  return t?.data?.alphaMode === "premultiplied-alpha" ? createImageBitmap(s, { premultiplyAlpha: "none" }) : createImageBitmap(s);
}
const $o = {
  name: "loadTextures",
  extension: {
    type: U.LoadParser,
    priority: qt.High,
    name: "loadTextures"
  },
  config: {
    preferWorkers: !0,
    preferCreateImageBitmap: !0,
    crossOrigin: "anonymous"
  },
  test(i) {
    return Ae(i, Cu) || Ce(i, Au);
  },
  async load(i, t, e) {
    let s = null;
    globalThis.createImageBitmap && this.config.preferCreateImageBitmap ? this.config.preferWorkers && await mn.isImageBitmapSupported() ? s = await mn.loadImageBitmap(i, t) : s = await Tu(i, t) : s = await new Promise((n) => {
      s = new Image(), s.crossOrigin = this.config.crossOrigin, s.src = i, s.complete ? n(s) : s.onload = () => {
        n(s);
      };
    });
    const r = new ve({
      resource: s,
      alphaMode: "premultiply-alpha-on-upload",
      resolution: t.data?.resolution || Ji(i),
      ...t.data
    });
    return Qi(r, e, i);
  },
  unload(i) {
    i.destroy(!0);
  }
}, Uo = [".mp4", ".m4v", ".webm", ".ogg", ".ogv", ".h264", ".avi", ".mov"], Pu = Uo.map((i) => `video/${i.substring(1)}`);
function Iu(i, t, e) {
  e === void 0 && !t.startsWith("data:") ? i.crossOrigin = Eu(t) : e !== !1 && (i.crossOrigin = typeof e == "string" ? e : "anonymous");
}
function ku(i) {
  return new Promise((t, e) => {
    i.addEventListener("canplaythrough", s), i.addEventListener("error", r), i.load();
    function s() {
      n(), t();
    }
    function r(o) {
      n(), e(o);
    }
    function n() {
      i.removeEventListener("canplaythrough", s), i.removeEventListener("error", r);
    }
  });
}
function Eu(i, t = globalThis.location) {
  if (i.startsWith("data:"))
    return "";
  t || (t = globalThis.location);
  const e = new URL(i, document.baseURI);
  return e.hostname !== t.hostname || e.port !== t.port || e.protocol !== t.protocol ? "anonymous" : "";
}
const Lu = {
  name: "loadVideo",
  extension: {
    type: U.LoadParser,
    name: "loadVideo"
  },
  test(i) {
    const t = Ae(i, Pu), e = Ce(i, Uo);
    return t || e;
  },
  async load(i, t, e) {
    const s = {
      ...us.defaultOptions,
      resolution: t.data?.resolution || Ji(i),
      alphaMode: t.data?.alphaMode || await qn(),
      ...t.data
    }, r = document.createElement("video"), n = {
      preload: s.autoLoad !== !1 ? "auto" : void 0,
      "webkit-playsinline": s.playsinline !== !1 ? "" : void 0,
      playsinline: s.playsinline !== !1 ? "" : void 0,
      muted: s.muted === !0 ? "" : void 0,
      loop: s.loop === !0 ? "" : void 0,
      autoplay: s.autoPlay !== !1 ? "" : void 0
    };
    Object.keys(n).forEach((h) => {
      const c = n[h];
      c !== void 0 && r.setAttribute(h, c);
    }), s.muted === !0 && (r.muted = !0), Iu(r, i, s.crossorigin);
    const o = document.createElement("source");
    let a;
    if (i.startsWith("data:"))
      a = i.slice(5, i.indexOf(";"));
    else if (!i.startsWith("blob:")) {
      const h = i.split("?")[0].slice(i.lastIndexOf(".") + 1).toLowerCase();
      a = us.MIME_TYPES[h] || `video/${h}`;
    }
    return o.src = i, a && (o.type = a), new Promise((h) => {
      const c = async () => {
        const l = new us({ ...s, resource: r });
        r.removeEventListener("canplay", c), t.data.preload && await ku(r), h(Qi(l, e, i));
      };
      r.addEventListener("canplay", c), r.appendChild(o);
    });
  },
  unload(i) {
    i.destroy(!0);
  }
}, Ho = {
  extension: {
    type: U.ResolveParser,
    name: "resolveTexture"
  },
  test: $o.test,
  parse: (i) => ({
    resolution: parseFloat(Me.RETINA_PREFIX.exec(i)?.[1] ?? "1"),
    format: i.split(".").pop(),
    src: i
  })
}, Bu = {
  extension: {
    type: U.ResolveParser,
    priority: -2,
    name: "resolveJson"
  },
  test: (i) => Me.RETINA_PREFIX.test(i) && i.endsWith(".json"),
  parse: Ho.parse
};
class Nu {
  constructor() {
    this._detections = [], this._initialized = !1, this.resolver = new Me(), this.loader = new su(), this.cache = pt, this._backgroundLoader = new Vc(this.loader), this._backgroundLoader.active = !0, this.reset();
  }
  /**
   * Best practice is to call this function before any loading commences
   * Initiating is the best time to add any customization to the way things are loaded.
   *
   * you do not need to call this for the Assets class to work, only if you want to set any initial properties
   * @param options - options to initialize the Assets manager with
   */
  async init(t = {}) {
    if (this._initialized) {
      xt("[Assets]AssetManager already initialized, did you load before calling this Assets.init()?");
      return;
    }
    if (this._initialized = !0, t.defaultSearchParams && this.resolver.setDefaultSearchParams(t.defaultSearchParams), t.basePath && (this.resolver.basePath = t.basePath), t.bundleIdentifier && this.resolver.setBundleIdentifier(t.bundleIdentifier), t.manifest) {
      let n = t.manifest;
      typeof n == "string" && (n = await this.load(n)), this.resolver.addManifest(n);
    }
    const e = t.texturePreference?.resolution ?? 1, s = typeof e == "number" ? [e] : e, r = await this._detectFormats({
      preferredFormats: t.texturePreference?.format,
      skipDetections: t.skipDetections,
      detections: this._detections
    });
    this.resolver.prefer({
      params: {
        format: r,
        resolution: s
      }
    }), t.preferences && this.setPreferences(t.preferences);
  }
  /**
   * Allows you to specify how to resolve any assets load requests.
   * There are a few ways to add things here as shown below:
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Simple
   * Assets.add({alias: 'bunnyBooBoo', src: 'bunny.png'});
   * const bunny = await Assets.load('bunnyBooBoo');
   *
   * // Multiple keys:
   * Assets.add({alias: ['burger', 'chicken'], src: 'bunny.png'});
   *
   * const bunny = await Assets.load('burger');
   * const bunny2 = await Assets.load('chicken');
   *
   * // passing options to to the object
   * Assets.add({
   *     alias: 'bunnyBooBooSmooth',
   *     src: 'bunny.{png,webp}',
   *     data: { scaleMode: SCALE_MODES.NEAREST }, // Base texture options
   * });
   *
   * // Multiple assets
   *
   * // The following all do the same thing:
   *
   * Assets.add({alias: 'bunnyBooBoo', src: 'bunny.{png,webp}'});
   *
   * Assets.add({
   *     alias: 'bunnyBooBoo',
   *     src: [
   *         'bunny.png',
   *         'bunny.webp',
   *    ],
   * });
   *
   * const bunny = await Assets.load('bunnyBooBoo'); // Will try to load WebP if available
   * @param assets - the unresolved assets to add to the resolver
   */
  add(t) {
    this.resolver.add(t);
  }
  async load(t, e) {
    this._initialized || await this.init();
    const s = _s(t), r = Wt(t).map((a) => {
      if (typeof a != "string") {
        const h = this.resolver.getAlias(a);
        return h.some((c) => !this.resolver.hasKey(c)) && this.add(a), Array.isArray(h) ? h[0] : h;
      }
      return this.resolver.hasKey(a) || this.add({ alias: a, src: a }), a;
    }), n = this.resolver.resolve(r), o = await this._mapLoadToResolve(n, e);
    return s ? o[r[0]] : o;
  }
  /**
   * This adds a bundle of assets in one go so that you can load them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.addBundle('animals', [
   *  { alias: 'bunny', src: 'bunny.png' },
   *  { alias: 'chicken', src: 'chicken.png' },
   *  { alias: 'thumper', src: 'thumper.png' },
   * ]);
   * // or
   * Assets.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const assets = await Assets.loadBundle('animals');
   * @param bundleId - the id of the bundle to add
   * @param assets - a record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(t, e) {
    this.resolver.addBundle(t, e);
  }
  /**
   * Bundles are a way to load multiple assets at once.
   * If a manifest has been provided to the init function then you can load a bundle, or bundles.
   * you can also add bundles via `addBundle`
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * await Assets.init({ manifest });
   *
   * // Load a bundle...
   * loadScreenAssets = await Assets.loadBundle('load-screen');
   * // Load another bundle...
   * gameScreenAssets = await Assets.loadBundle('game-screen');
   * @param bundleIds - the bundle id or ids to load
   * @param onProgress - Optional function that is called when progress on asset loading is made.
   * The function is passed a single parameter, `progress`, which represents the percentage (0.0 - 1.0)
   * of the assets loaded. Do not use this function to detect when assets are complete and available,
   * instead use the Promise returned by this function.
   * @returns all the bundles assets or a hash of assets for each bundle specified
   */
  async loadBundle(t, e) {
    this._initialized || await this.init();
    let s = !1;
    typeof t == "string" && (s = !0, t = [t]);
    const r = this.resolver.resolveBundle(t), n = {}, o = Object.keys(r);
    let a = 0, h = 0;
    const c = () => {
      e?.(++a / h);
    }, l = o.map((u) => {
      const f = r[u];
      return h += Object.keys(f).length, this._mapLoadToResolve(f, c).then((d) => {
        n[u] = d;
      });
    });
    return await Promise.all(l), s ? n[t[0]] : n;
  }
  /**
   * Initiate a background load of some assets. It will passively begin to load these assets in the background.
   * So when you actually come to loading them you will get a promise that resolves to the loaded assets immediately
   *
   * An example of this might be that you would background load game assets after your initial load.
   * then when you got to actually load your game screen assets when a player goes to the game - the loading
   * would already have stared or may even be complete, saving you having to show an interim load bar.
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.backgroundLoad('bunny.png');
   *
   * // later on in your app...
   * await Assets.loadBundle('bunny.png'); // Will resolve quicker as loading may have completed!
   * @param urls - the url / urls you want to background load
   */
  async backgroundLoad(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolve(t);
    this._backgroundLoader.add(Object.values(e));
  }
  /**
   * Initiate a background of a bundle, works exactly like backgroundLoad but for bundles.
   * this can only be used if the loader has been initiated with a manifest
   * @example
   * import { Assets } from 'pixi.js';
   *
   * await Assets.init({
   *     manifest: {
   *         bundles: [
   *             {
   *                 name: 'load-screen',
   *                 assets: [...],
   *             },
   *             ...
   *         ],
   *     },
   * });
   *
   * Assets.backgroundLoadBundle('load-screen');
   *
   * // Later on in your app...
   * await Assets.loadBundle('load-screen'); // Will resolve quicker as loading may have completed!
   * @param bundleIds - the bundleId / bundleIds you want to background load
   */
  async backgroundLoadBundle(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolveBundle(t);
    Object.values(e).forEach((s) => {
      this._backgroundLoader.add(Object.values(s));
    });
  }
  /**
   * Only intended for development purposes.
   * This will wipe the resolver and caches.
   * You will need to reinitialize the Asset
   */
  reset() {
    this.resolver.reset(), this.loader.reset(), this.cache.reset(), this._initialized = !1;
  }
  get(t) {
    if (typeof t == "string")
      return pt.get(t);
    const e = {};
    for (let s = 0; s < t.length; s++)
      e[s] = pt.get(t[s]);
    return e;
  }
  /**
   * helper function to map resolved assets back to loaded assets
   * @param resolveResults - the resolve results from the resolver
   * @param onProgress - the progress callback
   */
  async _mapLoadToResolve(t, e) {
    const s = [...new Set(Object.values(t))];
    this._backgroundLoader.active = !1;
    const r = await this.loader.load(s, e);
    this._backgroundLoader.active = !0;
    const n = {};
    return s.forEach((o) => {
      const a = r[o.src], h = [o.src];
      o.alias && h.push(...o.alias), h.forEach((c) => {
        n[c] = a;
      }), pt.set(h, a);
    }), n;
  }
  /**
   * Unload an asset or assets. As the Assets class is responsible for creating the assets via the `load` function
   * this will make sure to destroy any assets and release them from memory.
   * Once unloaded, you will need to load the asset again.
   *
   * Use this to help manage assets if you find that you have a large app and you want to free up memory.
   *
   * - it's up to you as the developer to make sure that textures are not actively being used when you unload them,
   * Pixi won't break but you will end up with missing assets. Not a good look for the user!
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Load a URL:
   * const myImageTexture = await Assets.load('http://some.url.com/image.png'); // => returns a texture
   *
   * await Assets.unload('http://some.url.com/image.png')
   *
   * // myImageTexture will be destroyed now.
   *
   * // Unload multiple assets:
   * const textures = await Assets.unload(['thumper', 'chicko']);
   * @param urls - the urls to unload
   */
  async unload(t) {
    this._initialized || await this.init();
    const e = Wt(t).map((r) => typeof r != "string" ? r.src : r), s = this.resolver.resolve(e);
    await this._unloadFromResolved(s);
  }
  /**
   * Bundles are a way to manage multiple assets at once.
   * this will unload all files in a bundle.
   *
   * once a bundle has been unloaded, you need to load it again to have access to the assets.
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.addBundle({
   *     'thumper': 'http://some.url.com/thumper.png',
   * })
   *
   * const assets = await Assets.loadBundle('thumper');
   *
   * // Now to unload...
   *
   * await Assets.unloadBundle('thumper');
   *
   * // All assets in the assets object will now have been destroyed and purged from the cache
   * @param bundleIds - the bundle id or ids to unload
   */
  async unloadBundle(t) {
    this._initialized || await this.init(), t = Wt(t);
    const e = this.resolver.resolveBundle(t), s = Object.keys(e).map((r) => this._unloadFromResolved(e[r]));
    await Promise.all(s);
  }
  async _unloadFromResolved(t) {
    const e = Object.values(t);
    e.forEach((s) => {
      pt.remove(s.src);
    }), await this.loader.unload(e);
  }
  /**
   * Detects the supported formats for the browser, and returns an array of supported formats, respecting
   * the users preferred formats order.
   * @param options - the options to use when detecting formats
   * @param options.preferredFormats - the preferred formats to use
   * @param options.skipDetections - if we should skip the detections altogether
   * @param options.detections - the detections to use
   * @returns - the detected formats
   */
  async _detectFormats(t) {
    let e = [];
    t.preferredFormats && (e = Array.isArray(t.preferredFormats) ? t.preferredFormats : [t.preferredFormats]);
    for (const s of t.detections)
      t.skipDetections || await s.test() ? e = await s.add(e) : t.skipDetections || (e = await s.remove(e));
    return e = e.filter((s, r) => e.indexOf(s) === r), e;
  }
  /** All the detection parsers currently added to the Assets class. */
  get detections() {
    return this._detections;
  }
  /**
   * General setter for preferences. This is a helper function to set preferences on all parsers.
   * @param preferences - the preferences to set
   */
  setPreferences(t) {
    this.loader.parsers.forEach((e) => {
      e.config && Object.keys(e.config).filter((s) => s in t).forEach((s) => {
        e.config[s] = t[s];
      });
    });
  }
}
const me = new Nu();
bt.handleByList(U.LoadParser, me.loader.parsers).handleByList(U.ResolveParser, me.resolver.parsers).handleByList(U.CacheParser, me.cache.parsers).handleByList(U.DetectionParser, me.detections);
bt.add(
  Xc,
  Zc,
  qc,
  eu,
  Jc,
  Qc,
  tu,
  nu,
  hu,
  gu,
  _u,
  $o,
  Lu,
  Yc,
  Hc,
  Ho,
  Bu
);
const gn = {
  loader: U.LoadParser,
  resolver: U.ResolveParser,
  cache: U.CacheParser,
  detection: U.DetectionParser
};
bt.handle(U.Asset, (i) => {
  const t = i.ref;
  Object.entries(gn).filter(([e]) => !!t[e]).forEach(([e, s]) => bt.add(Object.assign(
    t[e],
    // Allow the function to optionally define it's own
    // ExtensionMetadata, the use cases here is priority for LoaderParsers
    { extension: t[e].extension ?? s }
  )));
}, (i) => {
  const t = i.ref;
  Object.keys(gn).filter((e) => !!t[e]).forEach((e) => bt.remove(t[e]));
});
var Yo = `in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`;
const Vo = {
  5: [0.153388, 0.221461, 0.250301],
  7: [0.071303, 0.131514, 0.189879, 0.214607],
  9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
  11: [93e-4, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
  13: [2406e-6, 9255e-6, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641],
  15: [489e-6, 2403e-6, 9246e-6, 0.02784, 0.065602, 0.120999, 0.174697, 0.197448]
}, Fu = [
  "in vec2 vBlurTexCoords[%size%];",
  "uniform sampler2D uTexture;",
  "out vec4 finalColor;",
  "void main(void)",
  "{",
  "    finalColor = vec4(0.0);",
  "    %blur%",
  "}"
].join(`
`);
function Ou(i) {
  const t = Vo[i], e = t.length;
  let s = Fu, r = "";
  const n = "finalColor += texture(uTexture, vBlurTexCoords[%index%]) * %value%;";
  let o;
  for (let a = 0; a < i; a++) {
    let h = n.replace("%index%", a.toString());
    o = a, a >= e && (o = i - a - 1), h = h.replace("%value%", t[o].toString()), r += h, r += `
`;
  }
  return s = s.replace("%blur%", r), s = s.replace("%size%", i.toString()), s;
}
const Ru = `
    in vec2 aPosition;

    uniform float uStrength;

    out vec2 vBlurTexCoords[%size%];

    uniform vec4 uInputSize;
    uniform vec4 uOutputFrame;
    uniform vec4 uOutputTexture;

    vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

    vec2 filterTextureCoord( void )
    {
        return aPosition * (uOutputFrame.zw * uInputSize.zw);
    }

    void main(void)
    {
        gl_Position = filterVertexPosition();

        float pixelStrength = uInputSize.%dimension% * uStrength;

        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;
function zu(i, t) {
  const e = Math.ceil(i / 2);
  let s = Ru, r = "", n;
  t ? n = "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * pixelStrength, 0.0);" : n = "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * pixelStrength);";
  for (let o = 0; o < i; o++) {
    let a = n.replace("%index%", o.toString());
    a = a.replace("%sampleIndex%", `${o - (e - 1)}.0`), r += a, r += `
`;
  }
  return s = s.replace("%blur%", r), s = s.replace("%size%", i.toString()), s = s.replace("%dimension%", t ? "z" : "w"), s;
}
function Du(i, t) {
  const e = zu(t, i), s = Ou(t);
  return Se.from({
    vertex: e,
    fragment: s,
    name: `blur-${i ? "horizontal" : "vertical"}-pass-filter`
  });
}
var ju = `

struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct BlurUniforms {
  uStrength:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> blurUniforms : BlurUniforms;


struct VSOutput {
    @builtin(position) position: vec4<f32>,
    %blur-struct%
  };

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);  
}

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}


@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>, 
) -> VSOutput {

  let filteredCord = filterTextureCoord(aPosition);

  let pixelStrength = gfu.uInputSize.%dimension% * blurUniforms.uStrength;

  return VSOutput(
   filterVertexPosition(aPosition),
    %blur-vertex-out%
  );
}

@fragment
fn mainFragment(
  @builtin(position) position: vec4<f32>,
  %blur-fragment-in%
) -> @location(0) vec4<f32> {

    var   finalColor = vec4(0.0);

    %blur-sampling%

    return finalColor;
}`;
function Gu(i, t) {
  const e = Vo[t], s = e.length, r = [], n = [], o = [];
  for (let u = 0; u < t; u++) {
    r[u] = `@location(${u}) offset${u}: vec2<f32>,`, i ? n[u] = `filteredCord + vec2(${u - s + 1} * pixelStrength, 0.0),` : n[u] = `filteredCord + vec2(0.0, ${u - s + 1} * pixelStrength),`;
    const f = u < s ? u : t - u - 1, d = e[f].toString();
    o[u] = `finalColor += textureSample(uTexture, uSampler, offset${u}) * ${d};`;
  }
  const a = r.join(`
`), h = n.join(`
`), c = o.join(`
`), l = ju.replace("%blur-struct%", a).replace("%blur-vertex-out%", h).replace("%blur-fragment-in%", a).replace("%blur-sampling%", c).replace("%dimension%", i ? "z" : "w");
  return se.from({
    vertex: {
      source: l,
      entryPoint: "mainVertex"
    },
    fragment: {
      source: l,
      entryPoint: "mainFragment"
    }
  });
}
const Xo = class qo extends As {
  /**
   * @param options
   * @param options.horizontal - Do pass along the x-axis (`true`) or y-axis (`false`).
   * @param options.strength - The strength of the blur filter.
   * @param options.quality - The quality of the blur filter.
   * @param options.kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
   */
  constructor(t) {
    t = { ...qo.defaultOptions, ...t };
    const e = Du(t.horizontal, t.kernelSize), s = Gu(t.horizontal, t.kernelSize);
    super({
      glProgram: e,
      gpuProgram: s,
      resources: {
        blurUniforms: {
          uStrength: { value: 0, type: "f32" }
        }
      },
      ...t
    }), this.horizontal = t.horizontal, this._quality = 0, this.quality = t.quality, this.blur = t.strength, this._uniforms = this.resources.blurUniforms.uniforms;
  }
  /**
   * Applies the filter.
   * @param filterManager - The manager.
   * @param input - The input target.
   * @param output - The output target.
   * @param clearMode - How to clear
   */
  apply(t, e, s, r) {
    if (this._uniforms.uStrength = this.strength / this.passes, this.passes === 1)
      t.applyFilter(this, e, s, r);
    else {
      const n = We.getSameSizeTexture(e);
      let o = e, a = n;
      this._state.blend = !1;
      const h = t.renderer.type === $e.WEBGPU;
      for (let c = 0; c < this.passes - 1; c++) {
        t.applyFilter(this, o, a, c === 0 ? !0 : h);
        const l = a;
        a = o, o = l;
      }
      this._state.blend = !0, t.applyFilter(this, o, s, r), We.returnTexture(n);
    }
  }
  /**
   * Sets the strength of both the blur.
   * @default 16
   */
  get blur() {
    return this.strength;
  }
  set blur(t) {
    this.padding = 1 + Math.abs(t) * 2, this.strength = t;
  }
  /**
   * Sets the quality of the blur by modifying the number of passes. More passes means higher
   * quality blurring but the lower the performance.
   * @default 4
   */
  get quality() {
    return this._quality;
  }
  set quality(t) {
    this._quality = t, this.passes = t;
  }
};
Xo.defaultOptions = {
  /** The strength of the blur filter. */
  strength: 8,
  /** The quality of the blur filter. */
  quality: 4,
  /** The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15. */
  kernelSize: 5
};
let ui = Xo;
class Zo extends As {
  constructor(...t) {
    let e = t[0] ?? {};
    typeof e == "number" && (ot(yt, "BlurFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }"), e = { strength: e }, t[1] !== void 0 && (e.quality = t[1]), t[2] !== void 0 && (e.resolution = t[2] || "inherit"), t[3] !== void 0 && (e.kernelSize = t[3])), e = { ...ui.defaultOptions, ...e };
    const { strength: s, strengthX: r, strengthY: n, quality: o, ...a } = e;
    super({
      ...a,
      compatibleRenderers: $e.BOTH,
      resources: {}
    }), this._repeatEdgePixels = !1, this.blurXFilter = new ui({ horizontal: !0, ...e }), this.blurYFilter = new ui({ horizontal: !1, ...e }), this.quality = o, this.strengthX = r ?? s, this.strengthY = n ?? s, this.repeatEdgePixels = !1;
  }
  /**
   * Applies the filter.
   * @param filterManager - The manager.
   * @param input - The input target.
   * @param output - The output target.
   * @param clearMode - How to clear
   */
  apply(t, e, s, r) {
    const n = Math.abs(this.blurXFilter.strength), o = Math.abs(this.blurYFilter.strength);
    if (n && o) {
      const a = We.getSameSizeTexture(e);
      this.blurXFilter.blendMode = "normal", this.blurXFilter.apply(t, e, a, !0), this.blurYFilter.blendMode = this.blendMode, this.blurYFilter.apply(t, a, s, r), We.returnTexture(a);
    } else o ? (this.blurYFilter.blendMode = this.blendMode, this.blurYFilter.apply(t, e, s, r)) : (this.blurXFilter.blendMode = this.blendMode, this.blurXFilter.apply(t, e, s, r));
  }
  updatePadding() {
    this._repeatEdgePixels ? this.padding = 0 : this.padding = Math.max(Math.abs(this.blurXFilter.blur), Math.abs(this.blurYFilter.blur)) * 2;
  }
  /**
   * Sets the strength of both the blurX and blurY properties simultaneously
   * @default 8
   */
  get strength() {
    if (this.strengthX !== this.strengthY)
      throw new Error("BlurFilter's strengthX and strengthY are different");
    return this.strengthX;
  }
  set strength(t) {
    this.blurXFilter.blur = this.blurYFilter.blur = t, this.updatePadding();
  }
  /**
   * Sets the number of passes for blur. More passes means higher quality bluring.
   * @default 1
   */
  get quality() {
    return this.blurXFilter.quality;
  }
  set quality(t) {
    this.blurXFilter.quality = this.blurYFilter.quality = t;
  }
  /**
   * Sets the strength of horizontal blur
   * @default 8
   */
  get strengthX() {
    return this.blurXFilter.blur;
  }
  set strengthX(t) {
    this.blurXFilter.blur = t, this.updatePadding();
  }
  /**
   * Sets the strength of the vertical blur
   * @default 8
   */
  get strengthY() {
    return this.blurYFilter.blur;
  }
  set strengthY(t) {
    this.blurYFilter.blur = t, this.updatePadding();
  }
  /**
   * Sets the strength of both the blurX and blurY properties simultaneously
   * @default 2
   * @deprecated since 8.3.0
   * @see BlurFilter.strength
   */
  get blur() {
    return ot("8.3.0", "BlurFilter.blur is deprecated, please use BlurFilter.strength instead."), this.strength;
  }
  set blur(t) {
    ot("8.3.0", "BlurFilter.blur is deprecated, please use BlurFilter.strength instead."), this.strength = t;
  }
  /**
   * Sets the strength of the blurX property
   * @default 2
   * @deprecated since 8.3.0
   * @see BlurFilter.strengthX
   */
  get blurX() {
    return ot("8.3.0", "BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."), this.strengthX;
  }
  set blurX(t) {
    ot("8.3.0", "BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."), this.strengthX = t;
  }
  /**
   * Sets the strength of the blurY property
   * @default 2
   * @deprecated since 8.3.0
   * @see BlurFilter.strengthY
   */
  get blurY() {
    return ot("8.3.0", "BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."), this.strengthY;
  }
  set blurY(t) {
    ot("8.3.0", "BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."), this.strengthY = t;
  }
  /**
   * If set to true the edge of the target will be clamped
   * @default false
   */
  get repeatEdgePixels() {
    return this._repeatEdgePixels;
  }
  set repeatEdgePixels(t) {
    this._repeatEdgePixels = t, this.updatePadding();
  }
}
Zo.defaultOptions = {
  /** The strength of the blur filter. */
  strength: 8,
  /** The quality of the blur filter. */
  quality: 4,
  /** The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15. */
  kernelSize: 5
};
var Wu = `
in vec2 vTextureCoord;
in vec4 vColor;

out vec4 finalColor;

uniform float uColorMatrix[20];
uniform float uAlpha;

uniform sampler2D uTexture;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec4 color = texture(uTexture, vTextureCoord);
    float randomValue = rand(gl_FragCoord.xy * 0.2);
    float diff = (randomValue - 0.5) *  0.5;

    if (uAlpha == 0.0) {
        finalColor = color;
        return;
    }

    if (color.a > 0.0) {
        color.rgb /= color.a;
    }

    vec4 result;

    result.r = (uColorMatrix[0] * color.r);
        result.r += (uColorMatrix[1] * color.g);
        result.r += (uColorMatrix[2] * color.b);
        result.r += (uColorMatrix[3] * color.a);
        result.r += uColorMatrix[4];

    result.g = (uColorMatrix[5] * color.r);
        result.g += (uColorMatrix[6] * color.g);
        result.g += (uColorMatrix[7] * color.b);
        result.g += (uColorMatrix[8] * color.a);
        result.g += uColorMatrix[9];

    result.b = (uColorMatrix[10] * color.r);
       result.b += (uColorMatrix[11] * color.g);
       result.b += (uColorMatrix[12] * color.b);
       result.b += (uColorMatrix[13] * color.a);
       result.b += uColorMatrix[14];

    result.a = (uColorMatrix[15] * color.r);
       result.a += (uColorMatrix[16] * color.g);
       result.a += (uColorMatrix[17] * color.b);
       result.a += (uColorMatrix[18] * color.a);
       result.a += uColorMatrix[19];

    vec3 rgb = mix(color.rgb, result.rgb, uAlpha);

    // Premultiply alpha again.
    rgb *= result.a;

    finalColor = vec4(rgb, result.a);
}
`, yn = `struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct ColorMatrixUniforms {
  uColorMatrix:array<vec4<f32>, 5>,
  uAlpha:f32,
};


@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;
@group(1) @binding(0) var<uniform> colorMatrixUniforms : ColorMatrixUniforms;


struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
  };
  
fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>, 
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition),
  );
}


@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
) -> @location(0) vec4<f32> {


  var c = textureSample(uTexture, uSampler, uv);
  
  if (colorMatrixUniforms.uAlpha == 0.0) {
    return c;
  }

 
    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (c.a > 0.0) {
      c.r /= c.a;
      c.g /= c.a;
      c.b /= c.a;
    }

    var cm = colorMatrixUniforms.uColorMatrix;


    var result = vec4<f32>(0.);

    result.r = (cm[0][0] * c.r);
    result.r += (cm[0][1] * c.g);
    result.r += (cm[0][2] * c.b);
    result.r += (cm[0][3] * c.a);
    result.r += cm[1][0];

    result.g = (cm[1][1] * c.r);
    result.g += (cm[1][2] * c.g);
    result.g += (cm[1][3] * c.b);
    result.g += (cm[2][0] * c.a);
    result.g += cm[2][1];

    result.b = (cm[2][2] * c.r);
    result.b += (cm[2][3] * c.g);
    result.b += (cm[3][0] * c.b);
    result.b += (cm[3][1] * c.a);
    result.b += cm[3][2];

    result.a = (cm[3][3] * c.r);
    result.a += (cm[4][0] * c.g);
    result.a += (cm[4][1] * c.b);
    result.a += (cm[4][2] * c.a);
    result.a += cm[4][3];

    var rgb = mix(c.rgb, result.rgb, colorMatrixUniforms.uAlpha);

    rgb.r *= result.a;
    rgb.g *= result.a;
    rgb.b *= result.a;

    return vec4(rgb, result.a);
}`;
class gt extends As {
  constructor(t = {}) {
    const e = new Ms({
      uColorMatrix: {
        value: [
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0
        ],
        type: "f32",
        size: 20
      },
      uAlpha: {
        value: 1,
        type: "f32"
      }
    }), s = se.from({
      vertex: {
        source: yn,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: yn,
        entryPoint: "mainFragment"
      }
    }), r = Se.from({
      vertex: Yo,
      fragment: Wu,
      name: "color-matrix-filter"
    });
    super({
      ...t,
      gpuProgram: s,
      glProgram: r,
      resources: {
        colorMatrixUniforms: e
      }
    }), this.alpha = 1;
  }
  /**
   * Transforms current matrix and set the new one
   * @param {number[]} matrix - 5x4 matrix
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  _loadMatrix(t, e = !1) {
    let s = t;
    e && (this._multiply(s, this.matrix, t), s = this._colorMatrix(s)), this.resources.colorMatrixUniforms.uniforms.uColorMatrix = s, this.resources.colorMatrixUniforms.update();
  }
  /**
   * Multiplies two mat5's
   * @private
   * @param out - 5x4 matrix the receiving matrix
   * @param a - 5x4 matrix the first operand
   * @param b - 5x4 matrix the second operand
   * @returns {number[]} 5x4 matrix
   */
  _multiply(t, e, s) {
    return t[0] = e[0] * s[0] + e[1] * s[5] + e[2] * s[10] + e[3] * s[15], t[1] = e[0] * s[1] + e[1] * s[6] + e[2] * s[11] + e[3] * s[16], t[2] = e[0] * s[2] + e[1] * s[7] + e[2] * s[12] + e[3] * s[17], t[3] = e[0] * s[3] + e[1] * s[8] + e[2] * s[13] + e[3] * s[18], t[4] = e[0] * s[4] + e[1] * s[9] + e[2] * s[14] + e[3] * s[19] + e[4], t[5] = e[5] * s[0] + e[6] * s[5] + e[7] * s[10] + e[8] * s[15], t[6] = e[5] * s[1] + e[6] * s[6] + e[7] * s[11] + e[8] * s[16], t[7] = e[5] * s[2] + e[6] * s[7] + e[7] * s[12] + e[8] * s[17], t[8] = e[5] * s[3] + e[6] * s[8] + e[7] * s[13] + e[8] * s[18], t[9] = e[5] * s[4] + e[6] * s[9] + e[7] * s[14] + e[8] * s[19] + e[9], t[10] = e[10] * s[0] + e[11] * s[5] + e[12] * s[10] + e[13] * s[15], t[11] = e[10] * s[1] + e[11] * s[6] + e[12] * s[11] + e[13] * s[16], t[12] = e[10] * s[2] + e[11] * s[7] + e[12] * s[12] + e[13] * s[17], t[13] = e[10] * s[3] + e[11] * s[8] + e[12] * s[13] + e[13] * s[18], t[14] = e[10] * s[4] + e[11] * s[9] + e[12] * s[14] + e[13] * s[19] + e[14], t[15] = e[15] * s[0] + e[16] * s[5] + e[17] * s[10] + e[18] * s[15], t[16] = e[15] * s[1] + e[16] * s[6] + e[17] * s[11] + e[18] * s[16], t[17] = e[15] * s[2] + e[16] * s[7] + e[17] * s[12] + e[18] * s[17], t[18] = e[15] * s[3] + e[16] * s[8] + e[17] * s[13] + e[18] * s[18], t[19] = e[15] * s[4] + e[16] * s[9] + e[17] * s[14] + e[18] * s[19] + e[19], t;
  }
  /**
   * Create a Float32 Array and normalize the offset component to 0-1
   * @param {number[]} matrix - 5x4 matrix
   * @returns {number[]} 5x4 matrix with all values between 0-1
   */
  _colorMatrix(t) {
    const e = new Float32Array(t);
    return e[4] /= 255, e[9] /= 255, e[14] /= 255, e[19] /= 255, e;
  }
  /**
   * Adjusts brightness
   * @param b - value of the brightness (0-1, where 0 is black)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  brightness(t, e) {
    const s = [
      t,
      0,
      0,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(s, e);
  }
  /**
   * Sets each channel on the diagonal of the color matrix.
   * This can be used to achieve a tinting effect on Containers similar to the tint field of some
   * display objects like Sprite, Text, Graphics, and Mesh.
   * @param color - Color of the tint. This is a hex value.
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  tint(t, e) {
    const [s, r, n] = ut.shared.setValue(t).toArray(), o = [
      s,
      0,
      0,
      0,
      0,
      0,
      r,
      0,
      0,
      0,
      0,
      0,
      n,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(o, e);
  }
  /**
   * Set the matrices in grey scales
   * @param scale - value of the grey (0-1, where 0 is black)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  greyscale(t, e) {
    const s = [
      t,
      t,
      t,
      0,
      0,
      t,
      t,
      t,
      0,
      0,
      t,
      t,
      t,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(s, e);
  }
  /**
   * for our american friends!
   * @param scale
   * @param multiply
   */
  grayscale(t, e) {
    this.greyscale(t, e);
  }
  /**
   * Set the black and white matrice.
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  blackAndWhite(t) {
    const e = [
      0.3,
      0.6,
      0.1,
      0,
      0,
      0.3,
      0.6,
      0.1,
      0,
      0,
      0.3,
      0.6,
      0.1,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Set the hue property of the color
   * @param rotation - in degrees
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  hue(t, e) {
    t = (t || 0) / 180 * Math.PI;
    const s = Math.cos(t), r = Math.sin(t), n = Math.sqrt, o = 1 / 3, a = n(o), h = s + (1 - s) * o, c = o * (1 - s) - a * r, l = o * (1 - s) + a * r, u = o * (1 - s) + a * r, f = s + o * (1 - s), d = o * (1 - s) - a * r, g = o * (1 - s) - a * r, y = o * (1 - s) + a * r, m = s + o * (1 - s), _ = [
      h,
      c,
      l,
      0,
      0,
      u,
      f,
      d,
      0,
      0,
      g,
      y,
      m,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(_, e);
  }
  /**
   * Set the contrast matrix, increase the separation between dark and bright
   * Increase contrast : shadows darker and highlights brighter
   * Decrease contrast : bring the shadows up and the highlights down
   * @param amount - value of the contrast (0-1)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  contrast(t, e) {
    const s = (t || 0) + 1, r = -0.5 * (s - 1), n = [
      s,
      0,
      0,
      0,
      r,
      0,
      s,
      0,
      0,
      r,
      0,
      0,
      s,
      0,
      r,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(n, e);
  }
  /**
   * Set the saturation matrix, increase the separation between colors
   * Increase saturation : increase contrast, brightness, and sharpness
   * @param amount - The saturation amount (0-1)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  saturate(t = 0, e) {
    const s = t * 2 / 3 + 1, r = (s - 1) * -0.5, n = [
      s,
      r,
      r,
      0,
      0,
      r,
      s,
      r,
      0,
      0,
      r,
      r,
      s,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(n, e);
  }
  /** Desaturate image (remove color) Call the saturate function */
  desaturate() {
    this.saturate(-1);
  }
  /**
   * Negative image (inverse of classic rgb matrix)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  negative(t) {
    const e = [
      -1,
      0,
      0,
      1,
      0,
      0,
      -1,
      0,
      1,
      0,
      0,
      0,
      -1,
      1,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Sepia image
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  sepia(t) {
    const e = [
      0.393,
      0.7689999,
      0.18899999,
      0,
      0,
      0.349,
      0.6859999,
      0.16799999,
      0,
      0,
      0.272,
      0.5339999,
      0.13099999,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Color motion picture process invented in 1916 (thanks Dominic Szablewski)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  technicolor(t) {
    const e = [
      1.9125277891456083,
      -0.8545344976951645,
      -0.09155508482755585,
      0,
      11.793603434377337,
      -0.3087833385928097,
      1.7658908555458428,
      -0.10601743074722245,
      0,
      -70.35205161461398,
      -0.231103377548616,
      -0.7501899197440212,
      1.847597816108189,
      0,
      30.950940869491138,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Polaroid filter
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  polaroid(t) {
    const e = [
      1.438,
      -0.062,
      -0.062,
      0,
      0,
      -0.122,
      1.378,
      -0.122,
      0,
      0,
      -0.016,
      -0.016,
      1.483,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Filter who transforms : Red -> Blue and Blue -> Red
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  toBGR(t) {
    const e = [
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Color reversal film introduced by Eastman Kodak in 1935. (thanks Dominic Szablewski)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  kodachrome(t) {
    const e = [
      1.1285582396593525,
      -0.3967382283601348,
      -0.03992559172921793,
      0,
      63.72958762196502,
      -0.16404339962244616,
      1.0835251566291304,
      -0.05498805115633132,
      0,
      24.732407896706203,
      -0.16786010706155763,
      -0.5603416277695248,
      1.6014850761964943,
      0,
      35.62982807460946,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Brown delicious browni filter (thanks Dominic Szablewski)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  browni(t) {
    const e = [
      0.5997023498159715,
      0.34553243048391263,
      -0.2708298674538042,
      0,
      47.43192855600873,
      -0.037703249837783157,
      0.8609577587992641,
      0.15059552388459913,
      0,
      -36.96841498319127,
      0.24113635128153335,
      -0.07441037908422492,
      0.44972182064877153,
      0,
      -7.562075277591283,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Vintage filter (thanks Dominic Szablewski)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  vintage(t) {
    const e = [
      0.6279345635605994,
      0.3202183420819367,
      -0.03965408211312453,
      0,
      9.651285835294123,
      0.02578397704808868,
      0.6441188644374771,
      0.03259127616149294,
      0,
      7.462829176470591,
      0.0466055556782719,
      -0.0851232987247891,
      0.5241648018700465,
      0,
      5.159190588235296,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * We don't know exactly what it does, kind of gradient map, but funny to play with!
   * @param desaturation - Tone values.
   * @param toned - Tone values.
   * @param lightColor - Tone values, example: `0xFFE580`
   * @param darkColor - Tone values, example: `0xFFE580`
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  colorTone(t, e, s, r, n) {
    t || (t = 0.2), e || (e = 0.15), s || (s = 16770432), r || (r = 3375104);
    const o = ut.shared, [a, h, c] = o.setValue(s).toArray(), [l, u, f] = o.setValue(r).toArray(), d = [
      0.3,
      0.59,
      0.11,
      0,
      0,
      a,
      h,
      c,
      t,
      0,
      l,
      u,
      f,
      e,
      0,
      a - l,
      h - u,
      c - f,
      0,
      0
    ];
    this._loadMatrix(d, n);
  }
  /**
   * Night effect
   * @param intensity - The intensity of the night effect.
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  night(t, e) {
    t || (t = 0.1);
    const s = [
      t * -2,
      -t,
      0,
      0,
      0,
      -t,
      0,
      t,
      0,
      0,
      0,
      t,
      t * 2,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(s, e);
  }
  /**
   * Predator effect
   *
   * Erase the current matrix by setting a new independent one
   * @param amount - how much the predator feels his future victim
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  predator(t, e) {
    const s = [
      // row 1
      11.224130630493164 * t,
      -4.794486999511719 * t,
      -2.8746118545532227 * t,
      0 * t,
      0.40342438220977783 * t,
      // row 2
      -3.6330697536468506 * t,
      9.193157196044922 * t,
      -2.951810836791992 * t,
      0 * t,
      -1.316135048866272 * t,
      // row 3
      -3.2184197902679443 * t,
      -4.2375030517578125 * t,
      7.476448059082031 * t,
      0 * t,
      0.8044459223747253 * t,
      // row 4
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(s, e);
  }
  /**
   * LSD effect
   *
   * Multiply the current matrix
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  lsd(t) {
    const e = [
      2,
      -0.4,
      0.5,
      0,
      0,
      -0.5,
      2,
      -0.4,
      0,
      0,
      -0.4,
      -0.5,
      3,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /** Erase the current matrix by setting the default one. */
  reset() {
    const t = [
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(t, !1);
  }
  /**
   * The matrix of the color matrix filter
   * @member {number[]}
   * @default [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
   */
  get matrix() {
    return this.resources.colorMatrixUniforms.uniforms.uColorMatrix;
  }
  set matrix(t) {
    this.resources.colorMatrixUniforms.uniforms.uColorMatrix = t;
  }
  /**
   * The opacity value to use when mixing the original and resultant colors.
   *
   * When the value is 0, the original color is used without modification.
   * When the value is 1, the result color is used.
   * When in the range (0, 1) the color is interpolated between the original and result by this amount.
   * @default 1
   */
  get alpha() {
    return this.resources.colorMatrixUniforms.uniforms.uAlpha;
  }
  set alpha(t) {
    this.resources.colorMatrixUniforms.uniforms.uAlpha = t;
  }
}
var $u = `
in vec2 vTextureCoord;
in vec4 vColor;

out vec4 finalColor;

uniform float uNoise;
uniform float uSeed;
uniform sampler2D uTexture;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec4 color = texture(uTexture, vTextureCoord);
    float randomValue = rand(gl_FragCoord.xy * uSeed);
    float diff = (randomValue - 0.5) *  uNoise;

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (color.a > 0.0) {
        color.rgb /= color.a;
    }

    color.r += diff;
    color.g += diff;
    color.b += diff;

    // Premultiply alpha again.
    color.rgb *= color.a;

    finalColor = color;
}
`, xn = `

struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct NoiseUniforms {
  uNoise:f32,
  uSeed:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> noiseUniforms : NoiseUniforms;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>
  };

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);  
}

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}
  
@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>, 
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition)
  );
}

fn rand(co:vec2<f32>) -> f32
{
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}



@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var pixelPosition =  globalTextureCoord(position.xy);// / (getSize());//-  gfu.uOutputFrame.xy);
  
    
    var sample = textureSample(uTexture, uSampler, uv);
    var randomValue =  rand(pixelPosition.xy * noiseUniforms.uSeed);
    var diff = (randomValue - 0.5) * noiseUniforms.uNoise;
  
    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (sample.a > 0.0) {
      sample.r /= sample.a;
      sample.g /= sample.a;
      sample.b /= sample.a;
    }

    sample.r += diff;
    sample.g += diff;
    sample.b += diff;

    // Premultiply alpha again.
    sample.r *= sample.a;
    sample.g *= sample.a;
    sample.b *= sample.a;
    
    return sample;
}`;
const Ko = class Jo extends As {
  /**
   * @param options - The options of the noise filter.
   */
  constructor(t = {}) {
    t = { ...Jo.defaultOptions, ...t };
    const e = se.from({
      vertex: {
        source: xn,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: xn,
        entryPoint: "mainFragment"
      }
    }), s = Se.from({
      vertex: Yo,
      fragment: $u,
      name: "noise-filter"
    }), { noise: r, seed: n, ...o } = t;
    super({
      ...o,
      gpuProgram: e,
      glProgram: s,
      resources: {
        noiseUniforms: new Ms({
          uNoise: { value: 1, type: "f32" },
          uSeed: { value: 1, type: "f32" }
        })
      }
    }), this.noise = r, this.seed = n ?? Math.random();
  }
  /**
   * The amount of noise to apply, this value should be in the range (0, 1].
   * @default 0.5
   */
  get noise() {
    return this.resources.noiseUniforms.uniforms.uNoise;
  }
  set noise(t) {
    this.resources.noiseUniforms.uniforms.uNoise = t;
  }
  /** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
  get seed() {
    return this.resources.noiseUniforms.uniforms.uSeed;
  }
  set seed(t) {
    this.resources.noiseUniforms.uniforms.uSeed = t;
  }
};
Ko.defaultOptions = {
  noise: 0.5
};
let Uu = Ko;
bt.add(_a, ba);
var Oe = { exports: {} };
/*!
 * Platform.js v1.3.6
 * Copyright 2014-2020 Benjamin Tan
 * Copyright 2011-2013 John-David Dalton
 * Available under MIT license
 */
var Hu = Oe.exports, _n;
function Yu() {
  return _n || (_n = 1, function(i, t) {
    (function() {
      var e = {
        function: !0,
        object: !0
      }, s = e[typeof window] && window || this, r = t, n = i && !i.nodeType && i, o = r && n && typeof lr == "object" && lr;
      o && (o.global === o || o.window === o || o.self === o) && (s = o);
      var a = Math.pow(2, 53) - 1, h = /\bOpera/, c = Object.prototype, l = c.hasOwnProperty, u = c.toString;
      function f(v) {
        return v = String(v), v.charAt(0).toUpperCase() + v.slice(1);
      }
      function d(v, O, N) {
        var z = {
          "10.0": "10",
          "6.4": "10 Technical Preview",
          "6.3": "8.1",
          "6.2": "8",
          "6.1": "Server 2008 R2 / 7",
          "6.0": "Server 2008 / Vista",
          "5.2": "Server 2003 / XP 64-bit",
          "5.1": "XP",
          "5.01": "2000 SP1",
          "5.0": "2000",
          "4.0": "NT",
          "4.90": "ME"
        };
        return O && N && /^Win/i.test(v) && !/^Windows Phone /i.test(v) && (z = z[/[\d.]+$/.exec(v)]) && (v = "Windows " + z), v = String(v), O && N && (v = v.replace(RegExp(O, "i"), N)), v = y(
          v.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0]
        ), v;
      }
      function g(v, O) {
        var N = -1, z = v ? v.length : 0;
        if (typeof z == "number" && z > -1 && z <= a)
          for (; ++N < z; )
            O(v[N], N, v);
        else
          m(v, O);
      }
      function y(v) {
        return v = L(v), /^(?:webOS|i(?:OS|P))/.test(v) ? v : f(v);
      }
      function m(v, O) {
        for (var N in v)
          l.call(v, N) && O(v[N], N, v);
      }
      function _(v) {
        return v == null ? f(v) : u.call(v).slice(8, -1);
      }
      function M(v, O) {
        var N = v != null ? typeof v[O] : "number";
        return !/^(?:boolean|number|string|undefined)$/.test(N) && (N == "object" ? !!v[O] : !0);
      }
      function S(v) {
        return String(v).replace(/([ -])(?!$)/g, "$1?");
      }
      function C(v, O) {
        var N = null;
        return g(v, function(z, it) {
          N = O(N, z, it, v);
        }), N;
      }
      function L(v) {
        return String(v).replace(/^ +| +$/g, "");
      }
      function P(v) {
        var O = s, N = v && typeof v == "object" && _(v) != "String";
        N && (O = v, v = null);
        var z = O.navigator || {}, it = z.userAgent || "";
        v || (v = it);
        var rt = N ? !!z.likeChrome : /\bChrome\b/.test(v) && !/internal|\n/i.test(u.toString()), ft = "Object", zt = N ? ft : "ScriptBridgingProxyObject", p = N ? ft : "Environment", x = N && O.java ? "JavaPackage" : _(O.java), w = N ? ft : "RuntimeObject", A = /\bJava/.test(x) && O.java, T = A && _(O.environment) == p, k = A ? "a" : "α", E = A ? "b" : "β", F = O.document || {}, V = O.operamini || O.opera, H = h.test(H = N && V ? V["[[Class]]"] : _(V)) ? H : V = null, b, Q = v, G = [], at = null, K = v == it, W = K && V && typeof V.version == "function" && V.version(), At, Z = ks([
          { label: "EdgeHTML", pattern: "Edge" },
          "Trident",
          { label: "WebKit", pattern: "AppleWebKit" },
          "iCab",
          "Presto",
          "NetFront",
          "Tasman",
          "KHTML",
          "Gecko"
        ]), B = ga([
          "Adobe AIR",
          "Arora",
          "Avant Browser",
          "Breach",
          "Camino",
          "Electron",
          "Epiphany",
          "Fennec",
          "Flock",
          "Galeon",
          "GreenBrowser",
          "iCab",
          "Iceweasel",
          "K-Meleon",
          "Konqueror",
          "Lunascape",
          "Maxthon",
          { label: "Microsoft Edge", pattern: "(?:Edge|Edg|EdgA|EdgiOS)" },
          "Midori",
          "Nook Browser",
          "PaleMoon",
          "PhantomJS",
          "Raven",
          "Rekonq",
          "RockMelt",
          { label: "Samsung Internet", pattern: "SamsungBrowser" },
          "SeaMonkey",
          { label: "Silk", pattern: "(?:Cloud9|Silk-Accelerated)" },
          "Sleipnir",
          "SlimBrowser",
          { label: "SRWare Iron", pattern: "Iron" },
          "Sunrise",
          "Swiftfox",
          "Vivaldi",
          "Waterfox",
          "WebPositive",
          { label: "Yandex Browser", pattern: "YaBrowser" },
          { label: "UC Browser", pattern: "UCBrowser" },
          "Opera Mini",
          { label: "Opera Mini", pattern: "OPiOS" },
          "Opera",
          { label: "Opera", pattern: "OPR" },
          "Chromium",
          "Chrome",
          { label: "Chrome", pattern: "(?:HeadlessChrome)" },
          { label: "Chrome Mobile", pattern: "(?:CriOS|CrMo)" },
          { label: "Firefox", pattern: "(?:Firefox|Minefield)" },
          { label: "Firefox for iOS", pattern: "FxiOS" },
          { label: "IE", pattern: "IEMobile" },
          { label: "IE", pattern: "MSIE" },
          "Safari"
        ]), D = ar([
          { label: "BlackBerry", pattern: "BB10" },
          "BlackBerry",
          { label: "Galaxy S", pattern: "GT-I9000" },
          { label: "Galaxy S2", pattern: "GT-I9100" },
          { label: "Galaxy S3", pattern: "GT-I9300" },
          { label: "Galaxy S4", pattern: "GT-I9500" },
          { label: "Galaxy S5", pattern: "SM-G900" },
          { label: "Galaxy S6", pattern: "SM-G920" },
          { label: "Galaxy S6 Edge", pattern: "SM-G925" },
          { label: "Galaxy S7", pattern: "SM-G930" },
          { label: "Galaxy S7 Edge", pattern: "SM-G935" },
          "Google TV",
          "Lumia",
          "iPad",
          "iPod",
          "iPhone",
          "Kindle",
          { label: "Kindle Fire", pattern: "(?:Cloud9|Silk-Accelerated)" },
          "Nexus",
          "Nook",
          "PlayBook",
          "PlayStation Vita",
          "PlayStation",
          "TouchPad",
          "Transformer",
          { label: "Wii U", pattern: "WiiU" },
          "Wii",
          "Xbox One",
          { label: "Xbox 360", pattern: "Xbox" },
          "Xoom"
        ]), X = or({
          Apple: { iPad: 1, iPhone: 1, iPod: 1 },
          Alcatel: {},
          Archos: {},
          Amazon: { Kindle: 1, "Kindle Fire": 1 },
          Asus: { Transformer: 1 },
          "Barnes & Noble": { Nook: 1 },
          BlackBerry: { PlayBook: 1 },
          Google: { "Google TV": 1, Nexus: 1 },
          HP: { TouchPad: 1 },
          HTC: {},
          Huawei: {},
          Lenovo: {},
          LG: {},
          Microsoft: { Xbox: 1, "Xbox One": 1 },
          Motorola: { Xoom: 1 },
          Nintendo: { "Wii U": 1, Wii: 1 },
          Nokia: { Lumia: 1 },
          Oppo: {},
          Samsung: { "Galaxy S": 1, "Galaxy S2": 1, "Galaxy S3": 1, "Galaxy S4": 1 },
          Sony: { PlayStation: 1, "PlayStation Vita": 1 },
          Xiaomi: { Mi: 1, Redmi: 1 }
        }), R = ya([
          "Windows Phone",
          "KaiOS",
          "Android",
          "CentOS",
          { label: "Chrome OS", pattern: "CrOS" },
          "Debian",
          { label: "DragonFly BSD", pattern: "DragonFly" },
          "Fedora",
          "FreeBSD",
          "Gentoo",
          "Haiku",
          "Kubuntu",
          "Linux Mint",
          "OpenBSD",
          "Red Hat",
          "SuSE",
          "Ubuntu",
          "Xubuntu",
          "Cygwin",
          "Symbian OS",
          "hpwOS",
          "webOS ",
          "webOS",
          "Tablet OS",
          "Tizen",
          "Linux",
          "Mac OS X",
          "Macintosh",
          "Mac",
          "Windows 98;",
          "Windows "
        ]);
        function ks(Tt) {
          return C(Tt, function(ct, st) {
            return ct || RegExp("\\b" + (st.pattern || S(st)) + "\\b", "i").exec(v) && (st.label || st);
          });
        }
        function or(Tt) {
          return C(Tt, function(ct, st, Dt) {
            return ct || (st[D] || st[/^[a-z]+(?: +[a-z]+\b)*/i.exec(D)] || RegExp("\\b" + S(Dt) + "(?:\\b|\\w*\\d)", "i").exec(v)) && Dt;
          });
        }
        function ga(Tt) {
          return C(Tt, function(ct, st) {
            return ct || RegExp("\\b" + (st.pattern || S(st)) + "\\b", "i").exec(v) && (st.label || st);
          });
        }
        function ya(Tt) {
          return C(Tt, function(ct, st) {
            var Dt = st.pattern || S(st);
            return !ct && (ct = RegExp("\\b" + Dt + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(v)) && (ct = d(ct, Dt, st.label || st)), ct;
          });
        }
        function ar(Tt) {
          return C(Tt, function(ct, st) {
            var Dt = st.pattern || S(st);
            return !ct && (ct = RegExp("\\b" + Dt + " *\\d+[.\\w_]*", "i").exec(v) || RegExp("\\b" + Dt + " *\\w+-[\\w]*", "i").exec(v) || RegExp("\\b" + Dt + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(v)) && ((ct = String(st.label && !RegExp(Dt, "i").test(st.label) ? st.label : ct).split("/"))[1] && !/[\d.]+/.test(ct[0]) && (ct[0] += " " + ct[1]), st = st.label || st, ct = y(ct[0].replace(RegExp(Dt, "i"), st).replace(RegExp("; *(?:" + st + "[_-])?", "i"), " ").replace(RegExp("(" + st + ")[-_.]?(\\w)", "i"), "$1 $2"))), ct;
          });
        }
        function hr(Tt) {
          return C(Tt, function(ct, st) {
            return ct || (RegExp(st + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(v) || 0)[1] || null;
          });
        }
        function xa() {
          return this.description || "";
        }
        if (Z && (Z = [Z]), /\bAndroid\b/.test(R) && !D && (b = /\bAndroid[^;]*;(.*?)(?:Build|\) AppleWebKit)\b/i.exec(v)) && (D = L(b[1]).replace(/^[a-z]{2}-[a-z]{2};\s*/i, "") || null), X && !D ? D = ar([X]) : X && D && (D = D.replace(RegExp("^(" + S(X) + ")[-_.\\s]", "i"), X + " ").replace(RegExp("^(" + S(X) + ")[-_.]?(\\w)", "i"), X + " $2")), (b = /\bGoogle TV\b/.exec(D)) && (D = b[0]), /\bSimulator\b/i.test(v) && (D = (D ? D + " " : "") + "Simulator"), B == "Opera Mini" && /\bOPiOS\b/.test(v) && G.push("running in Turbo/Uncompressed mode"), B == "IE" && /\blike iPhone OS\b/.test(v) ? (b = P(v.replace(/like iPhone OS/, "")), X = b.manufacturer, D = b.product) : /^iP/.test(D) ? (B || (B = "Safari"), R = "iOS" + ((b = / OS ([\d_]+)/i.exec(v)) ? " " + b[1].replace(/_/g, ".") : "")) : B == "Konqueror" && /^Linux\b/i.test(R) ? R = "Kubuntu" : X && X != "Google" && (/Chrome/.test(B) && !/\bMobile Safari\b/i.test(v) || /\bVita\b/.test(D)) || /\bAndroid\b/.test(R) && /^Chrome/.test(B) && /\bVersion\//i.test(v) ? (B = "Android Browser", R = /\bAndroid\b/.test(R) ? R : "Android") : B == "Silk" ? (/\bMobi/i.test(v) || (R = "Android", G.unshift("desktop mode")), /Accelerated *= *true/i.test(v) && G.unshift("accelerated")) : B == "UC Browser" && /\bUCWEB\b/.test(v) ? G.push("speed mode") : B == "PaleMoon" && (b = /\bFirefox\/([\d.]+)\b/.exec(v)) ? G.push("identifying as Firefox " + b[1]) : B == "Firefox" && (b = /\b(Mobile|Tablet|TV)\b/i.exec(v)) ? (R || (R = "Firefox OS"), D || (D = b[1])) : !B || (b = !/\bMinefield\b/i.test(v) && /\b(?:Firefox|Safari)\b/.exec(B)) ? (B && !D && /[\/,]|^[^(]+?\)/.test(v.slice(v.indexOf(b + "/") + 8)) && (B = null), (b = D || X || R) && (D || X || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(R)) && (B = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(R) ? R : b) + " Browser")) : B == "Electron" && (b = (/\bChrome\/([\d.]+)\b/.exec(v) || 0)[1]) && G.push("Chromium " + b), W || (W = hr([
          "(?:Cloud9|CriOS|CrMo|Edge|Edg|EdgA|EdgiOS|FxiOS|HeadlessChrome|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$)|UCBrowser|YaBrowser)",
          "Version",
          S(B),
          "(?:Firefox|Minefield|NetFront)"
        ])), (b = Z == "iCab" && parseFloat(W) > 3 && "WebKit" || /\bOpera\b/.test(B) && (/\bOPR\b/.test(v) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(v) && !/^(?:Trident|EdgeHTML)$/.test(Z) && "WebKit" || !Z && /\bMSIE\b/i.test(v) && (R == "Mac OS" ? "Tasman" : "Trident") || Z == "WebKit" && /\bPlayStation\b(?! Vita\b)/i.test(B) && "NetFront") && (Z = [b]), B == "IE" && (b = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(v) || 0)[1]) ? (B += " Mobile", R = "Windows Phone " + (/\+$/.test(b) ? b : b + ".x"), G.unshift("desktop mode")) : /\bWPDesktop\b/i.test(v) ? (B = "IE Mobile", R = "Windows Phone 8.x", G.unshift("desktop mode"), W || (W = (/\brv:([\d.]+)/.exec(v) || 0)[1])) : B != "IE" && Z == "Trident" && (b = /\brv:([\d.]+)/.exec(v)) && (B && G.push("identifying as " + B + (W ? " " + W : "")), B = "IE", W = b[1]), K) {
          if (M(O, "global"))
            if (A && (b = A.lang.System, Q = b.getProperty("os.arch"), R = R || b.getProperty("os.name") + " " + b.getProperty("os.version")), T) {
              try {
                W = O.require("ringo/engine").version.join("."), B = "RingoJS";
              } catch {
                (b = O.system) && b.global.system == O.system && (B = "Narwhal", R || (R = b[0].os || null));
              }
              B || (B = "Rhino");
            } else typeof O.process == "object" && !O.process.browser && (b = O.process) && (typeof b.versions == "object" && (typeof b.versions.electron == "string" ? (G.push("Node " + b.versions.node), B = "Electron", W = b.versions.electron) : typeof b.versions.nw == "string" && (G.push("Chromium " + W, "Node " + b.versions.node), B = "NW.js", W = b.versions.nw)), B || (B = "Node.js", Q = b.arch, R = b.platform, W = /[\d.]+/.exec(b.version), W = W ? W[0] : null));
          else _(b = O.runtime) == zt ? (B = "Adobe AIR", R = b.flash.system.Capabilities.os) : _(b = O.phantom) == w ? (B = "PhantomJS", W = (b = b.version || null) && b.major + "." + b.minor + "." + b.patch) : typeof F.documentMode == "number" && (b = /\bTrident\/(\d+)/i.exec(v)) ? (W = [W, F.documentMode], (b = +b[1] + 4) != W[1] && (G.push("IE " + W[1] + " mode"), Z && (Z[1] = ""), W[1] = b), W = B == "IE" ? String(W[1].toFixed(1)) : W[0]) : typeof F.documentMode == "number" && /^(?:Chrome|Firefox)\b/.test(B) && (G.push("masking as " + B + " " + W), B = "IE", W = "11.0", Z = ["Trident"], R = "Windows");
          R = R && y(R);
        }
        if (W && (b = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(W) || /(?:alpha|beta)(?: ?\d)?/i.exec(v + ";" + (K && z.appMinorVersion)) || /\bMinefield\b/i.test(v) && "a") && (at = /b/i.test(b) ? "beta" : "alpha", W = W.replace(RegExp(b + "\\+?$"), "") + (at == "beta" ? E : k) + (/\d+\+?/.exec(b) || "")), B == "Fennec" || B == "Firefox" && /\b(?:Android|Firefox OS|KaiOS)\b/.test(R))
          B = "Firefox Mobile";
        else if (B == "Maxthon" && W)
          W = W.replace(/\.[\d.]+/, ".x");
        else if (/\bXbox\b/i.test(D))
          D == "Xbox 360" && (R = null), D == "Xbox 360" && /\bIEMobile\b/.test(v) && G.unshift("mobile mode");
        else if ((/^(?:Chrome|IE|Opera)$/.test(B) || B && !D && !/Browser|Mobi/.test(B)) && (R == "Windows CE" || /Mobi/i.test(v)))
          B += " Mobile";
        else if (B == "IE" && K)
          try {
            O.external === null && G.unshift("platform preview");
          } catch {
            G.unshift("embedded");
          }
        else (/\bBlackBerry\b/.test(D) || /\bBB10\b/.test(v)) && (b = (RegExp(D.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(v) || 0)[1] || W) ? (b = [b, /BB10/.test(v)], R = (b[1] ? (D = null, X = "BlackBerry") : "Device Software") + " " + b[0], W = null) : this != m && D != "Wii" && (K && V || /Opera/.test(B) && /\b(?:MSIE|Firefox)\b/i.test(v) || B == "Firefox" && /\bOS X (?:\d+\.){2,}/.test(R) || B == "IE" && (R && !/^Win/.test(R) && W > 5.5 || /\bWindows XP\b/.test(R) && W > 8 || W == 8 && !/\bTrident\b/.test(v))) && !h.test(b = P.call(m, v.replace(h, "") + ";")) && b.name && (b = "ing as " + b.name + ((b = b.version) ? " " + b : ""), h.test(B) ? (/\bIE\b/.test(b) && R == "Mac OS" && (R = null), b = "identify" + b) : (b = "mask" + b, H ? B = y(H.replace(/([a-z])([A-Z])/g, "$1 $2")) : B = "Opera", /\bIE\b/.test(b) && (R = null), K || (W = null)), Z = ["Presto"], G.push(b));
        (b = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(v) || 0)[1]) && (b = [parseFloat(b.replace(/\.(\d)$/, ".0$1")), b], B == "Safari" && b[1].slice(-1) == "+" ? (B = "WebKit Nightly", at = "alpha", W = b[1].slice(0, -1)) : (W == b[1] || W == (b[2] = (/\bSafari\/([\d.]+\+?)/i.exec(v) || 0)[1])) && (W = null), b[1] = (/\b(?:Headless)?Chrome\/([\d.]+)/i.exec(v) || 0)[1], b[0] == 537.36 && b[2] == 537.36 && parseFloat(b[1]) >= 28 && Z == "WebKit" && (Z = ["Blink"]), !K || !rt && !b[1] ? (Z && (Z[1] = "like Safari"), b = (b = b[0], b < 400 ? 1 : b < 500 ? 2 : b < 526 ? 3 : b < 533 ? 4 : b < 534 ? "4+" : b < 535 ? 5 : b < 537 ? 6 : b < 538 ? 7 : b < 601 ? 8 : b < 602 ? 9 : b < 604 ? 10 : b < 606 ? 11 : b < 608 ? 12 : "12")) : (Z && (Z[1] = "like Chrome"), b = b[1] || (b = b[0], b < 530 ? 1 : b < 532 ? 2 : b < 532.05 ? 3 : b < 533 ? 4 : b < 534.03 ? 5 : b < 534.07 ? 6 : b < 534.1 ? 7 : b < 534.13 ? 8 : b < 534.16 ? 9 : b < 534.24 ? 10 : b < 534.3 ? 11 : b < 535.01 ? 12 : b < 535.02 ? "13+" : b < 535.07 ? 15 : b < 535.11 ? 16 : b < 535.19 ? 17 : b < 536.05 ? 18 : b < 536.1 ? 19 : b < 537.01 ? 20 : b < 537.11 ? "21+" : b < 537.13 ? 23 : b < 537.18 ? 24 : b < 537.24 ? 25 : b < 537.36 ? 26 : Z != "Blink" ? "27" : "28")), Z && (Z[1] += " " + (b += typeof b == "number" ? ".x" : /[.+]/.test(b) ? "" : "+")), B == "Safari" && (!W || parseInt(W) > 45) ? W = b : B == "Chrome" && /\bHeadlessChrome/i.test(v) && G.unshift("headless")), B == "Opera" && (b = /\bzbov|zvav$/.exec(R)) ? (B += " ", G.unshift("desktop mode"), b == "zvav" ? (B += "Mini", W = null) : B += "Mobile", R = R.replace(RegExp(" *" + b + "$"), "")) : B == "Safari" && /\bChrome\b/.exec(Z && Z[1]) ? (G.unshift("desktop mode"), B = "Chrome Mobile", W = null, /\bOS X\b/.test(R) ? (X = "Apple", R = "iOS 4.3+") : R = null) : /\bSRWare Iron\b/.test(B) && !W && (W = hr("Chrome")), W && W.indexOf(b = /[\d.]+$/.exec(R)) == 0 && v.indexOf("/" + b + "-") > -1 && (R = L(R.replace(b, ""))), R && R.indexOf(B) != -1 && !RegExp(B + " OS").test(R) && (R = R.replace(RegExp(" *" + S(B) + " *"), "")), Z && !/\b(?:Avant|Nook)\b/.test(B) && (/Browser|Lunascape|Maxthon/.test(B) || B != "Safari" && /^iOS/.test(R) && /\bSafari\b/.test(Z[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|SRWare Iron|Vivaldi|Web)/.test(B) && Z[1]) && (b = Z[Z.length - 1]) && G.push(b), G.length && (G = ["(" + G.join("; ") + ")"]), X && D && D.indexOf(X) < 0 && G.push("on " + X), D && G.push((/^on /.test(G[G.length - 1]) ? "" : "on ") + D), R && (b = / ([\d.+]+)$/.exec(R), At = b && R.charAt(R.length - b[0].length - 1) == "/", R = {
          architecture: 32,
          family: b && !At ? R.replace(b[0], "") : R,
          version: b ? b[1] : null,
          toString: function() {
            var Tt = this.version;
            return this.family + (Tt && !At ? " " + Tt : "") + (this.architecture == 64 ? " 64-bit" : "");
          }
        }), (b = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(Q)) && !/\bi686\b/i.test(Q) ? (R && (R.architecture = 64, R.family = R.family.replace(RegExp(" *" + b), "")), B && (/\bWOW64\b/i.test(v) || K && /\w(?:86|32)$/.test(z.cpuClass || z.platform) && !/\bWin64; x64\b/i.test(v)) && G.unshift("32-bit")) : R && /^OS X/.test(R.family) && B == "Chrome" && parseFloat(W) >= 39 && (R.architecture = 64), v || (v = null);
        var It = {};
        return It.description = v, It.layout = Z && Z[0], It.manufacturer = X, It.name = B, It.prerelease = at, It.product = D, It.ua = v, It.version = B && W, It.os = R || {
          /**
           * The CPU architecture the OS is built for.
           *
           * @memberOf platform.os
           * @type number|null
           */
          architecture: null,
          /**
           * The family of the OS.
           *
           * Common values include:
           * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
           * "Windows XP", "OS X", "Linux", "Ubuntu", "Debian", "Fedora", "Red Hat",
           * "SuSE", "Android", "iOS" and "Windows Phone"
           *
           * @memberOf platform.os
           * @type string|null
           */
          family: null,
          /**
           * The version of the OS.
           *
           * @memberOf platform.os
           * @type string|null
           */
          version: null,
          /**
           * Returns the OS string.
           *
           * @memberOf platform.os
           * @returns {string} The OS string.
           */
          toString: function() {
            return "null";
          }
        }, It.parse = P, It.toString = xa, It.version && G.unshift(W), It.name && G.unshift(B), R && B && !(R == String(R).split(" ")[0] && (R == B.split(" ")[0] || D)) && G.push(D ? "(" + R + ")" : "on " + R), G.length && (It.description = G.join(" ")), It;
      }
      var I = P();
      r && n ? m(I, function(v, O) {
        r[O] = v;
      }) : s.platform = I;
    }).call(Hu);
  }(Oe, Oe.exports)), Oe.exports;
}
var pe = Yu();
const Vu = /* @__PURE__ */ ws(pe);
function ce(i) {
  return parseInt(String(i), 10);
}
function lt(i) {
  const t = parseInt(String(i), 10);
  return t < 0 ? -t : t;
}
"toInt" in String.prototype || (String.prototype.toInt = function() {
  return ce(this);
});
"toUint" in String.prototype || (String.prototype.toUint = function() {
  const i = ce(this);
  return i < 0 ? -i : i;
});
function Qo(i = "/", t = " ", e = ":", s = "") {
  const r = /* @__PURE__ */ new Date();
  return r.getFullYear() + i + String(100 + r.getMonth() + 1).slice(1, 3) + i + String(100 + r.getDate()).slice(1, 3) + t + String(100 + r.getHours()).slice(1, 3) + e + String(100 + r.getMinutes()).slice(1, 3) + (s === "" ? "" : s + String(r.getMilliseconds()));
}
const ta = "/* SKYNovel */";
function ef() {
  const i = document.getElementsByTagName("head")[0], t = i.children.length;
  for (let e = t - 1; e >= 0; --e) {
    const s = i.children[e];
    s instanceof HTMLStyleElement && s.innerText.startsWith(ta) && i.removeChild(s);
  }
}
function sf(i) {
  const t = document.createElement("style");
  t.innerHTML = ta + i, document.getElementsByTagName("head")[0].appendChild(t);
}
function $(i, t, e) {
  const s = i[t];
  if (!(t in i)) {
    if (isNaN(e)) throw `[${i[":タグ名"]}]属性 ${t} は必須です`;
    return i[t] = e, e;
  }
  const r = String(s).startsWith("0x") ? parseInt(s) : parseFloat(s);
  if (isNaN(r)) throw `[${i[":タグ名"]}]属性 ${t} の値【${s}】が数値ではありません`;
  return i[t] = r;
}
function ht(i, t, e) {
  if (!(t in i)) return i[t] = e;
  const s = i[t];
  if (s === null) return !1;
  const r = String(s);
  return i[t] = r === "false" ? !1 : !!r;
}
function rf(i, t, e) {
  const s = i[t];
  return s ? i[t] = new ut(s).toNumber() : i[t] = e;
}
const Xu = /JSON at position (\d+)$/;
function nf(i, t = "", e = "") {
  const s = (e.match(Xu) ?? ["", ""])[1];
  return `[${i[":タグ名"]}] ${t} 属性の解析エラー : ${e}
${i[t]}${s ? `
${"^".padStart(Number(s))}` : ""}`;
}
const qu = /^[^\/\.]+$|[^\/]+(?=\.)/;
function ea(i) {
  return (i.match(qu) ?? [""])[0];
}
class j {
  static stageW = 0;
  static stageH = 0;
  static debugLog = !1;
  static isSafari = pe.name === "Safari";
  static isFirefox = pe.name === "Firefox";
  static isMac = /OS X/.test(pe.os?.family ?? "");
  static isWin = /Windows/.test(pe.os?.family ?? "");
  static isMobile = !/(Windows|OS X)/.test(pe.os?.family ?? "");
  static hDip = {};
  static isDbg = !1;
  static isPackaged = !1;
  static isDarkMode = !1;
  static cc4ColorName;
}
class Zu {
  // リソースリーク対策
  #t = [];
  addC(t, e, s, r = {}) {
    t.on(e, s, r), this.#t.push(() => t.off(e, s, r));
  }
  add(t, e, s, r = {}) {
    if (t instanceof Rt) {
      t.on(e, s, r), this.#t.push(() => t.off(e, s, r));
      return;
    }
    t.addEventListener(e, s, r), this.#t.push(() => t.removeEventListener(e, s, { capture: r.capture ?? !1 }));
  }
  clear() {
    for (const t of this.#t) t();
    this.#t = [];
  }
  get isEmpty() {
    return this.#t.length === 0;
  }
}
var we = /* @__PURE__ */ ((i) => (i.DEFAULT = "", i.SP_GSM = "png|jpg|jpeg|json|svg|webp|mp4|webm", i.SCRIPT = "sn|ssn", i.FONT = "woff2|woff|otf|ttf", i.SOUND = "mp3|m4a|ogg|aac|flac|wav", i.HTML = "htm|html", i.CSS = "css", i.SN = "sn", i.TST_PNGPNG_ = "png|png_", i.TST_HH = "hh", i.TST_EEE = "eee", i.TST_GGG = "ggg", i.TST_PNGXML = "png|xml", i))(we || {});
const Ku = {
  save_ns: "",
  // 扱うセーブデータを一意に識別するキーワード文字列
  window: {
    // アプリケーションウインドウサイズ
    width: 300,
    height: 300
  },
  book: {
    // プロジェクトの詳細情報です
    title: "",
    //作品タイトル
    creator: "",
    //著作者。同人ならペンネーム
    cre_url: "",
    //著作者URL。ツイッターやメール、サイトなど
    publisher: "",
    //出版社。同人ならサークル名
    pub_url: "",
    //出版社URL。無ければ省略します
    detail: "",
    // 内容紹介。端的に記入
    version: "1.0"
  },
  log: { max_len: 64 },
  // プレイヤーが読んだ文章を読み返せる履歴のページ数
  init: {
    bg_color: "#000000",
    // 背景色
    tagch_msecwait: 10,
    // 通常文字表示待ち時間（未読／既読）
    auto_msecpagewait: 3500,
    // 自動文字表示、行クリック待ち時間（未読／既読）
    escape: ""
    // エスケープ文字
  },
  debug: {
    devtool: !1,
    token: !1,
    tag: !1,
    putCh: !1,
    debugLog: !1,
    baseTx: !1,
    masume: !1,
    // テキストレイヤ：ガイドマス目を表示するか
    variable: !1,
    dumpHtm: !1
  },
  code: {},
  // 暗号化しないフォルダ
  debuger_token: ""
  // デバッガとの接続トークン
};
class Ju {
  constructor(t) {
    this.sys = t;
  }
  oCfg = Ku;
  userFnTail = "";
  // 4tst public
  hPathFn2Exts = {};
  async load(t) {
    if (this.oCfg.save_ns = t?.save_ns ?? this.oCfg.save_ns, this.oCfg.window.width = Number(t?.window?.width ?? this.oCfg.window.width), this.oCfg.window.height = Number(t?.window?.height ?? this.oCfg.window.height), this.oCfg.book = { ...this.oCfg.book, ...t.book }, this.oCfg.log.max_len = t.log?.max_len ?? this.oCfg.log.max_len, this.oCfg.init = { ...this.oCfg.init, ...t.init }, this.oCfg.debug = { ...this.oCfg.debug, ...t.debug }, this.oCfg.debuger_token = t.debuger_token, await this.sys.loadPath(this.hPathFn2Exts, this), this.#t = this.matchPath(
      "^breakline$",
      "png|jpg|jpeg|json|svg|webp|mp4|webm"
      /* SP_GSM */
    ).length > 0, this.#e = this.matchPath(
      "^breakpage$",
      "png|jpg|jpeg|json|svg|webp|mp4|webm"
      /* SP_GSM */
    ).length > 0, this.sys.arg.crypto)
      for (const [e, s] of Object.entries(this.hPathFn2Exts))
        for (const [r, n] of Object.entries(s)) {
          if (!r.startsWith(":") || !r.endsWith(":id")) continue;
          const o = n.slice(n.lastIndexOf("/") + 1), a = s[r.slice(0, -10)] ?? "", c = await (await this.sys.fetch(a)).text(), l = this.sys.hash(c);
          if (o !== l) throw `ファイル改竄エラーです fn:${a}`;
        }
    else
      for (const [e, s] of Object.entries(this.hPathFn2Exts))
        for (const r of Object.keys(s))
          r.startsWith(":");
  }
  #t = !1;
  get existsBreakline() {
    return this.#t;
  }
  #e = !1;
  get existsBreakpage() {
    return this.#e;
  }
  getNs() {
    return `skynovel.${this.oCfg.save_ns} - `;
  }
  #i = /([^\/\s]+)\.([^\d]\w+)/;
  // 4 match 498 step(~1ms)  https://regex101.com/r/tpVgmI/1
  searchPath(t, e = "") {
    if (!t) throw "[searchPath] fnが空です";
    if (t.startsWith("http://")) return t;
    const s = t.match(this.#i);
    let r = s ? s[1] : t;
    const n = s ? s[2] : "";
    if (this.userFnTail) {
      const h = r + "@@" + this.userFnTail;
      if (h in this.hPathFn2Exts) {
        if (e === "") r = h;
        else for (const c of Object.keys(this.hPathFn2Exts[h] ?? {}))
          if (`|${e}|`.includes(`|${c}|`)) {
            r = h;
            break;
          }
      }
    }
    const o = this.hPathFn2Exts[r];
    if (!o) throw `サーチパスに存在しないファイル【${t}】です`;
    if (!n) {
      const h = ce(o[":cnt"]);
      if (e === "") {
        if (h > 1) throw `指定ファイル【${t}】が複数マッチします。サーチ対象拡張子群【${e}】で絞り込むか、ファイル名を個別にして下さい。`;
        return t;
      }
      const c = `|${e}|`;
      if (h > 1) {
        let l = 0;
        for (const u of Object.keys(o))
          if (c.includes(`|${u}|`) && ++l > 1)
            throw `指定ファイル【${t}】が複数マッチします。サーチ対象拡張子群【${e}】で絞り込むか、ファイル名を個別にして下さい。`;
      }
      for (const l of Object.keys(o))
        if (c.includes(`|${l}|`)) return o[l];
      throw `サーチ対象拡張子群【${e}】にマッチするファイルがサーチパスに存在しません。探索ファイル名=【${t}】`;
    }
    if (e !== "" && !`|${e}|`.includes(`|${n}|`))
      throw `指定ファイルの拡張子【${n}】は、サーチ対象拡張子群【${e}】にマッチしません。探索ファイル名=【${t}】`;
    const a = o[n];
    if (!a) throw `サーチパスに存在しない拡張子【${n}】です。探索ファイル名=【${t}】、サーチ対象拡張子群【${e}】`;
    return a;
  }
  matchPath(t, e = "") {
    const s = [], r = new RegExp(t), n = new RegExp(e);
    for (const [o, a] of Object.entries(this.hPathFn2Exts)) {
      if (o.search(r) === -1) continue;
      if (e === "") {
        s.push(a);
        continue;
      }
      const h = {};
      let c = !1;
      for (const l of Object.keys(a))
        l.search(n) !== -1 && (h[l] = o, c = !0);
      c && s.push(h);
    }
    return s;
  }
  addPath(t, e) {
    const s = {};
    for (const [r, n] of Object.entries(e))
      s[r] = (r.startsWith(":") ? "" : this.sys.arg.cur) + n;
    this.hPathFn2Exts[t] = s;
  }
}
const Zt = /* @__PURE__ */ Object.create(null);
Zt.open = "0";
Zt.close = "1";
Zt.ping = "2";
Zt.pong = "3";
Zt.message = "4";
Zt.upgrade = "5";
Zt.noop = "6";
const ps = /* @__PURE__ */ Object.create(null);
Object.keys(Zt).forEach((i) => {
  ps[Zt[i]] = i;
});
const Fi = { type: "error", data: "parser error" }, sa = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", ia = typeof ArrayBuffer == "function", ra = (i) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(i) : i && i.buffer instanceof ArrayBuffer, tr = ({ type: i, data: t }, e, s) => sa && t instanceof Blob ? e ? s(t) : bn(t, s) : ia && (t instanceof ArrayBuffer || ra(t)) ? e ? s(t) : bn(new Blob([t]), s) : s(Zt[i] + (t || "")), bn = (i, t) => {
  const e = new FileReader();
  return e.onload = function() {
    const s = e.result.split(",")[1];
    t("b" + (s || ""));
  }, e.readAsDataURL(i);
};
function wn(i) {
  return i instanceof Uint8Array ? i : i instanceof ArrayBuffer ? new Uint8Array(i) : new Uint8Array(i.buffer, i.byteOffset, i.byteLength);
}
let di;
function Qu(i, t) {
  if (sa && i.data instanceof Blob)
    return i.data.arrayBuffer().then(wn).then(t);
  if (ia && (i.data instanceof ArrayBuffer || ra(i.data)))
    return t(wn(i.data));
  tr(i, !1, (e) => {
    di || (di = new TextEncoder()), t(di.encode(e));
  });
}
const vn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Re = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let i = 0; i < vn.length; i++)
  Re[vn.charCodeAt(i)] = i;
const td = (i) => {
  let t = i.length * 0.75, e = i.length, s, r = 0, n, o, a, h;
  i[i.length - 1] === "=" && (t--, i[i.length - 2] === "=" && t--);
  const c = new ArrayBuffer(t), l = new Uint8Array(c);
  for (s = 0; s < e; s += 4)
    n = Re[i.charCodeAt(s)], o = Re[i.charCodeAt(s + 1)], a = Re[i.charCodeAt(s + 2)], h = Re[i.charCodeAt(s + 3)], l[r++] = n << 2 | o >> 4, l[r++] = (o & 15) << 4 | a >> 2, l[r++] = (a & 3) << 6 | h & 63;
  return c;
}, ed = typeof ArrayBuffer == "function", er = (i, t) => {
  if (typeof i != "string")
    return {
      type: "message",
      data: na(i, t)
    };
  const e = i.charAt(0);
  return e === "b" ? {
    type: "message",
    data: sd(i.substring(1), t)
  } : ps[e] ? i.length > 1 ? {
    type: ps[e],
    data: i.substring(1)
  } : {
    type: ps[e]
  } : Fi;
}, sd = (i, t) => {
  if (ed) {
    const e = td(i);
    return na(e, t);
  } else
    return { base64: !0, data: i };
}, na = (i, t) => {
  switch (t) {
    case "blob":
      return i instanceof Blob ? i : new Blob([i]);
    case "arraybuffer":
    default:
      return i instanceof ArrayBuffer ? i : i.buffer;
  }
}, oa = "", id = (i, t) => {
  const e = i.length, s = new Array(e);
  let r = 0;
  i.forEach((n, o) => {
    tr(n, !1, (a) => {
      s[o] = a, ++r === e && t(s.join(oa));
    });
  });
}, rd = (i, t) => {
  const e = i.split(oa), s = [];
  for (let r = 0; r < e.length; r++) {
    const n = er(e[r], t);
    if (s.push(n), n.type === "error")
      break;
  }
  return s;
};
function nd() {
  return new TransformStream({
    transform(i, t) {
      Qu(i, (e) => {
        const s = e.length;
        let r;
        if (s < 126)
          r = new Uint8Array(1), new DataView(r.buffer).setUint8(0, s);
        else if (s < 65536) {
          r = new Uint8Array(3);
          const n = new DataView(r.buffer);
          n.setUint8(0, 126), n.setUint16(1, s);
        } else {
          r = new Uint8Array(9);
          const n = new DataView(r.buffer);
          n.setUint8(0, 127), n.setBigUint64(1, BigInt(s));
        }
        i.data && typeof i.data != "string" && (r[0] |= 128), t.enqueue(r), t.enqueue(e);
      });
    }
  });
}
let fi;
function as(i) {
  return i.reduce((t, e) => t + e.length, 0);
}
function hs(i, t) {
  if (i[0].length === t)
    return i.shift();
  const e = new Uint8Array(t);
  let s = 0;
  for (let r = 0; r < t; r++)
    e[r] = i[0][s++], s === i[0].length && (i.shift(), s = 0);
  return i.length && s < i[0].length && (i[0] = i[0].slice(s)), e;
}
function od(i, t) {
  fi || (fi = new TextDecoder());
  const e = [];
  let s = 0, r = -1, n = !1;
  return new TransformStream({
    transform(o, a) {
      for (e.push(o); ; ) {
        if (s === 0) {
          if (as(e) < 1)
            break;
          const h = hs(e, 1);
          n = (h[0] & 128) === 128, r = h[0] & 127, r < 126 ? s = 3 : r === 126 ? s = 1 : s = 2;
        } else if (s === 1) {
          if (as(e) < 2)
            break;
          const h = hs(e, 2);
          r = new DataView(h.buffer, h.byteOffset, h.length).getUint16(0), s = 3;
        } else if (s === 2) {
          if (as(e) < 8)
            break;
          const h = hs(e, 8), c = new DataView(h.buffer, h.byteOffset, h.length), l = c.getUint32(0);
          if (l > Math.pow(2, 21) - 1) {
            a.enqueue(Fi);
            break;
          }
          r = l * Math.pow(2, 32) + c.getUint32(4), s = 3;
        } else {
          if (as(e) < r)
            break;
          const h = hs(e, r);
          a.enqueue(er(n ? h : fi.decode(h), t)), s = 0;
        }
        if (r === 0 || r > i) {
          a.enqueue(Fi);
          break;
        }
      }
    }
  });
}
const aa = 4;
function _t(i) {
  if (i) return ad(i);
}
function ad(i) {
  for (var t in _t.prototype)
    i[t] = _t.prototype[t];
  return i;
}
_t.prototype.on = _t.prototype.addEventListener = function(i, t) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + i] = this._callbacks["$" + i] || []).push(t), this;
};
_t.prototype.once = function(i, t) {
  function e() {
    this.off(i, e), t.apply(this, arguments);
  }
  return e.fn = t, this.on(i, e), this;
};
_t.prototype.off = _t.prototype.removeListener = _t.prototype.removeAllListeners = _t.prototype.removeEventListener = function(i, t) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var e = this._callbacks["$" + i];
  if (!e) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + i], this;
  for (var s, r = 0; r < e.length; r++)
    if (s = e[r], s === t || s.fn === t) {
      e.splice(r, 1);
      break;
    }
  return e.length === 0 && delete this._callbacks["$" + i], this;
};
_t.prototype.emit = function(i) {
  this._callbacks = this._callbacks || {};
  for (var t = new Array(arguments.length - 1), e = this._callbacks["$" + i], s = 1; s < arguments.length; s++)
    t[s - 1] = arguments[s];
  if (e) {
    e = e.slice(0);
    for (var s = 0, r = e.length; s < r; ++s)
      e[s].apply(this, t);
  }
  return this;
};
_t.prototype.emitReserved = _t.prototype.emit;
_t.prototype.listeners = function(i) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + i] || [];
};
_t.prototype.hasListeners = function(i) {
  return !!this.listeners(i).length;
};
const Ps = typeof Promise == "function" && typeof Promise.resolve == "function" ? (t) => Promise.resolve().then(t) : (t, e) => e(t, 0), Ft = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), hd = "arraybuffer";
function ha(i, ...t) {
  return t.reduce((e, s) => (i.hasOwnProperty(s) && (e[s] = i[s]), e), {});
}
const ld = Ft.setTimeout, cd = Ft.clearTimeout;
function Is(i, t) {
  t.useNativeTimers ? (i.setTimeoutFn = ld.bind(Ft), i.clearTimeoutFn = cd.bind(Ft)) : (i.setTimeoutFn = Ft.setTimeout.bind(Ft), i.clearTimeoutFn = Ft.clearTimeout.bind(Ft));
}
const ud = 1.33;
function dd(i) {
  return typeof i == "string" ? fd(i) : Math.ceil((i.byteLength || i.size) * ud);
}
function fd(i) {
  let t = 0, e = 0;
  for (let s = 0, r = i.length; s < r; s++)
    t = i.charCodeAt(s), t < 128 ? e += 1 : t < 2048 ? e += 2 : t < 55296 || t >= 57344 ? e += 3 : (s++, e += 4);
  return e;
}
function la() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function pd(i) {
  let t = "";
  for (let e in i)
    i.hasOwnProperty(e) && (t.length && (t += "&"), t += encodeURIComponent(e) + "=" + encodeURIComponent(i[e]));
  return t;
}
function md(i) {
  let t = {}, e = i.split("&");
  for (let s = 0, r = e.length; s < r; s++) {
    let n = e[s].split("=");
    t[decodeURIComponent(n[0])] = decodeURIComponent(n[1]);
  }
  return t;
}
class gd extends Error {
  constructor(t, e, s) {
    super(t), this.description = e, this.context = s, this.type = "TransportError";
  }
}
class sr extends _t {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(t) {
    super(), this.writable = !1, Is(this, t), this.opts = t, this.query = t.query, this.socket = t.socket, this.supportsBinary = !t.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(t, e, s) {
    return super.emitReserved("error", new gd(t, e, s)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(t) {
    this.readyState === "open" && this.write(t);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(t) {
    const e = er(t, this.socket.binaryType);
    this.onPacket(e);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(t) {
    super.emitReserved("packet", t);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(t) {
    this.readyState = "closed", super.emitReserved("close", t);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(t) {
  }
  createUri(t, e = {}) {
    return t + "://" + this._hostname() + this._port() + this.opts.path + this._query(e);
  }
  _hostname() {
    const t = this.opts.hostname;
    return t.indexOf(":") === -1 ? t : "[" + t + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(t) {
    const e = pd(t);
    return e.length ? "?" + e : "";
  }
}
class yd extends sr {
  constructor() {
    super(...arguments), this._polling = !1;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(t) {
    this.readyState = "pausing";
    const e = () => {
      this.readyState = "paused", t();
    };
    if (this._polling || !this.writable) {
      let s = 0;
      this._polling && (s++, this.once("pollComplete", function() {
        --s || e();
      })), this.writable || (s++, this.once("drain", function() {
        --s || e();
      }));
    } else
      e();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(t) {
    const e = (s) => {
      if (this.readyState === "opening" && s.type === "open" && this.onOpen(), s.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(s);
    };
    rd(t, this.socket.binaryType).forEach(e), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const t = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? t() : this.once("open", t);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(t) {
    this.writable = !1, id(t, (e) => {
      this.doWrite(e, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const t = this.opts.secure ? "https" : "http", e = this.query || {};
    return this.opts.timestampRequests !== !1 && (e[this.opts.timestampParam] = la()), !this.supportsBinary && !e.sid && (e.b64 = 1), this.createUri(t, e);
  }
}
let ca = !1;
try {
  ca = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const xd = ca;
function _d() {
}
class bd extends yd {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(t) {
    if (super(t), typeof location < "u") {
      const e = location.protocol === "https:";
      let s = location.port;
      s || (s = e ? "443" : "80"), this.xd = typeof location < "u" && t.hostname !== location.hostname || s !== t.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(t, e) {
    const s = this.request({
      method: "POST",
      data: t
    });
    s.on("success", e), s.on("error", (r, n) => {
      this.onError("xhr post error", r, n);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const t = this.request();
    t.on("data", this.onData.bind(this)), t.on("error", (e, s) => {
      this.onError("xhr poll error", e, s);
    }), this.pollXhr = t;
  }
}
class Vt extends _t {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(t, e, s) {
    super(), this.createRequest = t, Is(this, s), this._opts = s, this._method = s.method || "GET", this._uri = e, this._data = s.data !== void 0 ? s.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var t;
    const e = ha(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    e.xdomain = !!this._opts.xd;
    const s = this._xhr = this.createRequest(e);
    try {
      s.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          s.setDisableHeaderCheck && s.setDisableHeaderCheck(!0);
          for (let r in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(r) && s.setRequestHeader(r, this._opts.extraHeaders[r]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          s.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        s.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (t = this._opts.cookieJar) === null || t === void 0 || t.addCookies(s), "withCredentials" in s && (s.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (s.timeout = this._opts.requestTimeout), s.onreadystatechange = () => {
        var r;
        s.readyState === 3 && ((r = this._opts.cookieJar) === null || r === void 0 || r.parseCookies(
          // @ts-ignore
          s.getResponseHeader("set-cookie")
        )), s.readyState === 4 && (s.status === 200 || s.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof s.status == "number" ? s.status : 0);
        }, 0));
      }, s.send(this._data);
    } catch (r) {
      this.setTimeoutFn(() => {
        this._onError(r);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = Vt.requestsCount++, Vt.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(t) {
    this.emitReserved("error", t, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(t) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = _d, t)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete Vt.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const t = this._xhr.responseText;
    t !== null && (this.emitReserved("data", t), this.emitReserved("success"), this._cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
}
Vt.requestsCount = 0;
Vt.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", Mn);
  else if (typeof addEventListener == "function") {
    const i = "onpagehide" in Ft ? "pagehide" : "unload";
    addEventListener(i, Mn, !1);
  }
}
function Mn() {
  for (let i in Vt.requests)
    Vt.requests.hasOwnProperty(i) && Vt.requests[i].abort();
}
const wd = function() {
  const i = ua({
    xdomain: !1
  });
  return i && i.responseType !== null;
}();
class vd extends bd {
  constructor(t) {
    super(t);
    const e = t && t.forceBase64;
    this.supportsBinary = wd && !e;
  }
  request(t = {}) {
    return Object.assign(t, { xd: this.xd }, this.opts), new Vt(ua, this.uri(), t);
  }
}
function ua(i) {
  const t = i.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!t || xd))
      return new XMLHttpRequest();
  } catch {
  }
  if (!t)
    try {
      return new Ft[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const da = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Md extends sr {
  get name() {
    return "websocket";
  }
  doOpen() {
    const t = this.uri(), e = this.opts.protocols, s = da ? {} : ha(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (s.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(t, e, s);
    } catch (r) {
      return this.emitReserved("error", r);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (t) => this.onClose({
      description: "websocket connection closed",
      context: t
    }), this.ws.onmessage = (t) => this.onData(t.data), this.ws.onerror = (t) => this.onError("websocket error", t);
  }
  write(t) {
    this.writable = !1;
    for (let e = 0; e < t.length; e++) {
      const s = t[e], r = e === t.length - 1;
      tr(s, this.supportsBinary, (n) => {
        try {
          this.doWrite(s, n);
        } catch {
        }
        r && Ps(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.onerror = () => {
    }, this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const t = this.opts.secure ? "wss" : "ws", e = this.query || {};
    return this.opts.timestampRequests && (e[this.opts.timestampParam] = la()), this.supportsBinary || (e.b64 = 1), this.createUri(t, e);
  }
}
const pi = Ft.WebSocket || Ft.MozWebSocket;
class Sd extends Md {
  createSocket(t, e, s) {
    return da ? new pi(t, e, s) : e ? new pi(t, e) : new pi(t);
  }
  doWrite(t, e) {
    this.ws.send(e);
  }
}
class Ad extends sr {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (t) {
      return this.emitReserved("error", t);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((t) => {
      this.onError("webtransport error", t);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((t) => {
        const e = od(Number.MAX_SAFE_INTEGER, this.socket.binaryType), s = t.readable.pipeThrough(e).getReader(), r = nd();
        r.readable.pipeTo(t.writable), this._writer = r.writable.getWriter();
        const n = () => {
          s.read().then(({ done: a, value: h }) => {
            a || (this.onPacket(h), n());
          }).catch((a) => {
          });
        };
        n();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this._writer.write(o).then(() => this.onOpen());
      });
    });
  }
  write(t) {
    this.writable = !1;
    for (let e = 0; e < t.length; e++) {
      const s = t[e], r = e === t.length - 1;
      this._writer.write(s).then(() => {
        r && Ps(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var t;
    (t = this._transport) === null || t === void 0 || t.close();
  }
}
const Cd = {
  websocket: Sd,
  webtransport: Ad,
  polling: vd
}, Td = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Pd = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function Oi(i) {
  if (i.length > 8e3)
    throw "URI too long";
  const t = i, e = i.indexOf("["), s = i.indexOf("]");
  e != -1 && s != -1 && (i = i.substring(0, e) + i.substring(e, s).replace(/:/g, ";") + i.substring(s, i.length));
  let r = Td.exec(i || ""), n = {}, o = 14;
  for (; o--; )
    n[Pd[o]] = r[o] || "";
  return e != -1 && s != -1 && (n.source = t, n.host = n.host.substring(1, n.host.length - 1).replace(/;/g, ":"), n.authority = n.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), n.ipv6uri = !0), n.pathNames = Id(n, n.path), n.queryKey = kd(n, n.query), n;
}
function Id(i, t) {
  const e = /\/{2,9}/g, s = t.replace(e, "/").split("/");
  return (t.slice(0, 1) == "/" || t.length === 0) && s.splice(0, 1), t.slice(-1) == "/" && s.splice(s.length - 1, 1), s;
}
function kd(i, t) {
  const e = {};
  return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(s, r, n) {
    r && (e[r] = n);
  }), e;
}
const Ri = typeof addEventListener == "function" && typeof removeEventListener == "function", ms = [];
Ri && addEventListener("offline", () => {
  ms.forEach((i) => i());
}, !1);
class ee extends _t {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(t, e) {
    if (super(), this.binaryType = hd, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, t && typeof t == "object" && (e = t, t = null), t) {
      const s = Oi(t);
      e.hostname = s.host, e.secure = s.protocol === "https" || s.protocol === "wss", e.port = s.port, s.query && (e.query = s.query);
    } else e.host && (e.hostname = Oi(e.host).host);
    Is(this, e), this.secure = e.secure != null ? e.secure : typeof location < "u" && location.protocol === "https:", e.hostname && !e.port && (e.port = this.secure ? "443" : "80"), this.hostname = e.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = e.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, e.transports.forEach((s) => {
      const r = s.prototype.name;
      this.transports.push(r), this._transportsByName[r] = s;
    }), this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, e), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = md(this.opts.query)), Ri && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, ms.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(t) {
    const e = Object.assign({}, this.opts.query);
    e.EIO = aa, e.transport = t, this.id && (e.sid = this.id);
    const s = Object.assign({}, this.opts, {
      query: e,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[t]);
    return new this._transportsByName[t](s);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const t = this.opts.rememberUpgrade && ee.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const e = this.createTransport(t);
    e.open(), this.setTransport(e);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(t) {
    this.transport && this.transport.removeAllListeners(), this.transport = t, t.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (e) => this._onClose("transport close", e));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open", ee.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(t) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", t), this.emitReserved("heartbeat"), t.type) {
        case "open":
          this.onHandshake(JSON.parse(t.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const e = new Error("server error");
          e.code = t.data, this._onError(e);
          break;
        case "message":
          this.emitReserved("data", t.data), this.emitReserved("message", t.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(t) {
    this.emitReserved("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this._pingInterval = t.pingInterval, this._pingTimeout = t.pingTimeout, this._maxPayload = t.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const t = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + t, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, t), this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const t = this._getWritablePackets();
      this.transport.send(t), this._prevBufferLen = t.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let e = 1;
    for (let s = 0; s < this.writeBuffer.length; s++) {
      const r = this.writeBuffer[s].data;
      if (r && (e += dd(r)), s > 0 && e > this._maxPayload)
        return this.writeBuffer.slice(0, s);
      e += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return !0;
    const t = Date.now() > this._pingTimeoutTime;
    return t && (this._pingTimeoutTime = 0, Ps(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), t;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(t, e, s) {
    return this._sendPacket("message", t, e, s), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(t, e, s) {
    return this._sendPacket("message", t, e, s), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(t, e, s, r) {
    if (typeof e == "function" && (r = e, e = void 0), typeof s == "function" && (r = s, s = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    s = s || {}, s.compress = s.compress !== !1;
    const n = {
      type: t,
      data: e,
      options: s
    };
    this.emitReserved("packetCreate", n), this.writeBuffer.push(n), r && this.once("flush", r), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const t = () => {
      this._onClose("forced close"), this.transport.close();
    }, e = () => {
      this.off("upgrade", e), this.off("upgradeError", e), t();
    }, s = () => {
      this.once("upgrade", e), this.once("upgradeError", e);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? s() : t();
    }) : this.upgrading ? s() : t()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(t) {
    if (ee.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return this.transports.shift(), this._open();
    this.emitReserved("error", t), this._onClose("transport error", t);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(t, e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), Ri && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const s = ms.indexOf(this._offlineEventListener);
        s !== -1 && ms.splice(s, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", t, e), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
ee.protocol = aa;
class Ed extends ee {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade)
      for (let t = 0; t < this._upgrades.length; t++)
        this._probe(this._upgrades[t]);
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(t) {
    let e = this.createTransport(t), s = !1;
    ee.priorWebsocketSuccess = !1;
    const r = () => {
      s || (e.send([{ type: "ping", data: "probe" }]), e.once("packet", (u) => {
        if (!s)
          if (u.type === "pong" && u.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", e), !e)
              return;
            ee.priorWebsocketSuccess = e.name === "websocket", this.transport.pause(() => {
              s || this.readyState !== "closed" && (l(), this.setTransport(e), e.send([{ type: "upgrade" }]), this.emitReserved("upgrade", e), e = null, this.upgrading = !1, this.flush());
            });
          } else {
            const f = new Error("probe error");
            f.transport = e.name, this.emitReserved("upgradeError", f);
          }
      }));
    };
    function n() {
      s || (s = !0, l(), e.close(), e = null);
    }
    const o = (u) => {
      const f = new Error("probe error: " + u);
      f.transport = e.name, n(), this.emitReserved("upgradeError", f);
    };
    function a() {
      o("transport closed");
    }
    function h() {
      o("socket closed");
    }
    function c(u) {
      e && u.name !== e.name && n();
    }
    const l = () => {
      e.removeListener("open", r), e.removeListener("error", o), e.removeListener("close", a), this.off("close", h), this.off("upgrading", c);
    };
    e.once("open", r), e.once("error", o), e.once("close", a), this.once("close", h), this.once("upgrading", c), this._upgrades.indexOf("webtransport") !== -1 && t !== "webtransport" ? this.setTimeoutFn(() => {
      s || e.open();
    }, 200) : e.open();
  }
  onHandshake(t) {
    this._upgrades = this._filterUpgrades(t.upgrades), super.onHandshake(t);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(t) {
    const e = [];
    for (let s = 0; s < t.length; s++)
      ~this.transports.indexOf(t[s]) && e.push(t[s]);
    return e;
  }
}
let Ld = class extends Ed {
  constructor(t, e = {}) {
    const s = typeof t == "object" ? t : e;
    (!s.transports || s.transports && typeof s.transports[0] == "string") && (s.transports = (s.transports || ["polling", "websocket", "webtransport"]).map((r) => Cd[r]).filter((r) => !!r)), super(t, s);
  }
};
function Bd(i, t = "", e) {
  let s = i;
  e = e || typeof location < "u" && location, i == null && (i = e.protocol + "//" + e.host), typeof i == "string" && (i.charAt(0) === "/" && (i.charAt(1) === "/" ? i = e.protocol + i : i = e.host + i), /^(https?|wss?):\/\//.test(i) || (typeof e < "u" ? i = e.protocol + "//" + i : i = "https://" + i), s = Oi(i)), s.port || (/^(http|ws)$/.test(s.protocol) ? s.port = "80" : /^(http|ws)s$/.test(s.protocol) && (s.port = "443")), s.path = s.path || "/";
  const n = s.host.indexOf(":") !== -1 ? "[" + s.host + "]" : s.host;
  return s.id = s.protocol + "://" + n + ":" + s.port + t, s.href = s.protocol + "://" + n + (e && e.port === s.port ? "" : ":" + s.port), s;
}
const Nd = typeof ArrayBuffer == "function", Fd = (i) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(i) : i.buffer instanceof ArrayBuffer, fa = Object.prototype.toString, Od = typeof Blob == "function" || typeof Blob < "u" && fa.call(Blob) === "[object BlobConstructor]", Rd = typeof File == "function" || typeof File < "u" && fa.call(File) === "[object FileConstructor]";
function ir(i) {
  return Nd && (i instanceof ArrayBuffer || Fd(i)) || Od && i instanceof Blob || Rd && i instanceof File;
}
function gs(i, t) {
  if (!i || typeof i != "object")
    return !1;
  if (Array.isArray(i)) {
    for (let e = 0, s = i.length; e < s; e++)
      if (gs(i[e]))
        return !0;
    return !1;
  }
  if (ir(i))
    return !0;
  if (i.toJSON && typeof i.toJSON == "function" && arguments.length === 1)
    return gs(i.toJSON(), !0);
  for (const e in i)
    if (Object.prototype.hasOwnProperty.call(i, e) && gs(i[e]))
      return !0;
  return !1;
}
function zd(i) {
  const t = [], e = i.data, s = i;
  return s.data = zi(e, t), s.attachments = t.length, { packet: s, buffers: t };
}
function zi(i, t) {
  if (!i)
    return i;
  if (ir(i)) {
    const e = { _placeholder: !0, num: t.length };
    return t.push(i), e;
  } else if (Array.isArray(i)) {
    const e = new Array(i.length);
    for (let s = 0; s < i.length; s++)
      e[s] = zi(i[s], t);
    return e;
  } else if (typeof i == "object" && !(i instanceof Date)) {
    const e = {};
    for (const s in i)
      Object.prototype.hasOwnProperty.call(i, s) && (e[s] = zi(i[s], t));
    return e;
  }
  return i;
}
function Dd(i, t) {
  return i.data = Di(i.data, t), delete i.attachments, i;
}
function Di(i, t) {
  if (!i)
    return i;
  if (i && i._placeholder === !0) {
    if (typeof i.num == "number" && i.num >= 0 && i.num < t.length)
      return t[i.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(i))
    for (let e = 0; e < i.length; e++)
      i[e] = Di(i[e], t);
  else if (typeof i == "object")
    for (const e in i)
      Object.prototype.hasOwnProperty.call(i, e) && (i[e] = Di(i[e], t));
  return i;
}
const jd = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], Gd = 5;
var J;
(function(i) {
  i[i.CONNECT = 0] = "CONNECT", i[i.DISCONNECT = 1] = "DISCONNECT", i[i.EVENT = 2] = "EVENT", i[i.ACK = 3] = "ACK", i[i.CONNECT_ERROR = 4] = "CONNECT_ERROR", i[i.BINARY_EVENT = 5] = "BINARY_EVENT", i[i.BINARY_ACK = 6] = "BINARY_ACK";
})(J || (J = {}));
class Wd {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(t) {
    this.replacer = t;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(t) {
    return (t.type === J.EVENT || t.type === J.ACK) && gs(t) ? this.encodeAsBinary({
      type: t.type === J.EVENT ? J.BINARY_EVENT : J.BINARY_ACK,
      nsp: t.nsp,
      data: t.data,
      id: t.id
    }) : [this.encodeAsString(t)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(t) {
    let e = "" + t.type;
    return (t.type === J.BINARY_EVENT || t.type === J.BINARY_ACK) && (e += t.attachments + "-"), t.nsp && t.nsp !== "/" && (e += t.nsp + ","), t.id != null && (e += t.id), t.data != null && (e += JSON.stringify(t.data, this.replacer)), e;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(t) {
    const e = zd(t), s = this.encodeAsString(e.packet), r = e.buffers;
    return r.unshift(s), r;
  }
}
function Sn(i) {
  return Object.prototype.toString.call(i) === "[object Object]";
}
class rr extends _t {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(t) {
    super(), this.reviver = t;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(t) {
    let e;
    if (typeof t == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      e = this.decodeString(t);
      const s = e.type === J.BINARY_EVENT;
      s || e.type === J.BINARY_ACK ? (e.type = s ? J.EVENT : J.ACK, this.reconstructor = new $d(e), e.attachments === 0 && super.emitReserved("decoded", e)) : super.emitReserved("decoded", e);
    } else if (ir(t) || t.base64)
      if (this.reconstructor)
        e = this.reconstructor.takeBinaryData(t), e && (this.reconstructor = null, super.emitReserved("decoded", e));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + t);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(t) {
    let e = 0;
    const s = {
      type: Number(t.charAt(0))
    };
    if (J[s.type] === void 0)
      throw new Error("unknown packet type " + s.type);
    if (s.type === J.BINARY_EVENT || s.type === J.BINARY_ACK) {
      const n = e + 1;
      for (; t.charAt(++e) !== "-" && e != t.length; )
        ;
      const o = t.substring(n, e);
      if (o != Number(o) || t.charAt(e) !== "-")
        throw new Error("Illegal attachments");
      s.attachments = Number(o);
    }
    if (t.charAt(e + 1) === "/") {
      const n = e + 1;
      for (; ++e && !(t.charAt(e) === "," || e === t.length); )
        ;
      s.nsp = t.substring(n, e);
    } else
      s.nsp = "/";
    const r = t.charAt(e + 1);
    if (r !== "" && Number(r) == r) {
      const n = e + 1;
      for (; ++e; ) {
        const o = t.charAt(e);
        if (o == null || Number(o) != o) {
          --e;
          break;
        }
        if (e === t.length)
          break;
      }
      s.id = Number(t.substring(n, e + 1));
    }
    if (t.charAt(++e)) {
      const n = this.tryParse(t.substr(e));
      if (rr.isPayloadValid(s.type, n))
        s.data = n;
      else
        throw new Error("invalid payload");
    }
    return s;
  }
  tryParse(t) {
    try {
      return JSON.parse(t, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(t, e) {
    switch (t) {
      case J.CONNECT:
        return Sn(e);
      case J.DISCONNECT:
        return e === void 0;
      case J.CONNECT_ERROR:
        return typeof e == "string" || Sn(e);
      case J.EVENT:
      case J.BINARY_EVENT:
        return Array.isArray(e) && (typeof e[0] == "number" || typeof e[0] == "string" && jd.indexOf(e[0]) === -1);
      case J.ACK:
      case J.BINARY_ACK:
        return Array.isArray(e);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class $d {
  constructor(t) {
    this.packet = t, this.buffers = [], this.reconPack = t;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(t) {
    if (this.buffers.push(t), this.buffers.length === this.reconPack.attachments) {
      const e = Dd(this.reconPack, this.buffers);
      return this.finishedReconstruction(), e;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const Ud = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: rr,
  Encoder: Wd,
  get PacketType() {
    return J;
  },
  protocol: Gd
}, Symbol.toStringTag, { value: "Module" }));
function Gt(i, t, e) {
  return i.on(t, e), function() {
    i.off(t, e);
  };
}
const Hd = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class pa extends _t {
  /**
   * `Socket` constructor.
   */
  constructor(t, e, s) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = t, this.nsp = e, s && s.auth && (this.auth = s.auth), this._opts = Object.assign({}, s), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const t = this.io;
    this.subs = [
      Gt(t, "open", this.onopen.bind(this)),
      Gt(t, "packet", this.onpacket.bind(this)),
      Gt(t, "error", this.onerror.bind(this)),
      Gt(t, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...t) {
    return t.unshift("message"), this.emit.apply(this, t), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(t, ...e) {
    var s, r, n;
    if (Hd.hasOwnProperty(t))
      throw new Error('"' + t.toString() + '" is a reserved event name');
    if (e.unshift(t), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(e), this;
    const o = {
      type: J.EVENT,
      data: e
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof e[e.length - 1] == "function") {
      const l = this.ids++, u = e.pop();
      this._registerAckCallback(l, u), o.id = l;
    }
    const a = (r = (s = this.io.engine) === null || s === void 0 ? void 0 : s.transport) === null || r === void 0 ? void 0 : r.writable, h = this.connected && !(!((n = this.io.engine) === null || n === void 0) && n._hasPingExpired());
    return this.flags.volatile && !a || (h ? (this.notifyOutgoingListeners(o), this.packet(o)) : this.sendBuffer.push(o)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(t, e) {
    var s;
    const r = (s = this.flags.timeout) !== null && s !== void 0 ? s : this._opts.ackTimeout;
    if (r === void 0) {
      this.acks[t] = e;
      return;
    }
    const n = this.io.setTimeoutFn(() => {
      delete this.acks[t];
      for (let a = 0; a < this.sendBuffer.length; a++)
        this.sendBuffer[a].id === t && this.sendBuffer.splice(a, 1);
      e.call(this, new Error("operation has timed out"));
    }, r), o = (...a) => {
      this.io.clearTimeoutFn(n), e.apply(this, a);
    };
    o.withError = !0, this.acks[t] = o;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(t, ...e) {
    return new Promise((s, r) => {
      const n = (o, a) => o ? r(o) : s(a);
      n.withError = !0, e.push(n), this.emit(t, ...e);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(t) {
    let e;
    typeof t[t.length - 1] == "function" && (e = t.pop());
    const s = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: t,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    t.push((r, ...n) => s !== this._queue[0] ? void 0 : (r !== null ? s.tryCount > this._opts.retries && (this._queue.shift(), e && e(r)) : (this._queue.shift(), e && e(null, ...n)), s.pending = !1, this._drainQueue())), this._queue.push(s), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(t = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const e = this._queue[0];
    e.pending && !t || (e.pending = !0, e.tryCount++, this.flags = e.flags, this.emit.apply(this, e.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(t) {
    t.nsp = this.nsp, this.io._packet(t);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((t) => {
      this._sendConnectPacket(t);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(t) {
    this.packet({
      type: J.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, t) : t
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(t) {
    this.connected || this.emitReserved("connect_error", t);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(t, e) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", t, e), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((t) => {
      if (!this.sendBuffer.some((s) => String(s.id) === t)) {
        const s = this.acks[t];
        delete this.acks[t], s.withError && s.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(t) {
    if (t.nsp === this.nsp)
      switch (t.type) {
        case J.CONNECT:
          t.data && t.data.sid ? this.onconnect(t.data.sid, t.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case J.EVENT:
        case J.BINARY_EVENT:
          this.onevent(t);
          break;
        case J.ACK:
        case J.BINARY_ACK:
          this.onack(t);
          break;
        case J.DISCONNECT:
          this.ondisconnect();
          break;
        case J.CONNECT_ERROR:
          this.destroy();
          const s = new Error(t.data.message);
          s.data = t.data.data, this.emitReserved("connect_error", s);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(t) {
    const e = t.data || [];
    t.id != null && e.push(this.ack(t.id)), this.connected ? this.emitEvent(e) : this.receiveBuffer.push(Object.freeze(e));
  }
  emitEvent(t) {
    if (this._anyListeners && this._anyListeners.length) {
      const e = this._anyListeners.slice();
      for (const s of e)
        s.apply(this, t);
    }
    super.emit.apply(this, t), this._pid && t.length && typeof t[t.length - 1] == "string" && (this._lastOffset = t[t.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(t) {
    const e = this;
    let s = !1;
    return function(...r) {
      s || (s = !0, e.packet({
        type: J.ACK,
        id: t,
        data: r
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(t) {
    const e = this.acks[t.id];
    typeof e == "function" && (delete this.acks[t.id], e.withError && t.data.unshift(null), e.apply(this, t.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(t, e) {
    this.id = t, this.recovered = e && this._pid === e, this._pid = e, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((t) => this.emitEvent(t)), this.receiveBuffer = [], this.sendBuffer.forEach((t) => {
      this.notifyOutgoingListeners(t), this.packet(t);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((t) => t()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: J.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(t) {
    return this.flags.compress = t, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(t) {
    return this.flags.timeout = t, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(t) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(t), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(t) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(t), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(t) {
    if (!this._anyListeners)
      return this;
    if (t) {
      const e = this._anyListeners;
      for (let s = 0; s < e.length; s++)
        if (t === e[s])
          return e.splice(s, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(t) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(t), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(t) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(t), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(t) {
    if (!this._anyOutgoingListeners)
      return this;
    if (t) {
      const e = this._anyOutgoingListeners;
      for (let s = 0; s < e.length; s++)
        if (t === e[s])
          return e.splice(s, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(t) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const e = this._anyOutgoingListeners.slice();
      for (const s of e)
        s.apply(this, t.data);
    }
  }
}
function Te(i) {
  i = i || {}, this.ms = i.min || 100, this.max = i.max || 1e4, this.factor = i.factor || 2, this.jitter = i.jitter > 0 && i.jitter <= 1 ? i.jitter : 0, this.attempts = 0;
}
Te.prototype.duration = function() {
  var i = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var t = Math.random(), e = Math.floor(t * this.jitter * i);
    i = Math.floor(t * 10) & 1 ? i + e : i - e;
  }
  return Math.min(i, this.max) | 0;
};
Te.prototype.reset = function() {
  this.attempts = 0;
};
Te.prototype.setMin = function(i) {
  this.ms = i;
};
Te.prototype.setMax = function(i) {
  this.max = i;
};
Te.prototype.setJitter = function(i) {
  this.jitter = i;
};
class ji extends _t {
  constructor(t, e) {
    var s;
    super(), this.nsps = {}, this.subs = [], t && typeof t == "object" && (e = t, t = void 0), e = e || {}, e.path = e.path || "/socket.io", this.opts = e, Is(this, e), this.reconnection(e.reconnection !== !1), this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), this.reconnectionDelay(e.reconnectionDelay || 1e3), this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), this.randomizationFactor((s = e.randomizationFactor) !== null && s !== void 0 ? s : 0.5), this.backoff = new Te({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(e.timeout == null ? 2e4 : e.timeout), this._readyState = "closed", this.uri = t;
    const r = e.parser || Ud;
    this.encoder = new r.Encoder(), this.decoder = new r.Decoder(), this._autoConnect = e.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(t) {
    return arguments.length ? (this._reconnection = !!t, t || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(t) {
    return t === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = t, this);
  }
  reconnectionDelay(t) {
    var e;
    return t === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = t, (e = this.backoff) === null || e === void 0 || e.setMin(t), this);
  }
  randomizationFactor(t) {
    var e;
    return t === void 0 ? this._randomizationFactor : (this._randomizationFactor = t, (e = this.backoff) === null || e === void 0 || e.setJitter(t), this);
  }
  reconnectionDelayMax(t) {
    var e;
    return t === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = t, (e = this.backoff) === null || e === void 0 || e.setMax(t), this);
  }
  timeout(t) {
    return arguments.length ? (this._timeout = t, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(t) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new Ld(this.uri, this.opts);
    const e = this.engine, s = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const r = Gt(e, "open", function() {
      s.onopen(), t && t();
    }), n = (a) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", a), t ? t(a) : this.maybeReconnectOnOpen();
    }, o = Gt(e, "error", n);
    if (this._timeout !== !1) {
      const a = this._timeout, h = this.setTimeoutFn(() => {
        r(), n(new Error("timeout")), e.close();
      }, a);
      this.opts.autoUnref && h.unref(), this.subs.push(() => {
        this.clearTimeoutFn(h);
      });
    }
    return this.subs.push(r), this.subs.push(o), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(t) {
    return this.open(t);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const t = this.engine;
    this.subs.push(
      Gt(t, "ping", this.onping.bind(this)),
      Gt(t, "data", this.ondata.bind(this)),
      Gt(t, "error", this.onerror.bind(this)),
      Gt(t, "close", this.onclose.bind(this)),
      // @ts-ignore
      Gt(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(t) {
    try {
      this.decoder.add(t);
    } catch (e) {
      this.onclose("parse error", e);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(t) {
    Ps(() => {
      this.emitReserved("packet", t);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(t) {
    this.emitReserved("error", t);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(t, e) {
    let s = this.nsps[t];
    return s ? this._autoConnect && !s.active && s.connect() : (s = new pa(this, t, e), this.nsps[t] = s), s;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(t) {
    const e = Object.keys(this.nsps);
    for (const s of e)
      if (this.nsps[s].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(t) {
    const e = this.encoder.encode(t);
    for (let s = 0; s < e.length; s++)
      this.engine.write(e[s], t.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((t) => t()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(t, e) {
    var s;
    this.cleanup(), (s = this.engine) === null || s === void 0 || s.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", t, e), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const t = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const e = this.backoff.duration();
      this._reconnecting = !0;
      const s = this.setTimeoutFn(() => {
        t.skipReconnect || (this.emitReserved("reconnect_attempt", t.backoff.attempts), !t.skipReconnect && t.open((r) => {
          r ? (t._reconnecting = !1, t.reconnect(), this.emitReserved("reconnect_error", r)) : t.onreconnect();
        }));
      }, e);
      this.opts.autoUnref && s.unref(), this.subs.push(() => {
        this.clearTimeoutFn(s);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const t = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", t);
  }
}
const Le = {};
function ys(i, t) {
  typeof i == "object" && (t = i, i = void 0), t = t || {};
  const e = Bd(i, t.path || "/socket.io"), s = e.source, r = e.id, n = e.path, o = Le[r] && n in Le[r].nsps, a = t.forceNew || t["force new connection"] || t.multiplex === !1 || o;
  let h;
  return a ? h = new ji(s, t) : (Le[r] || (Le[r] = new ji(s, t)), h = Le[r]), e.query && !t.query && (t.query = e.queryKey), h.socket(e.path, t);
}
Object.assign(ys, {
  Manager: ji,
  Socket: pa,
  io: ys,
  connect: ys
});
class Ge {
  constructor(t = {}, e) {
    this.hPlg = t, this.arg = e;
  }
  hFactoryCls = {};
  elc = new Zu();
  async loaded(...[t]) {
    bt.add(this.#s), bt.add(this.#i), this.arg.crypto && (bt.add(this.#t), bt.add(this.#e));
    const e = t.snsys_pre;
    return delete t.snsys_pre, e?.init({
      getInfo: this.#c,
      addTag: () => {
      },
      addLayCls: () => {
      },
      searchPath: () => "",
      getVal: () => ({}),
      resume: () => {
      },
      render: () => {
      },
      setDec: (s) => this.dec = s,
      setDecAB: (s) => this.#b = s,
      setEnc: (s) => this.enc = s,
      getStK: (s) => this.stk = s,
      getHash: (s) => this.hash = s
    });
  }
  fetch = (t, e) => fetch(t, e);
  destroy() {
    this.elc.clear();
  }
  #t = {
    // 画像、音声、アニメスプライト画像
    extension: {
      type: U.LoadParser,
      name: "binpic-dec-loader",
      priority: qt.High
    },
    test: (t) => /\.(?:bin|jpe?g|png)$/.test(t),
    load: (t) => new Promise(async (e, s) => {
      t.endsWith(".bin") || (t = this.cfg.searchPath(ea(t), we.SP_GSM));
      const r = await this.fetch(t);
      if (!r.ok) {
        s("binpic-dec-loader fetch err:" + r.statusText);
        return;
      }
      try {
        const n = await this.decAB(await r.arrayBuffer());
        if (n instanceof HTMLElement) {
          const o = tt.from(n);
          e(o);
          return;
        }
        e(n);
      } catch (n) {
        s(`binpic-dec-loader err url:${t} ${n}`);
      }
    })
  };
  #e = {
    // アニメスプライトjson
    extension: {
      type: U.LoadParser,
      name: "json-dec-loader",
      priority: qt.High
    },
    test: (t) => t.endsWith(".json"),
    load: (t) => new Promise(async (e, s) => {
      const r = await this.fetch(t);
      if (!r.ok) {
        s("json-dec-loader fetch err:" + r.statusText);
        return;
      }
      try {
        e(JSON.parse(await this.dec("json", await r.text())));
      } catch (n) {
        s(`json-dec-loader err url:${t} ${n}`);
      }
    })
  };
  #i = {
    // htm
    extension: {
      type: U.LoadParser,
      name: "htm-loader"
      //priority: LoaderParserPriority.High,
    },
    test: (t) => /\.html?$/.test(t),
    load: (t) => new Promise(async (e, s) => {
      const r = await this.fetch(t);
      if (!r.ok) {
        s("htm-loader fetch err:" + r.statusText);
        return;
      }
      try {
        e(await this.dec("htm", await r.text()));
      } catch (n) {
        s(`htm-loader err url:${t} ${n}`);
      }
    })
  };
  #s = {
    extension: {
      type: U.LoadParser,
      name: "sn-loader"
      //priority: LoaderParserPriority.High,
    },
    test: (t) => t.endsWith(".sn"),
    load: (t) => new Promise(async (e, s) => {
      const r = await this.fetch(t);
      if (!r.ok) {
        s("sn-loader fetch err:" + r.statusText);
        return;
      }
      try {
        e(await this.dec("sn", await r.text()));
      } catch (n) {
        s(`sn-loader err url:${t} ${n}`);
      }
    })
  };
  resolution = 1;
  cfg;
  async loadPath(t, e) {
    this.cfg = e;
  }
  data = { sys: {}, mark: {}, kidoku: {} };
  async initVal(t, e, s) {
  }
  flush() {
    if (this.#h) {
      this.#a = !0;
      return;
    }
    this.flushSub(), this.#h = setTimeout(() => {
      this.#h = void 0, this.#a && (this.#a = !1, this.flush());
    }, 500);
  }
  #h = void 0;
  #a = !1;
  flushSub() {
  }
  async run() {
  }
  val;
  main;
  init(t, e, s, r) {
    this.val = s, this.main = r;
    let n = "";
    try {
      s.setSys(this), n = "sys", n += Number(s.getVal("sys:TextLayer.Back.Alpha", 1)), n = "kidoku", s.saveKidoku();
    } catch (o) {
      console.error(`セーブデータ（${n}）が壊れています。一度クリアする必要があります(b) %o`, o);
    }
    return t.close = (o) => this.close(o), t.export = (o) => this._export(o), t.import = (o) => this._import(o), t.navigate_to = (o) => this.navigate_to(o), t.title = (o) => this.title(o), t.toggle_full_screen = (o) => this.#M(o), t.update_check = (o) => this.update_check(o), t.window = (o) => this.window(o), s.setVal_Nochk("tmp", "const.sn.isApp", () => this.isApp), s.setVal_Nochk("tmp", "const.sn.isDbg", () => j.isDbg), s.setVal_Nochk("tmp", "const.sn.isPackaged", () => j.isPackaged), s.defTmp("const.sn.displayState", () => this.isFullScr), s.setVal_Nochk("sys", Ge.VALNM_CFG_NS, this.cfg.oCfg.save_ns), s.flush(), j.isDbg && this.attach_debug(r), this.hFactoryCls = {}, Object.values(this.hPlg).map((o) => o.init({
      getInfo: this.#c,
      addTag: (a, h) => {
        if (t[a]) throw `すでに定義済みのタグ[${a}]です`;
        t[a] = h;
      },
      addLayCls: (a, h) => {
        if (this.hFactoryCls[a]) throw `すでに定義済みのレイヤcls【${a}】です`;
        this.hFactoryCls[a] = h;
      },
      searchPath: (a, h = we.DEFAULT) => this.cfg.searchPath(a, h),
      getVal: s.getVal,
      resume: () => r.resume(),
      render: (a, h, c = !1) => e.renderer.render({ container: a, target: h, clear: c }),
      setDec: () => {
      },
      setDecAB: () => {
      },
      setEnc: () => {
      },
      getStK: () => {
      },
      getHash: () => {
      }
    }));
  }
  static VALNM_CFG_NS = "const.sn.cfg.ns";
  #c = () => ({
    window: {
      width: j.stageW,
      height: j.stageH
    }
  });
  #n = 0;
  #o = 0;
  #r = 1;
  #l = 0;
  #u = 0;
  #d = 0;
  #f = 0;
  get cvsWidth() {
    return this.#n;
  }
  get cvsHeight() {
    return this.#o;
  }
  get cvsScale() {
    return this.#r;
  }
  get ofsLeft4elm() {
    return this.#l;
  }
  get ofsTop4elm() {
    return this.#u;
  }
  get ofsPadLeft_Dom2PIXI() {
    return this.#d;
  }
  get ofsPadTop_Dom2PIXI() {
    return this.#f;
  }
  isFullScr = !1;
  cvsResize() {
    let t = globalThis.innerWidth, e = globalThis.innerHeight;
    const s = this.main.cvs, r = s.parentElement !== document.body;
    if (r) {
      const h = globalThis.getComputedStyle(s);
      t = parseFloat(h.width), e = parseFloat(h.height);
    }
    if (j.isMobile) {
      const c = (screen.orientation?.angle ?? 0) % 180 === 0;
      (c && t > e || !c && t < e) && ([t, e] = [e, t]);
    }
    const n = s.getBoundingClientRect();
    if (ht(j.hDip, "expanding", !0) || r || j.stageW > t || j.stageH > e)
      if (j.stageW / j.stageH <= t / e ? (this.#o = e, this.#n = j.stageW / j.stageH * e) : (this.#n = t, this.#o = j.stageH / j.stageW * t), this.#r = this.#n / j.stageW, r)
        this.#d = 0, this.#f = 0;
      else {
        const h = 1 - this.#r;
        j.isMobile ? (this.#d = (t - this.#n) / 2 * h, this.#f = (e - this.#o) / 2 * h) : (this.#d = n.left * h, this.#f = n.top * h);
      }
    else
      this.#n = j.stageW, this.#o = j.stageH, this.#r = 1, this.#d = 0, this.#f = 0;
    const o = s.parentElement.style;
    r || (o.position = "relative", o.width = `${this.#n}px`, o.height = `${this.#o}px`);
    const a = s.style;
    a.width = o.width, a.height = o.height, r ? (this.#l = n.left, this.#u = n.top) : (this.#l = 0, this.#u = 0), this.isFullScr && (this.#l += (t - this.#n) / 2, this.#u += (e - this.#o) / 2);
  }
  // デバッガ接続
  attach_debug(t) {
    this.attach_debug = () => {
    };
    const e = document.createElement("style");
    e.innerHTML = `/* SKYNovel Dbg */
.sn_BounceInOut { animation: sn_kfBounceInOut linear 1.5s; }
@keyframes sn_kfBounceInOut{
0%	{opacity: 0;	transform: scaleX(0.30) scaleY(0.30);}
10%	{opacity: 1;	transform: scaleX(1.10) scaleY(1.10);}
20%	{				transform: scaleX(0.95) scaleY(0.95);}
30%	{				transform: scaleX(1.00) scaleY(1.00);}
70%	{opacity: 1;}
100%{opacity: 0;}
}
.sn_BounceIn { animation: sn_kfBounceIn linear 0.3s; }
@keyframes sn_kfBounceIn{
0%	{opacity: 0;	transform: scaleX(0.30) scaleY(0.30);}
50%	{opacity: 1;	transform: scaleX(1.10) scaleY(1.10);}
100%{				transform: scaleX(0.95) scaleY(0.95);}
}
.sn_HopIn { animation: sn_kfHopIn linear 0.8s; }
@keyframes sn_kfHopIn{
0%	{transform:	translate(0px,   0px);}
15% {transform:	translate(0px, -25px);}
30% {transform:	translate(0px,   0px);}
45% {transform:	translate(0px, -15px);}
60% {transform:	translate(0px,   0px);}
75% {transform:	translate(0px,  -5px);}
100%{transform:	translate(0px,   0px);}
}`, document.getElementsByTagName("head")[0].appendChild(e), this.addHook((s, r) => this.#w[s]?.(r)), this.#p = ys(`http://localhost:${this.extPort}`), this.#p.on("data", (s, r) => {
      this.callHook(s, r);
    }).on("disconnect", () => t.setLoop(!0)), this.callHook = (s, r) => {
      for (const n of this.#_) n(s, r);
    };
  }
  extPort = 3776;
  end() {
    this.#p?.disconnect(), this.#p = void 0;
  }
  #p = void 0;
  #w = {
    auth: (t) => {
      if (t.t !== this.cfg.oCfg.debuger_token) {
        this.end();
        return;
      }
      this.toast("接続");
    },
    continue: () => this.toast("再生"),
    disconnect: () => this.toast("切断"),
    restart: async (t) => {
      this.send2Dbg(t?.ri ?? "", {}), this.end(), await this.run();
    },
    pause: () => this.toast("一時停止"),
    stopOnEntry: () => this.toast("一時停止"),
    stopOnDataBreakpoint: () => this.toast("注意"),
    stopOnBreakpoint: () => this.toast("注意"),
    stopOnStep: () => this.toast("一歩進む"),
    stopOnStepIn: () => this.toast("ステップイン"),
    stopOnStepOut: () => this.toast("ステップアウト"),
    stopOnBackstep: () => this.toast("一歩戻る"),
    _addPath: (t) => this.cfg.addPath(t.fn, t.o)
  };
  toast(t) {
    const e = document.body;
    for (const o of [
      ...Array.from(e.getElementsByClassName("sn_BounceIn")),
      ...Array.from(e.getElementsByClassName("sn_HopIn"))
    ]) o.remove();
    const s = document.createElement("img"), r = Ge.#v[t];
    if (!r) throw new Error(`toast 名ミス=${t}`);
    s.src = `data:image/svg+xml;base64,${r.dat}`;
    const n = Math.min(j.stageW, j.stageH) / 4 * this.#r;
    s.width = s.height = n, s.style.cssText = `position: absolute;
left: ${(j.stageW - n) / 2 * this.#r + n * (r.dx ?? 0)}px;
top: ${(j.stageH - n) / 2 * this.#r + n * (r.dy ?? 0)}px;`, s.classList.add("sn_toast", r.ease ?? "sn_BounceInOut"), r.ease || s.addEventListener("animationend", () => e.removeChild(s), { once: !0, passive: !0 }), e.insertBefore(s, this.main.cvs);
  }
  static #v = {
    // Thanks ICOOON MONO https://icooon-mono.com/ 、 https://vectr.com/ で 640x640化、ImageOptim経由、Base64エンコーダー https://lab.syncer.jp/Tool/Base64-encode/ 
    接続: { dx: -1, dat: "PHN2ZyBoZWlnaHQ9IjY0MCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDY0MCA2NDAiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJtNjQwIDMyMGMwIDE3Ni43My0xNDMuMjcgMzIwLTMyMCAzMjBzLTMyMC0xNDMuMjctMzIwLTMyMCAxNDMuMjctMzIwIDMyMC0zMjAgMzIwIDE0My4yNyAzMjAgMzIweiIvPjxwYXRoIGlkPSJiIiBkPSJtMCAyOTJ2NTUuODhoMTI3LjEzYzEyLjM3IDQ2IDU0LjEyIDc5Ljg3IDEwNCA3OS44N2g3Ny44N3YtMjE1LjYyYy00Ni43MyAwLTcyLjY4IDAtNzcuODggMC00OS43NCAwLTkxLjYyIDMzLjg3LTEwMy45OSA3OS44Ny0xNi45NSAwLTU5LjMzIDAtMTI3LjEzIDB6Ii8+PHBhdGggaWQ9ImMiIGQ9Im01MTIuODggMjkyYy0xMi4zOC00Ni01NC4xMy03OS44Ny0xMDQtNzkuODctNS4yMSAwLTMxLjIxIDAtNzggMHYyMTUuNzRoNzcuODdjNDkuODggMCA5MS43NS0zMy44NyAxMDQtNzkuODdoMTI3LjI1di01NmMtNzYuMjcgMC0xMTguNjUgMC0xMjcuMTIgMHoiLz48L2RlZnM+PHVzZSBmaWxsPSIjMmUyZTJlIiB4bGluazpocmVmPSIjYSIvPjx1c2UgZmlsbD0ibm9uZSIgeGxpbms6aHJlZj0iI2EiLz48dXNlIGZpbGw9IiMzYWFiZDIiIHhsaW5rOmhyZWY9IiNiIi8+PHVzZSBmaWxsPSJub25lIiB4bGluazpocmVmPSIjYiIvPjx1c2UgZmlsbD0iIzNhYWJkMiIgeGxpbms6aHJlZj0iI2MiLz48dXNlIGZpbGw9Im5vbmUiIHhsaW5rOmhyZWY9IiNjIi8+PC9zdmc+" },
    切断: { dat: "PHN2ZyBoZWlnaHQ9IjY0MCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDY0MCA2NDAiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJtNjQwIDMyMGMwIDE3Ni43My0xNDMuMjcgMzIwLTMyMCAzMjBzLTMyMC0xNDMuMjctMzIwLTMyMCAxNDMuMjctMzIwIDMyMC0zMjAgMzIwIDE0My4yNyAzMjAgMzIweiIvPjxwYXRoIGlkPSJiIiBkPSJtMTkxLjUzIDIyMS4yNGMtNDUuNjggMC04NC4wMSAzMS4wNC05NS4zIDczLjE2LTYuNDEgMC0zOC40OSAwLTk2LjIzIDB2NTEuMjFoOTYuMjNjMTEuMyA0Mi4xMSA0OS42MyA3My4xNiA5NS4zIDczLjE2aDcxLjMzdi00OC4yNGg1My43OHYtMTAxLjA1aC01My43OHYtNDguMjRjLTQyLjggMC02Ni41NyAwLTcxLjMzIDB6Ii8+PHBhdGggaWQ9ImMiIGQ9Im00NDguNDcgMjIxLjIzYy00Ljc2IDAtMjguNTMgMC03MS4zMyAwdjE5Ny41M2g3MS4zM2M0NS42OCAwIDgzLjk5LTMxLjA0IDk1LjI5LTczLjE1aDk2LjI0di01MS4yMWgtOTYuMjRjLTMzLjA4LTQ4Ljc4LTY0Ljg0LTczLjE3LTk1LjI5LTczLjE3eiIvPjwvZGVmcz48dXNlIGZpbGw9IiMyZTJlMmUiIHhsaW5rOmhyZWY9IiNhIi8+PHVzZSBmaWxsPSJub25lIiB4bGluazpocmVmPSIjYSIvPjx1c2UgZmlsbD0iI2RmNTY1NiIgeGxpbms6aHJlZj0iI2IiLz48dXNlIGZpbGw9Im5vbmUiIHhsaW5rOmhyZWY9IiNiIi8+PHVzZSBmaWxsPSIjZGY1NjU2IiB4bGluazpocmVmPSIjYyIvPjx1c2UgZmlsbD0ibm9uZSIgeGxpbms6aHJlZj0iI2MiLz48L3N2Zz4=" },
    再生: { dat: "PHN2ZyBoZWlnaHQ9IjY0MCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDY0MCA2NDAiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJtMCAzMjBjMCAxNzYuNzIgMTQzLjI4IDMyMCAzMjAgMzIwczMyMC0xNDMuMjggMzIwLTMyMC0xNDMuMjgtMzIwLTMyMC0zMjAtMzIwIDE0My4yOC0zMjAgMzIwem0yNTguODMgMTExLjA1Yy0xLjI5Ljc5LTIuOTMuODMtNC4yNi4wNC0xLjI5LS43NC0yLjExLTIuMTItMi4xMS0zLjY3IDAtNy4xNiAwLTQyLjk3IDAtMTA3LjQzczAtMTAwLjI3IDAtMTA3LjQzYzAtMS41My44Mi0yLjkzIDIuMTEtMy42OCAxLjMzLS43NiAyLjk3LS43MiA0LjI2LjA0IDE4IDEwLjc1IDE2MiA5Ni43MSAxODAgMTA3LjQ2IDEuMjkuNzMgMi4wNSAyLjE0IDIuMDUgMy42MSAwIDEuNDktLjc2IDIuODgtMi4wNSAzLjYzLTM2IDIxLjQ5LTE2MiA5Ni42OS0xODAgMTA3LjQzeiIvPjwvZGVmcz48cGF0aCBkPSJtMTU0LjU3IDE3MC4xOWgzNDYuMTV2MzA3LjY5aC0zNDYuMTV6IiBmaWxsPSIjZmZmIi8+PHVzZSBmaWxsPSIjMmUyZTJlIiB4bGluazpocmVmPSIjYSIvPjx1c2UgZmlsbD0ibm9uZSIgeGxpbms6aHJlZj0iI2EiLz48L3N2Zz4=" },
    一時停止: { dat: "PHN2ZyBoZWlnaHQ9IjY0MCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDY0MCA2NDAiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJtMCAzMjBjMCAxNzYuNzIgMTQzLjI4IDMyMCAzMjAgMzIwczMyMC0xNDMuMjggMzIwLTMyMC0xNDMuMjgtMzIwLTMyMC0zMjAtMzIwIDE0My4yOC0zMjAgMzIwem0yMDAgMTAwdi0yMDBoODB2MjAwem0xNjAgMHYtMjAwaDgwdjIwMHoiLz48L2RlZnM+PHBhdGggZD0ibTE0Ny40OSAxODAuNDFoMzUyLjR2MjgyLjY5aC0zNTIuNHoiIGZpbGw9IiNmZmYiLz48dXNlIGZpbGw9IiMyZTJlMmUiIHhsaW5rOmhyZWY9IiNhIi8+PHVzZSBmaWxsPSJub25lIiB4bGluazpocmVmPSIjYSIvPjwvc3ZnPg==" },
    注意: { ease: "sn_HopIn", dat: "PHN2ZyBoZWlnaHQ9IjY0MCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDY0MCA2NDAiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJtMzQzLjM0IDI5LjJjLTEwLjM3LTE3Ljk3LTM2LjMxLTE3Ljk3LTQ2LjY5IDAtMjkuMyA1MC43NS0yNjMuNyA0NTYuNzQtMjkzIDUwNy40OS0xMC4zNyAxNy45NyAyLjU5IDQwLjQ0IDIzLjM0IDQwLjQ0aDU4Ni4wMWMyMC43NSAwIDMzLjcyLTIyLjQ2IDIzLjM1LTQwLjQ0LTU4LjYtMTAxLjUtMjYzLjctNDU2Ljc0LTI5My4wMS01MDcuNDl6bS0yMy4zNCA0ODIuODNjLTE0LjUyIDAtMjYuMjktMi43MS0yNi4yOS02LjA2IDAtNC4yMSAwLTM3Ljg2IDAtNDIuMDcgMC0zLjM1IDExLjc3LTYuMDcgMjYuMjktNi4wN3MyNi4yOSAyLjcyIDI2LjI5IDYuMDd2NDIuMDdjLTcuODQgNC4wNC0xNi42MSA2LjA2LTI2LjI5IDYuMDZ6bTIxLjk5LTEwMy44NGMwIDUuNDMtOS44NSA5LjgzLTIxLjk5IDkuODMtMTIuMTUgMC0yMS45OS00LjQtMjEuOTktOS44MyAwLS4xMy4wNy0uMjUuMDgtLjM4LTEuMzctMTcuNTYtMTIuMy0xNTguMDYtMTMuNjctMTc1LjYyIDAtNS40MyAxNS45My05Ljg0IDM1LjU4LTkuODRzMzUuNTggNC40MSAzNS41OCA5Ljg0Yy0uOTEgMTEuNy01LjQ3IDcwLjI1LTEzLjY3IDE3NS42Mi4wNi4xNi4wOC4yOS4wOC4zOHoiLz48L2RlZnM+PHBhdGggZD0ibTI0MS4yOSAxOTEuNDRoMTQ1LjQ5djM1MS42NmgtMTQ1LjQ5eiIgZmlsbD0iI2ZmZiIvPjx1c2UgZmlsbD0iI2QyYmYzYSIgeGxpbms6aHJlZj0iI2EiLz48dXNlIGZpbGw9Im5vbmUiIHhsaW5rOmhyZWY9IiNhIi8+PC9zdmc+" },
    一歩進む: { ease: "sn_BounceIn", dat: "PHN2ZyBoZWlnaHQ9IjY0MCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDY0MCA2NDAiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJtMCAzMjBjMCAxNzYuNzIgMTQzLjI4IDMyMCAzMjAgMzIwczMyMC0xNDMuMjggMzIwLTMyMC0xNDMuMjgtMzIwLTMyMC0zMjAtMzIwIDE0My4yOC0zMjAgMzIwem0zNzYuOTMgOTEuOTdjMC01My41MSAwLTgzLjI0IDAtODkuMTktLjE1LjE0LS4yNS4zNC0uNDQuNDUtMTYuMTEgOS42Mi0xNDQuOTUgODYuNTQtMTYxLjA2IDk2LjE1LTEuMTUuNjktMi42Mi43My0zLjgxLjAyLTEuMTUtLjY0LTEuODktMS44OS0xLjg5LTMuMjggMC02LjQxIDAtMzguNDQgMC05Ni4xMSAwLTU3LjY5IDAtODkuNzQgMC05Ni4xNSAwLTEuMzUuNzQtMi42MiAxLjg5LTMuMjkgMS4xOS0uNjggMi42Ni0uNjQgMy44MS4wNCAxNi4xMSA5LjYyIDE0NC45NSA4Ni41NCAxNjEuMDYgOTYuMTYuMTkuMS4yOS4zMS40NC40NSAwLTYuMTMgMC0zNi43NyAwLTkxLjkyaDUzLjMydjE4Ni42N3oiLz48L2RlZnM+PHBhdGggZD0ibTE0Ny40OSAxNTQuMmgzNTIuNHYzMDguOWgtMzUyLjR6IiBmaWxsPSIjZmZmIi8+PHVzZSBmaWxsPSIjMmUyZTJlIiB4bGluazpocmVmPSIjYSIvPjx1c2UgZmlsbD0ibm9uZSIgeGxpbms6aHJlZj0iI2EiLz48L3N2Zz4=" },
    一歩戻る: { ease: "sn_BounceIn", dat: "PHN2ZyBoZWlnaHQ9IjY0MCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDY0MCA2NDAiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJtMCAzMjBjMCAxNzYuNzIgMTQzLjI4IDMyMCAzMjAgMzIwczMyMC0xNDMuMjggMzIwLTMyMC0xNDMuMjgtMzIwLTMyMC0zMjAtMzIwIDE0My4yOC0zMjAgMzIwem00MzAuMjcgOTYuMTRjMCAxLjM1LS43NCAyLjYyLTEuODkgMy4yOC0xLjE5LjY5LTIuNjYuNjUtMy44MS0uMDMtMTYuMTEtOS42Mi0xNDQuOTUtODYuNTQtMTYxLjA1LTk2LjE2LS4yLS4xLS4yOS0uMzEtLjQ1LS40NXY5MS45MmgtNTMuMzJ2LTE4Ni42N2g1My4zMnY4OS4xOWMuMTYtLjE0LjI1LS4zNC40NS0uNDUgMTYuMS05LjYyIDE0NC45NC04Ni41NCAxNjEuMDUtOTYuMTYgMS4xNS0uNjggMi42Mi0uNzIgMy44MS0uMDEgMS4xNS42NCAxLjg5IDEuODkgMS44OSAzLjI4djk2LjExeiIvPjwvZGVmcz48cGF0aCBkPSJtMTQ3LjQ5IDE1NC4yaDM1Mi40djMwOC45aC0zNTIuNHoiIGZpbGw9IiNmZmYiLz48dXNlIGZpbGw9IiMyZTJlMmUiIHhsaW5rOmhyZWY9IiNhIi8+PHVzZSBmaWxsPSJub25lIiB4bGluazpocmVmPSIjYSIvPjwvc3ZnPg==" },
    ステップイン: { ease: "sn_BounceIn", dat: "PHN2ZyBoZWlnaHQ9IjY0MCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDY0MCA2NDAiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJtMCAzMTkuOTljMCAxNzYuNzQgMTQzLjI3IDMyMC4wMSAzMjAuMDEgMzIwLjAxIDE3Ni43MiAwIDMxOS45OS0xNDMuMjcgMzE5Ljk5LTMyMC4wMSAwLTE3Ni43Mi0xNDMuMjctMzE5Ljk5LTMxOS45OS0zMTkuOTktMTc2Ljc0IDAtMzIwLjAxIDE0My4yNy0zMjAuMDEgMzE5Ljk5em0xNTMuMDUtMjkuNzIgNTUuMTItNTUuMTMgMTExLjg0IDExMS44MiAxMTEuODItMTExLjgyIDU1LjEyIDU1LjEyLTE2Ni45NCAxNjYuOTd6Ii8+PC9kZWZzPjxwYXRoIGQ9Im0xNDcuNDkgMTU0LjJoMzUyLjR2MzA4LjloLTM1Mi40eiIgZmlsbD0iI2ZmZiIvPjx1c2UgZmlsbD0iIzJlMmUyZSIgeGxpbms6aHJlZj0iI2EiLz48dXNlIGZpbGw9Im5vbmUiIHhsaW5rOmhyZWY9IiNhIi8+PC9zdmc+" },
    ステップアウト: { ease: "sn_BounceIn", dat: "PHN2ZyBoZWlnaHQ9IjY0MCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmlld0JveD0iMCAwIDY0MCA2NDAiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJtMCAzMjAuMDFjMCAxNzYuNzIgMTQzLjI3IDMxOS45OSAzMTkuOTkgMzE5Ljk5IDE3Ni43NCAwIDMyMC4wMS0xNDMuMjcgMzIwLjAxLTMxOS45OSAwLTE3Ni43NC0xNDMuMjctMzIwLjAxLTMyMC4wMS0zMjAuMDEtMTc2LjcyIDAtMzE5Ljk5IDE0My4yNy0zMTkuOTkgMzIwLjAxem0zMTkuOTktMjYuOTgtMTExLjgyIDExMS44My01NS4xMi01NS4xMyAxNjYuOTQtMTY2Ljk2IDE2Ni45NiAxNjYuOTYtNTUuMTIgNTUuMTN6Ii8+PC9kZWZzPjxwYXRoIGQ9Im0xNDcuNDkgMTU0LjJoMzUyLjR2MzA4LjloLTM1Mi40eiIgZmlsbD0iI2ZmZiIvPjx1c2UgZmlsbD0iIzJlMmUyZSIgeGxpbms6aHJlZj0iI2EiLz48dXNlIGZpbGw9Im5vbmUiIHhsaW5rOmhyZWY9IiNhIi8+PC9zdmc+" }
  };
  pathBaseCnvSnPath4Dbg = "";
  fire;
  setFire(t) {
    this.fire = t;
  }
  #_ = [];
  addHook(t) {
    this.#_.push(t);
  }
  callHook = (t, e) => {
  };
  send2Dbg = (t, e) => {
    this.#p?.emit("data", t, e);
  };
  copyBMFolder = (t, e) => {
  };
  eraseBMFolder = (t) => {
  };
  close = () => !1;
  _export = () => !1;
  _import = () => !1;
  navigate_to = () => !1;
  title = (t) => {
    const { text: e } = t;
    if (!e) throw "[title] textは必須です";
    return this.#g = e, this.titleSub(this.#g + this.#y), !1;
  };
  #g = "";
  titleSub(t) {
  }
  #M = (t) => {
    if (!t.key)
      return this.tglFlscr_sub(), !1;
    const e = t.key.toLowerCase();
    return this.elc.add(document, "keydown", (s) => {
      Ge.modKey(s) + s.key.toLowerCase() === e && (s.stopPropagation(), this.tglFlscr_sub());
    }, { passive: !0 }), !1;
  };
  static modKey(t) {
    return (t.altKey ? t.key === "Alt" ? "" : "alt+" : "") + (t.ctrlKey ? t.key === "Control" ? "" : "ctrl+" : "") + (t.metaKey ? t.key === "Meta" ? "" : "meta+" : "") + (t.shiftKey ? t.key === "Shift" ? "" : "shift+" : "");
  }
  tglFlscr_sub() {
  }
  update_check = () => !1;
  window = () => !1;
  #y = "";
  setTitleInfo(t) {
    this.#y = t, this.titleSub(this.#g + this.#y);
  }
  #b = () => Promise.resolve({ ext_num: 0, ab: new ArrayBuffer(0) });
  dec = (t, e) => Promise.resolve(e);
  async decAB(t) {
    const { ext_num: e, ab: s } = await this.#b(t), r = this.#S[e];
    return r?.fnc ? await r.fnc(s) : s;
  }
  #S = {
    1: { ext: "jpeg", fnc: (t) => this.#m(t, "image/jpeg") },
    2: { ext: "png", fnc: (t) => this.#m(t, "image/png") },
    3: { ext: "svg", fnc: (t) => this.#m(t, "image/svg+xml") },
    4: { ext: "webp", fnc: (t) => this.#m(t, "image/webp") },
    //	10	: {ext: 'mp3', fnc: async ab=> ab},
    //	11	: {ext: 'm4a', fnc: async ab=> ab},
    //	12	: {ext: 'ogg', fnc: async ab=> ab},
    //	13	: {ext: 'aac', fnc: async ab=> ab},
    //	14	: {ext: 'flac', fnc: async ab=> ab},
    //	15	: {ext: 'wav', fnc: async ab=> ab},
    20: { ext: "mp4", fnc: (t) => this.#x(t, "video/mp4") },
    21: { ext: "webm", fnc: (t) => this.#x(t, "video/webm") },
    22: { ext: "ogv", fnc: (t) => this.#x(t, "video/ogv") }
  };
  #m = (t, e) => new Promise((s, r) => {
    const n = new Blob([t], { type: e }), o = new Image();
    o.onload = () => s(o), o.onerror = (a) => r(a), o.src = URL.createObjectURL(n);
  });
  #x = (t, e) => new Promise((s, r) => {
    const n = new Blob([t], { type: e }), o = document.createElement("video");
    this.elc.add(o, "error", () => r(o?.error?.message ?? "")), this.elc.add(o, "canplay", () => s(o)), o.src = URL.createObjectURL(n);
  });
  enc = async (t) => t;
  stk = () => "";
  hash = (t) => "";
  isApp = !1;
  $path_downloads = "";
  get path_downloads() {
    return this.$path_downloads;
  }
  $path_userdata = "";
  get path_userdata() {
    return this.$path_userdata;
  }
  capturePage(t, e, s, r) {
  }
  async savePic(t, e) {
  }
  async ensureFileSync(t) {
  }
  async appendFile(t, e) {
  }
  async outputFile(t, e) {
  }
}
class Yd extends Ge {
  async loadPath(t, e) {
    await super.loadPath(t, e);
    const s = this.arg.cur + "path.json", r = await (await this.fetch(s)).text(), n = JSON.parse(await this.dec(s, r));
    for (const [o, a] of Object.entries(n)) {
      const h = t[o] = a;
      for (const [c, l] of Object.entries(h))
        c !== ":cnt" && (h[c] = this.arg.cur + l);
    }
  }
  init(t, e, s, r) {
    const n = super.init(t, e, s, r);
    return document.body.style.backgroundColor = "#000", n;
  }
  isApp = !0;
  async savePic(t, e) {
    const s = e.slice(e.indexOf(",", 20) + 1);
    try {
      this.ensureFileSync(t), await this.writeFileSync(t, s), j.debugLog && console.log(`画像ファイル ${t} を保存しました`);
    } catch (r) {
      throw r;
    }
  }
  async writeFileSync(t, e, s) {
  }
}
class q {
  constructor(t, e, s) {
    this.sys = t, q.#t = s, q.#e = e, q.#i = e.title, q.myTrace = q.#n, e.log = (r) => this.#a(r), e.trace = (r) => this.#c(r), q.#s = document.createElement("span"), q.#s.hidden = !0, q.#s.textContent = "", q.#s.style.cssText = `	z-index: ${Number.MAX_SAFE_INTEGER};
			position: absolute; left: 0; top: 0;
			color: black;
			background-color: rgba(255, 255, 255, 0.7);`, document.body.appendChild(q.#s);
  }
  static #t;
  static #e;
  static #i;
  static #s;
  destroy() {
    q.#i = () => !1, document.body.removeChild(q.#s), q.myTrace = q.trace_beforeNew;
  }
  // ログ出力
  #h = !0;
  #a(t) {
    let e = "";
    return this.#h && (this.#h = !1, e = `== ${Vu.description} ==
`), this.sys.appendFile(
      this.sys.path_downloads + "log.txt",
      `${e}--- ${Qo("-", "_", "")} [fn:${q.#t.scriptFn} line:${q.#t.lineNum}] prj:${this.sys.arg.cur}
${t.text || `(text is ${t.text})`}
`
    ), !1;
  }
  #c(t) {
    return q.myTrace(t.text || `(text is ${t.text})`, "I"), !1;
  }
  // private禁止、galleryでエラーになる
  static trace_beforeNew = (t, e = "E") => {
    let s = `{${e}} ` + t, r = "";
    switch (e) {
      case "D":
        r = `color:#${j.isDarkMode ? "49F" : "05A"};`;
        break;
      case "W":
        r = "color:#FF8800;";
        break;
      case "F":
        r = "color:#BB0000;";
        break;
      case "ET":
        throw s;
      case "E":
        console.error("%c" + s, "color:#FF3300;");
        return;
      default:
        r = "color:black;", s = " " + s;
    }
    console.info("%c" + s, r);
  };
  static myTrace = q.trace_beforeNew;
  static strPos = () => q.#t.lineNum > 0 ? `(fn:${q.#t.scriptFn} line:${q.#t.lineNum}) ` : "";
  static #n = (t, e = "E") => {
    let s = `{${e}} ` + q.strPos() + t;
    q.#o(s, e);
    let r = "";
    switch (e) {
      case "D":
        r = `color:#${j.isDarkMode ? "49F" : "05A"};`;
        break;
      case "W":
        r = "color:#F80;";
        break;
      case "F":
        r = "color:#B00;";
        break;
      case "ET":
      case "E":
        if (q.#i({ text: t }), this.#e.dump_lay({}), this.#e.dump_val({}), q.#t.dumpErrForeLine(), this.#e.dump_stack({}), e === "ET") throw s;
        console.error("%c" + s, "color:#F30;");
        return;
      default:
        r = "", s = " " + s;
    }
    console.info("%c" + s, r);
  };
  static #o = (t, e) => {
    let s = "";
    switch (e) {
      case "D":
        s = "color:#05A;";
        break;
      case "W":
        s = "color:#F80;";
        break;
      case "F":
        s = "color:#B00;";
        break;
      case "ET":
      case "E":
        s = "color:#F30;";
        break;
      default:
        s = "";
    }
    q.#s.innerHTML += `<span style='${s}'>${t}</span><br/>`, q.#s.hidden = !1;
  };
}
const Vd = "userdata:/", Xd = "downloads:/";
class nr extends Ju {
  constructor(t) {
    super(t), this.sys = t;
  }
  static async generate(t) {
    const e = new nr(t), s = t.arg.cur + "prj.json", r = await t.fetch(s);
    if (!r.ok) throw Error(r.statusText);
    const n = await t.dec(s, await r.text());
    return await e.load(JSON.parse(n)), e;
  }
  async load(t) {
    await super.load(t), j.stageW = t.window.width, j.stageH = t.window.height, j.debugLog = t.debug.debugLog;
  }
  searchPath(t, e = we.DEFAULT) {
    return t.startsWith(Xd) ? this.sys.path_downloads + t.slice(11) : t.startsWith(Vd) ? this.sys.path_userdata + "storage/" + t.slice(10) : super.searchPath(t, e);
  }
}
class qd {
  // 87 match 2725 step(0.5ms) PCRE2 https://regex101.com/r/aeN57J/1
  /*
  ;[^\n]*
  |	(?<key>[^\s="'#|;]+)
  	(?: \s | ;[^\n]*\n)*
  	=
  	(?: \s | ;[^\n]*\n)*
  	(?:	(?<val> [^\s"'#|;]+)
  	|	(["'#]) (?<val2>.*?) \3 )
  	(?: \|
  		(?: (?<def> [^\s"'#;]+)
  	|	(["'#]) (?<def2>.*?) \6 ) )?
  |	(?<literal>[^\s;]+)
  	*/
  #t = /;[^\n]*|(?<key>[^\s="'#|;]+)(?:\s|;[^\n]*\n)*=(?:\s|;[^\n]*\n)*(?:(?<val>[^\s"'#|;]+)|(["'#])(?<val2>.*?)\3)(?:\|(?:(?<def>[^\s"'#;]+)|(["'#])(?<def2>.*?)\6))?|(?<literal>[^\s;]+)/g;
  // 【属性 = 値 | 省略値】の分析
  parse(t) {
    this.#i = {}, this.#s = !1;
    for (const { groups: e } of t.matchAll(this.#t)) {
      const { key: s, val: r, val2: n, def: o, def2: a, literal: h } = e;
      s ? this.#i[s] = {
        val: r ?? n ?? "",
        def: o ?? a
      } : h && (h === "*" ? this.#s = !0 : this.#i[h] = { val: "1" });
    }
  }
  // 属性と値の位置をまとめて返す
  parseinDetail(t, e, s, r) {
    const n = {}, o = t.slice(1 + e, -1);
    for (const { groups: a, index: h, 0: c } of o.matchAll(this.#t)) {
      if (h === void 0) continue;
      const { key: l, val: u, val2: f = "", literal: d } = a;
      if (d) {
        if (d.endsWith("=")) {
          const M = d.length - 1, { ch: S } = this.#e(e, s, r, o, h + M);
          n[d.slice(0, -1)] = {
            k_ln: s,
            k_ch: S - M,
            v_ln: s,
            v_ch: S + 1,
            //	v_ch: ch +1+lenNm +literal.length +1,
            v_len: 0
          };
        }
        continue;
      }
      if (!l) continue;
      const { ln: g, ch: y } = this.#e(e, s, r, o, h), { ln: m, ch: _ } = this.#e(e, s, r, o, h + c.lastIndexOf(u ?? f ?? "") - (u ? 0 : 1));
      n[l] = { k_ln: g, k_ch: y, v_ln: m, v_ch: _, v_len: u ? u.length : f.length + 2 };
    }
    return n;
  }
  #e(t, e, s, r, n) {
    const a = r.slice(0, n).split(`
`), h = a.length;
    return {
      ln: e + h - 1,
      ch: h < 2 ? s + 1 + t + n : a.at(-1).length
    };
  }
  #i = {};
  get hPrm() {
    return this.#i;
  }
  #s = !1;
  get isKomeParam() {
    return this.#s;
  }
}
const ma = /(?<name>[^\s;\]]+)/;
function Zd(i) {
  const e = ma.exec(i.slice(1, -1))?.groups;
  if (!e) throw `タグ記述【${i}】異常です(タグ解析)`;
  const s = e.name;
  return [s, i.slice(1 + s.length, -1)];
}
function Kd(i) {
  const e = ma.exec(i.slice(1))?.groups;
  if (!e) throw `タグ記述【${i}】異常です(タグ解析)`;
  return e.name;
}
function Jd(i) {
  const t = i.replaceAll("==", "＝").replaceAll("!=", "≠").split("="), e = t.length;
  if (e < 2 || e > 3) throw "「&計算」書式では「=」指定が一つか二つ必要です";
  const [s, r, n] = t;
  if (r.startsWith("&")) throw "「&計算」書式では「&」指定が不要です";
  return {
    name: s.replaceAll("＝", "==").replaceAll("≠", "!="),
    text: r.replaceAll("＝", "==").replaceAll("≠", "!="),
    cast: e === 3 ? n.trim() : void 0
  };
}
class af {
  constructor(t) {
    this.cfg = t, this.setEscape("");
  }
  #t;
  setEscape(t) {
    if (this.#r && t in this.#r) throw "[エスケープ文字] char【" + t + "】が登録済みの括弧マクロまたは一文字マクロです";
    this.#t = new RegExp(
      (t ? `\\${t}\\S|` : "") + // エスケープシーケンス
      `\\n+|\\t+|\\[let_ml\\s+[^\\]]+\\].+?(?=\\[endlet_ml[\\]\\s])|\\[(?:[^"'#;\\]]+|(["'#]).*?\\1|;[^\\n]*)*?]|;[^\\n]*|&[^&\\n]+&|&&?(?:[^"'#;\\n&]+|(["'#]).*?\\2)+|^\\*[^\\s\\[&;\\\\]+|[^\\n\\t\\[;${t ? `\\${t}` : ""}]+`,
      // 本文
      "gs"
    ), this.#e = new RegExp(`[\\w\\s;[\\]*=&｜《》${t ? `\\${t}` : ""}]`), this.#l = new RegExp(`[\\n\\t;\\[*&${t ? `\\${t}` : ""}]`);
  }
  // 括弧マクロの定義
  bracket2macro(t, e, s, r) {
    const { name: n, text: o } = t;
    if (!n) throw "[bracket2macro] nameは必須です";
    if (!o) throw "[bracket2macro] textは必須です";
    const a = o.at(0);
    if (!a) throw "[bracket2macro] textは必須です";
    if (o.length !== 2) throw "[bracket2macro] textは括弧の前後を示す二文字を指定してください";
    if (!(n in e)) throw `[bracket2macro] 未定義のタグ又はマクロ[${n}]です`;
    this.#r ??= {};
    const h = o.charAt(1);
    if (a in this.#r) throw "[bracket2macro] text【" + a + "】が登録済みの括弧マクロまたは一文字マクロです";
    if (h in this.#r) throw "[bracket2macro] text【" + h + "】が登録済みの括弧マクロまたは一文字マクロです";
    if (this.#e.test(a)) throw "[bracket2macro] text【" + a + "】は括弧マクロに使用できない文字です";
    if (this.#e.test(h)) throw "[bracket2macro] text【" + h + "】は括弧マクロに使用できない文字です";
    this.#r[h] = "0", this.#r[a] = `[${n} text=`, this.addC2M(`\\${a}[^\\${h}]*\\${h}`, `\\${a}\\${h}`), this.#u(s, r);
  }
  // 一文字マクロの定義
  char2macro(t, e, s, r) {
    const { char: n, name: o } = t;
    if (!n) throw "[char2macro] charは必須です";
    if (this.#r ??= {}, n in this.#r) throw "[char2macro] char【" + n + "】が登録済みの括弧マクロまたは一文字マクロです";
    if (this.#e.test(n)) throw "[char2macro] char【" + n + "】は一文字マクロに使用できない文字です";
    if (!o) throw "[char2macro] nameは必須です";
    if (!(o in e)) throw `[char2macro] 未定義のタグ又はマクロ[${o}]です`;
    this.#r[n] = `[${o}]`, this.addC2M(`\\${n}`, `\\${n}`), this.#u(s, r);
  }
  #e;
  #i = new RegExp("");
  #s = "";
  #h = "";
  addC2M(t, e) {
    this.#s += `${t}|`, this.#h += `${e}`, this.#i = new RegExp(
      `(${this.#s}[^${this.#h}]+)`,
      "g"
    );
  }
  resolveScript(t) {
    const e = t.replaceAll(/\r\n?/g, `
`).match(this.#t)?.flatMap((r) => {
      if (!this.testTagLetml(r)) return r;
      const n = /^([^\]]+?])(.*)$/s.exec(r);
      if (!n) return r;
      const [, o, a] = n;
      return [o, a];
    }) ?? [], s = { aToken: e, len: e.length, aLNum: [] };
    return this.#u(s), this.#n(s), s;
  }
  #a = /^\[(call|loadplugin)\s/;
  #c = /\bfn\s*=\s*[^\s\]]+/;
  #n(t) {
    for (let e = t.len - 1; e >= 0; --e) {
      const s = t.aToken[e];
      if (!this.#a.test(s)) continue;
      const [r, n] = Zd(s);
      this.#o.parse(n);
      const o = this.#o.hPrm.fn;
      if (!o) continue;
      const { val: a } = o;
      if (!a || !a.endsWith("*")) continue;
      t.aToken.splice(e, 1, "	", "; " + s), t.aLNum.splice(e, 1, NaN, NaN);
      const h = r === "loadplugin" ? we.CSS : we.SN, c = this.cfg.matchPath("^" + a.slice(0, -1) + ".*", h);
      for (const l of c) {
        const u = s.replace(
          this.#c,
          "fn=" + decodeURIComponent(ea(l[h]))
        );
        t.aToken.splice(e, 0, u), t.aLNum.splice(e, 0, NaN);
      }
    }
    t.len = t.aToken.length;
  }
  #o = new qd();
  testTagLetml(t) {
    return /^\[let_ml\s/.test(t);
  }
  testTagEndLetml(t) {
    return /^\[endlet_ml\s*]/.test(t);
  }
  analyzToken(t) {
    return this.#t.lastIndex = 0, this.#t.exec(t);
  }
  #r;
  #l;
  #u(t, e = 0) {
    if (this.#r) {
      for (let s = t.len - 1; s >= e; --s) {
        const r = t.aToken[s];
        if (this.testNoTxt(r.at(0) ?? `
`)) continue;
        const n = t.aLNum[s], o = r.match(this.#i);
        if (!o) continue;
        let a = 1;
        for (let h = o.length - 1; h >= 0; --h) {
          let c = o[h];
          const l = this.#r[c.at(0) ?? " "];
          l && (c = l + (l.endsWith("]") ? "" : `'${c.slice(1, -1)}']`)), t.aToken.splice(s, a, c), t.aLNum.splice(s, a, n), a = 0;
        }
      }
      t.len = t.aToken.length;
    }
  }
  testNoTxt(t) {
    return this.#l.test(t);
  }
  //4tst
}
const ls = "skynovel";
class Qd {
  constructor(t) {
    this.sys = t, nr.generate(t).then((e) => this.#h(e)).catch((e) => console.error("load err fn:prj.json e:%o", e));
  }
  cvs;
  #t = /* @__PURE__ */ Object.create(null);
  // タグ処理辞書
  #e;
  #i;
  #s = [];
  async #h(t) {
    const e = {
      width: t.oCfg.window.width,
      height: t.oCfg.window.height,
      backgroundColor: new ut(t.oCfg.init.bg_color),
      //hello: true,	// webgpu/webgl モードが DevTools に出る
      //		preference: 'webgpu',	// 優先指定
      preference: "webgl"
      // 優先指定
    }, s = document.getElementById(ls);
    if (s) {
      const o = s.cloneNode(!0);
      o.id = ls, e.canvas = s;
      const a = s.parentNode;
      this.#s.unshift(() => a.appendChild(o));
    } else {
      const o = document.createElement("canvas");
      o.id = ls, e.canvas = o, document.body.appendChild(o), this.#s.unshift(() => document.body.removeChild(o));
    }
    const r = new go();
    await r.init(e), this.#s.unshift(() => {
      me.cache.reset(), this.sys.destroy(), r.destroy(!1);
    }), this.cvs = r.canvas, this.cvs.id = ls + "_act", s || document.body.appendChild(this.cvs);
    const n = document.createElement("canvas")?.getContext("2d");
    if (!n) throw "#init cc err";
    j.cc4ColorName = n, await Promise.all([
      import("./Variable.js"),
      import("./PropParser.js"),
      import("./SoundMng.js"),
      import("./ScriptIterator.js"),
      import("./LayerMng.js").then((o) => o.L),
      import("./EventMng.js")
    ]).then(async ([
      { Variable: o },
      { PropParser: a },
      { SoundMng: h },
      { ScriptIterator: c },
      { LayerMng: l },
      { EventMng: u }
    ]) => {
      const f = new o(t, this.#t), d = new a(f, t.oCfg.init.escape ?? "\\");
      this.#c = (_, M, S, C) => f.setVal_Nochk(_, M, S, C), this.#r = (_) => d.getValAmpersand(_), this.#l = (_) => d.parse(_), await Promise.allSettled(this.sys.init(this.#t, r, f, this)), this.#t.title({ text: t.oCfg.book.title || "SKYNovel" });
      const g = new h(t, this.#t, f, this);
      this.#s.unshift(() => g.destroy()), this.#e = new c(t, this.#t, this, f, d, g, this.sys), this.#s.unshift(() => this.#e.destroy());
      const y = new q(this.sys, this.#t, this.#e);
      this.#s.unshift(() => y.destroy()), this.errScript = (_, M = !0) => {
        if (this.stop(), q.myTrace(_), j.debugLog && console.log("🍜 SKYNovel err!"), M) throw _;
      }, this.#i = new l(t, this.#t, r, f, this, this.#e, this.sys, g, d), this.#s.unshift(() => this.#i.destroy());
      const m = new u(t, this.#t, r, this, this.#i, f, g, this.#e, this.sys);
      this.#s.unshift(() => m.destroy()), this.#s.unshift(() => {
        this.stop(), this.#n = !1, this.#t = {};
      }), this.#t.jump({ fn: "main" }), this.stop();
    });
  }
  destroy() {
    if (!this.#a) {
      this.#a = !0, this.cvs.parentElement?.removeChild(this.cvs);
      for (const t of this.#s) t();
      this.#s = [];
    }
  }
  #a = !1;
  isDestroyed = () => this.#a;
  errScript = (t, e = !0) => {
  };
  resumeByJumpOrCall(t) {
    if (t.url) {
      this.#t.navigate_to(t), this.#e.jumpJustBefore();
      return;
    }
    this.#c("tmp", "sn.eventArg", t.arg ?? ""), this.#c("tmp", "sn.eventLabel", t.label ?? ""), ht(t, "call", !1) ? (this.#e.subIdxToken(), this.#t.call(t)) : (this.#t.clear_event({}), this.#t.jump(t)), this.resume();
  }
  #c = (t, e, s, r = !1) => {
  };
  resume() {
    this.#a || (this.#i.clearBreak(), this.#e.noticeBreak(!1), queueMicrotask(() => this.#o()));
  }
  stop = () => {
    this.#e.noticeBreak(!0);
  };
  setLoop(t, e = "") {
    (this.#n = t) ? this.resume() : this.stop(), this.sys.setTitleInfo(e ? ` -- ${e}中` : "");
  }
  #n = !0;
  //MARK: メイン処理（シナリオ解析）
  #o() {
    for (; this.#n; ) {
      let t = this.#e.nextToken();
      if (!t) return;
      const e = t.charCodeAt(0);
      if (e !== 9) {
        if (e === 10) {
          this.#e.addLineNum(t.length);
          continue;
        }
        if (e === 91) {
          if (this.#e.isBreak(t)) return;
          try {
            const s = (t.match(/\n/g) ?? []).length;
            if (s > 0 && this.#e.addLineNum(s), this.#e.タグ解析(t)) {
              this.stop();
              return;
            }
            continue;
          } catch (s) {
            s instanceof Error ? this.errScript(`[${Kd(t)}]タグ解析中例外 mes=${s.message}(${s.name})`, !1) : this.errScript(String(s), !1);
            return;
          }
        }
        if (e === 38)
          try {
            if (!t.endsWith("&")) {
              if (this.#e.isBreak(t)) return;
              const s = Jd(t.slice(1));
              s.name = this.#r(s.name), s.text = String(this.#l(s.text)), this.#t.let(s);
              continue;
            }
            if (t.charAt(1) === "&") throw new Error("「&表示&」書式では「&」指定が不要です");
            t = String(this.#l(t.slice(1, -1)));
          } catch (s) {
            this.errScript(
              s instanceof Error ? `& 変数操作・表示 mes=${s.message}(${s.name})` : String(s),
              !1
            );
            return;
          }
        else {
          if (e === 59) continue;
          if (e === 42 && t.length > 1) continue;
        }
        try {
          this.#i.setNormalChWait(), this.#i.currentTxtlayForeNeedErr.tagCh(t);
        } catch (s) {
          this.errScript(
            s instanceof Error ? `文字表示 mes=${s.message}(${s.name})` : String(s),
            !1
          );
          return;
        }
      }
    }
  }
  #r = (t) => "";
  #l = (t) => {
  };
}
const nt = window.to_app;
class hf extends Yd {
  constructor(...[t = {}, e = { cur: "prj/", crypto: !1, dip: "" }]) {
    super(t, e), queueMicrotask(async () => this.loaded(t, e));
  }
  async loaded(...[t, e]) {
    await me.init({ basePath: process.cwd() }), await super.loaded(t, e), this.#t = await nt.getInfo(), j.isPackaged = this.#t.isPackaged, this.arg = e = { ...e, cur: this.#t.getAppPath.replaceAll("\\", "/") + (j.isPackaged ? "/doc/" : "/") + e.cur }, this.$path_downloads = this.#t.downloads.replaceAll("\\", "/") + "/", nt.on("log", (s, r) => console.info("[main log] %o", r)), j.isDbg = !!this.#t.env.SKYNOVEL_DBG && !j.isPackaged, j.isDbg && (this.extPort = lt(this.#t.env.SKYNOVEL_PORT ?? "3776")), await this.run();
  }
  #t = {
    getAppPath: "",
    isPackaged: !1,
    downloads: "",
    userData: "",
    getVersion: "",
    env: {},
    platform: "",
    arch: ""
  };
  fetch = (t) => fetch(t, { cache: "no-store" });
  ensureFileSync = nt.ensureFileSync;
  writeFileSync = nt.writeFileSync;
  appendFile = nt.appendFile;
  outputFile = nt.outputFile;
  $path_userdata = "";
  $path_downloads = "";
  async initVal(t, e, s) {
    e["const.sn.isDebugger"] = !1, this.$path_userdata = j.isDbg ? this.#t.getAppPath.slice(0, -3) + ".vscode/" : this.#t.userData.replaceAll("\\", "/") + "/", this.flushSub = () => {
      nt.flush(JSON.parse(JSON.stringify(this.data)));
    }, this.#e().then(async () => {
      const r = e["const.sn.isFirstBoot"] = await nt.Store_isEmpty();
      if (r)
        this.data.sys = t.sys, this.data.mark = t.mark, this.data.kidoku = t.kidoku, this.flush();
      else {
        const c = await nt.Store_get();
        this.data.sys = c.sys, this.data.mark = c.mark, this.data.kidoku = c.kidoku;
      }
      const n = this.data.sys["const.sn.nativeWindow.x"] ?? 0, o = this.data.sys["const.sn.nativeWindow.y"] ?? 0, a = this.data.sys["const.sn.nativeWindow.w"] ?? j.stageW, h = this.data.sys["const.sn.nativeWindow.h"] ?? j.stageH;
      nt.inited(this.cfg.oCfg, { c: r, x: n, y: o, w: a, h }), nt.on("save_win_inf", (c, { x: l, y: u, w: f, h: d, scrw: g, scrh: y }) => {
        this.val.setVal_Nochk("sys", "const.sn.nativeWindow.x", l), this.val.setVal_Nochk("sys", "const.sn.nativeWindow.y", u), this.val.setVal_Nochk("sys", "const.sn.nativeWindow.w", f), this.val.setVal_Nochk("sys", "const.sn.nativeWindow.h", d), this.flush(), e["const.sn.screenResolutionX"] = g, e["const.sn.screenResolutionY"] = y;
      }), s(this.data);
    });
  }
  #e = () => nt.Store({
    cwd: this.$path_userdata + "storage",
    name: this.arg.crypto ? "data_" : "data",
    encryptionKey: this.arg.crypto ? this.stk() : void 0
  });
  #i;
  async run() {
    this.#i && this.#i.destroy(), this.#i = new Qd(this);
  }
  init(t, e, s, r) {
    const n = super.init(t, e, s, r);
    nt.on("shutdown", (a) => r.destroy());
    const o = new Event("click");
    return nt.on("fire", (a, h) => this.fire(h, o)), n;
  }
  cvsResize() {
    super.cvsResize();
    const t = this.main.cvs, e = t.parentElement.style, s = t.style;
    this.isFullScr ? (e.position = "", e.width = "", e.height = "", s.position = "fixed", s.left = `${this.ofsLeft4elm}px`, s.top = `${this.ofsTop4elm}px`) : (e.position = "relative", e.width = `${this.cvsWidth}px`, e.height = `${this.cvsHeight}px`, s.position = "relative", s.left = "", s.top = "");
  }
  copyBMFolder = async (t, e) => {
    const s = `${this.$path_userdata}storage/${t}/`, r = `${this.$path_userdata}storage/${e}/`;
    await nt.existsSync(s) && nt.copySync(s, r);
  };
  eraseBMFolder = async (t) => {
    await nt.removeSync(`${this.$path_userdata}storage/${t}/`);
  };
  // アプリの終了
  close = () => (nt.win_close(), !1);
  // プレイデータをエクスポート
  _export = () => (nt.zip(
    this.$path_userdata + "storage/",
    this.$path_downloads + (this.arg.crypto ? "" : "no_crypto_") + this.cfg.getNs() + Qo("-", "_", "") + ".spd"
  ), j.debugLog && console.log("プレイデータをエクスポートしました"), this.fire("sn:exported", new Event("click")), !1);
  // プレイデータをインポート
  _import = () => {
    const t = this.flush;
    return new Promise((e, s) => {
      const r = document.createElement("input");
      r.type = "file", r.accept = ".spd, text/plain", r.onchange = () => {
        const n = r.files?.[0];
        n ? e(n.path) : s();
      }, r.click();
    }).then(async (e) => {
      this.flush = () => {
      }, nt.unzip(e, this.$path_userdata + "storage/"), await this.#e();
      const s = await nt.Store_get();
      this.data.sys = s.sys, this.data.mark = s.mark, this.data.kidoku = s.kidoku, this.flush = t, this.flush(), this.val.updateData(s), j.debugLog && console.log("プレイデータをインポートしました"), this.fire("sn:imported", new Event("click"));
    }), !1;
  };
  // ＵＲＬを開く
  navigate_to = (t) => {
    const { url: e } = t;
    if (!e) throw "[navigate_to] urlは必須です";
    return nt.navigate_to(e), !1;
  };
  // タイトル指定
  titleSub(t) {
    nt.win_setTitle(t);
  }
  // 全画面状態切替
  tglFlscr_sub = async () => nt.setSimpleFullScreen(
    this.isFullScr = !await nt.isSimpleFullScreen()
  );
  // 更新チェック
  update_check = (t) => {
    const { url: e } = t;
    if (!e) throw "[update_check] urlは必須です";
    if (!e.endsWith("/")) throw "[update_check] urlの最後は/です";
    return j.debugLog && q.myTrace(`[update_check] url=${e}`, "D"), (async () => {
      let s = {}, r = "", n = "";
      const o = await this.fetch(e + "_index.json");
      if (o.ok)
        j.debugLog && q.myTrace("[update_check] _index.jsonを取得しました", "D"), s = await o.json(), n = s.version;
      else {
        const l = await this.fetch(e + `latest${j.isMac ? "-mac" : ""}.yml`);
        if (!l.ok) {
          j.debugLog && q.myTrace("[update_check] [update_check] .ymlが見つかりません");
          return;
        }
        j.debugLog && q.myTrace("[update_check] .ymlを取得しました", "D"), r = await l.text();
        const f = /version: (.+)/.exec(r)?.[1];
        if (!f) throw "[update_check] .yml に version が見つかりません";
        n = f;
      }
      const a = this.#t.getVersion;
      if (j.debugLog && q.myTrace(`[update_check] 現在ver=${a} 新規ver=${n}`, "D"), n === a) {
        j.debugLog && q.myTrace("[update_check] バージョン更新なし", "I");
        return;
      }
      const h = {
        title: "アプリ更新",
        icon: this.#t.getAppPath + "/app/icon.png",
        buttons: ["OK", "Cancel"],
        defaultId: 0,
        cancelId: 1,
        message: `アプリ【${this.cfg.oCfg.book.title}】に更新があります。
ダウンロードしますか？`,
        detail: `現在 NOW ver ${a}
新規 NEW ver ${n}`
      }, { response: c } = await nt.showMessageBox(h);
      if (!(c > 0)) {
        if (j.debugLog && q.myTrace("[update_check] アプリダウンロード開始", "D"), o.ok) {
          const l = this.#t.platform + "_" + this.#t.arch, { cn: u, path: f } = s[l];
          if (u) await this.#s(e, l + "-" + u, f);
          else {
            let d = "";
            const g = new RegExp("^" + this.#t.platform + "_"), y = Object.entries(s).flatMap(([_, { path: M, cn: S }]) => g.test(_) ? (d += `
- ` + M, () => this.#s(e, _ + "-" + S, M)) : []);
            h.message = `CPU = ${this.#t.arch}
に対応するファイルが見つかりません。同じOSのファイルをすべてダウンロードしますか？`, h.detail = y.length + " 個ファイルがあります" + d;
            const { response: m } = await nt.showMessageBox(h);
            if (m > 0) return;
            await Promise.allSettled(y);
          }
        } else {
          const l = /path: (.+)/.exec(r);
          if (!l) throw "[update_check] path が見つかりません";
          const [, u] = l;
          if (!u) throw "[update_check] path が見つかりません.";
          j.debugLog && q.myTrace(`[update_check] path=${u}`, "D");
          const f = /sha512: (.+)/.exec(r);
          if (!f) throw "[update_check] sha512 が見つかりません";
          const [, d] = f;
          j.debugLog && q.myTrace(`[update_check] sha=${d}=`, "D");
          const [, g, y] = /(.+)(\.\w+)/.exec(u) ?? ["", "", ""];
          await this.#s(e, g + "-" + this.#t.arch + y, u);
        }
        j.debugLog && q.myTrace("アプリファイルを保存しました", "D"), h.buttons.pop(), h.message = `アプリ【${this.cfg.oCfg.book.title}】の更新パッケージを
ダウンロードしました`, nt.showMessageBox(h);
      }
    })(), !1;
  };
  async #s(t, e, s) {
    j.debugLog && q.myTrace(`[update_check] アプリファイルDL試行... url=${t + e}`, "D");
    const r = await this.fetch(t + e);
    if (!r.ok) {
      j.debugLog && q.myTrace(`[update_check] アプリファイルが見つかりません url=${t + s}`);
      return;
    }
    const n = this.#t.downloads + "/" + s;
    j.debugLog && q.myTrace(`[update_check] pathDL=${n}`, "D");
    const o = await r.arrayBuffer();
    await this.writeFileSync(n, new DataView(o));
  }
  // アプリウインドウ設定
  window = (t) => {
    const e = $(t, "x", Number(this.val.getVal("sys:const.sn.nativeWindow.x", 0))), s = $(t, "y", Number(this.val.getVal("sys:const.sn.nativeWindow.y", 0))), r = $(t, "w", Number(this.val.getVal("sys:const.sn.nativeWindow.w", j.stageW))), n = $(t, "h", Number(this.val.getVal("sys:const.sn.nativeWindow.h", j.stageH)));
    return nt.window(ht(t, "centering", !1), e, s, j.stageW, j.stageH), this.val.setVal_Nochk("sys", "const.sn.nativeWindow.x", e), this.val.setVal_Nochk("sys", "const.sn.nativeWindow.y", s), this.val.setVal_Nochk("sys", "const.sn.nativeWindow.w", r), this.val.setVal_Nochk("sys", "const.sn.nativeWindow.h", n), this.flush(), !1;
  };
  capturePage(t, e, s, r) {
    nt.capturePage(t, e, s).then(() => r());
  }
}
class Yt {
  layname = "";
  name_ = "";
  set name(t) {
    this.name_ = t;
  }
  get name() {
    return this.name_;
  }
  ctn = new Ct({
    // this will make moving this container GPU powered
    isRenderGroup: !0
    // https://pixijs.com/8.x/examples/basic/render-group
  });
  //	readonly	ctn	= new Container;
  // tsy用
  get alpha() {
    return this.ctn.alpha;
  }
  set alpha(t) {
    this.ctn.alpha = t;
  }
  get height() {
    return this.ctn.height;
  }
  get rotation() {
    return this.ctn.angle;
  }
  set rotation(t) {
    this.ctn.angle = t;
  }
  get scale_x() {
    return this.ctn.scale.x;
  }
  set scale_x(t) {
    this.ctn.scale.x = t;
  }
  get scale_y() {
    return this.ctn.scale.y;
  }
  set scale_y(t) {
    this.ctn.scale.y = t;
  }
  get width() {
    return this.ctn.width;
  }
  get x() {
    return this.ctn.x;
  }
  set x(t) {
    this.procSetX(t), this.ctn.x = t;
  }
  procSetX(t) {
  }
  // set を override できないので
  get y() {
    return this.ctn.y;
  }
  set y(t) {
    this.procSetY(t), this.ctn.y = t;
  }
  procSetY(t) {
  }
  // set を override できないので
  destroy() {
  }
  lay(t) {
    const e = this.ctn;
    return "alpha" in t && (e.alpha = $(t, "alpha", 1)), Yt.setBlendmode(e, t), ("pivot_x" in t || "pivot_y" in t) && e.pivot.set(
      $(t, "pivot_x", e.pivot.x),
      $(t, "pivot_y", e.pivot.y)
    ), "rotation" in t && (e.angle = $(t, "rotation", 0)), ("scale_x" in t || "scale_y" in t) && e.scale.set(
      $(t, "scale_x", e.scale.x),
      $(t, "scale_y", e.scale.y)
    ), "visible" in t && (e.visible = ht(t, "visible", !0)), "filter" in t && (e.filters = [Yt.bldFilters(t)], this.aFltHArg = [t]), !1;
  }
  aFltHArg = [];
  /*
  * 現状未サポート
  	* FXAAFilter		geeks3d.com のコードに基づいた基本的な FXAA (高速近似アンチエイリアシング) の実装ですが、WebGL でサポートされていないため、texture2DLod 要素が削除されたという変更が加えられています。
  	* 	https://pixijs.download/v6.5.10/docs/PIXI.filters.FXAAFilter.html
  	* DisplacementFilter	指定されたテクスチャ (ディスプレイスメント マップと呼ばれる) のピクセル値を使用して、オブジェクトのディスプレイスメントを実行します。
  	* 	https://pixijs.download/v6.5.10/docs/PIXI.filters.DisplacementFilter.html
  	* 		人形城のヒビキとかのやつ？
  */
  // フィルター生成
  static bldFilters(t) {
    const { filter: e = "" } = t, s = Yt.hBldFilter[e];
    if (!s) throw "filter が異常です";
    const r = s(t);
    r.enabled = ht(t, "enable_filter", !0);
    const { blendmode: n } = t;
    return n && (r.blendMode = Yt.getBlendmodeNum(n)), r;
  }
  // https://github.com/pixijs/filters
  static hBldFilter = {
    blur: (t) => {
      const e = new Zo(
        {
          kernelSize: $(t, "kernel_size", 5),
          // カーネルサイズ。値は 5、7、9、11、13、15。
          quality: $(t, "quality", 4),
          // 品質
          strength: $(t, "strength", 8),
          // 強さ
          strengthX: $(t, "strengthX", 8),
          strengthY: $(t, "strengthY", 8)
        }
        //				'resolution' in hArg ?argChk_Num(hArg, 'resolution', 0) :undefined,							// 解像度
      );
      return e.blurX = lt($(t, "blur_x", 2)), e.blurY = lt($(t, "blur_y", 2)), e.repeatEdgePixels = ht(t, "repeat_edge_pixels", !1), e;
    },
    // https://pixijs.download/v6.5.10/docs/PIXI.filters.NoiseFilter.html
    noise: (t) => new Uu({
      // ノイズエフェクト
      noise: $(t, "noise", 0.5),
      // 適用するノイズの量。この値は (0, 1] の範囲内
      seed: "seed" in t ? $(t, "seed", 0) : void 0
      // ランダム ノイズの生成に適用するシード値。 Math.random() を使用するのが適切な値です。
    }),
    // https://pixijs.download/v6.5.10/docs/PIXI.filters.ColorMatrixFilter.html
    color_matrix: (t) => {
      const e = new gt();
      e.alpha = lt($(t, "alpha", 1));
      const { matrix: s = "" } = t;
      if (s) {
        const r = s.split(","), n = r.length;
        if (n !== 20) throw `matrix の個数（${n}）が 20 ではありません`;
        for (let o = 0; o < n; ++o) e.matrix[o] = lt(r[o]);
      } else
        e.matrix[0] = lt($(t, "rtor", 1)), e.matrix[1] = lt($(t, "gtor", 0)), e.matrix[2] = lt($(t, "btor", 0)), e.matrix[3] = lt($(t, "ator", 0)), e.matrix[4] = lt($(t, "pr", 0)), e.matrix[5] = lt($(t, "rtog", 0)), e.matrix[6] = lt($(t, "gtog", 1)), e.matrix[7] = lt($(t, "btog", 0)), e.matrix[8] = lt($(t, "atog", 0)), e.matrix[9] = lt($(t, "pg", 0)), e.matrix[10] = lt($(t, "rtob", 0)), e.matrix[11] = lt($(t, "gtob", 0)), e.matrix[12] = lt($(t, "btob", 1)), e.matrix[13] = lt($(t, "atob", 0)), e.matrix[14] = lt($(t, "pb", 0)), e.matrix[15] = lt($(t, "rtoa", 0)), e.matrix[16] = lt($(t, "gtoa", 0)), e.matrix[17] = lt($(t, "btoa", 0)), e.matrix[18] = lt($(t, "atoa", 1)), e.matrix[19] = lt($(t, "pa", 0));
      return e;
    },
    black_and_white: (t) => {
      const e = new gt();
      return e.blackAndWhite(
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    brightness: (t) => {
      const e = new gt();
      return e.brightness(
        $(t, "b", 0.5),
        // 明るさの値 (0 ～ 1、0 は黒)
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    browni: (t) => {
      const e = new gt();
      return e.browni(
        ht(t, "multiply", !0)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    color_tone: (t) => {
      const e = new gt();
      return e.colorTone(
        $(t, "desaturation", 0.5),
        $(t, "toned", 0.5),
        $(t, "light_color", 16770432),
        $(t, "dark_color", 16770432),
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    contrast: (t) => {
      const e = new gt();
      return e.contrast(
        $(t, "amount", 0.5),
        // コントラストの値 (0-1)
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    grayscale: (t) => {
      const e = new gt();
      return e.grayscale(
        $(t, "scale", 0.5),
        // グレーの値 (0 ～ 1、0 は黒)
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    hue: (t) => {
      const e = new gt();
      return e.hue(
        $(t, "f_rotation", 90),
        // 0だと変化なしで分かりづらいので
        // 度単位
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    kodachrome: (t) => {
      const e = new gt();
      return e.kodachrome(
        ht(t, "multiply", !0)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    lsd: (t) => {
      const e = new gt();
      return e.lsd(
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    negative: (t) => {
      const e = new gt();
      return e.negative(
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    night: (t) => {
      const e = new gt();
      return e.night(
        $(t, "intensity", 0.5),
        // 夜の効果の強さ
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    polaroid: (t) => {
      const e = new gt();
      return e.polaroid(
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    predator: (t) => {
      const e = new gt();
      return e.predator(
        $(t, "amount", 0.5),
        // 捕食者は自分の将来の犠牲者をどれほど感じているか
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    saturate: (t) => {
      const e = new gt();
      return e.saturate(
        $(t, "amount", 0.5),
        // 飽和量(0～1)
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    sepia: (t) => {
      const e = new gt();
      return e.sepia(
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    technicolor: (t) => {
      const e = new gt();
      return e.technicolor(
        ht(t, "multiply", !0)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    tint: (t) => {
      const e = new gt();
      return e.tint(
        $(t, "f_color", 8947848),
        // 色合いの色。 これは 16 進数値です。
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    to_bgr: (t) => {
      const e = new gt();
      return e.toBGR(
        ht(t, "multiply", !1)
        // true の場合、現在の行列と行列を乗算
      ), e;
    },
    vintage: (t) => {
      const e = new gt();
      return e.vintage(
        ht(t, "multiply", !0)
        // true の場合、現在の行列と行列を乗算
      ), e;
    }
  };
  static setBlendmode(t, e) {
    const { blendmode: s } = e;
    if (!s) return;
    const r = Yt.getBlendmodeNum(s);
    t instanceof ue && (t.blendMode = r);
    for (const n of t.children)
      n instanceof ue && (n.blendMode = r);
  }
  static getBlendmodeNum(t) {
    if (!t) return "normal";
    const e = Yt.#t[t];
    if (e !== void 0) return e;
    throw `${t} はサポートされない blendmode です`;
  }
  static #t = {
    inherit: "inherit",
    normal: "normal",
    add: "add",
    multiply: "multiply",
    screen: "screen",
    darken: "darken",
    lighten: "lighten",
    erase: "erase",
    "color-dodge": "color-dodge",
    "color-burn": "color-burn",
    "linear-burn": "linear-burn",
    "linear-dodge": "linear-dodge",
    "linear-light": "linear-light",
    "hard-light": "hard-light",
    "soft-light": "soft-light",
    "pin-light": "pin-light",
    difference: "difference",
    exclusion: "exclusion",
    overlay: "overlay",
    saturation: "saturation",
    color: "color",
    luminosity: "luminosity",
    "normal-npm": "normal-npm",
    "add-npm": "add-npm",
    "screen-npm": "screen-npm",
    none: "none",
    subtract: "subtract",
    divide: "divide",
    "vivid-light": "vivid-light",
    "hard-mix": "hard-mix",
    negation: "negation",
    min: "min",
    max: "max"
  };
  // アニメ・動画があるか
  get containMovement() {
    return !1;
  }
  renderStart() {
  }
  renderEnd() {
  }
  clearLay(t) {
    this.ctn.alpha = 1, this.ctn.blendMode = "normal", this.ctn.pivot.set(0, 0), this.ctn.angle = 0, this.ctn.scale.set(1, 1), ht(t, "clear_filter", !1) && (this.ctn.filters = [], this.aFltHArg = []);
  }
  copy(t, e) {
    const s = this.name_;
    this.playback(t.record(), e), this.name = s;
  }
  record() {
    return {
      name: this.name_,
      idx: this.ctn.parent.getChildIndex(this.ctn),
      alpha: this.ctn.alpha,
      blendMode: this.ctn.blendMode,
      rotation: this.ctn.angle,
      scale_x: this.ctn.scale.x,
      scale_y: this.ctn.scale.y,
      pivot_x: this.ctn.pivot.x,
      pivot_y: this.ctn.pivot.y,
      x: this.ctn.x,
      y: this.ctn.y,
      visible: this.ctn.visible,
      aFltHArg: this.aFltHArg
    };
  }
  playback(t, e) {
    this.name = t.name, this.clearLay({ clear_filter: !0 }), this.ctn.alpha = t.alpha, this.ctn.blendMode = t.blendMode, this.ctn.angle = t.rotation, this.ctn.scale.set(t.scale_x, t.scale_y), this.ctn.pivot.set(t.pivot_x, t.pivot_y), this.ctn.position.set(t.x, t.y), this.ctn.visible = t.visible, this.aFltHArg = t.aFltHArg ?? [], this.ctn.filters = this.aFltHArg.map((s) => Yt.bldFilters(s));
  }
  snapshot(t, e) {
    t.render({ container: this.ctn, clear: !1 }), e();
  }
  snapshot_end() {
  }
  makeDesignCast(t) {
  }
  makeDesignCastChildren(t) {
  }
  showDesignCast() {
  }
  showDesignCastChildren() {
  }
  cvsResize() {
  }
  cvsResizeChildren() {
  }
  dump() {
    return ` "idx":${this.ctn.parent.getChildIndex(this.ctn)}, "visible":"${this.ctn.visible}", "left":${this.ctn.x}, "top":${this.ctn.y}, "alpha":${this.ctn.alpha}, "rotation":${this.ctn.angle}, "blendMode":"${this.ctn.blendMode}", "name":"${this.name_}", "scale_x":${this.ctn.scale.x}, "scale_y":${this.ctn.scale.y}, "filters": [${this.aFltHArg.map((t) => `"${t.filter}"`).join(",")}]`;
  }
  static setXY(t, e, s, r = !1, n = !1) {
    if (e.pos) {
      Yt.setXYByPos(t, e.pos, s);
      return;
    }
    const o = t.getBounds(), a = s.scale.x < 0 ? -s.scale.x : s.scale.x, h = a === 1 ? o.width : o.width * a, c = s.scale.y < 0 ? -s.scale.y : s.scale.y, l = c === 1 ? o.height : o.height * c;
    let u = s.x;
    "left" in e ? (u = $(e, "left", 0), u > -1 && u < 1 && (u *= j.stageW)) : "center" in e ? (u = $(e, "center", 0), u > -1 && u < 1 && (u *= j.stageW), u = u - (n ? h / 3 : h) / 2) : "right" in e ? (u = $(e, "right", 0), u > -1 && u < 1 && (u *= j.stageW), u = u - (n ? h / 3 : h)) : "s_right" in e && (u = $(e, "s_right", 0), u > -1 && u < 1 && (u *= j.stageW), u = j.stageW - u - (n ? h / 3 : h)), s.x = ce(s.scale.x < 0 ? u + (n ? h / 3 : h) : u);
    let f = s.y;
    "top" in e ? (f = $(e, "top", 0), f > -1 && f < 1 && (f *= j.stageH)) : "middle" in e ? (f = $(e, "middle", 0), f > -1 && f < 1 && (f *= j.stageH), f = f - l / 2) : "bottom" in e ? (f = $(e, "bottom", 0), f > -1 && f < 1 && (f *= j.stageH), f = f - l) : "s_bottom" in e && (f = $(e, "s_bottom", 0), f > -1 && f < 1 && (f *= j.stageH), f = j.stageH - f - l), s.y = ce(s.scale.y < 0 ? f + l : f), r && !("left" in e) && !("center" in e) && !("right" in e) && !("s_right" in e) && !("top" in e) && !("middle" in e) && !("bottom" in e) && !("s_bottom" in e) && Yt.setXYByPos(t, "c", s);
  }
  static setXYByPos(t, e, s) {
    if (e === "stay") return;
    if (t === void 0) throw "setXYByPos base === undefined";
    if (s === void 0) throw "setXYByPos result === undefined";
    const r = t.getBounds(), n = s.scale.x < 0 ? -s.scale.x : s.scale.x, o = n === 1 ? r.width : r.width * n, a = s.scale.y < 0 ? -s.scale.y : s.scale.y, h = a === 1 ? r.height : r.height * a;
    let c = 0;
    !e || e === "c" ? c = j.stageW * 0.5 : e === "r" ? c = j.stageW - o * 0.5 : e === "l" ? c = o * 0.5 : c = ce(e), s.x = ce(c - o * 0.5), s.y = j.stageH - h, s.scale.x < 0 && (s.x += o), s.scale.y < 0 && (s.y += h);
  }
  static setXYCenter(t) {
    const e = t.getBounds();
    t.x = (j.stageW - e.width) * 0.5, t.y = (j.stageH - e.height) * 0.5;
  }
}
export {
  ol as $,
  qd as A,
  nf as B,
  j as C,
  q as D,
  Rt as E,
  ef as F,
  he as G,
  sf as H,
  rf as I,
  Vd as J,
  Xd as K,
  Yt as L,
  Zh as M,
  As as N,
  Bt as O,
  Pt as P,
  Se as Q,
  wt as R,
  we as S,
  tt as T,
  bi as U,
  ch as V,
  se as W,
  mt as X,
  Nt as Y,
  qt as Z,
  jh as _,
  $ as a,
  Rr as a0,
  ll as a1,
  Et as a2,
  He as a3,
  ds as a4,
  Ui as a5,
  ho as a6,
  Vn as a7,
  Ms as a8,
  on as a9,
  Kh as aA,
  ml as aB,
  Nl as aC,
  Ol as aD,
  Gl as aE,
  $l as aF,
  Ul as aG,
  Ge as aH,
  _e as aI,
  Bc as aJ,
  Io as aK,
  zr as aL,
  Or as aM,
  La as aN,
  cn as aO,
  Dc as aP,
  pt as aQ,
  Na as aR,
  Bi as aS,
  hn as aT,
  xs as aU,
  Lo as aV,
  hf as aW,
  et as aa,
  Bl as ab,
  Fl as ac,
  Dl as ad,
  _o as ae,
  Wl as af,
  Ss as ag,
  uo as ah,
  $e as ai,
  Ba as aj,
  Yl as ak,
  Qt as al,
  Nn as am,
  We as an,
  Xt as ao,
  Mr as ap,
  Eh as aq,
  Wh as ar,
  vt as as,
  Yh as at,
  Ar as au,
  Tr as av,
  lh as aw,
  Gs as ax,
  Rn as ay,
  fo as az,
  ht as b,
  Kt as c,
  ot as d,
  af as e,
  ea as f,
  Qo as g,
  Zd as h,
  ce as i,
  me as j,
  Zu as k,
  Ct as l,
  Je as m,
  U as n,
  bt as o,
  Vu as p,
  ue as q,
  Va as r,
  Ve as s,
  Kd as t,
  lt as u,
  yt as v,
  xt as w,
  an as x,
  us as y,
  ut as z
};
//# sourceMappingURL=app2.js.map
