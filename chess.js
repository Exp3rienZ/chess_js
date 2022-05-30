let gameframe = document.getElementById('gameframe');

let runtime;

let fieldnumber = 8;

let test = [[5, 6], [5, 5]];
let whitesTurn = true;

let helpbool = false;
let piecesInGame = [
    ['BR', 1, 1], ['BS', 1, 2], ['BB', 1, 3], ['BQ', 1, 4], ['BK', 1, 5], ['BB', 1, 6], ['BS', 1, 7], ['BR', 1, 8],
    ['BP', 2, 1], ['BP', 2, 2], ['BP', 2, 3], ['BP', 2, 4], ['BP', 2, 5], ['BP', 2, 6], ['BP', 2, 7], ['BP', 2, 8],
    ['WP', 7, 1], ['WP', 7, 2], ['WP', 7, 3], ['WP', 7, 4], ['WP', 7, 5], ['WP', 7, 6], ['WP', 7, 7], ['WP', 7, 8],
    ['WR', 8, 1], ['WS', 8, 2], ['WB', 8, 3], ['WQ', 8, 4], ['WK', 8, 5], ['WB', 8, 6], ['WS', 8, 7], ['WR', 8, 8],
];

let piecesOutOfGame = [];

for(let i = 1; i < fieldnumber+1; i++) {
    for(let k = 1; k < fieldnumber+1; k++) {
        if(helpbool == false) {
            gameframe.innerHTML += '<div class="white_field" style="grid-column-start: ' + i +  '; grid-row-start: ' + k + ';"></div>'; 
        }
        else {
            gameframe.innerHTML += '<div class="dark_field" style="grid-column-start: ' + i +  '; grid-row-start: ' + k + ';"></div>'; 
        }
        helpbool = !helpbool;
    }
    helpbool = !helpbool;
}

let fields = gameframe.childNodes;
fields.forEach(field => {
    field.addEventListener('dragover', e => {
        e.preventDefault();
        if(field.childNodes[0] != null) {
            field.childNodes.forEach(element => {
                if(element.classList.contains('possibleMove')) {
                    field.classList.add('draggedOn');
                }
            })
        }
    })

    field.addEventListener('dragleave', () => {
        field.classList.remove('draggedOn');
    })
})

for(let k = 0; k < piecesInGame.length; k++) {
    render_piece(piecesInGame[k][0], piecesInGame[k][1], piecesInGame[k][2])
}

let pieces = document.querySelectorAll('.piece');
pieces.forEach(piece => { 

    piece.addEventListener('mousedown', () => {

    })

    piece.addEventListener('dragstart', () => {
        let piece_y = piece.parentElement.style.gridRowStart;
        let piece_x = piece.parentElement.style.gridColumnStart;
        let currentColor = '';
        if(whitesTurn) {
            currentColor = 'white';
        } else {
            currentColor = 'black';
        }
        if(!isOpponentPiece(piece_x, piece_y, currentColor)) {
            piece.classList.add('dragging');
            setTimeout(() => {
                piece.classList.add('invis');
            }, 1);
            drawMoves(calculatePossibleMoves(parseInt(piece_x),parseInt(piece_y)));
        }
    })

    piece.addEventListener('dragend', () => {
        piece.classList.remove('dragging');
        setTimeout(() => {
            piece.classList.remove('invis');
        }, 1);
        let droppedOn = document.querySelectorAll('.draggedOn')[0];
        if(droppedOn != null) {
            droppedOn.classList.remove('draggedOn');
            
        }
        let possibleMoves = document.querySelectorAll('.possibleMove');
        possibleMoves.forEach(possibleMove => {
            possibleMove.parentElement.removeChild(possibleMove.parentElement.lastChild);
        })
        if(droppedOn != null) {
            let dropped_onY = droppedOn.style.gridRowStart;
            let dropped_onX = droppedOn.style.gridColumnStart;
            let piece_y = piece.parentElement.style.gridRowStart;
            let piece_x = piece.parentElement.style.gridColumnStart;
            move(piece_x, piece_y, dropped_onX, dropped_onY);
        }
    })
})

