import HumanPlayer from "../player/_humanPlayer";
import Square from "./Square";
import * as THREE from 'three';
import { DirectionalLight, GridHelper, Raycaster, SpotLight, SpotLightHelper, TextureLoader } from 'three';
import renderCamera from '../threejs/orbitalcam';
import grass from '../../assets/images/grass2.png';
import sky from '../../assets/images/sky.jpg';
import wood from '../../assets/images/wood.jpg'
import { InteractionManager } from 'three.interactive'


export default class Board {
    constructor(humanPlayer, computerPlayer) {
        this.grid = []
        this.players = [humanPlayer, computerPlayer]
        this.buildBoard()
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera
        this.interactionManager
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

        return this.render() //COMMENT OUT FOR HTML DEV TESTING
    }

    //IDEA: BUTTON TO RECENTER CAMERA
    //IDEA: SPOTLIGHT ON WINNER TOKEN
    //PAINT RENDERED HTML BOARD ON TOP OF GAMEBOARD
    render() {
        //render 3d, enable shadows, set to window size, append to html
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        //create "camera" and "perspective camera"
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            .1,
            1000
        ); 
        // this.camera = camera
        

        //orbital movement camera
        const orbit = renderCamera(camera, this.renderer.domElement);
        camera.position.set(0, 50, 50);
        orbit.update();
        this.interactionManager = new InteractionManager(
            this.renderer,
            camera,
            this.renderer.domElement
          );
          this.camera = orbit
        

        //ambient dim light source (base line)
        const ambientLight = new THREE.AmbientLight(0x666666);
        this.scene.add(ambientLight)
        ambientLight.name = "ambientLight"

        //Directional Light for game board
        const directionalBoardLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        this.scene.add(directionalBoardLight);
        directionalBoardLight.position.set(-30, 60, 25);
        directionalBoardLight.castShadow = true;
        directionalBoardLight.shadow.camera.bottom = -30;
        directionalBoardLight.shadow.camera.top = 27;
        directionalBoardLight.shadow.camera.left = -26;
        directionalBoardLight.shadow.camera.right = 30;

        //Direction Light and Shadow Helpers for game board
        // const dBoardLightHelper = new THREE.DirectionalLightHelper(directionalBoardLight, 5);
        // this.scene.add(dBoardLightHelper);
        // const dBoardShadowHelper = new THREE.CameraHelper(directionalBoardLight.shadow.camera);
        // this.scene.add(dBoardShadowHelper);
        
