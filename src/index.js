import Game from "./scripts/Game";
import renderThree from "./scripts/threeJS";

document.addEventListener("DOMContentLoaded", () => {
    renderThree()


    const game = new Game()
    game.board.render()

    game.gameTurn()


})