import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() { 
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [currentMove, setCurrentMove] = useState(0);
  const curPlayer = currentMove % 2 === 0 ? 'X' : 'O'
  const [isPicking, setIsPicking] = useState(true);
  const [pickedCell, setPickedCell] = useState(-1);

  function handleClick(i) {
    // prevent placing things if it's the end of game or clicking full tiles early game
    if (calculateWinner(squares) || (squares[i] && currentMove < 6))
    {
      return;
    }

    // if it is the first 6 moves, we place anywhere
    if (currentMove < 6) {
        const nextSquares = squares.slice();
        nextSquares[i] = curPlayer;
        setSquares(nextSquares);
        setCurrentMove(currentMove + 1);
        return;
    }
    
    // ensure valid pick (pick owned pieces)
    if (isPicking) {
      if (squares[i] === curPlayer){
        setPickedCell(i);
        setIsPicking(!isPicking);
        console.log("picked" + i);
      }
    } else {
      // ensure placement in empty tile, ensure middle cell will be vacated, and ensure adjacency is met
      if (!squares[i]){
        const ADJACENT_INDICES = [
          [1, 3, 4],
          [0, 2, 3, 4, 5],
          [1, 4, 5],
          [0, 1, 4, 6, 7],
          [0, 1, 2, 3, 5, 6, 7, 8],
          [1, 2, 4, 7, 8],
          [3, 4, 7],
          [3, 4, 5, 6, 8],
          [4, 5, 7],
        ];
        const validSquares = ADJACENT_INDICES[pickedCell];
        if (validSquares.includes(i)){
          const nextSquares = squares.slice();
          nextSquares[i] = curPlayer;
          nextSquares[pickedCell] = null;
          if (!(squares[4] === curPlayer && pickedCell !== 4) || calculateWinner(nextSquares)){
            setSquares(nextSquares);
            setCurrentMove(currentMove + 1);
            console.log("placed" + pickedCell);
          }
        }
      }
      setIsPicking(!isPicking);
      setPickedCell(-1);
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + curPlayer;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

