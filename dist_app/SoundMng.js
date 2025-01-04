import { E as U, m as I, X as ut, Y as W, n as Z, Z as ht, o as dt, a as x, b as S, S as ct, j as z } from "./app2.js";
import { C as ft } from "./CmnTween.js";
import { d as pt, e as _t, T as mt, a as gt } from "./ReadState.js";
let st;
function yt(s) {
  return st = s, s;
}
function E() {
  return st;
}
class it {
  /**
   * @param {AudioNode} destination - The audio node to use as the destination for the input AudioNode
   * @param {AudioNode} [source] - Optional output node, defaults to destination node. This is useful
   *        when creating filters which contains multiple AudioNode elements chained together.
   */
  constructor(t, e) {
    this.init(t, e);
  }
  /** Reinitialize */
  init(t, e) {
    this.destination = t, this.source = e || t;
  }
  /**
   * Connect to the destination.
   * @param {AudioNode} destination - The destination node to connect the output to
   */
  connect(t) {
    this.source?.connect(t);
  }
  /** Completely disconnect filter from destination and source nodes. */
  disconnect() {
    this.source?.disconnect();
  }
  /** Destroy the filter and don't use after this. */
  destroy() {
    this.disconnect(), this.destination = null, this.source = null;
  }
}
class k {
  /**
   * Dezippering is removed in the future Web Audio API, instead
   * we use the `setValueAtTime` method, however, this is not available
   * in all environments (e.g., Android webview), so we fallback to the `value` setter.
   * @param param - AudioNode parameter object
   * @param value - Value to set
   * @return The value set
   */
  static setParamValue(t, e) {
    if (t.setValueAtTime) {
      const i = E().context;
      t.setValueAtTime(e, i.audioContext.currentTime);
    } else
      t.value = e;
    return e;
  }
}
const u = class extends it {
  /**
   * @param f32 - Default gain for 32 Hz
   * @param f64 - Default gain for 64 Hz
   * @param f125 - Default gain for 125 Hz
   * @param f250 - Default gain for 250 Hz
   * @param f500 - Default gain for 500 Hz
   * @param f1k - Default gain for 1000 Hz
   * @param f2k - Default gain for 2000 Hz
   * @param f4k - Default gain for 4000 Hz
   * @param f8k - Default gain for 8000 Hz
   * @param f16k - Default gain for 16000 Hz
   */
  constructor(s = 0, t = 0, e = 0, i = 0, n = 0, o = 0, r = 0, a = 0, l = 0, f = 0) {
    let y = [];
    const v = [
      {
        f: u.F32,
        type: "lowshelf",
        gain: s
      },
      {
        f: u.F64,
        type: "peaking",
        gain: t
      },
      {
        f: u.F125,
        type: "peaking",
        gain: e
      },
      {
        f: u.F250,
        type: "peaking",
        gain: i
      },
      {
        f: u.F500,
        type: "peaking",
        gain: n
      },
      {
        f: u.F1K,
        type: "peaking",
        gain: o
      },
      {
        f: u.F2K,
        type: "peaking",
        gain: r
      },
      {
        f: u.F4K,
        type: "peaking",
        gain: a
      },
      {
        f: u.F8K,
        type: "peaking",
        gain: l
      },
      {
        f: u.F16K,
        type: "highshelf",
        gain: f
      }
    ];
    E().useLegacy || (y = v.map((g) => {
      const p = E().context.audioContext.createBiquadFilter();
      return p.type = g.type, k.setParamValue(p.Q, 1), p.frequency.value = g.f, k.setParamValue(p.gain, g.gain), p;
    })), super(y[0], y[y.length - 1]), this.bands = y, this.bandsMap = {};
    for (let g = 0; g < this.bands.length; g++) {
      const p = this.bands[g];
      g > 0 && this.bands[g - 1].connect(p), this.bandsMap[p.frequency.value] = p;
    }
  }
  /**
   * Set gain on a specific frequency.
   * @param frequency - The frequency, see EqualizerFilter.F* for bands
   * @param gain - Recommended -40 to 40.
   */
  setGain(s, t = 0) {
    if (!this.bandsMap[s])
      throw new Error(`No band found for frequency ${s}`);
    k.setParamValue(this.bandsMap[s].gain, t);
  }
  /**
   * Get gain amount on a specific frequency.
   * @return The amount of gain set.
   */
  getGain(s) {
    if (!this.bandsMap[s])
      throw new Error(`No band found for frequency ${s}`);
    return this.bandsMap[s].gain.value;
  }
  /**
   * Gain at 32 Hz frequencey.
   * @default 0
   */
  set f32(s) {
    this.setGain(u.F32, s);
  }
  get f32() {
    return this.getGain(u.F32);
  }
  /**
   * Gain at 64 Hz frequencey.
   * @default 0
   */
  set f64(s) {
    this.setGain(u.F64, s);
  }
  get f64() {
    return this.getGain(u.F64);
  }
  /**
   * Gain at 125 Hz frequencey.
   * @default 0
   */
  set f125(s) {
    this.setGain(u.F125, s);
  }
  get f125() {
    return this.getGain(u.F125);
  }
  /**
   * Gain at 250 Hz frequencey.
   * @default 0
   */
  set f250(s) {
    this.setGain(u.F250, s);
  }
  get f250() {
    return this.getGain(u.F250);
  }
  /**
   * Gain at 500 Hz frequencey.
   * @default 0
   */
  set f500(s) {
    this.setGain(u.F500, s);
  }
  get f500() {
    return this.getGain(u.F500);
  }
  /**
   * Gain at 1 KHz frequencey.
   * @default 0
   */
  set f1k(s) {
    this.setGain(u.F1K, s);
  }
  get f1k() {
    return this.getGain(u.F1K);
  }
  /**
   * Gain at 2 KHz frequencey.
   * @default 0
   */
  set f2k(s) {
    this.setGain(u.F2K, s);
  }
  get f2k() {
    return this.getGain(u.F2K);
  }
  /**
   * Gain at 4 KHz frequencey.
   * @default 0
   */
  set f4k(s) {
    this.setGain(u.F4K, s);
  }
  get f4k() {
    return this.getGain(u.F4K);
  }
  /**
   * Gain at 8 KHz frequencey.
   * @default 0
   */
  set f8k(s) {
    this.setGain(u.F8K, s);
  }
  get f8k() {
    return this.getGain(u.F8K);
  }
  /**
   * Gain at 16 KHz frequencey.
   * @default 0
   */
  set f16k(s) {
    this.setGain(u.F16K, s);
  }
  get f16k() {
    return this.getGain(u.F16K);
  }
  /** Reset all frequency bands to have gain of 0 */
  reset() {
    this.bands.forEach((s) => {
      k.setParamValue(s.gain, 0);
    });
  }
  destroy() {
    this.bands.forEach((s) => {
      s.disconnect();
    }), this.bands = null, this.bandsMap = null;
  }
};
let w = u;
w.F32 = 32;
w.F64 = 64;
w.F125 = 125;
w.F250 = 250;
w.F500 = 500;
w.F1K = 1e3;
w.F2K = 2e3;
w.F4K = 4e3;
w.F8K = 8e3;
w.F16K = 16e3;
class j extends it {
  /** @param pan - The amount of panning, -1 is left, 1 is right, 0 is centered. */
  constructor(t = 0) {
    let e, i, n;
    if (!E().useLegacy) {
      const { audioContext: o } = E().context;
      o.createStereoPanner ? (e = o.createStereoPanner(), n = e) : (i = o.createPanner(), i.panningModel = "equalpower", n = i);
    }
    super(n), this._stereo = e, this._panner = i, this.pan = t;
  }
  /** Set the amount of panning, where -1 is left, 1 is right, and 0 is centered */
  set pan(t) {
    this._pan = t, this._stereo ? k.setParamValue(this._stereo.pan, t) : this._panner && this._panner.setPosition(t, 0, 1 - Math.abs(t));
  }
  get pan() {
    return this._pan;
  }
  destroy() {
    super.destroy(), this._stereo = null, this._panner = null;
  }
}
class vt extends U {
  constructor() {
    super(...arguments), this.speed = 1, this.muted = !1, this.volume = 1, this.paused = !1;
  }
  /** Internal trigger when volume, mute or speed changes */
  refresh() {
    this.emit("refresh");
  }
  /** Internal trigger paused changes */
  refreshPaused() {
    this.emit("refreshPaused");
  }
  /**
   * HTML Audio does not support filters, this is non-functional API.
   */
  get filters() {
    return console.warn("HTML Audio does not support filters"), null;
  }
  set filters(t) {
    console.warn("HTML Audio does not support filters");
  }
  /**
   * HTML Audio does not support `audioContext`
   * @readonly
   * @type {AudioContext}
   */
  get audioContext() {
    return console.warn("HTML Audio does not support audioContext"), null;
  }
  /**
   * Toggles the muted state.
   * @return The current muted state.
   */
  toggleMute() {
    return this.muted = !this.muted, this.refresh(), this.muted;
  }
  /**
   * Toggles the paused state.
   * @return The current paused state.
   */
  togglePause() {
    return this.paused = !this.paused, this.refreshPaused(), this.paused;
  }
  /** Destroy and don't use after this */
  destroy() {
    this.removeAllListeners();
  }
}
let bt = 0;
const q = class extends U {
  /** @param parent - Parent element */
  constructor(s) {
    super(), this.id = bt++, this.init(s);
  }
  /**
   * Set a property by name, this makes it easy to chain values
   * @param name - Name of the property to set
   * @param value - Value to set property to
   */
  set(s, t) {
    if (this[s] === void 0)
      throw new Error(`Property with name ${s} does not exist.`);
    switch (s) {
      case "speed":
        this.speed = t;
        break;
      case "volume":
        this.volume = t;
        break;
      case "paused":
        this.paused = t;
        break;
      case "loop":
        this.loop = t;
        break;
      case "muted":
        this.muted = t;
        break;
    }
    return this;
  }
  /** The current playback progress from 0 to 1. */
  get progress() {
    const { currentTime: s } = this._source;
    return s / this._duration;
  }
  /** Pauses the sound. */
  get paused() {
    return this._paused;
  }
  set paused(s) {
    this._paused = s, this.refreshPaused();
  }
  /**
   * Reference: http://stackoverflow.com/a/40370077
   * @private
   */
  _onPlay() {
    this._playing = !0;
  }
  /**
   * Reference: http://stackoverflow.com/a/40370077
   * @private
   */
  _onPause() {
    this._playing = !1;
  }
  /**
   * Initialize the instance.
   * @param {htmlaudio.HTMLAudioMedia} media - Same as constructor
   */
  init(s) {
    this._playing = !1, this._duration = s.source.duration;
    const t = this._source = s.source.cloneNode(!1);
    t.src = s.parent.url, t.onplay = this._onPlay.bind(this), t.onpause = this._onPause.bind(this), s.context.on("refresh", this.refresh, this), s.context.on("refreshPaused", this.refreshPaused, this), this._media = s;
  }
  /**
   * Stop the sound playing
   * @private
   */
  _internalStop() {
    this._source && this._playing && (this._source.onended = null, this._source.pause());
  }
  /** Stop the sound playing */
  stop() {
    this._internalStop(), this._source && this.emit("stop");
  }
  /** Set the instance speed from 0 to 1 */
  get speed() {
    return this._speed;
  }
  set speed(s) {
    this._speed = s, this.refresh();
  }
  /** Get the set the volume for this instance from 0 to 1 */
  get volume() {
    return this._volume;
  }
  set volume(s) {
    this._volume = s, this.refresh();
  }
  /** If the sound instance should loop playback */
  get loop() {
    return this._loop;
  }
  set loop(s) {
    this._loop = s, this.refresh();
  }
  /** `true` if the sound is muted */
  get muted() {
    return this._muted;
  }
  set muted(s) {
    this._muted = s, this.refresh();
  }
  /**
   * HTML Audio does not support filters, this is non-functional API.
   */
  get filters() {
    return console.warn("HTML Audio does not support filters"), null;
  }
  set filters(s) {
    console.warn("HTML Audio does not support filters");
  }
  /** Call whenever the loop, speed or volume changes */
  refresh() {
    const s = this._media.context, t = this._media.parent;
    this._source.loop = this._loop || t.loop;
    const e = s.volume * (s.muted ? 0 : 1), i = t.volume * (t.muted ? 0 : 1), n = this._volume * (this._muted ? 0 : 1);
    this._source.volume = n * e * i, this._source.playbackRate = this._speed * s.speed * t.speed;
  }
  /** Handle changes in paused state, either globally or sound or instance */
  refreshPaused() {
    const s = this._media.context, t = this._media.parent, e = this._paused || t.paused || s.paused;
    e !== this._pausedReal && (this._pausedReal = e, e ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
      start: this._source.currentTime,
      end: this._end,
      volume: this._volume,
      speed: this._speed,
      loop: this._loop
    })), this.emit("pause", e));
  }
  /** Start playing the sound/ */
  play(s) {
    const { start: t, end: e, speed: i, loop: n, volume: o, muted: r } = s;
    e && console.assert(e > t, "End time is before start time"), this._speed = i, this._volume = o, this._loop = !!n, this._muted = r, this.refresh(), this.loop && e !== null && (console.warn('Looping not support when specifying an "end" time'), this.loop = !1), this._start = t, this._end = e || this._duration, this._start = Math.max(0, this._start - q.PADDING), this._end = Math.min(this._end + q.PADDING, this._duration), this._source.onloadedmetadata = () => {
      this._source && (this._source.currentTime = t, this._source.onloadedmetadata = null, this.emit("progress", t / this._duration, this._duration), I.shared.add(this._onUpdate, this));
    }, this._source.onended = this._onComplete.bind(this), this._source.play(), this.emit("start");
  }
  /**
   * Handle time update on sound.
   * @private
   */
  _onUpdate() {
    this.emit("progress", this.progress, this._duration), this._source.currentTime >= this._end && !this._source.loop && this._onComplete();
  }
  /**
   * Callback when completed.
   * @private
   */
  _onComplete() {
    I.shared.remove(this._onUpdate, this), this._internalStop(), this.emit("progress", 1, this._duration), this.emit("end", this);
  }
  /** Don't use after this. */
  destroy() {
    I.shared.remove(this._onUpdate, this), this.removeAllListeners();
    const s = this._source;
    s && (s.onended = null, s.onplay = null, s.onpause = null, this._internalStop()), this._source = null, this._speed = 1, this._volume = 1, this._loop = !1, this._end = null, this._start = 0, this._duration = 0, this._playing = !1, this._pausedReal = !1, this._paused = !1, this._muted = !1, this._media && (this._media.context.off("refresh", this.refresh, this), this._media.context.off("refreshPaused", this.refreshPaused, this), this._media = null);
  }
  /**
   * To string method for instance.
   * @return The string representation of instance.
   */
  toString() {
    return `[HTMLAudioInstance id=${this.id}]`;
  }
};
let ot = q;
ot.PADDING = 0.1;
class wt extends U {
  init(t) {
    this.parent = t, this._source = t.options.source || new Audio(), t.url && (this._source.src = t.url);
  }
  // Implement create
  create() {
    return new ot(this);
  }
  /**
   * If the audio media is playable (ready).
   * @readonly
   */
  get isPlayable() {
    return !!this._source && this._source.readyState === 4;
  }
  /**
   * THe duration of the media in seconds.
   * @readonly
   */
  get duration() {
    return this._source.duration;
  }
  /**
   * Reference to the context.
   * @readonly
   */
  get context() {
    return this.parent.context;
  }
  /** The collection of filters, does not apply to HTML Audio. */
  get filters() {
    return null;
  }
  set filters(t) {
    console.warn("HTML Audio does not support filters");
  }
  // Override the destroy
  destroy() {
    this.removeAllListeners(), this.parent = null, this._source && (this._source.src = "", this._source.load(), this._source = null);
  }
  /**
   * Get the audio source element.
   * @type {HTMLAudioElement}
   * @readonly
   */
  get source() {
    return this._source;
  }
  // Implement the method to being preloading
  load(t) {
    const e = this._source, i = this.parent;
    if (e.readyState === 4) {
      i.isLoaded = !0;
      const l = i.autoPlayStart();
      t && setTimeout(() => {
        t(null, i, l);
      }, 0);
      return;
    }
    if (!i.url) {
      t(new Error("sound.url or sound.source must be set"));
      return;
    }
    e.src = i.url;
    const n = () => {
      a(), i.isLoaded = !0;
      const l = i.autoPlayStart();
      t && t(null, i, l);
    }, o = () => {
      a(), t && t(new Error("Sound loading has been aborted"));
    }, r = () => {
      a();
      const l = `Failed to load audio element (code: ${e.error.code})`;
      t ? t(new Error(l)) : console.error(l);
    }, a = () => {
      e.removeEventListener("canplaythrough", n), e.removeEventListener("load", n), e.removeEventListener("abort", o), e.removeEventListener("error", r);
    };
    e.addEventListener("canplaythrough", n, !1), e.addEventListener("load", n, !1), e.addEventListener("abort", o, !1), e.addEventListener("error", r, !1), e.load();
  }
}
class xt {
  /**
   * @param parent - The parent sound
   * @param options - Data associated with object.
   */
  constructor(t, e) {
    this.parent = t, Object.assign(this, e), this.duration = this.end - this.start, console.assert(this.duration > 0, "End time must be after start time");
  }
  /**
   * Play the sound sprite.
   * @param {Function} [complete] - Function call when complete
   * @return Sound instance being played.
   */
  play(t) {
    return this.parent.play({
      complete: t,
      speed: this.speed || this.parent.speed,
      end: this.end,
      start: this.start,
      loop: this.loop
    });
  }
  /** Destroy and don't use after this */
  destroy() {
    this.parent = null;
  }
}
const Q = [
  "ogg",
  "oga",
  "opus",
  "m4a",
  "mp3",
  "mpeg",
  "wav",
  "aiff",
  "wma",
  "mid",
  "caf"
], Pt = [
  "audio/mpeg",
  "audio/ogg"
], D = {};
function Et(s) {
  const t = {
    m4a: "audio/mp4",
    oga: "audio/ogg",
    opus: 'audio/ogg; codecs="opus"',
    caf: 'audio/x-caf; codecs="opus"'
  }, e = document.createElement("audio"), i = {}, n = /^no$/;
  Q.forEach((o) => {
    const r = e.canPlayType(`audio/${o}`).replace(n, ""), a = t[o] ? e.canPlayType(t[o]).replace(n, "") : "";
    i[o] = !!r || !!a;
  }), Object.assign(D, i);
}
Et();
let Lt = 0;
class kt extends U {
  constructor(t) {
    super(), this.id = Lt++, this._media = null, this._paused = !1, this._muted = !1, this._elapsed = 0, this.init(t);
  }
  /**
   * Set a property by name, this makes it easy to chain values
   * @param name - Name of the property to set.
   * @param value - Value to set property to.
   */
  set(t, e) {
    if (this[t] === void 0)
      throw new Error(`Property with name ${t} does not exist.`);
    switch (t) {
      case "speed":
        this.speed = e;
        break;
      case "volume":
        this.volume = e;
        break;
      case "muted":
        this.muted = e;
        break;
      case "loop":
        this.loop = e;
        break;
      case "paused":
        this.paused = e;
        break;
    }
    return this;
  }
  /** Stops the instance, don't use after this. */
  stop() {
    this._source && (this._internalStop(), this.emit("stop"));
  }
  /** Set the instance speed from 0 to 1 */
  get speed() {
    return this._speed;
  }
  set speed(t) {
    this._speed = t, this.refresh(), this._update(!0);
  }
  /** Get the set the volume for this instance from 0 to 1 */
  get volume() {
    return this._volume;
  }
  set volume(t) {
    this._volume = t, this.refresh();
  }
  /** `true` if the sound is muted */
  get muted() {
    return this._muted;
  }
  set muted(t) {
    this._muted = t, this.refresh();
  }
  /** If the sound instance should loop playback */
  get loop() {
    return this._loop;
  }
  set loop(t) {
    this._loop = t, this.refresh();
  }
  /** The collection of filters. */
  get filters() {
    return this._filters;
  }
  set filters(t) {
    this._filters && (this._filters?.filter((e) => e).forEach((e) => e.disconnect()), this._filters = null, this._source.connect(this._gain)), this._filters = t?.length ? t.slice(0) : null, this.refresh();
  }
  /** Refresh loop, volume and speed based on changes to parent */
  refresh() {
    if (!this._source)
      return;
    const t = this._media.context, e = this._media.parent;
    this._source.loop = this._loop || e.loop;
    const i = t.volume * (t.muted ? 0 : 1), n = e.volume * (e.muted ? 0 : 1), o = this._volume * (this._muted ? 0 : 1);
    k.setParamValue(this._gain.gain, o * n * i), k.setParamValue(this._source.playbackRate, this._speed * e.speed * t.speed), this.applyFilters();
  }
  /** Connect filters nodes to audio context */
  applyFilters() {
    if (this._filters?.length) {
      this._source.disconnect();
      let t = this._source;
      this._filters.forEach((e) => {
        t.connect(e.destination), t = e;
      }), t.connect(this._gain);
    }
  }
  /** Handle changes in paused state, either globally or sound or instance */
  refreshPaused() {
    const t = this._media.context, e = this._media.parent, i = this._paused || e.paused || t.paused;
    i !== this._pausedReal && (this._pausedReal = i, i ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
      start: this._elapsed % this._duration,
      end: this._end,
      speed: this._speed,
      loop: this._loop,
      volume: this._volume
    })), this.emit("pause", i));
  }
  /**
   * Plays the sound.
   * @param options - Play options.
   */
  play(t) {
    const { start: e, end: i, speed: n, loop: o, volume: r, muted: a, filters: l } = t;
    i && console.assert(i > e, "End time is before start time"), this._paused = !1;
    const { source: f, gain: y } = this._media.nodes.cloneBufferSource();
    this._source = f, this._gain = y, this._speed = n, this._volume = r, this._loop = !!o, this._muted = a, this._filters = l, this.refresh();
    const v = this._source.buffer.duration;
    this._duration = v, this._end = i, this._lastUpdate = this._now(), this._elapsed = e, this._source.onended = this._onComplete.bind(this), this._loop ? (this._source.loopEnd = i, this._source.loopStart = e, this._source.start(0, e)) : i ? this._source.start(0, e, i - e) : this._source.start(0, e), this.emit("start"), this._update(!0), this.enableTicker(!0);
  }
  /** Start the update progress. */
  enableTicker(t) {
    I.shared.remove(this._updateListener, this), t && I.shared.add(this._updateListener, this);
  }
  /** The current playback progress from 0 to 1. */
  get progress() {
    return this._progress;
  }
  /** Pauses the sound. */
  get paused() {
    return this._paused;
  }
  set paused(t) {
    this._paused = t, this.refreshPaused();
  }
  /** Don't use after this. */
  destroy() {
    this.removeAllListeners(), this._internalStop(), this._gain && (this._gain.disconnect(), this._gain = null), this._media && (this._media.context.events.off("refresh", this.refresh, this), this._media.context.events.off("refreshPaused", this.refreshPaused, this), this._media = null), this._filters?.forEach((t) => t.disconnect()), this._filters = null, this._end = null, this._speed = 1, this._volume = 1, this._loop = !1, this._elapsed = 0, this._duration = 0, this._paused = !1, this._muted = !1, this._pausedReal = !1;
  }
  /**
   * To string method for instance.
   * @return The string representation of instance.
   */
  toString() {
    return `[WebAudioInstance id=${this.id}]`;
  }
  /**
   * Get the current time in seconds.
   * @return Seconds since start of context
   */
  _now() {
    return this._media.context.audioContext.currentTime;
  }
  /** Callback for update listener */
  _updateListener() {
    this._update();
  }
  /** Internal update the progress. */
  _update(t = !1) {
    if (this._source) {
      const e = this._now(), i = e - this._lastUpdate;
      if (i > 0 || t) {
        const n = this._source.playbackRate.value;
        this._elapsed += i * n, this._lastUpdate = e;
        const o = this._duration;
        let r;
        if (this._source.loopStart) {
          const a = this._source.loopEnd - this._source.loopStart;
          r = (this._source.loopStart + this._elapsed % a) / o;
        } else
          r = this._elapsed % o / o;
        this._progress = r, this.emit("progress", this._progress, o);
      }
    }
  }
  /** Initializes the instance. */
  init(t) {
    this._media = t, t.context.events.on("refresh", this.refresh, this), t.context.events.on("refreshPaused", this.refreshPaused, this);
  }
  /** Stops the instance. */
  _internalStop() {
    if (this._source) {
      this.enableTicker(!1), this._source.onended = null, this._source.stop(0), this._source.disconnect();
      try {
        this._source.buffer = null;
      } catch (t) {
        console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
      }
      this._source = null;
    }
  }
  /** Callback when completed. */
  _onComplete() {
    if (this._source) {
      this.enableTicker(!1), this._source.onended = null, this._source.disconnect();
      try {
        this._source.buffer = null;
      } catch (t) {
        console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
      }
    }
    this._source = null, this._progress = 1, this.emit("progress", 1, this._duration), this.emit("end", this);
  }
}
class nt {
  /**
   * @param input - The source audio node
   * @param output - The output audio node
   */
  constructor(t, e) {
    this._output = e, this._input = t;
  }
  /** The destination output audio node */
  get destination() {
    return this._input;
  }
  /** The collection of filters. */
  get filters() {
    return this._filters;
  }
  set filters(t) {
    if (this._filters && (this._filters.forEach((e) => {
      e && e.disconnect();
    }), this._filters = null, this._input.connect(this._output)), t && t.length) {
      this._filters = t.slice(0), this._input.disconnect();
      let e = null;
      t.forEach((i) => {
        e === null ? this._input.connect(i.destination) : e.connect(i.destination), e = i;
      }), e.connect(this._output);
    }
  }
  /** Cleans up. */
  destroy() {
    this.filters = null, this._input = null, this._output = null;
  }
}
const rt = class extends nt {
  /**
   * @param context - The audio context.
   */
  constructor(s) {
    const t = s.audioContext, e = t.createBufferSource(), i = t.createGain(), n = t.createAnalyser();
    e.connect(n), n.connect(i), i.connect(s.destination), super(n, i), this.context = s, this.bufferSource = e, this.gain = i, this.analyser = n;
  }
  /**
   * Get the script processor node.
   * @readonly
   */
  get script() {
    return this._script || (this._script = this.context.audioContext.createScriptProcessor(rt.BUFFER_SIZE), this._script.connect(this.context.destination)), this._script;
  }
  /** Cleans up. */
  destroy() {
    super.destroy(), this.bufferSource.disconnect(), this._script && this._script.disconnect(), this.gain.disconnect(), this.analyser.disconnect(), this.bufferSource = null, this._script = null, this.gain = null, this.analyser = null, this.context = null;
  }
  /**
   * Clones the bufferSource. Used just before playing a sound.
   * @returns {SourceClone} The clone AudioBufferSourceNode.
   */
  cloneBufferSource() {
    const s = this.bufferSource, t = this.context.audioContext.createBufferSource();
    t.buffer = s.buffer, k.setParamValue(t.playbackRate, s.playbackRate.value), t.loop = s.loop;
    const e = this.context.audioContext.createGain();
    return t.connect(e), e.connect(this.destination), { source: t, gain: e };
  }
  /**
   * Get buffer size of `ScriptProcessorNode`.
   * @readonly
   */
  get bufferSize() {
    return this.script.bufferSize;
  }
};
let at = rt;
at.BUFFER_SIZE = 0;
class St {
  /**
   * Re-initialize without constructing.
   * @param parent - - Instance of parent Sound container
   */
  init(t) {
    this.parent = t, this._nodes = new at(this.context), this._source = this._nodes.bufferSource, this.source = t.options.source;
  }
  /** Destructor, safer to use `SoundLibrary.remove(alias)` to remove this sound. */
  destroy() {
    this.parent = null, this._nodes.destroy(), this._nodes = null;
    try {
      this._source.buffer = null;
    } catch (t) {
      console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
    }
    this._source = null, this.source = null;
  }
  // Implement create
  create() {
    return new kt(this);
  }
  // Implement context
  get context() {
    return this.parent.context;
  }
  // Implement isPlayable
  get isPlayable() {
    return !!this._source && !!this._source.buffer;
  }
  // Implement filters
  get filters() {
    return this._nodes.filters;
  }
  set filters(t) {
    this._nodes.filters = t;
  }
  // Implements duration
  get duration() {
    return console.assert(this.isPlayable, "Sound not yet playable, no duration"), this._source.buffer.duration;
  }
  /** Gets and sets the buffer. */
  get buffer() {
    return this._source.buffer;
  }
  set buffer(t) {
    this._source.buffer = t;
  }
  /** Get the current chained nodes object */
  get nodes() {
    return this._nodes;
  }
  // Implements load
  load(t) {
    this.source ? this._decode(this.source, t) : this.parent.url ? this._loadUrl(t) : t ? t(new Error("sound.url or sound.source must be set")) : console.error("sound.url or sound.source must be set");
  }
  /** Loads a sound using XHMLHttpRequest object. */
  async _loadUrl(t) {
    const e = this.parent.url, i = await ut.get().fetch(e);
    this._decode(await i.arrayBuffer(), t);
  }
  /**
   * Decodes the array buffer.
   * @param arrayBuffer - From load.
   * @param {Function} callback - Callback optional
   */
  _decode(t, e) {
    const i = (n, o) => {
      if (n)
        e && e(n);
      else {
        this.parent.isLoaded = !0, this.buffer = o;
        const r = this.parent.autoPlayStart();
        e && e(null, this.parent, r);
      }
    };
    t instanceof AudioBuffer ? i(null, t) : this.parent.context.decode(t, i);
  }
}
const G = class {
  /**
   * Create a new sound instance from source.
   * @param source - Either the path or url to the source file.
   *        or the object of options to use.
   * @return Created sound instance.
   */
  static from(s) {
    let t = {};
    typeof s == "string" ? t.url = s : s instanceof ArrayBuffer || s instanceof AudioBuffer || s instanceof HTMLAudioElement ? t.source = s : Array.isArray(s) ? t.url = s : t = s, t = {
      autoPlay: !1,
      singleInstance: !1,
      url: null,
      source: null,
      preload: !1,
      volume: 1,
      speed: 1,
      complete: null,
      loaded: null,
      loop: !1,
      ...t
    }, Object.freeze(t);
    const e = E().useLegacy ? new wt() : new St();
    return new G(e, t);
  }
  /**
   * Use `Sound.from`
   * @ignore
   */
  constructor(s, t) {
    this.media = s, this.options = t, this._instances = [], this._sprites = {}, this.media.init(this);
    const e = t.complete;
    this._autoPlayOptions = e ? { complete: e } : null, this.isLoaded = !1, this._preloadQueue = null, this.isPlaying = !1, this.autoPlay = t.autoPlay, this.singleInstance = t.singleInstance, this.preload = t.preload || this.autoPlay, this.url = Array.isArray(t.url) ? this.preferUrl(t.url) : t.url, this.speed = t.speed, this.volume = t.volume, this.loop = t.loop, t.sprites && this.addSprites(t.sprites), this.preload && this._preload(t.loaded);
  }
  /**
   * Internal help for resolving which file to use if there are multiple provide
   * this is especially helpful for working with bundlers (non Assets loading).
   */
  preferUrl(s) {
    const [t] = s.map((e) => ({ url: e, ext: W.extname(e).slice(1) })).filter(({ ext: e }) => D[e]).sort((e, i) => Q.indexOf(e.ext) - Q.indexOf(i.ext));
    if (!t)
      throw new Error("No supported file type found");
    return t.url;
  }
  /** Instance of the media context. */
  get context() {
    return E().context;
  }
  /** Stops all the instances of this sound from playing. */
  pause() {
    return this.isPlaying = !1, this.paused = !0, this;
  }
  /** Resuming all the instances of this sound from playing */
  resume() {
    return this.isPlaying = this._instances.length > 0, this.paused = !1, this;
  }
  /** Stops all the instances of this sound from playing. */
  get paused() {
    return this._paused;
  }
  set paused(s) {
    this._paused = s, this.refreshPaused();
  }
  /** The playback rate. */
  get speed() {
    return this._speed;
  }
  set speed(s) {
    this._speed = s, this.refresh();
  }
  /** Set the filters. Only supported with WebAudio. */
  get filters() {
    return this.media.filters;
  }
  set filters(s) {
    this.media.filters = s;
  }
  /**
   * @ignore
   */
  addSprites(s, t) {
    if (typeof s == "object") {
      const i = {};
      for (const n in s)
        i[n] = this.addSprites(n, s[n]);
      return i;
    }
    console.assert(!this._sprites[s], `Alias ${s} is already taken`);
    const e = new xt(this, t);
    return this._sprites[s] = e, e;
  }
  /** Destructor, safer to use `SoundLibrary.remove(alias)` to remove this sound. */
  destroy() {
    this._removeInstances(), this.removeSprites(), this.media.destroy(), this.media = null, this._sprites = null, this._instances = null;
  }
  /**
   * Remove a sound sprite.
   * @param alias - The unique name of the sound sprite, if alias is omitted, removes all sprites.
   */
  removeSprites(s) {
    if (s) {
      const t = this._sprites[s];
      t !== void 0 && (t.destroy(), delete this._sprites[s]);
    } else
      for (const t in this._sprites)
        this.removeSprites(t);
    return this;
  }
  /** If the current sound is playable (loaded). */
  get isPlayable() {
    return this.isLoaded && this.media && this.media.isPlayable;
  }
  /** Stops all the instances of this sound from playing. */
  stop() {
    if (!this.isPlayable)
      return this.autoPlay = !1, this._autoPlayOptions = null, this;
    this.isPlaying = !1;
    for (let s = this._instances.length - 1; s >= 0; s--)
      this._instances[s].stop();
    return this;
  }
  // Overloaded function
  play(s, t) {
    let e;
    if (typeof s == "string" ? e = { sprite: s, loop: this.loop, complete: t } : typeof s == "function" ? (e = {}, e.complete = s) : e = s, e = {
      complete: null,
      loaded: null,
      sprite: null,
      end: null,
      start: 0,
      volume: 1,
      speed: 1,
      muted: !1,
      loop: !1,
      ...e || {}
    }, e.sprite) {
      const n = e.sprite;
      console.assert(!!this._sprites[n], `Alias ${n} is not available`);
      const o = this._sprites[n];
      e.start = o.start + (e.start || 0), e.end = o.end, e.speed = o.speed || 1, e.loop = o.loop || e.loop, delete e.sprite;
    }
    if (e.offset && (e.start = e.offset), !this.isLoaded)
      return this._preloadQueue ? new Promise((n) => {
        this._preloadQueue.push(() => {
          n(this.play(e));
        });
      }) : (this._preloadQueue = [], this.autoPlay = !0, this._autoPlayOptions = e, new Promise((n, o) => {
        this._preload((r, a, l) => {
          this._preloadQueue.forEach((f) => f()), this._preloadQueue = null, r ? o(r) : (e.loaded && e.loaded(r, a, l), n(l));
        });
      }));
    (this.singleInstance || e.singleInstance) && this._removeInstances();
    const i = this._createInstance();
    return this._instances.push(i), this.isPlaying = !0, i.once("end", () => {
      e.complete && e.complete(this), this._onComplete(i);
    }), i.once("stop", () => {
      this._onComplete(i);
    }), i.play(e), i;
  }
  /** Internal only, speed, loop, volume change occured. */
  refresh() {
    const s = this._instances.length;
    for (let t = 0; t < s; t++)
      this._instances[t].refresh();
  }
  /** Handle changes in paused state. Internal only. */
  refreshPaused() {
    const s = this._instances.length;
    for (let t = 0; t < s; t++)
      this._instances[t].refreshPaused();
  }
  /** Gets and sets the volume. */
  get volume() {
    return this._volume;
  }
  set volume(s) {
    this._volume = s, this.refresh();
  }
  /** Gets and sets the muted flag. */
  get muted() {
    return this._muted;
  }
  set muted(s) {
    this._muted = s, this.refresh();
  }
  /** Gets and sets the looping. */
  get loop() {
    return this._loop;
  }
  set loop(s) {
    this._loop = s, this.refresh();
  }
  /** Starts the preloading of sound. */
  _preload(s) {
    this.media.load(s);
  }
  /** Gets the list of instances that are currently being played of this sound. */
  get instances() {
    return this._instances;
  }
  /** Get the map of sprites. */
  get sprites() {
    return this._sprites;
  }
  /** Get the duration of the audio in seconds. */
  get duration() {
    return this.media.duration;
  }
  /** Auto play the first instance. */
  autoPlayStart() {
    let s;
    return this.autoPlay && (s = this.play(this._autoPlayOptions)), s;
  }
  /** Removes all instances. */
  _removeInstances() {
    for (let s = this._instances.length - 1; s >= 0; s--)
      this._poolInstance(this._instances[s]);
    this._instances.length = 0;
  }
  /**
   * Sound instance completed.
   * @param instance
   */
  _onComplete(s) {
    if (this._instances) {
      const t = this._instances.indexOf(s);
      t > -1 && this._instances.splice(t, 1), this.isPlaying = this._instances.length > 0;
    }
    this._poolInstance(s);
  }
  /** Create a new instance. */
  _createInstance() {
    if (G._pool.length > 0) {
      const s = G._pool.pop();
      return s.init(this.media), s;
    }
    return this.media.create();
  }
  /**
   * Destroy/recycling the instance object.
   * @param instance - Instance to recycle
   */
  _poolInstance(s) {
    s.destroy(), G._pool.indexOf(s) < 0 && G._pool.push(s);
  }
};
let A = G;
A._pool = [];
class K extends nt {
  constructor() {
    const t = window, e = new K.AudioContext(), i = e.createDynamicsCompressor(), n = e.createAnalyser();
    n.connect(i), i.connect(e.destination), super(n, i), this.autoPause = !0, this._ctx = e, this._offlineCtx = new K.OfflineAudioContext(
      1,
      2,
      t.OfflineAudioContext ? Math.max(8e3, Math.min(96e3, e.sampleRate)) : 44100
    ), this.compressor = i, this.analyser = n, this.events = new U(), this.volume = 1, this.speed = 1, this.muted = !1, this.paused = !1, this._locked = e.state === "suspended" && ("ontouchstart" in globalThis || "onclick" in globalThis), this._locked && (this._unlock(), this._unlock = this._unlock.bind(this), document.addEventListener("mousedown", this._unlock, !0), document.addEventListener("touchstart", this._unlock, !0), document.addEventListener("touchend", this._unlock, !0)), this.onFocus = this.onFocus.bind(this), this.onBlur = this.onBlur.bind(this), globalThis.addEventListener("focus", this.onFocus), globalThis.addEventListener("blur", this.onBlur);
  }
  /** Handle mobile WebAudio context resume */
  onFocus() {
    if (!this.autoPause)
      return;
    const t = this._ctx.state;
    (t === "suspended" || t === "interrupted" || !this._locked) && (this.paused = this._pausedOnBlur, this.refreshPaused());
  }
  /** Handle mobile WebAudio context suspend */
  onBlur() {
    this.autoPause && (this._locked || (this._pausedOnBlur = this._paused, this.paused = !0, this.refreshPaused()));
  }
  /**
   * Try to unlock audio on iOS. This is triggered from either WebAudio plugin setup (which will work if inside of
   * a `mousedown` or `touchend` event stack), or the first document touchend/mousedown event. If it fails (touchend
   * will fail if the user presses for too long, indicating a scroll event instead of a click event.
   *
   * Note that earlier versions of iOS supported `touchstart` for this, but iOS9 removed this functionality. Adding
   * a `touchstart` event to support older platforms may preclude a `mousedown` even from getting fired on iOS9, so we
   * stick with `mousedown` and `touchend`.
   */
  _unlock() {
    this._locked && (this.playEmptySound(), this._ctx.state === "running" && (document.removeEventListener("mousedown", this._unlock, !0), document.removeEventListener("touchend", this._unlock, !0), document.removeEventListener("touchstart", this._unlock, !0), this._locked = !1));
  }
  /**
   * Plays an empty sound in the web audio context.  This is used to enable web audio on iOS devices, as they
   * require the first sound to be played inside of a user initiated event (touch/click).
   */
  playEmptySound() {
    const t = this._ctx.createBufferSource();
    t.buffer = this._ctx.createBuffer(1, 1, 22050), t.connect(this._ctx.destination), t.start(0, 0, 0), t.context.state === "suspended" && t.context.resume();
  }
  /**
   * Get AudioContext class, if not supported returns `null`
   * @type {AudioContext}
   * @readonly
   */
  static get AudioContext() {
    const t = window;
    return t.AudioContext || t.webkitAudioContext || null;
  }
  /**
   * Get OfflineAudioContext class, if not supported returns `null`
   * @type {OfflineAudioContext}
   * @readonly
   */
  static get OfflineAudioContext() {
    const t = window;
    return t.OfflineAudioContext || t.webkitOfflineAudioContext || null;
  }
  /** Destroy this context. */
  destroy() {
    super.destroy();
    const t = this._ctx;
    typeof t.close < "u" && t.close(), globalThis.removeEventListener("focus", this.onFocus), globalThis.removeEventListener("blur", this.onBlur), this.events.removeAllListeners(), this.analyser.disconnect(), this.compressor.disconnect(), this.analyser = null, this.compressor = null, this.events = null, this._offlineCtx = null, this._ctx = null;
  }
  /**
   * The WebAudio API AudioContext object.
   * @readonly
   * @type {AudioContext}
   */
  get audioContext() {
    return this._ctx;
  }
  /**
   * The WebAudio API OfflineAudioContext object.
   * @readonly
   * @type {OfflineAudioContext}
   */
  get offlineContext() {
    return this._offlineCtx;
  }
  /**
   * Pauses all sounds, even though we handle this at the instance
   * level, we'll also pause the audioContext so that the
   * time used to compute progress isn't messed up.
   * @default false
   */
  set paused(t) {
    t && this._ctx.state === "running" ? this._ctx.suspend() : !t && this._ctx.state === "suspended" && this._ctx.resume(), this._paused = t;
  }
  get paused() {
    return this._paused;
  }
  /** Emit event when muted, volume or speed changes */
  refresh() {
    this.events.emit("refresh");
  }
  /** Emit event when muted, volume or speed changes */
  refreshPaused() {
    this.events.emit("refreshPaused");
  }
  /**
   * Toggles the muted state.
   * @return The current muted state.
   */
  toggleMute() {
    return this.muted = !this.muted, this.refresh(), this.muted;
  }
  /**
   * Toggles the paused state.
   * @return The current muted state.
   */
  togglePause() {
    return this.paused = !this.paused, this.refreshPaused(), this._paused;
  }
  /**
   * Decode the audio data
   * @param arrayBuffer - Buffer from loader
   * @param callback - When completed, error and audioBuffer are parameters.
   */
  decode(t, e) {
    const i = (o) => {
      e(new Error(o?.message || "Unable to decode file"));
    }, n = this._offlineCtx.decodeAudioData(
      t,
      (o) => {
        e(null, o);
      },
      i
    );
    n && n.catch(i);
  }
}
class Ft {
  constructor() {
    this.init();
  }
  /**
   * Re-initialize the sound library, this will
   * recreate the AudioContext. If there's a hardware-failure
   * call `close` and then `init`.
   * @return Sound instance
   */
  init() {
    return this.supported && (this._webAudioContext = new K()), this._htmlAudioContext = new vt(), this._sounds = {}, this.useLegacy = !this.supported, this;
  }
  /**
   * The global context to use.
   * @readonly
   */
  get context() {
    return this._context;
  }
  /**
   * Apply filters to all sounds. Can be useful
   * for setting global planning or global effects.
   * **Only supported with WebAudio.**
   * @example
   * import { sound, filters } from '@pixi/sound';
   * // Adds a filter to pan all output left
   * sound.filtersAll = [
   *     new filters.StereoFilter(-1)
   * ];
   */
  get filtersAll() {
    return this.useLegacy ? [] : this._context.filters;
  }
  set filtersAll(t) {
    this.useLegacy || (this._context.filters = t);
  }
  /**
   * `true` if WebAudio is supported on the current browser.
   */
  get supported() {
    return K.AudioContext !== null;
  }
  /**
   * @ignore
   */
  add(t, e) {
    if (typeof t == "object") {
      const o = {};
      for (const r in t) {
        const a = this._getOptions(
          t[r],
          e
        );
        o[r] = this.add(r, a);
      }
      return o;
    }
    if (console.assert(!this._sounds[t], `Sound with alias ${t} already exists.`), e instanceof A)
      return this._sounds[t] = e, e;
    const i = this._getOptions(e), n = A.from(i);
    return this._sounds[t] = n, n;
  }
  /**
   * Internal methods for getting the options object
   * @private
   * @param source - The source options
   * @param overrides - Override default options
   * @return The construction options
   */
  _getOptions(t, e) {
    let i;
    return typeof t == "string" ? i = { url: t } : Array.isArray(t) ? i = { url: t } : t instanceof ArrayBuffer || t instanceof AudioBuffer || t instanceof HTMLAudioElement ? i = { source: t } : i = t, i = { ...i, ...e || {} }, i;
  }
  /**
   * Do not use WebAudio, force the use of legacy. This **must** be called before loading any files.
   */
  get useLegacy() {
    return this._useLegacy;
  }
  set useLegacy(t) {
    this._useLegacy = t, this._context = !t && this.supported ? this._webAudioContext : this._htmlAudioContext;
  }
  /**
   * This disables auto-pause all playback when the window blurs (WebAudio only).
   * This is helpful to keep from playing sounds when the user switches tabs.
   * However, if you're running content within an iframe, this may be undesirable
   * and you should disable (set to `true`) this behavior.
   * @default false
   */
  get disableAutoPause() {
    return !this._webAudioContext.autoPause;
  }
  set disableAutoPause(t) {
    this._webAudioContext.autoPause = !t;
  }
  /**
   * Removes a sound by alias.
   * @param alias - The sound alias reference.
   * @return Instance for chaining.
   */
  remove(t) {
    return this.exists(t, !0), this._sounds[t].destroy(), delete this._sounds[t], this;
  }
  /**
   * Set the global volume for all sounds. To set per-sound volume see {@link SoundLibrary#volume}.
   */
  get volumeAll() {
    return this._context.volume;
  }
  set volumeAll(t) {
    this._context.volume = t, this._context.refresh();
  }
  /**
   * Set the global speed for all sounds. To set per-sound speed see {@link SoundLibrary#speed}.
   */
  get speedAll() {
    return this._context.speed;
  }
  set speedAll(t) {
    this._context.speed = t, this._context.refresh();
  }
  /**
   * Toggle paused property for all sounds.
   * @return `true` if all sounds are paused.
   */
  togglePauseAll() {
    return this._context.togglePause();
  }
  /**
   * Pauses any playing sounds.
   * @return Instance for chaining.
   */
  pauseAll() {
    return this._context.paused = !0, this._context.refreshPaused(), this;
  }
  /**
   * Resumes any sounds.
   * @return Instance for chaining.
   */
  resumeAll() {
    return this._context.paused = !1, this._context.refreshPaused(), this;
  }
  /**
   * Toggle muted property for all sounds.
   * @return `true` if all sounds are muted.
   */
  toggleMuteAll() {
    return this._context.toggleMute();
  }
  /**
   * Mutes all playing sounds.
   * @return Instance for chaining.
   */
  muteAll() {
    return this._context.muted = !0, this._context.refresh(), this;
  }
  /**
   * Unmutes all playing sounds.
   * @return Instance for chaining.
   */
  unmuteAll() {
    return this._context.muted = !1, this._context.refresh(), this;
  }
  /**
   * Stops and removes all sounds. They cannot be used after this.
   * @return Instance for chaining.
   */
  removeAll() {
    for (const t in this._sounds)
      this._sounds[t].destroy(), delete this._sounds[t];
    return this;
  }
  /**
   * Stops all sounds.
   * @return Instance for chaining.
   */
  stopAll() {
    for (const t in this._sounds)
      this._sounds[t].stop();
    return this;
  }
  /**
   * Checks if a sound by alias exists.
   * @param alias - Check for alias.
   * @param assert - Whether enable console.assert.
   * @return true if the sound exists.
   */
  exists(t, e = !1) {
    const i = !!this._sounds[t];
    return e && console.assert(i, `No sound matching alias '${t}'.`), i;
  }
  /**
   * Convenience function to check to see if any sound is playing.
   * @returns `true` if any sound is currently playing.
   */
  isPlaying() {
    for (const t in this._sounds)
      if (this._sounds[t].isPlaying)
        return !0;
    return !1;
  }
  /**
   * Find a sound by alias.
   * @param alias - The sound alias reference.
   * @return Sound object.
   */
  find(t) {
    return this.exists(t, !0), this._sounds[t];
  }
  /**
   * Plays a sound.
   * @method play
   * @instance
   * @param {string} alias - The sound alias reference.
   * @param {string} sprite - The alias of the sprite to play.
   * @return {IMediaInstance|null} The sound instance, this cannot be reused
   *         after it is done playing. Returns `null` if the sound has not yet loaded.
   */
  /**
   * Plays a sound.
   * @param alias - The sound alias reference.
   * @param {PlayOptions|Function} options - The options or callback when done.
   * @return The sound instance,
   *        this cannot be reused after it is done playing. Returns a Promise if the sound
   *        has not yet loaded.
   */
  play(t, e) {
    return this.find(t).play(e);
  }
  /**
   * Stops a sound.
   * @param alias - The sound alias reference.
   * @return Sound object.
   */
  stop(t) {
    return this.find(t).stop();
  }
  /**
   * Pauses a sound.
   * @param alias - The sound alias reference.
   * @return Sound object.
   */
  pause(t) {
    return this.find(t).pause();
  }
  /**
   * Resumes a sound.
   * @param alias - The sound alias reference.
   * @return Instance for chaining.
   */
  resume(t) {
    return this.find(t).resume();
  }
  /**
   * Get or set the volume for a sound.
   * @param alias - The sound alias reference.
   * @param volume - Optional current volume to set.
   * @return The current volume.
   */
  volume(t, e) {
    const i = this.find(t);
    return e !== void 0 && (i.volume = e), i.volume;
  }
  /**
   * Get or set the speed for a sound.
   * @param alias - The sound alias reference.
   * @param speed - Optional current speed to set.
   * @return The current speed.
   */
  speed(t, e) {
    const i = this.find(t);
    return e !== void 0 && (i.speed = e), i.speed;
  }
  /**
   * Get the length of a sound in seconds.
   * @param alias - The sound alias reference.
   * @return The current duration in seconds.
   */
  duration(t) {
    return this.find(t).duration;
  }
  /**
   * Closes the sound library. This will release/destroy
   * the AudioContext(s). Can be used safely if you want to
   * initialize the sound library later. Use `init` method.
   */
  close() {
    return this.removeAll(), this._sounds = null, this._webAudioContext && (this._webAudioContext.destroy(), this._webAudioContext = null), this._htmlAudioContext && (this._htmlAudioContext.destroy(), this._htmlAudioContext = null), this._context = null, this;
  }
}
const Y = (s) => {
  const t = s.src;
  let e = s?.alias?.[0];
  return (!e || s.src === e) && (e = W.basename(t, W.extname(t))), e;
}, Vt = {
  extension: Z.Asset,
  detection: {
    test: async () => !0,
    add: async (s) => [...s, ...Q.filter((t) => D[t])],
    remove: async (s) => s.filter((t) => s.includes(t))
  },
  loader: {
    name: "sound",
    extension: {
      type: [Z.LoadParser],
      priority: ht.High
    },
    /** Should we attempt to load this file? */
    test(s) {
      const t = W.extname(s).slice(1);
      return !!D[t] || Pt.some((e) => s.startsWith(`data:${e}`));
    },
    /** Load the sound file, this is mostly handled by Sound.from() */
    async load(s, t) {
      const e = await new Promise((i, n) => A.from({
        ...t.data,
        url: s,
        preload: !0,
        loaded(o, r) {
          o ? n(o) : i(r), t.data?.loaded?.(o, r);
        }
      }));
      return E().add(Y(t), e), e;
    },
    /** Remove the sound from the library */
    async unload(s, t) {
      E().remove(Y(t));
    }
  }
};
dt.add(Vt);
const V = yt(new Ft());
class L {
  constructor(t, e, i, n, o, r, a, l) {
    this.fn = t, this.buf = e, this.start_ms = i, this.end_ms = n, this.ret_ms = o, this.volume = r, this.pan = a, this.stt = l ? new R() : new At(), l && this.addSnd(l);
  }
  static #t = 1;
  stt;
  loop = !1;
  addSnd(t) {
    switch (this.loop = t.loop, this.stt.onLoad(this), this.pan !== 0 && (t.filters = [new j(this.pan)]), this.setVol = (e) => t.volume = e, this.tw = () => new mt(t), this.onPlayEnd = () => {
      this.stt.onPlayEnd(this.buf), this.#s();
    }, this.stop = () => {
      t.stop(), this.#s();
    }, this.destroy = () => t.destroy(), this.buf) {
      // セリフ再生中はBGM音量を絞る
      case et:
        const e = Number(h.getVal("sys:sn.sound.BGM.vol_mul_talking") ?? 1);
        if (e === 1) break;
        L.#t = e;
        const i = J[P];
        i && i.setVol(this.volume * L.#t);
        break;
      case P:
        t.volume = this.volume * L.#t;
        break;
    }
  }
  #s = () => {
    if (this.#s = () => {
    }, L.#t === 1 || this.buf !== et) return;
    L.#t = 1;
    const t = J[P];
    t && t.setVol(this.volume * L.#t);
  };
  setVol(t) {
  }
  tw() {
  }
  onPlayEnd() {
  }
  stop() {
  }
  destroy() {
  }
}
let tt, h, F, J, O;
const P = "BGM", m = "SE", et = "VOICE";
class d {
  constructor(t, e, i) {
    this.hArg = t, this.buf = e, this.fn = i;
    const n = x(t, "start_ms", 0), o = x(t, "end_ms", d.#s), r = x(t, "ret_ms", 0), a = x(t, "pan", 0), l = x(t, "speed", 1);
    if (n < 0) throw `[playse] start_ms:${n} が負の値です`;
    if (r < 0) throw `[playse] ret_ms:${r} が負の値です`;
    if (0 < o) {
      if (o <= n) throw `[playse] start_ms:${n} >= end_ms:${o} は異常値です`;
      if (o <= r) throw `[playse] ret_ms:${r} >= end_ms:${o} は異常値です`;
    }
    const f = "const.sn.sound." + e + ".";
    h.setVal_Nochk("save", f + "fn", i);
    const y = d.getVol(t, 1);
    h.setVal_Nochk("save", f + "volume", y);
    const v = y * Number(h.getVal("sys:" + f + "volume", 1)), g = S(t, "loop", !1);
    g ? (d.#t[e] = i, h.setVal_Nochk("save", "const.sn.loopPlaying", JSON.stringify(d.#t))) : d.delLoopPlay(e), h.setVal_Nochk("save", f + "start_ms", n), h.setVal_Nochk("save", f + "end_ms", o), h.setVal_Nochk("save", f + "ret_ms", r), h.setVal_Nochk("tmp", f + "playing", !0), h.flush();
    const p = V.exists(i) ? V.find(i) : void 0;
    this.#e = new L(
      i,
      e,
      n,
      o,
      r,
      v,
      a,
      p
    );
    const _ = {
      loop: g,
      speed: l,
      volume: v,
      loaded: (c, b) => {
        if (!this.#e.stt.isDestroy) {
          if (c) {
            F.errScript(`ロード失敗です SndBuf fn:${i} ${c}`, !1);
            return;
          }
          b && (this.#e.addSnd(b), a !== 0 && (b.filters = [new j(a)]), t.fnc?.());
        }
      }
    };
    let N = "";
    if (0 < n || o < d.#s) {
      N = `${i};${n};${o};${r}`;
      const c = (_.sprites ??= {})[N] = {
        start: n / 1e3,
        end: o / 1e3
      };
      _.preload = !0;
      const b = _.loaded;
      _.loaded = (M, $) => {
        if (this.#e.stt.isDestroy) return;
        b(M, $);
        const H = $, T = H.duration;
        c.end < 0 && (c.end += T, H.removeSprites(N), H.addSprites(N, c)), c.end <= c.start && F.errScript(`[playse] end_ms:${o}(${c.end * 1e3}) >= start_ms:${n} は異常値です`), c.end * 1e3 <= r && F.errScript(`[playse] end_ms:${o}(${c.end * 1e3}) <= ret_ms:${r} は異常値です`), T <= c.start && F.errScript(`[playse] 音声ファイル再生時間:${T * 1e3} <= start_ms:${n} は異常値です`), o !== d.#s && T <= c.end && F.errScript(`[playse] 音声ファイル再生時間:${T * 1e3} <= end_ms:${o} は異常値です`), H.play(N, (lt) => _.complete?.(lt));
      };
    } else _.autoPlay = !0;
    if (g ? r !== 0 && (_.loop = !1, _.complete = async (c) => {
      const b = c.duration, M = r / 1e3, $ = o / 1e3;
      b <= M && F.errScript(`[playse] 音声ファイル再生時間:${b * 1e3} <=  ret_ms:${r} は異常値です`), await c.play({
        // 一周目はループなし、なのでキャッシュされてる
        ..._,
        start: M,
        end: $ < 0 ? $ + b : $,
        // 負の値は末尾から
        //	speed,		// 重複
        loop: !0,
        //	volume,		// 重複
        //-	muted?: boolean;
        filters: a !== 0 ? [new j(a)] : []
        //-	complete?: CompleteCallback;
        //-	loaded?: LoadedCallback;
        //-	singleInstance?: boolean;
      });
    }) : _.complete = () => {
      X(this.#e, e), this.#e.onPlayEnd();
    }, this.#i(), p) {
      if (p.volume = v, N) this.#o(i, _);
      else if (p.isPlayable) {
        const c = p.options.source;
        !(c instanceof ArrayBuffer) || c.byteLength === 0 ? p.play(_) : this.#e.addSnd(A.from({
          ..._,
          url: p.options.url,
          source: c
        })), a !== 0 && (p.filters = [new j(a)]);
      }
      this.needLoad = !1;
      return;
    }
    if (this.needLoad = S(t, "join", !0)) {
      pt();
      const c = _.loaded;
      _.loaded = (b, M) => {
        this.#e.stt.isDestroy || c(b, M), _t();
      };
    }
    this.#o(i, _);
  }
  static #t = {};
  static init(t, e, i, n) {
    d.#t = {}, tt = t, h = e, F = i, J = n;
  }
  static setEvtMng(t) {
    O = t;
  }
  static delLoopPlay(t) {
    delete d.#t[t];
    const e = "const.sn.sound." + t + ".";
    h.setVal_Nochk("save", e + "fn", ""), h.setVal_Nochk("save", "const.sn.loopPlaying", JSON.stringify(d.#t)), h.flush();
  }
  static getVol(t, e) {
    const i = x(t, "volume", e);
    return i < 0 ? 0 : i > 1 ? 1 : i;
  }
  static xchgbuf({ buf: t = m, buf2: e = m }) {
    if (t === e) throw `[xchgbuf] buf:${t} が同じ値です`;
    const i = "const.sn.sound." + t + ".", n = Number(h.getVal("save:" + i + "volume")), o = String(h.getVal("save:" + i + "fn")), r = "const.sn.sound." + e + ".", a = Number(h.getVal("save:" + r + "volume")), l = String(h.getVal("save:" + r + "fn"));
    h.setVal_Nochk("save", i + "volume", a), h.setVal_Nochk("save", r + "volume", n), h.setVal_Nochk("save", i + "fn", l), h.setVal_Nochk("save", r + "fn", o), t in d.#t != e in d.#t && (t in d.#t ? (delete d.#t[t], d.#t[e] = o) : (delete d.#t[e], d.#t[t] = l), h.setVal_Nochk("save", "const.sn.loopPlaying", JSON.stringify(d.#t))), h.flush();
  }
  static #s = 999e3;
  #e;
  needLoad;
  #i = () => {
    V.volumeAll = Number(h.getVal("sys:sn.sound.global_volume", 1)), this.#i = () => {
    };
  };
  #o(t, e) {
    const i = tt.searchPath(t, ct.SOUND);
    if (!i.endsWith(".bin")) {
      e.url = i, A.from(e);
      return;
    }
    const n = (r) => {
      e.source = structuredClone(r), A.from(e);
    }, o = ":snd:" + t;
    z.cache.has(o) ? n(z.get(o)) : z.load({ alias: o, src: i }).then(n);
  }
  setVol(t) {
    this.#e.setVol(t);
  }
  ws = (t) => this.#e.stt.ws(this.#e, t);
  stopse({ buf: t = m }) {
    X(this.#e, t), this.#e.stt.stopse(this.#e);
  }
  fade = (t) => this.#e.stt.fade(this.#e, t);
  wf = (t) => this.#e.stt.wf(this.#e, t);
  stopfadese = (t) => this.#e.stt.stopfadese(this.#e, t);
}
function X({ loop: s }, t) {
  if (s) {
    d.delLoopPlay(t);
    return;
  }
  const e = "const.sn.sound." + t + ".";
  h.setVal_Nochk("tmp", e + "playing", !1), h.flush();
}
function B(s) {
  s.stop().end();
}
class At {
  onLoad(t) {
    t.stt = new R();
  }
  stopse(t) {
    t.stt = new C(t, !1);
  }
  ws = () => !1;
  onPlayEnd() {
  }
  // ok
  fade() {
  }
  // ok
  wf = () => !1;
  // ok
  compFade() {
  }
  // ok
  stopfadese() {
  }
  // ok
  isDestroy = !1;
}
class R {
  onLoad() {
  }
  // ok
  stopse(t) {
    t.stt = new C(t);
  }
  ws(t, e) {
    if (t.loop) return !1;
    const { buf: i = m } = e, n = S(e, "stop", !0);
    return S(e, "canskip", !1), O.waitEvent("buf:" + i, e, () => {
      X(t, i), t.onPlayEnd(), n ? t.stt.stopse(t) : t.stt.onPlayEnd = () => {
      };
    }) ? (t.stt = new Ct(), !0) : !1;
  }
  onPlayEnd() {
  }
  // ok
  fade(t, e) {
    const { buf: i = m } = e, o = "const.sn.sound." + i + "." + "volume", r = d.getVol(e, NaN);
    h.setVal_Nochk("save", o, r);
    const a = r * Number(h.getVal("sys:" + o, 1)), l = S(e, "stop", r === 0);
    l && d.delLoopPlay(i), h.flush();
    const f = x(e, "time", NaN), y = x(e, "delay", 0);
    if (f === 0 && y === 0 || O.isSkipping) {
      t.setVol(a), t.stt = l ? new C(t) : new R();
      return;
    }
    const v = t.tw();
    v && (ft.setTwProp(v, e).to({ volume: a }, f).onComplete(() => {
      gt(v), t.stt.compFade(i), t.stt = l ? new C(t) : new R();
    }).start(), t.stt = new Nt(v));
  }
  wf = () => !1;
  // ok
  compFade() {
  }
  // ok
  stopfadese() {
  }
  // ok
  isDestroy = !1;
}
class Ct {
  onLoad() {
  }
  // ok
  stopse(t) {
    t.stt = new C(t);
  }
  ws = () => !1;
  // ok
  onPlayEnd(t) {
    O.breakEvent("buf:" + t);
  }
  fade() {
  }
  // ok
  wf = () => !1;
  // ok
  compFade() {
  }
  // ok
  stopfadese() {
  }
  // ok
  isDestroy = !1;
}
class Nt {
  constructor(t) {
    this.tw = t;
  }
  onLoad() {
  }
  // ok
  stopse(t) {
    B(this.tw), t.stt = new C(t);
  }
  // 順番厳守
  ws = () => !1;
  // ok ?
  onPlayEnd() {
  }
  // ok
  fade() {
  }
  // ok
  wf(t, e) {
    const { buf: i = m } = e;
    return S(e, "canskip", !1), O.waitEvent("buf:" + i, e, () => B(this.tw)) ? (t.stt = new Mt(this.tw), !0) : !1;
  }
  compFade() {
  }
  // ok
  stopfadese = () => B(this.tw);
  isDestroy = !1;
}
class Mt {
  constructor(t) {
    this.tw = t;
  }
  onLoad() {
  }
  // ok
  stopse(t) {
    B(this.tw), t.stt = new C(t);
  }
  ws = () => !1;
  // ok
  onPlayEnd() {
  }
  // ok
  fade() {
  }
  // ok
  wf = () => !1;
  // ok
  compFade(t) {
    O.breakEvent("buf:" + t);
  }
  stopfadese = () => B(this.tw);
  isDestroy = !1;
}
class C {
  constructor(t, e = !0) {
    this.si = t, this.stop = e, e && (t.stop(), t.loop && (t.destroy(), t.destroy = () => {
    }));
  }
  onLoad() {
  }
  // ok
  stopse() {
  }
  // ok
  ws = () => !1;
  // ok
  onPlayEnd() {
  }
  // ok
  fade() {
  }
  // ok
  wf = () => !1;
  // ok
  compFade() {
  }
  // ok
  stopfadese() {
  }
  // ok
  isDestroy = !0;
}
class It {
  constructor(t, e, i, n) {
    this.val = i, e.volume = (o) => this.#e(o), e.fadebgm = (o) => this.#u(o), e.fadeoutbgm = (o) => this.#o(o), e.fadeoutse = (o) => this.#p(o), e.fadese = (o) => this.#n(o), e.playbgm = (o) => this.#h(o), e.playse = (o) => this.#l(o), e.stop_allse = () => this.#r(), e.stopbgm = (o) => this.#_(o), e.stopse = (o) => this.#a(o), e.wb = (o) => this.#m(o), e.wf = (o) => this.#d(o), e.stopfadese = (o) => this.#c(o), e.wl = (o) => this.#g(o), e.ws = (o) => this.#f(o), e.xchgbuf = (o) => this.#y(o), i.setVal_Nochk("save", "const.sn.loopPlaying", "{}"), i.setVal_Nochk("tmp", "const.sn.sound.codecs", JSON.stringify(D)), d.init(t, i, n, this.#t), V.disableAutoPause = !0;
  }
  #t = {};
  #s;
  setEvtMng(t) {
    this.#s = t, d.setEvtMng(t);
  }
  setNoticeChgVolume(t, e) {
    this.val.defValTrg("sys:sn.sound.global_volume", (i, n) => t(V.volumeAll = Number(n))), this.val.defValTrg("sys:sn.sound.movie_volume", (i, n) => e(Number(n))), this.val.setVal_Nochk("sys", "sn.sound.global_volume", this.val.getVal("sys:sn.sound.global_volume", 1)), this.val.setVal_Nochk("sys", "sn.sound.movie_volume", this.val.getVal("sys:sn.sound.movie_volume", 1));
  }
  //MARK: 音量設定（独自拡張）
  #e(t) {
    const { buf: e = m } = t, i = "const.sn.sound." + e + ".volume", n = this.#i(t, 1);
    return Number(this.val.getVal("sys:" + i)) === n ? !1 : (this.val.setVal_Nochk("sys", i, n), this.val.flush(), t.time = 0, t.volume = Number(this.val.getVal("save:" + i)), this.#n(t));
  }
  #i(t, e) {
    const i = x(t, "volume", e);
    return i < 0 ? 0 : i > 1 ? 1 : i;
  }
  //MARK: BGM/効果音のフェードアウト（loadから使うのでマクロ化禁止）
  #o(t) {
    return t.volume = 0, this.#u(t);
  }
  //MARK: 効果音のフェードアウト（loadから使うのでマクロ化禁止）
  #p(t) {
    return t.volume = 0, this.#n(t);
  }
  //MARK: BGMのフェード（loadから使うのでマクロ化禁止）
  #u(t) {
    return t.buf = P, this.#n(t);
  }
  //MARK: 効果音のフェード
  #n(t) {
    const { buf: e = m } = t;
    return this.#c(t), this.#t[e]?.fade(t), !1;
  }
  //MARK: BGM の演奏
  #h(t) {
    return t.buf = P, t.canskip = !1, S(t, "loop", !0), this.#l(t);
  }
  //MARK: 効果音の再生
  #l(t) {
    const { buf: e = m, fn: i } = t;
    if (this.#a({ buf: e }), !i) throw `fnは必須です buf:${e}`;
    return S(t, "canskip", !0) && this.#s.isSkipping ? !1 : (this.#t[e] = new d(t, e, i)).needLoad;
  }
  clearCache() {
    V.removeAll();
  }
  //MARK: 全効果音再生の停止
  #r() {
    for (const t of Object.keys(this.#t)) this.#a({ buf: t });
    return this.#t = {}, V.stopAll(), !1;
  }
  //MARK: BGM 演奏の停止（loadから使うのでマクロ化禁止）
  #_(t) {
    return t.buf = P, this.#a(t);
  }
  //MARK: 効果音再生の停止
  #a(t) {
    const { buf: e = m } = t;
    return this.#t[e]?.stopse(t), !1;
  }
  //MARK: BGM フェードの終了待ち
  #m(t) {
    return t.buf = P, this.#d(t);
  }
  //MARK: 効果音フェードの終了待ち
  #d(t) {
    const { buf: e = m } = t;
    return this.#t[e]?.wf(t);
  }
  //MARK: 音声フェードの停止
  #c(t) {
    const { buf: e = m } = t;
    return this.#t[e]?.stopfadese(t), !1;
  }
  //MARK: BGM 再生の終了待ち
  #g(t) {
    return t.buf = P, this.#f(t);
  }
  //MARK: 効果音再生の終了待ち
  #f(t) {
    const { buf: e = m } = t;
    return this.#t[e]?.ws(t);
  }
  //MARK: 再生トラックの交換
  #y(t) {
    const { buf: e = m, buf2: i = m } = t;
    if (e === i) return !1;
    const n = this.#t[e], o = this.#t[i];
    return n ? this.#t[i] = n : delete this.#t[i], o ? this.#t[e] = o : delete this.#t[e], d.xchgbuf(t), !1;
  }
  //MARK: しおりの読込（BGM状態復元）
  playLoopFromSaveObj(t) {
    const e = String(this.val.getVal("save:const.sn.loopPlaying", "{}"));
    if (e === "{}")
      return this.#r(), this.clearCache(), [];
    const i = JSON.parse(e);
    if (t)
      this.#r(), this.clearCache();
    else for (const [n, o] of Object.entries(this.#t))
      n in i || o?.stopse({ buf: n });
    return Object.entries(i).map(([n, o]) => new Promise((r) => {
      const a = this.#t[n];
      if (!t && a && a.fn === o) {
        r();
        return;
      }
      const l = "save:const.sn.sound." + n + ".", f = {
        fn: o,
        buf: n,
        join: !1,
        loop: !0,
        volume: Number(this.val.getVal(l + "volume")),
        start_ms: Number(this.val.getVal(l + "start_ms")),
        end_ms: Number(this.val.getVal(l + "end_ms")),
        ret_ms: Number(this.val.getVal(l + "ret_ms")),
        fnc: r
        // loaded
      };
      f.buf === P ? this.#h(f) : this.#l(f);
    }));
  }
  destroy() {
    this.#r(), this.clearCache();
  }
}
export {
  It as SoundMng
};
//# sourceMappingURL=SoundMng.js.map
