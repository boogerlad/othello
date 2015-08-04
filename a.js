//j column
var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];//i row
var player = false;
var numberOfMoves = [calculatePossibilities(player), 0];

function mergePossibilities(one, two)
{
	if(one === null || typeof one === 'undefined')
	{
		return two;
	}
	else
	{
		var combined = [];
		for(var i = 0; i < one.length - 1; ++i)
		{
			combined.push(one[i]);
		}
		for(var i = 0; i < two.length; ++i)
		{
			combined.push(two[i]);
		}
		return combined;
	}
}

document.getElementById('visibleMoves').onchange = function()
{
	if(this.checked)
	{
		document.styleSheets[0].cssRules[3].style.backgroundImage = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><line x1='1' y1='1' x2='9' y2='9' stroke='red'/><line x1='1' y1='9' x2='9' y2='1' stroke='red'/></svg>\")";
	}
	else
	{
		document.styleSheets[0].cssRules[3].style.backgroundImage = 'none';
	}
};

function htmlToArray()
{
	var boardArray = [];
	var rows = document.getElementsByTagName('tr');
	for(var i = 0; i < rows.length; ++i)
	{
		var row = [];
		for(var j = 0; j < rows[i].children.length; ++j)
		{
			//console.log(rows[i].children[j].id)
			if(rows[i].children[j].className === 'one')
			{
				row.push(false);
			}
			else if(rows[i].children[j].className === 'two')
			{
				row.push(true);
			}
			else if(rows[i].children[j].className === '')
			{
				row.push(null);
			}
		}
		boardArray.push(row);
	}
	return boardArray;
}

function calculatePossibilities(player)
{
	var board = htmlToArray();
	var numMoves = 0;
	var moves = [];
	for(var i = 0; i < board.length; ++i)
	{
		for(var j = 0; j < board[i].length; ++j)
		{
			if(board[i][j] === player)
			{
				var a;
				var bigI = i + 1 < board.length;
				var bigJ = j + 1 < board[i].length;
				if(bigJ && board[i][j + 1] === !player)//if player is true, explicitly check for false, rather than checking for not true which can mean false or null(empty) and give false possibilities
				{
					if(a = continueSearch(board, [[i, j + 1]], player, 0, 1))
					{
						var ex = document.getElementById(letters[a[a.length - 1][0]] + (a[a.length - 1][1] + 1));
						ex.className = 'possible';
						ex.setAttribute('data-history', JSON.stringify(mergePossibilities(JSON.parse(ex.getAttribute('data-history')), a)));
						++numMoves;
						moves.push(a);
					}
				}
				if(j && board[i][j - 1] === !player)
				{
					if(a = continueSearch(board, [[i, j - 1]], player, 0, -1))
					{
						var ex = document.getElementById(letters[a[a.length - 1][0]] + (a[a.length - 1][1] + 1));
						ex.className = 'possible';
						ex.setAttribute('data-history', JSON.stringify(mergePossibilities(JSON.parse(ex.getAttribute('data-history')), a)));
						++numMoves;
						moves.push(a);
					}
				}
				if(i && j && board[i - 1][j - 1] === !player)
				{//we've already checked if this position has a piece that is opposite of the player's color, so we should keep it in array
					if(a = continueSearch(board, [[i - 1, j - 1]], player, -1, -1))
					{
						var ex = document.getElementById(letters[a[a.length - 1][0]] + (a[a.length - 1][1] + 1));
						ex.className = 'possible';
						ex.setAttribute('data-history', JSON.stringify(mergePossibilities(JSON.parse(ex.getAttribute('data-history')), a)));
						++numMoves;
						moves.push(a);
					}
				}
				if(i && board[i - 1][j] === !player)
				{
					if(a = continueSearch(board, [[i - 1, j]], player, -1, 0))
					{
						var ex = document.getElementById(letters[a[a.length - 1][0]] + (a[a.length - 1][1] + 1));
						ex.className = 'possible';
						ex.setAttribute('data-history', JSON.stringify(mergePossibilities(JSON.parse(ex.getAttribute('data-history')), a)));
						++numMoves;
						moves.push(a);
					}
				}
				if(i && bigJ && board[i - 1][j + 1] === !player)
				{
					if(a = continueSearch(board, [[i - 1, j + 1]], player, -1, 1))
					{
						var ex = document.getElementById(letters[a[a.length - 1][0]] + (a[a.length - 1][1] + 1));
						ex.className = 'possible';
						ex.setAttribute('data-history', JSON.stringify(mergePossibilities(JSON.parse(ex.getAttribute('data-history')), a)));
						++numMoves;
						moves.push(a);
					}
				}
				if(bigI && j && board[i + 1][j - 1] === !player)
				{
					if(a = continueSearch(board, [[i + 1, j - 1]], player, 1, -1))
					{
						var ex = document.getElementById(letters[a[a.length - 1][0]] + (a[a.length - 1][1] + 1));
						ex.className = 'possible';
						ex.setAttribute('data-history', JSON.stringify(mergePossibilities(JSON.parse(ex.getAttribute('data-history')), a)));
						++numMoves;
						moves.push(a);
					}
				}
				if(bigI && board[i + 1][j] === !player)
				{
					if(a = continueSearch(board, [[i + 1, j]], player, 1, 0))
					{
						var ex = document.getElementById(letters[a[a.length - 1][0]] + (a[a.length - 1][1] + 1));
						ex.className = 'possible';
						ex.setAttribute('data-history', JSON.stringify(mergePossibilities(JSON.parse(ex.getAttribute('data-history')), a)));
						++numMoves;
						moves.push(a);
					}
				}
				if(bigI && bigJ && board[i + 1][j + 1] === !player)
				{
					if(a = continueSearch(board, [[i + 1, j + 1]], player, 1, 1))
					{
						var ex = document.getElementById(letters[a[a.length - 1][0]] + (a[a.length - 1][1] + 1));
						ex.className = 'possible';
						ex.setAttribute('data-history', JSON.stringify(mergePossibilities(JSON.parse(ex.getAttribute('data-history')), a)));
						++numMoves;
						moves.push(a);
					}
				}
			}
		}
	}
	//console.log(moves)
	return numMoves;
}

