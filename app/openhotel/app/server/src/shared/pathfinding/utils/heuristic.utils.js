"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeuristicUtils = void 0;
class HeuristicUtils {
    static Octile(dx, dy) {
        const F = Math.SQRT2 - 1;
        return (dx < dy) ? F * dx + dy : F * dy + dx;
    }
    // Who watches this function?
    static DrManhattan(dx, dy) {
        return dx + dy;
    }
}
exports.HeuristicUtils = HeuristicUtils;
