export type JunqiSide = "player" | "ai";

export type JunqiPieceType =
  | "commander"
  | "marshal"
  | "division"
  | "brigade"
  | "regiment"
  | "battalion"
  | "company"
  | "platoon"
  | "engineer"
  | "bomb"
  | "mine"
  | "flag";

export interface JunqiPiece {
  id: string;
  side: JunqiSide;
  type: JunqiPieceType;
  row: number;
  col: number;
  revealed: boolean;
  motivated?: boolean;
}

export interface JunqiGame {
  board: (JunqiPiece | null)[][];
  turn: JunqiSide;
  winner: JunqiSide | null;
  moveCount: number;
  commandPoints: number;
  commandState: JunqiCommandState;
  extraMovesRemaining: number;
  lastMove?: {
    from: [number, number];
    to: [number, number];
    captured?: JunqiPieceType;
  };
}

export type JunqiCommand =
  | "deploy"
  | "motivate"
  | "coordinate"
  | "reinforce";

export interface JunqiCommandState {
  deployUsed: boolean;
  motivateUsed: boolean;
  motivatePieceId?: string;
  coordinateUsed: boolean;
  reinforceUsed: boolean;
}

export interface JunqiCommandTarget {
  pieceId?: string;
  to?: [number, number];
}

export interface JunqiMove {
  pieceId: string;
  from: [number, number];
  to: [number, number];
}

export const JUNQI_RANK: Record<JunqiPieceType, number> = {
  commander: 9,
  marshal: 8,
  division: 7,
  brigade: 6,
  regiment: 5,
  battalion: 4,
  company: 3,
  platoon: 2,
  engineer: 1,
  bomb: 0,
  mine: 0,
  flag: 0
};

export const JUNQI_PIECE_LABELS: Record<
  JunqiPieceType,
  { zh: string; en: string }
> = {
  commander: { zh: "司令", en: "Commander" },
  marshal: { zh: "军长", en: "Marshal" },
  division: { zh: "师长", en: "Division" },
  brigade: { zh: "旅长", en: "Brigade" },
  regiment: { zh: "团长", en: "Regiment" },
  battalion: { zh: "营长", en: "Battalion" },
  company: { zh: "连长", en: "Company" },
  platoon: { zh: "排长", en: "Platoon" },
  engineer: { zh: "工兵", en: "Engineer" },
  bomb: { zh: "炸弹", en: "Bomb" },
  mine: { zh: "地雷", en: "Mine" },
  flag: { zh: "军旗", en: "Flag" }
};

const MOVABLE_TYPES = new Set<JunqiPieceType>([
  "commander",
  "marshal",
  "division",
  "brigade",
  "regiment",
  "battalion",
  "company",
  "platoon",
  "engineer",
  "bomb"
]);

export const JUNQI_COMMAND_COSTS: Record<JunqiCommand, number> = {
  deploy: 0,
  motivate: 1,
  coordinate: 2,
  reinforce: 2
};

function makePiece(
  side: JunqiSide,
  type: JunqiPieceType,
  row: number,
  col: number
): JunqiPiece {
  return {
    id: `${side}-${type}-${row}-${col}`,
    side,
    type,
    row,
    col,
    revealed: side === "player"
  };
}

export function isMovable(type: JunqiPieceType): boolean {
  return MOVABLE_TYPES.has(type);
}

export function createJunqiGame(commandPoints = 6): JunqiGame {
  const board: (JunqiPiece | null)[][] = Array.from({ length: 6 }, () =>
    Array<JunqiPiece | null>(6).fill(null)
  );

  const ai: Array<[JunqiPieceType, number, number]> = [
    ["mine", 0, 0],
    ["regiment", 0, 1],
    ["mine", 0, 2],
    ["flag", 0, 3],
    ["bomb", 0, 4],
    ["commander", 0, 5],
    ["platoon", 1, 0],
    ["division", 1, 1],
    ["marshal", 1, 2],
    ["battalion", 1, 3],
    ["brigade", 1, 4],
    ["engineer", 1, 5],
    ["company", 2, 0]
  ];
  const player: Array<[JunqiPieceType, number, number]> = [
    ["company", 3, 5],
    ["platoon", 4, 0],
    ["division", 4, 1],
    ["marshal", 4, 2],
    ["battalion", 4, 3],
    ["brigade", 4, 4],
    ["engineer", 4, 5],
    ["mine", 5, 0],
    ["regiment", 5, 1],
    ["mine", 5, 2],
    ["flag", 5, 3],
    ["bomb", 5, 4],
    ["commander", 5, 5]
  ];

  for (const [type, row, col] of ai) {
    board[row][col] = makePiece("ai", type, row, col);
  }
  for (const [type, row, col] of player) {
    board[row][col] = makePiece("player", type, row, col);
  }

  return {
    board,
    turn: "player",
    winner: null,
    moveCount: 0,
    commandPoints,
    commandState: {
      deployUsed: false,
      motivateUsed: false,
      coordinateUsed: false,
      reinforceUsed: false
    },
    extraMovesRemaining: 0
  };
}

