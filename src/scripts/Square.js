import Piece from "./Piece"

export default class Square {
    constructor(pos, type) {
        this.pos = pos
        this.type = type
        this.holds = []
    }

    getToken() {
        return this.holds[0]    
    }

    addToken(token) {
        return this.holds.push(token)
    }

    removeToken() {
        return this.holds.pop()
    }

    token() {
        return this.holds[0].toString()
    }

    isValidMove(pos) {
        return true
    }

}