import Board from "./board/Board"
import MazeSolver from "./mazesolver/mazesolver"
import ComputerPlayer from "./player/_computerPlayer"
import HumanPlayer from "./player/_humanPlayer"
import { InteractionManager } from 'three.interactive'

export default class Game {
    constructor(playerColor="blue", computerColor="red") {
        this.humanPlayer = new HumanPlayer(playerColor)
        this.computerPlayer = new ComputerPlayer(computerColor)
        this.board = new Board(this.humanPlayer, this.computerPlayer) 
        this.currentPlayer = this.humanPlayer
        this.onceperturn = true
        this.fenceStarted = false
        this.newGame() 
    }

    reset() { 
        this.humanPlayer = new HumanPlayer(this.humanPlayer.color)
        this.computerPlayer = new ComputerPlayer(this.computerPlayer.color)
        this.currentPlayer = this.humanPlayer
        this.board = new Board(this.humanPlayer, this.computerPlayer)
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

    gameLoop() { 
        while(this.board.interactionManager.interactiveObjects.length) {
            this.board.interactionManager.interactiveObjects.shift()
        }
        let gameOver = this.isGameOver()

        if (gameOver) {
            return this.gameOver(gameOver)
        } else if (this.currentPlayer === this.humanPlayer) {
            this.selectToken()
            this.selectFence()
            return 
        } else if (this.currentPlayer === this.computerPlayer) {
            const currentBoard = new MazeSolver(this.computerPlayer, this.humanPlayer, this._dupeGrid(this.board.grid))
            this.computerPlayer.goal = currentBoard.shortestPath

            const computerTurn = this.computerPlayer.computerTurnLogic()
            if (computerTurn === "move") {
                return this.computerMove()
            } else if (computerTurn === "fence") {
                return this.computerFence()
            } else {
                // console.log("breaking at computer logic")
            }
        } else {
            // console.log("Breaking at game loop")
        }
    }

    switchCurrentPlayer() {
        if (this.currentPlayer === this.humanPlayer) {
            this.currentPlayer = this.computerPlayer
            this.computerWait()
        } else if (this.currentPlayer === this.computerPlayer) {
            this.currentPlayer = this.humanPlayer
            return this.gameLoop()
        } else {
            // console.log("SWITCH CURRENT BROKE")
            // console.log(this.currentPlayer)
        }
    }

    computerWait() {
        const that = this
        //DISPLAY COMPUTER QUOTE

        const time = Math.floor(Math.random() * 2000)

        setTimeout(this.gameLoop.bind(that), time)
    }

    endTurn() {
        const endTurnPopup = document.getElementById("endTurn")
        // const startNextTurn = document.getElementsByClassName("startNextTurn")[0]
        if (this.onceperturn === false) {
        } else {
            this.onceperturn = false
            endTurnPopup.style.display = "flex"
            endTurnPopup.addEventListener("click", (e) => {
                endTurnPopup.style.display = "none"
                this.onceperturn = true
                e.preventDefault();
                e.stopPropagation();
                this.switchCurrentPlayer();
            }, {once: true})
        }
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
        let playerFence;
        let tokenSelector;
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === "humanToken") {playerToken = scene.children[i]}
            if (scene.children[i].name === "tokenSelector") {tokenSelector = scene.children[i]}
            if (scene.children[i].name === "playerFence") {playerFence = scene.children[i]}
        }
        this.board.interactionManager.add(playerToken)
        