function render_piece(kindOfPiece, x, y) {
    let field = getField(x, y);
    let source = '';
    let alt = '';
    switch(kindOfPiece) {
        case 'WP':
            source = 'w_pawn.png';
            alt = 'white_pawn';
            break;
        case 'BP':
            source = 'b_pawn.png';
            alt = 'black_pawn';
            break;
        case 'WK':
            source = 'w_king.png';
            alt = 'white_king';
            break;
        case 'BK':
            source = 'b_king.png';
            alt = 'black_king';
            break;
        case 'WQ':
            source = 'w_queen.png';
            alt = 'white_queen';
            break;
        case 'BQ':
            source = 'b_queen.png';
            alt = 'black_queen';
            break;
        case 'WB':
            source = 'w_bishop.png';
            alt = 'white_bishop';
            break;
        case 'BB':
            source = 'b_bishop.png';
            alt = 'black_bishop';
            break;
        case 'WR':
            source = 'w_rook.png';
            alt = 'white_rook';
            break;
        case 'BR':
            source = 'b_rook.png';
            alt = 'black_rook';
            break;
        case 'WS':
            source = 'w_knight.png';
            alt = 'white_knight';
            break;
        case 'BS':
            source = 'b_knight.png';
            alt = 'black_knight';
            break;
        default:
            break;
    }
    if(kindOfPiece != '') {
        field.innerHTML += '<img class="piece" src="./ressources/' + source + '" alt="' + alt + '" draggable="true">';
    }
}

function drawMoves(movesToDraw) {
    for(let i = 0; i < movesToDraw.length; i++) {
        let field = getField(movesToDraw[i][1], movesToDraw[i][0]);
        field.innerHTML += '<div class="possibleMove"></div>';
    }
}

function color_field(x, y, color) {
    getField(x,y).style.backgroundColor = color;
}

function getField(x, y) {
    return gameframe.childNodes[x-1 + (fieldnumber) * (y-1)];
}

function getPieceFromCoordinates(x, y) {
    for(let i = 0; i < piecesInGame.length; i++) {
        if(piecesInGame[i][1] == y && piecesInGame[i][2] == x) {
            return piecesInGame[i][0];
        }
    }
    return '';
}

function setPieceCoordinates(x1, y1, x2, y2) {
    for(let i = 0; i < piecesInGame.length; i++) {
        if(piecesInGame[i][1] == y2 && piecesInGame[i][2] == x2) {
            piecesOutOfGame.push(piecesInGame[i][0]);
            piecesInGame.splice(i, 1);
        }
    }

    for(let i = 0; i < piecesInGame.length; i++) {
        if(piecesInGame[i][1] == y1 && piecesInGame[i][2] == x1) {
            piecesInGame[i][1] = y2;
            piecesInGame[i][2] = x2;
        }
    }
}

function isOpponentPiece(x, y, color) {
    let piece = getPieceFromCoordinates(x, y);
    if(color == 'white') {
        if(piece[0] == 'B') {
            return true;
        }
    }
    if(color == 'black') {
        if(piece[0] == 'W') {
            return true;
        }
    }
    return false;
}

function fieldEmpty(x, y) {
    return getPieceFromCoordinates(x, y) == '';
}

