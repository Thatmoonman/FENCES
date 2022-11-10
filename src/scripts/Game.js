import Board from "./Board"
import ComputerPlayer from "./_computerPlayer"
import HumanPlayer from "./_humanPlayer"

export default class Game {
    constructor(playerColor="Red", computerColor="Blue") {
        this.board = new Board()
        const humanPlayer = new HumanPlayer(playerColor)
        const computerPlayer = new ComputerPlayer(computerColor)
        this.newGame(humanPlayer, computerPlayer)
    }

    newGame(humanPlayer, computerPlayer) {
        this.board.fillGrid(humanPlayer, computerPlayer)
    }
}

// let g = new Game()
// g.board.render()
// console.log(g.board.board[0][8].token())
