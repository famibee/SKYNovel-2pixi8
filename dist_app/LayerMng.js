import { q as O, T as W, m as ot, U as Tt, V as Rt, O as Ft, d as Pt, v as Et, s as wt, x as Ot, b as R, j as q, S as M, y as Vt, D as st, i as yt, a as w, L as I, k as gt, C as S, l as j, z as U, R as K, u as G, B as ct, F as It, H as rt, I as kt, J as Bt, K as bt, g as _t, M as jt, N as Dt, Q as Wt, W as zt } from "./app2.js";
import { C as E } from "./CmnTween.js";
import { e as X, d as Q, R as xt, T as Ht } from "./ReadState.js";
import { R as A } from "./RenderTexture.js";
import { G as H } from "./Graphics.js";
import { R as ft } from "./RubySpliter.js";
class it extends O {
  /** @ignore */
  constructor(...t) {
    let e = t[0];
    Array.isArray(t[0]) && (e = {
      textures: t[0],
      autoUpdate: t[1]
    });
    const { textures: s, autoUpdate: i, ...n } = e, [a] = s;
    super({
      ...n,
      texture: a instanceof W ? a : a.texture
    }), this._textures = null, this._durations = null, this._autoUpdate = i ?? !0, this._isConnectedToTicker = !1, this.animationSpeed = 1, this.loop = !0, this.updateAnchor = !1, this.onComplete = null, this.onFrameChange = null, this.onLoop = null, this._currentTime = 0, this._playing = !1, this._previousFrame = null, this.textures = s;
  }
  /** Stops the AnimatedSprite. */
  stop() {
    this._playing && (this._playing = !1, this._autoUpdate && this._isConnectedToTicker && (ot.shared.remove(this.update, this), this._isConnectedToTicker = !1));
  }
  /** Plays the AnimatedSprite. */
  play() {
    this._playing || (this._playing = !0, this._autoUpdate && !this._isConnectedToTicker && (ot.shared.add(this.update, this, Tt.HIGH), this._isConnectedToTicker = !0));
  }
  /**
   * Stops the AnimatedSprite and goes to a specific frame.
   * @param frameNumber - Frame index to stop at.
   */
  gotoAndStop(t) {
    this.stop(), this.currentFrame = t;
  }
  /**
   * Goes to a specific frame and begins playing the AnimatedSprite.
   * @param frameNumber - Frame index to start at.
   */
  gotoAndPlay(t) {
    this.currentFrame = t, this.play();
  }
  /**
   * Updates the object transform for rendering.
   * @param ticker - the ticker to use to update the object.
   */
  update(t) {
    if (!this._playing)
      return;
    const e = t.deltaTime, s = this.animationSpeed * e, i = this.currentFrame;
    if (this._durations !== null) {
      let n = this._currentTime % 1 * this._durations[this.currentFrame];
      for (n += s / 60 * 1e3; n < 0; )
        this._currentTime--, n += this._durations[this.currentFrame];
      const a = Math.sign(this.animationSpeed * e);
      for (this._currentTime = Math.floor(this._currentTime); n >= this._durations[this.currentFrame]; )
        n -= this._durations[this.currentFrame] * a, this._currentTime += a;
      this._currentTime += n / this._durations[this.currentFrame];
    } else
      this._currentTime += s;
    this._currentTime < 0 && !this.loop ? (this.gotoAndStop(0), this.onComplete && this.onComplete()) : this._currentTime >= this._textures.length && !this.loop ? (this.gotoAndStop(this._textures.length - 1), this.onComplete && this.onComplete()) : i !== this.currentFrame && (this.loop && this.onLoop && (this.animationSpeed > 0 && this.currentFrame < i || this.animationSpeed < 0 && this.currentFrame > i) && this.onLoop(), this._updateTexture());
  }
  /** Updates the displayed texture to match the current frame index. */
  _updateTexture() {
    const t = this.currentFrame;
    this._previousFrame !== t && (this._previousFrame = t, this.texture = this._textures[t], this.updateAnchor && this.anchor.copyFrom(this.texture.defaultAnchor), this.onFrameChange && this.onFrameChange(this.currentFrame));
  }
  /** Stops the AnimatedSprite and destroys it. */
  destroy() {
    this.stop(), super.destroy(), this.onComplete = null, this.onFrameChange = null, this.onLoop = null;
  }
  /**
   * A short hand way of creating an AnimatedSprite from an array of frame ids.
   * @param frames - The array of frames ids the AnimatedSprite will use as its texture frames.
   * @returns - The new animated sprite with the specified frames.
   */
  static fromFrames(t) {
    const e = [];
    for (let s = 0; s < t.length; ++s)
      e.push(W.from(t[s]));
    return new it(e);
  }
  /**
   * A short hand way of creating an AnimatedSprite from an array of image ids.
   * @param images - The array of image urls the AnimatedSprite will use as its texture frames.
   * @returns The new animate sprite with the specified images as frames.
   */
  static fromImages(t) {
    const e = [];
    for (let s = 0; s < t.length; ++s)
      e.push(W.from(t[s]));
    return new it(e);
  }
  /**
   * The total number of frames in the AnimatedSprite. This is the same as number of textures
   * assigned to the AnimatedSprite.
   * @readonly
   * @default 0
   */
  get totalFrames() {
    return this._textures.length;
  }
  /** The array of textures used for this AnimatedSprite. */
  get textures() {
    return this._textures;
  }
  set textures(t) {
    if (t[0] instanceof W)
      this._textures = t, this._durations = null;
    else {
      this._textures = [], this._durations = [];
      for (let e = 0; e < t.length; e++)
        this._textures.push(t[e].texture), this._durations.push(t[e].time);
    }
    this._previousFrame = null, this.gotoAndStop(0), this._updateTexture();
  }
  /** The AnimatedSprite's current frame index. */
  get currentFrame() {
    let t = Math.floor(this._currentTime) % this._textures.length;
    return t < 0 && (t += this._textures.length), t;
  }
  set currentFrame(t) {
    if (t < 0 || t > this.totalFrames - 1)
      throw new Error(`[AnimatedSprite]: Invalid frame index value ${t}, expected to be between 0 and totalFrames ${this.totalFrames}.`);
    const e = this.currentFrame;
    this._currentTime = t, e !== this.currentFrame && this._updateTexture();
  }
  /**
   * Indicates if the AnimatedSprite is currently playing.
   * @readonly
   */
  get playing() {
    return this._playing;
  }
  /** Whether to use Ticker.shared to auto update animation time. */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(t) {
    t !== this._autoUpdate && (this._autoUpdate = t, !this._autoUpdate && this._isConnectedToTicker ? (ot.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._playing && (ot.shared.add(this.update, this), this._isConnectedToTicker = !0));
  }
}
class Ut extends Rt {
  constructor(t, e) {
    const { text: s, resolution: i, style: n, anchor: a, width: o, height: r, roundPixels: c, ...f } = t;
    super({
      ...f
    }), this.batched = !0, this._resolution = null, this._autoResolution = !0, this._didTextUpdate = !0, this._styleClass = e, this.text = s ?? "", this.style = n, this.resolution = i ?? null, this.allowChildren = !1, this._anchor = new Ft(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), a && (this.anchor = a), this.roundPixels = c ?? !1, o !== void 0 && (this.width = o), r !== void 0 && (this.height = r);
  }
  /**
   * The anchor sets the origin point of the text.
   * The default is `(0,0)`, this means the text's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { Text } from 'pixi.js';
   *
   * const text = new Text('hello world');
   * text.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  /** Set the copy for the text object. To split a line you can use '\n'. */
  set text(t) {
    t = t.toString(), this._text !== t && (this._text = t, this.onViewUpdate());
  }
  get text() {
    return this._text;
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   * @default 1
   */
  set resolution(t) {
    this._autoResolution = t === null, this._resolution = t, this.onViewUpdate();
  }
  get resolution() {
    return this._resolution;
  }
  get style() {
    return this._style;
  }
  /**
   * Set the style of the text.
   *
   * Set up an event listener to listen for changes on the style object and mark the text as dirty.
   *
   * If setting the `style` can also be partial {@link AnyTextStyleOptions}.
   * @type {
   * text.TextStyle |
   * Partial<text.TextStyle> |
   * text.TextStyleOptions |
   * text.HTMLTextStyle |
   * Partial<text.HTMLTextStyle> |
   * text.HTMLTextStyleOptions
   * }
   */
  set style(t) {
    t || (t = {}), this._style?.off("update", this.onViewUpdate, this), t instanceof this._styleClass ? this._style = t : this._style = new this._styleClass(t), this._style.on("update", this.onViewUpdate, this), this.onViewUpdate();
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this.bounds.width;
  }
  set width(t) {
    this._setWidth(t, this.bounds.width);
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this.bounds.height;
  }
  set height(t) {
    this._setHeight(t, this.bounds.height);
  }
  /**
   * Retrieves the size of the Text as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the Text.
   */
  getSize(t) {
    return t || (t = {}), t.width = Math.abs(this.scale.x) * this.bounds.width, t.height = Math.abs(this.scale.y) * this.bounds.height, t;
  }
  /**
   * Sets the size of the Text to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, this.bounds.width), e !== void 0 && this._setHeight(e, this.bounds.height);
  }
  /**
   * Checks if the text contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    const e = this.bounds.width, s = this.bounds.height, i = -e * this.anchor.x;
    let n = 0;
    return t.x >= i && t.x <= i + e && (n = -s * this.anchor.y, t.y >= n && t.y <= n + s);
  }
  onViewUpdate() {
    this.didViewUpdate || (this._didTextUpdate = !0), super.onViewUpdate();
  }
  _getKey() {
    return `${this.text}:${this._style.styleKey}:${this._resolution}`;
  }
  /**
   * Destroys this text renderable and optionally its style texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the texture of the text style
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the text style
   * @param {boolean} [options.style=false] - Should it destroy the style of the text
   */
  destroy(t = !1) {
    super.destroy(t), this.owner = null, this._bounds = null, this._anchor = null, (typeof t == "boolean" ? t : t?.style) && this._style.destroy(t), this._style = null, this._text = null;
  }
}
function Jt(J, t) {
  let e = J[0] ?? {};
  return (typeof e == "string" || J[1]) && (Pt(Et, `use new ${t}({ text: "hi!", style }) instead`), e = {
    text: e,
    style: J[1]
  }), e;
}
class qt extends Ut {
  constructor(...t) {
    const e = Jt(t, "Text");
    super(e, wt), this.renderPipeId = "text";
  }
  /** @private */
  updateBounds() {
    const t = this._bounds, e = this._anchor, s = Ot.measureText(
      this._text,
      this._style
    ), { width: i, height: n } = s;
    t.minX = -e._x * i, t.maxX = t.minX + i, t.minY = -e._y * n, t.maxY = t.minY + n;
  }
}
class tt {
  constructor(t, e, s, i, n, a, o, r) {
    this.cls = e, this.hArg = n, this.sys = a, this.val = o, this.ret = r;
    const c = a.hFactoryCls[e];
    if (!c) throw `属性 class【${e}】が不正です`;
    const f = c(), l = c();
    f.layname = l.layname = t;
    const b = n[":id_tag"] = `layer:${t} cls:${e} page:`;
    f.ctn.label = f.name = b + "A", l.ctn.label = l.name = b + "B", s.addChild(f.ctn), i.addChild(l.ctn), R(n, "visible", !0), R(n, "visible", !0), r.isWait = f.lay(n) || l.lay(n), this.#i = { fore: f, back: l };
    const m = `const.sn.lay.${t}`;
    o.setVal_Nochk("tmp", m, !0), o.defTmp(m + ".fore.alpha", () => this.#i.fore.alpha), o.defTmp(m + ".back.alpha", () => this.#i.back.alpha), o.defTmp(m + ".fore.height", () => this.#i.fore.height), o.defTmp(m + ".back.height", () => this.#i.back.height), o.defTmp(m + ".fore.visible", () => this.#i.fore.ctn.visible), o.defTmp(m + ".back.visible", () => this.#i.back.ctn.visible), o.defTmp(m + ".fore.width", () => this.#i.fore.width), o.defTmp(m + ".back.width", () => this.#i.back.width), o.defTmp(m + ".fore.x", () => this.#i.fore.x), o.defTmp(m + ".back.x", () => this.#i.back.x), o.defTmp(m + ".fore.y", () => this.#i.fore.y), o.defTmp(m + ".back.y", () => this.#i.back.y);
  }
  #i;
  destroy() {
    this.#i.fore.destroy(), this.#i.back.destroy();
  }
  lay = (t) => this.getPage(t).lay(t);
  getPage = (t) => tt.argChk_page(t, "fore") !== "back" ? this.#i.fore : this.#i.back;
  static argChk_page(t, e) {
    const s = t.page ?? e;
    if (s === "fore" || s === "back") return t.page = s;
    throw Error("属性 page【" + s + "】が不正です");
  }
  get fore() {
    return this.#i.fore;
  }
  get back() {
    return this.#i.back;
  }
  transPage(t) {
    [this.#i.back, this.#i.fore] = [this.#i.fore, this.#i.back], this.#i.back.copy(this.#i.fore, t);
  }
}
class ut {
  //	static	readonly	#alzTagArg	= new AnalyzeTagArg;
  constructor(t, e = !1) {
    this.bg_col = t, this.isLay = e;
  }
  static init(t, e, s, i, n, a) {
  }
  static cvsResizeDesign() {
  }
  destroy() {
  }
  gethArg() {
    return this.hArg;
  }
  hArg = {};
  sethArg(t) {
    this.hArg = t;
  }
  setOther(t) {
  }
  adopt(t) {
  }
  static enterMode() {
  }
  static allHide() {
  }
  set visible(t) {
  }
  static leaveMode() {
  }
  cvsResize() {
  }
  make() {
  }
  static replaceToken(t) {
  }
}
class Gt extends ut {
  constructor(t, e) {
    super("#29e", !0);
  }
  setSp(t) {
  }
}
class _ {
  constructor(t = "", e, s = () => {
  }, i = () => {
  }) {
    this.csvFn = t, this.ctn = e, this.fncFirstComp = s, this.fncAllComp = i, t && (this.#f = e ? (n) => {
      e.addChild(n), this.#y.push(n);
    } : () => {
    }, this.ret = _.#c(
      t,
      (n) => this.fncFirstComp(n),
      // 差し替え考慮
      (n) => this.fncAllComp(n),
      // 差し替え考慮
      (n) => this.#f(n)
      // 差し替え考慮
    ));
  }
  static #i;
  static #e;
  // static	#sys	: SysBase;
  static #n;
  static init(t, e, s, i, n) {
    _.#i = t, _.#e = e, _.#n = i;
    const a = () => {
      const o = _.#t * _.#o;
      for (const r of Object.values(_.#r)) r.volume = o;
    };
    n.setNoticeChgVolume(
      (o) => {
        _.#t = o, a();
      },
      (o) => {
        _.#o = o, a();
      }
    );
  }
  static #o = 1;
  static #t = 1;
  static #l;
  static setEvtMng(t) {
    _.#l = t;
  }
  ret = !1;
  #f;
  #y = [];
  destroy() {
    this.fncFirstComp = () => {
    }, this.fncAllComp = () => {
    }, this.#f = (t) => t.destroy();
    for (const t of this.#y)
      _.stopVideo(t.name), t.parent?.removeChild(t), t.destroy();
    this.#y = [];
  }
  static destroy() {
    _.#s = {}, _.#m = {}, _.#r = {};
  }
  //static #ldrHFn: {[fn: string]: 1} = {};
  static #c(t, e, s, i) {
    if (!t) return !1;
    let n = !1;
    if (t.startsWith("data:"))
      return n = !q.cache.has(t), q.load({
        alias: t,
        src: _.#i.searchPath(t, M.SP_GSM)
      }).then((r) => {
        const c = O.from(r);
        i(c), e(c), s(n);
      }), n;
    const a = t.split(","), o = a.length;
    for (let r = 0; r < o; ++r) {
      const c = a[r];
      if (q.cache.has(c) || c in _.#m) break;
      try {
        q.add({ alias: c, src: _.#i.searchPath(c, M.SP_GSM) }), n = !0;
      } catch (f) {
        this.#n.errScript(`画像/動画ロード失敗です SpritesMng.csv2Sprites fn:${c} ${f}`, !1);
      }
    }
    return q.load(a).then((r) => {
      for (let c = 0; c < o; ++c) {
        const f = a[c], l = r[f], { _frameKeys: b } = l;
        if (b && !(f in _.#m)) {
          const { data: { meta: v } } = l;
          _.#u(b), _.#m[f] = { meta: v, _frameKeys: b };
        }
        const { dx: m, dy: h, blendmode: u, fn: y } = _.#s[f] ?? {
          fn: f,
          dx: 0,
          dy: 0,
          blendmode: "normal"
        }, d = _.#d(y);
        if (d.label = y, i(d), c === 0 ? e(d) : (d.x = m, d.y = h, d.blendMode = u), !d.texture || !(d.texture.source instanceof Vt)) return;
        const p = d.texture.source.resource;
        p.volume = _.#t, _.#e.getVal("const.sn.needClick2Play") && (st.trace_beforeNew(`[lay系] ${st.strPos()}未クリック状態で動画を自動再生します。音声はミュートされます`, "W"), p.muted = !0), p.setAttribute("playsinline", ""), _.#r[y] = p;
      }
      s(n);
    }), n;
  }
  static #s = {};
  static #m = {};
  static #d(t) {
    const e = _.#m[t];
    if (e) {
      const i = it.fromFrames(e._frameKeys);
      return i.animationSpeed = e.meta.animationSpeed ?? 1, i.play(), i;
    }
    if (t in _.#r) {
      const i = _.#r[t];
      if (i) return O.from(i);
    }
    const s = q.cache.get(t);
    return s ? O.from(s) : new O();
  }
  static #r = {};
  static getHFn2VElm(t) {
    return _.#r[t];
  }
  static #u(t) {
    const e = /([^\d]+)\d+\.(\w+)/.exec(t[0] ?? "");
    if (!e) return;
    const s = e[1].length, i = -e[2].length - 1;
    t.sort((n, a) => yt(n.slice(s, i)) > yt(a.slice(s, i)) ? 1 : -1);
  }
  static wv(t) {
    const { fn: e } = t;
    if (!e) throw "fnは必須です";
    const s = _.#r[e];
    if (!s || s.loop) return !1;
    if (_.#l.isSkipping || s.ended)
      return _.stopVideo(e), !1;
    const i = () => _.#l.breakEvent("wv fn:" + e);
    s.addEventListener("ended", i, { once: !0, passive: !0 });
    const n = R(t, "stop", !0);
    return _.#l.waitEvent("wv fn:" + e, t, () => {
      s.removeEventListener("ended", i), n && _.stopVideo(e), i();
    });
  }
  static stopVideo(t) {
    const e = _.#r[t];
    e && (delete _.#r[t], e.pause(), e.currentTime = e.duration);
  }
  static add_face(t) {
    const { name: e } = t;
    if (!e) throw "nameは必須です";
    if (e in _.#s) throw "一つのname（" + e + "）に対して同じ画像を複数割り当てられません";
    const { fn: s = e } = t;
    return _.#s[e] = {
      fn: s,
      dx: w(t, "dx", 0),
      dy: w(t, "dy", 0),
      blendmode: I.getBlendmodeNum(t.blendmode || "")
    }, !1;
  }
  //	static	clearFace2Name(): void {SpritesMng.hFace = {}}
}
class z extends I {
  static #i = new gt();
  static #e;
  static init(t, e, s, i, n, a) {
    z.#e = s, _.init(e, a, i, t, n);
  }
  static destroy() {
    z.#i.clear(), _.destroy();
  }
  #n = new Gt(this.ctn, this);
  constructor() {
    super(), S.isDbg && (this.#o = (t) => this.#n.setSp(t), this.cvsResize = () => {
      super.cvsResize(), this.#n.cvsResize();
    });
  }
  #o = () => {
  };
  #t = "";
  #l = "";
  #f = "";
  lay = (t) => {
    const e = this.#y(t, (s) => {
      s && X();
    });
    return e && Q(), e;
  };
  #y(t, e) {
    const { fn: s, face: i = "" } = t;
    if (this.#n.sethArg(t), !s)
      return super.lay(t), this.ctn.children.length > 0 && this.setPos(t), this.#l = "", this.#t = this.#f = i, e(!1), !1;
    const n = "fn" in t, a = "face" in t;
    return this.clearLay({ clear_filter: R(t, "clear_filter", !0) }), n && (this.#l = s), a && (this.#f = i), super.lay(t), t.dx = 0, t.dy = 0, this.#c.destroy(), this.#c = new _(
      this.#t = s + (i ? "," + i : ""),
      this.ctn,
      (o) => {
        ("width" in t || "height" in t) && (o.width = w(t, "width", 0), o.height = w(t, "height", 0)), this.#s = o.width, this.#m = o.height, I.setXY(o, t, this.ctn, !0), I.setBlendmode(this.ctn, t), this.#o(o);
      },
      (o) => e(o)
    ), this.#c.ret;
  }
  #c = new _();
  #s = 0;
  #m = 0;
  get width() {
    return this.#s;
  }
  get height() {
    return this.#m;
  }
  renderStart() {
    this.#r = new O(this.#d), this.#r.visible = !1, this.ctn.addChildAt(this.#r, 0), this.#r.position.set(-this.ctn.x, -this.ctn.y);
    let t = () => {
      const e = this.ctn.alpha;
      this.ctn.alpha = 1;
      for (const s of this.ctn.children) s.visible = !0;
      this.#r.visible = !1, z.#e.renderer.render(this.ctn, { renderTexture: this.#d }), this.ctn.alpha = e;
      for (const s of this.ctn.children) s.visible = !1;
    };
    if (!this.containMovement) {
      let e = t;
      t = () => {
        t = () => {
        }, e();
      };
    }
    this.#u = () => {
      t(), this.#r.visible = !0;
    }, z.#e.ticker.add(this.#u);
  }
  #d = A.create({
    width: S.stageW,
    height: S.stageH
  });
  #r = new O();
  #u = () => {
  };
  renderEnd() {
    z.#e.ticker.remove(this.#u), this.ctn.removeChild(this.#r);
    for (const t of this.ctn.children) t.visible = !0;
    this.#r.destroy(!0), this.#d = A.create({
      width: S.stageW,
      height: S.stageH
    });
  }
  setPos(t) {
    I.setXY(
      this.ctn.children[0] ?? this.ctn,
      t,
      this.ctn,
      !0
    );
  }
  // アニメ・動画を含むか
  get containMovement() {
    if (this.#t === "") return !1;
    const t = this.ctn.children;
    return this.#t.split(",").some(
      (e, s) => t[s] instanceof it || _.getHFn2VElm(e)
    );
  }
  clearLay(t) {
    super.clearLay(t), this.#c.destroy(), this.#l = "", this.#f = "", this.#t = "";
  }
  record = () => ({
    ...super.record(),
    sBkFn: this.#l,
    sBkFace: this.#f
    //		idc_hArg	: this.#idc.gethArg(),
  });
  playback(t, e) {
    if (super.playback(t, e), t.sBkFn === "" && t.sBkFace === "") {
      this.#l = "", this.#f = "";
      return;
    }
    e.push(new Promise((s) => this.#y(
      { fn: t.sBkFn, face: t.sBkFace, left: t.x, top: t.y, alpha: t.alpha, blendmode: t.blendMode, rotation: t.rotation, scale_x: t.scale_x, scale_y: t.scale_y },
      (i) => {
        this.ctn.position.set(t.x, t.y), s();
      }
      // Layer.setXY()の後に再度移動
    )));
  }
  makeDesignCast(t) {
    this.ctn.visible && t(this.#n);
  }
  //makeDesignCastChildren(_gdc: IMakeDesignCast) {}
  cvsResize() {
    super.cvsResize();
  }
  showDesignCast() {
    this.#n.visible = !0;
  }
  //showDesignCastChildren() {}
  dump = () => super.dump() + `, "pic":"${this.#t}"`;
}
const et = "、。，．）］｝〉」』】〕”〟ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ！？!?‼⁉・ーゝゞヽヾ々", ht = "［（｛〈「『【〔“〝", lt = "─‥…", dt = et, vt = new RegExp(`[${et}]`), Lt = new RegExp(`[${ht}]`), Xt = new RegExp(`[${lt}]`), Yt = vt;
class Kt {
  #i = et;
  #e = ht;
  #n = lt;
  #o = dt;
  get 行頭禁則() {
    return this.#i;
  }
  get 行末禁則() {
    return this.#e;
  }
  get 分割禁止() {
    return this.#n;
  }
  get ぶら下げ() {
    return this.#o;
  }
  #t = vt;
  #l = Lt;
  #f = Xt;
  #y = Yt;
  break_fixed = !1;
  break_fixed_left = 0;
  break_fixed_top = 0;
  bura = !1;
  lay(t) {
    t.kinsoku_sol && (this.#i = t.kinsoku_sol, this.#t = new RegExp(`[${this.#i}]`)), t.kinsoku_eol && (this.#e = t.kinsoku_eol, this.#c(), this.#l = new RegExp(`[${this.#e}]`)), t.kinsoku_dns && (this.#n = t.kinsoku_dns, this.#s(), this.#f = new RegExp(`[${this.#n}]`)), t.kinsoku_bura && (this.#o = t.kinsoku_bura, this.#c(), this.#s(), this.#y = new RegExp(`[${this.#o}]`)), "bura" in t && (this.bura = R(t, "bura", !1)), this.break_fixed = R(t, "break_fixed", this.break_fixed), this.break_fixed_left = w(t, "break_fixed_left", this.break_fixed_left), this.break_fixed_top = w(t, "break_fixed_top", this.break_fixed_top);
  }
  // 禁則の競合（ぶら下げ と 行末禁則 の両方に含まれる文字があってはならない）
  #c() {
    const t = this.#e.length, e = this.#o.length;
    if (t < e)
      for (let s = 0; s < t; ++s) {
        const i = this.#e[s];
        if (this.#o.includes(i)) throw `禁則の競合があります。文字 ${i} がぶら下げ と 行末禁則 の両方に含まれます`;
      }
    else
      for (let s = 0; s < e; ++s) {
        const i = this.#o[s];
        if (this.#e.includes(i)) throw `禁則の競合があります。文字 ${i} がぶら下げ と 行末禁則 の両方に含まれます`;
      }
  }
  // 禁則の競合（ぶら下げ と 分割禁止 の両方に含まれる文字があってはならない）
  #s() {
    const t = this.#n.length, e = this.#o.length;
    if (t < e)
      for (let s = 0; s < t; ++s) {
        const i = this.#n[s];
        if (this.#o.includes(i)) throw `禁則の競合があります。文字 ${i} がぶら下げ と 分割禁止 の両方に含まれます`;
      }
    else
      for (let s = 0; s < e; ++s) {
        const i = this.#o[s];
        if (this.#n.includes(i)) throw `禁則の競合があります。文字 ${i} がぶら下げ と 分割禁止 の両方に含まれます`;
      }
  }
  reNew(t) {
    t.#m(this.#i, this.#e, this.#n, this.#o), t.break_fixed = this.break_fixed, t.break_fixed_left = this.break_fixed_left, t.break_fixed_top = this.break_fixed_top, t.bura = this.bura;
  }
  #m(t, e, s, i) {
    this.#i != t && (this.#i = t, this.#t = new RegExp(`[${t}]`)), this.#e != e && (this.#e = e, this.#l = new RegExp(`[${e}]`)), this.#n != s && (this.#n = s, this.#f = new RegExp(`[${s}]`)), this.#o != i && (this.#o = i, this.#y = new RegExp(`[${i}]`));
  }
  record() {
    const t = {
      break_fixed: this.break_fixed,
      break_fixed_left: this.break_fixed_left,
      break_fixed_top: this.break_fixed_top,
      bura: this.bura
    };
    return this.#i === et && (t.行頭禁則 = this.#i), this.#e === ht && (t.行末禁則 = this.#e), this.#n === lt && (t.分割禁止 = this.#n), this.#o === dt && (t.ぶら下げ = this.#o), t;
  }
  playback(t) {
    t && (this.#m(
      t.行頭禁則 ?? et,
      t.行末禁則 ?? ht,
      t.分割禁止 ?? lt,
      t.ぶら下げ ?? dt
    ), this.break_fixed = t.break_fixed, this.break_fixed_left = t.break_fixed_left, this.break_fixed_top = t.break_fixed_top, this.bura = t.bura);
  }
  hyph(t, e, s, i, n) {
    let a, o = 0, r = 2, c = (f) => (c = () => !1, i === f ? (i > 0 && (t.innerHTML = n.replaceAll('class="sn_ch"', 'class="sn_ch sn_ch_in_default"')), !0) : f < 2);
    do {
      if (a = this.#r(t, e), o = a.length, c(o)) break;
      let f = -1 / 0;
      for (; r < o; ++r) {
        const { elm: l, rect: b, ch: m } = a[r];
        if (l.tagName === "RT") continue;
        const h = s ? b.y : b.x;
        if (f <= h || l.previousElementSibling?.tagName === "SPAN" && l.previousElementSibling?.innerHTML.includes("<br>") || l.parentElement?.previousElementSibling?.tagName === "SPAN" && l.parentElement?.previousElementSibling?.innerHTML.includes("<br>")) {
          f = h, this.break_fixed || (this.break_fixed_left = b.x, this.break_fixed_top = b.y);
          continue;
        }
        const u = this.#d(a, r), { elm: y, rect: d, ch: p } = a[u];
        if (!this.break_fixed) {
          this.break_fixed_left = d.x, this.break_fixed_top = d.y;
          const T = globalThis.getComputedStyle(y), V = parseFloat(T.fontSize);
          s ? this.break_fixed_top += V : this.break_fixed_left += V;
        }
        f = -1 / 0;
        const v = r, { cont: $, ins: C } = this.bura ? this.hyph_alg_bura(a, u, p, r) : this.hyph_alg(a, u, p, r, m);
        if (r = C, $) continue;
        const F = a[r].elm, P = F.parentElement, k = document.createElement("br");
        if (P.classList.contains("sn_tx")) P.insertBefore(k, F);
        else {
          const T = P.parentElement;
          T.classList.contains("sn_ch") ? T.parentElement.insertBefore(k, T) : T.insertBefore(k, P);
        }
        r += 2, r < v && (r = v), o = -1;
        break;
      }
    } while (o < 0);
    return [a, o];
  }
  // 一つ前の要素を探す（ルビ対応）
  #d(t, e) {
    const s = e - 1, { elm: i } = t[s];
    return i.tagName !== "RT" ? s - (i.style.textCombineUpright === "all" ? Array.from(i.textContent ?? "").length - 1 : 0) : s - Array.from(i.textContent ?? "").length;
  }
  #r(t, e) {
    const s = [];
    if (t.nodeType !== t.TEXT_NODE) return Array.from(t.childNodes).map((o) => this.#r(o, e)).flat();
    const i = t.ownerDocument.createRange();
    i.selectNodeContents(t);
    let n = 0;
    const a = i.endOffset;
    for (; n < a; ) {
      i.setStart(t, n), i.setEnd(t, ++n);
      const o = i.toString();
      s.push({
        ch: o,
        rect: e(i, o),
        elm: i.startContainer.parentElement
      });
    }
    return i.detach(), s;
  }
  /**
   * 抽象化した禁則処理アルゴリズム
   * @method hyph_alg
   * @param {IChRect[]} a - 文章の抽象化配列
   * @param {number} p_i - 処理要素の一つ前の添字
   * @param {string} p_ch - 処理要素の一つ前の文字
   * @param {number} i - 処理要素の添字
   * @param {string} ch - 処理要素の文字
   * @return {Object} result 戻り値
   * @return {boolean} result.cont - true: 呼び元で改行挿入せず continue
   * @return {number} result.ins - 手前に改行を挿入すべき要素の添字
   */
  hyph_alg(t, e, s, i, n) {
    if (!this.#l.test(s)) {
      if (this.#t.test(n))
        for (; (i = this.#d(t, i)) >= 0 && this.#t.test(t[i].ch); )
          ;
      else if (!(s === n && this.#f.test(s))) return { cont: !0, ins: i + 1 };
    }
    for (i = e; (i = this.#d(t, i)) >= 0 && this.#l.test(t[i].ch); )
      ;
    return { cont: !1, ins: i + 1 };
  }
  /**
   * 抽象化した禁則処理アルゴリズム
   * @method hyph_alg
   * @param {IChRect[]} a - 文章の抽象化配列
   * @param {number} p_i - 処理要素の一つ前の添字
   * @param {string} p_ch - 処理要素の一つ前の文字
   * @param {number} i - 処理要素の添字
   * @return {Object} result 戻り値
   * @return {boolean} result.cont - true: 呼び元で改行挿入せず continue
   * @return {number} result.ins - 手前に改行を挿入すべき要素の添字
   */
  hyph_alg_bura(t, e, s, i) {
    const n = this.#d(t, e), { ch: a } = t[n];
    if (this.#y.test(a) || this.#t.test(a)) {
      let r = e;
      (this.#y.test(s) || this.#t.test(s)) && ++r;
      const c = this.#d(t, r), { ch: f } = t[c], { ch: l } = t[r];
      if (f === l && this.#f.test(l)) return { cont: !1, ins: c };
      if (!this.#l.test(f)) return { cont: !1, ins: r };
      r = c;
      do
        if (!this.#l.test(t[r].ch)) break;
      while ((r = this.#d(t, r)) >= 0);
      return { cont: !1, ins: r + 1 };
    }
    const o = this.#d(t, n);
    if (i >= 3) {
      const { ch: r } = t[o];
      if (this.#f.test(a) && r === a)
        return { cont: !1, ins: o };
      if (this.#l.test(r)) {
        let c = o;
        for (; (c = this.#d(t, c)) >= 0 && this.#l.test(t[c].ch); )
          ;
        return { cont: !1, ins: c + 1 };
      }
    }
    return { cont: !1, ins: n };
  }
}
class g extends j {
  constructor(t, e, s) {
    super(), this.ctn = t, this.canFocus = e, this.sys = s, this.#t.classList.add("sn_tx"), this.#t.style.position = "absolute", g.#e.canvas.parentElement.appendChild(this.#t), this.addChild(this.#l), this.addChild(this.#f), this.#f.label = "grpDbgMasume", this.noticeCompTxt = s.isApp && g.#i.oCfg.debug.dumpHtm ? () => {
      xt.noticeCompTxt();
      const i = this.#t.innerHTML;
      if (i === "") return;
      const { fn: n, ln: a } = g.#o.nowScrFnLn(), o = `dumpHtm ${t.label.slice(0, -7).replaceAll(":", "=")}(fn=${n} line=${a})`;
      s.outputFile(
        s.path_downloads + o + ".htm",
        `<!doctype html><html><head><meta charset=utf-8><title>${o}</title>
<h1>${o}</h1>${i.replaceAll(/ class="sn_ch"|animation-delay: \d+ms; ?| data-add="{&quot;ch_in_style&quot;:&quot;default&quot;, &quot;ch_out_style&quot;:&quot;default&quot;}"/g, "").replaceAll(' style=""', "").replaceAll(/(<\/?ruby>)/g, `
$1
`).replaceAll(/<(br|\/span)>/g, `<$1>
`)}`
      );
    } : () => xt.noticeCompTxt();
  }
  static #i;
  static #e;
  static init(t, e) {
    g.#i = t, g.#e = e;
  }
  static #n;
  static #o;
  static setEvtMng(t, e) {
    g.#n = t, g.#o = e;
  }
  static destroy() {
    g.#S = /* @__PURE__ */ Object.create(null), g.#O = /* @__PURE__ */ Object.create(null), g.delBreak();
  }
  #t = document.createElement("span");
  // サンプリング元
  #l = new j();
  // サンプリング先
  #f = new H();
  static #y = {
    "background-color": 0,
    "border-bottom-width": 0,
    "border-left-width": 0,
    "border-right-width": 0,
    "border-top-width": 0,
    "margin-bottom": 0,
    "margin-left": 0,
    "margin-right": 0,
    "margin-top": 0
  };
  #c = new Kt();
  noticeCompTxt = () => {
  };
  //	readonly	#idc	:TxtLayDesignCast;
  //	readonly	#idcCh	= new TxtLayPadDesignCast(this);
  #s = {
    fontsize: 24,
    $width: 0,
    // レイヤサイズであり、背景色（画像）サイズ
    $height: 0,
    pad_left: 0,
    // paddingLeft（レイヤサイズの内側のスペーサー）
    pad_right: 0,
    // paddingRight
    pad_top: 0,
    // paddingTop
    pad_bottom: 0
    // paddingBottom
  };
  lay(t) {
    const e = this.#t.style;
    if ("style" in t)
      if (t.style) {
        const s = document.createElement("span");
        s.style.cssText = t.style;
        const i = s.style.length;
        for (let n = 0; n < i; ++n) {
          const a = s.style[n];
          if (a in g.#y) {
            st.myTrace(`${a}は指定できません`, "W");
            continue;
          }
          e[a] = s.style[a];
        }
        !s.style.opacity && "alpha" in t && (e.opacity = String(this.ctn.alpha));
      } else this.#t.style.cssText = "";
    else "alpha" in t && (e.opacity = String(this.ctn.alpha));
    if ("width" in t && (e.width = (t.width ?? "0") + "px"), "height" in t && (e.height = (t.height ?? "0") + "px"), "pl" in t && (e.paddingLeft = (t.pl ?? "0") + "px"), "pr" in t && (e.paddingRight = (t.pr ?? "0") + "px"), "pt" in t && (e.paddingTop = (t.pt ?? "0") + "px"), "pb" in t && (e.paddingBottom = (t.pb ?? "0") + "px"), this.#c.lay(t), this.#d(), this.#r = this.ctn.position.x, e.transformOrigin = `${this.ctn.pivot.x}px ${this.ctn.pivot.y}px`, this.cvsResize(), e.display = this.ctn.visible ? "inline" : "none", ":redraw" in t && this.#a > 0) {
      const s = [
        this.#t.innerHTML.replaceAll(/(animation-delay: )\d+ms/g, "$10ms"),
        `<span class='sn_ch' data-add='{"ch_in_style":"default"}'>&emsp;</span>`
      ];
      this.#B(), this.goTxt(s, !0);
    }
  }
  #m = 0;
  // 「g」などで下が欠ける問題対策
  #d() {
    const t = this.#t.style, e = parseFloat(t.fontSize || "0");
    this.#s.fontsize = e, this.#s.pad_left = parseFloat(t.paddingLeft || "0"), this.#s.pad_right = parseFloat(t.paddingRight || "0"), this.#s.pad_top = parseFloat(t.paddingTop || "0"), this.#s.pad_bottom = parseFloat(t.paddingBottom || "0"), this.#s.$width = parseFloat(t.width || "0"), this.#s.$height = parseFloat(t.height || "0"), this.position.set(this.#s.pad_left, this.#s.pad_top), this.#u = t.writingMode === "vertical-rl", this.#p = 0, this.#g = 0;
    const s = t.lineHeight ?? "0";
    this.#m = this.#u ? 0 : (s.endsWith("px") ? parseFloat(s) : e * parseFloat(s) - e) / 2;
  }
  cvsResize() {
    const t = this.#t.style, e = this.sys.cvsScale;
    t.left = `${this.sys.ofsLeft4elm + this.#r * e}px`, t.top = `${this.sys.ofsTop4elm + this.ctn.position.y * e}px`, t.transform = `rotate(${this.ctn.angle}deg) scale(${this.ctn.scale.x * e}, ${this.ctn.scale.y * e})`;
  }
  #r = 0;
  #u = !1;
  get tategaki() {
    return this.#u;
  }
  #p = 0;
  #g = 0;
  get infTL() {
    return this.#s;
  }
  get getWidth() {
    return this.#s.$width;
  }
  get getHeight() {
    return this.#s.$height;
  }
  setMySize(t, e) {
    this.#s.$width = t, this.#s.$height = e, this.#t.style.width = this.#s.$width + "px", this.#t.style.height = this.#s.$height + "px";
  }
  #h(t, e = !0) {
    const s = {
      escape: (u) => u.replaceAll(/([.*+?^${}()|\[\]\/\\])/g, "\\$1"),
      mimeType: (u) => {
        const y = r(u).toLowerCase();
        return i()[y] || "";
      },
      dataAsUrl: b,
      isDataUrl: c,
      resolveUrl: f,
      getAndEncode: l,
      asArray: (u) => {
        const y = [], d = u.length;
        for (let p = 0; p < d; ++p) y.push(u[p]);
        return y;
      }
    };
    function i() {
      const u = "application/font-woff", y = "image/jpeg";
      return {
        woff: u,
        woff2: u,
        ttf: "application/font-truetype",
        eot: "application/vnd.ms-fontobject",
        png: "image/png",
        jpg: y,
        jpeg: y,
        gif: "image/gif",
        tiff: "image/tiff",
        svg: "image/svg+xml"
      };
    }
    const n = m(), a = h();
    function o(u) {
      return a.resolveAll().then((y) => {
        const d = document.createElement("style");
        return u.appendChild(d), d.appendChild(document.createTextNode(y)), u;
      });
    }
    function r(u) {
      return /\.([^\.\/]*?)$/g.exec(u)?.[1] ?? "";
    }
    function c(u) {
      return u.search(/^(data:)/) !== -1;
    }
    function f(u, y) {
      const d = document.implementation.createHTMLDocument(), p = d.createElement("base");
      d.head.appendChild(p);
      const v = d.createElement("a");
      return d.body.appendChild(v), p.href = y, v.href = u, v.href;
    }
    function l(u) {
      let y = 3e4;
      return new Promise(function(d) {
        const p = new XMLHttpRequest();
        p.onreadystatechange = v, p.ontimeout = $, p.responseType = "blob", p.timeout = y, p.open("GET", u, !0), p.send();
        function v() {
          if (p.readyState !== 4) return;
          if (p.status !== 200) {
            C("cannot fetch resource: " + u + ", status: " + p.status);
            return;
          }
          const F = new FileReader();
          F.onloadend = function() {
            const P = F.result.toString().split(/,/)[1];
            d(P);
          }, F.readAsDataURL(p.response);
        }
        function $() {
          C("timeout of " + y + "ms occured while fetching resource: " + u);
        }
        function C(F) {
          console.error(F), d("");
        }
      });
    }
    function b(u, y) {
      return "data:" + y + ";base64," + u;
    }
    function m() {
      const u = /url\(['"]?([^'"]+?)['"]?\)/g;
      return {
        inlineAll: v,
        shouldProcess: y
      };
      function y($) {
        return $.search(u) !== -1;
      }
      function d($) {
        const C = [];
        let F;
        for (; F = u.exec($); )
          C.push(F[1]);
        return C.filter(function(P) {
          return !s.isDataUrl(P);
        });
      }
      function p($, C, F, P) {
        return Promise.resolve(C).then((T) => F ? s.resolveUrl(T, F) : T).then(P || s.getAndEncode).then((T) => s.dataAsUrl(T, s.mimeType(C))).then((T) => $.replace(k(C), "$1" + T + "$3"));
        function k(T) {
          return new RegExp(`(url\\(['"]?)(` + s.escape(T) + `)(['"]?\\))`, "g");
        }
      }
      function v($, C, F) {
        if (P()) return Promise.resolve($);
        return Promise.resolve($).then(d).then((k) => {
          let T = Promise.resolve($);
          for (const V of k) T = T.then((Y) => p(Y, V, C, F));
          return T;
        });
        function P() {
          return !y($);
        }
      }
    }
    function h() {
      return {
        resolveAll: u,
        impl: { readAll: y }
      };
      function u() {
        return y().then((d) => Promise.allSettled(
          d.map((p) => p.resolve())
        )).then((d) => d.join(`
`));
      }
      function y() {
        return Promise.resolve(s.asArray(document.styleSheets)).then(p).then(d).then(($) => $.map(v));
        function d($) {
          return $.filter((C) => C.type === CSSRule.FONT_FACE_RULE).filter((C) => n.shouldProcess(C.style.getPropertyValue("src")));
        }
        function p($) {
          const C = [];
          for (const F of $)
            try {
              if (F.href) continue;
              s.asArray(F.cssRules || []).forEach(C.push.bind(C));
            } catch (P) {
              console.error("Error while reading CSS rules from " + F.href, String(P));
            }
          return C;
        }
        function v($) {
          return {
            resolve: function() {
              const F = ($.parentStyleSheet || {}).href;
              return n.inlineAll($.cssText, F);
            },
            src: function() {
              return $.style.getPropertyValue("src");
            }
          };
        }
      }
    }
    Promise.resolve(this.#t).then((u) => {
      const y = u.cloneNode(!0);
      return y.style.padding = "0px", y.style.paddingRight = this.#p + "px", y.style.paddingTop = this.#g + "px", y.style.left = "0px", y.style.top = "0px", y.style.width = this.#s.$width - this.#s.pad_left - this.#s.pad_right + "px", y.style.height = this.#s.$height - this.#s.pad_top - this.#s.pad_bottom + "px", this.#t.hidden = e, y;
    }).then(o).then((u) => {
      u.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      const y = new Image();
      return y.src = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${this.#s.$width}px" height="${this.#s.$height}px"><foreignObject x="0" y="0" width="100%" height="100%">${new XMLSerializer().serializeToString(u).replaceAll("#", "%23").replaceAll(`
`, "%0A")}</foreignObject></svg>`, new Promise((d) => y.onload = () => d(y));
    }).then((u) => new Promise((y) => setTimeout(() => y(u), 100))).then((u) => {
      const y = document.createElement("canvas");
      y.width = this.#s.$width, y.height = this.#s.$height, y.getContext("2d").drawImage(u, 0, 0), t(W.from(y, !0));
    }).catch((u) => st.myTrace(`goTxt() = ${u}`));
  }
  #W = void 0;
  // 文字にかけるフィルター
  #N = [];
  #z = [];
  #a = 0;
  static #v = "<span class='sn_ch sn_ch_last'>&emsp;</span>";
  goTxt(t, e) {
    g.#I.visible = !1;
    let s = this.#z.length, i = "";
    if (s === 0) {
      if (g.#i.oCfg.debug.masume && (S.debugLog && console.log(`🍌 masume ${this.label} v:${this.visible} l:${this.x} t:${this.y} a:${this.alpha} pl:${this.#s.pad_left} pr:${this.#s.pad_right} pt:${this.#s.pad_top} pb:${this.#s.pad_bottom} w:${this.#s.$width} h:${this.#s.$height}`), this.#f.clear().rect(-this.#s.pad_left, -this.#s.pad_top, this.#s.$width, this.#s.$height).fill(new U(3407616).setAlpha(0.2)).stroke({ width: 1, color: 3407616 }).rect(
        0,
        0,
        this.#s.$width - this.#s.pad_left - this.#s.pad_right,
        this.#s.$height - this.#s.pad_top - this.#s.pad_bottom
      ).fill(new U(13311).setAlpha(0.2)).stroke({ width: 2, color: 13311 })), this.#t.innerHTML = [...t].join("").replaceAll(/[\n\t]/g, "") + g.#v, !this.#c.break_fixed) {
        const d = globalThis.getComputedStyle(this.#t), p = parseFloat(d.fontSize);
        this.#u ? (this.#c.break_fixed_left = (this.#s.$width - this.#s.pad_left - this.#s.pad_right - p * 1.5) * this.sys.cvsScale, this.#c.break_fixed_top = 0) : (this.#c.break_fixed_left = 0, this.#c.break_fixed_top = p / 2 * this.sys.cvsScale);
      }
    } else
      i = this.#t.innerHTML, --s, this.#t.querySelector(".sn_ch_last")?.remove(), this.#t.querySelectorAll(":scope > br").forEach((d) => d.remove()), this.#t.insertAdjacentHTML(
        "beforeend",
        t.slice(this.#a).join("").replaceAll(/[\n\t]/g, "") + g.#v
        // 末尾改行削除挙動対策
      );
    this.#t.querySelectorAll(".sn_ch:has(> ruby)").forEach((d) => d.style.background = ""), this.#a = t.length;
    const n = this.sys.cvsScale, a = this.#t.getBoundingClientRect(), o = a.left + this.#s.pad_left, r = a.top + this.#s.pad_top;
    let c;
    if (n === 1) c = (d, p) => {
      const v = d.getBoundingClientRect();
      return new K(
        v.left - o,
        v.top - r,
        v.width,
        v.height + ("gjqy".includes(p) ? this.#m : 0)
      );
    };
    else {
      const d = this.sys.ofsPadLeft_Dom2PIXI + a.left * (1 - n), p = this.sys.ofsPadTop_Dom2PIXI + a.top * (1 - n);
      c = (v, $) => {
        const C = v.getBoundingClientRect();
        return new K(
          (C.left - d) / n - o,
          (C.top - p) / n - r,
          C.width / n,
          (C.height + ("gjqy".includes($) ? this.#m : 0)) / n
        );
      };
    }
    const [f, l] = this.#c.hyph(this.#t, c, this.#u, s, i);
    this.#z = f;
    const b = S.debugLog ? ({ ch: d }, { x: p, y: v, width: $, height: C }) => console.log(`🍌 masume ch:${d} x:${p} y:${v} w:${$} h:${C}`) : () => {
    }, m = g.#i.oCfg.debug.masume ? (d, p) => {
      b(d, p), this.#f.rect(p.x, p.y, p.width, p.height).fill(new U(6737151).setAlpha(0.5)).stroke({ width: 2, color: 16724736 });
    } : () => {
    }, h = E.ease(this.#P);
    for (let d = s; d < l; ++d) {
      const p = this.#z[d], v = p.rect, $ = JSON.parse(p.elm.dataset.arg ?? '{"delay": 0}'), C = JSON.parse(p.elm.dataset.add ?? "{}"), F = g.#S[C.ch_in_style];
      if (m(p, v), p.elm.dataset.cmd === "grp") {
        const P = new j();
        this.#l.addChild(P), new _($.pic, P, (k) => {
          this.#H(P, $, C, v, h, F ?? {}), P.parent || P.removeChild(k);
        });
      }
      if (p.elm.dataset.lnk) {
        const P = p.elm.parentElement.closest("[data-arg]"), k = JSON.parse(P.dataset.arg ?? "{}");
        k.key = `lnk=[${d}] ` + this.label;
        const T = new O();
        this.#H(T, k, C, v, h, F ?? {});
        const V = k.style ?? "", Y = V + (k.style_hover ?? ""), Z = V + (k.style_clicked ?? ""), L = k.r_style ?? "", $t = L + (k.r_style_hover ?? ""), Ct = L + (k.r_style_clicked ?? ""), pt = Array.from(P.getElementsByTagName("rt"));
        for (const at of pt) at.dataset.st_r_bk = at.style.cssText;
        const Nt = P.style.cssText, nt = (at, St) => {
          P.style.cssText = Nt + at;
          for (const mt of pt) mt.style.cssText = mt.dataset.st_r_bk + St;
        };
        R(k, "enabled", !0) ? g.#n.button(
          k,
          T,
          () => nt(V, L),
          () => this.canFocus() ? (nt(Y, $t), !0) : !1,
          () => nt(Z, Ct)
        ) : nt(
          V + (k.style_disable ?? "color: gray;"),
          L + (k.r_style_disable ?? "color: gray;")
        ), this.#l.addChild(T);
      }
    }
    const u = Array.from(this.#t.getElementsByClassName("sn_ch"));
    this.#w = () => {
      this.#w = () => !1;
      for (const d of u) d.className = d.className.replaceAll(/ go_ch_in_[^\s"]+/g, "");
      return g.#I.position.set(
        this.#c.break_fixed_left,
        this.#c.break_fixed_top
      ), g.#I.visible = !0, this.noticeCompTxt(), !0;
    };
    for (const d of u) d.className = d.className.replaceAll(/sn_ch_in_([^\s"]+)/g, "go_ch_in_$1");
    s > 0 && ++s;
    let y;
    for (let d = l - 2; d >= 0; --d) {
      const { elm: p } = this.#z[d];
      if (p.tagName === "SPAN") {
        y = p.parentElement?.tagName === "RUBY" ? p.parentElement.parentElement ?? p : p;
        break;
      }
    }
    if (!y || e || s === l) {
      this.#w();
      return;
    }
    y.addEventListener("animationend", () => this.#w(), { once: !0, passive: !0 });
  }
  #w = () => !1;
  #H(t, e, s, i, n, a) {
    t.alpha = 0, e.x && (i.x = e.x.startsWith("=") ? i.x + parseInt(e.x.slice(1)) : parseInt(e.x)), e.y && (i.y = e.y.startsWith("=") ? i.y + parseInt(e.y.slice(1)) : parseInt(e.y)), e.width && (i.width = parseInt(e.width)), e.height && (i.height = parseInt(e.height)), e.wait && (a.wait = parseInt(e.wait)), t.width = i.width, t.height = i.height, a.x ? t.position.set(
      a.x.startsWith("=") ? i.x + t.width * a.nx : a.nx,
      a.y.startsWith("=") ? i.y + t.height * a.ny : a.ny
    ) : t.position.set(i.x, i.y);
    const o = {
      sp: t,
      tw: new Ht(t).to({ alpha: 1, x: i.x, y: i.y, width: i.width, height: i.height, angle: 0 }, a.wait ?? 0).easing(n).delay((s.wait ?? 0) + (e.delay ?? 0)).onComplete(() => {
        o.tw = void 0;
      }).start()
    };
    this.#N.push(o);
  }
  skipChIn() {
    let t = this.#w();
    for (const e of this.#N)
      e.tw && (e.tw.stop().end(), t = !0);
    return this.#N = [], t;
  }
  static #S = /* @__PURE__ */ Object.create(null);
  static #V = /[\s\.,]/;
  static initChStyle() {
    g.#S = /* @__PURE__ */ Object.create(null), g.#O = /* @__PURE__ */ Object.create(null);
  }
  static getChInStyle(t) {
    return g.#S[t];
  }
  static ch_in_style(t) {
    const { name: e } = t;
    if (!e) throw "nameは必須です";
    if (g.#V.test(e)) throw `name【${e}】に使えない文字が含まれます`;
    if (e in g.#S) throw `name【${e}】はすでにあります`;
    const s = String(t.x ?? "=0"), i = String(t.y ?? "=0");
    return g.#S[e] = {
      wait: w(t, "wait", 500),
      // アニメ・FI時間
      alpha: w(t, "alpha", 0),
      x: s,
      // 初期x値
      y: i,
      // [tsy]と同様に絶対・相対指定可能
      // {x:500}			X位置を500に
      // {x:'=500'}		現在のX位置に+500加算した位置
      // {x:'=-500'}		現在のX位置に-500加算した位置
      // {x:'250,500'}	+250から＋500までの間でランダムな値をX位置に
      // {x:'=250,500'}	+250から＋500までの間でランダムな値を現在のX位置に加算
      nx: parseFloat(s.at(0) === "=" ? s.slice(1) : s),
      ny: parseFloat(i.at(0) === "=" ? i.slice(1) : i),
      scale_x: w(t, "scale_x", 1),
      scale_y: w(t, "scale_y", 1),
      rotate: w(t, "rotate", 0),
      join: R(t, "join", !0),
      // 文字を順番に出すか（true）同時か（false）
      ease: t.ease ?? "ease-out"
    };
  }
  static #O = /* @__PURE__ */ Object.create(null);
  static getChOutStyle(t) {
    return g.#O[t];
  }
  static ch_out_style(t) {
    const { name: e } = t;
    if (!e) throw "nameは必須です";
    if (g.#V.test(e)) throw `name【${e}】に使えない文字が含まれます`;
    if (e in g.#O) throw `name【${e}】はすでにあります`;
    const s = String(t.x ?? "=0"), i = String(t.y ?? "=0");
    return g.#O[e] = {
      wait: w(t, "wait", 500),
      // アニメ・FI時間
      alpha: w(t, "alpha", 0),
      x: s,
      // 初期x値
      y: i,
      // [tsy]と同様に絶対・相対指定可能
      // {x:500}			X位置を500に
      // {x:'=500'}		現在のX位置に+500加算した位置
      // {x:'=-500'}		現在のX位置に-500加算した位置
      // {x:'250,500'}	+250から＋500までの間でランダムな値をX位置に
      // {x:'=250,500'}	+250から＋500までの間でランダムな値を現在のX位置に加算
      nx: parseFloat(s.at(0) === "=" ? s.slice(1) : s),
      ny: parseFloat(i.at(0) === "=" ? i.slice(1) : i),
      scale_x: w(t, "scale_x", 1),
      scale_y: w(t, "scale_y", 1),
      rotate: w(t, "rotate", 0),
      join: R(t, "join", !1),
      // 文字を順番に出すか（true）同時か（false）
      ease: t.ease ?? "ease-out"
    };
  }
  static #I = new j();
  static #J = new _();
  dispBreak(t) {
    g.delBreak();
    const e = g.#I;
    e.visible = !1, this.addChild(e), g.#J.destroy(), g.#J = new _(t.pic, e, (s) => {
      e.parent ? (s.x = w(t, "x", 0), s.y = w(t, "y", 0), s.width = w(t, "width", this.#s.fontsize), s.height = w(t, "height", this.#s.fontsize)) : e.removeChild(s);
    });
  }
  static delBreak() {
    const t = g.#I;
    t.parent?.removeChild(t), g.#J.destroy();
  }
  #P = "Quadratic.Out";
  #T = "Quadratic.Out";
  #B() {
    this.#f.clear(), this.#z = [], this.#a = 0, this.skipChIn();
    const t = this.#t.cloneNode(!0);
    t.textContent = "";
    const e = this.#t;
    e.parentElement.insertBefore(t, e);
    let s = 0;
    e.querySelectorAll("span.sn_ch").forEach((n) => {
      const a = JSON.parse(
        n?.dataset.add ?? // 通常文字
        n?.children[0]?.getAttribute("data-add") ?? // ルビ
        n?.children[0]?.children[0]?.getAttribute("data-add") ?? "{}"
        // 縦中横
      );
      if (!a.ch_out_style) return;
      const o = g.#O[a.ch_out_style];
      if (o) {
        if (o.wait === 0) {
          n.style.display = "none";
          return;
        }
        s += o.wait, o.join || (n.style.animationDelay = "0ms"), n.classList.add(`go_ch_out_${a.ch_out_style}`);
      }
    });
    const i = () => {
      e.parentElement.removeChild(e);
      for (const n of this.#l.removeChildren())
        n instanceof j && g.#n.unButton(n), n.destroy();
    };
    s === 0 ? (this.#t.textContent = "", i()) : e.lastElementChild?.addEventListener("animationend", i, { once: !0, passive: !0 }), this.#t = t;
  }
  reNew() {
    this.#B();
    const t = new g(this.ctn, () => this.canFocus(), this.sys);
    return t.#s = this.#s, t.#t.style.cssText = this.#t.style.cssText, t.#r = this.#r, t.label = this.label, t.#d(), t.#W = this.#W, t.#P = this.#P, t.#T = this.#T, this.#c.reNew(t.#c), this.destroy(), t;
  }
  record() {
    return {
      infTL: this.#s,
      cssText: this.#t.style.cssText,
      left: this.#r,
      //		idc_hArg	: this.#idc.gethArg(),
      ch_filter: this.#W,
      fi_easing: this.#P,
      fo_easing: this.#T,
      hyph: this.#c.record()
    };
  }
  playback(t) {
    this.#s = t.infTL, this.position.set(this.#s.pad_left, this.#s.pad_top), this.#t.style.cssText = t.cssText, this.#r = t.left, this.#d(), this.#W = t.ch_filter, this.#P = t.fi_easing, this.#T = t.fo_easing, this.#c.playback(t.hyph);
  }
  get cssText() {
    return this.#t.style.cssText;
  }
  set cssText(t) {
    this.#t.style.cssText = t;
  }
  #b = void 0;
  snapshot(t, e) {
    this.#h((s) => {
      this.#b = O.from(s, !0), this.#u && (this.#b.x += S.stageW - (this.#r + this.#s.$width)), this.#b.y -= this.#g, this.#b.bounds.clear(), this.#b.bounds.addFrame(
        0,
        0,
        Math.min(this.#b.width, this.#s.$width - this.#r),
        Math.min(this.#b.height, this.#s.$height)
      ), this.#l.addChild(this.#b), t.render({ container: this.#b, clear: !1 }), e();
    }, !1);
  }
  snapshot_end() {
    this.#b && (this.#l.removeChild(this.#b), this.#b = void 0);
  }
  makeDesignCast(t) {
  }
  showDesignCast() {
  }
  //	showDesignCast() {this.#idc.visible = true; this.#idcCh.visible = true}
  dump() {
    const t = [], e = this.#t.style, s = e.length;
    for (let i = 0; i < s; ++i) {
      const n = e[i];
      t.push(`"${n}":"${e[n].replaceAll(/(["\\])/g, "\\$1")}"`);
    }
    return `"txt":"${this.#t.textContent.replaceAll(/(["\\])/g, "\\$1")}", "style":{${t.join(",")}}`;
  }
  destroy() {
    g.delBreak(), this.#t.parentElement.removeChild(this.#t), this.removeChild(this.#l), this.removeChild(this.#f), super.destroy();
  }
}
class D extends j {
  constructor(t, e, s, i) {
    if (super(), this.hArg = t, this.evtMng = e, this.resolve = s, this.canFocus = i, this.#t = {
      type: "pic",
      enabled: R(t, "enabled", !0),
      x: this.x = G(t.left ?? 0),
      y: this.y = G(t.top ?? 0),
      rotation: this.angle = w(t, "rotation", this.angle),
      // flash : rotation is in degrees.
      // pixijs: rotation is in radians, angle is in degrees.
      pivot_x: this.pivot.x = w(t, "pivot_x", this.pivot.x),
      pivot_y: this.pivot.y = w(t, "pivot_y", this.pivot.y),
      scale_x: this.scale.x = w(t, "scale_x", this.scale.x),
      scale_y: this.scale.y = w(t, "scale_y", this.scale.y),
      alpha: 1,
      text: "",
      b_pic: "",
      width: 0,
      height: 0
    }, this.getBtnBounds = () => (this.#n.x = this.#t.x, this.#n.y = this.#t.y, this.#n), this.#t.enabled && e.button(t, this, () => this.normal(), () => this.#f(), () => this.#y()), t.pic) {
      this.#t.type = "pic", this.#o = new _(
        t.pic,
        this,
        (l) => {
          this.#c(l), this.#n.width = l.width * this.#t.scale_x, this.#n.height = l.height * this.#t.scale_y;
        },
        (l) => s
      );
      return;
    }
    if (!t.text) throw "textまたはpic属性は必須です";
    const n = w(t, "height", 30), a = new wt({
      align: "center",
      dropShadow: {
        alpha: 0.7,
        //				angle	: number;
        blur: 7,
        color: "white",
        distance: 0
      },
      fill: this.#t.enabled ? "black" : "gray",
      fontFamily: D.fontFamily,
      fontSize: n,
      padding: 5
    });
    if (t.style) try {
      const l = JSON.parse(t.style);
      for (const [b, m] of Object.entries(l)) a[b] = m;
      this.#t = { ...this.#t, ...l };
    } catch (l) {
      throw l instanceof SyntaxError ? new Error(ct(t, "style", l.message)) : "fn:Button.ts style";
    }
    const o = new qt({ text: t.text ?? "", style: a });
    o.alpha = w(t, "alpha", o.alpha), o.width = w(t, "width", 100), o.height = t.height = n, this.setText = (l) => o.text = l, this.#t = {
      ...this.#t,
      type: "text",
      // dump用
      alpha: o.alpha,
      text: o.text,
      width: o.width,
      height: o.height
    };
    let r = !1;
    if (this.#t.width = this.width, this.#t.height = this.height, t.b_pic && (this.#t.b_pic = t.b_pic, this.#o = new _(
      t.b_pic,
      this,
      (l) => {
        this.#l(l, o), this.#t.width = this.width, this.#t.height = this.height, o.label = JSON.stringify(this.#t);
      },
      (l) => {
        I.setBlendmode(this, t), l && s();
      }
    ), r = this.#o.ret), o.label = JSON.stringify(this.#t), this.addChild(o), this.#n.width = o.width, this.#n.height = o.height, t.b_pic || I.setBlendmode(this, t), D.#i(this, o), !this.#t.enabled) {
      r || s();
      return;
    }
    const c = a.clone();
    if (t.style_hover) try {
      const l = JSON.parse(t.style_hover);
      for (const [b, m] of Object.entries(l)) c[b] = m;
    } catch (l) {
      throw l instanceof SyntaxError ? new Error(ct(t, "style_hover", l.message)) : "fn:Button.ts style_hover";
    }
    else c.fill = "white";
    const f = c.clone();
    if (t.style_clicked) try {
      const l = JSON.parse(t.style_clicked);
      for (const [b, m] of Object.entries(l)) f[b] = m;
    } catch (l) {
      throw l instanceof SyntaxError ? new Error(ct(t, "style_clicked", l.message)) : "fn:Button.ts style_clicked";
    }
    else f.dropShadow = !1;
    this.normal = () => o.style = a, this.#f = () => i() ? (o.style = c, !0) : !1, this.#y = () => o.style = f, r || s();
  }
  static fontFamily = "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', '游ゴシック Medium', meiryo, sans-serif";
  static #i = (t, e) => {
  };
  static #e = (t, e, s, i) => {
  };
  static init(t) {
    t.oCfg.debug.masume && (D.#i = (e, s) => e.addChild(
      new H().rect(s.x, s.y, s.width, s.height).fill(new U(8926088).setAlpha(0.2)).stroke({ width: 1, color: 8926088 })
    ), D.#e = (e, s, i, n) => e.addChild(
      new H().rect(s.x, s.y, i, n).fill(new U(8926088).setAlpha(0.2)).stroke({ width: 1, color: 8926088 })
    ));
  }
  setText(t) {
  }
  getBtnBounds = () => this.#n;
  // 文字ボタンは背景画像を含まない位置指定なので、その当たり判定用
  #n = new K();
  #o = new _();
  //	#idc		: DesignCast;
  #t;
  destroy() {
    this.evtMng.unButton(this), this.#o.destroy(), super.destroy();
  }
  makeDesignCast(t) {
  }
  showDesignCast() {
  }
  //	showDesignCast() {this.#idc.visible = true}
  cvsResize() {
  }
  #l(t, e) {
    this.setChildIndex(t, 0), t.alpha = e.alpha, t.updateTransform({
      x: e.x,
      y: e.y,
      scaleX: 1,
      scaleY: 1,
      rotation: e.rotation,
      skewX: 0,
      skewY: 0,
      pivotX: (t.width - e.width) / 2,
      pivotY: (t.height - e.height) / 2
    }), t.label = e.label;
  }
  normal = () => {
  };
  #f = () => !1;
  #y = () => {
  };
  #c(t) {
    this.#t.alpha = t.alpha = w(this.hArg, "alpha", t.alpha);
    const e = t.width / 3, s = this.#t.enabled ? e : t.width, i = t.height, { source: n } = t.texture, a = new W({ source: n, frame: new K(0, 0, e, i) }), o = new W({ source: n, frame: new K(e, 0, e, i) }), r = new W({ source: n, frame: new K(e * 2, 0, e, i) }), c = () => t.texture = a;
    this.#t.enabled && c(), this.normal = c, this.#f = () => this.canFocus() ? (t.texture = r, !0) : !1, this.#y = () => t.texture = o, "width" in this.hArg ? (this.#t.width = G(this.hArg.width), this.scale.x *= this.#t.width / s) : this.#t.width = s, "height" in this.hArg ? (this.#t.height = G(this.hArg.height), this.scale.y *= this.#t.height / i) : this.#t.height = i, t.label = JSON.stringify(this.#t), D.#e(this, t, s, i);
  }
}
class x extends I {
  static #i;
  static #e;
  static #n;
  static #o;
  static init(t, e, s, i, n, a) {
    x.#i = t, g.init(t, a), x.#e = s, x.#o = i, x.#n = n, s.setDoRecProc(x.chgDoRec), e.autowc = (o) => x.#m(o), e.autowc({ enabled: !1, text: "", time: 0 }), e.ch_in_style = (o) => x.#t(o), e.ch_out_style = (o) => x.#l(o), g.initChStyle(), It(), rt(
      t.matchPath(".+", M.FONT).flatMap((o) => Object.values(o).map((r) => `
@font-face {
	font-family: '${r}';
	src: url('${this.#i.searchPath(r, M.FONT)}');
}
`)).join("") + `
.sn_tx {
	pointer-events: none;
	user-select: none;
	-webkit-touch-callout: none;
	box-sizing: border-box;
}
.sn_ch {
	position: relative;
	display: inline-block;
}
`
      // 「sn_ch」と「sn_ch_in_〜」の中身が重複しているが、これは必須
    ), x.#t({
      name: "default",
      wait: 500,
      alpha: 0,
      x: "=0.3",
      y: "=0",
      scale_x: 1,
      scale_y: 1,
      rotate: 0,
      join: !0,
      ease: "ease-out"
    }), x.#l({
      name: "default",
      wait: 0,
      alpha: 0,
      x: "=0",
      y: "=0",
      scale_x: 1,
      scale_y: 1,
      rotate: 0,
      join: !1,
      ease: "ease-out"
    });
  }
  // 文字出現演出
  static #t(t) {
    const e = g.ch_in_style(t), s = e.x.startsWith("=") ? `${e.nx * 100}%` : `${e.nx}px`, i = e.y.startsWith("=") ? `${e.ny * 100}%` : `${e.ny}px`, { name: n } = t;
    return rt(`
.sn_ch_in_${n} {
	position: relative;
	display: inline-block;
}
.go_ch_in_${n} {
	opacity: ${e.alpha};
	position: relative;
	display: inline-block;
	animation: sn_ch_in_${n} ${e.wait}ms ${e.ease} 0s both;
}
@keyframes sn_ch_in_${n} {
	from {transform: rotate(${e.rotate}deg) scale(${e.scale_x}, ${e.scale_y}) translate(${s}, ${i})}
	to {opacity: 1; transform: none;}
}
`), !1;
  }
  // 文字消去演出
  static #l(t) {
    const e = g.ch_out_style(t), s = e.x.startsWith("=") ? `${e.nx * 100}%` : `${e.nx}px`, i = e.y.startsWith("=") ? `${e.ny * 100}%` : `${e.ny}px`, { name: n } = t;
    return rt(`
.go_ch_out_${n} {
	position: relative;
	display: inline-block;
	animation: go_ch_out_${n} ${e.wait}ms ${e.ease} 0s both;
}
@keyframes go_ch_out_${n} {
	to {
		opacity: ${e.alpha};
		transform: rotate(${e.rotate}deg) scale(${e.scale_x}, ${e.scale_y}) translate(${s}, ${i});
	}
`), !1;
  }
  static #f;
  static #y;
  static setEvtMng(t, e, s) {
    x.#f = t, x.#y = e, g.setEvtMng(t, s);
  }
  // 文字ごとのウェイト
  static #c = !1;
  static #s = {};
  static #m(t) {
    x.#c = R(t, "enabled", x.#c), x.#e.setVal_Nochk("save", "const.sn.autowc.enabled", x.#c);
    const { text: e } = t;
    if ("text" in t != "time" in t) throw "[autowc] textとtimeは同時指定必須です";
    if (x.#e.setVal_Nochk("save", "const.sn.autowc.text", e), !e)
      return x.#e.setVal_Nochk("save", "const.sn.autowc.time", ""), !1;
    const s = e.length;
    if (x.#c && s === 0) throw '[autowc] enabled === false かつ text === "" は許されません';
    const i = String(t.time).split(",");
    if (i.length !== s) throw "[autowc] text文字数とtimeに記述された待ち時間（コンマ区切り）は同数にして下さい";
    x.#s = {};
    for (let n = 0; n < s; ++n) x.#s[e[n]] = G(i[n]);
    return x.#e.setVal_Nochk("save", "const.sn.autowc.time", t.time), !1;
  }
  // バック
  #d = 0;
  #r = 0;
  #u = !1;
  #p = void 0;
  #g = "";
  // 背景画像無し（＝単色塗り）
  // 文字表示
  #h = new g(this.ctn, () => this.canFocus(), x.#y);
  #W = new ft();
  #N = document.createElement("span");
  // cssチェック・保存用
  static #z = {
    "text-align": 0,
    "text-align-last": 0,
    height: 0,
    width: 0,
    "padding-left": 0,
    "padding-right": 0,
    "padding-top": 0,
    "padding-bottom": 0
  };
  #a = new j();
  constructor() {
    super(), this.ctn.addChild(this.#h), this.#W.init(this.#Z), this.ctn.addChild(this.#a), this.#a.label = "cntBtn", this.lay({ style: `width: ${S.stageW}px; height: ${S.stageH}px; font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', '游ゴシック Medium', meiryo, sans-serif; color: white; font-size: 24px; line-height: 1.5; padding: 16px;`, in_style: "default", out_style: "default", back_clear: "true" });
  }
  destroy() {
    this.#p && (this.ctn.removeChild(this.#p).destroy(), this.#p = void 0), x.#o.recPagebreak(), this.#h.destroy();
  }
  static destroy() {
    x.#c = !1, x.#s = {}, x.#_ = (t) => t;
  }
  set name(t) {
    this.name_ = t, this.#h.label = t;
  }
  get name() {
    return this.name_;
  }
  // getは継承しないらしい
  cvsResize() {
    this.#h.cvsResize();
  }
  cvsResizeChildren() {
    for (const t of this.#a.children) t.cvsResize();
  }
  procSetX(t) {
    this.#h.lay({ x: t });
  }
  procSetY(t) {
    this.#h.lay({ y: t });
  }
  lay(t) {
    if (super.lay(t), I.setXY(this.ctn, t, this.ctn), t[":id_tag"] = this.name_.slice(0, -7), ft.setting(t), this.#J(t), this.#h.lay(t), "r_align" in t && (this.#k = t.r_align ?? ""), this.#G = S.isSafari ? this.#h.tategaki ? (s, i) => `text-align: start; height: ${i}em; padding-top: ${s}; padding-bottom: ${s};` : (s, i) => `text-align: start; width: ${i}em; padding-left: ${s}; padding-right: ${s};` : this.#h.tategaki ? (s) => `text-align: justify; text-align-last: justify; padding-top: ${s}; padding-bottom: ${s};` : (s) => `text-align: justify; text-align-last: justify; padding-left: ${s}; padding-right: ${s};`, S.isFirefox && (this.#x = this.#et), "r_style" in t)
      if (t.r_style) {
        const s = document.createElement("span");
        s.style.cssText = t.r_style;
        const i = s.style.length, n = this.#N.style;
        for (let a = 0; a < i; ++a) {
          const o = s.style[a];
          if (o in x.#z) {
            st.myTrace(`${o}は指定できません`, "W");
            continue;
          }
          const r = s.style[o];
          r && (n[o] = r);
        }
      } else this.#N.style.cssText = "";
    if ("alpha" in t) for (const s of this.#a.children) s.alpha = this.ctn.alpha;
    this.#v(t), this.#S(t);
    const e = this.#I(t, (s) => {
      s && X();
    });
    return e && Q(), e;
  }
  #v(t) {
    const { in_style: e } = t;
    if (!e) return;
    const s = g.getChInStyle(e);
    if (!s) throw `存在しないin_style【${e}】です`;
    this.#w = e, this.#H = s.join;
  }
  #w = "";
  #H = !0;
  get width() {
    return this.#h.getWidth;
  }
  get height() {
    return this.#h.getHeight;
  }
  #S(t) {
    const { out_style: e } = t;
    if (!e) return;
    if (!g.getChOutStyle(e)) throw `存在しないout_style【${e}】です`;
    this.#V = e;
  }
  #V = "";
  #O = new _();
  #I(t, e) {
    if ("back_clear" in t)
      return R(t, "back_clear", !1) && (this.#d = 0, this.#r = 0, this.#u = !1, this.#g = ""), e(!1), !1;
    this.#r = w(t, "b_alpha", this.#r), this.#u = R(t, "b_alpha_isfixed", this.#u);
    const s = (this.#u ? 1 : Number(x.#e.getVal("sys:TextLayer.Back.Alpha"))) * this.#r;
    if (t.b_pic) {
      if (this.#g !== t.b_pic)
        return this.#g = t.b_pic, this.#p && (this.ctn.removeChild(this.#p), this.#p.destroy()), this.#O = new _(this.#g, this.ctn, (i) => {
          this.#p = i, i.label = "back(pic)", i.visible = s > 0, i.alpha = s, this.#h.setMySize(i.width, i.height), this.ctn.setChildIndex(i, 0), e(!0);
        }), this.#O.ret;
    } else "b_color" in t && (this.#d = kt(t, "b_color", 0), this.#p && (this.ctn.removeChild(this.#p), this.#p.destroy()), this.#g = "", this.ctn.addChildAt(
      (this.#p = new H()).rect(0, 0, this.#h.getWidth, this.#h.getHeight).fill(this.#d).stroke(),
      0
    ), this.#p.label = "back(color)");
    return this.#p && (this.#p.visible = s > 0, this.#p.alpha = s), e(!1), !1;
  }
  chgBackAlpha(t) {
    const e = this.#u ? this.#r : t * this.#r;
    this.#p instanceof H && (this.#p && (this.ctn.removeChild(this.#p), this.#p.destroy()), this.ctn.addChildAt(
      (this.#p = new H()).rect(0, 0, this.#h.getWidth, this.#h.getHeight).fill(new U(this.#d)).stroke(),
      0
    ), this.#p.label = "back(color)"), this.#p && (this.#p.visible = e > 0, this.#p.alpha = e);
  }
  #J(t) {
    "noffs" in t && (this.#B = t.noffs ?? "", this.#b = new RegExp(`[　${this.#B}]`)), "ffs" in t && (this.#P ??= "", this.#T = this.#P === "" ? () => "" : (e) => this.#b.test(e) ? "" : ` font-feature-settings: ${this.#P};`);
  }
  #P = "";
  #T = (t) => "";
  #B = "";
  #b = /[　]/;
  // Safariが全体に「font-feature-settings」した後、特定文字の「font-feature-settings: initial;」を受け付けてくれないのでわざわざ一つずつ指定
  static chgDoRec(t) {
    x.#_ = t ? (e) => e : (e) => `<span class='offrec'>${e}</span>`;
  }
  static #_ = (t) => t;
  isCur = !1;
  #G = () => "";
  #x = (t, e, s, i = "") => {
    if (!s) return ` style='${i}'`;
    const n = t.length * 2;
    if (n - e.length < 0) return ` style='text-align: ${s}; ${i}'`;
    let a = "";
    switch (s) {
      case "justify":
        a = this.#G("0", n);
        break;
      case "121":
        a = this.#G(`calc(${(n - e.length) / (e.length * 2)}em)`, n);
        break;
      case "even":
        a = this.#G(`calc(${(n - e.length) / (e.length + 1)}em)`, n);
        break;
      case "1ruby":
        a = this.#G("1em", n);
        break;
      default:
        a = `text-align: ${s};`;
    }
    return ` style='${a} ${i}'`;
  };
  #k = "";
  #et(t, e, s, i = "") {
    if (!s) return ` style='${i}'`;
    const n = t.length * 2;
    if (n - e.length < 0) return ` style='text-align: ${s}; ${i}'`;
    let a = "";
    switch (s) {
      case "left":
        a = "ruby-align: start;";
        break;
      case "center":
        a = "ruby-align: center;";
        break;
      case "right":
        a = "ruby-align: start;";
        break;
      case "justify":
        a = "ruby-align: space-between;";
        break;
      case "121":
        a = "ruby-align: space-around;";
        break;
      case "even":
        const o = (n - e.length) / (e.length + 1);
        a = "ruby-align: space-between; " + (this.#h.tategaki ? `padding-top: ${o}em; padding-bottom: ${o}em;` : `padding-left: ${o}em; padding-right: ${o}em;`);
        break;
      case "1ruby":
        a = "ruby-align: space-between; " + (this.#h.tategaki ? "padding-top: 1em; padding-bottom: 1em;" : "padding-left: 1em; padding-right: 1em;");
        break;
      default:
        a = `text-align: ${s};`;
    }
    return ` style='${a} ${i}'`;
  }
  tagCh(t) {
    this.#W.putTxt(t);
  }
  #E = !1;
  #Z = (t, e) => {
    x.#i.oCfg.debug.putCh && console.log(`🖊 文字表示 text:\`${t}\`(${t.charCodeAt(0).toString(16)}) ruby:\`${e}\` name:\`${this.name_}\``);
    const s = e.split("｜");
    let i = "";
    const [n, ...a] = s, o = a.join("｜");
    switch (s.length) {
      case 1:
        if (this.#E = !0, t === `
`) {
          this.#D ? (this.#D = !1, i = "<ruby>&emsp;<rt>&emsp;</rt></ruby><br/>") : i = "<br/>";
          break;
        }
        this.#D && (this.#D = !1, e === "" && (e = "&emsp;")), i = this.#M(t, e, this.#k);
        break;
      default:
        switch (n) {
          // ルビ揃え指定と同時シリーズ
          case "start":
          // 初期値
          case "left":
          //（肩付き）先頭親文字から、ルビ間は密着
          case "center":
          //（中付き）センター合わせ、〃
          case "right":
          //（右／下揃え）末尾親文字から、〃
          case "justify":
          //（両端揃え）先頭から末尾親文字間に、ルビ間は均等にあける
          case "121":
          //（1-2-1(JIS)）ルビの前後を比率1、ルビ間を比率2であける
          case "even":
          //（均等アキ）ルビの前後、ルビ間も均等にあける
          case "1ruby":
            this.#D = !1, this.#E = !0, i = this.#M(t, o, n);
            break;
          case "gotxt":
            this.#C(), this.#E ? (this.isCur && x.#o.recText(
              this.#R.join("").replace(/^<ruby>&emsp;<rt>&emsp;<\/rt><\/ruby>(<br\/>)+/, "").replaceAll(/style='(anim\S+ \S+?;\s*)+/g, "style='").replaceAll(/( style=''| data-(add|arg|cmd)='.+?'|\n+|\t+)/g, "").replaceAll(/class='sn_ch .+?'/g, "class='sn_ch'").replaceAll("display: none;", "").replaceAll("class='offrec'", "style='display: none;'")
              // 囲んだ領域は履歴で非表示
            ), this.#h.goTxt(this.#R, this.#U === 0), this.#E = !1, this.#U = 0) : this.isCur && this.#h.noticeCompTxt();
            return;
          // breakではない
          case "add":
            {
              const r = JSON.parse(o), { style: c = "", wait: f = null } = r, { cl: l, sty: b } = this.#j(!0, f);
              this.#R.push(`<span${l} style='${b} display: inline; ${c}'>`), delete r.style, this.#L(r);
            }
            return;
          // breakではない
          case "add_close":
            this.#R.push("</span>"), this.#C();
            return;
          // breakではない
          case "grp":
            this.#E = !0;
            {
              const r = JSON.parse(o);
              if (r.id ??= this.#R.length, r.id === "break") {
                this.#h.dispBreak(r);
                return;
              }
              this.#D = !1, r.delay = this.#U, r.r ??= "", r.style ??= "", r.r_style ??= "";
              const { cl: c, sty: f, lnk: l } = this.#j(!0, r.wait);
              i = `<span${c} style='${f} ${r.style}'><ruby><span data-cmd='grp' data-arg='${JSON.stringify(r)}'${l} style='${f} display: inline;'>&emsp;</span><rt${l}${this.#x(
                "　",
                r.r,
                this.#k,
                this.#N.style.cssText + (this.#$.at(-1)?.o.r_style ?? "") + r.r_style
              )}>${r.r}</rt></ruby></span>`;
            }
            break;
          case "tcy":
            this.#D = !1, this.#E = !0;
            {
              const { t: r, r: c = "", wait: f = null, style: l = "", r_style: b = "" } = JSON.parse(o);
              x.#e.doRecLog() && (this.#X += t + (e ? `《${e}》` : ""), this.#K += r);
              const m = S.isSafari ? c.replaceAll(/[A-Za-z0-9]/g, (d) => String.fromCharCode(d.charCodeAt(0) + 65248)) : c, { cl: h, sty: u, lnk: y } = this.#j(!0, f);
              i = `<span${h} style='${u}${this.#T(r)} ${l}'><ruby><span${y} style='${u} display: inline; text-combine-upright: all;'>${r}</span><rt${y}${this.#x(
                r,
                m,
                this.#k,
                this.#N.style.cssText + (this.#$.at(-1)?.o.r_style ?? "") + b
              )}>${m}</rt></ruby></span>`;
            }
            break;
          case "del":
            g.delBreak();
            return;
          // breakではない
          case "span":
            this.#E = !0, this.#A(JSON.parse(o));
            return;
          // breakではない
          case "link":
            this.#E = !0;
            {
              const r = JSON.parse(o);
              r[":link"] = " data-lnk='@'";
              const { cl: c, sty: f, curpos: l } = this.#j(!1, r.wait);
              this.#R.push(`<span${c} style='${f} display: inline; ${r.style ?? ""}' ${l} data-arg='${o}'>`), delete r.style, this.#A(r);
            }
            return;
          // breakではない
          case "endlink":
            this.#E = !0, this.#R.push("</span>"), this.#C();
            return;
          // breakではない
          default:
            this.#E = !0, i = this.#M(t, e, this.#k);
        }
        break;
    }
    this.#R.push(x.#_(i));
  };
  #M(t, e, s) {
    const i = t === " " ? "&nbsp;" : t === "　" ? "&emsp;" : t;
    x.#e.doRecLog() && (this.#X += i + (e ? `《${e}》` : ""), t !== " " && (this.#K += t));
    const { cl: n, sty: a, lnk: o } = this.#j(!0, null, t);
    return e ? `<span${n} style='${a} ${this.#T(t)}'><ruby>${// 文字個別に出現させるため以下にも ${cl} が必要
    Array.from(t).map((r, c) => `<span${n}${o} style='${c > 0 ? this.#j(!0, null, t).sty : a} display: inline;'>${r === " " ? "&nbsp;" : r === "　" ? "&emsp;" : r}</span>`).join("")}<rt${o}${this.#x(
      t,
      e,
      s,
      this.#N.style.cssText + (this.#$.at(-1)?.o.r_style ?? "")
    )}>${e}</rt></ruby></span>` : `<span${n} style='${a} ${this.#T(t)}'${o}>${i}</span>`;
  }
  #j(t, e, s = `
`) {
    const i = this.#H ? e ?? this.#$.at(0)?.o.wait ?? (x.#c ? x.#s[s.at(0) ?? ""] ?? 0 : B.msecChWait) : 0;
    x.#f.isSkipping ? this.#U = 0 : t && this.#H && (this.#U += Number(i));
    const n = `data-add='{"ch_in_style":"${this.#w}", "ch_out_style":"${this.#V}"}'`;
    return {
      cl: ` class='sn_ch sn_ch_in_${this.#w}'`,
      // TxtStage.goTxt()はこれ単位で文字出現させる
      sty: `animation-delay: ${this.#U}ms;${this.#$.at(-1)?.o.style ?? ""}`,
      // TxtStage.goTxt()はこれ単位で文字出現させる
      lnk: (this.#$.at(0)?.o[":link"] ?? "") + " " + n,
      curpos: n
    };
  }
  #U = 0;
  #D = !0;
  #R = [];
  #$ = [];
  #L(t) {
    this.#$.push({
      o: t,
      r_align: this.#k,
      ch_in_style: this.#w,
      ch_out_style: this.#V
    }), "r_align" in t && (this.#k = t.r_align), this.#v(t), this.#S(t);
  }
  #C() {
    const t = this.#$.pop();
    t && (this.#k = t.r_align, this.#v({ in_style: t.ch_in_style }), this.#S({ out_style: t.ch_out_style }));
  }
  #A(t) {
    const e = this.#$.at(-1);
    if (!e) {
      this.#L(t);
      return;
    }
    e.o = { ...e.o, ...t }, !t.style && !t.r_style && (e.o.style = "", e.o.r_style = ""), "r_align" in t && (this.#k = t.r_align), this.#v(t), this.#S(t);
  }
  click = () => !this.ctn.interactiveChildren || !this.ctn.visible ? !1 : this.#h.skipChIn();
  clearText() {
    this.ctn.addChild(this.#h = this.#h.reNew()), this.#U = 0, this.#D = !0, this.#R = [], this.#X = "", this.#K = "", x.#o.recPagebreak();
  }
  #X = "";
  #K = "";
  get pageText() {
    return this.#X.replace("《&emsp;》", "");
  }
  get pagePlainText() {
    return this.#K;
  }
  get enabled() {
    return this.ctn.interactiveChildren;
  }
  set enabled(t) {
    this.ctn.interactiveChildren = t;
  }
  addButton = (t) => new Promise((e) => {
    t.key = `btn=[${this.#a.children.length}] ` + this.name_, t[":id_tag"] = t.key.slice(0, -7), R(t, "hint_tate", this.#h.tategaki);
    const s = new D(t, x.#f, () => e(), () => this.canFocus());
    s.label = JSON.stringify(t).replaceAll('"', "'"), this.#a.addChild(s);
  });
  canFocus() {
    return (this.ctn.interactiveChildren ?? !1) && this.ctn.visible && x.#n(this);
  }
  clearLay(t) {
    super.clearLay(t), this.clearText();
    for (const e of this.#a.removeChildren()) e.destroy();
  }
  record = () => ({
    ...super.record(),
    enabled: this.enabled,
    r_cssText: this.#N.style.cssText,
    r_align: this.#k,
    // バック
    b_do: this.#p === void 0 ? void 0 : this.#p instanceof O ? "Sprite" : "Graphics",
    b_pic: this.#g,
    b_color: this.#d,
    b_alpha: this.#r,
    b_alpha_isfixed: this.#u,
    ffs: this.#P,
    txs: this.#h.record(),
    strNoFFS: this.#B,
    btns: this.#a.children.map((t) => t.label)
  });
  playback(t, e) {
    super.playback(t, e), this.enabled = t.enabled, this.#N.style.cssText = t.r_cssText, this.#k = t.r_align, this.cvsResize(), this.#J(t), this.#h.playback(t.txs), this.#r = t.b_alpha, this.#u = t.b_alpha_isfixed, e = [
      e,
      new Promise((s) => {
        const i = t.b_do ? t.b_do === "Sprite" ? { b_pic: t.b_pic } : { b_color: t.b_color } : { b_pic: "" };
        i.b_alpha = t.b_alpha, i.b_alpha_isfixed = t.b_alpha_isfixed, this.#I(i, (n) => {
          n && s();
        }) || s();
      }),
      t.btns.map((s) => new Promise((i) => {
        this.addButton(JSON.parse(s.replaceAll("'", '"'))), i();
      }))
    ].flat();
  }
  get cssText() {
    return this.#h.cssText;
  }
  set cssText(t) {
    this.#h.cssText = t;
  }
  snapshot(t, e) {
    t.render({ container: this.ctn, clear: !1 }), this.#h.snapshot(t, e);
  }
  snapshot_end() {
    this.#h.snapshot_end();
  }
  makeDesignCast(t) {
    this.ctn.visible && this.#h.makeDesignCast(t);
  }
  makeDesignCastChildren(t) {
    if (this.ctn.visible)
      for (const e of this.#a.children) e.makeDesignCast(t);
  }
  showDesignCast() {
    this.#h.showDesignCast();
  }
  showDesignCastChildren() {
    for (const t of this.#a.children) t.showDesignCast();
  }
  dump() {
    return this.#Z("", "gotxt｜"), super.dump() + `, "enabled":"${this.enabled}", ${this.#h.dump()}, "b_pic":"${this.#g}", "b_color":"${this.#d}", "b_alpha":${this.#r}, "b_alpha_isfixed":"${this.#u}", "width":${this.#h.getWidth}, "height":${this.#h.getHeight}, "pixi_obj":[${this.ctn.children.map((t) => `{"class":"${t instanceof O ? "Sprite" : t instanceof H ? "Graphics" : t instanceof j ? "Container" : "?"}", "label":"${t.label}", "alpha":${t.alpha}, "x":${t.x}, "y":${t.y}, "visible":"${t.visible}"}`).join(",")}], "button":[${this.#a.children.map((t) => t.children[0]?.label ?? "{}").join(",")}]`;
  }
}
class N {
  constructor(t, e, s) {
    this.appPixi = e, this.val = s, t.add_frame = (i) => this.#f(i), t.let_frame = (i) => this.#r(i), t.set_frame = (i) => this.#u(i), t.frame = (i) => this.#g(i), t.tsy_frame = (i) => this.#h(i), N.rnd = e.renderer;
  }
  static #i;
  static #e;
  static #n;
  static init(t, e, s) {
    N.#i = t, N.#e = e, N.#n = s;
  }
  #o;
  setEvtMng(t) {
    this.#o = t;
  }
  #t = /* @__PURE__ */ Object.create(null);
  destroy() {
    for (const t of Object.values(this.#t)) t.parentElement.removeChild(t);
    this.#t = /* @__PURE__ */ Object.create(null);
  }
  hideAllFrame() {
    for (const [t, { style: e }] of Object.entries(this.#t))
      this.#l[t] = e.display !== "none", e.display = "none";
  }
  #l = /* @__PURE__ */ Object.create(null);
  restoreAllFrame() {
    for (const [t, e] of Object.entries(this.#l)) {
      const s = this.#t[t];
      s && (s.style.display = e ? "inline" : "none");
    }
    this.#l = /* @__PURE__ */ Object.create(null);
  }
  //	HTMLフレーム
  // フレーム追加
  #f(t) {
    const { id: e, src: s, alpha: i = 1, scale_x: n = 1, scale_y: a = 1, rotate: o = 0 } = t;
    if (!e) throw "idは必須です";
    if (!s) throw "srcは必須です";
    const r = "const.sn.frm." + e;
    if (this.val.getVal(`tmp:${r}`)) throw `frame【${e}】はすでにあります`;
    const c = R(t, "visible", !0), f = t.b_color ? ` background-color: ${t.b_color};` : "", l = this.#c(t);
    N.#n.cvs.insertAdjacentHTML("beforebegin", `<iframe id="${e}" style="opacity: ${i}; ${f} position: absolute; left:${N.#e.ofsLeft4elm + l.x * N.#e.cvsScale}px; top: ${N.#e.ofsTop4elm + l.y * N.#e.cvsScale}px; z-index: 1; border: 0px; overflow: hidden; display: ${c ? "inline" : "none"}; transform: scale(${n}, ${a}) rotate(${o}deg);" width="${l.width * N.#e.cvsScale}" height="${l.height * N.#e.cvsScale}"></iframe>`), Q();
    const b = N.#i.searchPath(s, M.HTML);
    return q.load({ src: b }).then(async (m) => {
      const h = document.getElementById(e);
      this.#t[e] = h, this.#y[e] = !1;
      const u = b.lastIndexOf("/") + 1, y = b.slice(0, u), d = y.slice(0, u);
      h.srcdoc = String(m).replace("sn_repRes();", "").replaceAll(
        /\s(?:src|href)=(["'])(\S+?)\1/g,
        // 【\s】が大事、data-src弾く
        (p, v, $) => $.startsWith("../") ? p.replace("../", d) : p.replace("./", "").replace(v, v + y)
      ), h.srcdoc.includes("true/*WEBP*/;") && (h.srcdoc = h.srcdoc.replaceAll(
        /data-src="(.+?\.)(?:jpe?g|png)/g,
        (p, v) => `data-src="${v}webp`
      )), h.onload = () => {
        this.val.setVal_Nochk("tmp", r, !0), this.val.setVal_Nochk("tmp", r + ".alpha", i), this.val.setVal_Nochk("tmp", r + ".x", l.x), this.val.setVal_Nochk("tmp", r + ".y", l.y), this.val.setVal_Nochk("tmp", r + ".scale_x", n), this.val.setVal_Nochk("tmp", r + ".scale_y", a), this.val.setVal_Nochk("tmp", r + ".rotate", o), this.val.setVal_Nochk("tmp", r + ".width", l.width), this.val.setVal_Nochk("tmp", r + ".height", l.height), this.val.setVal_Nochk("tmp", r + ".visible", c);
        const p = h.contentWindow;
        this.#o.resvFlameEvent(p), p.sn_repRes?.((v) => N.#s(v.dataset.src ?? "", v)), X();
      };
    }), !0;
  }
  #y = {};
  getFrmDisabled(t) {
    return this.#y[t];
  }
  #c(t) {
    const e = { ...t }, s = N.#e.resolution;
    return new DOMRect(
      w(e, "x", 0) * s,
      w(e, "y", 0) * s,
      w(e, "width", S.stageW) * s,
      w(e, "height", S.stageH) * s
    );
  }
  static #s(t, e, s) {
    const i = this.#d[t];
    if (i) {
      e.src = i, s && (e.onload = () => s(e));
      return;
    }
    const n = this.#m[t];
    if (n) {
      n.push(e);
      return;
    }
    this.#m[t] = [e];
    const [a = "", o = ""] = t.split("?"), r = N.#i.searchPath(a, M.SP_GSM);
    q.load({ alias: t, src: r }).then(async (c) => {
      const f = await this.rnd.extract.base64(c), l = this.#d[t] = f + (o === "" || f.startsWith("blob:") || f.startsWith("data:") ? "" : "?" + o);
      for (const b of this.#m[t])
        b.src = l, s && (b.onload = () => s(b));
      delete this.#m[t];
    });
  }
  static rnd;
  static #m = {};
  static #d = {};
  cvsResize() {
    for (const [t, e] of Object.entries(this.#t)) {
      const s = "const.sn.frm." + t, i = Number(this.val.getVal(s + ".x")), n = Number(this.val.getVal(s + ".y")), a = Number(this.val.getVal(s + ".width")), o = Number(this.val.getVal(s + ".height"));
      e.style.left = `${N.#e.ofsLeft4elm + i * N.#e.cvsScale}px`, e.style.top = `${N.#e.ofsTop4elm + n * N.#e.cvsScale}px`, e.width = String(a * N.#e.cvsScale), e.height = String(o * N.#e.cvsScale);
    }
  }
  // フレーム変数を取得
  #r(t) {
    const { id: e, var_name: s } = t;
    if (!e) throw "idは必須です";
    const i = document.getElementById(e);
    if (!i) throw `id【${e}】はフレームではありません`;
    const n = "const.sn.frm." + e;
    if (!this.val.getVal(`tmp:${n}`)) throw `frame【${e}】が読み込まれていません`;
    if (!s) throw "var_nameは必須です";
    const a = i.contentWindow;
    if (!a.hasOwnProperty(s)) throw `frame【${e}】に変数/関数【${s}】がありません。変数は var付きにして下さい`;
    const o = a[s];
    return this.val.setVal_Nochk(
      "tmp",
      n + "." + s,
      R(t, "function", !1) ? o() : o
    ), !1;
  }
  // フレーム変数に設定
  #u(t) {
    const { id: e, var_name: s, text: i } = t;
    if (!e) throw "idは必須です";
    const n = document.getElementById(e);
    if (!n) throw `id【${e}】はフレームではありません`;
    const a = "const.sn.frm." + e;
    if (!this.val.getVal(`tmp:${a}`)) throw `frame【${e}】が読み込まれていません`;
    if (!s) throw "var_nameは必須です";
    if (!i) throw "textは必須です";
    this.val.setVal_Nochk("tmp", a + "." + s, i);
    const o = n.contentWindow;
    return o[s] = i, !1;
  }
  // フレームに設定
  #p = 1;
  #g(t) {
    const { id: e } = t;
    if (!e) throw "idは必須です";
    const s = document.getElementById(e);
    if (!s) throw `id【${e}】はフレームではありません`;
    const i = "const.sn.frm." + e;
    if (!this.val.getVal("tmp:" + i)) throw `frame【${e}】が読み込まれていません`;
    const n = s.style;
    if (R(t, "float", !1) ? n.zIndex = `${++this.#p}` : "index" in t ? n.zIndex = `${w(t, "index", 0)}` : t.dive && (n.zIndex = `-${++this.#p}`), "alpha" in t) {
      const o = n.opacity = String(t.alpha);
      this.val.setVal_Nochk("tmp", i + ".alpha", o);
    }
    const a = this.#c(t);
    if (("x" in t || "y" in t) && (n.left = `${N.#e.ofsLeft4elm + a.x * N.#e.cvsScale}px`, n.top = `${N.#e.ofsTop4elm + a.y * N.#e.cvsScale}px`, this.val.setVal_Nochk("tmp", i + ".x", a.x), this.val.setVal_Nochk("tmp", i + ".y", a.y)), "scale_x" in t || "scale_y" in t || "rotate" in t) {
      const o = w(t, "scale_x", 1), r = w(t, "scale_y", 1), c = w(t, "rotate", 0);
      n.transform = `scale(${o}, ${r}) rotate(${c}deg)`, this.val.setVal_Nochk("tmp", i + ".scale_x", o), this.val.setVal_Nochk("tmp", i + ".scale_y", r), this.val.setVal_Nochk("tmp", i + ".rotate", c);
    }
    if ("width" in t && (s.width = String(a.width * N.#e.cvsScale), this.val.setVal_Nochk("tmp", i + ".width", a.width)), "height" in t && (s.height = String(a.height * N.#e.cvsScale), this.val.setVal_Nochk("tmp", i + ".height", a.height)), "visible" in t) {
      const o = R(t, "visible", !0);
      n.display = o ? "inline" : "none", this.val.setVal_Nochk("tmp", i + ".visible", o);
    }
    if ("b_color" in t && (n.backgroundColor = t.b_color), "disabled" in t) {
      const o = this.#y[e] = R(t, "disabled", !0), r = s.contentDocument.body;
      for (const c of [
        ...Array.from(r.getElementsByTagName("input")),
        ...Array.from(r.getElementsByTagName("select"))
      ]) c.disabled = o;
    }
    return !1;
  }
  // フレームをトゥイーン開始
  #h(t) {
    const { id: e, alpha: s, x: i, y: n, scale_x: a, scale_y: o, rotate: r, width: c, height: f } = t;
    if (!e) throw "idは必須です";
    const l = document.getElementById(e);
    if (!l) throw `id【${e}】はフレームではありません`;
    const b = "const.sn.frm." + e;
    if (!this.val.getVal(`tmp:${b}`, 0)) throw `frame【${e}】が読み込まれていません`;
    const m = {};
    s && (m.a = l.style.opacity), (i || n || a || o || r) && (m.x = Number(this.val.getVal(`tmp:${b}.x`)), m.y = Number(this.val.getVal(`tmp:${b}.y`)), m.sx = Number(this.val.getVal(`tmp:${b}.scale_x`)), m.sy = Number(this.val.getVal(`tmp:${b}.scale_y`)), m.r = Number(this.val.getVal(`tmp:${b}.rotate`))), c && (m.w = this.val.getVal(`tmp:${b}.width`)), f && (m.h = this.val.getVal(`tmp:${b}.height`));
    const h = E.cnvTweenArg(t, m);
    let u = () => {
    };
    s && (w(h, "alpha", 0), u = () => {
      l.style.opacity = m.a, this.val.setVal_Nochk("tmp", "alpha", m.a);
    });
    let y = () => {
    };
    const d = this.#c(h);
    (i || n || a || o || r) && (d.x, d.y, w(h, "scale_x", 1), w(h, "scale_y", 1), w(h, "rotate", 0), y = () => {
      l.style.left = N.#e.ofsLeft4elm + m.x * N.#e.cvsScale + "px", l.style.top = N.#e.ofsTop4elm + m.y * N.#e.cvsScale + "px", l.style.transform = `scale(${m.sx}, ${m.sy}) rotate(${m.r}deg)`, this.val.setVal_Nochk("tmp", b + ".x", m.x), this.val.setVal_Nochk("tmp", b + ".y", m.y), this.val.setVal_Nochk("tmp", b + ".scale_x", m.sx), this.val.setVal_Nochk("tmp", b + ".scale_y", m.sy), this.val.setVal_Nochk("tmp", b + ".rotate", m.r);
    });
    let p = () => {
    };
    c && (d.width, p = () => {
      l.width = m.w * N.#e.cvsScale + "px", this.val.setVal_Nochk("tmp", b + ".width", m.w);
    });
    let v = () => {
    };
    return f && (d.height, v = () => {
      l.height = m.h * N.#e.cvsScale + "px", this.val.setVal_Nochk("tmp", b + ".height", m.h);
    }), this.appPixi.stage.interactive = !1, E.tween(`frm
${e}`, t, m, E.cnvTweenArg(t, m), () => {
      u(), y(), p(), v();
    }, () => this.appPixi.stage.interactive = !0, () => {
    }), !1;
  }
}
class B {
  //MARK: コンストラクタ
  constructor(t, e, s, i, n, a, o, r, c) {
    this.cfg = t, this.hTag = e, this.appPixi = s, this.val = i, this.main = n, this.scrItr = a, this.sys = o, this.sndMng = r, this.prpPrs = c;
    const f = () => {
      if (o.cvsResize(), this.cvsResizeDesign(), this.#c) for (const h of this.#v)
        this.#a[h].fore.cvsResizeChildren();
      else for (const h of this.#v)
        this.#a[h].fore.cvsResize();
      this.#o.cvsResize(), this.#d.cvsResize();
    };
    if (S.isMobile)
      this.#l.add(globalThis, "orientationchange", f, { passive: !0 });
    else {
      let h;
      this.#l.add(globalThis, "resize", () => {
        h || (h = setTimeout(() => {
          h = void 0, f();
        }, 1e3 / 60 * 10));
      }, { passive: !0 });
    }
    o.cvsResize(), x.init(t, e, i, this, (h) => this.#a[h.layname].fore === h, s), z.init(n, t, s, o, r, i), N.init(t, o, n), D.init(t), this.#o = new N(e, s, i), o.hFactoryCls.grp = () => new z(), o.hFactoryCls.txt = () => new x(), e.loadplugin = (h) => this.#N(h), e.snapshot = (h) => this.#p(h), this.#g = this.sys.isApp ? this.#h : this.#W, e.add_lay = (h) => this.#z(h), e.clear_lay = (h) => this.#O(h), e.finish_trans = () => E.finish_trans(), e.lay = (h) => this.#S(h), e.trans = (h) => this.#G(h), e.wt = (h) => E.wt(h), e.quake = (h) => this.#E(h), e.stop_quake = e.finish_trans, e.wq = (h) => e.wt(h), e.pause_tsy = (h) => E.pause_tsy(h), e.resume_tsy = (h) => E.resume_tsy(h), e.stop_tsy = (h) => E.stop_tsy(h), e.tsy = (h) => this.#Z(h), e.wait_tsy = (h) => E.wait_tsy(h), e.add_filter = (h) => this.#M(h), e.clear_filter = (h) => this.#U(h), e.enable_filter = (h) => this.#D(h), e.ch = (h) => this.#L(h), e.clear_text = (h) => this.#it(h), e.current = (h) => this.#X(h), e.endlink = (h) => this.#nt(h), e.er = (h) => this.#at(h), e.graph = (h) => this.#ot(h), e.link = (h) => this.#rt(h), e.r = (h) => this.#ht(h), e.rec_ch = (h) => this.#st(h), e.rec_r = (h) => this.#lt(h), e.reset_rec = (h) => this.#ct(h), e.ruby2 = (h) => this.#dt(h), e.span = (h) => this.#ft(h), e.tcy = (h) => this.#ut(h), e.add_face = (h) => _.add_face(h), e.wv = (h) => _.wv(h), e.dump_lay = (h) => this.#pt(h), e.enable_event = (h) => this.#mt(h), e.button = (h) => this.#yt(h), t.existsBreakline && (this.breakLine = (h) => {
      delete h.visible, h.id = "break", h.pic = "breakline";
      const u = encodeURIComponent(JSON.stringify(h));
      this.#u("grp｜" + u);
    }), t.existsBreakpage && (this.breakPage = (h) => {
      delete h.visible, h.id = "break", h.pic = "breakpage";
      const u = encodeURIComponent(JSON.stringify(h));
      this.#u("grp｜" + u);
    }), this.#t = new U(t.oCfg.init.bg_color).toNumber();
    const l = new H();
    l.rect(0, 0, S.stageW, S.stageH).fill(new U(this.#t)).stroke({ width: 1, color: this.#t }), this.#e.addChild(l.clone()), this.#n.addChild(l), this.#n.visible = !1, this.#e.label = "page:A", this.#n.label = "page:B", this.#i = s.stage, this.#i.addChild(this.#n), this.#i.addChild(this.#e), this.#i.addChild(this.#B), this.#i.addChild(this.#_), this.#i.label = "stage";
    const b = (h, u) => {
      this.#r(Number(u));
    };
    b("", i.getVal("sys:TextLayer.Back.Alpha", 1)), i.defValTrg("sys:TextLayer.Back.Alpha", b);
    const m = (h, u) => D.fontFamily = u;
    m("", i.getVal("tmp:sn.button.fontFamily", D.fontFamily)), i.defValTrg("tmp:sn.button.fontFamily", m), i.defTmp("const.sn.log.json", () => JSON.stringify(
      (this.#F.text = this.#F.text?.replaceAll("</span><span class='sn_ch'>", "") ?? "") ? [...this.#Y, this.#F] : this.#Y
    )), i.defTmp("const.sn.last_page_text", () => this.currentTxtlayFore?.pageText ?? ""), i.defTmp("const.sn.last_page_plain_text", () => this.currentTxtlayFore?.pagePlainText ?? ""), S.isDbg && (ut.init(s, o, a, c, t, this.#a), this.cvsResizeDesign = () => ut.cvsResizeDesign(), o.addHook((h, u) => {
      this.#f[h]?.(h, u) && delete this.#f[h];
    }));
  }
  #i;
  #e = new j();
  #n = new j();
  #o;
  #t;
  #l = new gt();
  cvsResizeDesign() {
  }
  #f = {
    attach: (t) => !1,
    continue: (t) => !1,
    disconnect: (t) => !1,
    _enterDesign: (t) => {
      for (const e of this.#v) {
        const s = this.#a[e].fore;
        s.makeDesignCastChildren((i) => i.make()), s.makeDesignCast((i) => i.make());
      }
      return this.#s(this.#w), !1;
    },
    _replaceToken: (t, e) => !1,
    _selectNode: (t, e) => (this.#s(e.node), !1)
  };
  #y = "";
  #c = "";
  #s(t) {
    [this.#y = "", this.#c = ""] = t.split("/");
    const e = this.#a[this.#y];
    e && (this.#c ? e.fore.showDesignCastChildren() : e.fore.showDesignCast());
  }
  getFrmDisabled = (t) => this.#o.getFrmDisabled(t);
  #m = void 0;
  cover(t, e = 0) {
    this.#m && (this.#i.removeChild(this.#m), this.#m.destroy(), this.#m = void 0), t && this.#i.addChild(
      (this.#m = new H()).rect(0, 0, S.stageW, S.stageH).fill(new U(e)).stroke({ width: 0, color: e })
    );
  }
  #d;
  setEvtMng(t) {
    this.#d = t, this.#o.setEvtMng(t), _.setEvtMng(t), E.init(t, this.appPixi);
  }
  destroy() {
    for (const t of Object.values(this.#a)) t.destroy();
    this.#l.clear(), z.destroy(), ft.destroy(), g.destroy(), x.destroy(), this.#o.destroy(), E.destroy(), B.#$ = 10;
  }
  // 既存の全文字レイヤの実際のバック不透明度、を再計算
  #r(t) {
    for (const e of this.#x()) {
      const s = this.#a[e];
      s.fore instanceof x && (s.fore.chgBackAlpha(t), s.back.chgBackAlpha(t));
    }
  }
  #u = (t, e = this.currentTxtlayForeNeedErr, s = !0) => e.tagCh("｜&emsp;《" + t + "》");
  goTxt = () => {
  };
  breakLine = (t) => {
  };
  breakPage = (t) => {
  };
  clearBreak() {
    this.currentTxtlayFore && (this.clearBreak = () => this.#u("del｜break"), this.clearBreak());
  }
  clickTxtLay() {
    return this.currentTxtlayFore ? this.#x().some((t) => {
      const e = this.#a[t].fore;
      return e instanceof x && e.click();
    }) : !1;
  }
  //	//	システム
  //MARK: スナップショット
  #p(t) {
    const e = t.fn ? t.fn.startsWith(Bt) ? t.fn : `${bt + t.fn + _t("-", "_", "", "_")}.png` : `${bt}snapshot${_t("-", "_", "", "_")}.png`, s = this.cfg.searchPath(e), i = w(t, "width", S.stageW), n = w(t, "height", S.stageH);
    return this.#g(t, s, i, n);
  }
  #g = () => !1;
  #h(t, e, s, i) {
    if (this.#o.hideAllFrame(), Q(), !("layer" in t))
      return this.sys.capturePage(e, s, i, () => {
        this.#o.restoreAllFrame(), X();
      }), !0;
    const n = {};
    for (const a of this.#x()) {
      const o = this.#a[a].fore.ctn;
      n[a] = o.visible, o.visible = !1;
    }
    for (const a of this.#x(t.layer)) this.#a[a].fore.ctn.visible = !0;
    return this.sys.capturePage(e, s, i, () => {
      for (const [a, o] of Object.entries(n))
        this.#a[a].fore.ctn.visible = o;
      this.#o.restoreAllFrame(), X();
    }), !0;
  }
  #W(t, e, s, i) {
    Q();
    const n = kt(t, "b_color", this.#t);
    return jt({
      width: s,
      height: i,
      backgroundAlpha: n > 16777216 && e.endsWith(".png") ? 0 : 1,
      antialias: R(t, "smoothing", !1),
      preserveDrawingBuffer: !0,
      backgroundColor: n & 16777215,
      autoDensity: !0
    }).then(async (a) => {
      const o = t.page !== "back" ? "fore" : "back";
      await Promise.allSettled(
        this.#x(t.layer).map((c) => new Promise(
          (f) => this.#a[c][o].snapshot(a, f)
        ))
      );
      const r = A.create({ width: a.width, height: a.height });
      a.render({ container: this.#i, target: r }), await this.sys.savePic(
        e,
        await a.extract.base64(r)
      ), r.destroy();
      for (const c of this.#x(t.layer)) this.#a[c][o].snapshot_end();
      a.destroy(!0), X();
    }), !0;
  }
  //MARK: プラグインの読み込み
  #N(t) {
    const { fn: e } = t;
    if (!e) throw "fnは必須です";
    const s = R(t, "join", !0);
    if (s && Q(), e.endsWith(".css"))
      (async () => {
        const i = await fetch(e);
        if (!i.ok) throw new Error("Network response was not ok.");
        rt(await i.text()), s && X();
      })();
    else throw "サポートされない拡張子です";
    return s;
  }
  //	//	レイヤ共通
  //MARK: レイヤを追加する
  #z(t) {
    const { layer: e, class: s } = t;
    if (!e) throw "layerは必須です";
    if (e.includes(",")) throw "layer名に「,」は使えません";
    if (e in this.#a) throw `layer【${e}】はすでにあります`;
    if (!s) throw "clsは必須です";
    const i = { isWait: !1 };
    switch (this.#a[e] = new tt(e, s, this.#e, this.#n, t, this.sys, this.val, i), this.#v.push(e), s) {
      case "txt":
        this.#w || (this.#tt = () => {
        }, this.#C = this.#A, this.#X = this.#K, this.hTag.current({ layer: e }), this.goTxt = () => {
          this.#d.isSkipping ? B.#$ = 0 : this.setNormalChWait();
          for (const n of this.#x()) {
            const a = this.#a[n].fore;
            a instanceof x && this.#u("gotxt｜", a, !1);
          }
        }), this.val.setVal_Nochk(
          "save",
          "const.sn.layer." + (e ?? this.#w) + ".enabled",
          !0
        );
        break;
      case "grp":
        if (this.#H) break;
        this.#H = e;
        break;
    }
    return this.scrItr.recodeDesign(t), i.isWait;
  }
  #a = {};
  // しおりLoad時再読込
  #v = [];
  // 最適化用
  #w = "";
  #H = "";
  #S(t) {
    const e = this.#q(t), s = this.#a[e], i = s.back.ctn, n = s.fore.ctn;
    if (R(t, "float", !1))
      this.#n.setChildIndex(i, this.#n.children.length - 1), this.#e.setChildIndex(n, this.#e.children.length - 1), this.#V();
    else if (t.index)
      w(t, "index", 0) && (this.#n.setChildIndex(i, t.index), this.#e.setChildIndex(n, t.index), this.#V());
    else if (t.dive) {
      const { dive: a } = t;
      let o = 0;
      if (e === a) throw "[lay] 属性 layerとdiveが同じ【" + a + "】です";
      const r = this.#a[a];
      if (!r) throw "[lay] 属性 dive【" + a + "】が不正です。レイヤーがありません";
      const c = r.back, f = r.fore, l = this.#n.getChildIndex(c.ctn), b = this.#e.getChildIndex(f.ctn);
      o = l < b ? l : b, o > this.#n.getChildIndex(i) && --o, this.#e.setChildIndex(n, o), this.#n.setChildIndex(i, o), this.#V();
    }
    return t[":id_tag"] = s.fore.name.slice(0, -7), this.scrItr.recodeDesign(t), s.lay(t);
  }
  #V() {
    this.#v = this.#et();
  }
  //MARK: レイヤ設定の消去
  #O(t) {
    return this.#k(t, (e) => {
      const s = this.#a[this.#q({ layer: e })];
      if (t.page === "both") {
        s.fore.clearLay(t), s.back.clearLay(t);
        return;
      }
      s.getPage(t).clearLay(t);
    }), !1;
  }
  //===================================================
  //MARK: WebGL 頂点シェーダー GLSL
  // It's easier to see with VSCode extension 'GLSL with Imports'
  // #version は入れない
  static #I = (
    /* glsl */
    `
precision mediump float;

in vec2 aPosition;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

out vec2 vTextureCoord;

vec4 filterVertexPosition() {
	vec2 p = aPosition * uOutputFrame.zw + uOutputFrame.xy;
	p.x = p.x * (2.0 / uOutputTexture.x) - 1.0;
	p.y = p.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

	return vec4(p, 0.0, 1.0);
}

vec2 filterTextureCoord() {
	return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main() {
	gl_Position = filterVertexPosition();
	vTextureCoord = filterTextureCoord();
}`
  );
  //===================================================
  //MARK: WebGL フラグメントシェーダー GLSL
  static #J = (
    /* glsl */
    `
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform sampler2D rule;
uniform float vague;
uniform float tick;

out vec4 finalColor;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
vec2 getUV(vec2 coord) {
	return coord * uInputSize.xy / uOutputFrame.zw;
}

void main() {
	vec4 fg = texture(uTexture, vTextureCoord);
	vec4 ru = texture(rule, getUV(vTextureCoord));

	float v = ru.r - tick;
	finalColor = abs(v) < vague
		? vec4(fg.rgb, 1) *fg.a *(0.5 +v /vague *0.5)
		: 0.0 <= v ? fg : vec4(0);
}`
  );
  /*
  	末尾が読みづらいが、以下のif文を消して三項演算子にしている。
  
  	if (abs(v) < vague) {
  		float f_a = fg.a *(0.5 +v /vague *0.5);
  		gl_FragColor.rgb = fg.rgb *f_a;
  		gl_FragColor.a = f_a;
  		return;
  	}
  	gl_FragColor = v >= 0.0 ? fg : vec4(0);
  
  		★GLSL : don't use "if"｜Nobu https://note.com/nobuhirosaijo/n/n606a3f5d8e89
  			> if文はあまり使わない方がいいらしい (処理負荷が高い)
  */
  //===================================================
  //MARK: WebGPU 頂点シェーダー + フラグメントシェーダー WGSL
  //	TODO: 開発中、動作しない
  static #P = (
    /* wgsl */
    `
struct GlobalUniforms {
	uProjectionMatrix		: mat3x3<f32>,
	uWorldTransformMatrix	: mat3x3<f32>,
	uWorldColorAlpha		: vec4<f32>,
	uResolution				: vec2<f32>,
}
struct LocalUniforms {
	uTransformMatrix	: mat3x3<f32>,
	uColor	: vec4<f32>,
	uRound	: f32,
}
@group(0) @binding(0) var<uniform> globalUniforms	: GlobalUniforms;
@group(1) @binding(0) var<uniform> localUniforms	: LocalUniforms;

struct VertexOutput {
	@builtin(position) aPosition: vec4<f32>,
};


@vertex
fn mainVert(
	@location(0) aPosition: vec2<f32>
) -> @builtin(position) vec4<f32> {
	return vec4f(aPosition, 0, 1);
}


@fragment
fn mainFrag(in: VertexOutput) -> @location(0) vec4<f32> {
	return vec4<f32>(1.0, 0.0, 1.0, 0.0);
}`
  );
  // "The Book of Shaders" を WGSL で学んでいく https://zenn.dev/etoal83/scraps/e65b902568ecb3
  // Instanced Geometry | PixiJS https://pixijs.com/8.x/examples/mesh-and-shaders/instanced-geometry
  /*
  struct VertexOutput {
  	@builtin(position)	position: vec4<f32>,
  	@location(0)		texCoord: vec2<f32>,
  }
  
  @vertex
  fn mainVert(
  	@location(0) aPosition	: vec2<f32>,
  ) -> VertexOutput {
  	var mvp = globalUniforms.uProjectionMatrix 
  		* globalUniforms.uWorldTransformMatrix 
  		* localUniforms.uTransformMatrix;
  
  	var out : VertexOutput;
  	out.texCoord.x = aPosition.x * 0.5;
  	out.texCoord.y = aPosition.y * 0.5;
  	out.position = vec4<f32>(mvp * vec3<f32>(aPosition, 1.0), 1.0);
  
  //	out.position = vec4<f32>(x - 1.0, y - 1.0, 0, 1);
  	return out;
  }
  
  
  struct TimeUniforms {
  	vague	: f32,
  	tick	: f32,
  }
  
  @group(2) @binding(1) var rule	: texture_2d<f32>;
  @group(2) @binding(2) var smRule	: sampler;
  @group(2) @binding(3) var<uniform> timeUniforms	: TimeUniforms;
  
  struct FragmentInput {
  	@location(0) vTextureCoord: vec2<f32>,
  }
  
  @fragment
  fn mainFrag(inp: FragmentInput) -> @location(0) vec4<f32> {
  	return textureSample(rule, smRule, inp.vTextureCoord);
  
  //	return textureSample(rule, smRule, vTextureCoord + sin( (timeUniforms.tick + (vTextureCoord.x) * 14.) ) * 0.1);
  }
  */
  /*
  struct GlobalUniforms {
  	uProjectionMatrix		: mat3x3<f32>,
  	uWorldTransformMatrix	: mat3x3<f32>,
  	uWorldColorAlpha		: vec4<f32>,
  	uResolution				: vec2<f32>,
  }
  struct LocalUniforms {
  	uTransformMatrix	: mat3x3<f32>,
  	uColor	: vec4<f32>,
  	uRound	: f32,
  }
  
  @group(0) @binding(0) var<uniform> globalUniforms	: GlobalUniforms;
  @group(1) @binding(0) var<uniform> localUniforms	: LocalUniforms;
  
  @vertex
  fn mainVert(
  	@location(0) aPosition	: vec2<f32>,
  ) -> @builtin(position) vec4<f32> {
  	var mvp = globalUniforms.uProjectionMatrix 
  		* globalUniforms.uWorldTransformMatrix 
  		* localUniforms.uTransformMatrix;
  
  	return vec4<f32>(mvp * vec3<f32>(aPosition, 1.0), 1.0);
  }
  
  
  struct TimeUniforms {
  	vague	: f32,
  	tick	: f32,
  }
  
  @group(2) @binding(1) var rule	: texture_2d<f32>;
  @group(2) @binding(2) var smRule	: sampler;
  @group(2) @binding(3) var<uniform> timeUniforms	: TimeUniforms;
  
  @fragment
  fn mainFrag(
  	@location(0) vUV: vec2<f32>,
  ) -> @location(0) vec4<f32> {
  	return textureSample(rule, smRule, vUV + sin( (timeUniforms.tick + (vUV.x) * 14.) ) * 0.1);
  */
  //===================================================
  #T = A.create({
    width: S.stageW,
    height: S.stageH
  });
  #B = new O(this.#T);
  #b = A.create({
    width: S.stageW,
    height: S.stageH
  });
  #_ = new O(this.#b);
  //MARK: ページ裏表を交換
  #G(t) {
    E.finish_trans(), this.#d.hideHint();
    const { layer: e } = t, s = /* @__PURE__ */ new Set(), i = [];
    for (const k of this.#x(e))
      s.add(k), i.push(this.#a[k].fore);
    const n = async () => {
      [this.#e, this.#n] = [this.#n, this.#e];
      const k = [];
      for (const [T, V] of Object.entries(this.#a)) {
        if (s.has(T)) {
          V.transPage(k);
          continue;
        }
        const { fore: { ctn: Y }, back: { ctn: Z } } = V, L = this.#e.getChildIndex(Z);
        this.#e.removeChild(Z), this.#n.removeChild(Y), this.#e.addChildAt(Y, L), this.#n.addChildAt(Z, L);
      }
      await Promise.allSettled(k), this.#e.visible = !0, this.#n.visible = !1, this.#B.visible = !1, this.#_.visible = !1;
    };
    if (this.#_.filters = [], this.#_.alpha = 1, w(t, "time", 0) === 0 || this.#d.isSkipping)
      return n(), !1;
    let o = [];
    const r = [];
    for (const k of this.#x()) {
      const T = this.#a[k][s.has(k) ? "back" : "fore"];
      T.ctn.visible && o.push(T.ctn), r.push(T);
    }
    const { ticker: c, renderer: f } = this.appPixi;
    f.render({ container: this.#n, target: this.#T });
    let l = () => {
      for (const k of o) f.render({
        container: k,
        target: this.#T,
        clear: !1
      });
    };
    if (!r.some((k) => k.containMovement)) {
      const k = l;
      l = () => {
        l = () => {
        }, k();
      };
    }
    const b = () => f.render({ container: this.#e, target: this.#b });
    b();
    let m = () => {
      this.#e.visible = !0, b(), this.#e.visible = !1;
    };
    if (!i.some((k) => k.containMovement)) {
      const k = m;
      m = () => {
        m = () => {
        }, k();
      };
    }
    const h = () => {
      l(), this.#B.visible = !0, m(), this.#_.visible = !0;
    }, { rule: u, vert: y, frag: d } = t, p = () => {
      c.remove(h), n();
    };
    if (!y && !d && !t.wgsl && !u)
      return E.tween(E.TW_INT_TRANS, t, this.#_, { alpha: 0 }, () => {
      }, p, () => {
      }), c.add(h), !1;
    const v = w(t, "vague", 0.04), $ = {
      rule: W.EMPTY,
      smRule: W.EMPTY.source.style,
      timeUniforms: {
        vague: { type: "f32", value: v },
        tick: { type: "f32", value: 0 }
      }
    }, { wgsl: C = B.#P } = t;
    this.#_.filters = [new Dt({
      glProgram: Wt.from({
        vertex: y ?? B.#I,
        fragment: d ?? B.#J
      }),
      gpuProgram: zt.from({
        vertex: { entryPoint: "mainVert", source: C },
        fragment: { entryPoint: "mainFrag", source: C }
      }),
      resources: $
    })];
    const F = E.tween(E.TW_INT_TRANS, t, $, { tick: 1 }, () => {
    }, p, () => {
    }, !u);
    if (!u)
      return c.add(h), !1;
    const P = new _(u, void 0, (k) => {
      $.rule = k.texture, $.smRule = k.texture.source.style, k.destroy(), P.destroy(), F.start(), c.add(h);
    });
    return !1;
  }
  #x(t = "") {
    return t ? t.split(",") : this.#v;
  }
  #k(t, e) {
    const s = this.#x(t.layer);
    for (const i of s) {
      const n = this.#a[i];
      if (!n) throw "存在しないlayer【" + i + "】です";
      e(i, n);
    }
    return s;
  }
  #et(t = "") {
    return this.#x(t).sort((e, s) => {
      const i = this.#e.getChildIndex(this.#a[e].fore.ctn), n = this.#e.getChildIndex(this.#a[s].fore.ctn);
      return i < n ? -1 : i > n ? 1 : 0;
    });
  }
  setAllStyle2TxtLay(t) {
    const e = this.#x();
    for (const s of e) {
      const i = this.#a[s].fore;
      i instanceof x && i.lay({ style: t });
    }
  }
  //MARK: 画面を揺らす
  #E(t) {
    if (E.finish_trans(), w(t, "time", NaN) === 0 || this.#d.isSkipping) return !1;
    const { layer: s } = t, i = [];
    for (const f of this.#x(s))
      i.push(this.#a[f].fore.ctn);
    this.#b.resize(S.stageW, S.stageH);
    const n = () => {
      this.#e.visible = !0;
      const { renderer: f } = this.appPixi;
      for (const l of i) f.render({ container: l, target: this.#b, clear: !1 });
      this.#e.visible = !1;
    };
    this.#_.visible = !0, this.#_.alpha = 1;
    const a = G(w(t, "hmax", 10)), o = G(w(t, "vmax", 10)), r = a === 0 ? () => {
    } : () => this.#_.x = Math.round(Math.random() * a * 2) - a, c = o === 0 ? () => {
    } : () => this.#_.y = Math.round(Math.random() * o * 2) - o;
    return this.#_.filters = [], E.tween(E.TW_INT_TRANS, t, this.#_, { x: 0, y: 0 }, () => {
      r(), c();
    }, () => {
      this.appPixi.ticker.remove(n), this.#e.visible = !0, this.#_.visible = !1, this.#_.x = 0, this.#_.y = 0;
    }, () => {
    }), this.appPixi.ticker.add(n), !1;
  }
  //MARK: トゥイーン開始
  #Z(t) {
    const { layer: e, render: s, name: i } = t;
    if (!e) throw "layerは必須です";
    const n = this.#a[this.#q(t)], a = n.fore;
    let o = () => {
    };
    s && !this.#d.isSkipping && (a.renderStart(), o = () => a.renderEnd());
    const r = E.cnvTweenArg(t, a), c = R(t, "arrive", !1), f = R(t, "backlay", !1), l = n.back.ctn;
    return E.tween(i ?? e, t, a, E.cnvTweenArg(t, a), () => {
    }, o, () => {
      if (c && Object.assign(a, r), f) for (const b of Object.keys(E.hMemberCnt)) l[b] = a[b];
    }), "filter" in t && (a.ctn.filters = [I.bldFilters(t)], a.aFltHArg = [t]), !1;
  }
  //MARK: フィルター追加
  #M(t) {
    return E.finish_trans(), this.#k(t, (e) => {
      const s = this.#a[this.#q({ layer: e })];
      if (t.page === "both") {
        this.#j(s.fore, t), this.#j(s.back, t);
        return;
      }
      const i = s.getPage(t);
      this.#j(i, t);
    }), !1;
  }
  #j(t, e) {
    const s = t.ctn;
    s.filters ??= [], s.filters = [
      ...s.filters instanceof Array ? s.filters : [s.filters],
      I.bldFilters(e)
    ], t.aFltHArg.push(e);
  }
  //MARK: フィルター全削除
  #U(t) {
    return this.#k(t, (e) => {
      const s = this.#a[this.#q({ layer: e })];
      if (t.page === "both") {
        const n = s.fore, a = s.back;
        n.ctn.filters = [], a.ctn.filters = [], n.aFltHArg = [], a.aFltHArg = [];
        return;
      }
      const i = s.getPage(t);
      i.ctn.filters = [], i.aFltHArg = [];
    }), !1;
  }
  //MARK: フィルター個別切替
  #D(t) {
    return this.#k(t, (e) => {
      const s = this.#a[this.#q({ layer: e })];
      if (t.page === "both") {
        this.#R(s.fore, t), this.#R(s.back, t);
        return;
      }
      const i = s.getPage(t);
      this.#R(i, t);
    }), !1;
  }
  #R(t, e) {
    const s = t.ctn, i = s.filters instanceof Array ? s.filters : [s.filters], n = i.length;
    if (n === 0) throw "フィルターがありません";
    const a = G(w(e, "index", 0));
    if (n <= a) throw `フィルターの個数（${n}）を越えています`;
    t.aFltHArg[a].enabled = i[a].enabled = R(e, "enabled", !0);
  }
  //	// 文字・文字レイヤ
  static #$ = 10;
  static get msecChWait() {
    return B.#$;
  }
  //MARK: 文字を追加する
  #L(t) {
    const { text: e } = t;
    if (!e) throw "textは必須です";
    const s = this.#C(t);
    delete t.text, this.setNormalChWait(), this.#d.isSkipping ? t.wait = 0 : "wait" in t && w(t, "wait", NaN);
    const i = encodeURIComponent(JSON.stringify(t));
    this.#u("add｜" + i, s);
    const n = R(t, "record", !0), a = this.val.doRecLog();
    return n || this.val.setVal_Nochk("save", "sn.doRecLog", n), s.tagCh(e.replaceAll("[r]", `
`)), this.val.setVal_Nochk("save", "sn.doRecLog", a), this.#u("add_close｜", s), !1;
  }
  #C = (t) => {
    throw this.#tt(), 0;
  };
  #A(t) {
    const e = this.#q(t, this.#w), i = this.#a[e].getPage(t);
    if (!(i instanceof x)) throw e + "はTxtLayerではありません";
    return i;
  }
  setNormalChWait() {
    B.#$ = this.scrItr.normalWait;
  }
  //MARK: 操作対象のメッセージレイヤの指定
  #X = (t) => {
    throw this.#tt(), 0;
  };
  #K(t) {
    const { layer: e } = t;
    if (!e) throw "[current] layerは必須です";
    const s = this.#a[e];
    if (!s || !(s.getPage(t) instanceof x)) throw `${e}はTxtLayerではありません`;
    this.#Q = s, this.recPagebreak(), this.#w = e, this.val.setVal_Nochk("save", "const.sn.mesLayer", e);
    for (const i of this.#x()) {
      const n = this.#a[i];
      n.fore instanceof x && (n.fore.isCur = n.back.isCur = i === e);
    }
    return !1;
  }
  get currentTxtlayForeNeedErr() {
    return this.#tt(), this.currentTxtlayFore;
  }
  get currentTxtlayFore() {
    return this.#Q ? this.#Q.fore : null;
  }
  #Q;
  // カレントテキストレイヤ
  #tt = () => {
    throw "文字レイヤーがありません。文字表示や操作する前に、[add_lay layer=（レイヤ名） class=txt]で文字レイヤを追加して下さい";
  };
  #q(t, e = "") {
    const s = t.layer ?? e;
    if (s.includes(",")) throw "layer名に「,」は使えません";
    if (!(s in this.#a)) throw "属性 layer【" + s + "】が不正です。レイヤーがありません";
    return t.layer = s;
  }
  #F = { text: "" };
  #Y = [];
  recText(t) {
    this.#F = { text: t }, this.val.setVal_Nochk(
      "save",
      "const.sn.sLog",
      String(this.val.getVal("const.sn.log.json"))
      // これを起動したい
    );
  }
  recPagebreak() {
    this.#F.text && (this.#F.text = this.#F.text.replaceAll("</span><span class='sn_ch'>", ""), this.#Y.push(this.#F) > this.cfg.oCfg.log.max_len && (this.#Y = this.#Y.slice(-this.cfg.oCfg.log.max_len)), this.#F = { text: "" });
  }
  //MARK: 文字消去
  #it(t) {
    const e = this.#C(t);
    return t.layer === this.#w && t.page === "fore" && this.recPagebreak(), e.clearText(), !1;
  }
  //MARK: ハイパーリンクの終了
  #nt(t) {
    return this.#u("endlink｜", this.#C(t)), !1;
  }
  //MARK: ページ両面の文字消去
  #at(t) {
    return R(t, "rec_page_break", !0) && this.recPagebreak(), this.#Q && (this.#Q.fore.clearLay(t), this.#Q.back.clearLay(t)), !1;
  }
  //MARK: インライン画像表示
  #ot(t) {
    if (!t.pic) throw "[graph] picは必須です";
    const e = encodeURIComponent(JSON.stringify(t));
    return this.#u("grp｜" + e, this.#C(t)), !1;
  }
  //MARK: ハイパーリンク
  #rt(t) {
    if (!t.fn && !t.label && !t.url) throw "fn,label,url いずれかは必須です";
    t.fn ??= this.scrItr.scriptFn, t.style ??= "background-color: rgba(255,0,0,0.5);", t.style_hover ??= "background-color: rgba(255,0,0,0.9);", t.style_clicked ??= t.style;
    const e = encodeURIComponent(JSON.stringify(t));
    return this.#u("link｜" + e, this.#C(t)), !1;
  }
  //MARK: 改行
  #ht(t) {
    return t.text = `
`, this.#L(t);
  }
  //MARK: 履歴改行
  #lt(t) {
    return this.#st({ ...t, text: "[r]" });
  }
  //MARK: 履歴書き込み
  #st(t) {
    return this.#F = { ...t, text: this.#F.text }, t.text ? (t.record = !0, t.style ??= "", t.style += "display: none;", t.wait = 0, this.#L(t)) : !1;
  }
  //MARK: 履歴リセット
  #ct(t) {
    return this.#Y = [], this.#F = { text: t.text ?? "" }, this.val.setVal_Nochk(
      "save",
      "const.sn.sLog",
      t.text ? `[{text:"${t.text}"}]` : "[]"
    ), !1;
  }
  //MARK: 文字列と複数ルビの追加
  #dt(t) {
    const { t: e, r: s } = t;
    if (!e) throw "[ruby2] tは必須です";
    if (!s) throw "[ruby2] rは必須です";
    return t.text = "｜" + encodeURIComponent(e) + "《" + encodeURIComponent(s) + "》", delete t.t, delete t.r, this.#L(t);
  }
  //MARK: インラインスタイル設定
  #ft(t) {
    const e = encodeURIComponent(JSON.stringify(t));
    return this.#u("span｜" + e, this.#C(t)), !1;
  }
  //MARK: tcy縦中横を表示する
  #ut(t) {
    if (!t.t) throw "[tcy] tは必須です";
    const e = encodeURIComponent(JSON.stringify(t));
    return this.#u("tcy｜" + e, this.#C(t)), !1;
  }
  //MARK: レイヤのダンプ
  #pt(t) {
    console.group("🥟 [dump_lay]");
    for (const e of this.#x(t.layer)) {
      const s = this.#a[e];
      try {
        console.info(
          `%c${s.fore.name.slice(0, -7)} %o`,
          `color:#${S.isDarkMode ? "49F" : "05A"};`,
          JSON.parse(`{"back":{${s.back.dump()}}, "fore":{${s.fore.dump()}}}`)
        );
      } catch (i) {
        console.error("dump_lay err:%o", i), console.error(`   back:${s.back.dump()}`), console.error(`   fore:${s.fore.dump()}`);
      }
    }
    return console.groupEnd(), !1;
  }
  //MARK: イベント有無の切替
  #mt(t) {
    const e = this.#q(t, this.#w), s = R(t, "enabled", !0);
    return this.#C(t).enabled = s, this.val.setVal_Nochk("save", "const.sn.layer." + e + ".enabled", s), !1;
  }
  //MARK: ボタンを表示
  #yt(t) {
    return tt.argChk_page(t, "back"), t.fn ??= this.scrItr.scriptFn, this.#C(t).addButton(t), this.scrItr.recodeDesign(t), !1;
  }
  record() {
    const t = {};
    for (const e of this.#v) {
      const s = this.#a[e];
      t[e] = {
        cls: s.cls,
        fore: s.fore.record(),
        back: s.back.record()
      };
    }
    return t;
  }
  playback(t) {
    this.#Y = JSON.parse(String(this.val.getVal("save:const.sn.sLog"))), this.#F = { text: "" };
    const e = [], s = [];
    for (const [n, { fore: a, fore: { idx: o }, back: r, cls: c }] of Object.entries(t)) {
      s.push({ ln: n, idx: o });
      const f = this.#a[n] ??= new tt(n, c, this.#e, this.#n, {}, this.sys, this.val, { isWait: !1 });
      f.fore.playback(a, e), f.back.playback(r, e);
    }
    const i = this.#e.children.length;
    return e.push(new Promise((n) => {
      for (const { ln: a, idx: o } of s.sort(({ idx: r }, { idx: c }) => r === c ? 0 : r < c ? -1 : 1)) {
        const { fore: r, back: c } = this.#a[a];
        if (!r) continue;
        const f = i > o ? o : i - 1;
        this.#e.setChildIndex(r.ctn, f), this.#n.setChildIndex(c.ctn, f);
      }
      n();
    })), e;
  }
}
const ie = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LayerMng: B
}, Symbol.toStringTag, { value: "Module" }));
export {
  D as B,
  ie as L,
  x as T
};
//# sourceMappingURL=LayerMng.js.map
