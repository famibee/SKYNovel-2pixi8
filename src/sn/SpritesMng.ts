/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2023-2024 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import {Config} from './Config';
import {IEvtMng, argChk_Boolean, argChk_Num, int} from './CmnLib';
import {IMain, IVariable} from './CmnInterface';
import {SEARCH_PATH_ARG_EXT} from './ConfigBase';
import {SysBase} from './SysBase';
import {SoundMng} from './SoundMng';
import {HArg} from './Grammar';
import {Layer} from './Layer';

import {AnimatedSprite, BLEND_MODES, Container, Sprite, Texture, Assets} from 'pixi.js';

type IFncCompSpr = (sp: Sprite)=> void;

interface Iface {
	fn			: string;
	dx			: number;
	dy			: number;
	blendmode	: BLEND_MODES;
};
interface Ihface { [name: string]: Iface; };

interface IResAniSpr {
	meta	: {
		animationSpeed? :number;
	};
	_frameKeys	: string[];
}


export class SpritesMng {
	static	#cfg	: Config;
	// static	#val	: IVariable;
	// static	#sys	: SysBase;
	static	#main	: IMain;
	static	init(cfg: Config, _val: IVariable, _sys: SysBase, main: IMain, sndMng: SoundMng) {
//	static	init(cfg: Config, val: IVariable, sys: SysBase, main: IMain, sndMng: SoundMng) {
		SpritesMng.#cfg = cfg;
		// SpritesMng.#val = val;
		// SpritesMng.#sys = sys;
		SpritesMng.#main = main;

		const fnc = ()=> {
			const vol = SpritesMng.#glbVol * SpritesMng.#movVol;
			for (const v of Object.values(SpritesMng.#hFn2VElm)) v.volume = vol;
		};
		sndMng.setNoticeChgVolume(
			vol=> {SpritesMng.#glbVol = vol; fnc()},
			vol=> {SpritesMng.#movVol = vol; fnc()}
		);
	}
	static	#movVol	= 1;
	static	#glbVol	= 1;

	static	#evtMng	: IEvtMng;
	static	setEvtMng(evtMng: IEvtMng) {SpritesMng.#evtMng = evtMng}


	constructor(readonly csvFn = '', readonly spLay?: Container, private fncFirstComp: IFncCompSpr = ()=> {}, private fncAllComp: (isStop: boolean)=> void = ()=> {}) {
		if (! csvFn) return;

		this.#addChild = spLay ? sp=> {spLay.addChild(sp); this.#aSp.push(sp)} : ()=> {};
		this.ret = SpritesMng.#csv2Sprites(
			csvFn,
			sp=> this.fncFirstComp(sp),			// 差し替え考慮
			isStop=> this.fncAllComp(isStop),	// 差し替え考慮
			sp=> this.#addChild(sp)				// 差し替え考慮
		);
	}
	readonly ret: boolean		= false;
	#addChild	: (sp: Sprite)=> void;
	#aSp		: Container[]	= [];

	destroy() {		// これをやるためのクラス、とすら云える
		this.fncFirstComp	= ()=> {};
		this.fncAllComp		= ()=> {};
		this.#addChild		= sp=> sp.destroy();

		this.#aSp.forEach(sp=> {
			SpritesMng.stopVideo(sp.label);
			sp.parent?.removeChild(sp);
			sp.destroy();
		});
		this.#aSp = [];
	}

	static	destroy() {
		SpritesMng.#hFace	= {};
		SpritesMng.#hFn2ResAniSpr	= {};
		//SpritesMng.#ldrHFn	= {};
		SpritesMng.#hFn2VElm	= {};
	}


	//static #ldrHFn: {[fn: string]: 1} = {};
	static #csv2Sprites(csv: string, fncFirstComp: IFncCompSpr, fncAllComp: (isStop: boolean)=> void, addChild: (sp: Sprite)=> void): boolean {
		if (! csv) return false;

		let needLoad = false;
		if (csv.startsWith('data:')) {	// Data URI
			needLoad = ! Assets.cache.has(csv);
			Assets.load({
				alias	: csv,
				src		: SpritesMng.#cfg.searchPath(csv, SEARCH_PATH_ARG_EXT.SP_GSM),
			}).then(tx=> {
				const sp = Sprite.from(tx);
				addChild(sp);
				fncFirstComp(sp);
				fncAllComp(needLoad);
			});
			return needLoad;
		}

		const a = csv.split(',');
		a.forEach(alias=> {
			if (Assets.cache.has(alias)) return;
			if (alias in SpritesMng.#hFn2ResAniSpr) return;

			try {
				Assets.add({alias, src: SpritesMng.#cfg.searchPath(alias, SEARCH_PATH_ARG_EXT.SP_GSM)});
				needLoad = true;
			} catch (e) {
				this.#main.errScript(`画像/動画ロード失敗です SpritesMng.csv2Sprites fn:${alias} ${e}`, false)
			}
		});
		Assets.load(a).then(rUa=> {
			a.forEach((alias, i)=> {
				const ua = rUa[alias];
				const {_frameKeys} = ua;
//console.log(`fn:SpritesMng.ts line:138 alias:${alias} _frameKeys:%o B:${! (alias in SpritesMng.#hFn2ResAniSpr)} g:%o`, _frameKeys, ua);
				if (_frameKeys && ! (alias in SpritesMng.#hFn2ResAniSpr)) {
					const {data: {meta}} = ua;
					SpritesMng.#sortAFrameName(_frameKeys);
					SpritesMng.#hFn2ResAniSpr[alias] = {meta, _frameKeys};
				}

				// 差分絵を重ねる
				const {dx, dy, blendmode, fn} = SpritesMng.#hFace[alias] ?? {
					fn	: alias,
					dx	: 0,
					dy	: 0,
					blendmode	: 'normal',
				};
				const sp = SpritesMng.#mkSprite(fn);
				sp.label = fn;	// 4 Debug?
				addChild(sp);
				if (i === 0) fncFirstComp(sp); else {
					sp.x = dx;
					sp.y = dy;
					sp.blendMode = blendmode;
				};
			});
			fncAllComp(needLoad);
		});

		return needLoad;
	}
	static	#hFace			: Ihface	= {};
	static	#hFn2ResAniSpr	: {[fn: string]: IResAniSpr} = {};

		static #sortAFrameName(aFn: string[]) {
			const a_base_name = /([^\d]+)\d+\.(\w+)/.exec(aFn[0]);
			if (! a_base_name) return;

			const is = a_base_name[1].length;
			const ie = -a_base_name[2].length -1;
			aFn.sort((a, b)=> int(a.slice(is, ie)) > int(b.slice(is, ie)) ?1 :-1);
		}



/*
	//TODO: 暗号化・動画
	static #cachePicMov = (_r: SYS_DEC_RET, {type, name, data}: any, next: ()=> void)=> {
		switch (type) {
			case LoaderResource.TYPE.VIDEO:
				const hve = data as HTMLVideoElement;
				hve.volume = SpritesMng.#glbVol;
				SpritesMng.#hFn2VElm[name] = SpritesMng.#charmVideoElm(hve);
		}
		next();
	}

	static async #dec2cachePicMov(r: SYS_DEC_RET, res: any, next: ()=> void) {
		res.data = r;
		if (res.extension !== 'bin') next();

		if (r instanceof HTMLImageElement) {
			res.texture = await Texture.fromLoader(r, res.url, res.name);
			//Texture.addToCache(Texture.from(r), res.name);
			// res.texture = Texture.from(r);
				// でも良いが、キャッシュ追加と、それでcsv2Sprites()内で使用するので
			res.type = LoaderResource.TYPE.IMAGE;
//			URL.revokeObjectURL(r.src);
		}
		else if (r instanceof HTMLVideoElement) {
			r.volume = SpritesMng.#glbVol;
			SpritesMng.#hFn2VElm[res.name] = SpritesMng.#charmVideoElm(r);

			res.type = LoaderResource.TYPE.VIDEO;
//			URL.revokeObjectURL(r.src);
		}
		next();
	}
	static #charmVideoElm(v: HTMLVideoElement): HTMLVideoElement {
		// 【PixiJS】iOSとChromeでAutoPlay可能なビデオSpriteの設定 - Qiita https://qiita.com/masato_makino/items/8316e7743acac514e361
		// v.muted = true;// Chrome対応：自動再生を許可。ないと再開時に DOMException
		if (SpritesMng.#val.getVal('const.sn.needClick2Play')) {
			// ブラウザ実行で、クリックされるまで音声再生が差し止められている状態か。なにかクリックされれば falseになる
			DebugMng.trace_beforeNew(`[lay系] ${DebugMng.strPos()}未クリック状態で動画を自動再生します。音声はミュートされます`, 'W');
			v.muted = true;
		}
		v.setAttribute('playsinline', '');	// iOS対応
		return v;
	}

	static #cacheAniSpr = (_r: string, {spritesheet, name, data}: any, next: ()=> void)=> {
		const aFn: string[] = spritesheet._frameKeys;
		SpritesMng.#sortAFrameName(aFn);
		SpritesMng.#hFn2ResAniSpr[name] = {
			aTex: aFn.map(fn=> Texture.from(fn)),
			meta: data.meta,
		};
		next();
	}

	static #dec2cacheAniSpr(r: string, res: any, next: ()=> void) {
		const {meta, frames} = res.data = JSON.parse(r);
		res.type = LoaderResource.TYPE.JSON;
		if (! meta?.image) {next(); return}

		const fn = getFn(meta.image);
		const url = SpritesMng.#cfg.searchPath(fn, SEARCH_PATH_ARG_EXT.SP_GSM);
		(new Loader)
		.use((res2, next2)=> {
			this.#sys.decAB(res2.data)
			.then(r2=> {
				res2.data = r2;
				if (r2 instanceof HTMLImageElement) {
					res2.type = LoaderResource.TYPE.IMAGE;
					URL.revokeObjectURL(r2.src);
				}
				next2();
			})
			.catch(e=> this.#main.errScript(`画像/動画ロード失敗です SpritesMng.dec2res4Cripto fn:${res2.name} ${e}`, false));
		})
		.add({name: fn, url, xhrType: LoaderResource.XHR_RESPONSE_TYPE.BUFFER})
		.load((ldr, _hRes)=> {
			for (const {data} of Object.values(ldr.resources)) {
				const {baseTexture} = Texture.from(data);
				const aFr = Object.values(<{[nm: string]: {
					frame: {x: number; y: number; w: number; h: number;}
				}}>frames);
				SpritesMng.#hFn2ResAniSpr[res.name] = {
					aTex: aFr.map(({frame: {x, y, w, h}})=> new Texture(
						baseTexture,
						new Rectangle(x, y, w, h),
					)),
					meta,
				};
			}
			next();
		});
	}
*/


	static #mkSprite(fn: string): Sprite {
		const ras = SpritesMng.#hFn2ResAniSpr[fn];
		if (ras) {
			const asp = AnimatedSprite.fromFrames(ras._frameKeys);
			asp.animationSpeed = ras.meta.animationSpeed ?? 1.0;
			asp.play();
			return asp;
		}
		if (fn in SpritesMng.#hFn2VElm) return Sprite.from(SpritesMng.#hFn2VElm[fn]);

		const tx: Texture | undefined = Assets.cache.get(fn);
		return tx ?Sprite.from(tx) :new Sprite;
	}
	static #hFn2VElm	: {[fn: string]: HTMLVideoElement} = {};
	static	getHFn2VElm(fn: string) {return SpritesMng.#hFn2VElm[fn]}

	static	wv(hArg: HArg): boolean {
		// 動画ファイル名指定でいいかなと。なぜなら「ループで再生しつつ」
		// 同ファイル名の別の動画の再生は待ちたい、なんて状況は普通は無いだろうと
		const {fn} = hArg;
		if (! fn) throw 'fnは必須です';
		const hve = SpritesMng.#hFn2VElm[fn];
		if (! hve || hve.loop) return false;

		if (SpritesMng.#evtMng.isSkipping || hve.ended) {SpritesMng.stopVideo(fn); return false}

		const fncBreak = ()=> SpritesMng.#evtMng.breakEvent('wv fn:'+ fn);	// waitEvent 使用者の通常 break 時義務
		hve.addEventListener('ended', fncBreak, {once: true, passive: true});

		const stop = argChk_Boolean(hArg, 'stop', true);
		return SpritesMng.#evtMng.waitEvent('wv fn:'+ fn, hArg, ()=> {
			hve.removeEventListener('ended', fncBreak);
			if (stop) SpritesMng.stopVideo(fn);
			fncBreak()
		});
	}

	static	stopVideo(fn: string) {
		const hve = SpritesMng.#hFn2VElm[fn];
		if (! hve) return;

		delete SpritesMng.#hFn2VElm[fn];
		hve.pause();
		hve.currentTime = hve.duration;
	}


	static	add_face(hArg: HArg): boolean {
		const {name} = hArg;
		if (! name) throw 'nameは必須です';
		if (name in SpritesMng.#hFace) throw '一つのname（'+ name +'）に対して同じ画像を複数割り当てられません';

		const {fn = name} = hArg;
		SpritesMng.#hFace[name] = {
			fn,
			dx: argChk_Num(hArg, 'dx', 0),
			dy: argChk_Num(hArg, 'dy', 0),
			blendmode: Layer.getBlendmodeNum(hArg.blendmode || '')
		};

		return false;
	}
//	static	clearFace2Name(): void {SpritesMng.hFace = {}}

}
