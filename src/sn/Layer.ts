/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2018-2025 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

import {CmnLib, int, argChk_Boolean, argChk_Num, uint} from './CmnLib';
import type {HArg} from './Grammar';
import type {IMakeDesignCast} from './LayerMng';

import {BLEND_MODES, Container, Sprite, BlurFilter, ColorMatrixFilter, NoiseFilter, Filter, Renderer} from 'pixi.js';

export class Layer {
				layname	= '';
	protected	name_	= '';
	set name(nm) {this.name_ = nm}
	get name() {return this.name_}
	readonly	ctn	= new Container({
		// this will make moving this container GPU powered
		isRenderGroup: true,
			// https://pixijs.com/8.x/examples/basic/render-group
	});
//	readonly	ctn	= new Container;

	// tsy用
	get	alpha() {return this.ctn.alpha}
	set alpha(v) {this.ctn.alpha = v}
	get	height() {return this.ctn.height}
	get	rotation() {return this.ctn.angle}
	set rotation(v) {this.ctn.angle = v}
	get	scale_x() {return this.ctn.scale.x}
	set scale_x(v) {this.ctn.scale.x = v}
	get	scale_y() {return this.ctn.scale.y}
	set scale_y(v) {this.ctn.scale.y = v}
	get	width() {return this.ctn.width}
	get	x() {return this.ctn.x}
	set x(v) {this.procSetX(v); this.ctn.x = v}
		protected	procSetX(_x: number) {}	// set を override できないので
	get	y() {return this.ctn.y}
	set y(v) {this.procSetY(v); this.ctn.y = v}
		protected	procSetY(_y: number) {}	// set を override できないので

	destroy() {}

	lay(hArg: HArg): boolean {
		const c = this.ctn;
		if ('alpha' in hArg) c.alpha = argChk_Num(hArg, 'alpha', 1);

		Layer.setBlendmode(c, hArg);

		if ('pivot_x' in hArg || 'pivot_y' in hArg) c.pivot.set(
			argChk_Num(hArg, 'pivot_x', c.pivot.x),
			argChk_Num(hArg, 'pivot_y', c.pivot.y)
		);

		if ('rotation' in hArg) c.angle = argChk_Num(hArg, 'rotation', 0);
			// flash : rotation is in degrees.
			// pixijs: rotation is in radians, angle is in degrees.

		if ('scale_x' in hArg || 'scale_y' in hArg) c.scale.set(
			argChk_Num(hArg, 'scale_x', c.scale.x),
			argChk_Num(hArg, 'scale_y', c.scale.y)
		);

		if ('visible' in hArg) c.visible = argChk_Boolean(hArg, 'visible', true);

		if ('filter' in hArg) {
			c.filters = [Layer.bldFilters(hArg)];
			this.aFltHArg = [hArg];
		}

		return false;
	}
	aFltHArg: HArg[]	= [];

