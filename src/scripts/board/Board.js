import HumanPlayer from "../player/_humanPlayer";
import Square from "./Square";
import * as THREE from 'three';
import { DirectionalLight, GridHelper, Raycaster, SpotLight, SpotLightHelper, TextureLoader } from 'three';
import renderCamera from '../threejs/orbitalcam';
import grass from '../../assets/images/grass2.png';
import sky from '../../assets/images/sky.jpg';



export default class Board {
    constructor(humanPlayer, computerPlayer) {
        this.grid = []
        this.players = [humanPlayer, computerPlayer]
        this.buildBoard()
    }

    buildBoard() {
        
        for (let i = 0; i < 17; i++) {
            let row = []
            
            for (let j = 0; j < 17; j++) {
                
                let edgeNodesHold = 0
                let pos = [j, i]
                let type = ""
                let iEven = (i + 2) % 2 === 0 
                let jEven = (j + 2) % 2 === 0
                
                if (iEven && jEven) {
                    type = "token"
                } else if (iEven && !jEven || !iEven && jEven) {
                    type = "fence"
                } else if (
                    i === 1 && j === 1 
                    || i === 1 && j === 15 
                    || i === 15 && j === 1
                    || i === 15 && j === 15
                    ) {
                        type = "node"
                        edgeNodesHold = 2
                } else if (i === 1 || i === 15 || j === 1 || j === 15) {
                    type = "node"
                    edgeNodesHold = 1
                } else {
                    type = "node"
                }
                
                let square = new Square(pos, type)
        
                for (let i = 0; i < edgeNodesHold; i++) {     
                    square.addToken("BLOCK")
                }
                    
                
                row.push(square)
            }
            this.grid.push(row)
        }
    }

    fillGrid(humanPlayer, computerPlayer) {
        const playerStart = this.getSquare([8, 16])
        humanPlayer.token.pos = playerStart
        const playerToken = humanPlayer.token
        playerStart.addToken(playerToken)

        const computerStart = this.getSquare([8, 0])
        computerPlayer.token.pos = computerStart
        const computerToken = computerPlayer.token
        computerStart.addToken(computerToken)
    }

    //IDEA: BUTTON TO RECENTER CAMERA
    //IDEA: SPOTLIGHT ON WINNER TOKEN
    //PAINT RENDERED HTML BOARD ON TOP OF GAMEBOARD
    render() {
        //render 3d, enable shadows, set to window size, append to html
        const renderer = new THREE.WebGLRenderer();
        renderer.shadowMap.enabled = true;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        //create "scene" and "perspective camera"
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            .1,
            1000
        ); 
        
        //orbital movement camera
        const orbit = renderCamera(camera, renderer.domElement);
        camera.position.set(0, 20, 40);
        orbit.update();

        //ambient dim light source (base line)
        const ambientLight = new THREE.AmbientLight(0x666666);
        // scene.add(ambientLight)

        //Directional Light for game board
        const directionalBoardLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
        scene.add(directionalBoardLight);
        directionalBoardLight.position.set(-30, 50, 25);
        directionalBoardLight.castShadow = true;
        directionalBoardLight.shadow.camera.bottom = -18;
        directionalBoardLight.shadow.camera.top = 18;
        directionalBoardLight.shadow.camera.left = -22;
        directionalBoardLight.shadow.camera.right = 22;

        //Direction Light and Shadow Helpers for game board
        const dBoardLightHelper = new THREE.DirectionalLightHelper(directionalBoardLight, 5);
        scene.add(dBoardLightHelper);
        const dBoardShadowHelper = new THREE.CameraHelper(directionalBoardLight.shadow.camera);
        scene.add(dBoardShadowHelper);

        //S

        //axes helper for x, y, z values
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        //ground plane
        const planeGeometryGround = new THREE.PlaneGeometry(500, 500);
        const planeMaterialGround = new THREE.MeshStandardMaterial({
            // color: 0xA1DF50, //grass green
            color: "grey", //DEV USE
            // side: THREE.DoubleSide
        });
        const planeGround = new THREE.Mesh(planeGeometryGround, planeMaterialGround);
        scene.add(planeGround);
        planeGround.rotation.x = -0.5 * Math.PI;
        planeGround.receiveShadow = true;

        //grid helper for ground plane
        const gridHelper = new GridHelper(30, 17, "white");
        gridHelper.position.set(0, 1.1, 0)
        scene.add(gridHelper);


        //background images
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        scene.background = cubeTextureLoader.load([
            grass,
            grass,
            sky,
            sky,
            grass,
            grass
        ]);

