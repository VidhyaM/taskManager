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
		taskManager.utils.getElem("task_id").value = localStorage.length;
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
		var taskCount = localStorage.length;
		if (taskCount == 0) {
			taskManager.utils.getElem("noTasks").className = "";
		} else {
			var tasksItems = "<ul class='tasksList'>";
			for(var i = 0; i < localStorage.length; i++) {
				tasksItems += "<li class='tasksDisp'>";
				var taskRecordObj = JSON.parse(localStorage[i]);
				for (var key in taskRecordObj) {
					if (key === "task_id") {
						var tasksEditDelItems = "<p class='clearFloat'><span class='editDelTask'><span class='editTask'><a href='#' id='edit" + taskRecordObj[key] + "' onclick='editTask(" + taskRecordObj[key] + ");'>Edit</a></span><span class='delTask'><a href='#' id='delete" + taskRecordObj[key] + "' onclick='deleteTask(" + taskRecordObj[key] + ");'>Delete</a></span></span></p>";
						continue;
					}
					var keyLbl = key.replace('_', ' ');
					tasksItems += "<p><span class='taskLabel'>" + keyLbl + ": </span><span class='taskContent'>" + taskRecordObj[key] + "</span></p>";
				}
				tasksItems += tasksEditDelItems + "</li>";
			}
			tasksItems += "</ul>";
			taskManager.utils.getElem("listTasks").innerHTML = tasksItems;
		}
	},

	eventHandlers: function() {
		var formObj = taskManager.utils.getElem(this.fields.formAddTask);
		var that = taskManager.updateTasks;
		var addTaskLnk = taskManager.utils.getElem("addTaskLink");
		var addYourTaskLink = taskManager.utils.getElem("addYourTaskLink");
		var addEditLink = taskManager.utils.getElem("addEditLink");
		var listTaskLnk = taskManager.utils.getElem("listTaskLink");
		
		formObj.onsubmit = function() {
			var errFlag = false;
			formFieldsValObj = that.getFormFields(formObj);
			that.saveTasks(formFieldsValObj);
			redirectToTasksList(true);
			return errFlag;
		},

		addTaskForm = function () {
			taskManager.utils.getElem("addTaskContent").className = "";
			taskManager.utils.getElem("listTaskContent").className = "hide";
			taskManager.utils.getElem("addEditSuccess").className = "hide";
			taskManager.utils.getElem("task_id").value = localStorage.length;
			listTaskLnk.className = "";
			this.className = "active";
		},

		redirectToTasksList = function (msgFlag) {
			taskManager.utils.getElem("addTaskContent").className = "hide";
			taskManager.utils.getElem("listTaskContent").className = "";
			addTaskLnk.className = "";
			listTaskLnk.className = "active";
			taskManager.utils.getElem("addEditSuccess").className = (msgFlag === true) ? "" : "hide";
			that.listTasks();
		},

		addTaskLnk.onclick = addTaskForm,

		addYourTaskLink.onclick = addTaskForm,

		addEditLink.onclick = addTaskForm,

		listTaskLnk.onclick = redirectToTasksList,

		editTask = function (taskNum) {
			console.log("Edit operation clicked for taskID: " + taskNum);
		},

		deleteTask = function (taskNum) {
			console.log("Delete operation for taskID: " + taskNum);
		}
	}
};

window.onload = function() {
	taskManager.displayItems.init();
	taskManager.updateTasks.init();
};