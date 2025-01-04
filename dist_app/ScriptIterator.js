import { e as x, C as N, A as $, S as v, t as b, f as y, h as T, b as d, j as _, D as k, a as E } from "./app2.js";
import { R as L } from "./RubySpliter.js";
import { d as S, e as D } from "./ReadState.js";
import { C } from "./CmnTween.js";
class w {
  constructor(t = "", s = 0, i = { ":hEvt1Time": {}, ":hMp": {}, ":lenIfStk": 1 }) {
    this.fn = t, this.idx = s, this.csArg = i;
  }
  toString = () => `[fn:${this.fn}, idx:${this.idx}, csArg:${this.csArg}]`;
}
class p {
  //MARK: コンストラクタ
  constructor(t, s, i, n, o, h, c) {
    this.cfg = t, this.hTag = s, this.main = i, this.val = n, this.prpPrs = o, this.sndMng = h, this.sys = c, s.let_ml = (e) => this.#X(e), s.endlet_ml = () => !1, s.dump_stack = () => this.#q(), s.dump_script = (e) => this.#Q(e), s.else = // その他ifブロック開始
    s.elsif = // 別条件のifブロック開始
    s.endif = () => this.#Z(), s.if = (e) => this.#tt(e), s.call = (e) => this.#st(e), s.jump = (e) => this.#it(e), s.pop_stack = (e) => this.#et(e), s.return = (e) => this.#M(e), s.bracket2macro = (e) => this.#ut(e), s.char2macro = (e) => this.#pt(e), s.endmacro = (e) => this.#M(e), s.macro = (e) => this.#dt(e), s.load = (e) => this.#kt(e), s.reload_script = (e) => this.#gt(e), s.record_place = () => this.#_t(), s.save = (e) => this.#vt(e), t.oCfg.debug.token && (this.#F = (e) => {
      e.trim() !== "" && console.log(`🌱 トークン fn:${this.#i} idx:${this.#t} ln:${this.#e} token【${e}】`);
    }), n.defTmp("const.sn.aIfStk.length", () => this.#o.length), n.defTmp("const.sn.vctCallStk.length", () => this.#n.length), this.#c = new x(t);
    const l = t.oCfg.init.escape;
    if (this.#c.setEscape(l), L.setEscape(l), N.isDbg) {
      c.addHook((a, r) => this.#v[a]?.(r)), this.isBreak = this.#J;
      const e = this.analyzeInit;
      this.analyzeInit = () => {
        this.analyzeInit = () => {
        }, this.sys.send2Dbg("hi", {});
      }, this.#v.auth = (a) => {
        const r = a.hBreakpoint.hFn2hLineBP;
        for (const [f, u] of Object.entries(r)) this.#L(f, u);
        p.#p = {};
        for (const f of a.hBreakpoint.aFunc)
          p.#p[f.name] = 1;
        if (a.stopOnEntry) {
          for (; ; ) {
            let f = this.nextToken();
            if (!f) break;
            const u = f.charCodeAt(0);
            if (u === 91 || u === 38 || u === 42 && f.length === 1) break;
            u === 10 && (this.#e += f.length);
          }
          this.sys.callHook("stopOnEntry", {}), this.analyzeInit = e, this.analyzeInit();
        } else
          this.noticeWait = () => {
            this.noticeWait = () => {
            }, this.sys.callHook("stopOnEntry", {});
          }, this.analyzeInit = e, this.analyzeInit();
      };
    } else this.recodeDesign = () => {
    };
    t.oCfg.debug.tag && (this.#B = (e) => console.log(`🌲 タグ解析 fn:${this.#i} idx:${this.#t} ln:${this.#e} %c[${e} %o]`, "background-color:#30B;", this.#r.hPrm));
  }
  #s = { aToken: [""], len: 1, aLNum: [1] };
  #i = "";
  get scriptFn() {
    return this.#i;
  }
  #t = 0;
  subIdxToken() {
    --this.#t;
  }
  #e = 0;
  get lineNum() {
    return this.#e;
  }
  addLineNum = (t) => this.#e += t;
  jumpJustBefore() {
    this.#f(this.#i, "", --this.#t);
  }
  // 直前にジャンプ
  #n = [];
  // FILOバッファ（push/pop）
  #c;
  #r = new $();
  noticeWait = () => {
  };
  #L(t, s) {
    p.#y[this.#g(t)] = s;
  }
  destroy() {
    this.isBreak = () => !1;
  }
  #v = {
    //auth: // constructorで
    //launch:	// ここでは冒頭停止に間に合わないのでanalyzeInit()で
    disconnect: () => {
      p.#y = {}, p.#p = {}, this.isBreak = () => !1, this.#v.continue({}), this.#h = 0;
    },
    restart: () => this.isBreak = () => !1,
    // ブレークポイント登録
    add_break: (t) => this.#L(t.fn, t.o),
    data_break: (t) => {
      this.#h === 0 && (this.#h = 1, this.main.setLoop(!1, `変数 ${t.dataId}【${t.old_v}】→【${t.new_v}】データブレーク`), this.sys.callHook("stopOnDataBreakpoint", {}), this.sys.send2Dbg("stopOnDataBreakpoint", {}));
    },
    set_func_break: (t) => {
      p.#p = {};
      for (const s of t.a) p.#p[s.name] = 1;
      this.sys.send2Dbg(t.ri, {});
    },
    // 情報問い合わせ系
    stack: (t) => this.sys.send2Dbg(t.ri, { a: this.#U() }),
    eval: (t) => {
      this.sys.send2Dbg(t.ri, { v: this.prpPrs.parse(t.txt) });
    },
    // デバッガからの操作系
    continue: () => {
      this.#b() || (this.#t -= this.#_, this.#h = 3, this.main.setLoop(!0), this.main.resume());
    },
    stepover: (t) => this.#D(t),
    stepin: () => {
      if (this.#b()) return;
      const t = this.#s.aToken[this.#t - this.#_];
      this.sys.callHook(`stopOnStep${this.#E.test(t ?? "") ? "In" : ""}`, {}), this.#t -= this.#_, this.#h = this.#h === 1 ? 4 : 5, this.main.setLoop(!0), this.main.resume();
    },
    stepout: (t) => {
      this.#b() || (this.#n.length > 0 ? this.#C(!0) : this.#D(t));
    },
    pause: () => {
      this.#h = 4, this.main.setLoop(!1, "一時停止"), this.sys.send2Dbg("stopOnStep", {});
    },
    stopOnEntry: () => {
      this.#h = 4, this.main.setLoop(!1, "一時停止"), this.sys.send2Dbg("stopOnEntry", {});
    }
  };
  #k = (t) => this.cfg.searchPath(t, v.SCRIPT);
  static #A = /(.+)\/crypto_prj\/([^\/]+)\/[^\.]+(\.\w+)/;
  // https://regex101.com/r/Km54EK/1 141 steps (~0ms)
  #g = (t) => (this.sys.pathBaseCnvSnPath4Dbg + this.#k(t)).replace(p.#A, `$1/prj/$2/${this.#i}$3`);
  cnvPath4Dbg = (t) => this.sys.pathBaseCnvSnPath4Dbg + t.replace("/crypto_prj/", "/prj/");
  #D(t) {
    if (this.#b()) return;
    const s = this.#s.aToken[this.#t - this.#_];
    this.#E.test(s ?? "") ? this.#C(!1) : (this.sys.callHook("stopOnStep", {}), this.#v.stepin(t));
  }
  #C(t) {
    this.sys.callHook(`stopOnStep${t ? "Out" : ""}`, {}), this.#P = this.#n.length - (t ? 1 : 0), this.#t -= this.#_, this.#h = t ? 7 : 6, this.main.setLoop(!0), this.main.resume();
  }
  #P = 0;
  get #_() {
    return this.#h === 2 || this.#h === 4 ? 1 : 0;
  }
  #b() {
    return this.#t < this.#s.len ? !1 : (this.sys.callHook("stopOnEntry", {}), this.main.setLoop(!1, "スクリプト終端です"), !0);
  }
  // reload 再生成 Main に受け渡すため static
  static #y = {};
  static #p = {};
  #h = 0;
  // https://raw.githubusercontent.com/famibee/SKYNovel-vscode-extension/master/src/doc/BreakStateSMD.pu
  isBreak = (t) => !1;
  #J(t) {
    switch (this.#h) {
      case 6:
        this.#T(), this.#h = 7;
        break;
      case 7:
        if (this.#n.length !== this.#P) break;
        return this.#h = 4, this.main.setLoop(!1, "ステップ実行"), this.sys.send2Dbg("stopOnStep", {}), !0;
      // タグを実行せず、直前停止
      case 5:
        this.#T(), this.#h = 4;
        break;
      case 4:
        return this.#T(), this.main.setLoop(!1, "ステップ実行"), this.sys.send2Dbg("stopOnStep", {}), !0;
      // タグを実行せず、直前停止
      case 3:
        this.#T(), this.#h = 0;
        break;
      default:
        if (b(t) in p.#p)
          return this.#h = 2, this.main.setLoop(!1, `関数 ${t} ブレーク`), this.sys.callHook("stopOnBreakpoint", {}), this.sys.send2Dbg("stopOnBreakpoint", {}), !0;
        {
          const s = p.#y[this.#g(this.#i)];
          if (!s) break;
          const i = s[this.#e];
          if (!i) break;
          if (i.condition) {
            if (!this.prpPrs.parse(i.condition)) break;
          } else if ("hitCondition" in i && --i.hitCondition > 0) break;
          const n = this.#h === 0;
          this.#h = 2, this.main.setLoop(!1, n ? (i.condition ? "条件" : "ヒットカウント") + "ブレーク" : "ステップ実行");
          const o = n ? "stopOnBreakpoint" : "stopOnStep";
          this.sys.callHook(o, {}), this.sys.send2Dbg(o, {});
        }
        return !0;
    }
    return !1;
  }
  #T() {
    const t = p.#y[y(this.#i)]?.[this.#e];
    t?.hitCondition && --t.hitCondition;
  }
  #U() {
    const t = this.#h === 3 ? 1 : 0, s = this.#s.aToken[this.#t - 1 + t], i = this.#g(this.#i), n = b(s), o = n ? `[${n}]` : s, h = this.val.getVal("mp:const.sn.macro") ?? "{}";
    if (this.#t === 0) return [{ fn: i, ln: 1, col: 1, nm: o, ma: h }];
    const c = this.#l(this.#s, this.#t), l = [{ fn: i, ln: c.ln, col: c.col_s + 1, nm: o, ma: h }], e = this.#n.length;
    if (e === 0) return l;
    for (let a = e - 1; a >= 0; --a) {
      const r = this.#n[a], f = this.#a[r.fn];
      if (!f) continue;
      const u = f.aToken[r.idx - 1];
      if (!u) continue;
      const g = this.#l(f, r.idx), m = b(u);
      l.push({
        fn: this.#g(r.fn),
        ln: g.ln,
        col: g.col_s + 1,
        nm: m ? `[${m}]` : u,
        ma: r.csArg[":hMp"]["const.sn.macro"] ?? "{}"
      });
    }
    return l;
  }
  // result = true : waitする  resume()で再開
  #B = (t) => {
  };
  //MARK: タグ解析
  タグ解析(t) {
    const [s, i] = T(t), n = this.hTag[s];
    if (!n) throw `未定義のタグ【${s}】です`;
    this.#r.parse(i), this.#B(s);
    const o = this.#r.hPrm;
    if (o.cond) {
      const e = o.cond.val;
      if (!e || e.startsWith("&")) throw "属性condは「&」が不要です";
      const a = this.prpPrs.parse(e), r = String(a);
      if (r === "null" || r === "undefined" || !a) return !1;
    }
    let h = {};
    const c = this.#n.length, l = c === 0 ? {} : this.#n[c - 1].csArg;
    if (this.#r.isKomeParam) {
      if (c === 0) throw "属性「*」はマクロのみ有効です";
      h = { ...l };
    }
    h[":タグ名"] = s;
    for (const [e, { val: a, def: r }] of Object.entries(o)) {
      let f = a;
      if (f?.startsWith("%")) {
        if (c === 0) throw "属性「%」はマクロ定義内でのみ使用できます（そのマクロの引数を示す簡略文法であるため）";
        const u = l[f.slice(1)];
        if (u) {
          h[e] = u;
          continue;
        }
        if (r === void 0 || r === "null") continue;
        f = r;
      }
      if (f = this.prpPrs.getValAmpersand(f ?? ""), f !== "undefined") {
        h[e] = f;
        continue;
      }
      r !== void 0 && (f = this.prpPrs.getValAmpersand(r), f !== "undefined" && (h[e] = f));
    }
    return n(h);
  }
  #$;
  #m;
  setOtherObj(t, s) {
    this.#$ = t, this.#m = s;
  }
  //MARK: インラインテキスト代入
  #X(t) {
    const { name: s } = t;
    if (!s) throw "nameは必須です";
    let i = "";
    const n = this.#s.len;
    for (; this.#t < n && (i = this.#s.aToken[this.#t], i === ""); ++this.#t)
      ;
    return t.text = i, t.cast = "str", this.hTag.let(t), this.#t += 2, this.#e += (i.match(/\n/g) ?? []).length, !1;
  }
  //MARK: スタックのダンプ
  #q() {
    if (this.#t === 0)
      return console.group(`🥟 [dump_stack] スクリプト現在地 fn:${this.#i} line:1 col:0`), console.groupEnd(), !1;
    const t = this.#l(this.#s, this.#t), s = `スクリプト現在地 fn:${this.#i} line:${t.ln} col:${t.col_s + 1}`;
    console.group(`🥟 [dump_stack] ${s}`);
    const i = this.#n.length;
    if (i > 0) {
      console.info(s);
      for (let n = i - 1; n >= 0; --n) {
        const o = this.#n[n], h = o.csArg[":hMp"], c = h ? h[":タグ名"] : void 0, l = o.csArg[":タグ名"] ?? "", e = this.#l(this.#a[o.fn], o.idx);
        console.info(
          `${i - n}つ前のコール元 fn:${o.fn} line:${e.ln} col:${e.col_s + 1}` + (c ? "（[" + c + "]マクロ内）" : " ") + `で [${l} ...]をコール`
        );
      }
    }
    return console.groupEnd(), !1;
  }
  #l(t, s) {
    const i = { ln: 1, col_s: 0, col_e: 0 };
    if (!t) return i;
    let n = s - 1;
    const o = i.ln = t.aLNum[n];
    for (; t.aLNum[n] === o; ) {
      if (!t.aToken[n].startsWith(`
`)) {
        const h = t.aToken[n].length;
        i.col_e > 0 && (i.col_s += h), i.col_e += h;
      }
      if (--n < 0) break;
    }
    return i;
  }
  //MARK: 外部へスクリプトを表示
  #Q(t) {
    const { set_fnc: s, break_fnc: i } = t;
    if (!s) throw "set_fncは必須です";
    if (this.#S = globalThis[s], !this.#S) {
      if (d(t, "need_err", !0)) throw `HTML内に関数${s}が見つかりません`;
      return this.#S = () => {
      }, !1;
    }
    if (this.noticeBreak = (n) => {
      this.#O !== this.#i && (this.#O = this.#i, this.#S(
        this.#Y[this.#i] ??= this.#s.aToken.join("")
      )), this.#w(this.#e, n);
    }, this.noticeBreak(!0), !i) return !1;
    if (this.#w = globalThis[i], !this.#w) {
      if (d(t, "need_err", !0)) throw `HTML内に関数${i}が見つかりません`;
      this.#w = () => {
      };
    }
    return !1;
  }
  #S = () => {
  };
  #w = () => {
  };
  #O = "";
  #Y = {};
  noticeBreak = (t) => {
  };
  #I = 5;
  dumpErrForeLine() {
    if (this.#t === 0) {
      console.group(`🥟 Error line (from 0 rows before) fn:${this.#i}`), console.groupEnd();
      return;
    }
    let t = "";
    for (let h = this.#t - 1; h >= 0 && (t = this.#s.aToken[h] + t, !((t.match(/\n/g) ?? []).length >= this.#I)); --h)
      ;
    const s = t.split(`
`).slice(-this.#I), i = s.length;
    console.group(`🥟 Error line (from ${i} rows before) fn:${this.#i}`);
    const n = String(this.#e).length, o = this.#l(this.#s, this.#t);
    for (let h = 0; h < i; ++h) {
      const c = this.#e - i + h + 1, l = `${String(c).padStart(n, " ")}: %c`, e = s[h], a = e.length > 75 ? e.slice(0, 75) + "…" : e;
      h === i - 1 ? console.info(
        l + a.slice(0, o.col_s) + "%c" + a.slice(o.col_s),
        "color: black; background-color: skyblue;",
        "color: black; background-color: pink;"
      ) : console.info(l + a, "color: black; background-color: skyblue;");
    }
    console.groupEnd();
  }
  #o = [-1];
  // 先頭に積む FIFOバッファ（unshift / shift）
  //MARK: ifブロックの終端
  #Z() {
    const t = this.#o[0];
    if (!t) throw "this.#aIfStk が異常です";
    if (t === -1) throw "ifブロック内ではありません";
    return this.#t = t, this.#o.shift(), !1;
  }
  //MARK: ifブロックの開始
  #tt(t) {
    const { exp: s } = t;
    if (!s) throw "expは必須です";
    if (s.startsWith("&")) throw "属性expは「&」が不要です";
    let i = 0, n = this.prpPrs.parse(s) ? this.#t : -1;
    const o = this.#s.aLNum[this.#t];
    let h = this.#e - (o || 0);
    const c = this.#s.len;
    for (; this.#t < c; ++this.#t) {
      const l = this.#s.aLNum[this.#t];
      this.#s.aLNum[this.#t] = (l || 0) + h;
      const e = this.#s.aToken[this.#t];
      if (!e) continue;
      const a = e.charCodeAt(0);
      if (a === 10) {
        this.#e += e.length;
        continue;
      }
      if (a !== 91) continue;
      const [r, f] = T(e);
      if (!(r in this.hTag)) throw `未定義のタグ[${r}]です`;
      switch (this.#r.parse(f), r) {
        case "if":
          ++i;
          break;
        case "elsif":
          if (i > 0 || n > -1) break;
          const u = this.#r.hPrm.exp?.val;
          if (!u) throw "expは必須です";
          if (u.startsWith("&")) throw "属性expは「&」が不要です";
          this.prpPrs.parse(u) && (n = this.#t + 1);
          break;
        case "else":
          if (i > 0) break;
          n === -1 && (n = this.#t + 1);
          break;
        case "endif":
          if (i > 0) {
            --i;
            break;
          }
          return n === -1 ? (++this.#t, this.#s.aLNum[this.#t] += h) : (this.#o.unshift(this.#t + 1), this.#t = n, this.#e = this.#s.aLNum[this.#t]), !1;
      }
    }
    throw "[endif]がないままスクリプト終端です";
  }
  //MARK: サブルーチンコール
  #st(t) {
    d(t, "count", !1) || this.#K();
    const { fn: s } = t;
    return s && this.#k(s), this.#j({ ...t, ":hEvt1Time": this.#$.popLocalEvts() }), d(t, "clear_local_event", !1) && this.hTag.clear_event({}), this.#f(s, t.label);
  }
  #j(t) {
    const s = { ...t, ":hMp": this.val.cloneMp(), ":lenIfStk": this.#o.length };
    this.#s.aLNum[this.#t] = this.#e, this.#R || (s[":resvToken"] = "", this.#x()), this.#n.push(new w(this.#i, this.#t, s)), this.#o.unshift(-1);
  }
  //MARK: シナリオジャンプ
  #it(t) {
    return d(t, "count", !0) || this.#K(), this.#o[0] = -1, this.#f(t.fn, t.label);
  }
  //MARK: コールスタック破棄
  #et(t) {
    if (d(t, "clear", !1)) this.#n = [];
    else if (!this.#n.pop()) throw "[pop_stack] スタックが空です";
    return this.#x(), this.#o = [-1], this.val.setMp({}), !1;
  }
  //MARK: サブルーチンから戻る
  #M(t) {
    const s = this.#n.pop();
    if (!s) throw "[return] スタックが空です";
    const i = s.csArg;
    this.#o = this.#o.slice(-i[":lenIfStk"]);
    const n = i[":hMp"];
    n && this.val.setMp(n);
    const o = i[":resvToken"];
    o ? this.nextToken = () => (this.#x(), o) : this.#x(), i[":hEvt1Time"] && this.#$.pushLocalEvts(i[":hEvt1Time"]);
    const { fn: h, label: c } = t;
    return h || c ? this.#f(h, c) : s.fn in this.#a ? (this.#z(s), !1) : this.#f(s.fn, "", s.idx);
  }
  #R = "";
  #x() {
    this.#R = "", this.nextToken = this.#W;
  }
  #N = "";
  #f(t = "", s = "", i = 0) {
    if (!t && !s && this.main.errScript("[jump系] fnまたはlabelは必須です"), s ? (s.startsWith("*") || this.main.errScript("[jump系] labelは*で始まります"), this.#N = s, this.#N.startsWith("**") || (this.#t = i)) : (this.#N = "", this.#t = i), !t)
      return this.analyzeInit(), !1;
    if (t.includes("@")) throw "[jump系] fn には文字「@」は禁止です";
    const n = this.#k(t);
    if (t === this.#i)
      return this.analyzeInit(), !1;
    this.#i = t;
    const o = this.#a[t];
    if (o)
      return this.#s = o, this.analyzeInit(), !1;
    S();
    const h = [];
    let c = "";
    try {
      c = this.#k(t + "@"), h.push({ fn: t + ":base", src: n }), h.push({ fn: t, src: c });
    } catch {
      h.push({ fn: t, src: n });
    }
    return _.load(h.map(({ fn: l, src: e }) => {
      const a = ":sn:" + l;
      return _.add({ alias: a, src: e }), a;
    })).then(async () => {
      const l = {};
      if (await Promise.allSettled(h.map(async ({ fn: e }) => {
        try {
          const a = ":sn:" + e;
          l[e] = _.get(a), await _.unload(a);
        } catch (a) {
          this.main.errScript(`[jump系]snロード失敗です fn:${e} ${a}`, !1);
        }
      })), c) {
        const e = l[t + ":base"], a = l[t], r = e.split(`
`), f = a.split(`
`), u = r.length, g = f.length;
        for (let m = 0; m < g && m < u; ++m) f[m] ||= r[m];
        l[t] = f.join(`
`), delete l[t + ":base"];
      }
      this.nextToken = this.#W, this.#e = 1, this.#ot(l[t]), this.hTag.record_place({}), this.analyzeInit(), D();
    }), !0;
  }
  analyzeInit() {
    const t = this.#at(this.#s, !!this.val.getVal("mp:const.sn.macro.name"), this.#e, this.#N, this.#t);
    this.#t = t.idx, this.#e = t.ln;
  }
  // シナリオ解析処理ループ・冒頭処理
  nextToken = () => "";
  // 初期化前に終了した場合向け
  #W() {
    if (this.#H()) return "";
    this.#ft(), this.#s.aLNum[this.#t] ||= this.#e;
    const t = this.#s.aToken[this.#t];
    return this.#F(t), ++this.#t, t;
  }
  #F = (t) => {
  };
  #H() {
    return this.#t < this.#s.len ? !1 : (this.main.errScript("スクリプト終端です"), !0);
  }
  #nt = /(\*{2,})([^\|]*)/;
  #ht = /^\[macro\s/;
  #V = /^\[endmacro[\s\]]/;
  #at(t, s, i, n, o) {
    const h = t.aToken.length;
    if (!n) {
      if (this.#H()) return { idx: o, ln: i };
      if (t.aLNum[o])
        i = t.aLNum[o];
      else {
        i = 1;
        for (let a = 0; a < o; ++a) {
          t.aLNum[a] ||= i;
          const r = t.aToken[a];
          r.startsWith(`
`) ? i += r.length : i += (r.match(/\n/g) ?? []).length;
        }
        t.aLNum[o] = i;
      }
      return { idx: o, ln: i };
    }
    t.aLNum[0] = 1;
    const c = n.match(this.#nt);
    if (c) {
      n = c[1];
      let a = o;
      switch (c[2]) {
        case "before":
          for (; t.aToken[--a] !== n; )
            a === 0 && k.myTrace("[jump系 無名ラベルbefore] " + i + "行目以前で" + (s ? "マクロ内に" : "") + "ラベル【" + n + "】がありません", "ET"), s && t.aToken[a].search(this.#ht) > -1 && k.myTrace("[jump系 無名ラベルbefore] マクロ内にラベル【" + n + "】がありません", "ET");
          return { idx: a + 1, ln: t.aLNum[a] };
        //	break;
        case "after":
          for (; t.aToken[++a] !== n; )
            a === h && k.myTrace("[jump系 無名ラベルafter] " + i + "行目以後でマクロ内にラベル【" + n + "】がありません", "ET"), t.aToken[a].search(this.#V) > -1 && k.myTrace("[jump系 無名ラベルafter] " + i + "行目以後でマクロ内にラベル【" + n + "】がありません", "ET");
          return { idx: a + 1, ln: t.aLNum[a] };
        //	break;
        default:
          k.myTrace("[jump系] 無名ラベル指定【label=" + n + "】が間違っています", "ET");
      }
    }
    i = 1;
    const l = new RegExp(
      "^" + n.replaceAll("*", "\\*") + "(?=\\s|;|\\[|\\||$)"
    );
    let e = !1;
    for (let a = 0; a < h; ++a) {
      t.aLNum[a] ||= i;
      const r = t.aToken[a];
      if (e) {
        this.#c.testTagEndLetml(r) ? e = !1 : i += (r.match(/\n/g) ?? []).length;
        continue;
      }
      const f = r.charCodeAt(0);
      if (f === 10) {
        i += r.length;
        continue;
      }
      if (f === 42) {
        if (r.search(l) > -1) return { idx: a + 1, ln: i };
        continue;
      }
      f === 91 && (i += (r.match(/\n/g) ?? []).length, this.#c.testTagLetml(r) && (e = !0));
    }
    throw e ? "[let_ml]の終端・[endlet_ml]がありません" : (k.myTrace(`[jump系] ラベル【${n}】がありません`, "ET"), "Dummy");
  }
  #a = /* @__PURE__ */ Object.create(null);
  //{} シナリオキャッシュ
  #ot(t) {
    let s = "";
    try {
      s = "ScriptIterator.resolveScript";
      const i = this.#c.resolveScript(t);
      s = "ScriptIterator.replaceScript_Wildcard", this.#lt(i), this.#a[this.#i] = this.#s = i;
    } catch (i) {
      i instanceof Error ? s += `例外 mes=${i.message}(${i.name})` : s = String(i), this.main.errScript(s, !1);
    }
    this.val.touchAreaKidoku(this.#i);
  }
  #z(t) {
    this.#i = t.fn, this.#t = t.idx;
    const s = this.#a[this.#i];
    s && (this.#s = s), this.#e = this.#s.aLNum[t.idx];
  }
  #rt = /^\[(call|loadplugin)\s/;
  #ct = /\bfn\s*=\s*[^\s\]]+/;
  #lt(t) {
    for (let s = t.len - 1; s >= 0; --s) {
      const i = t.aToken[s];
      if (!this.#rt.test(i)) continue;
      const [n, o] = T(i);
      this.#r.parse(o);
      const h = this.#r.hPrm.fn;
      if (!h) continue;
      const { val: c } = h;
      if (!c || !c.endsWith("*")) continue;
      t.aToken.splice(s, 1, "	", "; " + i), t.aLNum.splice(s, 1, NaN, NaN);
      const l = n === "loadplugin" ? v.CSS : v.SN, e = this.cfg.matchPath("^" + c.slice(0, -1) + ".*", l);
      for (const a of e) {
        const r = i.replace(
          this.#ct,
          "fn=" + decodeURIComponent(y(a[l]))
        );
        t.aToken.splice(s, 0, r), t.aLNum.splice(s, 0, NaN);
      }
    }
    t.len = t.aToken.length;
  }
  #ft() {
    const t = this.val.touchAreaKidoku(this.#i);
    if (this.#n.length > 0) {
      t.record(this.#t);
      return;
    }
    this.#d = t.search(this.#t), this.val.setVal_Nochk("tmp", "const.sn.isKidoku", this.#d), !this.#d && t.record(this.#t);
  }
  #d = !1;
  get isKidoku() {
    return this.#d;
  }
  #K() {
    this.val.getAreaKidoku(this.#i)?.erase(this.#t), this.#d = !1;
  }
  get isNextKidoku() {
    let t = this.#i, s = this.#t, i = this.#s.len;
    if (this.#n.length > 0) {
      const o = this.#n[0];
      t = o.fn, s = o.idx;
      const h = this.#a[t];
      h && (i = h.len);
    }
    const n = this.val.getAreaKidoku(t);
    return s === i ? !1 : n.search(s);
  }
  get normalWait() {
    return this.#d ? this.val.tagCh_doWait_Kidoku ? this.val.tagCh_msecWait_Kidoku : 0 : this.val.tagCh_doWait ? this.val.tagCh_msecWait : 0;
  }
  //MARK: 括弧マクロの定義
  #ut(t) {
    return this.#c.bracket2macro(t, this.hTag, this.#s, this.#t), !1;
  }
  //MARK: 一文字マクロの定義
  #pt(t) {
    return this.#c.char2macro(t, this.hTag, this.#s, this.#t), !1;
  }
  //MARK: マクロ定義の開始
  #mt = /["'#;\\]　]+/;
  #dt(t) {
    const { name: s } = t;
    if (!s) throw "nameは必須です";
    if (s in this.hTag) throw `[${s}]はタグかすでに定義済みのマクロです`;
    if (this.#mt.test(s)) throw `[${s}]はマクロ名として異常です`;
    const i = this.#e, n = new w(this.#i, this.#t);
    for (this.#G += "|" + s, this.#E = new RegExp(`\\[(${this.#G})\\b`), this.hTag[s] = (o) => (o.design_unit = t.design_unit, this.#j(o), this.val.setMp(o), this.val.setVal_Nochk("mp", "const.sn.macro", JSON.stringify({
      name: t.name
    })), this.val.setVal_Nochk("mp", "const.sn.me_call_scriptFn", this.#i), this.#e = i, this.#z(n), !1); this.#t < this.#s.len; ++this.#t) {
      this.#s.aLNum[this.#t] ||= this.#e;
      const o = this.#s.aToken[this.#t];
      if (o.search(this.#V) > -1)
        return ++this.#t, !1;
      const h = o.charCodeAt(0);
      h === 10 ? this.#e += o.length : h === 91 && (this.#e += (o.match(/\n/g) ?? []).length);
    }
    throw `マクロ[${s}]定義の終端・[endmacro]がありません`;
  }
  #G = "call";
  #E = /\[(call)\b/;
  // https://regex101.com/r/Lk9ASK/1
  //MARK: しおりの読込
  #kt(t) {
    if ("fn" in t != "label" in t) throw "fnとlabelはセットで指定して下さい";
    const s = E(t, "place", 0), i = this.val.getMark(s);
    return this.loadFromMark(
      t,
      i,
      2
      /* ALL_STOP_AND_PLAY */
    );
  }
  loadFromMark(t, s, i = 0) {
    this.hTag.clear_event({}), this.val.mark2save(s), this.val.setMp({}), this.#m.recPagebreak();
    let n = [];
    i !== 1 && (n = this.sndMng.playLoopFromSaveObj(
      i === 2
      /* ALL_STOP_AND_PLAY */
    )), d(t, "do_rec", !0) && (this.#u = {
      hSave: this.val.cloneSave(),
      hPages: { ...s.hPages },
      aIfStk: [...s.aIfStk]
    });
    const o = {
      enabled: this.val.getVal("save:const.sn.autowc.enabled"),
      text: this.val.getVal("save:const.sn.autowc.text"),
      time: Number(this.val.getVal("save:const.sn.autowc.time"))
    };
    this.hTag.autowc(o), this.#o = [...this.#u.aIfStk], this.#n = [], C.stopAllTw();
    const h = Promise.allSettled([...n, ...this.#m.playback(this.#u.hPages)]).then(() => this.#m.cover(!1)).catch((f) => console.error("fn:ScriptIterator.ts loadFromMark e:%o", f)), { index: c, fn: l } = t;
    if (c)
      return h.then(() => this.#f(l, "", c)), !0;
    this.#m.cover(!0), S();
    const e = String(this.val.getVal("save:const.sn.scriptFn")), a = Number(this.val.getVal("save:const.sn.scriptIdx"));
    delete this.#a[e];
    const { label: r } = t;
    return r ? h.then(() => {
      this.#i = e, this.#t = a, this.hTag.call({ fn: l, label: r });
    }) : h.then(() => this.#f(e, "", a)), !0;
  }
  //MARK: スクリプト再読込
  #gt(t) {
    const s = this.val.getMark(0);
    delete this.#a[y(s.hSave["const.sn.scriptFn"])];
    const i = {};
    for (const n in this.#a)
      try {
        this.#k(n + "@");
      } catch {
        i[n] = this.#a[n];
      }
    return this.#a = i, t.do_rec = !1, this.loadFromMark(
      t,
      s,
      1
      /* NO_TOUCH */
    );
  }
  //MARK: セーブポイント指定
  #u = {
    hSave: {},
    hPages: {},
    aIfStk: [-1]
  };
  #_t() {
    if (this.main.isDestroyed()) return !1;
    const { fn: t, idx: s } = this.nowScrIdx();
    return this.val.setVal_Nochk("save", "const.sn.scriptFn", t), this.val.setVal_Nochk("save", "const.sn.scriptIdx", s), this.#u = {
      hSave: this.val.cloneSave(),
      hPages: this.#m.record(),
      aIfStk: this.#o.slice(this.#n.length)
    }, !1;
  }
  nowScrIdx() {
    if (this.#n.length === 0) return {
      fn: this.#i,
      idx: this.#t
    };
    const s = this.#n[0];
    return {
      fn: s.fn,
      idx: s.idx
    };
  }
  nowMark() {
    return { ...this.#u };
  }
  //MARK: スクリプト停止位置（マクロなどなら最上位の呼び元）
  nowScrFnLn() {
    const { fn: t, idx: s } = this.nowScrIdx(), i = this.#a[t], n = this.#l(i, s);
    return { fn: t, ...n };
  }
  //MARK: しおりの保存
  #vt(t) {
    if (!("place" in t)) throw "placeは必須です";
    const s = Number(t.place);
    delete t[":タグ名"], delete t.place, t.text = t.text ?? "", this.#u.json = t, this.val.setMark(s, this.#u);
    const i = Number(this.val.getVal("sys:const.sn.save.place"));
    return s === i && this.val.setVal_Nochk("sys", "const.sn.save.place", i + 1), !1;
  }
  recodeDesign(t) {
    let s = "", i = 0;
    const n = this.#n.length;
    if (t.design_unit && n > 0) {
      const l = this.#n[0];
      s = l.fn, i = l.idx;
    } else
      s = this.#i, i = this.#t;
    t[":path"] = this.#g(s);
    const o = this.#a[s], h = this.#l(o, i);
    t[":ln"] = h.ln, t[":col_s"] = h.col_s, t[":col_e"] = h.col_e;
    const c = i - 1;
    t[":idx_tkn"] = c, t[":token"] = o.aToken[c], this.sys.send2Dbg("_recodeDesign", t);
  }
  replace(t, s) {
    this.#s.aToken[t] = s;
  }
}
export {
  p as ScriptIterator
};
//# sourceMappingURL=ScriptIterator.js.map
