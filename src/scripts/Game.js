import * as THREE from "three"
import { Box2, Camera } from "three"
import { MapControls } from "three/examples/jsm/controls/OrbitControls"
import Board from "./board/Board"
import MazeSolver from "./mazesolver/mazesolver"
import ComputerPlayer from "./player/_computerPlayer"
import HumanPlayer from "./player/_humanPlayer"

export default class Game {
    constructor(playerColor="blue", computerColor="red") {
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

    //*STARTS A NEW GAME*
    newGame() { 
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
    

    gameLoop() { 
        const gameOver = this.isGameOver() //refactor into WIN Screen LATER

        if (gameOver) {
        
        } else if (this.currentPlayer === this.humanPlayer) {
            // this._resetHTML() //FOR DEV ONLY
            return this.playTurn()
        } else {
            const currentBoard = new MazeSolver(this.computerPlayer, this.humanPlayer, this._dupeGrid(this.board.grid))
            this.computerPlayer.goal = currentBoard.shortestPath

            const computerTurn = this.computerPlayer.computerTurnLogic()
            if (computerTurn === "move") {
                return this.computerMove()
            } else {
                return this.computerFence()
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
    //*Allow player to "GRAB" their token
    selectToken() {
        //capture Game context
        let that = this;

        //scene Object containing rendered objects
        const scene = this.board.scene;
        const renderer = this.board.renderer
        const camera = this.board.camera

        //var constructor from scene
        let playerToken;
        let tokenSelector;
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === "humanToken") {playerToken = scene.children[i]}
            if (scene.children[i].name === "tokenSelector") {tokenSelector = scene.children[i]}
        }
        
        //Select and unselect cycle for player's token
        playerToken.addEventListener("click", function selectPlayerToken(event) {
            event.stopPropagation();
            playerToken.removeEventListener("click", selectPlayerToken);
            
            //set highlighted functionality
            tokenSelector.visible = true;
            let targetPos = event.target.position
            tokenSelector.position.set(targetPos["x"], 6, targetPos["z"]);
            
            function animateToken() {
                tokenSelector.rotation.y += .02;
                renderer.render(scene, camera);
            }
            if (tokenSelector) renderer.setAnimationLoop(animateToken);
            
            return that.placeToken(playerToken, tokenSelector);
        })


        //*****USED FOR HTML GAME*****/
        // const tokenSquares = Array.from(document.getElementsByClassName("playerSquare"))
        //     .map(el => el)

        //get square that holds players token
        // const tokenSquare = tokenSquares.filter(square => {
        //     let tokenPos = this._getPosArray.call(square)
        //     let playerPos = this.currentPlayer.token.getPos()
        //     return tokenPos[0] === playerPos[0] && tokenPos[1] === playerPos[1]
        // })

        //allow player to click on the square to pick up token
        // tokenSquare[0].firstChild.addEventListener("click", event => {
        //     event.target.setAttribute("class", "token highlighted")
        //     const pos = tokenSquare[0].getAttribute("data-pos").split(",")
        //     event.target.addEventListener("click", () => this.gameLoop())
        //     return this.placeToken(event.target)
        // })
    }


    //REFACTOR ONTO HUMANPLAYER?
    placeToken(playerTokenObj, tokenSelector) {
        const that = this
        const startPos = this.currentPlayer.token.getPos();
        const validMoves = this.board.validMoveToken(startPos);
        const validSquares = []
        
        //Build valid Squares Obj for preserving Square color and easy Mesh access via obj.name
        validMoves.forEach(validMove => {
            that.board.scene.children.forEach(square => {
                if (square.type === "Mesh" && that._compareArrays(square.name.split(","), validMove)) {
                    validSquares.push({ "square": square, "color": square.material.color.getHex() })
                }   
            })
        })
        
        
        //helper function to undo move player action
        function unselectPlayerToken() { 
            tokenSelector.visible = false
            if (revertSquares()) {
                return that.gameLoop();
            } else {
                console.log("ERROR")
            }
        }

        //helper function to remove unselect event listener from player token
        function removeUnselect() {
            playerTokenObj.removeEventListener("click", unselectPlayerToken)                        
            return true
        }

        //return squares to starting color helper function
        function revertSquares() {
            validSquares.forEach( squareObj => {
                let square = squareObj["square"]
                let color = squareObj["color"]
                square.material.color.set(color)
                that.board.interactionManager.remove(square)
            })
            while(validSquares.length) {
                validSquares.pop()
            }
            return true
        }

        //add event listener to player token to undo selection
        playerTokenObj.addEventListener("click", unselectPlayerToken)

        //iterate through valid moves, attaching event handlers to valid squares
        //and highlight them in green
        validMoves.forEach(validMove => {
            that.board.scene.children.forEach(square => {
                if (square.type === "Mesh" && that._compareArrays(square.name.split(","), validMove)) {
                    //set valid move squares to GREEN
                    square.material.color.set("green")

                    //add event listener to square
                    this.board.interactionManager.add(square);
                    square.addEventListener("click", function moveToken(event) {
                        event.stopPropagation();
                        square.removeEventListener("click", moveToken)
                        validSquares.forEach(square => square["square"].removeEventListener("click", moveToken))
                        playerTokenObj.position.set(-20 + (2.5 * validMove[0]), 2, -20 + (2.5 * validMove[1]))
                        const moveSquare = that.board.getSquare(validMove)
                        that.setToken(moveSquare)

                        that.humanPlayer.movesUntilNewFence--
                        if (that.humanPlayer.movesUntilNewFence === 0) {
                            that.computerPlayer.addFence()
                            that.humanPlayer.movesUntilNewFence = that.computerPlayer.totalFences 
                        }

                        tokenSelector.visible = false
                        
                        revertSquares()
                        removeUnselect()
                        that.switchCurrentPlayer()
                        return that.gameLoop()
                    });
                }
            })
        })        

        
        //***HTML VERSION*****//
        //Get Valid Move Squares
        // const validMoveSquares = []
        // const moveSquares =  Array.from(document.getElementsByClassName("square")).map(el => el)
        // for (let i = 0; i < moveSquares.length; i++) {
        //     let square = moveSquares[i]

        //     for (let j = 0; j < validMoves.length; j++) {
        //         let validMove = validMoves[j]
        //         let squarePos = square.getAttribute("data-pos").split(",").map(pos => parseInt(pos))
    
        //         if (validMove[0] === squarePos[0] && validMove[1] === squarePos[1]) {
        //             validMoveSquares.push(square)
        //         }
        //     }
        // }

        // //glow effect for possible moves
        // validMoveSquares.forEach(square => {
        //     let selector = document.createElement("div")
        //     selector.setAttribute("class", "selector highlighted")
        //     square.appendChild(selector)
        // })
    
        
        // //Add Event Listerers for Valid Squares
        // validMoveSquares.forEach(square => square.addEventListener("click", event => {
        //     const clickedPos = square.getAttribute("data-pos").split(",")
        //     const clickedSquare = this.board.getSquare(clickedPos)
        //     this.setToken(clickedSquare)
            
        //     if (event.target) {
        //         this.humanPlayer.movesUntilNewFence--
                
        //         if (this.humanPlayer.movesUntilNewFence === 0) {
        //             this.computerPlayer.addFence()
        //             this.humanPlayer.movesUntilNewFence = this.computerPlayer.totalFences 
        //         }
        //         this.switchCurrentPlayer()
        //         return this.gameLoop()
        //     }
        // }))
    }

    //*Remove token from current square and set onto new*
    setToken(square) {
        this.board.getSquare(this.currentPlayer.token.getPos()).removeToken() //remove token from start square
        this.currentPlayer.token.setPos(square) //update token location
        square.addToken(this.currentPlayer.token) //put new token in new square
        this.computerPlayer.watchPlayer["moves"]++
        // this._resetHTML()
    }

    //*Grab Fence Piece*
    selectFence() {
        const that = this
        const scene = this.board.scene
        const fences = this.humanPlayer.fences

        let playerFence
        let tokenSelector
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === "playerFence") {playerFence = scene.children[i]}
            if (scene.children[i].name === "tokenSelector") {tokenSelector = scene.children[i]}
        }
        
        if (fences.length) {
            playerFence.addEventListener("click", function selectFence() {
                tokenSelector.position.set(-25, 4, 5)
                tokenSelector.visible = true
                playerFence.removeEventListener("click", selectFence)
                return that.placeFenceStart(playerFence, tokenSelector)
            })
        } else {
            playerFence.material.color.set("grey")
        }

        // const fenceBoxEle = document.getElementById("humanPlayerFences")
        // const unplayedFences = Array.from(fenceBoxEle.childNodes).map(el => el)

        // unplayedFences.forEach( fence => {
        //     fence.addEventListener( "click" , () => {
        //         fence.setAttribute("class", "highlighted")
        //         fence.addEventListener("click", () => this.gameLoop())
        //         return this.placeFenceStart()
        //     })
        // })
        
    }

    //*Select starting edge for Fence
    placeFenceStart(playerFence, tokenSelector) {
        const scene = this.board.scene
        const allNodes = []
        this.board.grid.forEach(row => {
            row.forEach(square => {
                if (square.type === "node") {
                     allNodes.push(square)
                }
            })
        }) 
        allNodes.filter(node => node.holds.length < 4)

        const sceneNodes = []
        allNodes.forEach(gridNode => {
            for (let i = 0; i < scene.children.length; i++) {
                let node = scene.children[i]
                let nodePos = gridNode.pos
            
                if (node.type === "Mesh" && this._compareArrays(node.name.split(","), nodePos)) {
                    sceneNodes.push(node)
                    this.board.interactionManager.add(node)
                    this.board.interactionManager.update()
                    node.addEventListener("click", function startFence(event){
                        event.stopPropagation();
                        tokenSelector.position.set( -20 + (2.5 * nodePos[0]), 3, -20 + (2.5 * nodePos[1]))
                        sceneNodes.forEach(node => node.removeEventListener("click", startFence))
                        placeFenceEnd(playerFence, tokenSelector, sceneNodes)
                    })
                }
            }
        })

        // sceneNodes.forEach( node => {
        //     let nodePos = node.name
        // })
        // console.log(nodes)
        // nodes.filter(node => this.board.nodeFree(this._getPosArray.call(node)))

        // const nodes = Array.from(document.getElementsByClassName("node")).map(el => el)
        // nodes.forEach( node => node.addEventListener( "click", (event) => {
        //     node.setAttribute("class", "node start-highlighted")
        //     return this.placeFenceEnd(event.target)
        // }))
    }

    //*Select midpoint for Fence and place fence on board
    placeFenceEnd(startNode) {
        const startPos = this._getPosArray.call(startNode)
        const validFences = this.board.validMoveFence(startPos)
        const allNodes = Array.from(document.getElementsByClassName("node")).map(el => el)
        startNode.addEventListener("click", () => this.gameLoop())
        const validNodes = []

        validFences.forEach(validFence => {
            for (let i = 0; i < allNodes.length; i++) {
                let nodePos = this._getPosArray.call(allNodes[i])
                if (this._compareArrays(nodePos, validFence["midNode"])) {
                    allNodes[i].setAttribute("class", "node end-highlighted")
                    validNodes.push(allNodes[i])
                    validFence["nodeLi"] = allNodes[i]
                }
            }
        })

        startNode.addEventListener("click", () => this.gameLoop())
        
        validFences.forEach(fenceObj => {
            fenceObj["nodeLi"].addEventListener( "click", () => {
                fenceObj["fences"].forEach( fence => {
                    let fenceSquare = this.board.getSquare(fence)
                    fenceSquare.addToken(this.humanPlayer.color)
                })
                this.board.getSquare(fenceObj["startNode"]).holds.push("Fence")
                this.board.getSquare(fenceObj["midNode"]).holds.push("MID")
                this.humanPlayer.fences.pop()
                this.computerPlayer.watchPlayer["fences"]++
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

    //Duplicate grid into GRAPH form for maze solver
    _dupeGrid(grid) {
        let duped = []

        grid.forEach(row => {
            let newRow = []
            row.forEach(square => {
                if (square.type === "token") {
                    return newRow.push("X")
                } else if (square.type === "fence" && !square.holds.length) {
                    return newRow.push("X")
                } else {
                    return newRow.push(0)
                }
            })
            duped.push(newRow)
        })

        return duped
    }


    //computer moves its token
    //REFACTOR ONTO COMPUTERPLAYER?
    computerMove() {
        const scene = this.board.scene
        const currentPos = this.computerPlayer.token.getPos()
        const movePos = this.computerPlayer.goal.shift()
        if (this._compareArrays(currentPos, movePos)) {
            //Jump mechanic
        }
        const moveSquare = this.board.getSquare(movePos)
        this.setToken(moveSquare)

        //Grab and Move Computer Token Mesh
        let computerToken
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === "computerToken") {computerToken = scene.children[i]}
        }
        computerToken.position.set(-20 + (2.5 * movePos[0]), 2, -20 + (2.5 * movePos[1]))

        this.computerPlayer.movesUntilNewFence--
        if (this.computerPlayer.movesUntilNewFence === 0) {
            this.humanPlayer.addFence()
            this.computerPlayer.movesUntilNewFence = this.humanPlayer.totalFences
        }
        this.switchCurrentPlayer()
        return this.gameLoop()
    }

    computerFence() {
        if (!this.computerPlayer.fences.length) return this.computerMove()

        const opponentPos = this.humanPlayer.token.getPos()
        const pathToLose = new MazeSolver(this.humanPlayer, this.computerPlayer, this._dupeGrid(this.board.grid))
        const assumedPath = pathToLose.shortestPath
        
        while (assumedPath.length) {
            let nextMove = assumedPath.shift()
            let fencePosStartArray = this.board.getNearestNode(opponentPos, nextMove)
            
            for (let i = 0; i < 2; i++) {
                let fencePosStart = fencePosStartArray[i]
                let validFences = this.board.validMoveFence(fencePosStart)
    
                for (let j = 0; j < validFences.length; j++) {
                    let validFence = validFences[i]
                    if (this._compareArrays(validFence["startNode"], fencePosStart)) {
                        return this.placeComputerFence(validFence)
                    }
                }
            }
        }
        return this.computerMove()
        
    }

    computerJump() {}

    placeComputerFence(fenceObj) {
        fenceObj["fences"].forEach(fence => {
            let fenceSquare = this.board.getSquare(fence)
            fenceSquare.addToken(this.computerPlayer.color)
        })
        this.board.getSquare(fenceObj["startNode"]).holds.push("Fence")
        this.board.getSquare(fenceObj["midNode"]).holds.push("MID")
        this.computerPlayer.fences.pop()
        this.switchCurrentPlayer()
        
        return this.gameLoop()
    }

}

