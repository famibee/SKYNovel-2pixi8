/* ***** BEGIN LICENSE BLOCK *****
	Copyright (c) 2022-2024 Famibee (famibee.blog38.fc2.com)

	This software is released under the MIT License.
	http://opensource.org/licenses/mit-license.php
** ***** END LICENSE BLOCK ***** */

const [, , ...aCmd] = process.argv;
const watch = aCmd.includes('--watch') ?{} :null;

import {build, InlineConfig} from 'vite';
import dts, {PluginOptions} from 'vite-plugin-dts';
import {resolve} from 'node:path';
import {builtinModules} from 'node:module';

const oDts: PluginOptions = {
	beforeWriteFile: pathOut=> {
		return {filePath: pathOut.replace('/src/', '/')};
	},
};

// === ブラウザ用 ===
build(<InlineConfig>{
	build: {
		target		: 'esnext',
		lib: {
			entry	: resolve(__dirname, 'web'),
			fileName: _=> 'web.js',
			formats	: ['es'],
		},
		sourcemap	: true,
		emptyOutDir	: false,
//		minify		: 'terser',
		reportCompressedSize	: false,
		watch,
	},
	plugins: [dts(oDts)],
});


// === アプリ用 ===
build(<InlineConfig>{
	build: {
		target		: 'esnext',
		lib: {
			entry	: resolve(__dirname, 'app'),
			fileName: _=> 'app.js',
			formats	: ['es'],
		},
		sourcemap	: true,
		emptyOutDir	: false,
//		minify		: 'terser',
		reportCompressedSize	: false,
		watch,
		rollupOptions: {
			external: [
				...builtinModules.flatMap(p=> [p, `node:${p}`]),
			],
		},
	},
	plugins: [dts(oDts)],
});

build(<InlineConfig>{
	build: {
		target		: 'esnext',
		lib: {
			entry	: resolve(__dirname, 'appMain'),
			fileName: _=> 'appMain.js',
			formats	: ['cjs'],
		},
		sourcemap	: true,
		emptyOutDir	: false,
//		minify		: 'terser',
		reportCompressedSize	: false,
		watch,
		rollupOptions: {
			external: [
				'electron',
				'electron-devtools-installer',
				...builtinModules.flatMap(p=> [p, `node:${p}`]),
			],
		},
	},
	plugins: [dts(oDts)],
});

build(<InlineConfig>{
	build: {
		target		: 'esnext',
		lib: {
			entry	: resolve(__dirname, 'preload'),
			fileName: _=> 'preload.js',
			formats	: ['cjs'],
		},
		sourcemap	: true,
		emptyOutDir	: false,
//		minify		: 'terser',
		reportCompressedSize	: false,
		watch,
		rollupOptions: {
			external: [
				'electron',
				...builtinModules.flatMap(p=> [p, `node:${p}`]),
			],
		},
	},
	plugins: [dts(oDts)],
});
