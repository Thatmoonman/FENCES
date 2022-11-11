import Board from "./board/Board"
import ComputerPlayer from "./player/_computerPlayer"
import HumanPlayer from "./player/_humanPlayer"

export default class Game {
    constructor(playerColor="Blue", computerColor="Red") {
        this.board = new Board() //set up new Board
        
        this.humanPlayer = new HumanPlayer(playerColor)
        this.computerPlayer = new ComputerPlayer(computerColor)
        
        this.currentPlayer = this.humanPlayer
        
        this.newGame(this.humanPlayer, this.computerPlayer) 
    }

    newGame(humanPlayer, computerPlayer) {
        this.board.fillGrid(humanPlayer, computerPlayer) // adds starting positions to board
        
        for (let i = 0; i < 5; i++) {
            humanPlayer.addFence()
            computerPlayer.addFence()
        }
    }

    gameTurn() {
        this._resetHTML() //FOR DEV ONLY
        this.board.render()

        this.selectToken()

        this.switchCurrentPlayer
    }

    //for DEV ONLY
    _resetHTML() {
        const board = document.getElementById("gameBoard")
        while(board.firstChild) {
            board.removeChild(board.firstChild)
        }
    }

    switchCurrentPlayer() {
        return this.currentPlayer = (this.currentPlayer === this.humanPlayer ? this.computerPlayer : this.humanPlayer)
    }

    playerTurn() {
        return this.currentPlayer.selectToken()
    }

    selectToken() {
        const squares = Array.from(document.getElementsByClassName("square")).map(el => el)
        
        squares.forEach( square => { square.addEventListener("click", event => {
            const pos = event.target.getAttribute("data-pos").split(",")
        
            const token = this.board.getSquare(pos).getToken()
    
            if (token && token.myToken(this.currentPlayer)) {
                return this.moveToken(pos)
            } else {
                return this.gameTurn()
            }

        })})
        
        //add fences
    }

    moveToken(startPos) {
        const moveSquares =  Array.from(document.getElementsByClassName("square")).map(el => el)
        
        if (true) { //logic for valid move
            moveSquares.forEach( square => {square.addEventListener("click", event => {
                const movePos = event.target.getAttribute("data-pos").split(",")
                const moveSquare = this.board.getSquare(movePos)
                
                this.currentPlayer.token.setPos(movePos)
                moveSquare.addToken(this.currentPlayer.token)
                this.board.getSquare(startPos).removeToken()

                if (event.target) {
                    return this.gameTurn()
                }
            })
        })}
         

    }

}

