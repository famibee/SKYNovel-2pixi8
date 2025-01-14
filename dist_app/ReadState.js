import { b as w, E as wt, C as ut, a as bt, k as yt, l as kt } from "./app2.js";
import { F as Et, E as Tt } from "./EventBoundary.js";
var B = Object.freeze({
  Linear: Object.freeze({
    None: function(e) {
      return e;
    },
    In: function(e) {
      return e;
    },
    Out: function(e) {
      return e;
    },
    InOut: function(e) {
      return e;
    }
  }),
  Quadratic: Object.freeze({
    In: function(e) {
      return e * e;
    },
    Out: function(e) {
      return e * (2 - e);
    },
    InOut: function(e) {
      return (e *= 2) < 1 ? 0.5 * e * e : -0.5 * (--e * (e - 2) - 1);
    }
  }),
  Cubic: Object.freeze({
    In: function(e) {
      return e * e * e;
    },
    Out: function(e) {
      return --e * e * e + 1;
    },
    InOut: function(e) {
      return (e *= 2) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2);
    }
  }),
  Quartic: Object.freeze({
    In: function(e) {
      return e * e * e * e;
    },
    Out: function(e) {
      return 1 - --e * e * e * e;
    },
    InOut: function(e) {
      return (e *= 2) < 1 ? 0.5 * e * e * e * e : -0.5 * ((e -= 2) * e * e * e - 2);
    }
  }),
  Quintic: Object.freeze({
    In: function(e) {
      return e * e * e * e * e;
    },
    Out: function(e) {
      return --e * e * e * e * e + 1;
    },
    InOut: function(e) {
      return (e *= 2) < 1 ? 0.5 * e * e * e * e * e : 0.5 * ((e -= 2) * e * e * e * e + 2);
    }
  }),
  Sinusoidal: Object.freeze({
    In: function(e) {
      return 1 - Math.sin((1 - e) * Math.PI / 2);
    },
    Out: function(e) {
      return Math.sin(e * Math.PI / 2);
    },
    InOut: function(e) {
      return 0.5 * (1 - Math.sin(Math.PI * (0.5 - e)));
    }
  }),
  Exponential: Object.freeze({
    In: function(e) {
      return e === 0 ? 0 : Math.pow(1024, e - 1);
    },
    Out: function(e) {
      return e === 1 ? 1 : 1 - Math.pow(2, -10 * e);
    },
    InOut: function(e) {
      return e === 0 ? 0 : e === 1 ? 1 : (e *= 2) < 1 ? 0.5 * Math.pow(1024, e - 1) : 0.5 * (-Math.pow(2, -10 * (e - 1)) + 2);
    }
  }),
  Circular: Object.freeze({
    In: function(e) {
      return 1 - Math.sqrt(1 - e * e);
    },
    Out: function(e) {
      return Math.sqrt(1 - --e * e);
    },
    InOut: function(e) {
      return (e *= 2) < 1 ? -0.5 * (Math.sqrt(1 - e * e) - 1) : 0.5 * (Math.sqrt(1 - (e -= 2) * e) + 1);
    }
  }),
  Elastic: Object.freeze({
    In: function(e) {
      return e === 0 ? 0 : e === 1 ? 1 : -Math.pow(2, 10 * (e - 1)) * Math.sin((e - 1.1) * 5 * Math.PI);
    },
    Out: function(e) {
      return e === 0 ? 0 : e === 1 ? 1 : Math.pow(2, -10 * e) * Math.sin((e - 0.1) * 5 * Math.PI) + 1;
    },
    InOut: function(e) {
      return e === 0 ? 0 : e === 1 ? 1 : (e *= 2, e < 1 ? -0.5 * Math.pow(2, 10 * (e - 1)) * Math.sin((e - 1.1) * 5 * Math.PI) : 0.5 * Math.pow(2, -10 * (e - 1)) * Math.sin((e - 1.1) * 5 * Math.PI) + 1);
    }
  }),
  Back: Object.freeze({
    In: function(e) {
      var t = 1.70158;
      return e === 1 ? 1 : e * e * ((t + 1) * e - t);
    },
    Out: function(e) {
      var t = 1.70158;
      return e === 0 ? 0 : --e * e * ((t + 1) * e + t) + 1;
    },
    InOut: function(e) {
      var t = 2.5949095;
      return (e *= 2) < 1 ? 0.5 * (e * e * ((t + 1) * e - t)) : 0.5 * ((e -= 2) * e * ((t + 1) * e + t) + 2);
    }
  }),
  Bounce: Object.freeze({
    In: function(e) {
      return 1 - B.Bounce.Out(1 - e);
    },
    Out: function(e) {
      return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375 : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
    },
    InOut: function(e) {
      return e < 0.5 ? B.Bounce.In(e * 2) * 0.5 : B.Bounce.Out(e * 2 - 1) * 0.5 + 0.5;
    }
  }),
  generatePow: function(e) {
    return e === void 0 && (e = 4), e = e < Number.EPSILON ? Number.EPSILON : e, e = e > 1e4 ? 1e4 : e, {
      In: function(t) {
        return Math.pow(t, e);
      },
      Out: function(t) {
        return 1 - Math.pow(1 - t, e);
      },
      InOut: function(t) {
        return t < 0.5 ? Math.pow(t * 2, e) / 2 : (1 - Math.pow(2 - t * 2, e)) / 2 + 0.5;
      }
    };
  }
}), D = function() {
  return performance.now();
}, xt = (
  /** @class */
  function() {
    function e() {
      this._tweens = {}, this._tweensAddedDuringUpdate = {};
    }
    return e.prototype.getAll = function() {
      var t = this;
      return Object.keys(this._tweens).map(function(i) {
        return t._tweens[i];
      });
    }, e.prototype.removeAll = function() {
      this._tweens = {};
    }, e.prototype.add = function(t) {
      this._tweens[t.getId()] = t, this._tweensAddedDuringUpdate[t.getId()] = t;
    }, e.prototype.remove = function(t) {
      delete this._tweens[t.getId()], delete this._tweensAddedDuringUpdate[t.getId()];
    }, e.prototype.update = function(t, i) {
      t === void 0 && (t = D()), i === void 0 && (i = !1);
      var s = Object.keys(this._tweens);
      if (s.length === 0)
        return !1;
      for (; s.length > 0; ) {
        this._tweensAddedDuringUpdate = {};
        for (var n = 0; n < s.length; n++) {
          var r = this._tweens[s[n]], a = !i;
          r && r.update(t, a) === !1 && !i && delete this._tweens[s[n]];
        }
        s = Object.keys(this._tweensAddedDuringUpdate);
      }
      return !0;
    }, e;
  }()
), O = {
  Linear: function(e, t) {
    var i = e.length - 1, s = i * t, n = Math.floor(s), r = O.Utils.Linear;
    return t < 0 ? r(e[0], e[1], s) : t > 1 ? r(e[i], e[i - 1], i - s) : r(e[n], e[n + 1 > i ? i : n + 1], s - n);
  },
  Bezier: function(e, t) {
    for (var i = 0, s = e.length - 1, n = Math.pow, r = O.Utils.Bernstein, a = 0; a <= s; a++)
      i += n(1 - t, s - a) * n(t, a) * e[a] * r(s, a);
    return i;
  },
  CatmullRom: function(e, t) {
    var i = e.length - 1, s = i * t, n = Math.floor(s), r = O.Utils.CatmullRom;
    return e[0] === e[i] ? (t < 0 && (n = Math.floor(s = i * (1 + t))), r(e[(n - 1 + i) % i], e[n], e[(n + 1) % i], e[(n + 2) % i], s - n)) : t < 0 ? e[0] - (r(e[0], e[0], e[1], e[1], -s) - e[0]) : t > 1 ? e[i] - (r(e[i], e[i], e[i - 1], e[i - 1], s - i) - e[i]) : r(e[n ? n - 1 : 0], e[n], e[i < n + 1 ? i : n + 1], e[i < n + 2 ? i : n + 2], s - n);
  },
  Utils: {
    Linear: function(e, t, i) {
      return (t - e) * i + e;
    },
    Bernstein: function(e, t) {
      var i = O.Utils.Factorial;
      return i(e) / i(t) / i(e - t);
    },
    Factorial: /* @__PURE__ */ function() {
      var e = [1];
      return function(t) {
        var i = 1;
        if (e[t])
          return e[t];
        for (var s = t; s > 1; s--)
          i *= s;
        return e[t] = i, i;
      };
    }(),
    CatmullRom: function(e, t, i, s, n) {
      var r = (i - e) * 0.5, a = (s - t) * 0.5, o = n * n, h = n * o;
      return (2 * t - 2 * i + r + a) * h + (-3 * t + 3 * i - 2 * r - a) * o + r * n + t;
    }
  }
}, Pt = (
  /** @class */
  function() {
    function e() {
    }
    return e.nextId = function() {
      return e._nextId++;
    }, e._nextId = 0, e;
  }()
), Y = new xt(), Ct = (
  /** @class */
  function() {
    function e(t, i) {
      i === void 0 && (i = Y), this._object = t, this._group = i, this._isPaused = !1, this._pauseStart = 0, this._valuesStart = {}, this._valuesEnd = {}, this._valuesStartRepeat = {}, this._duration = 1e3, this._isDynamic = !1, this._initialRepeat = 0, this._repeat = 0, this._yoyo = !1, this._isPlaying = !1, this._reversed = !1, this._delayTime = 0, this._startTime = 0, this._easingFunction = B.Linear.None, this._interpolationFunction = O.Linear, this._chainedTweens = [], this._onStartCallbackFired = !1, this._onEveryStartCallbackFired = !1, this._id = Pt.nextId(), this._isChainStopped = !1, this._propertiesAreSetUp = !1, this._goToEnd = !1;
    }
    return e.prototype.getId = function() {
      return this._id;
    }, e.prototype.isPlaying = function() {
      return this._isPlaying;
    }, e.prototype.isPaused = function() {
      return this._isPaused;
    }, e.prototype.getDuration = function() {
      return this._duration;
    }, e.prototype.to = function(t, i) {
      if (i === void 0 && (i = 1e3), this._isPlaying)
        throw new Error("Can not call Tween.to() while Tween is already started or paused. Stop the Tween first.");
      return this._valuesEnd = t, this._propertiesAreSetUp = !1, this._duration = i < 0 ? 0 : i, this;
    }, e.prototype.duration = function(t) {
      return t === void 0 && (t = 1e3), this._duration = t < 0 ? 0 : t, this;
    }, e.prototype.dynamic = function(t) {
      return t === void 0 && (t = !1), this._isDynamic = t, this;
    }, e.prototype.start = function(t, i) {
      if (t === void 0 && (t = D()), i === void 0 && (i = !1), this._isPlaying)
        return this;
      if (this._group && this._group.add(this), this._repeat = this._initialRepeat, this._reversed) {
        this._reversed = !1;
        for (var s in this._valuesStartRepeat)
          this._swapEndStartRepeatValues(s), this._valuesStart[s] = this._valuesStartRepeat[s];
      }
      if (this._isPlaying = !0, this._isPaused = !1, this._onStartCallbackFired = !1, this._onEveryStartCallbackFired = !1, this._isChainStopped = !1, this._startTime = t, this._startTime += this._delayTime, !this._propertiesAreSetUp || i) {
        if (this._propertiesAreSetUp = !0, !this._isDynamic) {
          var n = {};
          for (var r in this._valuesEnd)
            n[r] = this._valuesEnd[r];
          this._valuesEnd = n;
        }
        this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat, i);
      }
      return this;
    }, e.prototype.startFromCurrentValues = function(t) {
      return this.start(t, !0);
    }, e.prototype._setupProperties = function(t, i, s, n, r) {
      for (var a in s) {
        var o = t[a], h = Array.isArray(o), T = h ? "array" : typeof o, b = !h && Array.isArray(s[a]);
        if (!(T === "undefined" || T === "function")) {
          if (b) {
            var _ = s[a];
            if (_.length === 0)
              continue;
            for (var C = [o], p = 0, R = _.length; p < R; p += 1) {
              var $ = this._handleRelativeValue(o, _[p]);
              if (isNaN($)) {
                b = !1, console.warn("Found invalid interpolation list. Skipping.");
                break;
              }
              C.push($);
            }
            b && (s[a] = C);
          }
          if ((T === "object" || h) && o && !b) {
            i[a] = h ? [] : {};
            var j = o;
            for (var F in j)
              i[a][F] = j[F];
            n[a] = h ? [] : {};
            var _ = s[a];
            if (!this._isDynamic) {
              var m = {};
              for (var F in _)
                m[F] = _[F];
              s[a] = _ = m;
            }
            this._setupProperties(j, i[a], _, n[a], r);
          } else
            (typeof i[a] > "u" || r) && (i[a] = o), h || (i[a] *= 1), b ? n[a] = s[a].slice().reverse() : n[a] = i[a] || 0;
        }
      }
    }, e.prototype.stop = function() {
      return this._isChainStopped || (this._isChainStopped = !0, this.stopChainedTweens()), this._isPlaying ? (this._group && this._group.remove(this), this._isPlaying = !1, this._isPaused = !1, this._onStopCallback && this._onStopCallback(this._object), this) : this;
    }, e.prototype.end = function() {
      return this._goToEnd = !0, this.update(1 / 0), this;
    }, e.prototype.pause = function(t) {
      return t === void 0 && (t = D()), this._isPaused || !this._isPlaying ? this : (this._isPaused = !0, this._pauseStart = t, this._group && this._group.remove(this), this);
    }, e.prototype.resume = function(t) {
      return t === void 0 && (t = D()), !this._isPaused || !this._isPlaying ? this : (this._isPaused = !1, this._startTime += t - this._pauseStart, this._pauseStart = 0, this._group && this._group.add(this), this);
    }, e.prototype.stopChainedTweens = function() {
      for (var t = 0, i = this._chainedTweens.length; t < i; t++)
        this._chainedTweens[t].stop();
      return this;
    }, e.prototype.group = function(t) {
      return t === void 0 && (t = Y), this._group = t, this;
    }, e.prototype.delay = function(t) {
      return t === void 0 && (t = 0), this._delayTime = t, this;
    }, e.prototype.repeat = function(t) {
      return t === void 0 && (t = 0), this._initialRepeat = t, this._repeat = t, this;
    }, e.prototype.repeatDelay = function(t) {
      return this._repeatDelayTime = t, this;
    }, e.prototype.yoyo = function(t) {
      return t === void 0 && (t = !1), this._yoyo = t, this;
    }, e.prototype.easing = function(t) {
      return t === void 0 && (t = B.Linear.None), this._easingFunction = t, this;
    }, e.prototype.interpolation = function(t) {
      return t === void 0 && (t = O.Linear), this._interpolationFunction = t, this;
    }, e.prototype.chain = function() {
      for (var t = [], i = 0; i < arguments.length; i++)
        t[i] = arguments[i];
      return this._chainedTweens = t, this;
    }, e.prototype.onStart = function(t) {
      return this._onStartCallback = t, this;
    }, e.prototype.onEveryStart = function(t) {
      return this._onEveryStartCallback = t, this;
    }, e.prototype.onUpdate = function(t) {
      return this._onUpdateCallback = t, this;
    }, e.prototype.onRepeat = function(t) {
      return this._onRepeatCallback = t, this;
    }, e.prototype.onComplete = function(t) {
      return this._onCompleteCallback = t, this;
    }, e.prototype.onStop = function(t) {
      return this._onStopCallback = t, this;
    }, e.prototype.update = function(t, i) {
      var s = this, n;
      if (t === void 0 && (t = D()), i === void 0 && (i = !0), this._isPaused)
        return !0;
      var r, a = this._startTime + this._duration;
      if (!this._goToEnd && !this._isPlaying) {
        if (t > a)
          return !1;
        i && this.start(t, !0);
      }
      if (this._goToEnd = !1, t < this._startTime)
        return !0;
      this._onStartCallbackFired === !1 && (this._onStartCallback && this._onStartCallback(this._object), this._onStartCallbackFired = !0), this._onEveryStartCallbackFired === !1 && (this._onEveryStartCallback && this._onEveryStartCallback(this._object), this._onEveryStartCallbackFired = !0);
      var o = t - this._startTime, h = this._duration + ((n = this._repeatDelayTime) !== null && n !== void 0 ? n : this._delayTime), T = this._duration + this._repeat * h, b = function() {
        if (s._duration === 0 || o > T)
          return 1;
        var j = Math.trunc(o / h), F = o - j * h, m = Math.min(F / s._duration, 1);
        return m === 0 && o === s._duration ? 1 : m;
      }, _ = b(), C = this._easingFunction(_);
      if (this._updateProperties(this._object, this._valuesStart, this._valuesEnd, C), this._onUpdateCallback && this._onUpdateCallback(this._object, _), this._duration === 0 || o >= this._duration)
        if (this._repeat > 0) {
          var p = Math.min(Math.trunc((o - this._duration) / h) + 1, this._repeat);
          isFinite(this._repeat) && (this._repeat -= p);
          for (r in this._valuesStartRepeat)
            !this._yoyo && typeof this._valuesEnd[r] == "string" && (this._valuesStartRepeat[r] = // eslint-disable-next-line
            // @ts-ignore FIXME?
            this._valuesStartRepeat[r] + parseFloat(this._valuesEnd[r])), this._yoyo && this._swapEndStartRepeatValues(r), this._valuesStart[r] = this._valuesStartRepeat[r];
          return this._yoyo && (this._reversed = !this._reversed), this._startTime += h * p, this._onRepeatCallback && this._onRepeatCallback(this._object), this._onEveryStartCallbackFired = !1, !0;
        } else {
          this._onCompleteCallback && this._onCompleteCallback(this._object);
          for (var R = 0, $ = this._chainedTweens.length; R < $; R++)
            this._chainedTweens[R].start(this._startTime + this._duration, !1);
          return this._isPlaying = !1, !1;
        }
      return !0;
    }, e.prototype._updateProperties = function(t, i, s, n) {
      for (var r in s)
        if (i[r] !== void 0) {
          var a = i[r] || 0, o = s[r], h = Array.isArray(t[r]), T = Array.isArray(o), b = !h && T;
          b ? t[r] = this._interpolationFunction(o, n) : typeof o == "object" && o ? this._updateProperties(t[r], a, o, n) : (o = this._handleRelativeValue(a, o), typeof o == "number" && (t[r] = a + (o - a) * n));
        }
    }, e.prototype._handleRelativeValue = function(t, i) {
      return typeof i != "string" ? i : i.charAt(0) === "+" || i.charAt(0) === "-" ? t + parseFloat(i) : parseFloat(i);
    }, e.prototype._swapEndStartRepeatValues = function(t) {
      var i = this._valuesStartRepeat[t], s = this._valuesEnd[t];
      typeof s == "string" ? this._valuesStartRepeat[t] = this._valuesStartRepeat[t] + parseFloat(s) : this._valuesStartRepeat[t] = this._valuesEnd[t], this._valuesEnd[t] = i;
    }, e;
  }()
), E = Y;
E.getAll.bind(E);
var Mt = E.removeAll.bind(E);
E.add.bind(E);
var lt = E.remove.bind(E), Lt = E.update.bind(E);
let ft, tt, l, x, g, dt, pt, _t, L, vt = () => {
}, et, ct, W = !0, S = !1, k = !1, M = !1, c = {}, y = {}, d, v = 0, u = 0, q;
const Ft = "color: yellow; text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000;";
let Z = [];
function z() {
  W || (W = !0, l.setVal_Nochk("tmp", "sn.tagL.enabled", !0)), k && (k = !1, l.setVal_Nochk("tmp", "sn.skip.enabled", !1)), M && (M = !1, l.setVal_Nochk("tmp", "sn.auto.enabled", !1));
}
function P() {
  I();
}
function Ut() {
  K();
}
let I = () => new G(), K = () => new gt();
function Nt(e, t) {
  d = JSON.parse(e), v = d.length, u >= v && (u = v - 1), q = t;
}
class ht {
  #t = new yt();
  constructor(t, i) {
    if (k && !S && !g.isNextKidoku && z(), w(t, "canskip", !0)) {
      const s = () => {
        this.destroy(), z(), i();
      };
      this.#t.add(window, "pointerdown", (n) => {
        n.stopPropagation(), s();
      }), this.#t.add(window, "keydown", (n) => {
        n.isComposing || (n.stopPropagation(), s());
      }), vt(this.#t, s);
    }
  }
  destroy() {
    this.#t.clear();
  }
}
class f {
  constructor(t) {
    this.hArg = t, I = () => new G(), K = () => new gt(), ft(this);
  }
  static init(t, i, s, n, r, a, o, h, T, b, _) {
    ft = t, tt = i, l = s, x = n, g = r, dt = a, pt = o, _t = h, L = () => x.goTxt(), vt = T, et = b, ct = _, new G(), l.defTmp("sn.tagL.enabled", () => W), l.defValTrg("tmp:sn.tagL.enabled", (C, p) => W = String(p) !== "false"), l.defTmp("sn.skip.all", () => S), l.defValTrg("tmp:sn.skip.all", (C, p) => S = String(p) !== "false"), l.defTmp("sn.skip.enabled", () => k), l.defValTrg("tmp:sn.skip.enabled", (C, p) => k = String(p) !== "false"), l.defTmp("sn.auto.enabled", () => M), l.defValTrg("tmp:sn.auto.enabled", (C, p) => M = String(p) !== "false"), c = {}, y = {};
  }
  destroy() {
    this.onFinish = () => {
    }, this.onUserAct = () => {
    }, this.#i.destroy();
  }
  get isSkipping() {
    return k;
  }
  static getHtmlElmList(t) {
    const i = t.indexOf(":");
    let s = "";
    if (i >= 0) {
      const n = t.slice(4, i), r = `const.sn.frm.${n}`;
      if (!l.getVal(`tmp:${r}`, 0)) throw `HTML【${n}】が読み込まれていません`;
      const o = document.getElementById(n).contentWindow;
      return s = t.slice(i + 1), { el: o.document.querySelectorAll(s), id: n, sel: s };
    }
    return s = t.slice(4), { el: document.querySelectorAll(s), id: "", sel: s };
  }
  static setEvt2Fnc(t, i, s) {
    t ? y[i] = s : c[i] = s;
  }
  static getEvt2Fnc = (t) => c[t] ?? y[t];
  static clear_eventer(t, i, s) {
    if (!t.startsWith("dom=")) return;
    const n = i ? y[s] : c[s];
    n && f.getHtmlElmList(t).el.forEach((r) => r.removeEventListener("click", n)), i ? delete y[s] : delete c[s];
  }
  static clear_event(t) {
    const i = w(t, "global", !1), s = i ? y : c;
    for (const [n, r] of Object.entries(s))
      n.startsWith("dom=") && f.getHtmlElmList(n).el.forEach((a) => a.removeEventListener("click", r));
    return i ? y = {} : c = {}, !1;
  }
  s(t) {
    return this.#s(), V.go(t);
  }
  wait = (t) => k ? (!S && !g.isNextKidoku && z(), !1) : st.go(t);
  waitclick = (t) => at.go(t);
  waitTxtAndTimer(t, i) {
    return f.#t.once(f.#e, () => {
      if (this.#i.destroy(), t === 0) {
        this.onFinish();
        return;
      }
      const s = new Ct({}).to({}, t).onComplete(() => {
        this.#i.destroy(), lt(s), this.onFinish();
      }).start();
      this.waitLimitedEvent(i, () => {
        s.stop(), lt(s), this.onUserAct();
      });
    }), L(), l.saveKidoku(), this.waitLimitedEvent(i, () => {
      f.#t.removeAllListeners(), this.onUserAct();
    });
  }
  static noticeCompTxt() {
    f.#t.emit(f.#e);
  }
  static #t = new wt();
  // static必須
  static #e = "sn:notice_comp_txt";
  static popLocalEvts() {
    const t = c;
    return c = {}, t;
  }
  static pushLocalEvts(t) {
    c = t;
  }
  // 予約イベントの発生待ち
  waitRsvEvent(t, i) {
    if (l.saveKidoku(), t ? c.click = //this.hTag.event({key:'enter', breakout: fnc});
    //hTag.event({key:'down', breakout: fnc});
    //	hTag.event()は内部で使わず、こうする
    c.enter = c.arrowdown = // hTag.event({key:'downwheel', breakout: fnc});
    //	hTag.event()は内部で使わず、こうする
    c["wheel.y>0"] = () => this.onUserAct() : (delete c.click, delete c.enter, delete c.arrowdown, delete c["wheel.y>0"]), f.getEvt2Fnc = i ? (s) => c[s] ?? y[s] : (s) => c[s], g.noticeWait(), ut.debugLog) {
      const s = /* @__PURE__ */ Object.create(null);
      s.local = Object.keys(c), s.global = Object.keys(y), console.log("🎍 wait event... %o", s);
    }
  }
  l(t) {
    if (!W) return !1;
    if (this.#s(!0), M) {
      const i = Number(l.getVal(`sys:sn.auto.msecLineWait${g.isKidoku ? "_Kidoku" : ""}`));
      return H.go(i, t);
    }
    if (k) {
      if (!S && !g.isNextKidoku) return N.go(t);
      if ("ps".includes(l.getVal("sys:sn.skip.mode"))) return H.go(50, t);
    }
    return nt.go(t);
  }
  p(t) {
    if (this.#s(), M) {
      const i = Number(l.getVal(`sys:sn.auto.msecPageWait${g.isKidoku ? "_Kidoku" : ""}`));
      return Q.go(i, t);
    }
    if (k) {
      if (!S && !g.isNextKidoku) return A.go(t);
      if (l.getVal("sys:sn.skip.mode") == "s")
        return Q.go(50, t);
    }
    return rt.go(t);
  }
  // 予約イベントの発生待ちしない waitRsvEvent()
  // 使う場合、外部要因でキャンセルした際は breakLimitedEvent() で後始末を忘れないこと
  waitLimitedEvent(t, i) {
    return this.#i.destroy(), this.#i = new ht(t, i), !0;
  }
  breakEvent(t) {
    f.evnm === t && (f.evnm = "", this.#i.destroy(), P());
  }
  #i = new ht({}, () => {
  });
  // ':タグ名' は未定義、デバッグ時に無視を
  static evnm = "";
  // 状態保存する変数はすべて static に
  waitEvent(t, i, s) {
    return f.evnm = t, k && !S && !g.isNextKidoku ? J.go(i, s) : ot.go(i, s);
  }
  onFinish() {
  }
  onUserAct() {
  }
  isWait = !1;
  // 予約イベントの発生待ち中か
  fire(t, i) {
  }
  page(t) {
    if (!("clear" in t || "to" in t || "style" in t)) throw "clear,style,to いずれかは必須です";
    const { style: i } = t;
    if (i)
      return q = i, l.setVal_Nochk("save", "const.sn.styPaging", i), !1;
    if (w(t, "clear", !1))
      return d = [], v = 0, u = 0, l.setVal_Nochk("sys", "const.sn.aPageLog", "[]"), l.setVal_Nochk("save", "const.sn.styPaging", Ft), !1;
    const { to: s, key: n } = t;
    switch (n && (Z = n.split(",")), s) {
      case "prev":
        if (u = v - 1, v < 2) return !1;
        break;
    }
    return X.go(t);
  }
  #s(t = !1) {
    if (!l.getVal("save:sn.doRecLog")) return;
    const { fn: i, idx: s } = g.nowScrIdx(), n = `${s - 1}:` + i;
    if (d.findIndex((a) => a.key === n) > -1) return;
    d.at(-1)?.week && d.pop();
    const { max_len: r } = ct.oCfg.log;
    d.push({
      key: n,
      week: t,
      fn: l.getVal("save:const.sn.scriptFn", i),
      index: l.getVal("save:const.sn.scriptIdx", 0),
      mark: g.nowMark()
    }) > r && (d = d.slice(-r)), v = d.length, l.setVal_Nochk("sys", "const.sn.aPageLog", JSON.stringify(d));
  }
}
class G extends f {
  constructor() {
    super({}), tt.resume(), et.hidden = !0;
  }
  breakEvent() {
  }
}
class U extends f {
  isWait = !0;
  // 予約イベントの発生待ち中か
  fire(t, i) {
    const s = t.toLowerCase();
    if (ut.debugLog && console.log(`👺 fire<(key:\`${s}\` type:${i.type} e:%o)`, { ...i }), s === "enter") {
      const r = _t.getFocus();
      if (r instanceof kt) {
        r.emit("pointerdown", new Et(new Tt()));
        return;
      }
    }
    const n = f.getEvt2Fnc(s);
    if (!n) {
      s.startsWith("swipe") && globalThis.scrollBy(
        -i.deltaX || 0,
        // NaN なので ?? ではダメ
        -i.deltaY || 0
      );
      return;
    }
    s.endsWith("wheel") || i.preventDefault?.(), i.stopPropagation(), !(!s.startsWith("dom=") && x.clickTxtLay()) && n(i);
  }
}
class V extends U {
  static go = (t) => (new V(t).waitTxtAndTimer(0, {}), I = () => {
  }, !0);
  breakEvent() {
  }
  onFinish() {
    it.go(this.hArg);
  }
  onUserAct() {
    this.onFinish();
  }
}
class it extends U {
  static go = (t) => {
    z();
    const i = w(t, "global", !0);
    return new it(t).waitRsvEvent(!1, i), I = () => {
    }, !0;
  };
  breakEvent() {
  }
  onFinish() {
  }
  onUserAct() {
  }
}
class st extends f {
  // 文字表示終了待ち→[wait]
  static go = (t) => {
    const i = bt(t, "time", NaN);
    return new st(t).waitTxtAndTimer(i, t);
  };
  onFinish() {
    P();
  }
  onUserAct() {
    this.onFinish();
  }
}
class nt extends f {
  // 文字表示終了待ち（そして[l]）
  static go = (t) => new nt(t).waitTxtAndTimer(0, t);
  breakEvent() {
  }
  onFinish() {
    N.go(this.hArg);
  }
  onUserAct() {
    this.onFinish();
  }
}
class H extends f {
  // 文字表示終了待ち（そして[l]auto/skipウェイト待ち）
  static go = (t, i) => new H(i).waitTxtAndTimer(t, i);
  breakEvent() {
  }
  onFinish() {
    P();
  }
  onUserAct() {
    N.go(this.hArg);
  }
}
class N extends U {
  // [l] クリック待ち
  static go = (t) => {
    w(t, "visible", !0) && x.breakLine(t), L();
    const i = w(t, "global", !0);
    return new N(t).waitRsvEvent(!0, i), !0;
  };
  onFinish() {
    P();
  }
  onUserAct() {
    P();
  }
}
class rt extends f {
  // 文字表示終了待ち（そして[p]）
  static go = (t) => new rt(t).waitTxtAndTimer(0, t);
  breakEvent() {
  }
  onFinish() {
    A.go(this.hArg);
  }
  onUserAct() {
    this.onFinish();
  }
}
class Q extends f {
  // 文字表示終了待ち（そして[p]auto/skipウェイト待ち）
  static go = (t, i) => new Q(i).waitTxtAndTimer(t, i);
  breakEvent() {
  }
  onFinish() {
    P();
  }
  onUserAct() {
    A.go(this.hArg);
  }
}
class A extends U {
  // [p] クリック待ち
  static go = (t) => {
    w(t, "visible", !0) && x.breakPage(t), L();
    const i = w(t, "global", !0);
    return new A(t).waitRsvEvent(!0, i), !0;
  };
  onFinish() {
    w(this.hArg, "er", !1) && pt.er(this.hArg), dt.clearCache(), P();
  }
  onUserAct() {
    this.onFinish();
  }
}
class at extends U {
  static go = (t) => new at(t).waitTxtAndTimer(0, t);
  onFinish() {
    z();
    const t = w(this.hArg, "global", !0);
    this.waitRsvEvent(!0, t);
  }
  onUserAct() {
    P();
  }
}
class ot extends f {
  constructor(t, i) {
    super(t), this.onIntr = i;
  }
  // 文字表示終了待ち（そして[*]）
  static go = (t, i) => new ot(t, i).waitTxtAndTimer(0, t);
  onFinish() {
    J.go(this.hArg, this.onIntr);
  }
  onUserAct() {
    this.onFinish();
  }
}
class J extends U {
  constructor(t, i) {
    super(t), this.onIntr = i;
  }
  // fireがある → イベント受付する
  //class Rs_Any_Wait extends ReadState {	// fireがない → イベント受付しない
  static go = (t, i) => new J(t, i).waitLimitedEvent(t, i);
  onFinish() {
    P();
  }
  onUserAct() {
    this.onIntr(), this.onFinish();
  }
}
class gt extends f {
  // fireがない → イベント受付しない
  constructor() {
    super({}), I = () => new G(), K = () => {
    };
  }
  breakEvent() {
  }
}
class X extends V {
  constructor(t) {
    super(t), I = () => {
    }, K = () => new St();
  }
  get isSkipping() {
    return !d[u]?.week;
  }
  // return true で良いのだが、[l]でページ移動モードになったあと、[l]に戻ってモード終了してから、[p]に至る文字表示が瞬時表示になる対策
  s = (t) => V.go(t);
  wait = () => !1;
  waitclick = () => !1;
  waitTxtAndTimer = () => !1;
  l(t) {
    return u === v - 1 ? (this.#e(), N.go(t)) : (x.setAllStyle2TxtLay(q), L(), d[u]?.week ? (w(t, "visible", !0) && x.breakLine(t), this.#t(), !0) : !1);
  }
  #t() {
    this.waitRsvEvent(!1, !0);
    let t = {};
    if (Z.length === 0) t = y;
    else for (const i of Z) {
      const s = y[i];
      s && (t[i] = s);
    }
    f.getEvt2Fnc = (i) => c[i] ?? t[i];
  }
  p(t) {
    return u === v - 1 ? (this.#e(), A.go(t)) : (x.setAllStyle2TxtLay(q), L(), w(t, "visible", !0) && x.breakPage(t), this.#t(), !0);
  }
  static go = (t) => (l.setVal_Nochk("tmp", "const.sn.isPaging", !0), new X(t).page(t));
  page(t) {
    const { to: i, style: s, clear: n } = t;
    if (s || n) return !1;
    switch (i) {
      case "prev":
        if (u === 0) return !1;
        --u;
        break;
      case "next":
        if (u === v - 1) return !1;
        ++u;
        break;
      case "exit":
        u = v - 1, this.#e();
        break;
      case "load":
        v = u + 1, d = d.slice(0, v);
        break;
      default:
        throw `属性to「${i}」は異常です`;
    }
    const r = d[u];
    if (!r) throw `[page] posPage異常:${u}`;
    const { fn: a, index: o, mark: h } = r;
    return g.loadFromMark({ fn: a, index: o }, h);
  }
  #e() {
    l.setVal_Nochk("tmp", "const.sn.isPaging", !1);
  }
  onFinish() {
  }
  onUserAct() {
  }
}
class St extends f {
  // fireがない → イベント受付しない
  constructor() {
    super({}), I = () => {
      new X({}), tt.resume(), et.hidden = !0;
    }, K = () => {
    };
  }
  breakEvent() {
  }
}
export {
  B as E,
  Ft as I,
  f as R,
  Ct as T,
  lt as a,
  Ut as d,
  P as e,
  Nt as p,
  Mt as r,
  Lt as u
};
//# sourceMappingURL=ReadState.js.map
