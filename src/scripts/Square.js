import Piece from "./Piece"

export default class Square {
    constructor(pos, type) {
        this.pos = pos
        this.type = type
        this.holds = []
    }

    token() {
        return this.holds[0].toString()
    }

    
}