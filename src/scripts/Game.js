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

        return this.gameLoop()
    }

    playTurn() {
        let tokenSelected = this.selectToken()
        // let fenceSelected = this.selectFence()
        // if (tokenSelected) {
        //     this.placeToken()
        // }
        // console.log("loop?")
        // this.selectFence()
        // return this.gameLoop()
    }
    

    gameLoop() { //NOT GAME READY
        const gameOver = this.isGameOver() //refactor into WIN Screen LATER
        
        if (gameOver) {

        } else if (this.currentPlayer = this.humanPlayer) {
            this._resetHTML() //FOR DEV ONLY
            this.board.render()
            return this.playTurn()
        } else {
            //computer turn
        }

            
            // let turnOver = false

            // while(!turnOver) {
                
                // turnOver = this.playTurn()
                
            // }
        }


        /* if current player, either grab token or fence by clicking, 
        clicking again should cancel grab, if token selected click valid square
        to place token, if fence selected place on node and choose direction,
        once either is done current player gets switched and next turn starts.
        If move, reduce opponents movesUntilNewFence counter and respond accoordingly.
        */

        
    


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

        const tokenSquare = tokenSquares.filter(square => {
            let tokenPos = this._getPosArray.call(square)
            let playerPos = this.currentPlayer.token.getPos()
            return tokenPos[0] === playerPos[0] && tokenPos[1] === playerPos[1]
        })

        tokenSquare.forEach( square => { square.addEventListener("click", event => {
            const pos = event.target.getAttribute("data-pos").split(",")
        
            const token = this.board.getSquare(pos).getToken()
            console.log("selected")
            return this.placeToken()
            // return true
        })})

        //WIP! add select fence
    }


    //NEED: valid moves logic, countdown movesUntilNextFence for opponent
    placeToken() {
        const startPos = this.currentPlayer.token.getPos()
        const moveSquares =  Array.from(document.getElementsByClassName("square")).map(el => el)
        const validMoves = this.board.validMoveToken(startPos)
        const validMoveSquares = []
        
        //Get Valid Move Squares
        for (let i = 0; i < moveSquares.length; i++) {
            let square = moveSquares[i]

            for (let j = 0; j < validMoves.length; j++) {
                let validMove = validMoves[j]
                let squarePos = square.getAttribute("data-pos").split(",").map(pos => parseInt(pos))
    
                if (validMove[0] === squarePos[0] && validMove[1] === squarePos[1]) {
                    validMoveSquares.push(square)
                }
            }
        }
        console.log(validMoveSquares)
        //Add Event Listerers for Valid Squares
        validMoveSquares.forEach(square => square.addEventListener("click", event => {
            const clickedPos = square.getAttribute("data-pos").split(",")
            const clickedSquare = this.board.getSquare(clickedPos)

            this.setToken(clickedSquare)
            
            //WIP! end of tune logic goes here
            if (event.target) {
                return this.gameLoop()
            }
        }))
    }

    setToken(square) {
        this.board.getSquare(this.currentPlayer.token.getPos()).removeToken() //remove token from start square
        this.currentPlayer.token.setPos(square) //update token location
        square.addToken(this.currentPlayer.token) //put new token in new square
        return square
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

    _getPosArray() {
        return this.getAttribute("data-pos").split(",").map(el => parseInt(el))
    }

}

