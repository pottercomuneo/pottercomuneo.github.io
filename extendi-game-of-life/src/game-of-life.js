class FileLoader extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value: null,
		};
	}

	render() {
		return (
			<div className="file-loader">
				<p>Carica il file</p>
				<input type="file" name="inputfile" accept={this.props.accept} onChange={this.props.handleChange}/>
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

	// renderSquare(alive, index) {
	// 	return <Square alive={alive} key={index}/>;
	// }

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
			src: '',
			dimensions: ''
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		let file = event.target.files[0], reader = new FileReader(), self = this;
		reader.onload = function(r){
			let res = r.target.result;
			let split_res = res.split('\n');
			let gen_row = split_res.shift();
			let dim_row = split_res.shift();
			let new_board = [];
			for (var i = 0; i < split_res.length; i++) {
				for (var j = 0; j < split_res[i].length; j++) {
					new_board[i][j] = (split_res[i][j]=='*'?true:false);
				}
			}
			self.setState({
				  src: r.target.result,
				  dimensions: dim_row,
				  generation: parseInt(gen_row.replace('Generation ', '').replace(':', '')),
				  board: new_board
			});
		}
		reader.readAsText(file);
	}

	render() {
		return (
			<div className="game">
				<pre>{this.state.src}</pre>
				<FileLoader handleChange={this.handleChange}/>
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