/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _scripts_Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scripts/Game */ \"./src/scripts/Game.js\");\n\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n  const game = new _scripts_Game__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n  game.board.render();\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMuanMiLCJtYXBwaW5ncyI6Ijs7QUFBa0M7QUFFbENDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsTUFBTTtFQUNoRCxNQUFNQyxJQUFJLEdBQUcsSUFBSUgscURBQUksRUFBRTtFQUN2QkcsSUFBSSxDQUFDQyxLQUFLLENBQUNDLE1BQU0sRUFBRTtBQUN2QixDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mZW5jZXMvLi9zcmMvaW5kZXguanM/YjYzNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2FtZSBmcm9tIFwiLi9zY3JpcHRzL0dhbWVcIjtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpXG4gICAgZ2FtZS5ib2FyZC5yZW5kZXIoKVxufSkiXSwibmFtZXMiOlsiR2FtZSIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImdhbWUiLCJib2FyZCIsInJlbmRlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/index.js\n");

/***/ }),

/***/ "./src/scripts/Board.js":
/*!******************************!*\
  !*** ./src/scripts/Board.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Board; }\n/* harmony export */ });\n/* harmony import */ var _Square__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Square */ \"./src/scripts/Square.js\");\n/* harmony import */ var _Piece__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Piece */ \"./src/scripts/Piece.js\");\n\n\nclass Board {\n  constructor() {\n    this.grid = [];\n    this.buildBoard();\n  }\n  buildBoard() {\n    for (let i = 0; i < 17; i++) {\n      let row = [];\n      for (let j = 0; j < 17; j++) {\n        let pos = [j, i];\n        let type = \"\";\n        let iEven = (i + 2) % 2 === 0;\n        let jEven = (j + 2) % 2 === 0;\n        if (iEven && jEven) {\n          type = \"token\";\n        } else if (iEven && !jEven || !iEven && jEven) {\n          type = \"fence\";\n        } else {\n          type = \"node\";\n        }\n        let square = new _Square__WEBPACK_IMPORTED_MODULE_0__[\"default\"](pos, type);\n        row.push(square);\n      }\n      this.grid.push(row);\n    }\n  }\n  fillGrid(humanPlayer, computerPlayer) {\n    const playerStart = this.grid[16][8];\n    const playerToken = new _Piece__WEBPACK_IMPORTED_MODULE_1__[\"default\"](humanPlayer.color, [16, 8]);\n    playerStart.holds.push(playerToken);\n    const computerStart = this.grid[0][8];\n    const computerToken = new _Piece__WEBPACK_IMPORTED_MODULE_1__[\"default\"](computerPlayer.color, [0, 8]);\n    computerStart.holds.push(computerToken);\n  }\n  render() {\n    this.grid.forEach((row, i) => {\n      let gameBoard = document.getElementById(\"gameBoard\");\n      let renderRow = document.createElement(\"ul\");\n      row.forEach(square => {\n        if (square.type === \"token\") {\n          if (square.holds.length) {\n            let tokenStart = document.createElement(\"li\");\n            tokenStart.innerText = square.token();\n            tokenStart.setAttribute(\"class\", \"square\");\n            renderRow.appendChild(tokenStart);\n          } else {\n            let emptySquare = document.createElement(\"li\");\n            emptySquare.setAttribute(\"class\", \"square\");\n            renderRow.appendChild(emptySquare);\n          }\n        } else if (square.type === \"fence\" && i % 2 === 0) {\n          let fencePath = document.createElement(\"li\");\n          fencePath.setAttribute(\"class\", \"verticalFence\");\n          renderRow.appendChild(fencePath);\n        } else if (square.type === \"fence\") {\n          let fencePath = document.createElement(\"li\");\n          fencePath.setAttribute(\"class\", \"horizontalFence\");\n          renderRow.appendChild(fencePath);\n        } else {\n          let fenceNode = document.createElement(\"li\");\n          fenceNode.setAttribute(\"class\", \"node\");\n          renderRow.appendChild(fenceNode);\n        }\n      });\n      gameBoard.appendChild(renderRow);\n    });\n  }\n  getSquare(pos) {\n    let posX = pos[0];\n    let posY = pos[1];\n    return this.grid[posX][posY];\n  }\n  moveToken(newPos) {\n    this.grid.getSquare().holds();\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVMsQ0FBQztJQUNwQyxDQUFDLENBQUM7RUFDTjtFQUVBVyxTQUFTLENBQUMvQixHQUFHLEVBQUU7SUFDWCxJQUFJZ0MsSUFBSSxHQUFHaEMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqQixJQUFJaUMsSUFBSSxHQUFHakMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqQixPQUFPLElBQUksQ0FBQ0wsSUFBSSxDQUFDcUMsSUFBSSxDQUFDLENBQUNDLElBQUksQ0FBQztFQUNoQztFQUVBQyxTQUFTLENBQUNDLE1BQU0sRUFBRTtJQUNkLElBQUksQ0FBQ3hDLElBQUksQ0FBQ29DLFNBQVMsRUFBRSxDQUFDbkIsS0FBSyxFQUFFO0VBQ2pDO0FBQ0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mZW5jZXMvLi9zcmMvc2NyaXB0cy9Cb2FyZC5qcz9lZThiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTcXVhcmUgZnJvbSBcIi4vU3F1YXJlXCJcbmltcG9ydCBQaWVjZSBmcm9tIFwiLi9QaWVjZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ncmlkID0gW11cbiAgICAgICAgdGhpcy5idWlsZEJvYXJkKClcbiAgICB9XG5cbiAgICBidWlsZEJvYXJkKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCA7IGkgPCAxNzsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gW11cblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxNzsgaisrKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgcG9zID0gW2osIGldXG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBcIlwiXG4gICAgICAgICAgICAgICAgbGV0IGlFdmVuID0gKGkgKyAyKSAlIDIgPT09IDAgXG4gICAgICAgICAgICAgICAgbGV0IGpFdmVuID0gKGogKyAyKSAlIDIgPT09IDBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoaUV2ZW4gJiYgakV2ZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IFwidG9rZW5cIlxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaUV2ZW4gJiYgIWpFdmVuIHx8ICFpRXZlbiAmJiBqRXZlbikge1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gXCJmZW5jZVwiXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IFwibm9kZVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBzcXVhcmUgPSBuZXcgU3F1YXJlKHBvcywgdHlwZSlcbiAgICAgICAgICAgICAgICByb3cucHVzaChzcXVhcmUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdyaWQucHVzaChyb3cpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsR3JpZChodW1hblBsYXllciwgY29tcHV0ZXJQbGF5ZXIpIHtcbiAgICAgICAgY29uc3QgcGxheWVyU3RhcnQgPSB0aGlzLmdyaWRbMTZdWzhdXG4gICAgICAgIGNvbnN0IHBsYXllclRva2VuID0gbmV3IFBpZWNlKGh1bWFuUGxheWVyLmNvbG9yLCBbMTYsIDhdKVxuICAgICAgICBwbGF5ZXJTdGFydC5ob2xkcy5wdXNoKHBsYXllclRva2VuKVxuXG4gICAgICAgIGNvbnN0IGNvbXB1dGVyU3RhcnQgPSB0aGlzLmdyaWRbMF1bOF1cbiAgICAgICAgY29uc3QgY29tcHV0ZXJUb2tlbiA9IG5ldyBQaWVjZShjb21wdXRlclBsYXllci5jb2xvciwgWzAsIDhdKVxuICAgICAgICBjb21wdXRlclN0YXJ0LmhvbGRzLnB1c2goY29tcHV0ZXJUb2tlbilcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ncmlkLmZvckVhY2goIChyb3csIGkpID0+IHtcbiAgICAgICAgICAgIGxldCBnYW1lQm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVCb2FyZFwiKVxuICAgICAgICAgICAgbGV0IHJlbmRlclJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKVxuXG4gICAgICAgICAgICByb3cuZm9yRWFjaCggc3F1YXJlID0+IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoc3F1YXJlLnR5cGUgPT09IFwidG9rZW5cIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3F1YXJlLmhvbGRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRva2VuU3RhcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuU3RhcnQuaW5uZXJUZXh0ID0gc3F1YXJlLnRva2VuKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuU3RhcnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJzcXVhcmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJvdy5hcHBlbmRDaGlsZCh0b2tlblN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVtcHR5U3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbXB0eVNxdWFyZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInNxdWFyZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUm93LmFwcGVuZENoaWxkKGVtcHR5U3F1YXJlKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzcXVhcmUudHlwZSA9PT0gXCJmZW5jZVwiICYmIGkgJSAyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmZW5jZVBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICAgICAgICAgICAgICAgICAgZmVuY2VQYXRoLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwidmVydGljYWxGZW5jZVwiKVxuICAgICAgICAgICAgICAgICAgICByZW5kZXJSb3cuYXBwZW5kQ2hpbGQoZmVuY2VQYXRoKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3F1YXJlLnR5cGUgPT09IFwiZmVuY2VcIikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmVuY2VQYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgICAgICAgICAgICAgICAgIGZlbmNlUGF0aC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImhvcml6b250YWxGZW5jZVwiKVxuICAgICAgICAgICAgICAgICAgICByZW5kZXJSb3cuYXBwZW5kQ2hpbGQoZmVuY2VQYXRoKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmZW5jZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICAgICAgICAgICAgICAgICAgZmVuY2VOb2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibm9kZVwiKVxuICAgICAgICAgICAgICAgICAgICByZW5kZXJSb3cuYXBwZW5kQ2hpbGQoZmVuY2VOb2RlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBnYW1lQm9hcmQuYXBwZW5kQ2hpbGQocmVuZGVyUm93KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdldFNxdWFyZShwb3MpIHtcbiAgICAgICAgbGV0IHBvc1ggPSBwb3NbMF1cbiAgICAgICAgbGV0IHBvc1kgPSBwb3NbMV1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZFtwb3NYXVtwb3NZXVxuICAgIH1cblxuICAgIG1vdmVUb2tlbihuZXdQb3MpIHtcbiAgICAgICAgdGhpcy5ncmlkLmdldFNxdWFyZSgpLmhvbGRzKClcbiAgICB9XG59XG5cbiJdLCJuYW1lcyI6WyJTcXVhcmUiLCJQaWVjZSIsIkJvYXJkIiwiY29uc3RydWN0b3IiLCJncmlkIiwiYnVpbGRCb2FyZCIsImkiLCJyb3ciLCJqIiwicG9zIiwidHlwZSIsImlFdmVuIiwiakV2ZW4iLCJzcXVhcmUiLCJwdXNoIiwiZmlsbEdyaWQiLCJodW1hblBsYXllciIsImNvbXB1dGVyUGxheWVyIiwicGxheWVyU3RhcnQiLCJwbGF5ZXJUb2tlbiIsImNvbG9yIiwiaG9sZHMiLCJjb21wdXRlclN0YXJ0IiwiY29tcHV0ZXJUb2tlbiIsInJlbmRlciIsImZvckVhY2giLCJnYW1lQm9hcmQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicmVuZGVyUm93IiwiY3JlYXRlRWxlbWVudCIsImxlbmd0aCIsInRva2VuU3RhcnQiLCJpbm5lclRleHQiLCJ0b2tlbiIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwiZW1wdHlTcXVhcmUiLCJmZW5jZVBhdGgiLCJmZW5jZU5vZGUiLCJnZXRTcXVhcmUiLCJwb3NYIiwicG9zWSIsIm1vdmVUb2tlbiIsIm5ld1BvcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/scripts/Board.js\n");