function cloneBoard(
  board: (JunqiPiece | null)[][]
): (JunqiPiece | null)[][] {
  return board.map((row) =>
    row.map((piece) =>
      piece ? { ...piece, row: piece.row, col: piece.col } : null
    )
  );
}

function cloneGame(game: JunqiGame): JunqiGame {
  return {
    ...game,
    board: cloneBoard(game.board),
    commandState: { ...game.commandState },
    lastMove: game.lastMove
      ? { ...game.lastMove, from: [...game.lastMove.from], to: [...game.lastMove.to] }
      : undefined
  };
}

export function legalMoves(game: JunqiGame, side: JunqiSide): JunqiMove[] {
  if (game.winner || game.turn !== side) return [];
  const moves: JunqiMove[] = [];
  for (let row = 0; row < 6; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      const piece = game.board[row][col];
      if (!piece || piece.side !== side || !isMovable(piece.type)) continue;
      for (const [dr, dc] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
      ]) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr < 0 || nr > 5 || nc < 0 || nc > 5) continue;
        const target = game.board[nr][nc];
        if (target && target.side === side) continue;
        moves.push({
          pieceId: piece.id,
          from: [row, col],
          to: [nr, nc]
        });
      }
    }
  }
  return moves;
}

export function resolveCapture(
  attacker: JunqiPieceType,
  target: JunqiPieceType,
  bonus = 0
): "attacker" | "defender" | "both" | "flag" {
  if (target === "flag") return "flag";
  if (attacker === "bomb" || target === "bomb") return "both";
  if (target === "mine") {
    return attacker === "engineer" ? "attacker" : "defender";
  }
  const a = JUNQI_RANK[attacker] + bonus;
  const b = JUNQI_RANK[target];
  if (a > b) return "attacker";
  if (a < b) return "defender";
  return "both";
}

export function hasMovablePieces(
  board: (JunqiPiece | null)[][],
  side: JunqiSide
): boolean {
  return board
    .flat()
    .some(
      (piece) => piece !== null && piece.side === side && isMovable(piece.type)
    );
}

export function applyMove(game: JunqiGame, move: JunqiMove): JunqiGame {
  if (game.winner) return game;
  const side = game.turn;
  const fromPiece = game.board[move.from[0]][move.from[1]];
  if (
    !fromPiece ||
    fromPiece.id !== move.pieceId ||
    fromPiece.side !== side ||
    !isMovable(fromPiece.type)
  ) {
    return game;
  }
  const target = game.board[move.to[0]][move.to[1]];
  if (target && target.side === side) return game;

  const next = cloneGame(game);
  const moving = next.board[move.from[0]][move.from[1]];
  if (!moving) return game;
  const targetCell = next.board[move.to[0]][move.to[1]];
  next.lastMove = {
    from: [move.from[0], move.from[1]],
    to: [move.to[0], move.to[1]]
  };
  const motivationBonus =
    next.commandState.motivatePieceId === moving.id ? 1 : 0;

  if (!targetCell) {
    next.board[move.from[0]][move.from[1]] = null;
    next.board[move.to[0]][move.to[1]] = {
      ...moving,
      row: move.to[0],
      col: move.to[1]
    };
  } else {
    const outcome = resolveCapture(
      moving.type,
      targetCell.type,
      motivationBonus
    );
    next.lastMove = { ...next.lastMove, captured: targetCell.type };
    if (outcome === "flag") {
      next.board[move.from[0]][move.from[1]] = null;
      next.board[move.to[0]][move.to[1]] = {
        ...moving,
        row: move.to[0],
        col: move.to[1]
      };
      next.winner = side;
    } else if (outcome === "both") {
      next.board[move.from[0]][move.from[1]] = null;
      next.board[move.to[0]][move.to[1]] = null;
    } else if (outcome === "attacker") {
      next.board[move.from[0]][move.from[1]] = null;
      next.board[move.to[0]][move.to[1]] = {
        ...moving,
        row: move.to[0],
        col: move.to[1]
      };
    } else {
      next.board[move.from[0]][move.from[1]] = null;
    }
  }

  if (next.commandState.motivatePieceId === move.pieceId) {
    next.commandState.motivatePieceId = undefined;
  }
  if (!next.winner) {
    const opponent: JunqiSide = side === "player" ? "ai" : "player";
    if (!hasMovablePieces(next.board, opponent)) {
      next.winner = side;
    } else if (
      side === "player" &&
      next.extraMovesRemaining > 0 &&
      hasMovablePieces(next.board, side)
    ) {
      next.extraMovesRemaining -= 1;
    } else {
      next.turn = opponent;
    }
  }
  next.moveCount += 1;
  return next;
}

