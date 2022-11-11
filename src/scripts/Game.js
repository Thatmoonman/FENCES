import Board from "./board/Board"
import ComputerPlayer from "./player/_computerPlayer"
import HumanPlayer from "./player/_humanPlayer"

export default class Game {
    constructor(playerColor="Blue", computerColor="Red") {
        this.board = new Board()        
        this.humanPlayer = new HumanPlayer(playerColor)
        this.computerPlayer = new ComputerPlayer(computerColor)
        this.currentPlayer = this.humanPlayer
        
        this.newGame(this.humanPlayer, this.computerPlayer) 
    }

    newGame(humanPlayer, computerPlayer) {
        // adds starting positions to board
        this.board.fillGrid(humanPlayer, computerPlayer) 
        
        //Seed players' starting fences
        for (let i = 0; i < 5; i++) { 
            humanPlayer.addFence()
            computerPlayer.addFence()
        }
    }

    gameTurn() { //NOT GAME READY
        this._resetHTML() //FOR DEV ONLY
        this.board.render()

        this.selectToken()

        // this.switchCurrentPlayer()
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

    //Refactor...not sure why I made this
    // playerTurn() {
    //     return this.currentPlayer.selectToken()
    // }

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
        
        //WIP! add select fence
    }


    //NEED: valid moves logic, countdown movesUntilNextFence for opponent
    moveToken(startPos) {
        const moveSquares =  Array.from(document.getElementsByClassName("square")).map(el => el)
        
        //filter out invalid moves
        moveSquares.filter( squareEle => {
            const movePos = squareEle.getAttribute("data-pos").split(",")
            const moveSquare = this.board.getSquare(movePos)
            
            if (moveSquare.isValidMove(movePos)) return squareEle

        //attach "click" event handlers to valid moves
        }).forEach(square => square.addEventListener("click", event => {
            const clickedPos = square.getAttribute("data-pos").split(",")
            const clickedSquare = this.board.getSquare(clickedPos)

            this.currentPlayer.token.setPos(clickedPos)
            clickedSquare.addToken(this.currentPlayer.token)
            this.board.getSquare(startPos).removeToken()
            
            //WIP! end of tune logic goes here
            if (event.target) {
                return this.gameTurn()
            }
        }))
    }


}