function possibleMovesInLine(x, y, color) {
    let movesInLine = [];
    for(let i = x-1; i > 0; i--) {
        if(isOpponentPiece(i, y, color) || getPieceFromCoordinates(i, y) == '') {
            movesInLine.push([i, y]);
        }
        if(getPieceFromCoordinates(i, y) != '') {
            break;
        }
    }
    for(let i = x+1; i <= 8; i++) {
        if(isOpponentPiece(i, y, color) || getPieceFromCoordinates(i, y) == '') {
            movesInLine.push([i, y]);
        }
        if(getPieceFromCoordinates(i, y) != '') {
            break;
        }
    }
    for(let i = y-1; i > 0; i--) {
        if(isOpponentPiece(x, i, color) || getPieceFromCoordinates(x, i) == '') {
            movesInLine.push([x, i]);
        }
        if(getPieceFromCoordinates(x, i) != '') {
            break;
        }
    }
    for(let i = y+1; i <= 8; i++) {
        if(isOpponentPiece(x, i, color) || getPieceFromCoordinates(x, i) == '') {
            movesInLine.push([x, i]);
        }
        if(getPieceFromCoordinates(x, i) != '') {
            break;
        }
    }
    return movesInLine;
}

function possibleMovesInDiagonal(x, y, color) {
    let movesInLine = [];
    let xi = x - 1;
    let yi = y - 1;
    while(xi > 0  && yi > 0) {
        if(isOpponentPiece(xi, yi, color) || getPieceFromCoordinates(xi, yi) == '') {
            movesInLine.push([xi, yi]);
        }
        if(getPieceFromCoordinates(xi, yi) != '') {
            break;
        }
        xi--;
        yi--;
    }
    xi = x + 1;
    yi = y + 1;
    while(xi <= 8  && yi <= 8) {
        if(isOpponentPiece(xi, yi, color) || getPieceFromCoordinates(xi, yi) == '') {
            movesInLine.push([xi, yi]);
        }
        if(getPieceFromCoordinates(xi, yi) != '') {
            break;
        }
        xi++;
        yi++;
    }
    xi = x - 1;
    yi = y + 1;
    while(xi > 0  && yi <= 8) {
        if(isOpponentPiece(xi, yi, color) || getPieceFromCoordinates(xi, yi) == '') {
            movesInLine.push([xi, yi]);
        }
        if(getPieceFromCoordinates(xi, yi) != '') {
            break;
        }
        xi--;
        yi++;
    }
    xi = x + 1;
    yi = y - 1;
    while(xi <= 8  && yi > 0) {
        if(isOpponentPiece(xi, yi, color) || getPieceFromCoordinates(xi, yi) == '') {
            movesInLine.push([xi, yi]);
        }
        if(getPieceFromCoordinates(xi, yi) != '') {
            break;
        }
        xi++;
        yi--;
    }
    return movesInLine;
}

function possibleSpringerMoves(x, y, color) {
    let springerMoves = [];
    let mathematicalArray = [ [x-1, y-2], [x-2, y-1], [x-2, y+1], [x-1, y+2], [x+1, y+2], [x+2, y+1], [x+2, y-1], [x+1, y-2]];
    for(let i = 0; i < mathematicalArray.length; i++) {
        if(mathematicalArray[i][0] > 0 && mathematicalArray[i][1] <= 8 && mathematicalArray[i][0] <= 8 && mathematicalArray[i][1] > 0) {
            if(isOpponentPiece(mathematicalArray[i][0], mathematicalArray[i][1], color) || getPieceFromCoordinates(mathematicalArray[i][0], mathematicalArray[i][1]) == '') {
                springerMoves.push(mathematicalArray[i]);
            }
        }
    }
    return springerMoves;
}

function possibleKingMoves(x, y, color) {
    let kingMoves = [];
    let mathematicalArray = [ [x-1, y], [x-1, y+1], [x, y+1], [x+1, y+1], [x+1, y], [x+1, y-1], [x, y-1], [x-1, y-1]];
    for(let i = 0; i < mathematicalArray.length; i++) {
        if(mathematicalArray[i][0] > 0 && mathematicalArray[i][1] <= 8 && mathematicalArray[i][0] <= 8 && mathematicalArray[i][1] > 0) {
            if(isOpponentPiece(mathematicalArray[i][0], mathematicalArray[i][1], color) || getPieceFromCoordinates(mathematicalArray[i][0], mathematicalArray[i][1]) == '') {
                kingMoves.push(mathematicalArray[i]);
            }
        }
    }
    return kingMoves;
}