/***/ }),

/***/ "./src/scripts/Game.js":
/*!*****************************!*\
  !*** ./src/scripts/Game.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Game; }\n/* harmony export */ });\n/* harmony import */ var _Board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Board */ \"./src/scripts/Board.js\");\n/* harmony import */ var _computerPlayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_computerPlayer */ \"./src/scripts/_computerPlayer.js\");\n/* harmony import */ var _humanPlayer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_humanPlayer */ \"./src/scripts/_humanPlayer.js\");\n\n\n\nclass Game {\n  constructor() {\n    let playerColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : \"Red\";\n    let computerColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : \"Blue\";\n    this.board = new _Board__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    const humanPlayer = new _humanPlayer__WEBPACK_IMPORTED_MODULE_2__[\"default\"](playerColor);\n    const computerPlayer = new _computerPlayer__WEBPACK_IMPORTED_MODULE_1__[\"default\"](computerColor);\n    this.newGame(humanPlayer, computerPlayer);\n  }\n  newGame(humanPlayer, computerPlayer) {\n    this.board.fillGrid(humanPlayer, computerPlayer);\n  }\n}\n\n// let g = new Game()\n// g.board.render()\n// console.log(g.board.board[0][8].token())//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9HYW1lLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBMkI7QUFDbUI7QUFDTjtBQUV6QixNQUFNRyxJQUFJLENBQUM7RUFDdEJDLFdBQVcsR0FBMEM7SUFBQSxJQUF6Q0MsV0FBVyx1RUFBQyxLQUFLO0lBQUEsSUFBRUMsYUFBYSx1RUFBQyxNQUFNO0lBQy9DLElBQUksQ0FBQ0MsS0FBSyxHQUFHLElBQUlQLDhDQUFLLEVBQUU7SUFDeEIsTUFBTVEsV0FBVyxHQUFHLElBQUlOLG9EQUFXLENBQUNHLFdBQVcsQ0FBQztJQUNoRCxNQUFNSSxjQUFjLEdBQUcsSUFBSVIsdURBQWMsQ0FBQ0ssYUFBYSxDQUFDO0lBQ3hELElBQUksQ0FBQ0ksT0FBTyxDQUFDRixXQUFXLEVBQUVDLGNBQWMsQ0FBQztFQUM3QztFQUVBQyxPQUFPLENBQUNGLFdBQVcsRUFBRUMsY0FBYyxFQUFFO0lBQ2pDLElBQUksQ0FBQ0YsS0FBSyxDQUFDSSxRQUFRLENBQUNILFdBQVcsRUFBRUMsY0FBYyxDQUFDO0VBQ3BEO0FBQ0o7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmVuY2VzLy4vc3JjL3NjcmlwdHMvR2FtZS5qcz85Nzc0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCb2FyZCBmcm9tIFwiLi9Cb2FyZFwiXG5pbXBvcnQgQ29tcHV0ZXJQbGF5ZXIgZnJvbSBcIi4vX2NvbXB1dGVyUGxheWVyXCJcbmltcG9ydCBIdW1hblBsYXllciBmcm9tIFwiLi9faHVtYW5QbGF5ZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXJDb2xvcj1cIlJlZFwiLCBjb21wdXRlckNvbG9yPVwiQmx1ZVwiKSB7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBuZXcgQm9hcmQoKVxuICAgICAgICBjb25zdCBodW1hblBsYXllciA9IG5ldyBIdW1hblBsYXllcihwbGF5ZXJDb2xvcilcbiAgICAgICAgY29uc3QgY29tcHV0ZXJQbGF5ZXIgPSBuZXcgQ29tcHV0ZXJQbGF5ZXIoY29tcHV0ZXJDb2xvcilcbiAgICAgICAgdGhpcy5uZXdHYW1lKGh1bWFuUGxheWVyLCBjb21wdXRlclBsYXllcilcbiAgICB9XG5cbiAgICBuZXdHYW1lKGh1bWFuUGxheWVyLCBjb21wdXRlclBsYXllcikge1xuICAgICAgICB0aGlzLmJvYXJkLmZpbGxHcmlkKGh1bWFuUGxheWVyLCBjb21wdXRlclBsYXllcilcbiAgICB9XG59XG5cbi8vIGxldCBnID0gbmV3IEdhbWUoKVxuLy8gZy5ib2FyZC5yZW5kZXIoKVxuLy8gY29uc29sZS5sb2coZy5ib2FyZC5ib2FyZFswXVs4XS50b2tlbigpKVxuIl0sIm5hbWVzIjpbIkJvYXJkIiwiQ29tcHV0ZXJQbGF5ZXIiLCJIdW1hblBsYXllciIsIkdhbWUiLCJjb25zdHJ1Y3RvciIsInBsYXllckNvbG9yIiwiY29tcHV0ZXJDb2xvciIsImJvYXJkIiwiaHVtYW5QbGF5ZXIiLCJjb21wdXRlclBsYXllciIsIm5ld0dhbWUiLCJmaWxsR3JpZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/scripts/Game.js\n");

