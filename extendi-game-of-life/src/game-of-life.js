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
		reader.onload = function(r){
			console.log('1',r);
			 // self.setState({
			 //	  src: r.target.result
			 // });
		}
		reader.readAsText(file);
		// self.setState({value:reader});
		console.log('2',reader);
		// var fr=new FileReader();
  //		 fr.onload=function(){
  //			  console.log('text: ', fr.result);
  //		 }
	}
	render() {
		return (
			<div className="file-loader">
				<p>Carica il file</p>
				<input type="file" name="inputfile" accept={this.props.accept} onChange={this.handleChange}/>
			</div>
		);
	}
}

FileLoader.defaultProps = {
	accept: 'text/*'
}

function Square(props)  {
	return (
		<div className={"square"+(props.alive?" alive":"")} />
	);
}


class Board extends React.Component {
	constructor(props) {
		super(props);
	}

	renderSquare(alive, index) {
		return <Square alive={alive} key={index}/>;
	}

	renderRow(row) {
		let squares = row.map((alive, index) =>
			<Square alive={alive} key={index}/>
		);
		return squares;
	}

	render() {
		const status = 'Generation: ';
		let rows = this.props.data.map((row, index) =>
			<div className="board-row" key={index}>
				{this.renderRow(row)}
			</div>
		);

		return (
			<div>
				<div className="status">{status+this.props.generation}</div>
				{rows}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// board: undefined,//Array(9).fill(null),
			board: Array(4).fill(Array(8).fill(false)),
			generation: 1,
		};
	}
	render() {
		return (
			<div className="game">
				<FileLoader />
				<div className="game-board">
					<Board data={this.state.board} generation={this.state.generation}/>
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