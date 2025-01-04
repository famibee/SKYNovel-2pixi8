import { P as v, m as b, U as A, E as I, w as g } from "./app2.js";
class _ {
  /**
   * @param manager - The event boundary which manages this event. Propagation can only occur
   *  within the boundary's jurisdiction.
   */
  constructor(t) {
    this.bubbles = !0, this.cancelBubble = !0, this.cancelable = !1, this.composed = !1, this.defaultPrevented = !1, this.eventPhase = _.prototype.NONE, this.propagationStopped = !1, this.propagationImmediatelyStopped = !1, this.layer = new v(), this.page = new v(), this.NONE = 0, this.CAPTURING_PHASE = 1, this.AT_TARGET = 2, this.BUBBLING_PHASE = 3, this.manager = t;
  }
  /** @readonly */
  get layerX() {
    return this.layer.x;
  }
  /** @readonly */
  get layerY() {
    return this.layer.y;
  }
  /** @readonly */
  get pageX() {
    return this.page.x;
  }
  /** @readonly */
  get pageY() {
    return this.page.y;
  }
  /**
   * Fallback for the deprecated @code{InteractionEvent.data}.
   * @deprecated since 7.0.0
   */
  get data() {
    return this;
  }
  /** The propagation path for this event. Alias for {@link EventBoundary.propagationPath}. */
  composedPath() {
    return this.manager && (!this.path || this.path[this.path.length - 1] !== this.target) && (this.path = this.target ? this.manager.propagationPath(this.target) : []), this.path;
  }
  /**
   * Unimplemented method included for implementing the DOM interface {@code Event}. It will throw an {@code Error}.
   * @deprecated
   * @param _type
   * @param _bubbles
   * @param _cancelable
   */
  initEvent(t, e, i) {
    throw new Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  /**
   * Unimplemented method included for implementing the DOM interface {@code UIEvent}. It will throw an {@code Error}.
   * @deprecated
   * @param _typeArg
   * @param _bubblesArg
   * @param _cancelableArg
   * @param _viewArg
   * @param _detailArg
   */
  initUIEvent(t, e, i, n, s) {
    throw new Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  /** Prevent default behavior of PixiJS and the user agent. */
  preventDefault() {
    this.nativeEvent instanceof Event && this.nativeEvent.cancelable && this.nativeEvent.preventDefault(), this.defaultPrevented = !0;
  }
  /**
   * Stop this event from propagating to any addition listeners, including on the
   * {@link FederatedEventTarget.currentTarget currentTarget} and also the following
   * event targets on the propagation path.
   */
  stopImmediatePropagation() {
    this.propagationImmediatelyStopped = !0;
  }
  /**
   * Stop this event from propagating to the next {@link FederatedEventTarget}. The rest of the listeners
   * on the {@link FederatedEventTarget.currentTarget currentTarget} will still be notified.
   */
  stopPropagation() {
    this.propagationStopped = !0;
  }
}
class M {
  constructor() {
    this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0;
  }
  /**
   * Initializes the event ticker.
   * @param events - The event system.
   */
  init(t) {
    this.removeTickerListener(), this.events = t, this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0;
  }
  /** Whether to pause the update checks or not. */
  get pauseUpdate() {
    return this._pauseUpdate;
  }
  set pauseUpdate(t) {
    this._pauseUpdate = t;
  }
  /** Adds the ticker listener. */
  addTickerListener() {
    this._tickerAdded || !this.domElement || (b.system.add(this._tickerUpdate, this, A.INTERACTION), this._tickerAdded = !0);
  }
  /** Removes the ticker listener. */
  removeTickerListener() {
    this._tickerAdded && (b.system.remove(this._tickerUpdate, this), this._tickerAdded = !1);
  }
  /** Sets flag to not fire extra events when the user has already moved there mouse */
  pointerMoved() {
    this._didMove = !0;
  }
  /** Updates the state of interactive objects. */
  _update() {
    if (!this.domElement || this._pauseUpdate)
      return;
    if (this._didMove) {
      this._didMove = !1;
      return;
    }
    const t = this.events._rootPointerEvent;
    this.events.supportsTouchEvents && t.pointerType === "touch" || globalThis.document.dispatchEvent(new PointerEvent("pointermove", {
      clientX: t.clientX,
      clientY: t.clientY,
      pointerType: t.pointerType,
      pointerId: t.pointerId
    }));
  }
  /**
   * Updates the state of interactive objects if at least {@link interactionFrequency}
   * milliseconds have passed since the last invocation.
   *
   * Invoked by a throttled ticker update from {@link Ticker.system}.
   * @param ticker - The throttled ticker.
   */
  _tickerUpdate(t) {
    this._deltaTime += t.deltaTime, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this._update());
  }
}
const P = new M();
class y extends _ {
  constructor() {
    super(...arguments), this.client = new v(), this.movement = new v(), this.offset = new v(), this.global = new v(), this.screen = new v();
  }
  /** @readonly */
  get clientX() {
    return this.client.x;
  }
  /** @readonly */
  get clientY() {
    return this.client.y;
  }
  /**
   * Alias for {@link FederatedMouseEvent.clientX this.clientX}.
   * @readonly
   */
  get x() {
    return this.clientX;
  }
  /**
   * Alias for {@link FederatedMouseEvent.clientY this.clientY}.
   * @readonly
   */
  get y() {
    return this.clientY;
  }
  /** @readonly */
  get movementX() {
    return this.movement.x;
  }
  /** @readonly */
  get movementY() {
    return this.movement.y;
  }
  /** @readonly */
  get offsetX() {
    return this.offset.x;
  }
  /** @readonly */
  get offsetY() {
    return this.offset.y;
  }
  /** @readonly */
  get globalX() {
    return this.global.x;
  }
  /** @readonly */
  get globalY() {
    return this.global.y;
  }
  /**
   * The pointer coordinates in the renderer's screen. Alias for {@code screen.x}.
   * @readonly
   */
  get screenX() {
    return this.screen.x;
  }
  /**
   * The pointer coordinates in the renderer's screen. Alias for {@code screen.y}.
   * @readonly
   */
  get screenY() {
    return this.screen.y;
  }
  /**
   * This will return the local coordinates of the specified container for this InteractionData
   * @param {Container} container - The Container that you would like the local
   *  coords off
   * @param {PointData} point - A Point object in which to store the value, optional (otherwise
   *  will create a new point)
   * @param {PointData} globalPos - A Point object containing your custom global coords, optional
   *  (otherwise will use the current global coords)
   * @returns - A point containing the coordinates of the InteractionData position relative
   *  to the Container
   */
  getLocalPosition(t, e, i) {
    return t.worldTransform.applyInverse(i || this.global, e);
  }
  /**
   * Whether the modifier key was pressed when this event natively occurred.
   * @param key - The modifier key.
   */
  getModifierState(t) {
    return "getModifierState" in this.nativeEvent && this.nativeEvent.getModifierState(t);
  }
  /**
   * Not supported.
   * @param _typeArg
   * @param _canBubbleArg
   * @param _cancelableArg
   * @param _viewArg
   * @param _detailArg
   * @param _screenXArg
   * @param _screenYArg
   * @param _clientXArg
   * @param _clientYArg
   * @param _ctrlKeyArg
   * @param _altKeyArg
   * @param _shiftKeyArg
   * @param _metaKeyArg
   * @param _buttonArg
   * @param _relatedTargetArg
   * @deprecated since 7.0.0
   */
  // eslint-disable-next-line max-params
  initMouseEvent(t, e, i, n, s, r, a, p, l, o, d, h, c, m, k) {
    throw new Error("Method not implemented.");
  }
}
class u extends y {
  constructor() {
    super(...arguments), this.width = 0, this.height = 0, this.isPrimary = !1;
  }
  // Only included for completeness for now
  getCoalescedEvents() {
    return this.type === "pointermove" || this.type === "mousemove" || this.type === "touchmove" ? [this] : [];
  }
  // Only included for completeness for now
  getPredictedEvents() {
    throw new Error("getPredictedEvents is not supported!");
  }
}
class f extends y {
  constructor() {
    super(...arguments), this.DOM_DELTA_PIXEL = 0, this.DOM_DELTA_LINE = 1, this.DOM_DELTA_PAGE = 2;
  }
}
f.DOM_DELTA_PIXEL = 0;
f.DOM_DELTA_LINE = 1;
f.DOM_DELTA_PAGE = 2;
const w = 2048, D = new v(), E = new v();
class O {
  /**
   * @param rootTarget - The holder of the event boundary.
   */
  constructor(t) {
    this.dispatch = new I(), this.moveOnAll = !1, this.enableGlobalMoveEvents = !0, this.mappingState = {
      trackingData: {}
    }, this.eventPool = /* @__PURE__ */ new Map(), this._allInteractiveElements = [], this._hitElements = [], this._isPointerMoveEvent = !1, this.rootTarget = t, this.hitPruneFn = this.hitPruneFn.bind(this), this.hitTestFn = this.hitTestFn.bind(this), this.mapPointerDown = this.mapPointerDown.bind(this), this.mapPointerMove = this.mapPointerMove.bind(this), this.mapPointerOut = this.mapPointerOut.bind(this), this.mapPointerOver = this.mapPointerOver.bind(this), this.mapPointerUp = this.mapPointerUp.bind(this), this.mapPointerUpOutside = this.mapPointerUpOutside.bind(this), this.mapWheel = this.mapWheel.bind(this), this.mappingTable = {}, this.addEventMapping("pointerdown", this.mapPointerDown), this.addEventMapping("pointermove", this.mapPointerMove), this.addEventMapping("pointerout", this.mapPointerOut), this.addEventMapping("pointerleave", this.mapPointerOut), this.addEventMapping("pointerover", this.mapPointerOver), this.addEventMapping("pointerup", this.mapPointerUp), this.addEventMapping("pointerupoutside", this.mapPointerUpOutside), this.addEventMapping("wheel", this.mapWheel);
  }
  /**
   * Adds an event mapping for the event `type` handled by `fn`.
   *
   * Event mappings can be used to implement additional or custom events. They take an event
   * coming from the upstream scene (or directly from the {@link EventSystem}) and dispatch new downstream events
   * generally trickling down and bubbling up to {@link EventBoundary.rootTarget this.rootTarget}.
   *
   * To modify the semantics of existing events, the built-in mapping methods of EventBoundary should be overridden
   * instead.
   * @param type - The type of upstream event to map.
   * @param fn - The mapping method. The context of this function must be bound manually, if desired.
   */
  addEventMapping(t, e) {
    this.mappingTable[t] || (this.mappingTable[t] = []), this.mappingTable[t].push({
      fn: e,
      priority: 0
    }), this.mappingTable[t].sort((i, n) => i.priority - n.priority);
  }
  /**
   * Dispatches the given event
   * @param e - The event to dispatch.
   * @param type - The type of event to dispatch. Defaults to `e.type`.
   */
  dispatchEvent(t, e) {
    t.propagationStopped = !1, t.propagationImmediatelyStopped = !1, this.propagate(t, e), this.dispatch.emit(e || t.type, t);
  }
  /**
   * Maps the given upstream event through the event boundary and propagates it downstream.
   * @param e - The event to map.
   */
  mapEvent(t) {
    if (!this.rootTarget)
      return;
    const e = this.mappingTable[t.type];
    if (e)
      for (let i = 0, n = e.length; i < n; i++)
        e[i].fn(t);
    else
      g(`[EventBoundary]: Event mapping not defined for ${t.type}`);
  }
  /**
   * Finds the Container that is the target of a event at the given coordinates.
   *
   * The passed (x,y) coordinates are in the world space above this event boundary.
   * @param x - The x coordinate of the event.
   * @param y - The y coordinate of the event.
   */
  hitTest(t, e) {
    P.pauseUpdate = !0;
    const n = this._isPointerMoveEvent && this.enableGlobalMoveEvents ? "hitTestMoveRecursive" : "hitTestRecursive", s = this[n](
      this.rootTarget,
      this.rootTarget.eventMode,
      D.set(t, e),
      this.hitTestFn,
      this.hitPruneFn
    );
    return s && s[0];
  }
  /**
   * Propagate the passed event from from {@link EventBoundary.rootTarget this.rootTarget} to its
   * target {@code e.target}.
   * @param e - The event to propagate.
   * @param type - The type of event to propagate. Defaults to `e.type`.
   */
  propagate(t, e) {
    if (!t.target)
      return;
    const i = t.composedPath();
    t.eventPhase = t.CAPTURING_PHASE;
    for (let n = 0, s = i.length - 1; n < s; n++)
      if (t.currentTarget = i[n], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped)
        return;
    if (t.eventPhase = t.AT_TARGET, t.currentTarget = t.target, this.notifyTarget(t, e), !(t.propagationStopped || t.propagationImmediatelyStopped)) {
      t.eventPhase = t.BUBBLING_PHASE;
      for (let n = i.length - 2; n >= 0; n--)
        if (t.currentTarget = i[n], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped)
          return;
    }
  }
  /**
   * Emits the event {@code e} to all interactive containers. The event is propagated in the bubbling phase always.
   *
   * This is used in the `globalpointermove` event.
   * @param e - The emitted event.
   * @param type - The listeners to notify.
   * @param targets - The targets to notify.
   */
  all(t, e, i = this._allInteractiveElements) {
    if (i.length === 0)
      return;
    t.eventPhase = t.BUBBLING_PHASE;
    const n = Array.isArray(e) ? e : [e];
    for (let s = i.length - 1; s >= 0; s--)
      n.forEach((r) => {
        t.currentTarget = i[s], this.notifyTarget(t, r);
      });
  }
  /**
   * Finds the propagation path from {@link EventBoundary.rootTarget rootTarget} to the passed
   * {@code target}. The last element in the path is {@code target}.
   * @param target - The target to find the propagation path to.
   */
  propagationPath(t) {
    const e = [t];
    for (let i = 0; i < w && t !== this.rootTarget && t.parent; i++) {
      if (!t.parent)
        throw new Error("Cannot find propagation path to disconnected target");
      e.push(t.parent), t = t.parent;
    }
    return e.reverse(), e;
  }
  hitTestMoveRecursive(t, e, i, n, s, r = !1) {
    let a = !1;
    if (this._interactivePrune(t))
      return null;
    if ((t.eventMode === "dynamic" || e === "dynamic") && (P.pauseUpdate = !1), t.interactiveChildren && t.children) {
      const o = t.children;
      for (let d = o.length - 1; d >= 0; d--) {
        const h = o[d], c = this.hitTestMoveRecursive(
          h,
          this._isInteractive(e) ? e : h.eventMode,
          i,
          n,
          s,
          r || s(t, i)
        );
        if (c) {
          if (c.length > 0 && !c[c.length - 1].parent)
            continue;
          const m = t.isInteractive();
          (c.length > 0 || m) && (m && this._allInteractiveElements.push(t), c.push(t)), this._hitElements.length === 0 && (this._hitElements = c), a = !0;
        }
      }
    }
    const p = this._isInteractive(e), l = t.isInteractive();
    return l && l && this._allInteractiveElements.push(t), r || this._hitElements.length > 0 ? null : a ? this._hitElements : p && !s(t, i) && n(t, i) ? l ? [t] : [] : null;
  }
  /**
   * Recursive implementation for {@link EventBoundary.hitTest hitTest}.
   * @param currentTarget - The Container that is to be hit tested.
   * @param eventMode - The event mode for the `currentTarget` or one of its parents.
   * @param location - The location that is being tested for overlap.
   * @param testFn - Callback that determines whether the target passes hit testing. This callback
   *  can assume that `pruneFn` failed to prune the container.
   * @param pruneFn - Callback that determiness whether the target and all of its children
   *  cannot pass the hit test. It is used as a preliminary optimization to prune entire subtrees
   *  of the scene graph.
   * @returns An array holding the hit testing target and all its ancestors in order. The first element
   *  is the target itself and the last is {@link EventBoundary.rootTarget rootTarget}. This is the opposite
   *  order w.r.t. the propagation path. If no hit testing target is found, null is returned.
   */
  hitTestRecursive(t, e, i, n, s) {
    if (this._interactivePrune(t) || s(t, i))
      return null;
    if ((t.eventMode === "dynamic" || e === "dynamic") && (P.pauseUpdate = !1), t.interactiveChildren && t.children) {
      const p = t.children, l = i;
      for (let o = p.length - 1; o >= 0; o--) {
        const d = p[o], h = this.hitTestRecursive(
          d,
          this._isInteractive(e) ? e : d.eventMode,
          l,
          n,
          s
        );
        if (h) {
          if (h.length > 0 && !h[h.length - 1].parent)
            continue;
          const c = t.isInteractive();
          return (h.length > 0 || c) && h.push(t), h;
        }
      }
    }
    const r = this._isInteractive(e), a = t.isInteractive();
    return r && n(t, i) ? a ? [t] : [] : null;
  }
  _isInteractive(t) {
    return t === "static" || t === "dynamic";
  }
  _interactivePrune(t) {
    return !t || !t.visible || !t.renderable || !t.measurable || t.eventMode === "none" || t.eventMode === "passive" && !t.interactiveChildren;
  }
  /**
   * Checks whether the container or any of its children cannot pass the hit test at all.
   *
   * {@link EventBoundary}'s implementation uses the {@link Container.hitArea hitArea}
   * and {@link Container._maskEffect} for pruning.
   * @param container - The container to prune.
   * @param location - The location to test for overlap.
   */
  hitPruneFn(t, e) {
    if (t.hitArea && (t.worldTransform.applyInverse(e, E), !t.hitArea.contains(E.x, E.y)))
      return !0;
    if (t.effects && t.effects.length)
      for (let i = 0; i < t.effects.length; i++) {
        const n = t.effects[i];
        if (n.containsPoint && !n.containsPoint(e, this.hitTestFn))
          return !0;
      }
    return !1;
  }
  /**
   * Checks whether the container passes hit testing for the given location.
   * @param container - The container to test.
   * @param location - The location to test for overlap.
   * @returns - Whether `container` passes hit testing for `location`.
   */
  hitTestFn(t, e) {
    return t.hitArea ? !0 : t?.containsPoint ? (t.worldTransform.applyInverse(e, E), t.containsPoint(E)) : !1;
  }
  /**
   * Notify all the listeners to the event's `currentTarget`.
   *
   * If the `currentTarget` contains the property `on<type>`, then it is called here,
   * simulating the behavior from version 6.x and prior.
   * @param e - The event passed to the target.
   * @param type - The type of event to notify. Defaults to `e.type`.
   */
  notifyTarget(t, e) {
    if (!t.currentTarget.isInteractive())
      return;
    e ?? (e = t.type);
    const i = `on${e}`;
    t.currentTarget[i]?.(t);
    const n = t.eventPhase === t.CAPTURING_PHASE || t.eventPhase === t.AT_TARGET ? `${e}capture` : e;
    this._notifyListeners(t, n), t.eventPhase === t.AT_TARGET && this._notifyListeners(t, e);
  }
  /**
   * Maps the upstream `pointerdown` events to a downstream `pointerdown` event.
   *
   * `touchstart`, `rightdown`, `mousedown` events are also dispatched for specific pointer types.
   * @param from - The upstream `pointerdown` event.
   */
  mapPointerDown(t) {
    if (!(t instanceof u)) {
      g("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.createPointerEvent(t);
    if (this.dispatchEvent(e, "pointerdown"), e.pointerType === "touch")
      this.dispatchEvent(e, "touchstart");
    else if (e.pointerType === "mouse" || e.pointerType === "pen") {
      const n = e.button === 2;
      this.dispatchEvent(e, n ? "rightdown" : "mousedown");
    }
    const i = this.trackingData(t.pointerId);
    i.pressTargetsByButton[t.button] = e.composedPath(), this.freeEvent(e);
  }
  /**
   * Maps the upstream `pointermove` to downstream `pointerout`, `pointerover`, and `pointermove` events, in that order.
   *
   * The tracking data for the specific pointer has an updated `overTarget`. `mouseout`, `mouseover`,
   * `mousemove`, and `touchmove` events are fired as well for specific pointer types.
   * @param from - The upstream `pointermove` event.
   */
  mapPointerMove(t) {
    if (!(t instanceof u)) {
      g("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    this._allInteractiveElements.length = 0, this._hitElements.length = 0, this._isPointerMoveEvent = !0;
    const e = this.createPointerEvent(t);
    this._isPointerMoveEvent = !1;
    const i = e.pointerType === "mouse" || e.pointerType === "pen", n = this.trackingData(t.pointerId), s = this.findMountedTarget(n.overTargets);
    if (n.overTargets?.length > 0 && s !== e.target) {
      const p = t.type === "mousemove" ? "mouseout" : "pointerout", l = this.createPointerEvent(t, p, s);
      if (this.dispatchEvent(l, "pointerout"), i && this.dispatchEvent(l, "mouseout"), !e.composedPath().includes(s)) {
        const o = this.createPointerEvent(t, "pointerleave", s);
        for (o.eventPhase = o.AT_TARGET; o.target && !e.composedPath().includes(o.target); )
          o.currentTarget = o.target, this.notifyTarget(o), i && this.notifyTarget(o, "mouseleave"), o.target = o.target.parent;
        this.freeEvent(o);
      }
      this.freeEvent(l);
    }
    if (s !== e.target) {
      const p = t.type === "mousemove" ? "mouseover" : "pointerover", l = this.clonePointerEvent(e, p);
      this.dispatchEvent(l, "pointerover"), i && this.dispatchEvent(l, "mouseover");
      let o = s?.parent;
      for (; o && o !== this.rootTarget.parent && o !== e.target; )
        o = o.parent;
      if (!o || o === this.rootTarget.parent) {
        const h = this.clonePointerEvent(e, "pointerenter");
        for (h.eventPhase = h.AT_TARGET; h.target && h.target !== s && h.target !== this.rootTarget.parent; )
          h.currentTarget = h.target, this.notifyTarget(h), i && this.notifyTarget(h, "mouseenter"), h.target = h.target.parent;
        this.freeEvent(h);
      }
      this.freeEvent(l);
    }
    const r = [], a = this.enableGlobalMoveEvents ?? !0;
    this.moveOnAll ? r.push("pointermove") : this.dispatchEvent(e, "pointermove"), a && r.push("globalpointermove"), e.pointerType === "touch" && (this.moveOnAll ? r.splice(1, 0, "touchmove") : this.dispatchEvent(e, "touchmove"), a && r.push("globaltouchmove")), i && (this.moveOnAll ? r.splice(1, 0, "mousemove") : this.dispatchEvent(e, "mousemove"), a && r.push("globalmousemove"), this.cursor = e.target?.cursor), r.length > 0 && this.all(e, r), this._allInteractiveElements.length = 0, this._hitElements.length = 0, n.overTargets = e.composedPath(), this.freeEvent(e);
  }
  /**
   * Maps the upstream `pointerover` to downstream `pointerover` and `pointerenter` events, in that order.
   *
   * The tracking data for the specific pointer gets a new `overTarget`.
   * @param from - The upstream `pointerover` event.
   */
  mapPointerOver(t) {
    if (!(t instanceof u)) {
      g("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.trackingData(t.pointerId), i = this.createPointerEvent(t), n = i.pointerType === "mouse" || i.pointerType === "pen";
    this.dispatchEvent(i, "pointerover"), n && this.dispatchEvent(i, "mouseover"), i.pointerType === "mouse" && (this.cursor = i.target?.cursor);
    const s = this.clonePointerEvent(i, "pointerenter");
    for (s.eventPhase = s.AT_TARGET; s.target && s.target !== this.rootTarget.parent; )
      s.currentTarget = s.target, this.notifyTarget(s), n && this.notifyTarget(s, "mouseenter"), s.target = s.target.parent;
    e.overTargets = i.composedPath(), this.freeEvent(i), this.freeEvent(s);
  }
  /**
   * Maps the upstream `pointerout` to downstream `pointerout`, `pointerleave` events, in that order.
   *
   * The tracking data for the specific pointer is cleared of a `overTarget`.
   * @param from - The upstream `pointerout` event.
   */
  mapPointerOut(t) {
    if (!(t instanceof u)) {
      g("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.trackingData(t.pointerId);
    if (e.overTargets) {
      const i = t.pointerType === "mouse" || t.pointerType === "pen", n = this.findMountedTarget(e.overTargets), s = this.createPointerEvent(t, "pointerout", n);
      this.dispatchEvent(s), i && this.dispatchEvent(s, "mouseout");
      const r = this.createPointerEvent(t, "pointerleave", n);
      for (r.eventPhase = r.AT_TARGET; r.target && r.target !== this.rootTarget.parent; )
        r.currentTarget = r.target, this.notifyTarget(r), i && this.notifyTarget(r, "mouseleave"), r.target = r.target.parent;
      e.overTargets = null, this.freeEvent(s), this.freeEvent(r);
    }
    this.cursor = null;
  }
  /**
   * Maps the upstream `pointerup` event to downstream `pointerup`, `pointerupoutside`,
   * and `click`/`rightclick`/`pointertap` events, in that order.
   *
   * The `pointerupoutside` event bubbles from the original `pointerdown` target to the most specific
   * ancestor of the `pointerdown` and `pointerup` targets, which is also the `click` event's target. `touchend`,
   * `rightup`, `mouseup`, `touchendoutside`, `rightupoutside`, `mouseupoutside`, and `tap` are fired as well for
   * specific pointer types.
   * @param from - The upstream `pointerup` event.
   */
  mapPointerUp(t) {
    if (!(t instanceof u)) {
      g("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = performance.now(), i = this.createPointerEvent(t);
    if (this.dispatchEvent(i, "pointerup"), i.pointerType === "touch")
      this.dispatchEvent(i, "touchend");
    else if (i.pointerType === "mouse" || i.pointerType === "pen") {
      const a = i.button === 2;
      this.dispatchEvent(i, a ? "rightup" : "mouseup");
    }
    const n = this.trackingData(t.pointerId), s = this.findMountedTarget(n.pressTargetsByButton[t.button]);
    let r = s;
    if (s && !i.composedPath().includes(s)) {
      let a = s;
      for (; a && !i.composedPath().includes(a); ) {
        if (i.currentTarget = a, this.notifyTarget(i, "pointerupoutside"), i.pointerType === "touch")
          this.notifyTarget(i, "touchendoutside");
        else if (i.pointerType === "mouse" || i.pointerType === "pen") {
          const p = i.button === 2;
          this.notifyTarget(i, p ? "rightupoutside" : "mouseupoutside");
        }
        a = a.parent;
      }
      delete n.pressTargetsByButton[t.button], r = a;
    }
    if (r) {
      const a = this.clonePointerEvent(i, "click");
      a.target = r, a.path = null, n.clicksByButton[t.button] || (n.clicksByButton[t.button] = {
        clickCount: 0,
        target: a.target,
        timeStamp: e
      });
      const p = n.clicksByButton[t.button];
      if (p.target === a.target && e - p.timeStamp < 200 ? ++p.clickCount : p.clickCount = 1, p.target = a.target, p.timeStamp = e, a.detail = p.clickCount, a.pointerType === "mouse") {
        const l = a.button === 2;
        this.dispatchEvent(a, l ? "rightclick" : "click");
      } else a.pointerType === "touch" && this.dispatchEvent(a, "tap");
      this.dispatchEvent(a, "pointertap"), this.freeEvent(a);
    }
    this.freeEvent(i);
  }
  /**
   * Maps the upstream `pointerupoutside` event to a downstream `pointerupoutside` event, bubbling from the original
   * `pointerdown` target to `rootTarget`.
   *
   * (The most specific ancestor of the `pointerdown` event and the `pointerup` event must the
   * `{@link EventBoundary}'s root because the `pointerup` event occurred outside of the boundary.)
   *
   * `touchendoutside`, `mouseupoutside`, and `rightupoutside` events are fired as well for specific pointer
   * types. The tracking data for the specific pointer is cleared of a `pressTarget`.
   * @param from - The upstream `pointerupoutside` event.
   */
  mapPointerUpOutside(t) {
    if (!(t instanceof u)) {
      g("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.trackingData(t.pointerId), i = this.findMountedTarget(e.pressTargetsByButton[t.button]), n = this.createPointerEvent(t);
    if (i) {
      let s = i;
      for (; s; )
        n.currentTarget = s, this.notifyTarget(n, "pointerupoutside"), n.pointerType === "touch" ? this.notifyTarget(n, "touchendoutside") : (n.pointerType === "mouse" || n.pointerType === "pen") && this.notifyTarget(n, n.button === 2 ? "rightupoutside" : "mouseupoutside"), s = s.parent;
      delete e.pressTargetsByButton[t.button];
    }
    this.freeEvent(n);
  }
  /**
   * Maps the upstream `wheel` event to a downstream `wheel` event.
   * @param from - The upstream `wheel` event.
   */
  mapWheel(t) {
    if (!(t instanceof f)) {
      g("EventBoundary cannot map a non-wheel event as a wheel event");
      return;
    }
    const e = this.createWheelEvent(t);
    this.dispatchEvent(e), this.freeEvent(e);
  }
  /**
   * Finds the most specific event-target in the given propagation path that is still mounted in the scene graph.
   *
   * This is used to find the correct `pointerup` and `pointerout` target in the case that the original `pointerdown`
   * or `pointerover` target was unmounted from the scene graph.
   * @param propagationPath - The propagation path was valid in the past.
   * @returns - The most specific event-target still mounted at the same location in the scene graph.
   */
  findMountedTarget(t) {
    if (!t)
      return null;
    let e = t[0];
    for (let i = 1; i < t.length && t[i].parent === e; i++)
      e = t[i];
    return e;
  }
  /**
   * Creates an event whose {@code originalEvent} is {@code from}, with an optional `type` and `target` override.
   *
   * The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The {@code originalEvent} for the returned event.
   * @param [type=from.type] - The type of the returned event.
   * @param target - The target of the returned event.
   */
  createPointerEvent(t, e, i) {
    const n = this.allocateEvent(u);
    return this.copyPointerData(t, n), this.copyMouseData(t, n), this.copyData(t, n), n.nativeEvent = t.nativeEvent, n.originalEvent = t, n.target = i ?? this.hitTest(n.global.x, n.global.y) ?? this._hitElements[0], typeof e == "string" && (n.type = e), n;
  }
  /**
   * Creates a wheel event whose {@code originalEvent} is {@code from}.
   *
   * The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The upstream wheel event.
   */
  createWheelEvent(t) {
    const e = this.allocateEvent(f);
    return this.copyWheelData(t, e), this.copyMouseData(t, e), this.copyData(t, e), e.nativeEvent = t.nativeEvent, e.originalEvent = t, e.target = this.hitTest(e.global.x, e.global.y), e;
  }
  /**
   * Clones the event {@code from}, with an optional {@code type} override.
   *
   * The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The event to clone.
   * @param [type=from.type] - The type of the returned event.
   */
  clonePointerEvent(t, e) {
    const i = this.allocateEvent(u);
    return i.nativeEvent = t.nativeEvent, i.originalEvent = t.originalEvent, this.copyPointerData(t, i), this.copyMouseData(t, i), this.copyData(t, i), i.target = t.target, i.path = t.composedPath().slice(), i.type = e ?? i.type, i;
  }
  /**
   * Copies wheel {@link FederatedWheelEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + deltaMode
   * + deltaX
   * + deltaY
   * + deltaZ
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyWheelData(t, e) {
    e.deltaMode = t.deltaMode, e.deltaX = t.deltaX, e.deltaY = t.deltaY, e.deltaZ = t.deltaZ;
  }
  /**
   * Copies pointer {@link FederatedPointerEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + pointerId
   * + width
   * + height
   * + isPrimary
   * + pointerType
   * + pressure
   * + tangentialPressure
   * + tiltX
   * + tiltY
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyPointerData(t, e) {
    t instanceof u && e instanceof u && (e.pointerId = t.pointerId, e.width = t.width, e.height = t.height, e.isPrimary = t.isPrimary, e.pointerType = t.pointerType, e.pressure = t.pressure, e.tangentialPressure = t.tangentialPressure, e.tiltX = t.tiltX, e.tiltY = t.tiltY, e.twist = t.twist);
  }
  /**
   * Copies mouse {@link FederatedMouseEvent} data from {@code from} to {@code to}.
   *
   * The following properties are copied:
   * + altKey
   * + button
   * + buttons
   * + clientX
   * + clientY
   * + metaKey
   * + movementX
   * + movementY
   * + pageX
   * + pageY
   * + x
   * + y
   * + screen
   * + shiftKey
   * + global
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyMouseData(t, e) {
    t instanceof y && e instanceof y && (e.altKey = t.altKey, e.button = t.button, e.buttons = t.buttons, e.client.copyFrom(t.client), e.ctrlKey = t.ctrlKey, e.metaKey = t.metaKey, e.movement.copyFrom(t.movement), e.screen.copyFrom(t.screen), e.shiftKey = t.shiftKey, e.global.copyFrom(t.global));
  }
  /**
   * Copies base {@link FederatedEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + isTrusted
   * + srcElement
   * + timeStamp
   * + type
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyData(t, e) {
    e.isTrusted = t.isTrusted, e.srcElement = t.srcElement, e.timeStamp = performance.now(), e.type = t.type, e.detail = t.detail, e.view = t.view, e.which = t.which, e.layer.copyFrom(t.layer), e.page.copyFrom(t.page);
  }
  /**
   * @param id - The pointer ID.
   * @returns The tracking data stored for the given pointer. If no data exists, a blank
   *  state will be created.
   */
  trackingData(t) {
    return this.mappingState.trackingData[t] || (this.mappingState.trackingData[t] = {
      pressTargetsByButton: {},
      clicksByButton: {},
      overTarget: null
    }), this.mappingState.trackingData[t];
  }
  /**
   * Allocate a specific type of event from {@link EventBoundary#eventPool this.eventPool}.
   *
   * This allocation is constructor-agnostic, as long as it only takes one argument - this event
   * boundary.
   * @param constructor - The event's constructor.
   */
  allocateEvent(t) {
    this.eventPool.has(t) || this.eventPool.set(t, []);
    const e = this.eventPool.get(t).pop() || new t(this);
    return e.eventPhase = e.NONE, e.currentTarget = null, e.defaultPrevented = !1, e.path = null, e.target = null, e;
  }
  /**
   * Frees the event and puts it back into the event pool.
   *
   * It is illegal to reuse the event until it is allocated again, using `this.allocateEvent`.
   *
   * It is also advised that events not allocated from {@link EventBoundary#allocateEvent this.allocateEvent}
   * not be freed. This is because of the possibility that the same event is freed twice, which can cause
   * it to be allocated twice & result in overwriting.
   * @param event - The event to be freed.
   * @throws Error if the event is managed by another event boundary.
   */
  freeEvent(t) {
    if (t.manager !== this)
      throw new Error("It is illegal to free an event not managed by this EventBoundary!");
    const e = t.constructor;
    this.eventPool.has(e) || this.eventPool.set(e, []), this.eventPool.get(e).push(t);
  }
  /**
   * Similar to {@link EventEmitter.emit}, except it stops if the `propagationImmediatelyStopped` flag
   * is set on the event.
   * @param e - The event to call each listener with.
   * @param type - The event key.
   */
  _notifyListeners(t, e) {
    const i = t.currentTarget._events[e];
    if (i)
      if ("fn" in i)
        i.once && t.currentTarget.removeListener(e, i.fn, void 0, !0), i.fn.call(i.context, t);
      else
        for (let n = 0, s = i.length; n < s && !t.propagationImmediatelyStopped; n++)
          i[n].once && t.currentTarget.removeListener(e, i[n].fn, void 0, !0), i[n].fn.call(i[n].context, t);
  }
}
export {
  O as E,
  u as F,
  _ as a,
  P as b,
  f as c
};
//# sourceMappingURL=EventBoundary.js.map