        //Select and unselect cycle for player's token
        playerToken.addEventListener("click", function selectPlayerToken(event) {
            event.stopPropagation();
            
            //set highlighted functionality
            tokenSelector.visible = true;
            let targetPos = event.target.position
            tokenSelector.position.set(targetPos["x"], 6, targetPos["z"]);
            
            // playerToken.removeEventListener("click", selectPlayerToken);
            return that.placeToken(playerToken, tokenSelector, playerFence), 
            {once: true}
        })        
    }


    //REFACTOR ONTO HUMANPLAYER?
    placeToken(playerTokenObj, tokenSelector, playerFence) {
        const that = this
        const startPos = this.currentPlayer.token.getPos();
        const validMoves = this.board.validMoveToken(startPos);
        const validSquares = []

        this.board.interactionManager.remove(playerFence)
        
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
            revertSquares()
            return that.gameLoop();
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
                let pos = square.name.split(",").map(el => parseInt(el))
                let color
                if (pos[1] === 0) {
                    color = that.humanPlayer.color
                } else if (pos[1] === 16) {
                    color = that.computerPlayer.color
                } else {
                    color = 0xA47449
                }
                square.material.color.set(color)
                that.board.interactionManager.remove(square)
                that.board.interactionManager.add(playerFence)
            })
            // while(validSquares.length) {
            //     validSquares.pop()
            // }
            return 
        }

        //add event listener to player token to undo selection
        playerTokenObj.addEventListener("click", unselectPlayerToken)

        //iterate through valid moves, attaching event handlers to valid squares
        const squares = []
        //and highlight them in green
        validMoves.forEach(validMove => {
            that.board.scene.children.forEach(square => {
                if (square.type === "Mesh" && that._compareArrays(square.name.split(","), validMove)) {
                    //set valid move squares to GREEN
                    square.material.color.set("green")
                    squares.push(square)
                }
            })
        })

        squares.forEach(square => {
            //add event listener to square
            this.board.interactionManager.add(square);

            square.addEventListener("click", function moveToken(event) {
                let validMove = square.name.split(",").map(el => parseInt(el))
                event.stopPropagation();
    
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
                squares.forEach(square => that.board.interactionManager.remove(square))
                // that._removeListeners(squares, moveToken)
                squares.forEach(square => square._listeners.click.pop())
                that.board.interactionManager.remove(playerTokenObj)
                
                return that.endTurn()
                // return that.switchCurrentPlayer()
            }, {once: true});
            
        })        
    }

    //*Remove token from current square and set onto new*
    setToken(square) {
        this.board.getSquare(this.currentPlayer.token.getPos()).removeToken() //remove token from start square
        this.currentPlayer.token.setPos(square) //update token location
        square.addToken(this.currentPlayer.token) //put new token in new square
        this.computerPlayer.watchPlayer["moves"]++
        // this._resetHTML()
        return
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
        this.board.interactionManager.add(playerFence)

        
        if (fences.length && this.onceperturn) {
            playerFence.material.color.set(this.humanPlayer.color)
            playerFence.addEventListener("click", function selectFence(event) {
                event.stopPropagation();
                
                tokenSelector.position.set(-25, 4, 5)
                tokenSelector.visible = true
                playerFence.removeEventListener("click", selectFence)
                that.board.interactionManager.remove(playerFence)

                return that.stopGap(playerFence, tokenSelector)
                // return that.placeFenceStart(playerFence, tokenSelector)
            }, {once: true})
        } else {
            playerFence.material.color.set("grey")
            this.board.interactionManager.remove(playerFence)
        }
    }


    stopGap(playerFence, tokenSelector) {
        if (!this.humanPlayer.onceperturn) return
        this.humanPlayer.onceperturn = false
        return this.placeFenceStart(playerFence, tokenSelector)
    }

    //*Select starting edge for Fence
    placeFenceStart(playerFence, tokenSelector) {
        this.humanPlayer.onceperturn = true
        const that = this
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
                    node.addEventListener("click", function startFence(event){
                        event.stopPropagation();

                        tokenSelector.position.set( -20 + (2.5 * nodePos[0]), 3, -20 + (2.5 * nodePos[1]))
                        
                        // that._removeListeners(sceneNodes, startFence)
                        sceneNodes.forEach(node => node._listeners.click.pop())
                        // return that.placeFenceEnd(playerFence, tokenSelector, node, sceneNodes)
                        return that.stopGap2(tokenSelector, node, sceneNodes)
                    }, {once: true})
                }
            }
        })
    }

    stopGap2(tokenSelector, node, sceneNodes) {
        if (!this.humanPlayer.onceperturn) return
        this.humanPlayer.onceperturn = false
        return this.placeFenceEnd(tokenSelector, node, sceneNodes)
    }

    //*Select midpoint for Fence and place fence on board
    placeFenceEnd(tokenSelector, startNode, sceneNodes) {
        this.humanPlayer.onceperturn = true
        const that = this
        const startPos = startNode.name.split(",").map(el => parseInt(el))
        const validFences = this.board.validPlayerFence(startPos)

        sceneNodes.forEach(node => {
            let nodePos = node.name.split(",").map(el => parseInt(el))
            validFences.forEach(fenceObj => {
                if (this._compareArrays(nodePos, fenceObj["midNode"])) {
                    node.addEventListener("click", function addFence(event) {
                        event.stopPropagation();

                        //Create new fence, add it to board and position it properly
                        let newFence = that.board.buildFence(that.humanPlayer)
                        newFence.position.set(-20 + (2.5 * nodePos[0]), 0, -20 + (2.5 * nodePos[1]))
                        // that.board.scene.add(newFence)
                        if (fenceObj["midNode"][1] === fenceObj["startNode"][1]) {
                            newFence.rotation.y = Math.PI / 2
                        }
                        node.material.color.set(that.humanPlayer.color)

                        //update board.grid with new fence
                        that.board.getSquare(fenceObj["startNode"]).holds.push("Fence")
                        that.board.getSquare(fenceObj["midNode"]).holds.push("MID")
                        if (fenceObj["endNode"]) that.board.getSquare(fenceObj["endNode"]).holds.push("MID")
                        fenceObj["fences"].forEach(fence => that.board.getSquare(fence).holds.push("Fence"))
                        
                        while(that.humanPlayer.fences.length > (fenceObj["fenceCount"] - 1)) {
                            that.humanPlayer.fences.pop()
                            that.computerPlayer.watchPlayer["fences"]++
                            that.humanPlayer.moves += 1
                            
                        }

                        //cleanup event listening and canvas
                        tokenSelector.visible = false
                        // that._removeListeners(sceneNodes, addFence)
                        that.board.interactionManager.remove(newFence)
                        sceneNodes.forEach(node => node._listeners.click.pop())
                        that.humanPlayer.onceperturn = true
                        // return that.switchCurrentPlayer()
                        return that.endTurn();
                    }, {once: true})
                }
            })
        })        
    }

    isGameOver() {
        if (parseInt(this.humanPlayer.token.getPos()[1]) === 0) {
            return this.humanPlayer
        } else if (parseInt(this.computerPlayer.token.getPos()[1]) === 16) {
            return this.computerPlayer
        } else {
            return false
        }
    }

    gameOver(player) {
        const scene = this.board.scene
        let humanToken
        let computerToken
        let winLight
        let ambientLight
        let news = []
        let newGameClick

        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === "ambientLight") {ambientLight = scene.children[i]}
            if (scene.children[i].name === "humanToken") {humanToken = scene.children[i]}
            if (scene.children[i].name === "computerToken") {computerToken = scene.children[i]}
            if (scene.children[i].name === "winLight") {winLight = scene.children[i]}
            if (scene.children[i].name === "wins") {news.push(scene.children[i])}
            if (scene.children[i].name === "newGameClick") {newGameClick = scene.children[i]}
        }

        const gameOver = document.getElementById("newGame")
        winLight.visible = true;
        news.forEach(square => square.visible = true)
        newGameClick.position.set(14, -10, -34)

        if (player === this.humanPlayer){
            gameOver.style.color = this.humanPlayer.color
            const p1 = document.createElement("p")
            const p2 = document.createElement("p")
            p1.innerText = "YOU WON!"
            p2.innerText = "Play Again?"
            gameOver.appendChild(p1)
            gameOver.appendChild(p2)
            winLight.target = humanToken
            computerToken.rotation.x = Math.PI / 2
            ambientLight.visible = false
        } else {
            gameOver.style.color = this.computerPlayer.color
            const p1 = document.createElement("p")
            const p2 = document.createElement("p")
            p1.innerText = "NICE TRY!"
            p2.innerText = "Play Again?"
            gameOver.appendChild(p1)
            gameOver.appendChild(p2)
            winLight.target = computerToken
            humanToken.rotation.x = Math.PI / 2
            ambientLight.visible = false
        }

        function setGameOver() {
            const gameOver = document.getElementById("newGame")
            return gameOver.style.display = "flex"
        }
        
        setTimeout(setGameOver, 5000)
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

    _removeListeners(array, func) {
        array.forEach( ele => {ele.removeEventListener("click", func)})
    }


    //computer moves its token
    //REFACTOR ONTO COMPUTERPLAYER?
    computerMove() {
        const scene = this.board.scene
        const movePos = this.computerPlayer.goal.shift()
        // if (this._compareArrays(currentPos, movePos)) {
        //     //Jump mechanic
        // }
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

        return this.switchCurrentPlayer()
    }

    computerFence() {
        //grab computer fence obj
        if (!this.computerPlayer.fences.length) {
            //turn computer fence grey here
            return this.computerMove()
        } else {
            //turn computer fence computer color here
            const pathToLose = new MazeSolver(this.humanPlayer, this.computerPlayer, this._dupeGrid(this.board.grid))
            const assumedPath = pathToLose.shortestPath

            if (assumedPath.length <= 1) {
                return this.computerMove()
            }
    
            const randomSpot = Math.floor(Math.random() * (assumedPath.length - 2))
    
            const randomSquare1 = assumedPath[randomSpot]
            const randomSquare2 = assumedPath[randomSpot + 1]
    
            const NodePositions = this.board.getNearestNode(randomSquare1, randomSquare2)
    
            const validFences = this.board.validComputerFence(NodePositions)
        
            if (validFences.length) {
                const randomFence = Math.floor(Math.random() * 2)
                const fenceObj = validFences[randomFence]
                return this.placeComputerFence(fenceObj)
            } else {
                return this.computerMove()
            }
        }
    }

    placeComputerFence(fenceObj) {
        let scene = this.board.scene
        let computerFence
        let midNode
        if (!fenceObj) {
            return this.computerMove()
        }
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === "computerFence") {computerFence = scene.children[i]};
            if (this._compareArrays(scene.children[i].name.split(","), fenceObj["midNode"])) {midNode = scene.children[i]};
        }
        let newFence = this.board.buildFence(this.computerPlayer)
        scene.add(newFence)
    
        let midPos = fenceObj["midNode"]
        newFence.position.set(-20 + (2.5 * midPos[0]), 0, -20 + (2.5 * midPos[1]))
        if (fenceObj["midNode"][1] === fenceObj["startNode"][1]) {
            newFence.rotation.y = Math.PI / 2
        }
        midNode.material.color.set(this.computerPlayer.color)

        fenceObj["fences"].forEach(fence => {
            let fenceSquare = this.board.getSquare(fence)
            fenceSquare.addToken(this.computerPlayer.color)
        })
        this.board.getSquare(fenceObj["startNode"]).holds.push("END")
        this.board.getSquare(fenceObj["midNode"]).holds.push("MID")
        if (fenceObj["startNode"]) this.board.getSquare(fenceObj["startNode"]).holds.push("END")
        if (fenceObj["endNode"]) this.board.getSquare(fenceObj["endNode"]).holds.push("END")
        this.computerPlayer.fences.pop()

        return this.switchCurrentPlayer()
    }

    //Computer Player Jump Move 
    computerJump() {}

}

