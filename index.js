const initialPosition = process.argv.slice(2)[0]

const initMatrix = (ysize, xsize, fill = 0) => {
  var matrix = []
  for (var i = 0; i < ysize; i++) {
    matrix[i] = []
    for (var j = 0; j < xsize; j++) {
      matrix[i][j] = fill
    }
  }
  return matrix
}

const copyArray = (arr) => arr.slice()

const copyMatrix = (matrix) => matrix.map(copyArray)

const fillMatrixIdx = (matrix, yIdx, xIdx, value = 1) => {
  const copy = copyMatrix(matrix)
  copy[yIdx][xIdx] = value
  return copy
}

const mapMatrixColumn = (letter) => {
  const map = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
  }

  if (letter && [0, 1, 2, 3, 4, 5, 6, 7].includes(map[letter])) return map[letter]
  throw new Error('Invalid column: ' + letter)
}

const mapBoardColumn = (matrixColumn) => {
  if (matrixColumn < 8) return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][matrixColumn]
  throw new Error('Invalid column: ' + matrixColumn)
}

const mapMatrixLine = (stringLineNumber) => {
  const line = Number(stringLineNumber)
  if (line && line > 0 && line <= 8) return [7, 6, 5, 4, 3, 2, 1, 0][line - 1]
  throw new Error('Invalid line: ' + stringLineNumber)
}

const mapBoardLine = (matrixLine) => {
  if (matrixLine > -1 && matrixLine < 8) return [8, 7, 6, 5, 4, 3, 2, 1][matrixLine]
  throw new Error('Invalid line: ' + matrixLine)
}

const getKnightPossibleMoves = () => ([
  { x: - 1, y: + 2 },
  { x: - 2, y: + 1 },
  { x: - 2, y: - 1 },
  { x: - 1, y: - 2 },
  { x: + 1, y: - 2 },
  { x: + 2, y: - 1 },
  { x: + 2, y: + 1 },
  { x: + 1, y: + 2 },
])

const checkBoardRange = (value) => value >= 0 && value < 8

const checkValidMove = (board, line, column) =>
  checkBoardRange(line) &&
  checkBoardRange(column) &&
  board[line][column] === 0

const getMoves = (board, line, column, count = 1, acc = { moves: [], board: board }) => {
  if (count === 64) {
    return acc
  }
  else {
    const possibleMoves = getKnightPossibleMoves()
    for (let i = 0; i < possibleMoves.length; i++) {
      const newLine = line + possibleMoves[i].y
      const newColumn = column + possibleMoves[i].x
      if (checkValidMove(board, newLine, newColumn)) {
        const move = count + 1
        const newBoard = fillMatrixIdx(board, newLine, newColumn, move)
        const newAcc = {
          moves: acc.moves.concat([mapBoardColumn(column) + mapBoardLine(line).toString()]),
          board: newBoard
        }
        const moves = getMoves(newBoard, newLine, newColumn, move, newAcc)
        if (moves && moves.moves.length === 63) {
          return moves
        }
      }
    }
    return acc
  }
}

const main = () => {
  let board = initMatrix(8, 8)
  const column = mapMatrixColumn(initialPosition[0]) // x 
  const line = mapMatrixLine(initialPosition[1])  // y
  board = fillMatrixIdx(board, line, column)
  const result = getMoves(board, line, column)

  console.log(result.moves)
  result.board.forEach((line) => {
    console.log('\n')
    console.log(line.reduce((prev, next) => {
      return prev + (next.toString().length > 1 ? '| ' + next : '|  ' + next)
    }, ''))
  })
}

main()