	/*
	* 現状未サポート
		* FXAAFilter		geeks3d.com のコードに基づいた基本的な FXAA (高速近似アンチエイリアシング) の実装ですが、WebGL でサポートされていないため、texture2DLod 要素が削除されたという変更が加えられています。
		* 	https://pixijs.download/v6.5.10/docs/PIXI.filters.FXAAFilter.html
		* DisplacementFilter	指定されたテクスチャ (ディスプレイスメント マップと呼ばれる) のピクセル値を使用して、オブジェクトのディスプレイスメントを実行します。
		* 	https://pixijs.download/v6.5.10/docs/PIXI.filters.DisplacementFilter.html
		* 		人形城のヒビキとかのやつ？
	*/
	// フィルター生成
	static	bldFilters(hArg: HArg): Filter {
		const {filter=''} = hArg;
		const fnc = Layer.hBldFilter[filter];
		if (! fnc) throw 'filter が異常です';

		const f = fnc(hArg);
		f.enabled = argChk_Boolean(hArg, 'enable_filter', true);
		const {blendmode} = hArg;	// フィルターのブレンドモード
		if (blendmode) f.blendMode = Layer.getBlendmodeNum(blendmode);
		return f;
	}
	// https://github.com/pixijs/filters
	static	readonly	hBldFilter: {[nm: string]: (hArg: HArg)=> Filter} = {
		blur: hArg=> {	// ガウスぼかし
			const f = new BlurFilter({
				kernelSize	:	argChk_Num(hArg, 'kernel_size', 5),	// カーネルサイズ。値は 5、7、9、11、13、15。
				quality		:	argChk_Num(hArg, 'quality', 4),		// 品質
				strength	: 	argChk_Num(hArg, 'strength', 8),	// 強さ
				strengthX	:	argChk_Num(hArg, 'strengthX', 8),
				strengthY	:	argChk_Num(hArg, 'strengthY', 8),
			}
//				'resolution' in hArg ?argChk_Num(hArg, 'resolution', 0) :undefined,							// 解像度
			);
			f.blurX = uint(argChk_Num(hArg, 'blur_x', 2));	// X強度
			f.blurY = uint(argChk_Num(hArg, 'blur_y', 2));	// Y強度
	//略	f.quality = uint(argChk_Num(hArg, 'quality', 1));
				// ブラーのパス数。パス数が多いほど、ブラーの品質が高くなります。
			f.repeatEdgePixels = argChk_Boolean(hArg, 'repeat_edge_pixels', false);	// true に設定すると、ターゲットのエッジがクランプされます。
			return f;
		},

		// https://pixijs.download/v6.5.10/docs/PIXI.filters.NoiseFilter.html
		noise: hArg=> new NoiseFilter({	// ノイズエフェクト
			noise: argChk_Num(hArg, 'noise', 0.5),
				// 適用するノイズの量。この値は (0, 1] の範囲内
			seed: 'seed' in hArg ?argChk_Num(hArg, 'seed', 0) :undefined,
				// ランダム ノイズの生成に適用するシード値。 Math.random() を使用するのが適切な値です。
		}),

		// https://pixijs.download/v6.5.10/docs/PIXI.filters.ColorMatrixFilter.html
		color_matrix: hArg=> {	// カラーマトリックス
				// displayObject 上のすべてのピクセルの RGBA カラーとアルファ値に 5x4 マトリックス変換を適用して、新しい RGBA カラーとアルファ値のセットを含む結果を生成できます。 かなり強力ですよ！
			const f = new ColorMatrixFilter;
			f.alpha = uint(argChk_Num(hArg, 'alpha', 1));
			
			const {matrix=''} = hArg;
			if (matrix) {
				const m = matrix.split(',');
				const len = m.length;
				if (len !== 20) throw `matrix の個数（${len}）が 20 ではありません`;
				for (let i=0; i<len; ++i) f.matrix[i] = uint(m[i]);
			}
			else {
				f.matrix[0] = uint(argChk_Num(hArg, 'rtor', 1));
				f.matrix[1] = uint(argChk_Num(hArg, 'gtor', 0));
				f.matrix[2] = uint(argChk_Num(hArg, 'btor', 0));
				f.matrix[3] = uint(argChk_Num(hArg, 'ator', 0));
				f.matrix[4] = uint(argChk_Num(hArg, 'pr', 0));
				f.matrix[5] = uint(argChk_Num(hArg, 'rtog', 0));
				f.matrix[6] = uint(argChk_Num(hArg, 'gtog', 1));
				f.matrix[7] = uint(argChk_Num(hArg, 'btog', 0));
				f.matrix[8] = uint(argChk_Num(hArg, 'atog', 0));
				f.matrix[9] = uint(argChk_Num(hArg, 'pg', 0));
				f.matrix[10] = uint(argChk_Num(hArg, 'rtob', 0));
				f.matrix[11] = uint(argChk_Num(hArg, 'gtob', 0));
				f.matrix[12] = uint(argChk_Num(hArg, 'btob', 1));
				f.matrix[13] = uint(argChk_Num(hArg, 'atob', 0));
				f.matrix[14] = uint(argChk_Num(hArg, 'pb', 0));
				f.matrix[15] = uint(argChk_Num(hArg, 'rtoa', 0));
				f.matrix[16] = uint(argChk_Num(hArg, 'gtoa', 0));
				f.matrix[17] = uint(argChk_Num(hArg, 'btoa', 0));
				f.matrix[18] = uint(argChk_Num(hArg, 'atoa', 1));
				f.matrix[19] = uint(argChk_Num(hArg, 'pa', 0));
			}
			return f;
		},
		black_and_white: hArg=> {	// 白黒
			const f = new ColorMatrixFilter;
			f.blackAndWhite(
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		brightness: hArg=> {	// 明るさを調整
			const f = new ColorMatrixFilter;
			f.brightness(
				argChk_Num(hArg, 'b', 0.5),
					// 明るさの値 (0 ～ 1、0 は黒)
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		browni: hArg=> {	// おいしいブラウニー
			const f = new ColorMatrixFilter;
			f.browni(
				argChk_Boolean(hArg, 'multiply', true),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		color_tone: hArg=> {	// カラートーン。グラデーション マップのようなもので、正確に何をするのかはわかりませんが、遊んでみると面白いです。
			const f = new ColorMatrixFilter;
			f.colorTone(
				argChk_Num(hArg, 'desaturation', 0.5),
				argChk_Num(hArg, 'toned', 0.5),
				argChk_Num(hArg, 'light_color', 0xFFE580),
				argChk_Num(hArg, 'dark_color', 0xFFE580),
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		contrast: hArg=> {	// コントラスト マトリクスを設定し、暗い部分と明るい部分の分離を増やします。 コントラストを上げる : シャドウをより暗くし、ハイライトをより明るくします。 コントラストを下げる : シャドウを上げ、ハイライトを下げます。
			const f = new ColorMatrixFilter;
			f.contrast(
				argChk_Num(hArg, 'amount', 0.5),
					// コントラストの値 (0-1)
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		grayscale: hArg=> {	// グレースケール
			const f = new ColorMatrixFilter;
			f.grayscale(
				argChk_Num(hArg, 'scale', 0.5),
					// グレーの値 (0 ～ 1、0 は黒)
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		hue: hArg=> {	// 色相
			const f = new ColorMatrixFilter;
			f.hue(
				argChk_Num(hArg, 'f_rotation', 90),	// 0だと変化なしで分かりづらいので
					// 度単位
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		kodachrome: hArg=> {	// コダクローム。1935 年に Eastman Kodak によって導入されたカラー リバーサル フィルム。(Dominic Szablewski に感謝)
			const f = new ColorMatrixFilter;
			f.kodachrome(
				argChk_Boolean(hArg, 'multiply', true),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		lsd: hArg=> {	// LSD効果、現在の行列を乗算します
			const f = new ColorMatrixFilter;
			f.lsd(
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		negative: hArg=> {	// ネガティブ画像 (古典的なRGBマトリックスの逆)
			const f = new ColorMatrixFilter;
			f.negative(
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		night: hArg=> {	// ナイトエフェクト
			const f = new ColorMatrixFilter;
			f.night(
				argChk_Num(hArg, 'intensity', 0.5),
					// 夜の効果の強さ
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		polaroid: hArg=> {	// ポラロイド
			const f = new ColorMatrixFilter;
			f.polaroid(
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		predator: hArg=> {	// 捕食者効果、新しい独立したマトリックスを設定して現在のマトリックスを消去します
			const f = new ColorMatrixFilter;
			f.predator(
				argChk_Num(hArg, 'amount', 0.5),
					// 捕食者は自分の将来の犠牲者をどれほど感じているか
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		saturate: hArg=> {	// 彩度。色の間の分離を増やします。 彩度を増やす: コントラスト、明るさ、シャープネスを増やします。
			const f = new ColorMatrixFilter;
			f.saturate(
				argChk_Num(hArg, 'amount', 0.5),
					// 飽和量(0～1)
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		sepia: hArg=> {		// セピア
			const f = new ColorMatrixFilter;
			f.sepia(
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		technicolor: hArg=> {	// テクニカラー。1916 年に発明されたカラー動画プロセス (Dominic Szablewski に感謝)
			const f = new ColorMatrixFilter;
			f.technicolor(
				argChk_Boolean(hArg, 'multiply', true),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		tint: hArg=> {	// 色合い。カラー マトリクスの対角線上に各チャネルを設定します。 これを使用すると、スプライト、テキスト、グラフィックス、メッシュなどの一部の表示オブジェクトの色合いフィールドと同様の色合い効果をコンテナ上で実現できます。
			const f = new ColorMatrixFilter;
			f.tint(
				argChk_Num(hArg, 'f_color', 0x888888),
					// 色合いの色。 これは 16 進数値です。
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		to_bgr: hArg=> {	// 赤→青、青→赤
			const f = new ColorMatrixFilter;
			f.toBGR(
				argChk_Boolean(hArg, 'multiply', false),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
		vintage: hArg=> {	// ビンテージ
			const f = new ColorMatrixFilter;
			f.vintage(
				argChk_Boolean(hArg, 'multiply', true),
					// true の場合、現在の行列と行列を乗算
			);
			return f;
		},
	};

	static	setBlendmode(cnt: Container, hArg: HArg) {
		const {blendmode} = hArg;
		if (! blendmode) return;	// 省略時になにもしない

		const bmn = Layer.getBlendmodeNum(blendmode);
		if (cnt instanceof Sprite) cnt.blendMode = bmn;
		for (const c of cnt.children) {
			if (c instanceof Sprite) c.blendMode = bmn;
		}
	}

	static getBlendmodeNum(bm_name: string): BLEND_MODES {
		if (! bm_name) return 'normal';	// 省略時にデフォルトを返す

		const bmn = Layer.#hBlendmode[bm_name];
		if (bmn !== undefined) return bmn;
		throw `${bm_name} はサポートされない blendmode です`;
	}
	static	readonly	#hBlendmode: {[bm_name: string]: BLEND_MODES} = {
		'inherit'		: 'inherit',
		'normal'		: 'normal',
		'add'			: 'add',
		'multiply'		: 'multiply',
		'screen'		: 'screen',
		'darken'		: 'darken',
		'lighten'		: 'lighten',
		'erase'			: 'erase',
		'color-dodge'	: 'color-dodge',
		'color-burn'	: 'color-burn',
		'linear-burn'	: 'linear-burn',
		'linear-dodge'	: 'linear-dodge',
		'linear-light'	: 'linear-light',
		'hard-light'	: 'hard-light',
		'soft-light'	: 'soft-light',
		'pin-light'		: 'pin-light',
		'difference'	: 'difference',
		'exclusion'		: 'exclusion',
		'overlay'		: 'overlay',
		'saturation'	: 'saturation',
		'color'			: 'color',
		'luminosity'	: 'luminosity',
		'normal-npm'	: 'normal-npm',
		'add-npm'		: 'add-npm',
		'screen-npm'	: 'screen-npm',
		'none'			: 'none',
		'subtract'		: 'subtract',
		'divide'		: 'divide',
		'vivid-light'	: 'vivid-light',
		'hard-mix'		: 'hard-mix',
		'negation'		: 'negation',
		'min'			: 'min',
		'max'			: 'max',
	};

	// アニメ・動画があるか
	get containMovement(): boolean {return false}

	renderStart() {}
	renderEnd() {}

	clearLay(hArg: HArg): void {
		this.ctn.alpha = 1;
		this.ctn.blendMode = 'normal';
		// visibleは触らない
		this.ctn.pivot.set(0, 0);
		this.ctn.angle = 0;
		this.ctn.scale.set(1, 1);
		if (argChk_Boolean(hArg, 'clear_filter', false)) {
			this.ctn.filters = [];
			this.aFltHArg = [];
		}
		//transform.colorTransform = nulColTrfm;
	}
	copy(fromLayer: Layer, aPrm: Promise<void>[]): void {
		const org_name = this.name_;
		this.playback(fromLayer.record(), aPrm);
		this.name = org_name;
	}
	record() {return {
		name	: this.name_,
		idx		: this.ctn.parent.getChildIndex(this.ctn),
		alpha	: this.ctn.alpha,
		blendMode	: this.ctn.blendMode,
		rotation	: this.ctn.angle,
		scale_x	: this.ctn.scale.x,
		scale_y	: this.ctn.scale.y,
		pivot_x	: this.ctn.pivot.x,
		pivot_y	: this.ctn.pivot.y,
		x		: this.ctn.x,
		y		: this.ctn.y,
		visible	: this.ctn.visible,
		aFltHArg: this.aFltHArg,
	}}
	playback(hLay: any, _aPrm: Promise<void>[]): void {
		this.name = hLay.name;
		//idx	// コール順に意味があるので LayerMng でやる

		this.clearLay({clear_filter: true});
		this.ctn.alpha = hLay.alpha;
		this.ctn.blendMode = hLay.blendMode;
		this.ctn.angle = hLay.rotation;
		this.ctn.scale.set(hLay.scale_x, hLay.scale_y);
		this.ctn.pivot.set(hLay.pivot_x, hLay.pivot_y);
		this.ctn.position.set(hLay.x, hLay.y);
		this.ctn.visible = hLay.visible;

		this.aFltHArg = hLay.aFltHArg ?? [];
		this.ctn.filters = this.aFltHArg.map(f=> Layer.bldFilters(f));
	}

	snapshot(rnd: Renderer, re: ()=> void) {
		rnd.render({container: this.ctn, clear: false});
		re();
	}
	snapshot_end() {}

	makeDesignCast(_gdc: IMakeDesignCast) {}
	makeDesignCastChildren(_gdc: IMakeDesignCast) {}

	showDesignCast() {}
	showDesignCastChildren() {}

	cvsResize() {}
	cvsResizeChildren() {}

	dump(): string {
		return ` "idx":${this.ctn.parent.getChildIndex(this.ctn)
		}, "visible":"${this.ctn.visible
		}", "left":${this.ctn.x}, "top":${this.ctn.y
		}, "alpha":${this.ctn.alpha}, "rotation":${this.ctn.angle
		}, "blendMode":"${this.ctn.blendMode}", "name":"${this.name_
		}", "scale_x":${this.ctn.scale.x}, "scale_y":${this.ctn.scale.y
		}, "filters": [${this.aFltHArg.map(f=> `"${f.filter}"`).join(',')}]`;
	}

	static	setXY(base: Container, hArg: HArg, ret: Container, isGrp = false, isButton = false): void {
		if (hArg.pos) {Layer.setXYByPos(base, hArg.pos, ret); return}

		const rct_base = base.getBounds();
		const r_absclX	= (ret.scale.x < 0)? -ret.scale.x : ret.scale.x;
		const b_width	= (r_absclX === 1)
						? rct_base.width : rct_base.width *r_absclX;
		const r_absclY	= (ret.scale.y < 0)? -ret.scale.y : ret.scale.y;
		const b_height	= (r_absclY === 1)
						? rct_base.height: rct_base.height*r_absclY;

		// 横位置計算
		let x = ret.x;	// AIRNovelでは 0
		if ('left' in hArg) {
			x = argChk_Num(hArg, 'left', 0);
			if ((x > -1) && (x < 1)) x *= CmnLib.stageW;
		}
		else if ('center' in hArg) {
			x = argChk_Num(hArg, 'center', 0);
			if ((x > -1) && (x < 1)) x *= CmnLib.stageW;
			x = x - (isButton ?b_width/3 :b_width)/2;
		}
		else if ('right' in hArg) {
			x = argChk_Num(hArg, 'right', 0);
			if ((x > -1) && (x < 1)) x *= CmnLib.stageW;
			x = x - (isButton ?b_width/3 :b_width);
		}
		else if ('s_right' in hArg) {
			x = argChk_Num(hArg, 's_right', 0);
			if ((x > -1) && (x < 1)) x *= CmnLib.stageW;
			x = CmnLib.stageW - x
				- (isButton ?b_width/3 :b_width);
		}
		ret.x = int( ((ret.scale.x < 0)
			? x +(isButton ?b_width/3 :b_width)
			: x) );

		// 縦位置計算
		let y = ret.y;	// AIRNovelでは 0
		if ('top' in hArg) {
			y = argChk_Num(hArg, 'top', 0);
			if ((y > -1) && (y < 1)) y *= CmnLib.stageH;
		}
		else if ('middle' in hArg) {
			y = argChk_Num(hArg, 'middle', 0);
			if ((y > -1) && (y < 1)) y *= CmnLib.stageH;
			y = y - b_height/2;
		}
		else if ('bottom' in hArg) {
			y = argChk_Num(hArg, 'bottom', 0);
			if ((y > -1) && (y < 1)) y *= CmnLib.stageH;
			y = y - b_height;
		}
		else if ('s_bottom' in hArg) {
			y = argChk_Num(hArg, 's_bottom', 0);
			if ((y > -1) && (y < 1)) y *= CmnLib.stageH;
			y = CmnLib.stageH - y - b_height;
		}
		ret.y = int( ((ret.scale.y < 0) ?y +b_height :y) );

		if (isGrp) {	// これを上の方に持っていってはいけない。
						// iPhone6など中途半端な画面サイズの際に
						// 縦位置が異常になる（素材が画面外下に）
			if (!('left' in hArg)
			&& !('center' in hArg)
			&& !('right' in hArg)
			&& !('s_right' in hArg)
			&& !('top' in hArg)
			&& !('middle' in hArg)
			&& !('bottom' in hArg)
			&& !('s_bottom' in hArg)) {
				Layer.setXYByPos(base, 'c', ret);
			}
		}
	}

	static	setXYByPos(base: Container, pos: string, ret: Container): void {
		if (pos === 'stay') return;
		if (base === undefined) throw 'setXYByPos base === undefined';
		if (ret === undefined) throw 'setXYByPos result === undefined';

		const rct_base = base.getBounds();
		const r_absclX = (ret.scale.x < 0)? -ret.scale.x : ret.scale.x;
		const b_width = (r_absclX === 1)? rct_base.width : rct_base.width *r_absclX;
		const r_absclY = (ret.scale.y < 0)? -ret.scale.y : ret.scale.y;
		const b_height = (r_absclY === 1)? rct_base.height: rct_base.height*r_absclY;

		let c = 0;	// 忘れたけど、プルプルするからintなんだっけ
		if (! pos || pos === 'c') {c = CmnLib.stageW *0.5}
		else if (pos === 'r') {c = CmnLib.stageW - b_width *0.5}
		else if (pos === 'l') {c = b_width *0.5}
		else {c = int(pos)}

		ret.x = int(c -b_width *0.5);
		ret.y = CmnLib.stageH -b_height;

		if (ret.scale.x < 0) ret.x += b_width;
		if (ret.scale.y < 0) ret.y += b_height;
	}

	static	setXYCenter(dsp: Container): void {
		const rct = dsp.getBounds();
		dsp.x = (CmnLib.stageW - rct.width) *0.5;
		dsp.y = (CmnLib.stageH - rct.height) *0.5;
	}

}
