import { r as W, n as v, o as U, l as X } from "./app2.js";
import { a as Y, E as R, b, F as N, c as V } from "./EventBoundary.js";
import "./webworkerAll.js";
var P = /iPhone/i, x = /iPod/i, O = /iPad/i, D = /\biOS-universal(?:.+)Mac\b/i, T = /\bAndroid(?:.+)Mobile\b/i, L = /Android/i, f = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, g = /Silk/i, u = /Windows Phone/i, C = /\bWindows(?:.+)ARM\b/i, A = /BlackBerry/i, I = /BB10/i, k = /Opera Mini/i, S = /\b(CriOS|Chrome)(?:.+)Mobile/i, B = /Mobile(?:.+)Firefox\b/i, H = function(n) {
  return typeof n < "u" && n.platform === "MacIntel" && typeof n.maxTouchPoints == "number" && n.maxTouchPoints > 1 && typeof MSStream > "u";
};
function Z(n) {
  return function(e) {
    return e.test(n);
  };
}
function $(n) {
  var e = {
    userAgent: "",
    platform: "",
    maxTouchPoints: 0
  };
  !n && typeof navigator < "u" ? e = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints || 0
  } : typeof n == "string" ? e.userAgent = n : n && n.userAgent && (e = {
    userAgent: n.userAgent,
    platform: n.platform,
    maxTouchPoints: n.maxTouchPoints || 0
  });
  var t = e.userAgent, i = t.split("[FBAN");
  typeof i[1] < "u" && (t = i[0]), i = t.split("Twitter"), typeof i[1] < "u" && (t = i[0]);
  var o = Z(t), s = {
    apple: {
      phone: o(P) && !o(u),
      ipod: o(x),
      tablet: !o(P) && (o(O) || H(e)) && !o(u),
      universal: o(D),
      device: (o(P) || o(x) || o(O) || o(D) || H(e)) && !o(u)
    },
    amazon: {
      phone: o(f),
      tablet: !o(f) && o(g),
      device: o(f) || o(g)
    },
    android: {
      phone: !o(u) && o(f) || !o(u) && o(T),
      tablet: !o(u) && !o(f) && !o(T) && (o(g) || o(L)),
      device: !o(u) && (o(f) || o(g) || o(T) || o(L)) || o(/\bokhttp\b/i)
    },
    windows: {
      phone: o(u),
      tablet: o(C),
      device: o(u) || o(C)
    },
    other: {
      blackberry: o(A),
      blackberry10: o(I),
      opera: o(k),
      firefox: o(B),
      chrome: o(S),
      device: o(A) || o(I) || o(k) || o(B) || o(S)
    },
    any: !1,
    phone: !1,
    tablet: !1
  };
  return s.any = s.apple.device || s.android.device || s.windows.device || s.other.device, s.phone = s.apple.phone || s.android.phone || s.windows.phone, s.tablet = s.apple.tablet || s.android.tablet || s.windows.tablet, s;
}
const G = $.default ?? $, q = G(globalThis.navigator), J = 9, E = 100, Q = 0, ee = 0, F = 2, j = 1, te = -1e3, ie = -1e3, oe = 2;
class z {
  // 2fps
  // eslint-disable-next-line jsdoc/require-param
  /**
   * @param {WebGLRenderer|WebGPURenderer} renderer - A reference to the current renderer
   */
  constructor(e, t = q) {
    this._mobileInfo = t, this.debug = !1, this._isActive = !1, this._isMobileAccessibility = !1, this._pool = [], this._renderId = 0, this._children = [], this._androidUpdateCount = 0, this._androidUpdateFrequency = 500, this._hookDiv = null, (t.tablet || t.phone) && this._createTouchHook();
    const i = document.createElement("div");
    i.style.width = `${E}px`, i.style.height = `${E}px`, i.style.position = "absolute", i.style.top = `${Q}px`, i.style.left = `${ee}px`, i.style.zIndex = F.toString(), this._div = i, this._renderer = e, this._onKeyDown = this._onKeyDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), globalThis.addEventListener("keydown", this._onKeyDown, !1);
  }
  /**
   * Value of `true` if accessibility is currently active and accessibility layers are showing.
   * @member {boolean}
   * @readonly
   */
  get isActive() {
    return this._isActive;
  }
  /**
   * Value of `true` if accessibility is enabled for touch devices.
   * @member {boolean}
   * @readonly
   */
  get isMobileAccessibility() {
    return this._isMobileAccessibility;
  }
  get hookDiv() {
    return this._hookDiv;
  }
  /**
   * Creates the touch hooks.
   * @private
   */
  _createTouchHook() {
    const e = document.createElement("button");
    e.style.width = `${j}px`, e.style.height = `${j}px`, e.style.position = "absolute", e.style.top = `${te}px`, e.style.left = `${ie}px`, e.style.zIndex = oe.toString(), e.style.backgroundColor = "#FF0000", e.title = "select to enable accessibility for this content", e.addEventListener("focus", () => {
      this._isMobileAccessibility = !0, this._activate(), this._destroyTouchHook();
    }), document.body.appendChild(e), this._hookDiv = e;
  }
  /**
   * Destroys the touch hooks.
   * @private
   */
  _destroyTouchHook() {
    this._hookDiv && (document.body.removeChild(this._hookDiv), this._hookDiv = null);
  }
  /**
   * Activating will cause the Accessibility layer to be shown.
   * This is called when a user presses the tab key.
   * @private
   */
  _activate() {
    this._isActive || (this._isActive = !0, globalThis.document.addEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown, !1), this._renderer.runners.postrender.add(this), this._renderer.view.canvas.parentNode?.appendChild(this._div));
  }
  /**
   * Deactivating will cause the Accessibility layer to be hidden.
   * This is called when a user moves the mouse.
   * @private
   */
  _deactivate() {
    !this._isActive || this._isMobileAccessibility || (this._isActive = !1, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.addEventListener("keydown", this._onKeyDown, !1), this._renderer.runners.postrender.remove(this), this._div.parentNode?.removeChild(this._div));
  }
  /**
   * This recursive function will run through the scene graph and add any new accessible objects to the DOM layer.
   * @private
   * @param {Container} container - The Container to check.
   */
  _updateAccessibleObjects(e) {
    if (!e.visible || !e.accessibleChildren)
      return;
    e.accessible && e.isInteractive() && (e._accessibleActive || this._addChild(e), e._renderId = this._renderId);
    const t = e.children;
    if (t)
      for (let i = 0; i < t.length; i++)
        this._updateAccessibleObjects(t[i]);
  }
  /**
   * Runner init called, view is available at this point.
   * @ignore
   */
  init(e) {
    this.debug = e?.debug ?? this.debug, this._renderer.runners.postrender.remove(this);
  }
  /**
   * Runner postrender was called, ensure that all divs are mapped correctly to their Containers.
   * Only fires while active.
   * @ignore
   */
  postrender() {
    const e = performance.now();
    if (this._mobileInfo.android.device && e < this._androidUpdateCount || (this._androidUpdateCount = e + this._androidUpdateFrequency, !this._renderer.renderingToScreen || !this._renderer.view.canvas))
      return;
    this._renderer.lastObjectRendered && this._updateAccessibleObjects(this._renderer.lastObjectRendered);
    const { x: t, y: i, width: o, height: s } = this._renderer.view.canvas.getBoundingClientRect(), { width: d, height: h, resolution: c } = this._renderer, y = o / d * c, _ = s / h * c;
    let r = this._div;
    r.style.left = `${t}px`, r.style.top = `${i}px`, r.style.width = `${d}px`, r.style.height = `${h}px`;
    for (let m = 0; m < this._children.length; m++) {
      const l = this._children[m];
      if (l._renderId !== this._renderId)
        l._accessibleActive = !1, W(this._children, m, 1), this._div.removeChild(l._accessibleDiv), this._pool.push(l._accessibleDiv), l._accessibleDiv = null, m--;
      else {
        r = l._accessibleDiv;
        let a = l.hitArea;
        const p = l.worldTransform;
        l.hitArea ? (r.style.left = `${(p.tx + a.x * p.a) * y}px`, r.style.top = `${(p.ty + a.y * p.d) * _}px`, r.style.width = `${a.width * p.a * y}px`, r.style.height = `${a.height * p.d * _}px`) : (a = l.getBounds().rectangle, this._capHitArea(a), r.style.left = `${a.x * y}px`, r.style.top = `${a.y * _}px`, r.style.width = `${a.width * y}px`, r.style.height = `${a.height * _}px`, r.title !== l.accessibleTitle && l.accessibleTitle !== null && (r.title = l.accessibleTitle || ""), r.getAttribute("aria-label") !== l.accessibleHint && l.accessibleHint !== null && r.setAttribute("aria-label", l.accessibleHint || "")), (l.accessibleTitle !== r.title || l.tabIndex !== r.tabIndex) && (r.title = l.accessibleTitle || "", r.tabIndex = l.tabIndex, this.debug && this._updateDebugHTML(r));
      }
    }
    this._renderId++;
  }
  /**
   * private function that will visually add the information to the
   * accessibility div
   * @param {HTMLElement} div -
   */
  _updateDebugHTML(e) {
    e.innerHTML = `type: ${e.type}</br> title : ${e.title}</br> tabIndex: ${e.tabIndex}`;
  }
  /**
   * Adjust the hit area based on the bounds of a display object
   * @param {Rectangle} hitArea - Bounds of the child
   */
  _capHitArea(e) {
    e.x < 0 && (e.width += e.x, e.x = 0), e.y < 0 && (e.height += e.y, e.y = 0);
    const { width: t, height: i } = this._renderer;
    e.x + e.width > t && (e.width = t - e.x), e.y + e.height > i && (e.height = i - e.y);
  }
  /**
   * Adds a Container to the accessibility manager
   * @private
   * @param {Container} container - The child to make accessible.
   */
  _addChild(e) {
    let t = this._pool.pop();
    t || (t = document.createElement("button"), t.style.width = `${E}px`, t.style.height = `${E}px`, t.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", t.style.position = "absolute", t.style.zIndex = F.toString(), t.style.borderStyle = "none", navigator.userAgent.toLowerCase().includes("chrome") ? t.setAttribute("aria-live", "off") : t.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? t.setAttribute("aria-relevant", "additions") : t.setAttribute("aria-relevant", "text"), t.addEventListener("click", this._onClick.bind(this)), t.addEventListener("focus", this._onFocus.bind(this)), t.addEventListener("focusout", this._onFocusOut.bind(this))), t.style.pointerEvents = e.accessiblePointerEvents, t.type = e.accessibleType, e.accessibleTitle && e.accessibleTitle !== null ? t.title = e.accessibleTitle : (!e.accessibleHint || e.accessibleHint === null) && (t.title = `container ${e.tabIndex}`), e.accessibleHint && e.accessibleHint !== null && t.setAttribute("aria-label", e.accessibleHint), this.debug && this._updateDebugHTML(t), e._accessibleActive = !0, e._accessibleDiv = t, t.container = e, this._children.push(e), this._div.appendChild(e._accessibleDiv), e._accessibleDiv.tabIndex = e.tabIndex;
  }
  /**
   * Dispatch events with the EventSystem.
   * @param e
   * @param type
   * @private
   */
  _dispatchEvent(e, t) {
    const { container: i } = e.target, o = this._renderer.events.rootBoundary, s = Object.assign(new Y(o), { target: i });
    o.rootTarget = this._renderer.lastObjectRendered, t.forEach((d) => o.dispatchEvent(s, d));
  }
  /**
   * Maps the div button press to pixi's EventSystem (click)
   * @private
   * @param {MouseEvent} e - The click event.
   */
  _onClick(e) {
    this._dispatchEvent(e, ["click", "pointertap", "tap"]);
  }
  /**
   * Maps the div focus events to pixi's EventSystem (mouseover)
   * @private
   * @param {FocusEvent} e - The focus event.
   */
  _onFocus(e) {
    e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "assertive"), this._dispatchEvent(e, ["mouseover"]);
  }
  /**
   * Maps the div focus events to pixi's EventSystem (mouseout)
   * @private
   * @param {FocusEvent} e - The focusout event.
   */
  _onFocusOut(e) {
    e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "polite"), this._dispatchEvent(e, ["mouseout"]);
  }
  /**
   * Is called when a key is pressed
   * @private
   * @param {KeyboardEvent} e - The keydown event.
   */
  _onKeyDown(e) {
    e.keyCode === J && this._activate();
  }
  /**
   * Is called when the mouse moves across the renderer element
   * @private
   * @param {MouseEvent} e - The mouse event.
   */
  _onMouseMove(e) {
    e.movementX === 0 && e.movementY === 0 || this._deactivate();
  }
  /** Destroys the accessibility manager */
  destroy() {
    this._destroyTouchHook(), this._div = null, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown), this._pool = null, this._children = null, this._renderer = null;
  }
}
z.extension = {
  type: [
    v.WebGLSystem,
    v.WebGPUSystem
  ],
  name: "accessibility"
};
const se = {
  /**
   * Flag for if the object is accessible. If true AccessibilityManager will overlay a
   * shadow div with attributes set
   * @member {boolean}
   * @memberof scene.Container#
   */
  accessible: !1,
  /**
   * Sets the title attribute of the shadow div
   * If accessibleTitle AND accessibleHint has not been this will default to 'container [tabIndex]'
   * @member {string}
   * @memberof scene.Container#
   */
  accessibleTitle: null,
  /**
   * Sets the aria-label attribute of the shadow div
   * @member {string}
   * @memberof scene.Container#
   */
  accessibleHint: null,
  /**
   * @member {number}
   * @memberof scene.Container#
   * @todo Needs docs.
   */
  tabIndex: 0,
  /**
   * @member {boolean}
   * @memberof scene.Container#
   * @private
   */
  _accessibleActive: !1,
  /**
   * @memberof scene.Container#
   * @private
   */
  _accessibleDiv: null,
  /**
   * Specify the type of div the accessible layer is. Screen readers treat the element differently
   * depending on this type. Defaults to button.
   * @member {string}
   * @memberof scene.Container#
   * @default 'button'
   */
  accessibleType: "button",
  /**
   * Specify the pointer-events the accessible div will use
   * Defaults to auto.
   * @type {PointerEvents}
   * @memberof scene.Container#
   * @default 'auto'
   */
  accessiblePointerEvents: "auto",
  /**
   * Setting to false will prevent any children inside this container to
   * be accessible. Defaults to true.
   * @member {boolean}
   * @memberof scene.Container#
   * @default true
   */
  accessibleChildren: !0,
  /**
   * @member {number}
   * @memberof scene.Container#
   * @private
   */
  _renderId: -1
}, ne = 1, re = {
  touchstart: "pointerdown",
  touchend: "pointerup",
  touchendoutside: "pointerupoutside",
  touchmove: "pointermove",
  touchcancel: "pointercancel"
}, M = class w {
  /**
   * @param {Renderer} renderer
   */
  constructor(e) {
    this.supportsTouchEvents = "ontouchstart" in globalThis, this.supportsPointerEvents = !!globalThis.PointerEvent, this.domElement = null, this.resolution = 1, this.renderer = e, this.rootBoundary = new R(null), b.init(this), this.autoPreventDefault = !0, this._eventsAdded = !1, this._rootPointerEvent = new N(null), this._rootWheelEvent = new V(null), this.cursorStyles = {
      default: "inherit",
      pointer: "pointer"
    }, this.features = new Proxy({ ...w.defaultEventFeatures }, {
      set: (t, i, o) => (i === "globalMove" && (this.rootBoundary.enableGlobalMoveEvents = o), t[i] = o, !0)
    }), this._onPointerDown = this._onPointerDown.bind(this), this._onPointerMove = this._onPointerMove.bind(this), this._onPointerUp = this._onPointerUp.bind(this), this._onPointerOverOut = this._onPointerOverOut.bind(this), this.onWheel = this.onWheel.bind(this);
  }
  /**
   * The default interaction mode for all display objects.
   * @see Container.eventMode
   * @type {EventMode}
   * @readonly
   * @since 7.2.0
   */
  static get defaultEventMode() {
    return this._defaultEventMode;
  }
  /**
   * Runner init called, view is available at this point.
   * @ignore
   */
  init(e) {
    const { canvas: t, resolution: i } = this.renderer;
    this.setTargetElement(t), this.resolution = i, w._defaultEventMode = e.eventMode ?? "passive", Object.assign(this.features, e.eventFeatures ?? {}), this.rootBoundary.enableGlobalMoveEvents = this.features.globalMove;
  }
  /**
   * Handle changing resolution.
   * @ignore
   */
  resolutionChange(e) {
    this.resolution = e;
  }
  /** Destroys all event listeners and detaches the renderer. */
  destroy() {
    this.setTargetElement(null), this.renderer = null, this._currentCursor = null;
  }
  /**
   * Sets the current cursor mode, handling any callbacks or CSS style changes.
   * @param mode - cursor mode, a key from the cursorStyles dictionary
   */
  setCursor(e) {
    e || (e = "default");
    let t = !0;
    if (globalThis.OffscreenCanvas && this.domElement instanceof OffscreenCanvas && (t = !1), this._currentCursor === e)
      return;
    this._currentCursor = e;
    const i = this.cursorStyles[e];
    if (i)
      switch (typeof i) {
        case "string":
          t && (this.domElement.style.cursor = i);
          break;
        case "function":
          i(e);
          break;
        case "object":
          t && Object.assign(this.domElement.style, i);
          break;
      }
    else t && typeof e == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, e) && (this.domElement.style.cursor = e);
  }
  /**
   * The global pointer event.
   * Useful for getting the pointer position without listening to events.
   * @since 7.2.0
   */
  get pointer() {
    return this._rootPointerEvent;
  }
  /**
   * Event handler for pointer down events on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  _onPointerDown(e) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const t = this._normalizeToPointerData(e);
    this.autoPreventDefault && t[0].isNormalized && (e.cancelable || !("cancelable" in e)) && e.preventDefault();
    for (let i = 0, o = t.length; i < o; i++) {
      const s = t[i], d = this._bootstrapEvent(this._rootPointerEvent, s);
      this.rootBoundary.mapEvent(d);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer move events on on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch events.
   */
  _onPointerMove(e) {
    if (!this.features.move)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, b.pointerMoved();
    const t = this._normalizeToPointerData(e);
    for (let i = 0, o = t.length; i < o; i++) {
      const s = this._bootstrapEvent(this._rootPointerEvent, t[i]);
      this.rootBoundary.mapEvent(s);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer up events on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  _onPointerUp(e) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    let t = e.target;
    e.composedPath && e.composedPath().length > 0 && (t = e.composedPath()[0]);
    const i = t !== this.domElement ? "outside" : "", o = this._normalizeToPointerData(e);
    for (let s = 0, d = o.length; s < d; s++) {
      const h = this._bootstrapEvent(this._rootPointerEvent, o[s]);
      h.type += i, this.rootBoundary.mapEvent(h);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer over & out events on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  _onPointerOverOut(e) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const t = this._normalizeToPointerData(e);
    for (let i = 0, o = t.length; i < o; i++) {
      const s = this._bootstrapEvent(this._rootPointerEvent, t[i]);
      this.rootBoundary.mapEvent(s);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Passive handler for `wheel` events on {@link EventSystem.domElement this.domElement}.
   * @param nativeEvent - The native wheel event.
   */
  onWheel(e) {
    if (!this.features.wheel)
      return;
    const t = this.normalizeWheelEvent(e);
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, this.rootBoundary.mapEvent(t);
  }
  /**
   * Sets the {@link EventSystem#domElement domElement} and binds event listeners.
   *
   * To deregister the current DOM element without setting a new one, pass {@code null}.
   * @param element - The new DOM element.
   */
  setTargetElement(e) {
    this._removeEvents(), this.domElement = e, b.domElement = e, this._addEvents();
  }
  /** Register event listeners on {@link Renderer#domElement this.domElement}. */
  _addEvents() {
    if (this._eventsAdded || !this.domElement)
      return;
    b.addTickerListener();
    const e = this.domElement.style;
    e && (globalThis.navigator.msPointerEnabled ? (e.msContentZooming = "none", e.msTouchAction = "none") : this.supportsPointerEvents && (e.touchAction = "none")), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this._onPointerMove, !0), this.domElement.addEventListener("pointerdown", this._onPointerDown, !0), this.domElement.addEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.addEventListener("pointerover", this._onPointerOverOut, !0), globalThis.addEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.addEventListener("mousemove", this._onPointerMove, !0), this.domElement.addEventListener("mousedown", this._onPointerDown, !0), this.domElement.addEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.addEventListener("mouseover", this._onPointerOverOut, !0), globalThis.addEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.addEventListener("touchstart", this._onPointerDown, !0), this.domElement.addEventListener("touchend", this._onPointerUp, !0), this.domElement.addEventListener("touchmove", this._onPointerMove, !0))), this.domElement.addEventListener("wheel", this.onWheel, {
      passive: !0,
      capture: !0
    }), this._eventsAdded = !0;
  }
  /** Unregister event listeners on {@link EventSystem#domElement this.domElement}. */
  _removeEvents() {
    if (!this._eventsAdded || !this.domElement)
      return;
    b.removeTickerListener();
    const e = this.domElement.style;
    e && (globalThis.navigator.msPointerEnabled ? (e.msContentZooming = "", e.msTouchAction = "") : this.supportsPointerEvents && (e.touchAction = "")), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this._onPointerMove, !0), this.domElement.removeEventListener("pointerdown", this._onPointerDown, !0), this.domElement.removeEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.removeEventListener("pointerover", this._onPointerOverOut, !0), globalThis.removeEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.removeEventListener("mousemove", this._onPointerMove, !0), this.domElement.removeEventListener("mousedown", this._onPointerDown, !0), this.domElement.removeEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.removeEventListener("mouseover", this._onPointerOverOut, !0), globalThis.removeEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.removeEventListener("touchstart", this._onPointerDown, !0), this.domElement.removeEventListener("touchend", this._onPointerUp, !0), this.domElement.removeEventListener("touchmove", this._onPointerMove, !0))), this.domElement.removeEventListener("wheel", this.onWheel, !0), this.domElement = null, this._eventsAdded = !1;
  }
  /**
   * Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
   * resulting value is stored in the point. This takes into account the fact that the DOM
   * element could be scaled and positioned anywhere on the screen.
   * @param  {PointData} point - the point that the result will be stored in
   * @param  {number} x - the x coord of the position to map
   * @param  {number} y - the y coord of the position to map
   */
  mapPositionToPoint(e, t, i) {
    const o = this.domElement.isConnected ? this.domElement.getBoundingClientRect() : {
      x: 0,
      y: 0,
      width: this.domElement.width,
      height: this.domElement.height,
      left: 0,
      top: 0
    }, s = 1 / this.resolution;
    e.x = (t - o.left) * (this.domElement.width / o.width) * s, e.y = (i - o.top) * (this.domElement.height / o.height) * s;
  }
  /**
   * Ensures that the original event object contains all data that a regular pointer event would have
   * @param event - The original event data from a touch or mouse event
   * @returns An array containing a single normalized pointer event, in the case of a pointer
   *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
   */
  _normalizeToPointerData(e) {
    const t = [];
    if (this.supportsTouchEvents && e instanceof TouchEvent)
      for (let i = 0, o = e.changedTouches.length; i < o; i++) {
        const s = e.changedTouches[i];
        typeof s.button > "u" && (s.button = 0), typeof s.buttons > "u" && (s.buttons = 1), typeof s.isPrimary > "u" && (s.isPrimary = e.touches.length === 1 && e.type === "touchstart"), typeof s.width > "u" && (s.width = s.radiusX || 1), typeof s.height > "u" && (s.height = s.radiusY || 1), typeof s.tiltX > "u" && (s.tiltX = 0), typeof s.tiltY > "u" && (s.tiltY = 0), typeof s.pointerType > "u" && (s.pointerType = "touch"), typeof s.pointerId > "u" && (s.pointerId = s.identifier || 0), typeof s.pressure > "u" && (s.pressure = s.force || 0.5), typeof s.twist > "u" && (s.twist = 0), typeof s.tangentialPressure > "u" && (s.tangentialPressure = 0), typeof s.layerX > "u" && (s.layerX = s.offsetX = s.clientX), typeof s.layerY > "u" && (s.layerY = s.offsetY = s.clientY), s.isNormalized = !0, s.type = e.type, t.push(s);
      }
    else if (!globalThis.MouseEvent || e instanceof MouseEvent && (!this.supportsPointerEvents || !(e instanceof globalThis.PointerEvent))) {
      const i = e;
      typeof i.isPrimary > "u" && (i.isPrimary = !0), typeof i.width > "u" && (i.width = 1), typeof i.height > "u" && (i.height = 1), typeof i.tiltX > "u" && (i.tiltX = 0), typeof i.tiltY > "u" && (i.tiltY = 0), typeof i.pointerType > "u" && (i.pointerType = "mouse"), typeof i.pointerId > "u" && (i.pointerId = ne), typeof i.pressure > "u" && (i.pressure = 0.5), typeof i.twist > "u" && (i.twist = 0), typeof i.tangentialPressure > "u" && (i.tangentialPressure = 0), i.isNormalized = !0, t.push(i);
    } else
      t.push(e);
    return t;
  }
  /**
   * Normalizes the native {@link https://w3c.github.io/uievents/#interface-wheelevent WheelEvent}.
   *
   * The returned {@link FederatedWheelEvent} is a shared instance. It will not persist across
   * multiple native wheel events.
   * @param nativeEvent - The native wheel event that occurred on the canvas.
   * @returns A federated wheel event.
   */
  normalizeWheelEvent(e) {
    const t = this._rootWheelEvent;
    return this._transferMouseData(t, e), t.deltaX = e.deltaX, t.deltaY = e.deltaY, t.deltaZ = e.deltaZ, t.deltaMode = e.deltaMode, this.mapPositionToPoint(t.screen, e.clientX, e.clientY), t.global.copyFrom(t.screen), t.offset.copyFrom(t.screen), t.nativeEvent = e, t.type = e.type, t;
  }
  /**
   * Normalizes the `nativeEvent` into a federateed {@link FederatedPointerEvent}.
   * @param event
   * @param nativeEvent
   */
  _bootstrapEvent(e, t) {
    return e.originalEvent = null, e.nativeEvent = t, e.pointerId = t.pointerId, e.width = t.width, e.height = t.height, e.isPrimary = t.isPrimary, e.pointerType = t.pointerType, e.pressure = t.pressure, e.tangentialPressure = t.tangentialPressure, e.tiltX = t.tiltX, e.tiltY = t.tiltY, e.twist = t.twist, this._transferMouseData(e, t), this.mapPositionToPoint(e.screen, t.clientX, t.clientY), e.global.copyFrom(e.screen), e.offset.copyFrom(e.screen), e.isTrusted = t.isTrusted, e.type === "pointerleave" && (e.type = "pointerout"), e.type.startsWith("mouse") && (e.type = e.type.replace("mouse", "pointer")), e.type.startsWith("touch") && (e.type = re[e.type] || e.type), e;
  }
  /**
   * Transfers base & mouse event data from the {@code nativeEvent} to the federated event.
   * @param event
   * @param nativeEvent
   */
  _transferMouseData(e, t) {
    e.isTrusted = t.isTrusted, e.srcElement = t.srcElement, e.timeStamp = performance.now(), e.type = t.type, e.altKey = t.altKey, e.button = t.button, e.buttons = t.buttons, e.client.x = t.clientX, e.client.y = t.clientY, e.ctrlKey = t.ctrlKey, e.metaKey = t.metaKey, e.movement.x = t.movementX, e.movement.y = t.movementY, e.page.x = t.pageX, e.page.y = t.pageY, e.relatedTarget = null, e.shiftKey = t.shiftKey;
  }
};
M.extension = {
  name: "events",
  type: [
    v.WebGLSystem,
    v.CanvasSystem,
    v.WebGPUSystem
  ],
  priority: -1
};
M.defaultEventFeatures = {
  /** Enables pointer events associated with pointer movement. */
  move: !0,
  /** Enables global pointer move events. */
  globalMove: !0,
  /** Enables pointer events associated with clicking. */
  click: !0,
  /** Enables wheel events. */
  wheel: !0
};
let K = M;
const le = {
  /**
   * Property-based event handler for the `click` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onclick = (event) => {
   *  //some function here that happens on click
   * }
   */
  onclick: null,
  /**
   * Property-based event handler for the `mousedown` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmousedown = (event) => {
   *  //some function here that happens on mousedown
   * }
   */
  onmousedown: null,
  /**
   * Property-based event handler for the `mouseenter` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseenter = (event) => {
   *  //some function here that happens on mouseenter
   * }
   */
  onmouseenter: null,
  /**
   * Property-based event handler for the `mouseleave` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseleave = (event) => {
   *  //some function here that happens on mouseleave
   * }
   */
  onmouseleave: null,
  /**
   * Property-based event handler for the `mousemove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmousemove = (event) => {
   *  //some function here that happens on mousemove
   * }
   */
  onmousemove: null,
  /**
   * Property-based event handler for the `globalmousemove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onglobalmousemove = (event) => {
   *  //some function here that happens on globalmousemove
   * }
   */
  onglobalmousemove: null,
  /**
   * Property-based event handler for the `mouseout` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseout = (event) => {
   *  //some function here that happens on mouseout
   * }
   */
  onmouseout: null,
  /**
   * Property-based event handler for the `mouseover` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseover = (event) => {
   *  //some function here that happens on mouseover
   * }
   */
  onmouseover: null,
  /**
   * Property-based event handler for the `mouseup` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseup = (event) => {
   *  //some function here that happens on mouseup
   * }
   */
  onmouseup: null,
  /**
   * Property-based event handler for the `mouseupoutside` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseupoutside = (event) => {
   *  //some function here that happens on mouseupoutside
   * }
   */
  onmouseupoutside: null,
  /**
   * Property-based event handler for the `pointercancel` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointercancel = (event) => {
   *  //some function here that happens on pointercancel
   * }
   */
  onpointercancel: null,
  /**
   * Property-based event handler for the `pointerdown` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerdown = (event) => {
   *  //some function here that happens on pointerdown
   * }
   */
  onpointerdown: null,
  /**
   * Property-based event handler for the `pointerenter` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerenter = (event) => {
   *  //some function here that happens on pointerenter
   * }
   */
  onpointerenter: null,
  /**
   * Property-based event handler for the `pointerleave` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerleave = (event) => {
   *  //some function here that happens on pointerleave
   * }
   */
  onpointerleave: null,
  /**
   * Property-based event handler for the `pointermove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointermove = (event) => {
   *  //some function here that happens on pointermove
   * }
   */
  onpointermove: null,
  /**
   * Property-based event handler for the `globalpointermove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onglobalpointermove = (event) => {
   *  //some function here that happens on globalpointermove
   * }
   */
  onglobalpointermove: null,
  /**
   * Property-based event handler for the `pointerout` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerout = (event) => {
   *  //some function here that happens on pointerout
   * }
   */
  onpointerout: null,
  /**
   * Property-based event handler for the `pointerover` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerover = (event) => {
   *  //some function here that happens on pointerover
   * }
   */
  onpointerover: null,
  /**
   * Property-based event handler for the `pointertap` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointertap = (event) => {
   *  //some function here that happens on pointertap
   * }
   */
  onpointertap: null,
  /**
   * Property-based event handler for the `pointerup` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerup = (event) => {
   *  //some function here that happens on pointerup
   * }
   */
  onpointerup: null,
  /**
   * Property-based event handler for the `pointerupoutside` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerupoutside = (event) => {
   *  //some function here that happens on pointerupoutside
   * }
   */
  onpointerupoutside: null,
  /**
   * Property-based event handler for the `rightclick` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onrightclick = (event) => {
   *  //some function here that happens on rightclick
   * }
   */
  onrightclick: null,
  /**
   * Property-based event handler for the `rightdown` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onrightdown = (event) => {
   *  //some function here that happens on rightdown
   * }
   */
  onrightdown: null,
  /**
   * Property-based event handler for the `rightup` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onrightup = (event) => {
   *  //some function here that happens on rightup
   * }
   */
  onrightup: null,
  /**
   * Property-based event handler for the `rightupoutside` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onrightupoutside = (event) => {
   *  //some function here that happens on rightupoutside
   * }
   */
  onrightupoutside: null,
  /**
   * Property-based event handler for the `tap` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontap = (event) => {
   *  //some function here that happens on tap
   * }
   */
  ontap: null,
  /**
   * Property-based event handler for the `touchcancel` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontouchcancel = (event) => {
   *  //some function here that happens on touchcancel
   * }
   */
  ontouchcancel: null,
  /**
   * Property-based event handler for the `touchend` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontouchend = (event) => {
   *  //some function here that happens on touchend
   * }
   */
  ontouchend: null,
  /**
   * Property-based event handler for the `touchendoutside` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontouchendoutside = (event) => {
   *  //some function here that happens on touchendoutside
   * }
   */
  ontouchendoutside: null,
  /**
   * Property-based event handler for the `touchmove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontouchmove = (event) => {
   *  //some function here that happens on touchmove
   * }
   */
  ontouchmove: null,
  /**
   * Property-based event handler for the `globaltouchmove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onglobaltouchmove = (event) => {
   *  //some function here that happens on globaltouchmove
   * }
   */
  onglobaltouchmove: null,
  /**
   * Property-based event handler for the `touchstart` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontouchstart = (event) => {
   *  //some function here that happens on touchstart
   * }
   */
  ontouchstart: null,
  /**
   * Property-based event handler for the `wheel` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onwheel = (event) => {
   *  //some function here that happens on wheel
   * }
   */
  onwheel: null,
  /**
   * Enable interaction events for the Container. Touch, pointer and mouse
   * @memberof scene.Container#
   */
  get interactive() {
    return this.eventMode === "dynamic" || this.eventMode === "static";
  },
  set interactive(n) {
    this.eventMode = n ? "static" : "passive";
  },
  /**
   * @ignore
   */
  _internalEventMode: void 0,
  /**
   * Enable interaction events for the Container. Touch, pointer and mouse.
   * There are 5 types of interaction settings:
   * - `'none'`: Ignores all interaction events, even on its children.
   * - `'passive'`: **(default)** Does not emit events and ignores all hit testing on itself and non-interactive children.
   * Interactive children will still emit events.
   * - `'auto'`: Does not emit events but is hit tested if parent is interactive. Same as `interactive = false` in v7
   * - `'static'`: Emit events and is hit tested. Same as `interaction = true` in v7
   * - `'dynamic'`: Emits events and is hit tested but will also receive mock interaction events fired from a ticker to
   * allow for interaction when the mouse isn't moving
   * @example
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite(texture);
   * sprite.eventMode = 'static';
   * sprite.on('tap', (event) => {
   *     // Handle event
   * });
   * @memberof scene.Container#
   * @since 7.2.0
   */
  get eventMode() {
    return this._internalEventMode ?? K.defaultEventMode;
  },
  set eventMode(n) {
    this._internalEventMode = n;
  },
  /**
   * Determines if the container is interactive or not
   * @returns {boolean} Whether the container is interactive or not
   * @memberof scene.Container#
   * @since 7.2.0
   * @example
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite(texture);
   * sprite.eventMode = 'static';
   * sprite.isInteractive(); // true
   *
   * sprite.eventMode = 'dynamic';
   * sprite.isInteractive(); // true
   *
   * sprite.eventMode = 'none';
   * sprite.isInteractive(); // false
   *
   * sprite.eventMode = 'passive';
   * sprite.isInteractive(); // false
   *
   * sprite.eventMode = 'auto';
   * sprite.isInteractive(); // false
   */
  isInteractive() {
    return this.eventMode === "static" || this.eventMode === "dynamic";
  },
  /**
   * Determines if the children to the container can be clicked/touched
   * Setting this to false allows PixiJS to bypass a recursive `hitTest` function
   * @memberof scene.Container#
   */
  interactiveChildren: !0,
  /**
   * Interaction shape. Children will be hit first, then this shape will be checked.
   * Setting this will cause this shape to be checked in hit tests rather than the container's bounds.
   * @example
   * import { Rectangle, Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite(texture);
   * sprite.interactive = true;
   * sprite.hitArea = new Rectangle(0, 0, 100, 100);
   * @member {IHitArea}
   * @memberof scene.Container#
   */
  hitArea: null,
  /**
   * Unlike `on` or `addListener` which are methods from EventEmitter, `addEventListener`
   * seeks to be compatible with the DOM's `addEventListener` with support for options.
   * @memberof scene.Container
   * @param type - The type of event to listen to.
   * @param listener - The listener callback or object.
   * @param options - Listener options, used for capture phase.
   * @example
   * // Tell the user whether they did a single, double, triple, or nth click.
   * button.addEventListener('click', {
   *     handleEvent(e): {
   *         let prefix;
   *
   *         switch (e.detail) {
   *             case 1: prefix = 'single'; break;
   *             case 2: prefix = 'double'; break;
   *             case 3: prefix = 'triple'; break;
   *             default: prefix = e.detail + 'th'; break;
   *         }
   *
   *         console.log('That was a ' + prefix + 'click');
   *     }
   * });
   *
   * // But skip the first click!
   * button.parent.addEventListener('click', function blockClickOnce(e) {
   *     e.stopImmediatePropagation();
   *     button.parent.removeEventListener('click', blockClickOnce, true);
   * }, {
   *     capture: true,
   * });
   */
  addEventListener(n, e, t) {
    const i = typeof t == "boolean" && t || typeof t == "object" && t.capture, o = typeof t == "object" ? t.signal : void 0, s = typeof t == "object" ? t.once === !0 : !1, d = typeof e == "function" ? void 0 : e;
    n = i ? `${n}capture` : n;
    const h = typeof e == "function" ? e : e.handleEvent, c = this;
    o && o.addEventListener("abort", () => {
      c.off(n, h, d);
    }), s ? c.once(n, h, d) : c.on(n, h, d);
  },
  /**
   * Unlike `off` or `removeListener` which are methods from EventEmitter, `removeEventListener`
   * seeks to be compatible with the DOM's `removeEventListener` with support for options.
   * @memberof scene.Container
   * @param type - The type of event the listener is bound to.
   * @param listener - The listener callback or object.
   * @param options - The original listener options. This is required to deregister a capture phase listener.
   */
  removeEventListener(n, e, t) {
    const i = typeof t == "boolean" && t || typeof t == "object" && t.capture, o = typeof e == "function" ? void 0 : e;
    n = i ? `${n}capture` : n, e = typeof e == "function" ? e : e.handleEvent, this.off(n, e, o);
  },
  /**
   * Dispatch the event on this {@link Container} using the event's {@link EventBoundary}.
   *
   * The target of the event is set to `this` and the `defaultPrevented` flag is cleared before dispatch.
   * @memberof scene.Container
   * @param e - The event to dispatch.
   * @returns Whether the {@link FederatedEvent.preventDefault preventDefault}() method was not invoked.
   * @example
   * // Reuse a click event!
   * button.dispatchEvent(clickEvent);
   */
  dispatchEvent(n) {
    if (!(n instanceof Y))
      throw new Error("Container cannot propagate events outside of the Federated Events API");
    return n.defaultPrevented = !1, n.path = null, n.target = this, n.manager.dispatchEvent(n), !n.defaultPrevented;
  }
};
U.add(z);
X.mixin(se);
U.add(K);
X.mixin(le);
//# sourceMappingURL=browserAll.js.map
