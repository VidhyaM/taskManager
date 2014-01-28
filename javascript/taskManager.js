var taskManager = taskManager || {};

taskManager.utils = {
	getElem: function(id){
		return document.getElementById(id);
	}	
}

taskManager.displayItems = {
	init: function () {
		var that = taskManager.updateTasks;
		this.checklocalStorageSupport();
		this.eventHandlers();
		this.getTaskCreatedDate();
		var currentTaskArray = that.getTasks();
		var tasks = JSON.parse(currentTaskArray);
		console.log("Length of the task: " + tasks.length);
		taskManager.utils.getElem("task_id").value = tasks.length;
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
	
	getTasks: function(){
		var tasks = localStorage.getItem('tasks');
		console.log(tasks);
		if(tasks == undefined){
			tasks = {length: 0, tasks_list:[]};
			tasks = JSON.stringify(tasks);
		}
		return tasks;
	},

	saveTasks: function(formFieldsValObj) {
		formFieldJSON = JSON.stringify(formFieldsValObj);
		var tasks = this.getTasks();
		console.log(tasks);
		tasks = JSON.parse(tasks);
		
		tasks.tasks_list[tasks.length] = formFieldJSON;
		tasks.length = tasks.length + 1;
		localStorage.setItem('tasks', JSON.stringify(tasks));
	},

	listTasks: function() {
		console.log("Listing of tasks");
		var tasks = JSON.parse(this.getTasks());
		var taskCount = tasks.length;
		if (taskCount == 0) {
			taskManager.utils.getElem("noTasks").className = "";
		} else {
			taskManager.utils.getElem("noTasks").className = "hide";
			var tasksItems = "<ul class='tasksList'>";
			for(var i = 0; i < tasks.length; i++) {
				tasksItems += "<li class='tasksDisp'>";
				var taskRecordObj = JSON.parse(tasks.tasks_list[i]);
				for (var key in taskRecordObj) {
					if (key === "task_id") {
						var tasksEditDelItems = "<p class='clearFloat'><span class='editDelTask'><span class='editTask'><a href='#' id='edit" + i + "' onclick='editTask(" + i + ");'>Edit</a></span><span class='delTask'><a href='#' id='delete" + i + "' onclick='deleteTask(" + i + ");' onmouseover='showWarningDeleteTask(" + i + ");' onmouseout='hideWarningDeleteTask(" + i + ");'>Delete</a><span class='delTaskWarn hide'>Deletion of this task can not be undone. Please make sure before you delete.</span</span></span></p>";
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
			taskManager.utils.getElem("form_add_task").reset();
			taskManager.displayItems.getTaskCreatedDate();
			taskManager.utils.getElem("addTaskContent").className = "";
			taskManager.utils.getElem("listTaskContent").className = "hide";
			taskManager.utils.getElem("addEditSuccess").className = "hide";
			taskManager.utils.getElem("deleteSuccess").className = "hide";
			var currentTaskArray = that.getTasks();
			var tasks = JSON.parse(currentTaskArray);
			console.log("Length of the task: " + tasks.length);
			taskManager.utils.getElem("task_id").value = tasks.length;
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
			taskManager.utils.getElem("deleteSuccess").className = "";
			taskManager.utils.getElem("addEditSuccess").className = "hide";
			console.log("Delete operation for taskID: " + taskNum);
			var currentTaskArray = that.getTasks();
			var tasks = JSON.parse(currentTaskArray);
			tasks.tasks_list.splice(taskNum, 1);
			tasks.length = tasks.length - 1;
			if(tasks.length <= 0) {
				tasks.length = 0;
			}
			console.log("Tasks count after deletion: " + tasks.length);
			localStorage.setItem('tasks', JSON.stringify(tasks));
			console.log(tasks.tasks_list.length);
			that.listTasks();
		},

		showWarningDeleteTask = function(taskNum) {
			taskManager.utils.getElem("delete" + taskNum).nextSibling.className = "delTaskWarn";
		},

		hideWarningDeleteTask = function(taskNum) {
			taskManager.utils.getElem("delete" + taskNum).nextSibling.className = "delTaskWarn hide";
		}
	}
};

window.onload = function() {
	taskManager.displayItems.init();
	taskManager.updateTasks.init();
};