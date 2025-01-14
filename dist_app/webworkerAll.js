import { n as g, U as dt, m as de, aI as L, aa as C, aB as J, a8 as A, a4 as Se, w as V, an as S, T as M, P as ut, ai as Z, ao as Be, d as ee, v as Ce, a3 as k, a2 as B, z as U, s as K, aJ as lt, _ as E, al as b, aK as ct, aL as te, aq as N, aM as z, ag as re, Q as ht, W as ft, aN as pt, ab as Pe, aC as Re, af as Me, aF as Ue, ae as gt, ac as mt, ad as xt, aD as _t, aE as bt, aG as yt, aO as vt, aP as Tt, aQ as q, aR as Q, X as Ge, a9 as H, R as ue, x as F, aS as wt, aT as le, aU as ce, o as v, aV as St } from "./app2.js";
import { c as I, a as Bt, b as Ct, B as Fe } from "./colorToUniform.js";
import { G as Pt } from "./Graphics.js";
class Ae {
  /**
   * Initialize the plugin with scope of application instance
   * @static
   * @private
   * @param {object} [options] - See application options
   */
  static init(e) {
    Object.defineProperty(
      this,
      "resizeTo",
      /**
       * The HTML element or window to automatically resize the
       * renderer's view element to match width and height.
       * @member {Window|HTMLElement}
       * @name resizeTo
       * @memberof app.Application#
       */
      {
        set(t) {
          globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = t, t && (globalThis.addEventListener("resize", this.queueResize), this.resize());
        },
        get() {
          return this._resizeTo;
        }
      }
    ), this.queueResize = () => {
      this._resizeTo && (this._cancelResize(), this._resizeId = requestAnimationFrame(() => this.resize()));
    }, this._cancelResize = () => {
      this._resizeId && (cancelAnimationFrame(this._resizeId), this._resizeId = null);
    }, this.resize = () => {
      if (!this._resizeTo)
        return;
      this._cancelResize();
      let t, r;
      if (this._resizeTo === globalThis.window)
        t = globalThis.innerWidth, r = globalThis.innerHeight;
      else {
        const { clientWidth: s, clientHeight: a } = this._resizeTo;
        t = s, r = a;
      }
      this.renderer.resize(t, r), this.render();
    }, this._resizeId = null, this._resizeTo = null, this.resizeTo = e.resizeTo || null;
  }
  /**
   * Clean up the ticker, scoped to application
   * @static
   * @private
   */
  static destroy() {
    globalThis.removeEventListener("resize", this.queueResize), this._cancelResize(), this._cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
  }
}
Ae.extension = g.Application;
class ke {
  /**
   * Initialize the plugin with scope of application instance
   * @static
   * @private
   * @param {object} [options] - See application options
   */
  static init(e) {
    e = Object.assign({
      autoStart: !0,
      sharedTicker: !1
    }, e), Object.defineProperty(
      this,
      "ticker",
      {
        set(t) {
          this._ticker && this._ticker.remove(this.render, this), this._ticker = t, t && t.add(this.render, this, dt.LOW);
        },
        get() {
          return this._ticker;
        }
      }
    ), this.stop = () => {
      this._ticker.stop();
    }, this.start = () => {
      this._ticker.start();
    }, this._ticker = null, this.ticker = e.sharedTicker ? de.shared : new de(), e.autoStart && this.start();
  }
  /**
   * Clean up the ticker, scoped to application.
   * @static
   * @private
   */
  static destroy() {
    if (this._ticker) {
      const e = this._ticker;
      this.ticker = null, e.destroy();
    }
  }
}
ke.extension = g.Application;
class He {
  constructor(e) {
    this._renderer = e;
  }
  push(e, t, r) {
    this._renderer.renderPipes.batch.break(r), r.add({
      renderPipeId: "filter",
      canBundle: !1,
      action: "pushFilter",
      container: t,
      filterEffect: e
    });
  }
  pop(e, t, r) {
    this._renderer.renderPipes.batch.break(r), r.add({
      renderPipeId: "filter",
      action: "popFilter",
      canBundle: !1
    });
  }
  execute(e) {
    e.action === "pushFilter" ? this._renderer.filter.push(e) : e.action === "popFilter" && this._renderer.filter.pop();
  }
  destroy() {
    this._renderer = null;
  }
}
He.extension = {
  type: [
    g.WebGLPipes,
    g.WebGPUPipes,
    g.CanvasPipes
  ],
  name: "filter"
};
const Rt = new C();
function Mt(i, e) {
  e.clear(), De(i, e), e.isValid || e.set(0, 0, 0, 0);
  const t = i.renderGroup || i.parentRenderGroup;
  return e.applyMatrix(t.worldTransform), e;
}
function De(i, e) {
  if (i.localDisplayStatus !== 7 || !i.measurable)
    return;
  const t = !!i.effects.length;
  let r = e;
  if ((i.renderGroup || t) && (r = L.get().clear()), i.boundsArea)
    e.addRect(i.boundsArea, i.worldTransform);
  else {
    if (i.renderPipeId) {
      const a = i.bounds;
      r.addFrame(
        a.minX,
        a.minY,
        a.maxX,
        a.maxY,
        i.groupTransform
      );
    }
    const s = i.children;
    for (let a = 0; a < s.length; a++)
      De(s[a], r);
  }
  if (t) {
    let s = !1;
    const a = i.renderGroup || i.parentRenderGroup;
    for (let n = 0; n < i.effects.length; n++)
      i.effects[n].addBounds && (s || (s = !0, r.applyMatrix(a.worldTransform)), i.effects[n].addBounds(r, !0));
    s && (r.applyMatrix(a.worldTransform.copyTo(Rt).invert()), e.addBounds(r, i.relativeGroupTransform)), e.addBounds(r), L.return(r);
  } else i.renderGroup && (e.addBounds(r, i.relativeGroupTransform), L.return(r));
}
function Ut(i, e) {
  e.clear();
  const t = e.matrix;
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    s.globalDisplayStatus < 7 || (e.matrix = s.worldTransform, e.addBounds(s.bounds));
  }
  return e.matrix = t, e;
}
const Gt = new J({
  attributes: {
    aPosition: {
      buffer: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      format: "float32x2",
      stride: 2 * 4,
      offset: 0
    }
  },
  indexBuffer: new Uint32Array([0, 1, 2, 0, 2, 3])
});
class ze {
  constructor(e) {
    this._filterStackIndex = 0, this._filterStack = [], this._filterGlobalUniforms = new A({
      uInputSize: { value: new Float32Array(4), type: "vec4<f32>" },
      uInputPixel: { value: new Float32Array(4), type: "vec4<f32>" },
      uInputClamp: { value: new Float32Array(4), type: "vec4<f32>" },
      uOutputFrame: { value: new Float32Array(4), type: "vec4<f32>" },
      uGlobalFrame: { value: new Float32Array(4), type: "vec4<f32>" },
      uOutputTexture: { value: new Float32Array(4), type: "vec4<f32>" }
    }), this._globalFilterBindGroup = new Se({}), this.renderer = e;
  }
  /**
   * The back texture of the currently active filter. Requires the filter to have `blendRequired` set to true.
   * @readonly
   */
  get activeBackTexture() {
    return this._activeFilterData?.backTexture;
  }
  push(e) {
    const t = this.renderer, r = e.filterEffect.filters;
    this._filterStack[this._filterStackIndex] || (this._filterStack[this._filterStackIndex] = this._getFilterData());
    const s = this._filterStack[this._filterStackIndex];
    if (this._filterStackIndex++, r.length === 0) {
      s.skip = !0;
      return;
    }
    const a = s.bounds;
    if (e.renderables ? Ut(e.renderables, a) : e.filterEffect.filterArea ? (a.clear(), a.addRect(e.filterEffect.filterArea), a.applyMatrix(e.container.worldTransform)) : Mt(e.container, a), e.container) {
      const h = (e.container.renderGroup || e.container.parentRenderGroup).cacheToLocalTransform;
      h && a.applyMatrix(h);
    }
    const n = t.renderTarget.renderTarget.colorTexture.source;
    let o = 1 / 0, d = 0, l = !0, c = !1, u = !1, f = !0;
    for (let p = 0; p < r.length; p++) {
      const h = r[p];
      if (o = Math.min(o, h.resolution === "inherit" ? n._resolution : h.resolution), d += h.padding, h.antialias === "off" ? l = !1 : h.antialias === "inherit" && l && (l = n.antialias), h.clipToViewport || (f = !1), !!!(h.compatibleRenderers & t.type)) {
        u = !1;
        break;
      }
      if (h.blendRequired && !(t.backBuffer?.useBackBuffer ?? !0)) {
        V("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."), u = !1;
        break;
      }
      u = h.enabled || u, c || (c = h.blendRequired);
    }
    if (!u) {
      s.skip = !0;
      return;
    }
    if (f) {
      const p = t.renderTarget.rootViewPort, h = t.renderTarget.renderTarget.resolution;
      a.fitBounds(0, p.width / h, 0, p.height / h);
    }
    if (a.scale(o).ceil().scale(1 / o).pad(d | 0), !a.isPositive) {
      s.skip = !0;
      return;
    }
    s.skip = !1, s.bounds = a, s.blendRequired = c, s.container = e.container, s.filterEffect = e.filterEffect, s.previousRenderSurface = t.renderTarget.renderSurface, s.inputTexture = S.getOptimalTexture(
      a.width,
      a.height,
      o,
      l
    ), t.renderTarget.bind(s.inputTexture, !0), t.globalUniforms.push({
      offset: a
    });
  }
  pop() {
    const e = this.renderer;
    this._filterStackIndex--;
    const t = this._filterStack[this._filterStackIndex];
    if (t.skip)
      return;
    this._activeFilterData = t;
    const r = t.inputTexture, s = t.bounds;
    let a = M.EMPTY;
    if (e.renderTarget.finishRenderPass(), t.blendRequired) {
      const o = this._filterStackIndex > 0 ? this._filterStack[this._filterStackIndex - 1].bounds : null, d = e.renderTarget.getRenderTarget(t.previousRenderSurface);
      a = this.getBackTexture(d, s, o);
    }
    t.backTexture = a;
    const n = t.filterEffect.filters;
    if (this._globalFilterBindGroup.setResource(r.source.style, 2), this._globalFilterBindGroup.setResource(a.source, 3), e.globalUniforms.pop(), n.length === 1)
      n[0].apply(this, r, t.previousRenderSurface, !1), S.returnTexture(r);
    else {
      let o = t.inputTexture, d = S.getOptimalTexture(
        s.width,
        s.height,
        o.source._resolution,
        !1
      ), l = 0;
      for (l = 0; l < n.length - 1; ++l) {
        n[l].apply(this, o, d, !0);
        const u = o;
        o = d, d = u;
      }
      n[l].apply(this, o, t.previousRenderSurface, !1), S.returnTexture(o), S.returnTexture(d);
    }
    t.blendRequired && S.returnTexture(a);
  }
  getBackTexture(e, t, r) {
    const s = e.colorTexture.source._resolution, a = S.getOptimalTexture(
      t.width,
      t.height,
      s,
      !1
    );
    let n = t.minX, o = t.minY;
    r && (n -= r.minX, o -= r.minY), n = Math.floor(n * s), o = Math.floor(o * s);
    const d = Math.ceil(t.width * s), l = Math.ceil(t.height * s);
    return this.renderer.renderTarget.copyToTexture(
      e,
      a,
      { x: n, y: o },
      { width: d, height: l },
      { x: 0, y: 0 }
    ), a;
  }
  applyFilter(e, t, r, s) {
    const a = this.renderer, n = this._filterStack[this._filterStackIndex], o = n.bounds, d = ut.shared, c = n.previousRenderSurface === r;
    let u = this.renderer.renderTarget.rootRenderTarget.colorTexture.source._resolution, f = this._filterStackIndex - 1;
    for (; f > 0 && this._filterStack[f].skip; )
      --f;
    f > 0 && (u = this._filterStack[f].inputTexture.source._resolution);
    const p = this._filterGlobalUniforms, h = p.uniforms, m = h.uOutputFrame, _ = h.uInputSize, x = h.uInputPixel, T = h.uInputClamp, w = h.uGlobalFrame, P = h.uOutputTexture;
    if (c) {
      let R = this._filterStackIndex;
      for (; R > 0; ) {
        R--;
        const y = this._filterStack[this._filterStackIndex - 1];
        if (!y.skip) {
          d.x = y.bounds.minX, d.y = y.bounds.minY;
          break;
        }
      }
      m[0] = o.minX - d.x, m[1] = o.minY - d.y;
    } else
      m[0] = 0, m[1] = 0;
    m[2] = t.frame.width, m[3] = t.frame.height, _[0] = t.source.width, _[1] = t.source.height, _[2] = 1 / _[0], _[3] = 1 / _[1], x[0] = t.source.pixelWidth, x[1] = t.source.pixelHeight, x[2] = 1 / x[0], x[3] = 1 / x[1], T[0] = 0.5 * x[2], T[1] = 0.5 * x[3], T[2] = t.frame.width * _[2] - 0.5 * x[2], T[3] = t.frame.height * _[3] - 0.5 * x[3];
    const D = this.renderer.renderTarget.rootRenderTarget.colorTexture;
    w[0] = d.x * u, w[1] = d.y * u, w[2] = D.source.width * u, w[3] = D.source.height * u;
    const G = this.renderer.renderTarget.getRenderTarget(r);
    if (a.renderTarget.bind(r, !!s), r instanceof M ? (P[0] = r.frame.width, P[1] = r.frame.height) : (P[0] = G.width, P[1] = G.height), P[2] = G.isRoot ? -1 : 1, p.update(), a.renderPipes.uniformBatch) {
      const R = a.renderPipes.uniformBatch.getUboResource(p);
      this._globalFilterBindGroup.setResource(R, 0);
    } else
      this._globalFilterBindGroup.setResource(p, 0);
    this._globalFilterBindGroup.setResource(t.source, 1), this._globalFilterBindGroup.setResource(t.source.style, 2), e.groups[0] = this._globalFilterBindGroup, a.encoder.draw({
      geometry: Gt,
      shader: e,
      state: e._state,
      topology: "triangle-list"
    }), a.type === Z.WEBGL && a.renderTarget.finishRenderPass();
  }
  _getFilterData() {
    return {
      skip: !1,
      inputTexture: null,
      bounds: new Be(),
      container: null,
      filterEffect: null,
      blendRequired: !1,
      previousRenderSurface: null
    };
  }
  /**
   * Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
   *
   * Use `outputMatrix * vTextureCoord` in the shader.
   * @param outputMatrix - The matrix to output to.
   * @param {Sprite} sprite - The sprite to map to.
   * @returns The mapped matrix.
   */
  calculateSpriteMatrix(e, t) {
    const r = this._activeFilterData, s = e.set(
      r.inputTexture._source.width,
      0,
      0,
      r.inputTexture._source.height,
      r.bounds.minX,
      r.bounds.minY
    ), a = t.worldTransform.copyTo(C.shared), n = t.renderGroup || t.parentRenderGroup;
    return n && n.cacheToLocalTransform && a.prepend(n.cacheToLocalTransform), a.invert(), s.prepend(a), s.scale(
      1 / t.texture.frame.width,
      1 / t.texture.frame.height
    ), s.translate(t.anchor.x, t.anchor.y), s;
  }
}
ze.extension = {
  type: [
    g.WebGLSystem,
    g.WebGPUSystem
  ],
  name: "filter"
};
const We = class Oe extends J {
  constructor(...e) {
    let t = e[0] ?? {};
    t instanceof Float32Array && (ee(Ce, "use new MeshGeometry({ positions, uvs, indices }) instead"), t = {
      positions: t,
      uvs: e[1],
      indices: e[2]
    }), t = { ...Oe.defaultOptions, ...t };
    const r = t.positions || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), s = t.uvs || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), a = t.indices || new Uint32Array([0, 1, 2, 0, 2, 3]), n = t.shrinkBuffersToFit, o = new k({
      data: r,
      label: "attribute-mesh-positions",
      shrinkToFit: n,
      usage: B.VERTEX | B.COPY_DST
    }), d = new k({
      data: s,
      label: "attribute-mesh-uvs",
      shrinkToFit: n,
      usage: B.VERTEX | B.COPY_DST
    }), l = new k({
      data: a,
      label: "index-mesh-buffer",
      shrinkToFit: n,
      usage: B.INDEX | B.COPY_DST
    });
    super({
      attributes: {
        aPosition: {
          buffer: o,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        },
        aUV: {
          buffer: d,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        }
      },
      indexBuffer: l,
      topology: t.topology
    }), this.batchMode = "auto";
  }
  /** The positions of the mesh. */
  get positions() {
    return this.attributes.aPosition.buffer.data;
  }
  set positions(e) {
    this.attributes.aPosition.buffer.data = e;
  }
  /** The UVs of the mesh. */
  get uvs() {
    return this.attributes.aUV.buffer.data;
  }
  set uvs(e) {
    this.attributes.aUV.buffer.data = e;
  }
  /** The indices of the mesh. */
  get indices() {
    return this.indexBuffer.data;
  }
  set indices(e) {
    this.indexBuffer.data = e;
  }
};
We.defaultOptions = {
  topology: "triangle-list",
  shrinkBuffersToFit: !1
};
let se = We;
function Ft(i) {
  const e = i._stroke, t = i._fill, s = [`div { ${[
    `color: ${U.shared.setValue(t.color).toHex()}`,
    `font-size: ${i.fontSize}px`,
    `font-family: ${i.fontFamily}`,
    `font-weight: ${i.fontWeight}`,
    `font-style: ${i.fontStyle}`,
    `font-variant: ${i.fontVariant}`,
    `letter-spacing: ${i.letterSpacing}px`,
    `text-align: ${i.align}`,
    `padding: ${i.padding}px`,
    `white-space: ${i.whiteSpace === "pre" && i.wordWrap ? "pre-wrap" : i.whiteSpace}`,
    ...i.lineHeight ? [`line-height: ${i.lineHeight}px`] : [],
    ...i.wordWrap ? [
      `word-wrap: ${i.breakWords ? "break-all" : "break-word"}`,
      `max-width: ${i.wordWrapWidth}px`
    ] : [],
    ...e ? [Ee(e)] : [],
    ...i.dropShadow ? [Ve(i.dropShadow)] : [],
    ...i.cssOverrides
  ].join(";")} }`];
  return At(i.tagStyles, s), s.join(" ");
}
function Ve(i) {
  const e = U.shared.setValue(i.color).setAlpha(i.alpha).toHexa(), t = Math.round(Math.cos(i.angle) * i.distance), r = Math.round(Math.sin(i.angle) * i.distance), s = `${t}px ${r}px`;
  return i.blur > 0 ? `text-shadow: ${s} ${i.blur}px ${e}` : `text-shadow: ${s} ${e}`;
}
function Ee(i) {
  return [
    `-webkit-text-stroke-width: ${i.width}px`,
    `-webkit-text-stroke-color: ${U.shared.setValue(i.color).toHex()}`,
    `text-stroke-width: ${i.width}px`,
    `text-stroke-color: ${U.shared.setValue(i.color).toHex()}`,
    "paint-order: stroke"
  ].join(";");
}
const he = {
  fontSize: "font-size: {{VALUE}}px",
  fontFamily: "font-family: {{VALUE}}",
  fontWeight: "font-weight: {{VALUE}}",
  fontStyle: "font-style: {{VALUE}}",
  fontVariant: "font-variant: {{VALUE}}",
  letterSpacing: "letter-spacing: {{VALUE}}px",
  align: "text-align: {{VALUE}}",
  padding: "padding: {{VALUE}}px",
  whiteSpace: "white-space: {{VALUE}}",
  lineHeight: "line-height: {{VALUE}}px",
  wordWrapWidth: "max-width: {{VALUE}}px"
}, fe = {
  fill: (i) => `color: ${U.shared.setValue(i).toHex()}`,
  breakWords: (i) => `word-wrap: ${i ? "break-all" : "break-word"}`,
  stroke: Ee,
  dropShadow: Ve
};
function At(i, e) {
  for (const t in i) {
    const r = i[t], s = [];
    for (const a in r)
      fe[a] ? s.push(fe[a](r[a])) : he[a] && s.push(he[a].replace("{{VALUE}}", r[a]));
    e.push(`${t} { ${s.join(";")} }`);
  }
}
class ie extends K {
  constructor(e = {}) {
    super(e), this._cssOverrides = [], this.cssOverrides ?? (this.cssOverrides = e.cssOverrides), this.tagStyles = e.tagStyles ?? {};
  }
  /** List of style overrides that will be applied to the HTML text. */
  set cssOverrides(e) {
    this._cssOverrides = e instanceof Array ? e : [e], this.update();
  }
  get cssOverrides() {
    return this._cssOverrides;
  }
  _generateKey() {
    return this._styleKey = lt(this) + this._cssOverrides.join("-"), this._styleKey;
  }
  update() {
    this._cssStyle = null, super.update();
  }
  /**
   * Creates a new HTMLTextStyle object with the same values as this one.
   * @returns New cloned HTMLTextStyle object
   */
  clone() {
    return new ie({
      align: this.align,
      breakWords: this.breakWords,
      dropShadow: this.dropShadow ? { ...this.dropShadow } : null,
      fill: this._fill,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontVariant: this.fontVariant,
      fontWeight: this.fontWeight,
      letterSpacing: this.letterSpacing,
      lineHeight: this.lineHeight,
      padding: this.padding,
      stroke: this._stroke,
      whiteSpace: this.whiteSpace,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth,
      cssOverrides: this.cssOverrides
    });
  }
  get cssStyle() {
    return this._cssStyle || (this._cssStyle = Ft(this)), this._cssStyle;
  }
  /**
   * Add a style override, this can be any CSS property
   * it will override any built-in style. This is the
   * property and the value as a string (e.g., `color: red`).
   * This will override any other internal style.
   * @param {string} value - CSS style(s) to add.
   * @example
   * style.addOverride('background-color: red');
   */
  addOverride(...e) {
    const t = e.filter((r) => !this.cssOverrides.includes(r));
    t.length > 0 && (this.cssOverrides.push(...t), this.update());
  }
  /**
   * Remove any overrides that match the value.
   * @param {string} value - CSS style to remove.
   * @example
   * style.removeOverride('background-color: red');
   */
  removeOverride(...e) {
    const t = e.filter((r) => this.cssOverrides.includes(r));
    t.length > 0 && (this.cssOverrides = this.cssOverrides.filter((r) => !t.includes(r)), this.update());
  }
  set fill(e) {
    typeof e != "string" && typeof e != "number" && V("[HTMLTextStyle] only color fill is not supported by HTMLText"), super.fill = e;
  }
  set stroke(e) {
    e && typeof e != "string" && typeof e != "number" && V("[HTMLTextStyle] only color stroke is not supported by HTMLText"), super.stroke = e;
  }
}
const pe = "http://www.w3.org/2000/svg", ge = "http://www.w3.org/1999/xhtml";
class Ie {
  constructor() {
    this.svgRoot = document.createElementNS(pe, "svg"), this.foreignObject = document.createElementNS(pe, "foreignObject"), this.domElement = document.createElementNS(ge, "div"), this.styleElement = document.createElementNS(ge, "style"), this.image = new Image();
    const { foreignObject: e, svgRoot: t, styleElement: r, domElement: s } = this;
    e.setAttribute("width", "10000"), e.setAttribute("height", "10000"), e.style.overflow = "hidden", t.appendChild(e), e.appendChild(r), e.appendChild(s);
  }
}
let me;
function kt(i, e, t, r) {
  r || (r = me || (me = new Ie()));
  const { domElement: s, styleElement: a, svgRoot: n } = r;
  s.innerHTML = `<style>${e.cssStyle};</style><div style='padding:0'>${i}</div>`, s.setAttribute("style", "transform-origin: top left; display: inline-block"), t && (a.textContent = t), document.body.appendChild(n);
  const o = s.getBoundingClientRect();
  n.remove();
  const d = e.padding * 2;
  return {
    width: o.width - d,
    height: o.height - d
  };
}
class Le {
  constructor(e, t) {
    this.state = E.for2d(), this._graphicsBatchesHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this.renderer = e, this._adaptor = t, this._adaptor.init(), this.renderer.renderableGC.addManagedHash(this, "_graphicsBatchesHash");
  }
  validateRenderable(e) {
    const t = e.context, r = !!this._graphicsBatchesHash[e.uid], s = this.renderer.graphicsContext.updateGpuContext(t);
    return !!(s.isBatchable || r !== s.isBatchable);
  }
  addRenderable(e, t) {
    const r = this.renderer.graphicsContext.updateGpuContext(e.context);
    e.didViewUpdate && this._rebuild(e), r.isBatchable ? this._addToBatcher(e, t) : (this.renderer.renderPipes.batch.break(t), t.add(e));
  }
  updateRenderable(e) {
    const t = this._graphicsBatchesHash[e.uid];
    if (t)
      for (let r = 0; r < t.length; r++) {
        const s = t[r];
        s._batcher.updateElement(s);
      }
  }
  destroyRenderable(e) {
    this._graphicsBatchesHash[e.uid] && this._removeBatchForRenderable(e.uid), e.off("destroyed", this._destroyRenderableBound);
  }
  execute(e) {
    if (!e.isRenderable)
      return;
    const t = this.renderer, r = e.context;
    if (!t.graphicsContext.getGpuContext(r).batches.length)
      return;
    const a = r.customShader || this._adaptor.shader;
    this.state.blendMode = e.groupBlendMode;
    const n = a.resources.localUniforms.uniforms;
    n.uTransformMatrix = e.groupTransform, n.uRound = t._roundPixels | e._roundPixels, I(
      e.groupColorAlpha,
      n.uColor,
      0
    ), this._adaptor.execute(this, e);
  }
  _rebuild(e) {
    const t = !!this._graphicsBatchesHash[e.uid], r = this.renderer.graphicsContext.updateGpuContext(e.context);
    t && this._removeBatchForRenderable(e.uid), r.isBatchable && this._initBatchesForRenderable(e), e.batched = r.isBatchable;
  }
  _addToBatcher(e, t) {
    const r = this.renderer.renderPipes.batch, s = this._getBatchesForRenderable(e);
    for (let a = 0; a < s.length; a++) {
      const n = s[a];
      r.addToBatch(n, t);
    }
  }
  _getBatchesForRenderable(e) {
    return this._graphicsBatchesHash[e.uid] || this._initBatchesForRenderable(e);
  }
  _initBatchesForRenderable(e) {
    const t = e.context, r = this.renderer.graphicsContext.getGpuContext(t), s = this.renderer._roundPixels | e._roundPixels, a = r.batches.map((n) => {
      const o = b.get(ct);
      return n.copyTo(o), o.renderable = e, o.roundPixels = s, o;
    });
    return this._graphicsBatchesHash[e.uid] === void 0 && e.on("destroyed", this._destroyRenderableBound), this._graphicsBatchesHash[e.uid] = a, a;
  }
  _removeBatchForRenderable(e) {
    this._graphicsBatchesHash[e].forEach((t) => {
      b.return(t);
    }), this._graphicsBatchesHash[e] = null;
  }
  destroy() {
    this.renderer = null, this._adaptor.destroy(), this._adaptor = null, this.state = null;
    for (const e in this._graphicsBatchesHash)
      this._removeBatchForRenderable(e);
    this._graphicsBatchesHash = null;
  }
}
Le.extension = {
  type: [
    g.WebGLPipes,
    g.WebGPUPipes,
    g.CanvasPipes
  ],
  name: "graphics"
};
const $e = class Ye extends se {
  constructor(...e) {
    super({});
    let t = e[0] ?? {};
    typeof t == "number" && (ee(Ce, "PlaneGeometry constructor changed please use { width, height, verticesX, verticesY } instead"), t = {
      width: t,
      height: e[1],
      verticesX: e[2],
      verticesY: e[3]
    }), this.build(t);
  }
  /**
   * Refreshes plane coordinates
   * @param options - Options to be applied to plane geometry
   */
  build(e) {
    e = { ...Ye.defaultOptions, ...e }, this.verticesX = this.verticesX ?? e.verticesX, this.verticesY = this.verticesY ?? e.verticesY, this.width = this.width ?? e.width, this.height = this.height ?? e.height;
    const t = this.verticesX * this.verticesY, r = [], s = [], a = [], n = this.verticesX - 1, o = this.verticesY - 1, d = this.width / n, l = this.height / o;
    for (let u = 0; u < t; u++) {
      const f = u % this.verticesX, p = u / this.verticesX | 0;
      r.push(f * d, p * l), s.push(f / n, p / o);
    }
    const c = n * o;
    for (let u = 0; u < c; u++) {
      const f = u % n, p = u / n | 0, h = p * this.verticesX + f, m = p * this.verticesX + f + 1, _ = (p + 1) * this.verticesX + f, x = (p + 1) * this.verticesX + f + 1;
      a.push(
        h,
        m,
        _,
        m,
        x,
        _
      );
    }
    this.buffers[0].data = new Float32Array(r), this.buffers[1].data = new Float32Array(s), this.indexBuffer.data = new Uint32Array(a), this.buffers[0].update(), this.buffers[1].update(), this.indexBuffer.update();
  }
};
$e.defaultOptions = {
  width: 100,
  height: 100,
  verticesX: 10,
  verticesY: 10
};
let Ht = $e;
class ae {
  constructor() {
    this.batcherName = "default", this.packAsQuad = !1, this.indexOffset = 0, this.attributeOffset = 0, this.roundPixels = 0, this._batcher = null, this._batch = null, this._uvUpdateId = -1, this._textureMatrixUpdateId = -1;
  }
  get blendMode() {
    return this.renderable.groupBlendMode;
  }
  get topology() {
    return this._topology || this.geometry.topology;
  }
  set topology(e) {
    this._topology = e;
  }
  reset() {
    this.renderable = null, this.texture = null, this._batcher = null, this._batch = null, this.geometry = null, this._uvUpdateId = -1, this._textureMatrixUpdateId = -1;
  }
  get uvs() {
    const t = this.geometry.getBuffer("aUV"), r = t.data;
    let s = r;
    const a = this.texture.textureMatrix;
    return a.isSimple || (s = this._transformedUvs, (this._textureMatrixUpdateId !== a._updateID || this._uvUpdateId !== t._updateID) && ((!s || s.length < r.length) && (s = this._transformedUvs = new Float32Array(r.length)), this._textureMatrixUpdateId = a._updateID, this._uvUpdateId = t._updateID, a.multiplyUvs(r, s))), s;
  }
  get positions() {
    return this.geometry.positions;
  }
  get indices() {
    return this.geometry.indices;
  }
  get color() {
    return this.renderable.groupColorAlpha;
  }
  get groupTransform() {
    return this.renderable.groupTransform;
  }
  get attributeSize() {
    return this.geometry.positions.length / 2;
  }
  get indexSize() {
    return this.geometry.indices.length;
  }
}
class Xe {
  constructor(e, t) {
    this.localUniforms = new A({
      uTransformMatrix: { value: new C(), type: "mat3x3<f32>" },
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uRound: { value: 0, type: "f32" }
    }), this.localUniformsBindGroup = new Se({
      0: this.localUniforms
    }), this._meshDataHash = /* @__PURE__ */ Object.create(null), this._gpuBatchableMeshHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this.renderer = e, this._adaptor = t, this._adaptor.init(), e.renderableGC.addManagedHash(this, "_gpuBatchableMeshHash"), e.renderableGC.addManagedHash(this, "_meshDataHash");
  }
  validateRenderable(e) {
    const t = this._getMeshData(e), r = t.batched, s = e.batched;
    if (t.batched = s, r !== s)
      return !0;
    if (s) {
      const a = e._geometry;
      if (a.indices.length !== t.indexSize || a.positions.length !== t.vertexSize)
        return t.indexSize = a.indices.length, t.vertexSize = a.positions.length, !0;
      const n = this._getBatchableMesh(e);
      return !n._batcher.checkAndUpdateTexture(
        n,
        e.texture
      );
    }
    return !1;
  }
  addRenderable(e, t) {
    const r = this.renderer.renderPipes.batch, { batched: s } = this._getMeshData(e);
    if (s) {
      const a = this._getBatchableMesh(e);
      a.texture = e._texture, a.geometry = e._geometry, r.addToBatch(a, t);
    } else
      r.break(t), t.add(e);
  }
  updateRenderable(e) {
    if (e.batched) {
      const t = this._gpuBatchableMeshHash[e.uid];
      t.texture = e._texture, t.geometry = e._geometry, t._batcher.updateElement(t);
    }
  }
  destroyRenderable(e) {
    this._meshDataHash[e.uid] = null;
    const t = this._gpuBatchableMeshHash[e.uid];
    t && (b.return(t), this._gpuBatchableMeshHash[e.uid] = null), e.off("destroyed", this._destroyRenderableBound);
  }
  execute(e) {
    if (!e.isRenderable)
      return;
    e.state.blendMode = te(e.groupBlendMode, e.texture._source);
    const t = this.localUniforms;
    t.uniforms.uTransformMatrix = e.groupTransform, t.uniforms.uRound = this.renderer._roundPixels | e._roundPixels, t.update(), I(
      e.groupColorAlpha,
      t.uniforms.uColor,
      0
    ), this._adaptor.execute(this, e);
  }
  _getMeshData(e) {
    return this._meshDataHash[e.uid] || this._initMeshData(e);
  }
  _initMeshData(e) {
    return this._meshDataHash[e.uid] = {
      batched: e.batched,
      indexSize: e._geometry.indices?.length,
      vertexSize: e._geometry.positions?.length
    }, e.on("destroyed", this._destroyRenderableBound), this._meshDataHash[e.uid];
  }
  _getBatchableMesh(e) {
    return this._gpuBatchableMeshHash[e.uid] || this._initBatchableMesh(e);
  }
  _initBatchableMesh(e) {
    const t = b.get(ae);
    return t.renderable = e, t.texture = e._texture, t.transform = e.groupTransform, t.roundPixels = this.renderer._roundPixels | e._roundPixels, this._gpuBatchableMeshHash[e.uid] = t, t;
  }
  destroy() {
    for (const e in this._gpuBatchableMeshHash)
      this._gpuBatchableMeshHash[e] && b.return(this._gpuBatchableMeshHash[e]);
    this._gpuBatchableMeshHash = null, this._meshDataHash = null, this.localUniforms = null, this.localUniformsBindGroup = null, this._adaptor.destroy(), this._adaptor = null, this.renderer = null;
  }
}
Xe.extension = {
  type: [
    g.WebGLPipes,
    g.WebGPUPipes,
    g.CanvasPipes
  ],
  name: "mesh"
};
class Dt {
  execute(e, t) {
    const r = e.state, s = e.renderer, a = t.shader || e.defaultShader;
    a.resources.uTexture = t.texture._source, a.resources.uniforms = e.localUniforms;
    const n = s.gl, o = e.getBuffers(t);
    s.shader.bind(a), s.state.set(r), s.geometry.bind(o.geometry, a.glProgram);
    const l = o.geometry.indexBuffer.data.BYTES_PER_ELEMENT === 2 ? n.UNSIGNED_SHORT : n.UNSIGNED_INT;
    n.drawElements(n.TRIANGLES, t.particleChildren.length * 6, l, 0);
  }
}
class zt {
  execute(e, t) {
    const r = e.renderer, s = t.shader || e.defaultShader;
    s.groups[0] = r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms, !0), s.groups[1] = r.texture.getTextureBindGroup(t.texture);
    const a = e.state, n = e.getBuffers(t);
    r.encoder.draw({
      geometry: n.geometry,
      shader: t.shader || e.defaultShader,
      state: a,
      size: t.particleChildren.length * 6
    });
  }
}
function xe(i, e = null) {
  const t = i * 6;
  if (t > 65535 ? e || (e = new Uint32Array(t)) : e || (e = new Uint16Array(t)), e.length !== t)
    throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);
  for (let r = 0, s = 0; r < t; r += 6, s += 4)
    e[r + 0] = s + 0, e[r + 1] = s + 1, e[r + 2] = s + 2, e[r + 3] = s + 0, e[r + 4] = s + 2, e[r + 5] = s + 3;
  return e;
}
function Wt(i) {
  return {
    dynamicUpdate: _e(i, !0),
    staticUpdate: _e(i, !1)
  };
}
function _e(i, e) {
  const t = [];
  t.push(`
      
        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);
  let r = 0;
  for (const a in i) {
    const n = i[a];
    if (e !== n.dynamic)
      continue;
    t.push(`offset = index + ${r}`), t.push(n.code);
    const o = N(n.format);
    r += o.stride / 4;
  }
  t.push(`
            index += stride * 4;
        }
    `), t.unshift(`
        var stride = ${r};
    `);
  const s = t.join(`
`);
  return new Function("ps", "f32v", "u32v", s);
}
class Ot {
  constructor(e) {
    this._size = 0, this._generateParticleUpdateCache = {};
    const t = this._size = e.size ?? 1e3, r = e.properties;
    let s = 0, a = 0;
    for (const c in r) {
      const u = r[c], f = N(u.format);
      u.dynamic ? a += f.stride : s += f.stride;
    }
    this._dynamicStride = a / 4, this._staticStride = s / 4, this.staticAttributeBuffer = new z(t * 4 * s), this.dynamicAttributeBuffer = new z(t * 4 * a), this.indexBuffer = xe(t);
    const n = new J();
    let o = 0, d = 0;
    this._staticBuffer = new k({
      data: new Float32Array(1),
      label: "static-particle-buffer",
      shrinkToFit: !1,
      usage: B.VERTEX | B.COPY_DST
    }), this._dynamicBuffer = new k({
      data: new Float32Array(1),
      label: "dynamic-particle-buffer",
      shrinkToFit: !1,
      usage: B.VERTEX | B.COPY_DST
    });
    for (const c in r) {
      const u = r[c], f = N(u.format);
      u.dynamic ? (n.addAttribute(u.attributeName, {
        buffer: this._dynamicBuffer,
        stride: this._dynamicStride * 4,
        offset: o * 4,
        format: u.format
      }), o += f.size) : (n.addAttribute(u.attributeName, {
        buffer: this._staticBuffer,
        stride: this._staticStride * 4,
        offset: d * 4,
        format: u.format
      }), d += f.size);
    }
    n.addIndex(this.indexBuffer);
    const l = this.getParticleUpdate(r);
    this._dynamicUpload = l.dynamicUpdate, this._staticUpload = l.staticUpdate, this.geometry = n;
  }
  getParticleUpdate(e) {
    const t = Vt(e);
    return this._generateParticleUpdateCache[t] ? this._generateParticleUpdateCache[t] : (this._generateParticleUpdateCache[t] = this.generateParticleUpdate(e), this._generateParticleUpdateCache[t]);
  }
  generateParticleUpdate(e) {
    return Wt(e);
  }
  update(e, t) {
    e.length > this._size && (t = !0, this._size = Math.max(e.length, this._size * 1.5 | 0), this.staticAttributeBuffer = new z(this._size * this._staticStride * 4 * 4), this.dynamicAttributeBuffer = new z(this._size * this._dynamicStride * 4 * 4), this.indexBuffer = xe(this._size), this.geometry.indexBuffer.setDataWithSize(
      this.indexBuffer,
      this.indexBuffer.byteLength,
      !0
    ));
    const r = this.dynamicAttributeBuffer;
    if (this._dynamicUpload(e, r.float32View, r.uint32View), this._dynamicBuffer.setDataWithSize(
      this.dynamicAttributeBuffer.float32View,
      e.length * this._dynamicStride * 4,
      !0
    ), t) {
      const s = this.staticAttributeBuffer;
      this._staticUpload(e, s.float32View, s.uint32View), this._staticBuffer.setDataWithSize(
        s.float32View,
        e.length * this._staticStride * 4,
        !0
      );
    }
  }
  destroy() {
    this._staticBuffer.destroy(), this._dynamicBuffer.destroy(), this.geometry.destroy();
  }
}
function Vt(i) {
  const e = [];
  for (const t in i) {
    const r = i[t];
    e.push(t, r.code, r.dynamic ? "d" : "s");
  }
  return e.join("_");
}
var Et = `varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`, It = `attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`, be = `
struct ParticleUniforms {
  uProjectionMatrix:mat3x3<f32>,
  uColor:vec4<f32>,
  uResolution:vec2<f32>,
  uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

  return VSOutput(
   position,
   aUV,
   vColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;
class Lt extends re {
  constructor() {
    const e = ht.from({
      vertex: It,
      fragment: Et
    }), t = ft.from({
      fragment: {
        source: be,
        entryPoint: "mainFragment"
      },
      vertex: {
        source: be,
        entryPoint: "mainVertex"
      }
    });
    super({
      glProgram: e,
      gpuProgram: t,
      resources: {
        // this will be replaced with the texture from the particle container
        uTexture: M.WHITE.source,
        // this will be replaced with the texture style from the particle container
        uSampler: new pt({}),
        // this will be replaced with the local uniforms from the particle container
        uniforms: {
          uTranslationMatrix: { value: new C(), type: "mat3x3<f32>" },
          uColor: { value: new U(16777215), type: "vec4<f32>" },
          uRound: { value: 1, type: "f32" },
          uResolution: { value: [0, 0], type: "vec2<f32>" }
        }
      }
    });
  }
}
class je {
  /**
   * @param renderer - The renderer this sprite batch works for.
   * @param adaptor
   */
  constructor(e, t) {
    this.state = E.for2d(), this._gpuBufferHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this.localUniforms = new A({
      uTranslationMatrix: { value: new C(), type: "mat3x3<f32>" },
      uColor: { value: new Float32Array(4), type: "vec4<f32>" },
      uRound: { value: 1, type: "f32" },
      uResolution: { value: [0, 0], type: "vec2<f32>" }
    }), this.renderer = e, this.adaptor = t, this.defaultShader = new Lt(), this.state = E.for2d();
  }
  validateRenderable(e) {
    return !1;
  }
  addRenderable(e, t) {
    this.renderer.renderPipes.batch.break(t), t.add(e);
  }
  getBuffers(e) {
    return this._gpuBufferHash[e.uid] || this._initBuffer(e);
  }
  _initBuffer(e) {
    return this._gpuBufferHash[e.uid] = new Ot({
      size: e.particleChildren.length,
      properties: e._properties
    }), e.on("destroyed", this._destroyRenderableBound), this._gpuBufferHash[e.uid];
  }
  updateRenderable(e) {
  }
  destroyRenderable(e) {
    this._gpuBufferHash[e.uid].destroy(), this._gpuBufferHash[e.uid] = null, e.off("destroyed", this._destroyRenderableBound);
  }
  execute(e) {
    const t = e.particleChildren;
    if (t.length === 0)
      return;
    const r = this.renderer, s = this.getBuffers(e);
    e.texture || (e.texture = t[0].texture);
    const a = this.state;
    s.update(t, e._childrenDirty), e._childrenDirty = !1, a.blendMode = te(e.blendMode, e.texture._source);
    const n = this.localUniforms.uniforms, o = n.uTranslationMatrix;
    e.worldTransform.copyTo(o), o.prepend(r.globalUniforms.globalUniformData.projectionMatrix), n.uResolution = r.globalUniforms.globalUniformData.resolution, n.uRound = r._roundPixels | e._roundPixels, I(
      e.groupColorAlpha,
      n.uColor,
      0
    ), this.adaptor.execute(this, e);
  }
  /** Destroys the ParticleRenderer. */
  destroy() {
    this.defaultShader && (this.defaultShader.destroy(), this.defaultShader = null);
  }
}
class Ke extends je {
  constructor(e) {
    super(e, new Dt());
  }
}
Ke.extension = {
  type: [
    g.WebGLPipes
  ],
  name: "particle"
};
class Ne extends je {
  constructor(e) {
    super(e, new zt());
  }
}
Ne.extension = {
  type: [
    g.WebGPUPipes
  ],
  name: "particle"
};
const qe = class Qe extends Ht {
  constructor(e = {}) {
    e = { ...Qe.defaultOptions, ...e }, super({
      width: e.width,
      height: e.height,
      verticesX: 4,
      verticesY: 4
    }), this.update(e);
  }
  /**
   * Updates the NineSliceGeometry with the options.
   * @param options - The options of the NineSliceGeometry.
   */
  update(e) {
    this.width = e.width ?? this.width, this.height = e.height ?? this.height, this._originalWidth = e.originalWidth ?? this._originalWidth, this._originalHeight = e.originalHeight ?? this._originalHeight, this._leftWidth = e.leftWidth ?? this._leftWidth, this._rightWidth = e.rightWidth ?? this._rightWidth, this._topHeight = e.topHeight ?? this._topHeight, this._bottomHeight = e.bottomHeight ?? this._bottomHeight, this.updateUvs(), this.updatePositions();
  }
  /** Updates the positions of the vertices. */
  updatePositions() {
    const e = this.positions, t = this._leftWidth + this._rightWidth, r = this.width > t ? 1 : this.width / t, s = this._topHeight + this._bottomHeight, a = this.height > s ? 1 : this.height / s, n = Math.min(r, a);
    e[9] = e[11] = e[13] = e[15] = this._topHeight * n, e[17] = e[19] = e[21] = e[23] = this.height - this._bottomHeight * n, e[25] = e[27] = e[29] = e[31] = this.height, e[2] = e[10] = e[18] = e[26] = this._leftWidth * n, e[4] = e[12] = e[20] = e[28] = this.width - this._rightWidth * n, e[6] = e[14] = e[22] = e[30] = this.width, this.getBuffer("aPosition").update();
  }
  /** Updates the UVs of the vertices. */
  updateUvs() {
    const e = this.uvs;
    e[0] = e[8] = e[16] = e[24] = 0, e[1] = e[3] = e[5] = e[7] = 0, e[6] = e[14] = e[22] = e[30] = 1, e[25] = e[27] = e[29] = e[31] = 1;
    const t = 1 / this._originalWidth, r = 1 / this._originalHeight;
    e[2] = e[10] = e[18] = e[26] = t * this._leftWidth, e[9] = e[11] = e[13] = e[15] = r * this._topHeight, e[4] = e[12] = e[20] = e[28] = 1 - t * this._rightWidth, e[17] = e[19] = e[21] = e[23] = 1 - r * this._bottomHeight, this.getBuffer("aUV").update();
  }
};
qe.defaultOptions = {
  /** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
  width: 100,
  /** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
  height: 100,
  /** The width of the left column. */
  leftWidth: 10,
  /** The height of the top row. */
  topHeight: 10,
  /** The width of the right column. */
  rightWidth: 10,
  /** The height of the bottom row. */
  bottomHeight: 10,
  /** The original width of the texture */
  originalWidth: 100,
  /** The original height of the texture */
  originalHeight: 100
};
let $t = qe;
class Je {
  constructor(e) {
    this._gpuSpriteHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_gpuSpriteHash");
  }
  addRenderable(e, t) {
    const r = this._getGpuSprite(e);
    e.didViewUpdate && this._updateBatchableSprite(e, r), this._renderer.renderPipes.batch.addToBatch(r, t);
  }
  updateRenderable(e) {
    const t = this._gpuSpriteHash[e.uid];
    e.didViewUpdate && this._updateBatchableSprite(e, t), t._batcher.updateElement(t);
  }
  validateRenderable(e) {
    const t = this._getGpuSprite(e);
    return !t._batcher.checkAndUpdateTexture(
      t,
      e._texture
    );
  }
  destroyRenderable(e) {
    const t = this._gpuSpriteHash[e.uid];
    b.return(t.geometry), b.return(t), this._gpuSpriteHash[e.uid] = null, e.off("destroyed", this._destroyRenderableBound);
  }
  _updateBatchableSprite(e, t) {
    t.geometry.update(e), t.texture = e._texture;
  }
  _getGpuSprite(e) {
    return this._gpuSpriteHash[e.uid] || this._initGPUSprite(e);
  }
  _initGPUSprite(e) {
    const t = b.get(ae);
    return t.geometry = b.get($t), t.renderable = e, t.transform = e.groupTransform, t.texture = e._texture, t.roundPixels = this._renderer._roundPixels | e._roundPixels, this._gpuSpriteHash[e.uid] = t, e.didViewUpdate || this._updateBatchableSprite(e, t), e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuSpriteHash)
      this._gpuSpriteHash[e].geometry.destroy();
    this._gpuSpriteHash = null, this._renderer = null;
  }
}
Je.extension = {
  type: [
    g.WebGLPipes,
    g.WebGPUPipes,
    g.CanvasPipes
  ],
  name: "nineSliceSprite"
};
const Yt = {
  name: "tiling-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `
    ),
    main: (
      /* wgsl */
      `
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `
    )
  },
  fragment: {
    header: (
      /* wgsl */
      `
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `
    ),
    main: (
      /* wgsl */
      `

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            } 

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `
    )
  }
}, Xt = {
  name: "tiling-bit",
  vertex: {
    header: (
      /* glsl */
      `
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;
        
        `
    ),
    main: (
      /* glsl */
      `
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `
    )
  },
  fragment: {
    header: (
      /* glsl */
      `
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `
    ),
    main: (
      /* glsl */
      `

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);
        
        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0
    
        `
    )
  }
};
let $, Y;
class jt extends re {
  constructor() {
    $ ?? ($ = Pe({
      name: "tiling-sprite-shader",
      bits: [
        Bt,
        Yt,
        Me
      ]
    })), Y ?? (Y = Re({
      name: "tiling-sprite-shader",
      bits: [
        Ct,
        Xt,
        Ue
      ]
    }));
    const e = new A({
      uMapCoord: { value: new C(), type: "mat3x3<f32>" },
      uClampFrame: { value: new Float32Array([0, 0, 1, 1]), type: "vec4<f32>" },
      uClampOffset: { value: new Float32Array([0, 0]), type: "vec2<f32>" },
      uTextureTransform: { value: new C(), type: "mat3x3<f32>" },
      uSizeAnchor: { value: new Float32Array([100, 100, 0.5, 0.5]), type: "vec4<f32>" }
    });
    super({
      glProgram: Y,
      gpuProgram: $,
      resources: {
        localUniforms: new A({
          uTransformMatrix: { value: new C(), type: "mat3x3<f32>" },
          uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
          uRound: { value: 0, type: "f32" }
        }),
        tilingUniforms: e,
        uTexture: M.EMPTY.source,
        uSampler: M.EMPTY.source.style
      }
    });
  }
  updateUniforms(e, t, r, s, a, n) {
    const o = this.resources.tilingUniforms, d = n.width, l = n.height, c = n.textureMatrix, u = o.uniforms.uTextureTransform;
    u.set(
      r.a * d / e,
      r.b * d / t,
      r.c * l / e,
      r.d * l / t,
      r.tx / e,
      r.ty / t
    ), u.invert(), o.uniforms.uMapCoord = c.mapCoord, o.uniforms.uClampFrame = c.uClampFrame, o.uniforms.uClampOffset = c.uClampOffset, o.uniforms.uTextureTransform = u, o.uniforms.uSizeAnchor[0] = e, o.uniforms.uSizeAnchor[1] = t, o.uniforms.uSizeAnchor[2] = s, o.uniforms.uSizeAnchor[3] = a, n && (this.resources.uTexture = n.source, this.resources.uSampler = n.source.style);
  }
}
class Kt extends se {
  constructor() {
    super({
      positions: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      indices: new Uint32Array([0, 1, 2, 0, 2, 3])
    });
  }
}
function Nt(i, e) {
  const t = i.anchor.x, r = i.anchor.y;
  e[0] = -t * i.width, e[1] = -r * i.height, e[2] = (1 - t) * i.width, e[3] = -r * i.height, e[4] = (1 - t) * i.width, e[5] = (1 - r) * i.height, e[6] = -t * i.width, e[7] = (1 - r) * i.height;
}
function qt(i, e, t, r) {
  let s = 0;
  const a = i.length / e, n = r.a, o = r.b, d = r.c, l = r.d, c = r.tx, u = r.ty;
  for (t *= e; s < a; ) {
    const f = i[t], p = i[t + 1];
    i[t] = n * f + d * p + c, i[t + 1] = o * f + l * p + u, t += e, s++;
  }
}
function Qt(i, e) {
  const t = i.texture, r = t.frame.width, s = t.frame.height;
  let a = 0, n = 0;
  i.applyAnchorToTexture && (a = i.anchor.x, n = i.anchor.y), e[0] = e[6] = -a, e[2] = e[4] = 1 - a, e[1] = e[3] = -n, e[5] = e[7] = 1 - n;
  const o = C.shared;
  o.copyFrom(i._tileTransform.matrix), o.tx /= i.width, o.ty /= i.height, o.invert(), o.scale(i.width / r, i.height / s), qt(e, 2, 0, o);
}
const W = new Kt();
class Ze {
  constructor(e) {
    this._state = E.default2d, this._tilingSpriteDataHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_tilingSpriteDataHash");
  }
  validateRenderable(e) {
    const t = this._getTilingSpriteData(e), r = t.canBatch;
    this._updateCanBatch(e);
    const s = t.canBatch;
    if (s && s === r) {
      const { batchableMesh: a } = t;
      return !a._batcher.checkAndUpdateTexture(
        a,
        e.texture
      );
    }
    return r !== s;
  }
  addRenderable(e, t) {
    const r = this._renderer.renderPipes.batch;
    this._updateCanBatch(e);
    const s = this._getTilingSpriteData(e), { geometry: a, canBatch: n } = s;
    if (n) {
      s.batchableMesh || (s.batchableMesh = new ae());
      const o = s.batchableMesh;
      e.didViewUpdate && (this._updateBatchableMesh(e), o.geometry = a, o.renderable = e, o.transform = e.groupTransform, o.texture = e._texture), o.roundPixels = this._renderer._roundPixels | e._roundPixels, r.addToBatch(o, t);
    } else
      r.break(t), s.shader || (s.shader = new jt()), this.updateRenderable(e), t.add(e);
  }
  execute(e) {
    const { shader: t } = this._tilingSpriteDataHash[e.uid];
    t.groups[0] = this._renderer.globalUniforms.bindGroup;
    const r = t.resources.localUniforms.uniforms;
    r.uTransformMatrix = e.groupTransform, r.uRound = this._renderer._roundPixels | e._roundPixels, I(
      e.groupColorAlpha,
      r.uColor,
      0
    ), this._state.blendMode = te(e.groupBlendMode, e.texture._source), this._renderer.encoder.draw({
      geometry: W,
      shader: t,
      state: this._state
    });
  }
  updateRenderable(e) {
    const t = this._getTilingSpriteData(e), { canBatch: r } = t;
    if (r) {
      const { batchableMesh: s } = t;
      e.didViewUpdate && this._updateBatchableMesh(e), s._batcher.updateElement(s);
    } else if (e.didViewUpdate) {
      const { shader: s } = t;
      s.updateUniforms(
        e.width,
        e.height,
        e._tileTransform.matrix,
        e.anchor.x,
        e.anchor.y,
        e.texture
      );
    }
  }
  destroyRenderable(e) {
    const t = this._getTilingSpriteData(e);
    t.batchableMesh = null, t.shader?.destroy(), this._tilingSpriteDataHash[e.uid] = null, e.off("destroyed", this._destroyRenderableBound);
  }
  _getTilingSpriteData(e) {
    return this._tilingSpriteDataHash[e.uid] || this._initTilingSpriteData(e);
  }
  _initTilingSpriteData(e) {
    const t = new se({
      indices: W.indices,
      positions: W.positions.slice(),
      uvs: W.uvs.slice()
    });
    return this._tilingSpriteDataHash[e.uid] = {
      canBatch: !0,
      renderable: e,
      geometry: t
    }, e.on("destroyed", this._destroyRenderableBound), this._tilingSpriteDataHash[e.uid];
  }
  _updateBatchableMesh(e) {
    const t = this._getTilingSpriteData(e), { geometry: r } = t, s = e.texture.source.style;
    s.addressMode !== "repeat" && (s.addressMode = "repeat", s.update()), Qt(e, r.uvs), Nt(e, r.positions);
  }
  destroy() {
    for (const e in this._tilingSpriteDataHash)
      this.destroyRenderable(this._tilingSpriteDataHash[e].renderable);
    this._tilingSpriteDataHash = null, this._renderer = null;
  }
  _updateCanBatch(e) {
    const t = this._getTilingSpriteData(e), r = e.texture;
    let s = !0;
    return this._renderer.type === Z.WEBGL && (s = this._renderer.context.supports.nonPowOf2wrapping), t.canBatch = r.textureMatrix.isSimple && (s || r.source.isPowerOfTwo), t.canBatch;
  }
}
Ze.extension = {
  type: [
    g.WebGLPipes,
    g.WebGPUPipes,
    g.CanvasPipes
  ],
  name: "tilingSprite"
};
const Jt = {
  name: "local-uniform-msdf-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `
    ),
    main: (
      /* wgsl */
      `
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `
    ),
    end: (
      /* wgsl */
      `
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `
    )
  },
  fragment: {
    header: (
      /* wgsl */
      `
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `
    ),
    main: (
      /* wgsl */
      ` 
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `
    )
  }
}, Zt = {
  name: "local-uniform-msdf-bit",
  vertex: {
    header: (
      /* glsl */
      `
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `
    ),
    main: (
      /* glsl */
      `
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `
    ),
    end: (
      /* glsl */
      `
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `
    )
  },
  fragment: {
    header: (
      /* glsl */
      `
            uniform float uDistance;
         `
    ),
    main: (
      /* glsl */
      ` 
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `
    )
  }
}, er = {
  name: "msdf-bit",
  fragment: {
    header: (
      /* wgsl */
      `
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {
                
                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));
            
                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;
             
            }
        `
    )
  }
}, tr = {
  name: "msdf-bit",
  fragment: {
    header: (
      /* glsl */
      `
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {
                
                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));
               
                // SDF
                median = min(median, msdfColor.a);
            
                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
           
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);  
              
                return coverage;
            }
        `
    )
  }
};
let X, j;
class rr extends re {
  constructor() {
    const e = new A({
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uTransformMatrix: { value: new C(), type: "mat3x3<f32>" },
      uDistance: { value: 4, type: "f32" },
      uRound: { value: 0, type: "f32" }
    }), t = gt();
    X ?? (X = Pe({
      name: "sdf-shader",
      bits: [
        mt,
        xt(t),
        Jt,
        er,
        Me
      ]
    })), j ?? (j = Re({
      name: "sdf-shader",
      bits: [
        _t,
        bt(t),
        Zt,
        tr,
        Ue
      ]
    })), super({
      glProgram: j,
      gpuProgram: X,
      resources: {
        localUniforms: e,
        batchSamplers: yt(t)
      }
    });
  }
}
class et {
  constructor(e) {
    this._gpuBitmapText = {}, this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_gpuBitmapText");
  }
  validateRenderable(e) {
    const t = this._getGpuBitmapText(e);
    return e._didTextUpdate && (e._didTextUpdate = !1, this._updateContext(e, t)), this._renderer.renderPipes.graphics.validateRenderable(t);
  }
  addRenderable(e, t) {
    const r = this._getGpuBitmapText(e);
    ye(e, r), e._didTextUpdate && (e._didTextUpdate = !1, this._updateContext(e, r)), this._renderer.renderPipes.graphics.addRenderable(r, t), r.context.customShader && this._updateDistanceField(e);
  }
  destroyRenderable(e) {
    e.off("destroyed", this._destroyRenderableBound), this._destroyRenderableByUid(e.uid);
  }
  _destroyRenderableByUid(e) {
    const t = this._gpuBitmapText[e].context;
    t.customShader && (b.return(t.customShader), t.customShader = null), b.return(this._gpuBitmapText[e]), this._gpuBitmapText[e] = null;
  }
  updateRenderable(e) {
    const t = this._getGpuBitmapText(e);
    ye(e, t), this._renderer.renderPipes.graphics.updateRenderable(t), t.context.customShader && this._updateDistanceField(e);
  }
  _updateContext(e, t) {
    const { context: r } = t, s = vt.getFont(e.text, e._style);
    r.clear(), s.distanceField.type !== "none" && (r.customShader || (r.customShader = b.get(rr)));
    const a = Array.from(e.text), n = e._style;
    let o = s.baseLineOffset;
    const d = Tt(a, n, s, !0);
    let l = 0;
    const c = n.padding, u = d.scale;
    let f = d.width, p = d.height + d.offsetY;
    n._stroke && (f += n._stroke.width / u, p += n._stroke.width / u), r.translate(-e._anchor._x * f - c, -e._anchor._y * p - c).scale(u, u);
    const h = s.applyFillAsTint ? n._fill.color : 16777215;
    for (let m = 0; m < d.lines.length; m++) {
      const _ = d.lines[m];
      for (let x = 0; x < _.charPositions.length; x++) {
        const T = a[l++], w = s.chars[T];
        w?.texture && r.texture(
          w.texture,
          h || "black",
          Math.round(_.charPositions[x] + w.xOffset),
          Math.round(o + w.yOffset)
        );
      }
      o += s.lineHeight;
    }
  }
  _getGpuBitmapText(e) {
    return this._gpuBitmapText[e.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = b.get(Pt);
    return this._gpuBitmapText[e.uid] = t, this._updateContext(e, t), e.on("destroyed", this._destroyRenderableBound), this._gpuBitmapText[e.uid];
  }
  _updateDistanceField(e) {
    const t = this._getGpuBitmapText(e).context, r = e._style.fontFamily, s = q.get(`${r}-bitmap`), { a, b: n, c: o, d } = e.groupTransform, l = Math.sqrt(a * a + n * n), c = Math.sqrt(o * o + d * d), u = (Math.abs(l) + Math.abs(c)) / 2, f = s.baseRenderedFontSize / e._style.fontSize, p = u * s.distanceField.range * (1 / f);
    t.customShader.resources.localUniforms.uniforms.uDistance = p;
  }
  destroy() {
    for (const e in this._gpuBitmapText)
      this._destroyRenderableByUid(e);
    this._gpuBitmapText = null, this._renderer = null;
  }
}
et.extension = {
  type: [
    g.WebGLPipes,
    g.WebGPUPipes,
    g.CanvasPipes
  ],
  name: "bitmapText"
};
function ye(i, e) {
  e.groupTransform = i.groupTransform, e.groupColorAlpha = i.groupColorAlpha, e.groupColor = i.groupColor, e.groupBlendMode = i.groupBlendMode, e.globalDisplayStatus = i.globalDisplayStatus, e.groupTransform = i.groupTransform, e.localDisplayStatus = i.localDisplayStatus, e.groupAlpha = i.groupAlpha, e._roundPixels = i._roundPixels;
}
class tt {
  constructor(e) {
    this._gpuText = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.runners.resolutionChange.add(this), this._renderer.renderableGC.addManagedHash(this, "_gpuText");
  }
  resolutionChange() {
    for (const e in this._gpuText) {
      const t = this._gpuText[e];
      if (!t)
        continue;
      const r = t.batchableSprite.renderable;
      r._autoResolution && (r._resolution = this._renderer.resolution, r.onViewUpdate());
    }
  }
  validateRenderable(e) {
    const t = this._getGpuText(e), r = e._getKey();
    return t.textureNeedsUploading ? (t.textureNeedsUploading = !1, !0) : t.currentKey !== r;
  }
  addRenderable(e, t) {
    const s = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), this._renderer.renderPipes.batch.addToBatch(s, t);
  }
  updateRenderable(e) {
    const r = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), r._batcher.updateElement(r);
  }
  destroyRenderable(e) {
    e.off("destroyed", this._destroyRenderableBound), this._destroyRenderableById(e.uid);
  }
  _destroyRenderableById(e) {
    const t = this._gpuText[e];
    this._renderer.htmlText.decreaseReferenceCount(t.currentKey), b.return(t.batchableSprite), this._gpuText[e] = null;
  }
  _updateText(e) {
    const t = e._getKey(), r = this._getGpuText(e), s = r.batchableSprite;
    r.currentKey !== t && this._updateGpuText(e).catch((n) => {
      console.error(n);
    }), e._didTextUpdate = !1;
    const a = e._style.padding;
    Q(s.bounds, e._anchor, s.texture, a);
  }
  async _updateGpuText(e) {
    e._didTextUpdate = !1;
    const t = this._getGpuText(e);
    if (t.generatingTexture)
      return;
    const r = e._getKey();
    this._renderer.htmlText.decreaseReferenceCount(t.currentKey), t.generatingTexture = !0, t.currentKey = r;
    const s = e.resolution ?? this._renderer.resolution, a = await this._renderer.htmlText.getManagedTexture(
      e.text,
      s,
      e._style,
      e._getKey()
    ), n = t.batchableSprite;
    n.texture = t.texture = a, t.generatingTexture = !1, t.textureNeedsUploading = !0, e.onViewUpdate();
    const o = e._style.padding;
    Q(n.bounds, e._anchor, n.texture, o);
  }
  _getGpuText(e) {
    return this._gpuText[e.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = {
      texture: M.EMPTY,
      currentKey: "--",
      batchableSprite: b.get(Fe),
      textureNeedsUploading: !1,
      generatingTexture: !1
    }, r = t.batchableSprite;
    return r.renderable = e, r.transform = e.groupTransform, r.texture = M.EMPTY, r.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, r.roundPixels = this._renderer._roundPixels | e._roundPixels, e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution, this._gpuText[e.uid] = t, e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuText)
      this._destroyRenderableById(e);
    this._gpuText = null, this._renderer = null;
  }
}
tt.extension = {
  type: [
    g.WebGLPipes,
    g.WebGPUPipes,
    g.CanvasPipes
  ],
  name: "htmlText"
};
function sr() {
  const { userAgent: i } = Ge.get().getNavigator();
  return /^((?!chrome|android).)*safari/i.test(i);
}
const ir = new Be();
function rt(i, e, t, r) {
  const s = ir;
  s.minX = 0, s.minY = 0, s.maxX = i.width / r | 0, s.maxY = i.height / r | 0;
  const a = S.getOptimalTexture(
    s.width,
    s.height,
    r,
    !1
  );
  return a.source.uploadMethodId = "image", a.source.resource = i, a.source.alphaMode = "premultiply-alpha-on-upload", a.frame.width = e / r, a.frame.height = t / r, a.source.emit("update", a.source), a.updateUvs(), a;
}
function ar(i, e) {
  const t = e.fontFamily, r = [], s = {}, a = /font-family:([^;"\s]+)/g, n = i.match(a);
  function o(d) {
    s[d] || (r.push(d), s[d] = !0);
  }
  if (Array.isArray(t))
    for (let d = 0; d < t.length; d++)
      o(t[d]);
  else
    o(t);
  n && n.forEach((d) => {
    const l = d.split(":")[1].trim();
    o(l);
  });
  for (const d in e.tagStyles) {
    const l = e.tagStyles[d].fontFamily;
    o(l);
  }
  return r;
}
async function nr(i) {
  const t = await (await Ge.get().fetch(i)).blob(), r = new FileReader();
  return await new Promise((a, n) => {
    r.onloadend = () => a(r.result), r.onerror = n, r.readAsDataURL(t);
  });
}
async function ve(i, e) {
  const t = await nr(e);
  return `@font-face {
        font-family: "${i.fontFamily}";
        src: url('${t}');
        font-weight: ${i.fontWeight};
        font-style: ${i.fontStyle};
    }`;
}
const O = /* @__PURE__ */ new Map();
async function or(i, e, t) {
  const r = i.filter((s) => q.has(`${s}-and-url`)).map((s, a) => {
    if (!O.has(s)) {
      const { url: n } = q.get(`${s}-and-url`);
      a === 0 ? O.set(s, ve({
        fontWeight: e.fontWeight,
        fontStyle: e.fontStyle,
        fontFamily: s
      }, n)) : O.set(s, ve({
        fontWeight: t.fontWeight,
        fontStyle: t.fontStyle,
        fontFamily: s
      }, n));
    }
    return O.get(s);
  });
  return (await Promise.all(r)).join(`
`);
}
function dr(i, e, t, r, s) {
  const { domElement: a, styleElement: n, svgRoot: o } = s;
  a.innerHTML = `<style>${e.cssStyle}</style><div style='padding:0;'>${i}</div>`, a.setAttribute("style", `transform: scale(${t});transform-origin: top left; display: inline-block`), n.textContent = r;
  const { width: d, height: l } = s.image;
  return o.setAttribute("width", d.toString()), o.setAttribute("height", l.toString()), new XMLSerializer().serializeToString(o);
}
function ur(i, e) {
  const t = H.getOptimalCanvasAndContext(
    i.width,
    i.height,
    e
  ), { context: r } = t;
  return r.clearRect(0, 0, i.width, i.height), r.drawImage(i, 0, 0), t;
}
function lr(i, e, t) {
  return new Promise(async (r) => {
    t && await new Promise((s) => setTimeout(s, 100)), i.onload = () => {
      r();
    }, i.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`, i.crossOrigin = "anonymous";
  });
}
class ne {
  constructor(e) {
    this._activeTextures = {}, this._renderer = e, this._createCanvas = e.type === Z.WEBGPU;
  }
  getTexture(e) {
    return this._buildTexturePromise(
      e.text,
      e.resolution,
      e.style
    );
  }
  getManagedTexture(e, t, r, s) {
    if (this._activeTextures[s])
      return this._increaseReferenceCount(s), this._activeTextures[s].promise;
    const a = this._buildTexturePromise(e, t, r).then((n) => (this._activeTextures[s].texture = n, n));
    return this._activeTextures[s] = {
      texture: null,
      promise: a,
      usageCount: 1
    }, a;
  }
  async _buildTexturePromise(e, t, r) {
    const s = b.get(Ie), a = ar(e, r), n = await or(
      a,
      r,
      ie.defaultTextStyle
    ), o = kt(e, r, n, s), d = Math.ceil(Math.ceil(Math.max(1, o.width) + r.padding * 2) * t), l = Math.ceil(Math.ceil(Math.max(1, o.height) + r.padding * 2) * t), c = s.image, u = 2;
    c.width = (d | 0) + u, c.height = (l | 0) + u;
    const f = dr(e, r, t, n, s);
    await lr(c, f, sr() && a.length > 0);
    const p = c;
    let h;
    this._createCanvas && (h = ur(c, t));
    const m = rt(
      h ? h.canvas : p,
      c.width - u,
      c.height - u,
      t
    );
    return this._createCanvas && (this._renderer.texture.initSource(m.source), H.returnCanvasAndContext(h)), b.return(s), m;
  }
  _increaseReferenceCount(e) {
    this._activeTextures[e].usageCount++;
  }
  decreaseReferenceCount(e) {
    const t = this._activeTextures[e];
    t && (t.usageCount--, t.usageCount === 0 && (t.texture ? this._cleanUp(t) : t.promise.then((r) => {
      t.texture = r, this._cleanUp(t);
    }).catch(() => {
      V("HTMLTextSystem: Failed to clean texture");
    }), this._activeTextures[e] = null));
  }
  _cleanUp(e) {
    S.returnTexture(e.texture), e.texture.source.resource = null, e.texture.source.uploadMethodId = "unknown";
  }
  getReferenceCount(e) {
    return this._activeTextures[e].usageCount;
  }
  destroy() {
    this._activeTextures = null;
  }
}
ne.extension = {
  type: [
    g.WebGLSystem,
    g.WebGPUSystem,
    g.CanvasSystem
  ],
  name: "htmlText"
};
ne.defaultFontOptions = {
  fontFamily: "Arial",
  fontStyle: "normal",
  fontWeight: "normal"
};
class st {
  constructor(e) {
    this._gpuText = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.runners.resolutionChange.add(this), this._renderer.renderableGC.addManagedHash(this, "_gpuText");
  }
  resolutionChange() {
    for (const e in this._gpuText) {
      const t = this._gpuText[e];
      if (!t)
        continue;
      const r = t.batchableSprite.renderable;
      r._autoResolution && (r._resolution = this._renderer.resolution, r.onViewUpdate());
    }
  }
  validateRenderable(e) {
    const t = this._getGpuText(e), r = e._getKey();
    return t.currentKey !== r;
  }
  addRenderable(e, t) {
    const s = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), this._renderer.renderPipes.batch.addToBatch(s, t);
  }
  updateRenderable(e) {
    const r = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), r._batcher.updateElement(r);
  }
  destroyRenderable(e) {
    e.off("destroyed", this._destroyRenderableBound), this._destroyRenderableById(e.uid);
  }
  _destroyRenderableById(e) {
    const t = this._gpuText[e];
    this._renderer.canvasText.decreaseReferenceCount(t.currentKey), b.return(t.batchableSprite), this._gpuText[e] = null;
  }
  _updateText(e) {
    const t = e._getKey(), r = this._getGpuText(e), s = r.batchableSprite;
    r.currentKey !== t && this._updateGpuText(e), e._didTextUpdate = !1;
    const a = e._style.padding;
    Q(s.bounds, e._anchor, s.texture, a);
  }
  _updateGpuText(e) {
    const t = this._getGpuText(e), r = t.batchableSprite;
    t.texture && this._renderer.canvasText.decreaseReferenceCount(t.currentKey), t.texture = r.texture = this._renderer.canvasText.getManagedTexture(e), t.currentKey = e._getKey(), r.texture = t.texture;
  }
  _getGpuText(e) {
    return this._gpuText[e.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = {
      texture: null,
      currentKey: "--",
      batchableSprite: b.get(Fe)
    };
    return t.batchableSprite.renderable = e, t.batchableSprite.transform = e.groupTransform, t.batchableSprite.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, t.batchableSprite.roundPixels = this._renderer._roundPixels | e._roundPixels, this._gpuText[e.uid] = t, e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution, this._updateText(e), e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuText)
      this._destroyRenderableById(e);
    this._gpuText = null, this._renderer = null;
  }
}
st.extension = {
  type: [
    g.WebGLPipes,
    g.WebGPUPipes,
    g.CanvasPipes
  ],
  name: "text"
};
function Te(i, e, t) {
  for (let r = 0, s = 4 * t * e; r < e; ++r, s += 4)
    if (i[s + 3] !== 0)
      return !1;
  return !0;
}
function we(i, e, t, r, s) {
  const a = 4 * e;
  for (let n = r, o = r * a + 4 * t; n <= s; ++n, o += a)
    if (i[o + 3] !== 0)
      return !1;
  return !0;
}
function cr(i, e = 1) {
  const { width: t, height: r } = i, s = i.getContext("2d", {
    willReadFrequently: !0
  });
  if (s === null)
    throw new TypeError("Failed to get canvas 2D context");
  const n = s.getImageData(0, 0, t, r).data;
  let o = 0, d = 0, l = t - 1, c = r - 1;
  for (; d < r && Te(n, t, d); )
    ++d;
  if (d === r)
    return ue.EMPTY;
  for (; Te(n, t, c); )
    --c;
  for (; we(n, t, o, d, c); )
    ++o;
  for (; we(n, t, l, d, c); )
    --l;
  return ++l, ++c, new ue(o / e, d / e, (l - o) / e, (c - d) / e);
}
class it {
  constructor(e) {
    this._activeTextures = {}, this._renderer = e;
  }
  getTextureSize(e, t, r) {
    const s = F.measureText(e || " ", r);
    let a = Math.ceil(Math.ceil(Math.max(1, s.width) + r.padding * 2) * t), n = Math.ceil(Math.ceil(Math.max(1, s.height) + r.padding * 2) * t);
    return a = Math.ceil(a - 1e-6), n = Math.ceil(n - 1e-6), a = ce(a), n = ce(n), { width: a, height: n };
  }
  getTexture(e, t, r, s) {
    typeof e == "string" && (ee("8.0.0", "CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"), e = {
      text: e,
      style: r,
      resolution: t
    }), e.style instanceof K || (e.style = new K(e.style));
    const { texture: a, canvasAndContext: n } = this.createTextureAndCanvas(
      e
    );
    return this._renderer.texture.initSource(a._source), H.returnCanvasAndContext(n), a;
  }
  createTextureAndCanvas(e) {
    const { text: t, style: r } = e, s = e.resolution ?? this._renderer.resolution, a = F.measureText(t || " ", r), n = Math.ceil(Math.ceil(Math.max(1, a.width) + r.padding * 2) * s), o = Math.ceil(Math.ceil(Math.max(1, a.height) + r.padding * 2) * s), d = H.getOptimalCanvasAndContext(n, o), { canvas: l } = d;
    this.renderTextToCanvas(t, r, s, d);
    const c = rt(l, n, o, s);
    if (r.trim) {
      const u = cr(l, s);
      c.frame.copyFrom(u), c.updateUvs();
    }
    return { texture: c, canvasAndContext: d };
  }
  getManagedTexture(e) {
    e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution;
    const t = e._getKey();
    if (this._activeTextures[t])
      return this._increaseReferenceCount(t), this._activeTextures[t].texture;
    const { texture: r, canvasAndContext: s } = this.createTextureAndCanvas(e);
    return this._activeTextures[t] = {
      canvasAndContext: s,
      texture: r,
      usageCount: 1
    }, r;
  }
  _increaseReferenceCount(e) {
    this._activeTextures[e].usageCount++;
  }
  decreaseReferenceCount(e) {
    const t = this._activeTextures[e];
    if (t.usageCount--, t.usageCount === 0) {
      H.returnCanvasAndContext(t.canvasAndContext), S.returnTexture(t.texture);
      const r = t.texture.source;
      r.resource = null, r.uploadMethodId = "unknown", r.alphaMode = "no-premultiply-alpha", this._activeTextures[e] = null;
    }
  }
  getReferenceCount(e) {
    return this._activeTextures[e].usageCount;
  }
  /**
   * Renders text to its canvas, and updates its texture.
   *
   * By default this is used internally to ensure the texture is correct before rendering,
   * but it can be used called externally, for example from this class to 'pre-generate' the texture from a piece of text,
   * and then shared across multiple Sprites.
   * @param text
   * @param style
   * @param resolution
   * @param canvasAndContext
   */
  renderTextToCanvas(e, t, r, s) {
    const { canvas: a, context: n } = s, o = wt(t), d = F.measureText(e || " ", t), l = d.lines, c = d.lineHeight, u = d.lineWidths, f = d.maxLineWidth, p = d.fontProperties, h = a.height;
    if (n.resetTransform(), n.scale(r, r), n.textBaseline = t.textBaseline, t._stroke?.width) {
      const T = t._stroke;
      n.lineWidth = T.width, n.miterLimit = T.miterLimit, n.lineJoin = T.join, n.lineCap = T.cap;
    }
    n.font = o;
    let m, _;
    const x = t.dropShadow ? 2 : 1;
    for (let T = 0; T < x; ++T) {
      const w = t.dropShadow && T === 0, P = w ? Math.ceil(Math.max(1, h) + t.padding * 2) : 0, D = P * r;
      if (w) {
        n.fillStyle = "black", n.strokeStyle = "black";
        const y = t.dropShadow, at = y.color, nt = y.alpha;
        n.shadowColor = U.shared.setValue(at).setAlpha(nt).toRgbaString();
        const ot = y.blur * r, oe = y.distance * r;
        n.shadowBlur = ot, n.shadowOffsetX = Math.cos(y.angle) * oe, n.shadowOffsetY = Math.sin(y.angle) * oe + D;
      } else
        n.fillStyle = t._fill ? le(t._fill, n) : null, t._stroke?.width && (n.strokeStyle = le(t._stroke, n)), n.shadowColor = "black";
      let G = (c - p.fontSize) / 2;
      c - p.fontSize < 0 && (G = 0);
      const R = t._stroke?.width ?? 0;
      for (let y = 0; y < l.length; y++)
        m = R / 2, _ = R / 2 + y * c + p.ascent + G, t.align === "right" ? m += f - u[y] : t.align === "center" && (m += (f - u[y]) / 2), t._stroke?.width && this._drawLetterSpacing(
          l[y],
          t,
          s,
          m + t.padding,
          _ + t.padding - P,
          !0
        ), t._fill !== void 0 && this._drawLetterSpacing(
          l[y],
          t,
          s,
          m + t.padding,
          _ + t.padding - P
        );
    }
  }
  /**
   * Render the text with letter-spacing.
   * @param text - The text to draw
   * @param style
   * @param canvasAndContext
   * @param x - Horizontal position to draw the text
   * @param y - Vertical position to draw the text
   * @param isStroke - Is this drawing for the outside stroke of the
   *  text? If not, it's for the inside fill
   */
  _drawLetterSpacing(e, t, r, s, a, n = !1) {
    const { context: o } = r, d = t.letterSpacing;
    let l = !1;
    if (F.experimentalLetterSpacingSupported && (F.experimentalLetterSpacing ? (o.letterSpacing = `${d}px`, o.textLetterSpacing = `${d}px`, l = !0) : (o.letterSpacing = "0px", o.textLetterSpacing = "0px")), d === 0 || l) {
      n ? o.strokeText(e, s, a) : o.fillText(e, s, a);
      return;
    }
    let c = s;
    const u = F.graphemeSegmenter(e);
    let f = o.measureText(e).width, p = 0;
    for (let h = 0; h < u.length; ++h) {
      const m = u[h];
      n ? o.strokeText(m, c, a) : o.fillText(m, c, a);
      let _ = "";
      for (let x = h + 1; x < u.length; ++x)
        _ += u[x];
      p = o.measureText(_).width, c += f - p + d, f = p;
    }
  }
  destroy() {
    this._activeTextures = null;
  }
}
it.extension = {
  type: [
    g.WebGLSystem,
    g.WebGPUSystem,
    g.CanvasSystem
  ],
  name: "canvasText"
};
v.add(Ae);
v.add(ke);
v.add(Le);
v.add(St);
v.add(Xe);
v.add(Ke);
v.add(Ne);
v.add(it);
v.add(st);
v.add(et);
v.add(ne);
v.add(tt);
v.add(Ze);
v.add(Je);
v.add(ze);
v.add(He);
//# sourceMappingURL=webworkerAll.js.map
