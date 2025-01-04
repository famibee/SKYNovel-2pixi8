import { Layer } from './Layer';
import { IEvtMng } from './CmnLib';
import { IHTag, HArg } from './Grammar';
import { IVariable, IRecorder } from './CmnInterface';
import { Config } from './Config';
import { IMakeDesignCast } from './LayerMng';
import { SysBase } from './SysBase';
import { ScriptIterator } from './ScriptIterator';
import { Renderer, Application } from 'pixi.js';
export declare class TxtLayer extends Layer {
    #private;
    static init(cfg: Config, hTag: IHTag, val: IVariable, recorder: IRecorder, isPageFore: (me: TxtLayer) => boolean, appPixi: Application): void;
    static setEvtMng(evtMng: IEvtMng, sys: SysBase, scrItr: ScriptIterator): void;
    constructor();
    destroy(): void;
    static destroy(): void;
    set name(nm: string);
    get name(): string;
    cvsResize(): void;
    cvsResizeChildren(): void;
    protected procSetX(x: number): void;
    protected procSetY(y: number): void;
    lay(hArg: HArg): boolean;
    get width(): number;
    get height(): number;
    chgBackAlpha(g_alpha: number): void;
    static chgDoRec(doRec: boolean): void;
    isCur: boolean;
    tagCh(text: string): void;
    readonly click: () => boolean;
    clearText(): void;
    get pageText(): string;
    get pagePlainText(): string;
    get enabled(): boolean | undefined;
    set enabled(e: boolean | undefined);
    readonly addButton: (hArg: HArg) => Promise<void>;
    canFocus(): boolean;
    clearLay(hArg: HArg): void;
    readonly record: () => any;
    playback(hLay: any, aPrm: Promise<void>[]): void;
    get cssText(): string;
    set cssText(ct: string);
    snapshot(rnd: Renderer, re: () => void): void;
    snapshot_end(): void;
    makeDesignCast(gdc: IMakeDesignCast): void;
    makeDesignCastChildren(gdc: IMakeDesignCast): void;
    showDesignCast(): void;
    showDesignCastChildren(): void;
    dump(): string;
}
//# sourceMappingURL=TxtLayer.d.ts.map