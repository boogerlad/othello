Vue.config.debug = true;
//benchmark
//add history function
new Vue
(
	{
		el: 'body',
		data:
		{
			initialBoard:
			[
				[null, null,   null  ,   null  ,   null  ,   null  , null, null],
				[null, null,   null  ,   null  ,   null  ,   null  , null, null],
				[null, null,   null  ,   null  , [[3, 4]],   null  , null, null],
				[null, null,   null  ,   true  ,  false  , [[3, 4]], null, null],
				[null, null, [[4, 3]],  false  ,   true  ,   null  , null, null],
				[null, null,   null  , [[4, 3]],   null  ,   null  , null, null],
				[null, null,   null  ,   null  ,   null  ,   null  , null, null],
				[null, null,   null  ,   null  ,   null  ,   null  , null, null],
			],
			board: [],
			visibleMoves: true,
			player: true
		},
		ready: function()
		{
			this.init();
		},
		methods:
		{
			init: function()
			{
				for(var i = 0; i < this.initialBoard.length; ++i)
				{
					this.board.$set(i, []);
					for(var j = 0; j < this.initialBoard[i].length; ++j)
					{
						this.board[i].$set(j, this.initialBoard[i][j]);
					}
				}
				this.player = true;
			},
			play: function(i, j, column)
			{
				if(column !== null && column.constructor === Array)
				{
					this.board[i].$set(j, this.player);
					for(i = 0; i < column.length; ++i)
					{
						this.board[column[i][0]].$set(column[i][1], this.player);
					}
					this.clearPossibilities();
					this.player = !this.player;
					var possibilities = this.calculatePossibilities();
					if(possibilities.length === 0)
					{
						this.player = !this.player;
						possibilities = this.calculatePossibilities();
						if(possibilities.length === 0)
						{
							// alert('game over\nblack: ' + document.getElementsByClassName('one').length + '\nwhite: ' + document.getElementsByClassName('two').length);
							// if(confirm("play again?"))
							// {
							// 	if(mode)
							// 	{
							// 		conn.send('reset');
							// 	}
							// 	else
							// 	{
							// 		reset();
							// 	}
							// }
						}
						else
						{
							alert('No possible moves. Now player' + player2name() + "'s turn.")
						}
					}
					this.plotPossibilities(possibilities);
				}
			},
			clearPossibilities: function()
			{
				for(var i = 0; i < this.board.length; ++i)
				{
					for(var j = 0; j < this.board[i].length; ++j)
					{
						if(this.board[i][j] !== null && this.board[i][j].constructor === Array)
						{
							this.board[i].$set(j, null);
						}
					}
				}
			},
			calculatePossibilities: function()
			{
				var possibilities = [];
				for(var i = 0; i < this.board.length; ++i)
				{
					for(var j = 0; j < this.board[i].length; ++j)
					{
						if(this.board[i][j] === this.player)
						{
							var bigI = i + 1 < this.board.length;
							var bigJ = j + 1 < this.board[i].length;
							var a;
							if(bigJ && this.board[i][j + 1] === !this.player)//if player is true, explicitly check for false, rather than checking for not true which can mean false or null(empty) and give false possibilities
							{//we've already checked if this position has a piece that is opposite of the player's color, so we should keep it in array
								if(a = this.continueSearch([[i, j + 1]], 0, 1))
								{
									possibilities.push(a);
								}
							}
							if(j && this.board[i][j - 1] === !this.player)
							{
								if(a = this.continueSearch([[i, j - 1]], 0, -1))
								{
									possibilities.push(a);
								}
							}
							if(i && j && this.board[i - 1][j - 1] === !this.player)
							{
								if(a = this.continueSearch([[i - 1, j - 1]], -1, -1))
								{
									possibilities.push(a);
								}
							}
							if(i && this.board[i - 1][j] === !this.player)
							{
								if(a = this.continueSearch([[i - 1, j]], -1, 0))
								{
									possibilities.push(a);
								}
							}
							if(i && bigJ && this.board[i - 1][j + 1] === !this.player)
							{
								if(a = this.continueSearch([[i - 1, j + 1]], -1, 1))
								{
									possibilities.push(a);
								}
							}
							if(bigI && j && this.board[i + 1][j - 1] === !this.player)
							{
								if(a = this.continueSearch([[i + 1, j - 1]], 1, -1))
								{
									possibilities.push(a);
								}
							}
							if(bigI && this.board[i + 1][j] === !this.player)
							{
								if(a = this.continueSearch([[i + 1, j]], 1, 0))
								{
									possibilities.push(a);
								}
							}
							if(bigI && bigJ && this.board[i + 1][j + 1] === !this.player)
							{
								if(a = this.continueSearch([[i + 1, j + 1]], 1, 1))
								{
									possibilities.push(a);
								}
							}
						}
					}
				}
				return possibilities;
			},
			plotPossibilities: function(possibilities)
			{
				for(var i = 0; i < possibilities.length; ++i)
				{
					if
					(
						this.board[possibilities[i][1][0]][possibilities[i][1][1]] === null ||
						this.board[possibilities[i][1][0]][possibilities[i][1][1]] === true ||
						this.board[possibilities[i][1][0]][possibilities[i][1][1]] === false
					)
					{
						this.board[possibilities[i][1][0]].$set([possibilities[i][1][1]], possibilities[i][0]);
					}
					else if(this.board[possibilities[i][1][0]][possibilities[i][1][1]].constructor === Array)
					{
						this.board[possibilities[i][1][0]].$set([possibilities[i][1][1]], this.board[possibilities[i][1][0]][possibilities[i][1][1]].concat(possibilities[i][0]));
					}
				}
			},
			continueSearch: function(history, vecX, vecY)
			{
				var i = history[history.length - 1][0] + vecX;
				var j = history[history.length - 1][1] + vecY;
				if(i < 0 || i > this.board.length - 1 || j < 0 || j > this.board[i].length - 1 || this.board[i][j] === this.player)
				{
					return false;
				}
				else
				{
					if(this.board[i][j] === null)
					{
						return [history, [i, j]];
					}
					else if(this.board[i][j] === !this.player)
					{
						history.push([i, j]);
						return this.continueSearch(history, vecX, vecY);
					}
				}
			},
			player2Name: function()
			{
				if(this.player)
				{
					return 'one';
				}
				else
				{
					return 'two';
				}
			}
		}
	}
);