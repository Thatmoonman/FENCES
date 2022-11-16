import Game from "./scripts/Game";
import renderThree from "./scripts/threejs/threeJS";

const game = new Game()

const rules = document.getElementById("rules")
const closeRules = document.getElementsByClassName("closeRules")[0]
closeRules.addEventListener("submit", (e) => {
    e.preventDefault();
    rules.style.display = "none"
})


//DEV: COMMENT BACK IN IF "DEFER" BREAKS
// document.addEventListener("DOMContentLoaded", () => {
    // renderThree()
    // game.board.render()
// })