        //axes helper for x, y, z values
        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);

        //ground plane
        const planeGeometryGround = new THREE.PlaneGeometry(500, 500);
        const planeMaterialGround = new THREE.MeshStandardMaterial({
            color: 0x37AE0F //grass green
            // color: "grey", //DEV USE
            // side: THREE.DoubleSide
        });
        const planeGround = new THREE.Mesh(planeGeometryGround, planeMaterialGround);
        this.scene.add(planeGround);
        planeGround.rotation.x = -0.5 * Math.PI;
        planeGround.receiveShadow = true;

        //grid helper for ground plane
        // const gridHelper = new GridHelper(44, 9, "white");
        // gridHelper.position.set(0, 1.1, 0)
        // this.scene.add(gridHelper);


        //background images
        // const cubeTextureLoader = new THREE.CubeTextureLoader();
        // this.scene.background = cubeTextureLoader.load([
        //     grass,
        //     grass,
        //     sky,
        //     sky,
        //     grass,
        //     grass
        // ]);
        this.scene.background = new THREE.Color( 0x87CEEB )

        //wood texture
        const textureLoader = new THREE.TextureLoader();

        //Render Logo
        const squareGeometry = new THREE.BoxGeometry(1, 1, 1)
        const squareMaterial = new THREE.MeshStandardMaterial({
            // map: textureLoader.load(wood)
            color: "white"
        })
        const square = new THREE.Mesh(squareGeometry, squareMaterial)
        square.castShadow = true;
        square.receiveShadow = true;
        const rectGeometry = new THREE.BoxGeometry(1, 3, 1)
        const rectMaterial = new THREE.MeshStandardMaterial({
            // map: textureLoader.load(wood)
            color: "white"
        })
        const rect = new THREE.Mesh(rectGeometry, rectMaterial)
        rect.castShadow = true;
        rect.receiveShadow = true;
        this.buildLogo(square, rect)
        this.scene.add(square)
        square.position.set(0, -1, -50)

        //Render Rules
        const rulesGeometry = new THREE.BoxGeometry(1, 1, 1)
        const rulesMatertial = new THREE.MeshStandardMaterial({
            color: "white"
        })
        const rules = new THREE.Mesh(rulesGeometry, rulesMatertial)
        rules.castShadow = true;
        rules.receiveShadow = true;
        this.buildRules(rules)

        //rulesclickbox
        const rulesclickGeometry = new THREE.BoxGeometry(12, 1, 4)
        const rulesclickMatertial = new THREE.MeshBasicMaterial({
            color: "white"
        })
        const rulesClick = new THREE.Mesh(rulesclickGeometry, rulesclickMatertial)
        this.scene.add(rulesClick)
        const rulesClickId = rulesClick.id
        rulesClick.position.set(-10, 0, -32)
        rulesClick.material.visible = false

        const rulesSpotlight = new THREE.SpotLight(0xFBFAF5);
        this.scene.add(rulesSpotlight)
        rulesSpotlight.position.set(-30, 60, 0)
        rulesSpotlight.castShadow = true;
        rulesSpotlight.penumbra = .8;
        rulesSpotlight.angle = 0.1;
        rulesSpotlight.target = rulesClick
        
        //About Me hoverbox
        const aboutMeGeometry = new THREE.BoxGeometry(20, 1, 4)
        const aboutMeMaterial = new THREE.MeshBasicMaterial({
            color: "white"
        })
        const aboutMe = new THREE.Mesh(aboutMeGeometry, aboutMeMaterial)
        this.scene.add(aboutMe)
        const aboutMeId = aboutMe.id
        aboutMe.position.set(0, 1, -50)
        aboutMe.material.visible = false

        //New Game?
        const newGameGeometry = new THREE.BoxGeometry(1, 1, 1)
        const newGameMatertial = new THREE.MeshStandardMaterial({
            color: "white"
        })
        const newGame = new THREE.Mesh(newGameGeometry, newGameMatertial)
        newGame.castShadow = true;
        newGame.receiveShadow = true;
        this.buildNewGame(newGame)

        const newgameclickGeometry = new THREE.BoxGeometry(12, 1, 4)
        const newgameclickMatertial = new THREE.MeshBasicMaterial({
            color: 0x55C233
        })
        const newgameclick = new THREE.Mesh(newgameclickGeometry, newgameclickMatertial)
        this.scene.add(newgameclick)
        newgameclick.name = "newGameClick"
        newgameclick.position.set(-10, 100, -32)
        this.interactionManager.add(newgameclick)

        const newgameSpotlight = new THREE.SpotLight(0xFBFAF5);
        this.scene.add(newgameSpotlight)
        newgameSpotlight.position.set(-30, 60, 0)
        newgameSpotlight.castShadow = true;
        newgameSpotlight.penumbra = .8;
        newgameSpotlight.angle = 0.1;
        newgameSpotlight.target = newgameclick

        //Win Light
        const winLight = new THREE.SpotLight(0xFFFFFF);
        this.scene.add(winLight);
        winLight.position.set(0, 80, 0)
        winLight.angle = .025;
        winLight.penumbra = .3;
        winLight.visible = false;
        winLight.name = "winLight"


        //logo light
        const directionalLogoLight = new THREE.DirectionalLight(0xFFFFFF, .6)
        this.scene.add(directionalLogoLight)
        directionalLogoLight.position.set(-30, 60, 25);
        directionalLogoLight.castShadow = true,
        directionalLogoLight.target = square
        directionalLogoLight.shadow.camera.bottom = -10
        directionalLogoLight.shadow.camera.top = 5
        directionalLogoLight.shadow.camera.left = -10
        directionalLogoLight.shadow.camera.right = 20
        //logo light and shadow helpers
        // const dBoardLightHelper = new THREE.DirectionalLightHelper(directionalLogoLight, 5);
        // this.scene.add(dBoardLightHelper);
        // const dBoardShadowHelper = new THREE.CameraHelper(directionalLogoLight.shadow.camera);
        // this.scene.add(dBoardShadowHelper);

        //Render Game Board
        const gameBoardGeometry = new THREE.BoxGeometry(44, 1, 44);
        const gameBoardMaterial = new THREE.MeshStandardMaterial({
            color: 0x4B382A,
            wireframe: false
        })
        const gameBoard = new THREE.Mesh(gameBoardGeometry, gameBoardMaterial);
        this.scene.add(gameBoard);
        // gameBoard.rotation.x = -0.5 * Math.PI;
        gameBoard.position.set(0, 0, 0)
        gameBoard.receiveShadow = true;
        gameBoard.castShadow = true;

        //PLAYER TOKEN PIECE
        const playerPieceGeometry = new THREE.CylinderGeometry(.5, 1, 5);
        const playerPieceMaterial = new THREE.MeshStandardMaterial({
            color: this.players[0].color
            // map: textureLoader.load(wood)
        });
        const playerPiece = new THREE.Mesh(playerPieceGeometry, playerPieceMaterial);
        this.scene.add(playerPiece);
        // this.interactionManager.add(playerPiece)
        playerPiece.castShadow = true;
        playerPiece.name = "humanToken"
        
        //PLAYER SELECTED DIAMOND
        const tokenselectorGeometery = new THREE.OctahedronGeometry(.75)
        const tokenselectorMaterial = new THREE.MeshStandardMaterial({color: "yellow"});
        const tokenselector = new THREE.Mesh(tokenselectorGeometery, tokenselectorMaterial);
        this.players[0].selectorIcon = tokenselector
        this.scene.add(tokenselector)
        tokenselector.material.color.set("yellow")
        tokenselector.name = "tokenSelector"
        tokenselector.visible = false

        //PLAYER FENCE
        const playerFenceGeometry = new THREE.BoxGeometry(1, 5, 9)
        const playerFenceMaterial = new THREE.MeshStandardMaterial({
            color: this.players[0].color
            // map: textureLoader.load(wood)
        })
        const playerFence = new THREE.Mesh(playerFenceGeometry, playerFenceMaterial)
        this.scene.add(playerFence)
        // this.interactionManager.add(playerFence)
        playerFence.castShadow = true;
        playerFence.receiveShadow = true;
        playerFence.name = "playerFence"
        playerFence.position.set(-25, 0, 5)

        //COMPUTER TOKEN PIECE
        const computerPieceGeometry = new THREE.CylinderGeometry(.5, 1, 5);
        const computerPieceMaterial = new THREE.MeshStandardMaterial({
            color: this.players[1].color
            // map: textureLoader.load(wood)
        });
        const computerPiece = new THREE.Mesh(computerPieceGeometry, computerPieceMaterial);
        this.scene.add(computerPiece);
        computerPiece.castShadow = true;
        computerPiece.name = "computerToken"

        //COMPUTER FENCE
        const computerFenceGeometry = new THREE.BoxGeometry(1, 5, 9)
        const computerFenceMaterial = new THREE.MeshStandardMaterial({
            color: this.players[1].color
            // map: textureLoader.load(wood)
        })
        const computerFence = new THREE.Mesh(computerFenceGeometry, computerFenceMaterial)
        this.scene.add(computerFence)
        computerFence.castShadow = true;
        computerFence.receiveShadow = true;
        computerFence.name = "computerFence"
        computerFence.position.set(25, 0, -5)
        

        playerPiece.position.set(0, 2, 20)
        computerPiece.position.set(0, 2, -20)
        

        this.grid.forEach( (row, j) => {
            row.forEach( (square, i) => {
                let humanColor = this.players[0].color
                let computerColor = this.players[1].color
                
                if (square.type === "token" && j === 0) {
                    let tokenSquareGeometry = new THREE.BoxGeometry(3.5, 2, 3.5);
                    let tokenSquareMaterial = new THREE.MeshStandardMaterial({
                        color: `${humanColor}`
                        // map: textureLoader.load(wood)
                    });
                    let tokenSquare = new THREE.Mesh(tokenSquareGeometry, tokenSquareMaterial);
                    this.scene.add(tokenSquare);
                    tokenSquare.position.set(-20 + (2.5 * i), 0, -20);
                    tokenSquare.receiveShadow = true;
                    tokenSquare.castShadow = true;
                    tokenSquare.name = `${[i, j]}`
                } else if (square.type === "token" && j === 16) {
                    let tokenSquareGeometry = new THREE.BoxGeometry(3.5, 2, 3.5);
                    let tokenSquareMaterial = new THREE.MeshStandardMaterial({
                        color: `${computerColor}`
                        // map: textureLoader.load(wood)
                    });
                    let tokenSquare = new THREE.Mesh(tokenSquareGeometry, tokenSquareMaterial);
                    this.scene.add(tokenSquare);
                    tokenSquare.position.set(-20 + (2.5 * i), 0, 20);
                    tokenSquare.receiveShadow = true;
                    tokenSquare.castShadow = true;
                    tokenSquare.name = `${[i, j]}`
                } else if (square.type === "token") {
                    let tokenSquareGeometry = new THREE.BoxGeometry(3.5, 2, 3.5);
                    let tokenSquareMaterial = new THREE.MeshStandardMaterial({
                        color: 0xA47449
                        // map: textureLoader.load(wood)
                    });
                    let tokenSquare = new THREE.Mesh(tokenSquareGeometry, tokenSquareMaterial);
                    this.scene.add(tokenSquare);
                    tokenSquare.position.set(-20 + (2.5 * i), 0, -20 + (2.5 * j));
                    tokenSquare.receiveShadow = true;
                    tokenSquare.castShadow = true;
                    tokenSquare.name = `${[i, j]}`
                } else if (square.type === "fence") {
                    //DO NOTHING?
                } else if (square.type === "node") {
                    let nodeGeometry = new THREE.BoxGeometry(1, 5, 1);
                    let nodeMaterial = new THREE.MeshStandardMaterial({
                        color: 0xFFFFFF
                        // map: textureLoader.load(wood)
                    });
                    let node = new THREE.Mesh(nodeGeometry, nodeMaterial);
                    this.scene.add(node);
                    node.position.set(-20 + (2.5 * i), 0, -20 + (2.5 * j));
                    node.receiveShadow = true;
                    node.castShadow = true;
                    node.name = `${[i, j]}`
                }
            })
        })

        //FENCE STABLE?

        //Mouse Position Listener
        const mousePosition = new THREE.Vector2();
        window.addEventListener('mousemove', function(e) {
            mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
        });
        const rayCaster = new THREE.Raycaster();

        const renderer = this.renderer
        //Window Resize
        window.addEventListener("resize", function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight)
        })
        
        //*****ANIMATION LOOP FOR RENDERED BOARD*****
        const scene = this.scene
        const interactionManager = this.interactionManager
        function animate() {
            rayCaster.setFromCamera(mousePosition, camera);
            const intersects = rayCaster.intersectObjects(scene.children);
            const displayRules = document.getElementById("rules")
            const displayAboutMe = document.getElementById("aboutMe")
            
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.id === rulesClickId && window.getComputedStyle(displayAboutMe, null).display === "none") {
                    displayRules.style.display = "flex"
                }
                if (intersects[i].object.id === aboutMeId  && window.getComputedStyle(displayRules, null).display === "none") {
                    displayAboutMe.style.display = "flex"
                }
            }

            tokenselector.rotation.y += 0.02

            interactionManager.update()

            renderer.render(scene, camera)
        }

        this.renderer.setAnimationLoop(animate);
        this.renderer.render(this.scene, camera)

       
    }

    buildLogo(square, rect) {
        let squares = []
        for (let i = 0; i < 18; i++) {
            squares.push(square.clone())
        }
        squares[0].position.set(-11, 7, -40) //F
        squares[1].position.set(-11, 5, -40) //F
        squares[2].position.set(-10, 7, -40) //F
        squares[3].position.set(-10, 5, -40) //F
        squares[4].position.set(-7, 7, -40) //E
        squares[5].position.set(-7, 5, -40) //E
        squares[6].position.set(-7, 3, -40) //E
        squares[7].position.set(-4, 6, -40) //N
        squares[8].position.set(-3, 5, -40) //N
        squares[9].position.set(-2, 4, -40) //N 
        squares[10].position.set(7, 7, -40) //E
        squares[11].position.set(7, 5, -40) //E
        squares[12].position.set(7, 3, -40) //E
        squares[13].position.set(9, 3, -40) //S
        squares[14].position.set(10, 3, -40) //S
        squares[15].position.set(10, 5, -40) //S
        squares[16].position.set(10, 7, -40) //S
        squares[17].position.set(11, 7, -40) //S
        
        squares.forEach(square => this.scene.add(square))
        
        let rectangles = []
        for (let j = 0; j < 15; j++) {
            rectangles.push(rect.clone())
        }
        rectangles[0].position.set(-12, 4, -40) //F
        rectangles[1].position.set(-12, 6, -40) //F
        rectangles[2].position.set(-8, 4, -40) //E
        rectangles[3].position.set(-8, 6, -40) //E
        rectangles[4].position.set(-5, 4, -40) //N
        rectangles[5].position.set(-5, 6, -40) //N
        rectangles[6].position.set(-1, 4, -40) //N
        rectangles[7].position.set(-1, 6, -40) //N
        rectangles[8].position.set(1, 5, -40) //C
        rectangles[9].position.set(3, 7, -40) //C
        rectangles[9].rotation.z = Math.PI / 2 //C
        rectangles[10].position.set(3, 3, -40) //C
        rectangles[10].rotation.z = Math.PI / 2 //C
        rectangles[11].position.set(6, 4, -40) //E
        rectangles[12].position.set(6, 6, -40) //E
        rectangles[13].position.set(9, 6, -40) //S
        rectangles[14].position.set(11, 4, -40) //S

        rectangles.forEach(rectangle => this.scene.add(rectangle))
    }

    buildRules(rules) {
        let rulesquares = []
        for (let i = 0; i < 27; i++) {
            rulesquares.push(rules.clone())
        }
        rulesquares[0].position.set(-16, 3, -31) //r
        rulesquares[1].position.set(-16, 2, -31) //r
        rulesquares[2].position.set(-16, 1, -31) //r
        rulesquares[3].position.set(-15, 3, -31) //r
        rulesquares[4].position.set(-13.5, 3, -31) //u
        rulesquares[5].position.set(-13.5, 2, -31) //u
        rulesquares[6].position.set(-13.5, 1, -31) //u 
        rulesquares[7].position.set(-13.5, 1, -31) //u
        rulesquares[8].position.set(-12.5, 1, -31) //u
        rulesquares[9].position.set(-11.5, 1, -31) //u
        rulesquares[10].position.set(-11.5, 2, -31) //u
        rulesquares[11].position.set(-11.5, 3, -31) //u
        rulesquares[12].position.set(-10, 4, -31) //l
        rulesquares[13].position.set(-10, 3, -31) //l
        rulesquares[14].position.set(-10, 2, -31) //l
        rulesquares[15].position.set(-10, 1, -31) //l
        rulesquares[16].position.set(-8.5, 2.5, -31) //e
        rulesquares[17].position.set(-8.5, 1.5, -31) //e
        rulesquares[18].position.set(-7.5, 3.5, -31) //e
        rulesquares[19].position.set(-7.5, 2, -31) //e
        rulesquares[20].position.set(-8, .25, -31) //e
        rulesquares[21].position.set(-6.5, 2.75, -31) //e
        rulesquares[22].position.set(-7.25, .25, -31) //e
        rulesquares[23].position.set(-5, 2.5, -31) //s
        rulesquares[24].position.set(-5, .5, -31) //s
        rulesquares[25].position.set(-4, 1.5, -31) //s
        rulesquares[26].position.set(-4, 3.5, -31) //s

        rulesquares.forEach(square => this.scene.add(square))
    }

    buildNewGame(newGame) {
        let news = []
        for (let i = 0; i < 26; i++) {
            news.push(newGame.clone())
        }
        news[0].position.set(4, 3, -31) //n
        news[1].position.set(4, 2, -31) //n
        news[2].position.set(4, 1, -31) //n
        news[3].position.set(5, 3, -31) //n
        news[4].position.set(6, 3, -31) //n
        news[5].position.set(6, 2, -31) //n
        news[6].position.set(6, 1, -31) //n
        news[7].position.set(7.5, 2.5, -31) //e
        news[8].position.set(7.5, 1.5, -31) //e
        news[9].position.set(8.5, 3.5, -31) //e
        news[10].position.set(8.5, 2, -31) //e
        news[11].position.set(8, .25, -31) //e
        news[12].position.set(9.5, 2.75, -31) //e
        news[13].position.set(8.5, .25, -31) //e
        news[14].position.set(11, 3, -31) //w
        news[15].position.set(11.5, 2, -31) //w
        news[16].position.set(12, 1, -31) //w
        news[17].position.set(13, 2, -31) //w
        news[18].position.set(14, 1, -31) //w
        news[19].position.set(14.5, 2, -31) //w
        news[13].position.set(15, 3, -31) //w

        news.forEach(square => {
            this.scene.add(square)
            square.visible = false
            square.name = "news"
        });
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


    validPlayerFence(startNode) { 

        const fencePlacements = [
            [[1, 0], [3, 0]],
            [[-1, 0], [-3, 0]],
            [[0, 1], [0, 3]],
            [[0, -1], [0, -3]] 
        ]

        const midNodePlacements = [
            [2, 0], [-2, 0], [0, 2], [0, -2]
        ]

        const endNodePlacements = [
            [4, 0], [-4, 0], [0, 4], [0, -4]
        ]
        
        const validFences = []

        for (let i = 0; i < 4; i++) {            

            let fencePlacement = [
                [startNode[0] + fencePlacements[i][0][0],
                startNode[1] + fencePlacements[i][0][1]],
                [startNode[0] + fencePlacements[i][1][0],
                startNode[1] + fencePlacements[i][1][1]]
            ]

            let midNode = [
                startNode[0] + midNodePlacements[i][0],
                startNode[1] + midNodePlacements[i][1]
            ]

            let endNode = [
                startNode[0] + endNodePlacements[i][0],
                startNode[1] + endNodePlacements[i][1]
            ]

            if (endNode[0] < 0 || endNode[1] < 0 || endNode[0] > 16 || endNode[1] > 16) {
                endNode = false
            }
           

            let inbounds = true
            let free = true
            let notCrossing = true
            let solvable = true
            let validFence

            if (startNode[0] < 0 || startNode[0] > 16 || startNode[1] < 0 || startNode[1] > 16) {
                inbounds = false
            } else if (midNode[0] < 0 || midNode[0] > 16 || midNode[1] < 0 || midNode[1] > 16) {
                inbounds = false
            } else if (this.getSquare(fencePlacement[0]).filled() || this.getSquare(fencePlacement[1]).filled()) {
                free = false
            } else if (this.getSquare(midNode).holds.includes("MID")) {
                notCrossing = false
            } else if (!this.solvable(startNode, fencePlacement)){
                   solvable = false
            }

            if (inbounds && free && notCrossing && solvable) {
                validFence = {
                    "fences": fencePlacement,
                    "startNode": startNode,
                    "midNode": midNode,
                    "endNode": endNode
                }
                validFences.push(validFence)
            }
        }
    
        return validFences
    }
    validComputerFence(nodes) {
        let startNode
        let midNode

        const fencePlacements = [
            [[1, 0], [3, 0]],
            [[-1, 0], [-3, 0]],
            [[0, 1], [0, 3]],
            [[0, -1], [0, -3]] 
        ]

        // const midNodePlacements = [
        //     [2, 0], [-2, 0], [0, 2], [0, -2]
        // ]

        const endNodePlacements = [
            [4, 0], [-4, 0], [0, 4], [0, -4]
        ]
        
        const validFences = []

        for (let i = 0; i < 2; i++) {
            if (i === 0) {
                startNode = nodes[0]
                midNode = nodes[1]
            } else {
                startNode = nodes[1]
                midNode = nodes[0]
            }
            

            let fencePlacement = [
                [startNode[0] + fencePlacements[i][0][0],
                startNode[1] + fencePlacements[i][0][1]],
                [startNode[0] + fencePlacements[i][1][0],
                startNode[1] + fencePlacements[i][1][1]]
            ]

            // let midNode = [
            //     nodePos[0] + midNodePlacements[i][0],
            //     nodePos[1] + midNodePlacements[i][1]
            // ]

            let endNode = [
                startNode[0] + endNodePlacements[i][0],
                startNode[1] + endNodePlacements[i][1]
            ]

            if (endNode[0] < 0 || endNode[1] < 0 || endNode[0] > 16 || endNode[1] > 16) {
                endNode = false
            }
           

            let inbounds = true
            let free = true
            let notCrossing = true
            let solvable = true
            let validFence

            if (startNode[0] < 0 || startNode[0] > 16 || startNode[1] < 0 || startNode[1] > 16) {
                inbounds = false
            } else if (midNode[0] < 0 || midNode[0] > 16 || midNode[1] < 0 || midNode[1] > 16) {
                inbounds = false
            } else if (this.getSquare(fencePlacement[0]).filled() || this.getSquare(fencePlacement[1]).filled()) {
                free = false
            } else if (this.getSquare(midNode).holds.includes("MID")) {
                notCrossing = false
            } else if (!this.solvable(startNode, fencePlacement)){
                   solvable = false
            }

            if (inbounds && free && notCrossing && solvable) {
                validFence = {
                    "fences": fencePlacement,
                    "startNode": startNode,
                    "midNode": midNode,
                    "endNode": endNode
                }
                validFences.push(validFence)
            }
        }
    
        return validFences
    }
        //if fence move, dupes grid, places fence, and checkes that grid is still solveable for both players.
        // #gridDup(grid), #solveforPlayer(player)

    buildFence(player) {
        const fenceGeometry = new THREE.BoxGeometry(1, 5, 9)
        const fenceMaterial = new THREE.MeshStandardMaterial({
            color: player.color
            // map: textureLoader.load(wood)
        })
        const fence = new THREE.Mesh(fenceGeometry, fenceMaterial)
        this.scene.add(fence)
        fence.castShadow = true;
        fence.receiveShadow = true;
        return fence
    }
    //TO DO: ADD DFS to check solvability
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

 //***RENDER HTML GAME*****//

        // this.grid.forEach( (row, i) => {
        //     let gameBoard = document.getElementById("gameBoard")
        //     let renderRow = document.createElement("ul")

        //     row.forEach( square => {
                
        //         if (square.type === "token") {
        //             if (square.holds.length) {
        //                 let tokenStart = this.buildSpace("li", "playerSquare", square.pos)
        //                 let token = document.createElement("div")
        //                 token.setAttribute("class", "token")
        //                 token.style.backgroundColor = square.getToken().color
        //                 tokenStart.appendChild(token)
        //                 renderRow.appendChild(tokenStart)
        //             } else {
        //                 let emptySquare = this.buildSpace("li", "square", square.pos)
        //                 renderRow.appendChild(emptySquare)
        //             }
        //         } else if (square.type === "fence" && i % 2 === 0) {
        //             let fenceSpace = this.buildSpace("li", "verticalFence", square.pos)
        //             if (square.holds.length) {
        //                 fenceSpace.style.backgroundColor = square.holds[0]
        //             }
        //             renderRow.appendChild(fenceSpace)             
        //         } else if (square.type === "fence") {
        //             let fenceSpace = this.buildSpace("li", "horizontalFence", square.pos)
        //             if (square.holds.length) {
        //                 fenceSpace.style.backgroundColor = square.holds[0]
        //             }
        //             renderRow.appendChild(fenceSpace)                    
        //         } else {
        //             let nodeSpace = this.buildSpace("li", "node", square.pos)
        //             renderRow.appendChild(nodeSpace)                   
        //         }
        //     })
        //     gameBoard.appendChild(renderRow)
        // })
    

        // this.players.forEach( player => {
        //     let fenceBox

        //     if (player instanceof HumanPlayer) {
        //         fenceBox = document.getElementById("humanPlayerFences")
        //     } else {
        //         fenceBox = document.getElementById("computerPlayerFences")
        //     }

        //     while (fenceBox.firstChild) {
        //         fenceBox.removeChild(fenceBox.firstChild)
        //     }
            
        //     let fences = player.fences.length
            
        //     for (let i = 0; i < fences; i++) {
        //         let fence = document.createElement("li")
        //         fence.style.backgroundColor = player.color
        //         fenceBox.appendChild(fence)
        //     }
        // })