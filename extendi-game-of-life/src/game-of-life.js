class FileLoader extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value: null,
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {console.log('inside', event);
		let file = event.target.files[0], reader = new FileReader(), self = this;
		// reader.onload = function(r){
		// 	console.log(r);
  //         // self.setState({
  //         //     src: r.target.result
  //         // });
  //     }
      reader.readAsText(file);
      // self.setState({value:reader});
      console.log(reader.result);
		// var fr=new FileReader();
  //       fr.onload=function(){
  //           console.log('text: ', fr.result);
  //       }
	}
	render() {
		return (
			<div className="file-loader">
				<p>Carica il file</p>
				<input type="file" name="inputfile" accept={accept} onChange={this.handleChange}/>
			</div>
		);
	}
}

FileLoader.defaultProps = {
   accept: 'text/*'
}
FileLoader.propTypes = {
   accept: PropTypes.string
}

class Square extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: null,
		};
	}

	render() {
		return (
			<button
				className="square"
				onClick={() => this.setState({value: 'X'})}
			>
				{this.state.value}
			</button>
		);
	}
}

class Board extends React.Component {
	renderSquare(i) {
		return <Square />;
	}

	render() {
		const status = 'Next player: X';

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
			</div>
		);
	}
}

class Game extends React.Component {
	render() {
		return (
			<div className="game">
				<FileLoader />
				<div className="game-board">
					<Board />
				</div>
				<div className="game-info">
					<div>{/* status */}</div>
					<ol>{/* TODO */}</ol>
				</div>
		</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);