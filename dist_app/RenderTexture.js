import { T as c, c as u } from "./app2.js";
class r extends c {
  static create(e) {
    return new r({
      source: new u(e)
    });
  }
  /**
   * Resizes the render texture.
   * @param width - The new width of the render texture.
   * @param height - The new height of the render texture.
   * @param resolution - The new resolution of the render texture.
   * @returns This texture.
   */
  resize(e, s, t) {
    return this.source.resize(e, s, t), this;
  }
}
export {
  r as R
};
//# sourceMappingURL=RenderTexture.js.map
