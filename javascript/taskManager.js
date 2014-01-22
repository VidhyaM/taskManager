var taskManager = taskManager || {};

taskManager.displayItems = {
	init: function () {
		this.eventHandlers();
	},
	eventHandlers: function() {
		var menuTitle = document.getElementById("mobileNavLink");
		var menu = document.getElementById("topMenu");

		menuTitle.onclick = function() {
			menu.style.display = (menu.style.display === "block") ? "none" : "block";
		}
	}
};

if (document && document.getElementsByTagName && document.getElementById && document.body) {
	taskManager.displayItems.init();
}