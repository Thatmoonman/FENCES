
export default class Piece {
    constructor(color, pos=null) {
        this.color = color
        this.pos = pos
    }

    toString() {
        return this.color[0].toUpperCase()
    }
}