export function useJunqiCommand(
  game: JunqiGame,
  command: JunqiCommand,
  target?: JunqiCommandTarget
): JunqiGame {
  if (game.winner || game.turn !== "player") return game;
  const cost = JUNQI_COMMAND_COSTS[command];
  if (game.commandPoints < cost) return game;
  const state = game.commandState;
  if (
    (command === "deploy" && state.deployUsed) ||
    (command === "motivate" && state.motivateUsed) ||
    (command === "coordinate" && state.coordinateUsed) ||
    (command === "reinforce" && state.reinforceUsed)
  ) {
    return game;
  }

  const next = cloneGame(game);
  next.commandPoints -= cost;
  next.commandState = { ...state };

  if (command === "deploy") {
    const piece = next.board
      .flat()
      .find(
        (item) =>
          item !== null &&
          item.id === target?.pieceId &&
          item.side === "player"
      );
    const dest = target?.to;
    if (
      !piece ||
      !isMovable(piece.type) ||
      !dest ||
      dest[0] < 3 ||
      dest[0] > 5 ||
      dest[1] < 0 ||
      dest[1] > 5 ||
      next.board[dest[0]][dest[1]]
    ) {
      return game;
    }
    next.board[piece.row][piece.col] = null;
    next.board[dest[0]][dest[1]] = {
      ...piece,
      row: dest[0],
      col: dest[1]
    };
    next.commandState.deployUsed = true;
    return next;
  }

  if (command === "motivate") {
    const piece = next.board
      .flat()
      .find(
        (item) =>
          item !== null &&
          item.id === target?.pieceId &&
          item.side === "player"
      );
    if (!piece || !isMovable(piece.type)) return game;
    next.commandState.motivateUsed = true;
    next.commandState.motivatePieceId = piece.id;
    return next;
  }

  if (command === "coordinate") {
    next.commandState.coordinateUsed = true;
    next.extraMovesRemaining = 1;
    return next;
  }

  const dest = target?.to;
  if (
    !dest ||
    dest[0] < 3 ||
    dest[0] > 5 ||
    dest[1] < 0 ||
    dest[1] > 5 ||
    next.board[dest[0]][dest[1]]
  ) {
    return game;
  }
  const reinforce = makePiece("player", "platoon", dest[0], dest[1]);
  next.board[dest[0]][dest[1]] = reinforce;
  next.commandState.reinforceUsed = true;
  return next;
}

export function aiMove(game: JunqiGame): JunqiMove | null {
  const moves = legalMoves(game, "ai");
  if (moves.length === 0) return null;

  let best: JunqiMove | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const move of moves) {
    const piece = game.board[move.from[0]][move.from[1]];
    const target = game.board[move.to[0]][move.to[1]];
    let score = 0;
    if (target) {
      if (target.type === "flag") {
        score = 100000;
      } else if (piece?.type === "bomb" || target.type === "bomb") {
        score = 2500;
      } else if (target.type === "mine") {
        score = piece?.type === "engineer" ? 4000 : -20000;
      } else {
        const diff =
          JUNQI_RANK[piece?.type ?? "platoon"] - JUNQI_RANK[target.type];
        score =
          diff > 0
            ? 800 + diff * 60
            : diff === 0
              ? 500
              : -5000 - -diff * 90;
      }
    }
    score += 40 - Math.abs(move.to[0] - 5) * 10 - Math.abs(move.to[1] - 3) * 4;
    score += (game.moveCount + move.pieceId.length) % 3;
    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }
  return best;
}

export function applyAiMove(game: JunqiGame): JunqiGame {
  if (game.winner || game.turn !== "ai") return game;
  const move = aiMove(game);
  if (!move) {
    return {
      ...game,
      winner: "player"
    };
  }
  return applyMove(game, move);
}