/***/ }),

/***/ "./src/scripts/Piece.js":
/*!******************************!*\
  !*** ./src/scripts/Piece.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Piece; }\n/* harmony export */ });\nclass Piece {\n  constructor(color, pos) {\n    this.color = color;\n    this.pos = pos;\n  }\n  toString() {\n    return this.color[0].toUpperCase();\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9QaWVjZS5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQ2UsTUFBTUEsS0FBSyxDQUFDO0VBQ3ZCQyxXQUFXLENBQUNDLEtBQUssRUFBRUMsR0FBRyxFQUFFO0lBQ3BCLElBQUksQ0FBQ0QsS0FBSyxHQUFHQSxLQUFLO0lBQ2xCLElBQUksQ0FBQ0MsR0FBRyxHQUFHQSxHQUFHO0VBQ2xCO0VBRUFDLFFBQVEsR0FBRztJQUNQLE9BQU8sSUFBSSxDQUFDRixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUNHLFdBQVcsRUFBRTtFQUN0QztBQUNKIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmVuY2VzLy4vc3JjL3NjcmlwdHMvUGllY2UuanM/ODljNSJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBpZWNlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb2xvciwgcG9zKSB7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvclxuICAgICAgICB0aGlzLnBvcyA9IHBvc1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xvclswXS50b1VwcGVyQ2FzZSgpXG4gICAgfVxufSJdLCJuYW1lcyI6WyJQaWVjZSIsImNvbnN0cnVjdG9yIiwiY29sb3IiLCJwb3MiLCJ0b1N0cmluZyIsInRvVXBwZXJDYXNlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/scripts/Piece.js\n");

/***/ }),

