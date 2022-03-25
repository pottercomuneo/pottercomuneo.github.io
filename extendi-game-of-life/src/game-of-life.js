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
				<p>Upload your file</p>
				<input type="file" name="inputfile"
					accept={this.props.accept} 
					onChange={this.props.handleChange}	// defined in the Game component
				/>
			</div>
		);
	}
}

// defining what the input file accepts
FileLoader.defaultProps = {
	accept: 'text/*'
}

// it just renders the square
// if it's alive we add a class that means black background
function Square(props)  {
	return (
		<div className={"square"+(props.alive?" alive":"")} />
	);
}

// implements the game board itself
class Board extends React.Component {
	constructor(props) {
		super(props);
	}

	// provides a row as a list of Squares by given row's data
	renderRow(row) {
		let squares = row.map((alive, index) =>
			<Square alive={alive} key={index}/>
		);
		return squares;
	}

	render() {
		const gen = 'Generation: ';
		// let's create the list of rows elements
		let rows = this.props.data.map((row, index) =>
			<div className="board-row" key={index}>
				{this.renderRow(row)}
			</div>
		);

		return (
			<div>
				<div className="status">{gen+this.props.generation}</div>
				<div className="status">{this.props.dimensions}</div>
				{rows}
			</div>
		);
	}
}

// main component Game
// it handles the whole scene
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// board: Array(4).fill(Array(8).fill(false)),
			board: [],	// this will be filled with the board received from the file
			generation: 1,	// generation counter
			src: '',	// this will contain the source file content
			dimensions: '—'
		};
		this.handleChange = this.handleChange.bind(this);
		this.calculateNextGen = this.calculateNextGen.bind(this);
	}

	// handles the change of the input field
	// fired when a new file is chosen
	handleChange(event) {
		// it takes the core event of the listener
		// we use the FileReader class to get the content
		let file = event.target.files[0], reader = new FileReader(), self = this;
		// while the browser loads the file
		reader.onload = function(r){
			let res = r.target.result;	// this is the actual content
			// the format is:
			// Generation {number}:
			// {dimensions}
			// {line1}
			// {line2}
			// {.....}
			// {lineN}
			let split_res = res.split('\n');	// so we split the content in lines
			let gen_row = split_res.shift();	// the first one is the generation line
			let dim_row = split_res.shift();	// the second one is the dimensions line
			let new_board = [];
			// the remaining lines are the board
			// we loop over the lines and over the characters to fill our board
			for (var i = 0; i < split_res.length; i++) {
				let row = [];	// new row
				for (var j = 0; j < split_res[i].length; j++) {
					row.push(split_res[i][j]=='*'?true:false);	// * is alive
				}
				new_board.push(row);	// adding new row to board
			}
			// updating component state
			self.setState({
				  src: r.target.result,
				  dimensions: dim_row,
				  generation: parseInt(gen_row.replace('Generation ', '').replace(':', '')),	// we just get the number from the generation string
				  board: new_board
			});
		}
		reader.readAsText(file);
	}

	/**
	 * Returns the count of the alive neighbours, given a 2D array and the coordinates
	 *
	 * @param {Object} coords - The coordinates object
	 * @param {number} coords.row - The row coordinate
	 * @param {number} coords.col - The column coordinate
	 * @param {Array} data - The 2D array containing the board
	 * @return {number} count - The count of the alive neighbours
	 */
	getAliveNeighboursCount(coords, data) {
		let count = 0;

		// with these 4 variables we manage the boundaries of the board
		// for every cell, the neighbours are in the coordinates range of ±1
		/*
			j-1	j	j+1
		i-1
		i			me
		i+1
		*/
		let row_low_bound = (coords.row-1<0)?0:coords.row-1;
		let row_hig_bound = (coords.row+1>=data.length)?data.length-1:coords.row+1;

		let col_low_bound = (coords.col-1<0)?0:coords.col-1;
		let col_hig_bound = (coords.col+1>=data[0].length)?data[0].length-1:coords.col+1;

		// so we loop in those ranges but avoiding unexising indexes
		for (var i = row_low_bound; i <= row_hig_bound; i++) {
			for (var j = col_low_bound; j <= col_hig_bound; j++) {
				// if it's not me and if the cell is alive, increment the counter
				if (!(i == coords.row && j == coords.col) && data[i][j])
					count++;
			}
		}

		return count;
	}

	// implements the law of the Game of Life
	calculateNextGen() {
		this.setState((state)  => ({generation: state.generation+1}));
		let next_board = [];
		// we loop through every single cell of the current board
		// and create the next gen board considering the laws
		for (var i = 0; i < this.state.board.length; i++) {
			let row = [];
			for (var j = 0; j < this.state.board[i].length; j++) {
				let neighcount = this.getAliveNeighboursCount({row: i, col: j}, this.state.board);
				// this is the core part of the law of the Game of Life
				if (neighcount < 2 || neighcount > 3)
					row.push(false);
				else if (neighcount == 3)
					row.push(true);
				else
					row.push(this.state.board[i][j]);
			}
			next_board.push(row);
		}
		// once completed we update the board
		this.setState({board: next_board});
	}

	render() {
		return (
			<div className="game">
				<FileLoader
					handleChange={this.handleChange}	// the handling function is passed a prop
				/>
				<div className="game-board">
					<Board
						data={this.state.board}
						generation={this.state.generation}
						dimensions={this.state.dimensions}
					/>
				</div>
				<button className="nextgen" onClick={this.calculateNextGen}>Calculate next generation</button>
		</div>
		);
	}
}

// ========================================

// here we render the whole game in the HMTL element with id = root
ReactDOM.render(
	<Game />,
	document.getElementById('root')
);