        //Render Game Board
        const gameBoardGeometry = new THREE.BoxGeometry(30, 2, 30);
        const gameBoardMaterial = new THREE.MeshStandardMaterial({
            color: "black", //DEV USE
            wireframe: false
        })
        const gameBoard = new THREE.Mesh(gameBoardGeometry, gameBoardMaterial);
        scene.add(gameBoard);
        // gameBoard.rotation.x = -0.5 * Math.PI;
        gameBoard.position.set(0, 0, 1)
        gameBoard.receiveShadow = true;


        const playerPieceGeometry = new THREE.CylinderGeometry(.5, 1, 5);
        const playerPieceMaterial = new THREE.MeshStandardMaterial({
            color: "blue"
        });
        const playerPiece = new THREE.Mesh(playerPieceGeometry, playerPieceMaterial);
        playerPiece.castShadow = true;

        const computerPieceGeometry = new THREE.CylinderGeometry(.5, 1, 5);
        const computerPieceMaterial = new THREE.MeshStandardMaterial({
            color: "red"
        });
        const computerPiece = new THREE.Mesh(computerPieceGeometry, computerPieceMaterial);
        computerPiece.castShadow = true;

        scene.add(playerPiece);
        scene.add(computerPiece);

        playerPiece.position.set(17, 0, -2)
        computerPiece.position.set(17, 0, 2)
        

        this.grid.forEach( (row, i) => {
            
        })

        
        
        


        this.grid.forEach( (row, i) => {
            let gameBoard = document.getElementById("gameBoard")
            let renderRow = document.createElement("ul")

            row.forEach( square => {
                
                if (square.type === "token") {
                    if (square.holds.length) {
                        let tokenStart = this.buildSpace("li", "playerSquare", square.pos)
                        let token = document.createElement("div")
                        token.setAttribute("class", "token")
                        token.style.backgroundColor = square.getToken().color
                        tokenStart.appendChild(token)
                        renderRow.appendChild(tokenStart)
                    } else {
                        let emptySquare = this.buildSpace("li", "square", square.pos)
                        renderRow.appendChild(emptySquare)
                    }
                } else if (square.type === "fence" && i % 2 === 0) {
                    let fenceSpace = this.buildSpace("li", "verticalFence", square.pos)
                    if (square.holds.length) {
                        fenceSpace.style.backgroundColor = square.holds[0]
                    }
                    renderRow.appendChild(fenceSpace)             
                } else if (square.type === "fence") {
                    let fenceSpace = this.buildSpace("li", "horizontalFence", square.pos)
                    if (square.holds.length) {
                        fenceSpace.style.backgroundColor = square.holds[0]
                    }
                    renderRow.appendChild(fenceSpace)                    
                } else {
                    let nodeSpace = this.buildSpace("li", "node", square.pos)
                    renderRow.appendChild(nodeSpace)                   
                }
            })
            gameBoard.appendChild(renderRow)
        })
    

