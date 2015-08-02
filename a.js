document.getElementById('visibleMoves').onchange = function()
{
	if(this.checked)
	{
		$(".possible").each
		(
			function()
			{
				$(this).css('background-image', "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><line x1='1' y1='1' x2='9' y2='9' stroke='red'/><line x1='1' y1='9' x2='9' y2='1' stroke='red'/></svg>\")");
			}
		);
	}
	else
	{
		$(".possible").each
		(
			function()
			{
				$(this).css('background-image', "none");
			}
		);
	}
};

function htmlToArray()
{
	var boardArray = [];
	$('table tr').each
	(
		function()
		{
			var row = [];
			$(this).children().each
			(
				function()
				{
					if(this.className === 'one')
					{
						row.push(true);
					}
					else if(this.className === 'two')
					{
						row.push(false);
					}
					else if(this.className === '')
					{
						row.push(null);
					}
				}
			);
			boardArray.push(row);
		}
	);
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
					if(a = continueSearch(board, i, j + 1, player, 0, 1))
					{
						possibilities.push(a);//I could modify the dom here...
					}
				}
				if(j && board[i][j - 1] === !player)
				{
					if(a = continueSearch(board, i, j - 1, player, 0, -1))
					{
						possibilities.push(a);
					}
				}
				if(i && j && board[i - 1][j - 1] === !player)
				{
					if(a = continueSearch(board, i - 1, j - 1, player, -1, -1))
					{
						possibilities.push(a);
					}
				}
				if(i && board[i - 1][j] === !player)
				{
					if(a = continueSearch(board, i - 1, j, player, -1, 0))
					{
						possibilities.push(a);
					}
				}
				if(i && bigJ && board[i - 1][j + 1] === !player)
				{
					if(a = continueSearch(board, i - 1, j + 1, player, -1, 1))
					{
						possibilities.push(a);
					}
				}
				if(bigI && j && board[i + 1][j - 1] === !player)
				{
					if(a = continueSearch(board, i + 1, j - 1, player, 1, -1))
					{
						possibilities.push(a);
					}
				}
				if(bigI && board[i + 1][j] === !player)
				{
					if(a = continueSearch(board, i + 1, j, player, 1, 0))
					{
						possibilities.push(a);
					}
				}
				if(bigI && bigJ && board[i + 1][j + 1] === !player)
				{
					if(a = continueSearch(board, i + 1, j + 1, player, 1, 1))
					{
						possibilities.push(a);
					}
				}
			}
		}
	}
	draw(possibilities);
	return possibilities;
}

function continueSearch(board, i, j, player, vecX, vecY)
{
	if(board[i + vecX][j + vecY] === player)
	{
		return false;
	}
	else if(board[i + vecX][j + vecY] === null)
	{
		return [i + vecX, j + vecY];
	}
	else if(board[i + vecX][j + vecY] === !player)
	{
		return continueSearch(board, i + vecX, j + vecY, player, vecX, vecY);
	}
}

function draw(possibilities)
{
	var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
	for(var i = 0; i < possibilities.length; ++i)
	{
		$('#' + letters[possibilities[i][0]] + (possibilities[i][1] + 1)).attr('class', 'possible');
	}
}

calculatePossibilities(true);

$(".possible").click
(
	function()
	{
		//
	}
);