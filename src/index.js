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
    game.reset()
})

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