import Board from "./board/Board"
import ComputerPlayer from "./player/_computerPlayer"
import HumanPlayer from "./player/_humanPlayer"

export default class Game {
    constructor(playerColor="Blue", computerColor="Red") {
        this.humanPlayer = new HumanPlayer(playerColor)
        this.computerPlayer = new ComputerPlayer(computerColor)
        this.currentPlayer = this.humanPlayer
        this.board = new Board(this.humanPlayer, this.computerPlayer)        
        
        this.newGame() 
    }

    reset() {   //*RESETS GAME BOARD* => move this to INDEX.JS
        this.humanPlayer = new HumanPlayer(this.humanPlayer.color)
        this.computerPlayer = new ComputerPlayer(this.computerPlayer.color)
        this.board = new Board(this.humanPlayer, this.computerPlayer)
        this.currentPlayer = this.humanPlayer
        return this.newGame()
    }

    newGame() { //*STARTS A NEW GAME*
        // adds starting positions to board
        this.board.fillGrid(this.humanPlayer, this.computerPlayer) 

        //Seed players' starting fences
        for (let i = 0; i < 5; i++) { 
            this.humanPlayer.addFence()
            this.computerPlayer.addFence()
        }

        return this.gameLoop()
    }

    playTurn() {
        
        this.selectToken()
        this.selectFence()
    
    }
    

    gameLoop() { //NOT GAME READY
        const gameOver = this.isGameOver() //refactor into WIN Screen LATER

        if (gameOver) {
        
        } else if (this.currentPlayer === this.humanPlayer) {
            this._resetHTML() //FOR DEV ONLY
            return this.playTurn()
        } else {
            let computerTurn = this.currentPlayer.playTurn()
            if (computerTurn = "move") {
                return this.computerMove()
            } else {

            }
        }
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
        this.board.render()
    }

    switchCurrentPlayer() {
        return this.currentPlayer = (this.currentPlayer === this.humanPlayer ? this.computerPlayer : this.humanPlayer)
    }


    //REFACTOR ONTO HUMANPLAYER?
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


    //REFACTOR ONTO HUMANPLAYER?
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
    
        //Add Event Listerers for Valid Squares
        validMoveSquares.forEach(square => square.addEventListener("click", event => {
            const clickedPos = square.getAttribute("data-pos").split(",")
            const clickedSquare = this.board.getSquare(clickedPos)

            this.setToken(clickedSquare)
            
            //WIP! end of move turn logic goes here
            if (event.target) {
                this.humanPlayer.movesUntilNewFence--
                console.log(this.humanPlayer.movesUntilNewFence)
                if (this.humanPlayer.movesUntilNewFence === 0) {
                    this.computerPlayer.addFence()
                    this.humanPlayer.movesUntilNewFence = this.computerPlayer.totalFences 
                }
                this.switchCurrentPlayer()
                return this.gameLoop()
            }
        }))

        //ADD event listener for start space: UNDO
    }
    //REFACTOR ONTO PLAYER?
    setToken(square) {
        this.board.getSquare(this.currentPlayer.token.getPos()).removeToken() //remove token from start square
        this.currentPlayer.token.setPos(square) //update token location
        square.addToken(this.currentPlayer.token) //put new token in new square
        this._resetHTML()
        return square
    }

    selectFence() {
        const fenceBoxEle = document.getElementById("humanPlayerFences")
        const unplayedFences = Array.from(fenceBoxEle.childNodes).map(el => el)

        unplayedFences.forEach( fence => {
            fence.addEventListener( "click" , () => {
                return this.placeFenceStart()
            })
        })
        
    }

    placeFenceStart() {
        const nodes = Array.from(document.getElementsByClassName("node")).map(el => el)
        nodes.filter(node => this.board.nodeFree(this._getPosArray.call(node)))
        nodes.forEach( node => node.addEventListener( "click", () => {
            const startPos = this._getPosArray.call(node)
            return this.placeFenceEnd(startPos)
        }))

    }

    placeFenceEnd(startPos) {
        const validFences = this.board.validMoveFence(startPos)
        const allNodes = Array.from(document.getElementsByClassName("node")).map(el => el)
        console.log(validFences)

        validFences.forEach(validFence => {
            for (let i = 0; i < allNodes.length; i++) {
                let nodePos = this._getPosArray.call(allNodes[i])
                if (this._compareArrays(nodePos, validFence["endNode"])) {
                    validFence["nodeLi"] = allNodes[i]
                }
            }
        })
        
        validFences.forEach(fenceObj => {
            fenceObj["nodeLi"].addEventListener( "click", () => {
                fenceObj["fences"].forEach( fence => {
                    let fenceSquare = this.board.getSquare(fence)
                    fenceSquare.addToken(this.humanPlayer.color)
                })
                this.board.getSquare(fenceObj["midNode"]).holds.push("MID")
                this.board.getSquare(fenceObj["endNode"]).holds.push("FENCE")
                this.humanPlayer.fences.pop()
                this.switchCurrentPlayer()
                return this.gameLoop()
            })
        })
        
    }

    isGameOver() {
        if (parseInt(this.humanPlayer.token.getPos()[1]) === 0) {
            console.log("human won")
            return this.gameOver(this.humanPlayer)
        } else if (parseInt(this.computerPlayer.token.getPos()[1]) === 16) {
            console.log("computer won")
            return this.gameOver(this.computerPlayer)
        } else {
            return false
        }
    }

    gameOver(player) {
        alert(`${player.color} WON!`)
        return this.reset()
    }

    //string to int helper function for position
    _getPosArray() {
        return this.getAttribute("data-pos").split(",").map(el => parseInt(el))
    }

    //helper for Position Array Equality
    _compareArrays(pos1, pos2) {
        return parseInt(pos1[0]) === parseInt(pos2[0]) && parseInt(pos1[1]) === parseInt(pos2[1])
    }


    //computer moves its token
    //REFACTOR ONTO COMPUTERPLAYER?
    computerMove(pos=[0,2]) {
        const currentPos = this.currentPlayer.token.getPos()
        const movePos = [currentPos[0] + pos[0], currentPos[1] + pos[1]]
        const moveSquare = this.board.getSquare(movePos)
        this.setToken(moveSquare)

        this.computerPlayer.movesUntilNewFence--
        if (this.computerPlayer.movesUntilNewFence === 0) {
            this.humanPlayer.addFence()
            this.computerPlayer.movesUntilNewFence = this.humanPlayer.totalFences
        }
        this.switchCurrentPlayer()
        return this.gameLoop()
    }
}

