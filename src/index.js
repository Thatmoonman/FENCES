import Game from "./scripts/Game";
import renderThree from "./scripts/threeJS";

//DEV: COMMENT BACK IN IF "DEFER" BREAKS
// document.addEventListener("DOMContentLoaded", () => {
    renderThree()


    const game = new Game()
    game.board.render()

    game.gameTurn()


// })