/***/ "./src/scripts/Player.js":
/*!*******************************!*\
  !*** ./src/scripts/Player.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Player; }\n/* harmony export */ });\nclass Player {\n  constructor(color) {\n    this.color = color;\n    this.fences = [];\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9QbGF5ZXIuanMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUNlLE1BQU1BLE1BQU0sQ0FBQztFQUN4QkMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDZixJQUFJLENBQUNBLEtBQUssR0FBR0EsS0FBSztJQUNsQixJQUFJLENBQUNDLE1BQU0sR0FBRyxFQUFFO0VBQ3BCO0FBQ0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mZW5jZXMvLi9zcmMvc2NyaXB0cy9QbGF5ZXIuanM/OWE4NyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yXG4gICAgICAgIHRoaXMuZmVuY2VzID0gW11cbiAgICB9XG59Il0sIm5hbWVzIjpbIlBsYXllciIsImNvbnN0cnVjdG9yIiwiY29sb3IiLCJmZW5jZXMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/scripts/Player.js\n");

/***/ }),

/***/ "./src/scripts/Square.js":
/*!*******************************!*\
  !*** ./src/scripts/Square.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Square; }\n/* harmony export */ });\n/* harmony import */ var _Piece__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Piece */ \"./src/scripts/Piece.js\");\n\nclass Square {\n  constructor(pos, type) {\n    this.pos = pos;\n    this.type = type;\n    this.holds = [];\n  }\n  token() {\n    return this.holds[0].toString();\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9TcXVhcmUuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBMkI7QUFFWixNQUFNQyxNQUFNLENBQUM7RUFDeEJDLFdBQVcsQ0FBQ0MsR0FBRyxFQUFFQyxJQUFJLEVBQUU7SUFDbkIsSUFBSSxDQUFDRCxHQUFHLEdBQUdBLEdBQUc7SUFDZCxJQUFJLENBQUNDLElBQUksR0FBR0EsSUFBSTtJQUNoQixJQUFJLENBQUNDLEtBQUssR0FBRyxFQUFFO0VBQ25CO0VBRUFDLEtBQUssR0FBRztJQUNKLE9BQU8sSUFBSSxDQUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUNFLFFBQVEsRUFBRTtFQUNuQztBQUdKIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmVuY2VzLy4vc3JjL3NjcmlwdHMvU3F1YXJlLmpzP2QyMWMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBpZWNlIGZyb20gXCIuL1BpZWNlXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlIHtcbiAgICBjb25zdHJ1Y3Rvcihwb3MsIHR5cGUpIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3NcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZVxuICAgICAgICB0aGlzLmhvbGRzID0gW11cbiAgICB9XG5cbiAgICB0b2tlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG9sZHNbMF0udG9TdHJpbmcoKVxuICAgIH1cblxuICAgIFxufSJdLCJuYW1lcyI6WyJQaWVjZSIsIlNxdWFyZSIsImNvbnN0cnVjdG9yIiwicG9zIiwidHlwZSIsImhvbGRzIiwidG9rZW4iLCJ0b1N0cmluZyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/scripts/Square.js\n");

