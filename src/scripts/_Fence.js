import Piece from "./Piece";

export default class Fence extends Piece() {
    constructor(dir) {
        super(color, color)
        this.dir = dir
    }
}