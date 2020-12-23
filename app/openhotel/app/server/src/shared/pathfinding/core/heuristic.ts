
export class Heuristic {

    static Octile (dx: number, dy: number) {
        const F = Math.SQRT2 - 1;
        return (dx < dy) ? F * dx + dy : F * dy + dx;
    }

    // Who watches this function?
    static DrManhattan (dx: number, dy: number) {
        return dx + dy;
    }
}
