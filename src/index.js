import React, { StrictMode, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  if (props.isWinner) {
    return (
      <button
        className="square"
        onClick={() => props.onClick()}
        style={{ color: "red" }}
      >
        {props.value}
      </button>
    );
  }
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        isWinner={
          calculateWinner(this.props.squares).winner
            ? calculateWinner(this.props.squares).line.includes(i)
            : false
        }
      />
    );
  }
  createBoard = () => {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let children = [];
      for (let j = 0; j < 3; j++) {
        children.push(this.renderSquare(3 * i + j));
      }
      board.push(
        <div className="board-row" key={i}>
          {children}
        </div>
      );
    }
    return board;
  };
  render() {
    return <div>{this.createBoard()}</div>;
    /*return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );*/
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
      desc: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    console.log("(" + Math.floor(i / 3) + "," + (i % 3) + ")");
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    console.log(this.state.history);
  }
  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;

    const moves = history.map((step, move) => {
      const desc = move ? "Go here: #" + move : "Go to the start of the game";
      if (move == this.state.stepNumber) {
        return (
          <li key={move}>
            <button
              onClick={() => this.jumpTo(move)}
              style={{ fontWeight: "bold" }}
            >
              {desc}
            </button>
          </li>
        );
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      console.log(history.length);
      if (history.length == 10) {
        status = "It's a draw!";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }
    moves.reverse();
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}