//for DEV ONLY
    // _resetHTML() {
    //     const board = document.getElementById("gameBoard")
    //     while(board.firstChild) {
    //         board.removeChild(board.firstChild)
    //     }
    //     this.board.render()
    // }

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

        //**HTML*** */
        // const fenceBoxEle = document.getElementById("humanPlayerFences")
        // const unplayedFences = Array.from(fenceBoxEle.childNodes).map(el => el)

        // unplayedFences.forEach( fence => {
        //     fence.addEventListener( "click" , () => {
        //         fence.setAttribute("class", "highlighted")
        //         fence.addEventListener("click", () => this.gameLoop())
        //         return this.placeFenceStart()
        //     })
        // })

        //***HTML */
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


        //***HTML*** */
        // const allNodes = Array.from(document.getElementsByClassName("node")).map(el => el)
        // startNode.addEventListener("click", () => this.gameLoop())
        // const validNodes = []

        // validFences.forEach(validFence => {
        //     for (let i = 0; i < allNodes.length; i++) {
        //         let nodePos = this._getPosArray.call(allNodes[i])
        //         if (this._compareArrays(nodePos, validFence["midNode"])) {
        //             allNodes[i].setAttribute("class", "node end-highlighted")
        //             validNodes.push(allNodes[i])
        //             validFence["nodeLi"] = allNodes[i]
        //         }
        //     }
        // })

        // startNode.addEventListener("click", () => this.gameLoop())
        
        // validFences.forEach(fenceObj => {
        //     fenceObj["nodeLi"].addEventListener( "click", () => {
        //         fenceObj["fences"].forEach( fence => {
        //             let fenceSquare = this.board.getSquare(fence)
        //             fenceSquare.addToken(this.humanPlayer.color)
        //         })
        //         this.board.getSquare(fenceObj["startNode"]).holds.push("Fence")
        //         this.board.getSquare(fenceObj["midNode"]).holds.push("MID")
        //         this.humanPlayer.fences.pop()
        //         this.computerPlayer.watchPlayer["fences"]++
        //         this.switchCurrentPlayer()
        //         return this.gameLoop()
        //     })
        // })

          //string to int helper function for position HTML
    // _getPosArray() {
    //     return this.getAttribute("data-pos").split(",").map(el => parseInt(el))
    // }