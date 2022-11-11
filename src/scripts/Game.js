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

        return this.gameTurn()
    }

    gameTurn() { //NOT GAME READY
        const gameOver = this.isGameOver()
        
        if (!gameOver) {
            this._resetHTML() //FOR DEV ONLY
            this.board.render()
            this.selectToken()
        }


        /* if current player, either grab token or fence by clicking, 
        clicking again should cancel grab, if token selected click valid square
        to place token, if fence selected place on node and choose direction,
        once either is done current player gets switched and next turn starts.
        If move, reduce opponents movesUntilNewFence counter and respond accoordingly.
        */

        // if (this.currentPlayer === this.humanPlayer) {
        // }
  
            // return this.gameTurn()
        
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
        const tokenSquares = Array.from(document.getElementsByClassName("playerSquare"))
            .map(el => el)
        
        tokenSquares.forEach( square => { square.addEventListener("click", event => {
            const pos = event.target.getAttribute("data-pos").split(",")
        
            const token = this.board.getSquare(pos).getToken()
            
            if (token && token.myToken(this.currentPlayer)) {
                return this.placeToken(pos)
            } else {
                return this.gameTurn()
            }

        })})
        
        //WIP! add select fence
    }


    //NEED: valid moves logic, countdown movesUntilNextFence for opponent
    placeToken(startPos) {
        const moveSquares =  Array.from(document.getElementsByClassName("square")).map(el => el)
        const validMoves = this.board.validMoveToken(startPos)
        

        //refactor to find valid moves and then attach event listeners only to those(maybe clicking elsewhere garners "invalid move")
        console.log(validMoves)


        //filter out invalid moves
        moveSquares.filter( squareEle => {
            const movePos = squareEle.getAttribute("data-pos").split(",")
            const moveSquare = this.board.getSquare(movePos)
            
            if (validMoves.includes(movePos)) return squareEle

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

    selectFence() {
        
    }

    placeFence() {

    }

    isGameOver() {
        if (parseInt(this.humanPlayer.token.getPos[1]) === 0) {
            return this.gameOver(this.humanPlayer)
        } else if (this.computerPlayer.token.getPos[1] === 16) {
            return this.gameOver(this.computerPlayer)
        } else {
            return false
        }
    }

    gameOver(player) {
        alert(`${player.color} WON!`)
    }


}

