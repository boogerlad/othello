function toggleVisibility(element)
{
	var possibilities = document.getElementsByClassName('possible');
	var visibility = element.checked ? 'visible' : 'hidden';
	for(var i = 0; i < possibilities.length; ++i)
	{
		possibilities[i].style.visibility = visibility;
	}
}
document.getElementById('visibleMoves').onchange = function(){toggleVisibility(this)};