var taskManager = taskManager || {};

taskManager.displayItems = {
	init: function () {
		this.eventHandlers();
	},
	eventHandlers: function() {
		var menuTitle = document.getElementById("mobileNavLink");
		var menu = document.getElementById("topMenu");

		menuTitle.onmouseover = function() {
			console.log(menu.getAttribute("display"));
			menu.style.display = (menu.getAttribute("display") === "block") ? "none" : "block";
		}
	}
};

if (document && document.getElementsByTagName && document.getElementById && document.body) {
	taskManager.displayItems.init();
}