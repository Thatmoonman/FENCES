import Game from "./scripts/Game";
import renderThree from "./scripts/threejs/threeJS";

let game = new Game()

const rules = document.getElementById("rules")
const closeRules = document.getElementsByClassName("closeRules")[0]
closeRules.addEventListener("submit", (e) => {
    e.preventDefault();
    rules.style.display = "none"
})

const aboutMe = document.getElementById("aboutMe")
const closeAboutMe = document.getElementsByClassName("closeAboutMe")[0]
closeAboutMe.addEventListener("submit", (e) => {
    e.preventDefault();
    aboutMe.style.display = "none"
})

const newGame = document.getElementById("newGame")
newGame.addEventListener("click", () => {
    newGame.style.display = "none"
    const canvas = document.getElementsByTagName("canvas")[0]
    canvas.remove()
    return game.reset()
})

document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
      let cameraReset = game.board.camera.object
      let renderer = game.board.renderer
      console.log(cameraReset)
      game.board.camera.reset()
      cameraReset.position.set(0, 50, 50)
      game.board.camera.update()
      
    }
  }

// const scene =  game.board.scene.children
// let newGameClick
// for (let i = 0; i < scene.length; i++) {
//     if (scene[i].name === "newGameClick") {newGameClick = scene[i]}
// }
// newGameClick.addEventListener("click", startNewGame)

//DEV: COMMENT BACK IN IF "DEFER" BREAKS
// document.addEventListener("DOMContentLoaded", () => {
    // renderThree()
    // game.board.render()
// })