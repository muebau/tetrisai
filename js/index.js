var PORT = 65506;
var HOST = "192.168.178.51";

var AI = require('./ai');
var Grid = require('./grid');
var Piece = require('./piece');
var Timer = require('./timer');
var RandomPieceGenerator = require('./random_piece_generator');
var Tuner = require('./tuner');
var TPM2net = require('./tpm2net');

function GameManager() {
    var grid = new Grid(17, 14);
    var rpg = new RandomPieceGenerator();
    var aHeight = 0.510066;
    var cLines = 0.760666;
    var holes = 0.35663;
    var bumpiness = 0.184483;
    var ai = new AI(aHeight, cLines, holes, bumpiness);
    var workingPieces = [rpg.nextPiece(), rpg.nextPiece()];
    var workingPiece = workingPieces[0];
    var gravityTimer = new Timer(onGravityTimerTick, 300);
    var score = 0;

    var tpm2net = new TPM2net(HOST, PORT);

    function setSnake(result, x, y, cell) {
        if (y % 2 == 0) {
            result[((y * 20) + x) * 3] = ((cell >> 16) & 0xFF);
            result[((y * 20) + x) * 3 + 1] = ((cell >> 8) & 0xFF);
            result[((y * 20) + x) * 3 + 2] = ((cell & 0xFF));
        } else {
            result[((y * 20) + (19 - x)) * 3] = ((cell >> 16) & 0xFF);
            result[((y * 20) + (19 - x)) * 3 + 1] = ((cell >> 8) & 0xFF);
            result[((y * 20) + (19 - x)) * 3 + 2] = ((cell & 0xFF));
        }
    }

    function sendFrame() {
        var result = new Array(907);
        //grid
        for (var r = 2; r < grid.rows; r++) {
            setSnake(result, grid.columns, r - 2, 0x101010);
        }

        //grid
        for (var r = 2; r < grid.rows; r++) {
            for (var c = 0; c < grid.columns; c++) {
                if (grid.cells[r][c] != 0) {
                    setSnake(result, ((grid.columns - 1) - c), r - 2, grid.cells[r][c]);
                }
            }
        }

        //working piece
        for (var r = 0; r < workingPiece.dimension; r++) {
            for (var c = 0; c < workingPiece.dimension; c++) {
                if (workingPiece.cells[r][c] != 0 && (r + workingPiece.row) >= 2) {
                    setSnake(result, ((grid.columns - 1) - (c + workingPiece.column)), ((r + workingPiece.row) - 2), workingPiece.cells[r][c]);
                }
            }
        }

        //next piece
        var next = workingPieces[1];
        var xOffset = next.dimension == 2 ? 2 : next.dimension == 3 ? 1 : next.dimension == 4 ? 0 : null;
        var yOffset = next.dimension == 2 ? 2 : next.dimension == 3 ? 2 : next.dimension == 4 ? 1 : null;
        for (var r = 0; r < next.dimension; r++) {
            for (var c = 0; c < next.dimension; c++) {
                if (next.cells[r][c] != 0) {
                    setSnake(result, (xOffset + c) + 15, yOffset + r + 1, next.cells[r][c]);
                }
            }
        }
        tpm2net.send(result);
    }

    function onGravityTimerTick() {
        if (workingPiece.canMoveDown(grid)) {
            workingPiece.moveDown(grid);
            sendFrame();
            return;
        }

        grid.addPiece(workingPiece);
        score += grid.clearLines();

        if (!grid.exceeded()) {
            for (var i = 0; i < workingPieces.length - 1; i++) {
                workingPieces[i] = workingPieces[i + 1];
            }
            workingPieces[workingPieces.length - 1] = rpg.nextPiece();
            workingPiece = workingPieces[0];
            workingPiece = ai.best(grid, workingPieces);
            gravityTimer.reset(1000);
        } else {
            gravityTimer.stop();
        }
        sendFrame();
    }

    sendFrame();
    gravityTimer.start();
}

var manager = new GameManager();