function continueSearch(board, history, player, vecX, vecY)
{
	var i = history[history.length - 1][0] + vecX;
	var j = history[history.length - 1][1] + vecY;
	if(i < 0 || i > board.length - 1 || j < 0 || j > board[i].length - 1 || board[i][j] === player)
	{
		return false;
	}
	else
	{
		history.push([i, j]);
		if(board[i][j] === null)
		{
			return history;
		}
		else if(board[i][j] === !player)
		{
			return continueSearch(board, history, player, vecX, vecY);
		}
	}
}

function player2class(player)
{
	if(player)
	{
		return 'two';
	}
	else
	{
		return 'one';
	}
}

document.addEventListener
(
	'click',
	function(e)
	{
		if(e.target.className === 'possible')
		{
			console.log(player2class(player))
			console.log(numberOfMoves[player === true ? 1 : 0])
			var possibilities = JSON.parse(e.target.getAttribute('data-history'));
			e.target.removeAttribute('data-history');
			e.target.removeAttribute('class');
			for(var i = 0; i < possibilities.length; ++i)
			{
				document.getElementById(letters[possibilities[i][0]] + (possibilities[i][1] + 1)).className = player2class(player);
			}
			var exes = document.getElementsByClassName('possible');
			for(var i = exes.length - 1; i >= 0; --i)
			{
				exes[i].removeAttribute('data-history');
				exes[i].removeAttribute('class');
			}
			player = !player;
			numberOfMoves[player === true ? 1 : 0] = calculatePossibilities(player);
			if(numberOfMoves[0] + numberOfMoves[1] === 0)
			{
				alert('game over\nblack: ' + document.getElementsByClassName('one').length + '\nwhite: ' + document.getElementsByClassName('two').length);
			}
		}
	},
	false
);