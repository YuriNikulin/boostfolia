$('.b-header__menu-toggle').click(function() {
	$('.side-menu').toggleClass("side-menu--opened");
	$(this).toggleClass("b-header__menu-toggle--opened")
})