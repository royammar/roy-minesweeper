'use strict'

var gLevel = {}
var gGame = {}
var gBoard = []
var MINE = '💣'
var gIsfirstclick = true
var gNumOfMines = 2
var FLAG = '🚩'
var SIZE = 4
gLevel = [{ SIZE: 4, MINES: 2 }, { SIZE: 8, MINES: 12 }, { SIZE: 12, MINES: 30 }]

var gBoard = buildBoard(gLevel[0].SIZE)
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}



function ChangeBoard(value){
    // debugger
    var updateSize=gLevel[value].SIZE
    gBoard = buildBoard(updateSize)
    gNumOfMines=gLevel[value].MINES

    init()
}





function init() {
    gGame.isOn = true

    renderBoard()

}

function buildBoard(gBoardSize) {

    var board = [];

    for (var i = 0; i < gBoardSize; i++) {
        board[i] = [];
        for (var j = 0; j < gBoardSize; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

            board[i][j] = cell;
        }
    }

    return board;

}

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        var cellContent = ''
        strHTML += '<tr>\n'
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isShown) {
                cellContent = (cell.isMine) ? MINE : cell.minesAroundCount;
            }
            if (cell.isMarked) cellContent = FLAG
            var className = (cell.isShown) ? '' : 'hide ';
            className += (cell.isMarked) ? 'mark ' : '';
            className += (cell.isMine) ? 'mine ' : 'number';

            strHTML += `\t<td   
            data-i=${i}  data-j=${j} 
            class="${className}"  oncontextmenu="cellMarked( ${i}, ${j},event)" onclick="cellClicked(this, ${i}, ${j},event)"  > ${cellContent}</td>\n`
            cellContent = ''
        }


        strHTML += '</tr>\n'

    }
    var elboard = document.querySelector('.board-container');
    elboard.innerHTML = strHTML;
    // console.log(strHTML);


}



function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {

            for (var index = i - 1; index <= i + 1; index++) {
                if (index < 0 || index >= gBoard.length) continue;
                for (var jIndex = j - 1; jIndex <= j + 1; jIndex++) {
                    if (jIndex < 0 || jIndex >= gBoard.length) continue;
                    if (index === i && jIndex === j) continue;
                    if (gBoard[index][jIndex].isMine)
                        gBoard[i][j].minesAroundCount++
                }
            }
        }
    }
}


function cellClicked(elCell, i, j, event) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j];
    if (gIsfirstclick) {
        gIsfirstclick = false
        cell.isShown = true
        placeMines(gNumOfMines)
        setMinesNegsCount()
        if (cell.minesAroundCount > 0) cell.isShown = true
        cell.isShown = false
        if (cell.minesAroundCount === 0) expandShown(i, j)
        cell.isShown = true
        renderBoard()
 
    }


    if (!cell.isShown) {
        if (!cell.isMine) {
            // gBoard[i][j].isShown = true
            // gGame.shownCount++
            if (cell.minesAroundCount === 0) expandShown(i, j)
            if (cell.minesAroundCount > 0) cell.isShown = true
            renderBoard()
            checkGameOver()
            
        }
        else {
            gGame.isOn = false
            showAllMines()
        }
    }


}


function placeMines(numOfMines) {

    var emptyCells = []
    var rndCell = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) emptyCells.push({ i: i, j: j })
        }
    }
    emptyCells.sort(function (a, b) { return 0.5 - Math.random() });
    for (var i = 0; i < numOfMines; i++) {
        rndCell = emptyCells.pop()
        gBoard[rndCell.i][rndCell.j].isMine = true

    }

}



function showAllMines() {
    // debugger
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isMarked = false
                gBoard[i][j].isShown = true
            }
        }
    }
    renderBoard()
}



function cellMarked(i, j, event) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j]
    if (cell.isShown) return
    cell.isMarked = (cell.isMarked) ? false : true;
    renderBoard();
    (cell.isMarked) ? gGame.markedCount++ : gGame.markedCount--;
    checkGameOver()

}


function expandShown(posI, posJ) {

    // debugger
    if (posI > gBoard.length || posJ > gBoard.length || posI < 0 || posJ < 0) return
    if (gBoard[posI][posJ].minesAroundCount === 0 && !gBoard[posI][posJ].isShown) {

        for (var i = posI - 1; i <= posI + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = posJ - 1; j <= posJ + 1; j++) {
                if (j < 0 || j >= gBoard.length) continue;
                // if (gBoard[i][j].isShown = true) continue
                // if(i===posI&& j===posJ) continue
                gBoard[i][j].isShown = true
                gGame.shownCount++
                expandShown(i, j)
            
            }

        }

    }
    else return
}
function checkGameOver() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            //debugger
            if (gBoard[i][j].isMine) {
                if (!gBoard[i][j].isMarked) return false
            }
            else {
                if (!gBoard[i][j].isShown) return false
            }
        }
    }
    gGame.isOn=false
    

}





