import Piece from "../piece/Piece"

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

    
    isValidMove(token) {
        return true
    }
    
    //for dev rendering
    token() {
        return this.holds[0].toString()
    }
}