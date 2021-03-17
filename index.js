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
  if (matrixColumn < 8) return ['a','b','c','d','e','f','g','h'][matrixColumn]
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

const getHorsePossibleMoves = (currLine, currColumn) => ([
  { x: currColumn - 1, y: currLine + 2 },
  { x: currColumn - 2, y: currLine + 1 },
  { x: currColumn - 2, y: currLine - 1 },
  { x: currColumn - 1, y: currLine - 2 },
  { x: currColumn + 1, y: currLine - 2 },
  { x: currColumn + 2, y: currLine - 1 },
  { x: currColumn + 2, y: currLine + 1 },
  { x: currColumn + 1, y: currLine + 2 },
])

const countPossibleMoves = (board, possibleMoves, { x, y}) => {
  const newBoard = fillMatrixIdx(board, y, x)
  return possibleMoves
    .filter((move) => newBoard[move.y] && newBoard[move.y][move.x] === 0)
    .length
}

const getNextMove = (board, possibleMoves) => {
  const calculate = (board, moves, attempt) => {
    if(attempt > 7) return
    else {
      const { x, y } = moves[attempt]
      if(board[y] && board[y][x] === 0) return { x, y }
      else return calculate(board, moves, attempt + 1)
    }
  }
  return calculate(board, possibleMoves, 0)
}

const getMoves = (board, line, column, count = 1, acc = { moves: [], board: board}) => {
  if(count === 1) {
    board = fillMatrixIdx(board, line, column, count)
    return getMoves(board, line, column, count + 1)
  }
  const nextMove = getNextMove(board, getHorsePossibleMoves(line, column))
  if(!nextMove) return acc
  else {
    const boardColumn = mapBoardColumn(column)
    const boardLine = mapBoardLine(line)
    const newBoard = fillMatrixIdx(board, nextMove.y, nextMove.x, count)
    return getMoves(
      newBoard,
      nextMove.y,
      nextMove.x,
      count + 1,
      {
        board: newBoard,
        moves: acc.moves.concat([boardColumn + boardLine.toString()])
      }
    )
  }
}

const main = () => {
  let board = initMatrix(8, 8)
  const column = mapMatrixColumn(initialPosition[0]) // x 
  const line = mapMatrixLine(initialPosition[1])  // y
  
  const result = getMoves(board, line, column)

  console.log(result.moves)
  result.board.forEach((line) => {
    console.log('\n')
    console.log(line.reduce((prev, next) =>{
      return prev + (next.toString().length > 1 ? '| ' + next : '|  ' + next)
    }, ''))
  })
}

main()
