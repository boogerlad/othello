document.getElementById('visibleMoves').onchange = function()
{
	var exes = document.getElementsByClassName('possible');
	if(this.checked)
	{
		for(var i = 0; i < exes.length; ++i)
		{
			exes[i].style.backgroundImage = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><line x1='1' y1='1' x2='9' y2='9' stroke='red'/><line x1='1' y1='9' x2='9' y2='1' stroke='red'/></svg>\")";
		}
	}
	else
	{
		for(var i = 0; i < exes.length; ++i)
		{
			exes[i].style.backgroundImage = "none";
		}
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
			if(rows[i].children[j].className === 'one')
			{
				row.push(true);
			}
			else if(rows[i].children[j].className === 'two')
			{
				row.push(false);
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
	var possibilities = [];
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
						possibilities.push(a);//I could modify the dom here...
					}
				}
				if(j && board[i][j - 1] === !player)
				{
					if(a = continueSearch(board, [[i, j - 1]], player, 0, -1))
					{
						possibilities.push(a);
					}
				}
				if(i && j && board[i - 1][j - 1] === !player)
				{//we've already checked if this position has a piece that is opposite of the player's color, so we should keep it in array
					if(a = continueSearch(board, [[i - 1, j - 1]], player, -1, -1))
					{
						possibilities.push(a);
					}
				}
				if(i && board[i - 1][j] === !player)
				{
					if(a = continueSearch(board, [[i - 1, j]], player, -1, 0))
					{
						possibilities.push(a);
					}
				}
				if(i && bigJ && board[i - 1][j + 1] === !player)
				{
					if(a = continueSearch(board, [[i - 1, j + 1]], player, -1, 1))
					{
						possibilities.push(a);
					}
				}
				if(bigI && j && board[i + 1][j - 1] === !player)
				{
					if(a = continueSearch(board, [[i + 1, j - 1]], player, 1, -1))
					{
						possibilities.push(a);
					}
				}
				if(bigI && board[i + 1][j] === !player)
				{
					if(a = continueSearch(board, [[i + 1, j]], player, 1, 0))
					{
						possibilities.push(a);
					}
				}
				if(bigI && bigJ && board[i + 1][j + 1] === !player)
				{
					if(a = continueSearch(board, [[i + 1, j + 1]], player, 1, 1))
					{
						possibilities.push(a);
					}
				}
			}
		}
	}
	//console.log(possibilities)
	draw(possibilities, 'possible');
	return possibilities;
}

function continueSearch(board, history, player, vecX, vecY)
{
	if(board[history[history.length - 1][0] + vecX][history[history.length - 1][1] + vecY] === player)
	{
		return false;
	}
	else
	{
		history.push([history[history.length - 1][0] + vecX, history[history.length - 1][1] + vecY]);
		if(board[history[history.length - 1][0] + vecX][history[history.length - 1][1] + vecY] === null)
		{
			return history;
		}
		else if(board[history[history.length - 1][0] + vecX][history[history.length - 1][1] + vecY] === !player)
		{
			return continueSearch(board, history, player, vecX, vecY);
		}
	}
}

var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function draw(stuff, what)
{
	for(var i = 0; i < stuff.length; ++i)
	{
		document.getElementById(letters[stuff[i][stuff[i].length - 1][0]] + (stuff[i][stuff[i].length - 1][1] + 1)).className = what;
	}
}

function flip(bird)
{

}

function player2class(player)
{
	if(player)
	{
		return 'one';
	}
	else
	{
		return 'two';
	}
}

var player = true;

document.addEventListener
(
	'click',
	function(e)
	{
		if(e.target.className === 'possible')
		{
			alert('bu');
		}
	},
	false
);

calculatePossibilities(player);

// $(".possible").click
// (
// 	function()
// 	{
// 		this.className = player2class(player);
// 		flip(this.id);
// 		//clear all possibles
// 		//flip until hit origin
// 		//change player
// 		//calculatePossibilities
// 	}
// );