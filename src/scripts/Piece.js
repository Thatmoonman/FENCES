
export default class Piece {
    constructor(color) {
        this.color = color
    }

    toString() {
        return this.color[0].toUpperCase()
    }
}