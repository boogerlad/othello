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
	var rows = document.getElementById('bored').rows;
	for(var i = 0; i < rows.length; ++i)
	{
		var row = [];
		for(var j = 0; j < rows[i].cells.length; ++j)
		{
			if(rows[i].cells[j].className === 'one')
			{
				row.push(false);
			}
			else if(rows[i].cells[j].className === 'two')
			{
				row.push(true);
			}
			else if(rows[i].cells[j].className === '')
			{
				row.push(null);
			}
		}
		boardArray.push(row);
	}
	return boardArray;
}

var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];//i row, j column

function calculatePossibilities(player)
{
	function plotPossibility(a)
	{
		if(a)
		{
			var ex = document.getElementById(letters[a[a.length - 1][0]] + (a[a.length - 1][1] + 1));
			ex.className = 'possible';
			ex.setAttribute('data-history', JSON.stringify(mergePossibilities(JSON.parse(ex.getAttribute('data-history')), a)));
			++numMoves;
		}
	}
	var board = htmlToArray();
	var numMoves = 0;
	for(var i = 0; i < board.length; ++i)
	{
		for(var j = 0; j < board[i].length; ++j)
		{
			if(board[i][j] === player)
			{
				var bigI = i + 1 < board.length;
				var bigJ = j + 1 < board[i].length;
				if(bigJ && board[i][j + 1] === !player)//if player is true, explicitly check for false, rather than checking for not true which can mean false or null(empty) and give false possibilities
				{//we've already checked if this position has a piece that is opposite of the player's color, so we should keep it in array
					plotPossibility(continueSearch(board, [[i, j + 1]], player, 0, 1));
				}
				if(j && board[i][j - 1] === !player)
				{
					plotPossibility(continueSearch(board, [[i, j - 1]], player, 0, -1));
				}
				if(i && j && board[i - 1][j - 1] === !player)
				{
					plotPossibility(continueSearch(board, [[i - 1, j - 1]], player, -1, -1));
				}
				if(i && board[i - 1][j] === !player)
				{
					plotPossibility(continueSearch(board, [[i - 1, j]], player, -1, 0));
				}
				if(i && bigJ && board[i - 1][j + 1] === !player)
				{
					plotPossibility(continueSearch(board, [[i - 1, j + 1]], player, -1, 1));
				}
				if(bigI && j && board[i + 1][j - 1] === !player)
				{
					plotPossibility(continueSearch(board, [[i + 1, j - 1]], player, 1, -1));
				}
				if(bigI && board[i + 1][j] === !player)
				{
					plotPossibility(continueSearch(board, [[i + 1, j]], player, 1, 0));
				}
				if(bigI && bigJ && board[i + 1][j + 1] === !player)
				{
					plotPossibility(continueSearch(board, [[i + 1, j + 1]], player, 1, 1));
				}
			}
		}
	}
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


var player = false;
var mode = false;
var me = true;
remote = false;
document.addEventListener
(
	'click',
	function(e)
	{
		if(e.target.className === 'possible' && me || remote)
		{
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
			if(calculatePossibilities(player = !player) === 0)
			{
				if(calculatePossibilities(player = !player) === 0)
				{
					alert('game over\nblack: ' + document.getElementsByClassName('one').length + '\nwhite: ' + document.getElementsByClassName('two').length);
					if(confirm("play again?"))
					{
						if(mode)
						{
							conn.send('reset');
						}
						else
						{
							reset();
						}
					}
					else if(mode)
					{
						call.close();
						conn.close();
						peer = new Peer(peer.id, {key: 'ed88f955-5b7c-448d-bf99-086cd4b7806d'});
						//do more stuff
						//perhaps move to a function?
					}
				}
				else
				{
					alert('No possible moves. Now player' + player2class(player) + "'s turn.")
				}
			}
			else if(mode)
			{
				if(!remote)
				{
					me = false;
					conn.send(e.target.id);
				}
				else
				{
					remote = false;
					me = true;
				}
			}
		}
	},
	false
);


function reset()
{
	var rows = document.getElementById('bored').rows;
	for(var i = 0; i < rows.length; ++i)
	{
		for(var j = 0; j < rows[i].cells.length; ++j)
		{
			rows[i].cells[j].removeAttribute('data-history');
			rows[i].cells[j].removeAttribute('class');
		}
	}
	document.getElementById('C5').setAttribute('data-history', JSON.stringify([[3,4],[2,4]]));
	document.getElementById('C5').className = 'possible';
	document.getElementById('D4').className = 'one';
	document.getElementById('D5').className = 'two';
	document.getElementById('D6').setAttribute('data-history', JSON.stringify([[3,4],[3,5]]));
	document.getElementById('D6').className = 'possible';
	document.getElementById('E3').setAttribute('data-history', JSON.stringify([[4,3],[4,2]]));
	document.getElementById('E3').className = 'possible';
	document.getElementById('E5').className = 'one';
	document.getElementById('E4').className = 'two';
	document.getElementById('F4').setAttribute('data-history', JSON.stringify([[4,3],[5,3]]));
	document.getElementById('F4').className = 'possible';
}
var opponents = document.getElementById('opponents');
var interval;
document.getElementById('local').onclick = function()
{
	mode = false;
	reset();
	opponents.className = 'hidden';
	document.getElementById('join').className = 'hidden';
	document.getElementById('camera').className = 'hidden';
	window.clearInterval(interval);
	peer.destroy();
	conn = null;
	call = null;
};

var peer = null;
var conn;
var call;
var ok = null;
var front = true;
document.getElementById('camera').onclick = function()
{
	front = !front;
	if(front === false)
	{
		this.innerHTML = 'Back Camera';
	}
	else
	{
		this.innerHTML = 'Front Camera';
	}
};

var constraints = 
{
	audio: true,
	video:
	{
		facingMode: (front? "user" : "environment")
	}
};

function cool(conn)
{
	window.conn = conn;
	conn.on
	(
		'open',
		function()
		{
			conn.on
			(
				'data',
				function(data)
				{
					if(data === 'reset')
					{
						reset();
					}
					else
					{
						remote = true;
						document.getElementById(data).click();
					}
				}
			);
			window.clearInterval(interval);
			if(ok != null)//if ok is null, that means we're still waiting
			{
				//peer.disconnect();
				//alert('true or forth')
			}
			else
			{
				//now we know this happens...... fuck
				//alert('fuk')
			}
			opponents.className = 'hidden';
			document.getElementById('join').className = 'hidden';
			document.getElementById('camera').className = 'hidden';
		}
	);
}

document.getElementById('create').onclick = function()
{
	mode = true
	if(peer === null)
	{
		peer = new Peer(prompt('enter an id in the form of "unique name - preferred skill level" so that an opponent can find you'), {key: 'ed88f955-5b7c-448d-bf99-086cd4b7806d'});
	}
	else
	{
		peer.destroy();
		conn = null;
		call = null;
		peer = new Peer(prompt('enter an id in the form of "unique name - preferred skill level" so that an opponent can find you'), {key: 'ed88f955-5b7c-448d-bf99-086cd4b7806d'});
	}
	interval = window.setInterval(populateOpponents, 1000);
	peer.on('connection', cool);
	peer.on
	(
		'call',
		function(call)
		{
			var promise = navigator.mediaDevices.getUserMedia(constraints);
			promise.then
			(
				function(mediaStream)
				{
					call.answer(mediaStream);
					ok = true;
					//alert(peer.disconnected);
					if(!peer.disconnected)
					{
						//peer.disconnect();
					}
					call.on('stream', addStream);
				}
			);
			promise.catch
			(
				function(e)
				{
					ok = false;
				}
			);
		}
	);
	peer.on
	(
		'error',
		function(err)
		{
			switch(err.type)
			{
				case 'browser-incompatible':
				{
					alert('Can only play locally. This browser doesn\'t support WebRTC. Install bowser if on ios.');
					break;
				}
				case 'unavailable-id':
				case 'invalid-id':
				{
					peer.destroy();
					conn = null;
					call = null;
					alert('invalid characters for id used or id is already taken');
					peer = new Peer(prompt('enter an id in the form of "unique name - preferred skill level" so that an opponent can find you'), {key: 'ed88f955-5b7c-448d-bf99-086cd4b7806d'})
				}
			}
		}
	);
	document.getElementById('join').className = '';
	document.getElementById('camera').className = '';
}

document.getElementById('join').onclick = function()
{
	me = false;
	var promise = navigator.mediaDevices.getUserMedia(constraints);
	promise.then
	(
		function(mediaStream)
		{
			peer.call(opponents.options[opponents.selectedIndex].text, mediaStream).on('stream', addStream);
			ok = true;
		}
	);
	promise.catch
	(
		function(e)
		{
			ok = false;
		}
	);
	cool(peer.connect(opponents.options[opponents.selectedIndex].text));
}

function addStream(stream)
{
	var video = document.getElementById('u');
	video.src = window.URL.createObjectURL(stream);
	video.onloadedmetadata = function(e)
	{
		video.play();
	}
}

function populateOpponents()
{
	peer.listAllPeers
	(
		function(list)
		{
			opponents.className = '';
			while(opponents.firstChild)
			{
				opponents.removeChild(opponents.firstChild);
				//need to fix
			}
			for(var i = 0; i < list.length; ++i)
			{
				if(list[i] !== peer.id)
				{
					var opt = document.createElement('option');
					opt.value = i;
					opt.innerHTML = list[i];
					opponents.appendChild(opt);
				}
			}
		}
	);
}