        this.players.forEach( player => {
            let fenceBox

            if (player instanceof HumanPlayer) {
                fenceBox = document.getElementById("humanPlayerFences")
            } else {
                fenceBox = document.getElementById("computerPlayerFences")
            }

            while (fenceBox.firstChild) {
                fenceBox.removeChild(fenceBox.firstChild)
            }
            
            let fences = player.fences.length
            
            for (let i = 0; i < fences; i++) {
                let fence = document.createElement("li")
                fence.style.backgroundColor = player.color
                fenceBox.appendChild(fence)
            }

            function animate() {
                renderer.render(scene, camera)
            }
    
            renderer.setAnimationLoop(animate);
        })
    }

    buildSpace(ele, classAttr, pos) {
        let newEle = document.createElement(`${ele}`)
        newEle.setAttribute("class", classAttr)
        newEle.setAttribute("data-pos", pos)
        return newEle
    }

    getSquare(pos) {
        let posY = parseInt(pos[0])
        let posX = parseInt(pos[1])
        
        return this.grid[posX][posY]
    }

    validMoveToken(pos) {
        const startPos = [parseInt(pos[0]), parseInt(pos[1])]
        
        const fencePlacements = [[1,0], [-1, 0], [0, 1], [0, -1]]
        const validMovements = [[2, 0], [-2, 0], [0, 2], [0, -2]]
        const fenceJumpPlacements = [[3, 0], [-3, 0], [0, 3], [0, -3]]
        const validJumpMovements = [[4, 0], [-4, 0], [0, 4], [0, -4]]

        const validMoves = []
        
        for (let i = 0; i < 4; i++) {

            let fencePos = [
                startPos[0] + fencePlacements[i][0],
                startPos[1] + fencePlacements[i][1]
            ]
            let fenceJumpPos = [
                startPos[0] + fenceJumpPlacements[i][0],
                startPos[1] + fenceJumpPlacements[i][1]
            ]
            let movePos = [
                startPos[0] + validMovements[i][0],
                startPos[1] + validMovements[i][1]
            ]
            let jumpPos = [
                startPos[0] + validJumpMovements[i][0],
                startPos[1] + validJumpMovements[i][1]
            ]

            let inbounds = true
            let jumpInbounds = true
            
            for (let j = 0; j < 2; j++) {
                if (movePos[j] < 0 || movePos[j] > 16) {
                    inbounds = false
                    jumpInbounds = false
                } else if (jumpPos[j] < 0 || jumpPos[j] > 16) {
                    jumpInbounds = false;
                }
            }

            if (inbounds && this.getSquare(fencePos).filled()) {
                continue;
            } else if (inbounds && !this.getSquare(movePos).filled()) {
                validMoves.push(movePos)
            } else if (jumpInbounds && !this.getSquare(fenceJumpPos).filled()) {
                validMoves.push(jumpPos)
            }

        }
        return validMoves
    }

    nodeFree(nodePos) {
        const node = this.getSquare(nodePos)
        if (node.holds.length < 4) {
            return true
        } else {
            return false
        }
    }


    validMoveFence(nodePos) {
        
        const fencePlacements = [
            [[1, 0], [3, 0]],
            [[-1, 0], [-3, 0]],
            [[0, 1], [0, 3]],
            [[0, -1], [0, -3]] 
        ]

        const midNodePlacements = [
            [2, 0], [-2, 0], [0, 2], [0, -2]
        ]

        // const endNodePlacements = [
        //     [4, 0], [-4, 0], [0, 4], [0, -4]
        // ]
        
        const validFences = []

        for (let i = 0; i < 4; i++) {

            let fencePlacement = [
                [nodePos[0] + fencePlacements[i][0][0],
                nodePos[1] + fencePlacements[i][0][1]],
                [nodePos[0] + fencePlacements[i][1][0],
                nodePos[1] + fencePlacements[i][1][1]]
            ]

            let midNode = [
                nodePos[0] + midNodePlacements[i][0],
                nodePos[1] + midNodePlacements[i][1]
            ]

            // let endNode = [
            //     nodePos[0] + endNodePlacements[i][0],
            //     nodePos[1] + endNodePlacements[i][1]
            // ]
           

            let inbounds = true
            let free = true
            let notCrossing = true
            let solvable = true
            let validFence

            if (midNode[0] < 0 || midNode[0] > 16 || midNode[1] < 0 || midNode[1] > 16) {
                inbounds = false
            } else if (this.getSquare(fencePlacement[0]).filled() || this.getSquare(fencePlacement[1]).filled()) {
                free = false
            } else if (this.getSquare(midNode).holds.includes("MID")) {
                notCrossing = false
            } else if (!this.solvable(nodePos, fencePlacement)){
                   solvable = false
            }

            if (inbounds && free && notCrossing && solvable) {
                validFence = {
                    "fences": fencePlacement,
                    "startNode": nodePos,
                    "midNode": midNode,
                    // "endNode": endNode
                }
                validFences.push(validFence)
            }
        }
    
        return validFences
    }
        //if fence move, dupes grid, places fence, and checkes that grid is still solveable for both players.
        // #gridDup(grid), #solveforPlayer(player)

    solvable(nodePos, fencePlacement) {
        return true
    }

    // return two node points between two positions
    //NEED TO CHECK FOR NODES EXISTENCE!
    getNearestNode(pos1, pos2) {
        if (pos1[0] === pos2[0]) {
            if (pos1[1] < pos2[1]) {
                return [[pos1[0] - 1, pos1[1] + 1], [pos1[0] + 1, pos1[1] + 1]]//pos1 above
            } else {
                return [[pos1[0] - 1, pos1[1] - 1], [pos1[0] + 1, pos1[1] - 1]]//pos1 below
            }
        } else {
            if (pos1[1] < pos2[1]) {
                return [[pos1[0] + 1, pos1[1] + 1], [pos1[0] + 1, pos1[1] - 1]] //pos1 to left
            } else {
                return [[pos1[0] - 1, pos1[1] + 1], [pos1[0] - 1, pos1[1] - 1]]//pos1 to right
            }
        }
    }

}

