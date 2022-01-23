import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//React component for individual game tiles
class Square extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      //The onClick attribute on this button element allows for the click to permeate through to the board through props
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.who_played}
      </button>
    );
  }
}

//Reach component for board filled with game tiles and info
class Board extends React.Component {
  //Constructor establishes a game state that can be used for synchronization between the tic tac toe tiles
  //and allow for easier win condition checking in the future
  constructor(props){
    super(props);
    this.state = {
      player_status: "X",
      space_status: ["","","","","","","","",""]
    }
  }

  //This function resets the shared state to have all empty spaces and starts on player "X"
  resetGame(){
    this.setState({space_status : ["","","","","","","","",""]});
    this.setState({player_status : "X"});
  }

  //This function maintains a constant list of win combinations that could exist in the space_status
  //It iterates through these possibilities to see if the current game board meets any 
  //win conditions, and if so, it declares a winner
  decideWinner(gameboard){
    const winning_number_sets = [
      //rows
      [0, 1, 2],    
      [3, 4, 5],
      [6, 7, 8],
      //columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      //diag
      [0, 4, 8],
      [6, 4, 2]
    ];

    //for each win possibility
    for(var i = 0; i < winning_number_sets.length; i++){
      let [first, second, third] = winning_number_sets[i];
      //if this possibility exists on the gameboard, with all tiles in the condition sharing a value
      if(gameboard[first] === gameboard[second] &&
        gameboard[first] === gameboard[third] &&
        gameboard[third] === gameboard[first]
      ){
        //then we have found a winner
        return gameboard[first];
      }
    }
    //otherwise we show that no winner has been established, and play should continue
    return null;
  }

  //This function checks whether or not a space has been clicked by a player before (if it is not the default "")
  //If the space hasn't been used, we change the game state to reflect a new player ownership of that tile
  //*note* that the game Square's view this space_status state as a prop and are updated with this change as well
  //*note* this function also restricts clicking after a winner has been decided
  decideChange(i) {
    if(this.state.space_status[i] == "" && !this.decideWinner(this.state.space_status)){
      let temp = this.state.space_status;
      temp[i] = this.state.player_status;
      this.setState({space_status: temp})

      //If a change actually occurs, a side effect should a turn change to the next player
      let possible_player = (this.state.player_status == "X") ? "O" : "X";
      this.setState({player_status : possible_player});
    }
  }

  //This, along with the use of this.props.onClick in Square, allows for clicks to permeate through the child Square objects to the Board state for changes
  renderSquare(i) {
    return <Square who_played={this.state.space_status[i]} onClick={() => this.decideChange(i)}/>;
  }

  //Renders the JSX/HTML elements for this React Component
  render() {
    const winner = this.decideWinner(this.state.space_status);
    let status;
    //Writing this action inside the render function allows constant updates the the UI
    if(winner){
      status = "Winner: " + winner;
    }else{
      status = "Next Player: " + ((this.state.player_status == "X") ? "X" : "O");
    }

    return (
      <div>
        <div className="status">{status}</div>
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
        <button onClick={() => this.resetGame()}>Reset</button>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">

          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById("root")
);