/***/ }),

/***/ "./src/scripts/_computerPlayer.js":
/*!****************************************!*\
  !*** ./src/scripts/_computerPlayer.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ ComputerPlayer; }\n/* harmony export */ });\n/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ \"./src/scripts/Player.js\");\n\nclass ComputerPlayer extends _Player__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(color) {\n    // super(fences, fences)\n    super(color, color);\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9fY29tcHV0ZXJQbGF5ZXIuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBOEI7QUFHZixNQUFNQyxjQUFjLFNBQVNELCtDQUFNLENBQUM7RUFDL0NFLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2Y7SUFDQSxLQUFLLENBQUNBLEtBQUssRUFBRUEsS0FBSyxDQUFDO0VBQ3ZCO0FBQ0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mZW5jZXMvLi9zcmMvc2NyaXB0cy9fY29tcHV0ZXJQbGF5ZXIuanM/YTBlNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXB1dGVyUGxheWVyIGV4dGVuZHMgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb2xvcikge1xuICAgICAgICAvLyBzdXBlcihmZW5jZXMsIGZlbmNlcylcbiAgICAgICAgc3VwZXIoY29sb3IsIGNvbG9yKVxuICAgIH1cbn0iXSwibmFtZXMiOlsiUGxheWVyIiwiQ29tcHV0ZXJQbGF5ZXIiLCJjb25zdHJ1Y3RvciIsImNvbG9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/scripts/_computerPlayer.js\n");

