function toggleVisibility(element)
{
	if(element.checked)
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
}
document.getElementById('visibleMoves').onchange = function(){toggleVisibility(this)};