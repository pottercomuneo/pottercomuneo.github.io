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
				<div className="status">{this.props.dimensions}</div>
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
			dimensions: '&nbsp;'
		};
		this.handleChange = this.handleChange.bind(this);
		this.calculateNextGen = this.calculateNextGen.bind(this);
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
				let row = [];
				for (var j = 0; j < split_res[i].length; j++) {
					row.push(split_res[i][j]=='*'?true:false);
				}
				new_board.push(row);
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

	getAliveNeighboursCount(coords, data) {
		let count = 0;

		let row_low_bound = (coords.row-1<0)?0:coords.row-1;
		let row_hig_bound = (coords.row+1>=data.length)?data.length-1:coords.row+1;

		let col_low_bound = (coords.col-1<0)?0:coords.col-1;
		let col_hig_bound = (coords.col+1>=data[0].length)?data[0].length-1:coords.col+1;

		for (var i = row_low_bound; i <= row_hig_bound; i++) {
			for (var j = col_low_bound; j <= col_hig_bound; j++) {
				if (i != coords.row && j != coords.col && data[i][j])
					count++;
			}
		}

		return count;
	}

	calculateNextGen() {
		this.setState((state)  => ({generation: state.generation+1}));
		let next_board = this.state.board;

		for (var i = 0; i < next_board.length; i++) {
			for (var j = 0; j < next_board[i].length; j++) {
				let neighcount = this.getAliveNeighboursCount({row: i, col: j}, this.state.board);
				if (neighcount < 2 || neighcount > 3)
					next_board[i][j] = false;
				else if (neighcount == 3)
					next_board[i][j] = true;
			}
		}

		this.setState({board: next_board});
	}

	render() {
		return (
			<div className="game">
				<FileLoader handleChange={this.handleChange}/>
				<div className="game-board">
					<Board
						data={this.state.board}
						generation={this.state.generation}
						dimensions={this.state.dimensions}
					/>
				</div>
				<button className="nextgen" onClick={this.calculateNextGen}>Calcola generazione successiva</button>
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