/***/ }),

/***/ "./src/scripts/_humanPlayer.js":
/*!*************************************!*\
  !*** ./src/scripts/_humanPlayer.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ HumanPlayer; }\n/* harmony export */ });\n/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ \"./src/scripts/Player.js\");\n\nclass HumanPlayer extends _Player__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(color) {\n    // super(fences, fences)\n    super(color, color);\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9faHVtYW5QbGF5ZXIuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBNkI7QUFFZCxNQUFNQyxXQUFXLFNBQVNELCtDQUFNLENBQUM7RUFDNUNFLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2Y7SUFDQSxLQUFLLENBQUNBLEtBQUssRUFBRUEsS0FBSyxDQUFDO0VBRXZCO0FBQ0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mZW5jZXMvLi9zcmMvc2NyaXB0cy9faHVtYW5QbGF5ZXIuanM/OTU4OCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh1bWFuUGxheWVyIGV4dGVuZHMgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb2xvcikge1xuICAgICAgICAvLyBzdXBlcihmZW5jZXMsIGZlbmNlcylcbiAgICAgICAgc3VwZXIoY29sb3IsIGNvbG9yKVxuXG4gICAgfVxufSJdLCJuYW1lcyI6WyJQbGF5ZXIiLCJIdW1hblBsYXllciIsImNvbnN0cnVjdG9yIiwiY29sb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/scripts/_humanPlayer.js\n");

/***/ }),

/***/ "./src/index.scss":
/*!************************!*\
  !*** ./src/index.scss ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguc2Nzcy5qcyIsIm1hcHBpbmdzIjoiO0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mZW5jZXMvLi9zcmMvaW5kZXguc2Nzcz85NzQ1Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/index.scss\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	__webpack_require__("./src/index.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.scss");
/******/ 	
/******/ })()
;