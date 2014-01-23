var taskManager = taskManager || {};

taskManager.utils = {
	getElem: function(id){
		return document.getElementById(id);
	}	
}

taskManager.displayItems = {
	init: function () {
		this.checklocalStorageSupport();
		this.eventHandlers();
		this.getTaskCreatedDate();
	},
	checklocalStorageSupport: function() {
		if(window.localStorage) {
			taskManager.utils.getElem("hasLocalStorage").className = "message" + ((window.localStorage) ? "" : " hide");
		} else {
			taskManager.utils.getElem("hasNoLocalStorage").className = "message error" + ((window.localStorage) ? "" : " hide");
		}
	},
	getTaskCreatedDate: function () {
		var taskCreatedTime = new Date();
		var taskCreatedDate = taskCreatedTime.getDate() + "/" + (taskCreatedTime.getMonth() + 1) + "/" + taskCreatedTime.getFullYear();
		taskManager.utils.getElem("task_created").value = taskCreatedDate;
	},
	eventHandlers: function() {
		var menuTitle = taskManager.utils.getElem("mobileNavLink");
		var menu = taskManager.utils.getElem("topMenu");

		menuTitle.onclick = function() {
			menu.style.display = (menu.style.display === "block") ? "none" : "block";
		}
	}
};

taskManager.updateTasks = {
	fields: {
		formAddTask: "form_add_task",
	},

	init: function () {
		this.eventHandlers();
	},

	getFormFields: function(formObj) {
		var formFieldName, formFieldValue, formFieldsValObj = {};
		var formFields = formObj.getElementsByClassName("inputControl");
		var formFieldsLength = formFields.length;
		for(var i = 0; i < formFieldsLength; i++) {
			formFieldName = formObj[i].name;
			formFieldValue = formObj[i].value;
			formFieldsValObj[formFieldName] = formFieldValue;
		}
		return formFieldsValObj;
	},

	saveTasks: function(formFieldsValObj) {
		formFieldJSON = JSON.stringify(formFieldsValObj);
		localStorage[localStorage.length] = formFieldJSON;
	},

	listTasks: function() {
		var tasksItems = "";
		for(var i = 0; i < localStorage.length; i++) {
			tasksItems += localStorage[i];
		}
		taskManager.utils.getElem("listTasks").innerHTML = tasksItems;
	},

	eventHandlers: function() {
		var formObj = taskManager.utils.getElem(this.fields.formAddTask);
		var that = taskManager.updateTasks;
		var addTaskLnk = taskManager.utils.getElem("addTaskLink");
		var listTaskLnk = taskManager.utils.getElem("listTaskLink");
		formObj.onsubmit = function() {
			formFieldsValObj = that.getFormFields(formObj);
			that.saveTasks(formFieldsValObj);
			return false;
		},

		addTaskLnk.onclick = function() {
			taskManager.utils.getElem("addTaskContent").className = "";
			taskManager.utils.getElem("listTaskContent").className = "hide";
			listTaskLnk.className = "";
			this.className = "active";
		},

		listTaskLnk.onclick = function() {
			taskManager.utils.getElem("addTaskContent").className = "hide";
			taskManager.utils.getElem("listTaskContent").className = "";
			addTaskLnk.className = "";
			this.className = "active";
			that.listTasks();
		}
	}
};

window.onload = function() {
	taskManager.displayItems.init();
	taskManager.updateTasks.init();
};