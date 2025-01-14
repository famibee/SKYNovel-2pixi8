import { HArg } from './Grammar';
import { IMakeDesignCast } from './LayerMng';
import { BLEND_MODES, Container, Filter, Renderer } from 'pixi.js';
export declare class Layer {
    #private;
    layname: string;
    protected name_: string;
    set name(nm: string);
    get name(): string;
    readonly ctn: Container<import('pixi.js').ContainerChild>;
    get alpha(): number;
    set alpha(v: number);
    get height(): number;
    get rotation(): number;
    set rotation(v: number);
    get scale_x(): number;
    set scale_x(v: number);
    get scale_y(): number;
    set scale_y(v: number);
    get width(): number;
    get x(): number;
    set x(v: number);
    protected procSetX(_x: number): void;
    get y(): number;
    set y(v: number);
    protected procSetY(_y: number): void;
    destroy(): void;
    lay(hArg: HArg): boolean;
    aFltHArg: HArg[];
    static bldFilters(hArg: HArg): Filter;
    static readonly hBldFilter: {
        [nm: string]: (hArg: HArg) => Filter;
    };
    static setBlendmode(cnt: Container, hArg: HArg): void;
    static getBlendmodeNum(bm_name: string): BLEND_MODES;
    get containMovement(): boolean;
    renderStart(): void;
    renderEnd(): void;
    clearLay(hArg: HArg): void;
    copy(fromLayer: Layer, aPrm: Promise<void>[]): void;
    record(): {
        name: string;
        idx: number;
        alpha: number;
        blendMode: BLEND_MODES;
        rotation: number;
        scale_x: number;
        scale_y: number;
        pivot_x: number;
        pivot_y: number;
        x: number;
        y: number;
        visible: boolean;
        aFltHArg: HArg[];
    };
    playback(hLay: any, _aPrm: Promise<void>[]): void;
    snapshot(rnd: Renderer, re: () => void): void;
    snapshot_end(): void;
    makeDesignCast(_gdc: IMakeDesignCast): void;
    makeDesignCastChildren(_gdc: IMakeDesignCast): void;
    showDesignCast(): void;
    showDesignCastChildren(): void;
    cvsResize(): void;
    cvsResizeChildren(): void;
    dump(): string;
    static setXY(base: Container, hArg: HArg, ret: Container, isGrp?: boolean, isButton?: boolean): void;
    static setXYByPos(base: Container, pos: string, ret: Container): void;
    static setXYCenter(dsp: Container): void;
}
//# sourceMappingURL=Layer.d.ts.map