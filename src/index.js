import Game from "./scripts/Game";

let game = new Game()

const windowHeight = window.visualViewport.height
const windowWidth = window.visualViewport.width
const isMobile = navigator.userAgentData.mobile;

const rules = document.getElementById("rules")
if (isMobile) {
  const mobileView = document.getElementById("isMobile")
  mobileView.innerText = "THANKS FOR CHECKING OUT MY GAME. AT THE MOMENT, FENCES IS BEST PLAYED ON YOUR COMPUTER OR LAPTOP. IF YOU WANT TO HIRE ME, MAYBE I CAN AFFORD TO DEVELOP THE MOBILE VERSION ;)"
  mobileView.style.color = "#E20032"
}
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
    //   console.log(cameraReset)
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