function calculatePossibleMoves(piece_x, piece_y) {
    let pieceToMove = getPieceFromCoordinates(piece_x, piece_y);
    let possibleMoves = [];
    switch(pieceToMove) {
        case 'WP':
            if(fieldEmpty(piece_x, piece_y - 1)) {
                possibleMoves.push([piece_x, piece_y - 1]);
            }
            if(piece_y == 7 && fieldEmpty(piece_x, piece_y - 2) && fieldEmpty(piece_x, piece_y - 1)) {
                possibleMoves.push([piece_x, piece_y - 2]);
            }
            if(isOpponentPiece(piece_x - 1, piece_y - 1, 'white')) {
                possibleMoves.push([piece_x - 1, piece_y - 1]);
            }
            if(isOpponentPiece(piece_x + 1, piece_y - 1, 'white')) {
                possibleMoves.push([piece_x + 1, piece_y - 1]);
            }
            break;
        case 'BP':
            if(fieldEmpty(piece_x, piece_y + 1)) {
                possibleMoves.push([piece_x, piece_y + 1]);
            }
            if(piece_y == 2 && fieldEmpty(piece_x, piece_y + 2) && fieldEmpty(piece_x, piece_y + 1)) {
                possibleMoves.push([piece_x, piece_y + 2]);
            }
            if(isOpponentPiece(piece_x - 1, piece_y + 1, 'black')) {
                possibleMoves.push([piece_x - 1, piece_y + 1]);
            }
            if(isOpponentPiece(piece_x + 1, piece_y + 1, 'black')) {
                possibleMoves.push([piece_x + 1, piece_y + 1]);
            }
            break;
        case 'WR':
            let movesInLine = possibleMovesInLine(piece_x, piece_y, 'white');
            possibleMoves = possibleMoves.concat(movesInLine);
            break;
        case 'BR':
            let movesInLine2 = possibleMovesInLine(piece_x, piece_y, 'black');
            possibleMoves = possibleMoves.concat(movesInLine2);
            break;
        case 'WB':
            possibleMoves = possibleMoves.concat(possibleMovesInDiagonal(piece_x, piece_y, 'white'));
            break;
        case 'BB':
            possibleMoves = possibleMoves.concat(possibleMovesInDiagonal(piece_x, piece_y, 'black'));
            break;
        case 'WQ':
            possibleMoves = possibleMoves.concat(possibleMovesInDiagonal(piece_x, piece_y, 'white'));
            possibleMoves = possibleMoves.concat(possibleMovesInLine(piece_x, piece_y, 'white'));
            break;
        case 'BQ':
            possibleMoves = possibleMoves.concat(possibleMovesInDiagonal(piece_x, piece_y, 'black'));
            possibleMoves = possibleMoves.concat(possibleMovesInLine(piece_x, piece_y, 'black'));
            break;
        case 'WS':
            possibleMoves = possibleMoves.concat(possibleSpringerMoves(piece_x, piece_y, 'white'));
            console.log(possibleMoves);
            break;
        case 'BS':
            possibleMoves = possibleMoves.concat(possibleSpringerMoves(piece_x, piece_y, 'black'));
            break;
        case 'BK':
            possibleMoves = possibleMoves.concat(possibleKingMoves(piece_x, piece_y, 'black'));
            break;
        case 'WK':
            possibleMoves = possibleMoves.concat(possibleKingMoves(piece_x, piece_y, 'white'));
            break;
                
    }
    return possibleMoves;
}

function move(startX, startY, destX, destY) {
    //Change in Memory:
    setPieceCoordinates(startX, startY, destX, destY);
    whitesTurn = !whitesTurn;


    //Change on Screen:
    let startField = getField(startY, startX);
    let destField = getField(destY, destX);

    if(destField.childNodes[0] != null) {
        if(destField.childNodes[0].classList.contains('piece')) {
           destField.removeChild(destField.firstChild);
        }
    }
    destField.appendChild(startField.firstChild);
}
