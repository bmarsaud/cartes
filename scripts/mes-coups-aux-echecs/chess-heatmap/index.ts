import { Chess, type Color, type PieceSymbol, type Square } from "chess.js";

const PLAYER_NAME = 'TheZopo';

let archivesResult = await fetch(`https://api.chess.com/pub/player/${PLAYER_NAME}/games/archives`).then((res) => res.json()) as { archives: string[] };
let games = [];
for (let archiveUrl of archivesResult.archives) {
    console.log('Downloading archives', archiveUrl);
    let result = await fetch(archiveUrl).then((res) => res.json()) as { games: any[] };
    games.push(...result.games);
}

let squares: Record<Square, Record<Color, Record<PieceSymbol, number>>> = {};
for (let game of games) {
    let chess = new Chess();
    chess.loadPgn(game.pgn);

    let history = chess.history({ verbose: true });
    let color = chess.getHeaders().White === PLAYER_NAME ? 'w' : 'b';

    for (let move of history) {
        if (move.color !== color) {
            continue;
        }

        if (!squares[move.to]) {
            squares[move.to] = {
                w: {},
                b: {}
            };
        }

        if (!squares[move.to][color][move.piece]) {
            squares[move.to][color][move.piece] = 0;
        }

        squares[move.to][color][move.piece] += 1;
    }
}

Bun.write('./chess-heatmap.json', JSON.stringify(squares, null, '  '));
