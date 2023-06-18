const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const errorMessage = document.getElementById("error-message");
const taskCounterEl = document.getElementById("tasks-added-counter");
const completeTaskCounterEL = document.getElementById("complete-task-counter");
const incompleteTaskCounterEL = document.getElementById("incomplete-task-counter");

// Business Data
let taskListData = {};
let priority = 0;
let id = 0;
let taskCounter = 0;
let completeTaskCounter = 0;
let incompleteTaskCounter = 0;

// Task Validation Method
function taskValidator() {
  const task = inputBox.value.trim();
  const isPresent = Object.values(taskListData).some(
    (item) => item.taskText === task.toLowerCase()
  );
  if (task === "") {
    displayErrorMessage("You must write something!");
  } else if (task.length > 20) {
    displayErrorMessage("You have exceeded 20 characters!");
  } else if (
    isPresent
  ) {
    displayErrorMessage("This task already exists!");
  } else {
    clearErrorMessage();
    addToTaskList();
  }
  inputBox.value = "";
  saveData();
}

// Tasklist Render Methods
function addToTaskList() {
  incrementTaskCounter();
  incrementIncompleteTaskCounter();
  let li = document.createElement("li");
  li.innerHTML = inputBox.value;
  listContainer.appendChild(li);
  let editTaskBtn = document.createElement("span");
  editTaskBtn.id = "edit-task-btn";
  editTaskBtn.innerHTML = "Edit";
  li.appendChild(editTaskBtn);
  let deleteTaskBtn = document.createElement("span");
  deleteTaskBtn.id = "delete-task-btn";
  deleteTaskBtn.innerHTML = "\u00d7";
  editTaskBtn.addEventListener("click", handleEditTask);
  li.appendChild(deleteTaskBtn);
  let increasePriority = document.createElement("button");
  increasePriority.id = id;
  increasePriority.className = "priority-btn";
  increasePriority.innerHTML = `Increase Priority`;
  li.appendChild(increasePriority);
  increasePriority.addEventListener("click", () => handleIncreasePriority(event, increasePriority.id));
  let decreasePriority = document.createElement("button");
  decreasePriority.id = id;
  decreasePriority.class = "priority-btn-";
  decreasePriority.id = decreasePriority.innerHTML = `Decrease Priority`;
  li.appendChild(decreasePriority);
  decreasePriority.addEventListener("click", () => handleDecreasePriority(event, decreasePriority.id));
  taskListData[id] = {
    priority: priority,
    taskText: inputBox.value.toLowerCase(),
    id: id
  };
  incrementPriority();
  incrementID();
  //taskListData.push(inputBox.value.toLowerCase());
}

function handleIncreasePriority(e, taskId) {
  e.target.stopPropagation;
  taskId = parseInt(taskId);
  let taskPriorityData = taskListData[taskId].priority
  if (taskPriorityData < taskCounter) {
    taskPriorityData++;
    saveData();
  } else {
    alert("Priority cannot be below 0.")
  }
}

function handleDecreasePriority(e, taskId) {
  e.target.stopPropagation;
  taskId = parseInt(taskId);
  if (taskListData[taskId]) {
    let taskPriorityData = taskListData[taskId].priority;
    if (taskPriorityData > 0) {
      taskPriorityData--;
      saveData();
    } else {
      alert("Priority cannot be below 0.");
    }
  }
}

function printTaskList() {
  console.log(taskListData)
}
// Event Listeners
listContainer.addEventListener("click", taskEvent, false);
inputBox.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    taskValidator();
  }
});

// Task handling Methods
function taskEvent(e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    if (e.target.classList.contains("checked")) {
      incrementCompleteTaskCounter();
      decrementIncompleteTaskCounter();
    } else {
      decrementCompleteTaskCounter();
      incrementIncompleteTaskCounter();
    }
    saveData();
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    if (e.target.parentElement.classList.contains("checked")) {
      decrementCompleteTaskCounter();
    }
    if (incompleteTaskCounter !== 0) {
      decrementIncompleteTaskCounter();
    }
    decrementPriority();
    decrementTaskCounter();
    saveData();
  }
}

function handleEditTask(e) {
  e.stopPropagation();
  const parentElement = e.target.parentElement;
  const taskTextElement = parentElement.firstChild;

  const taskText = taskTextElement.textContent;
  const newTaskText = prompt("Edit task:", taskText).trim();

  if (
    newTaskText !== null &&
    newTaskText !== "" &&
    newTaskText.length <= 20 &&
    !Object.values(taskListData).some(
      (item) => item.taskText === newTaskText.toLowerCase()
    )
  ) {
    taskTextElement.textContent = newTaskText;
    const taskId = parseInt(parentElement.querySelector("button").id);
    taskListData[taskId].taskText = newTaskText.toLowerCase();
    saveData();
  } else {
    alert("Your input cannot be something that is either already a task, or is empty (including whitespaces).")
  }
}

// Counter Display
function updateCounters() {
  taskCounterEl.innerHTML = `${taskCounter} Task(s) Added`;
  completeTaskCounterEL.innerHTML = `${completeTaskCounter} Completed Task(s)`;
  incompleteTaskCounterEL.innerHTML = `${incompleteTaskCounter} Incomplete Task(s)`;
  saveData();
}

// Error Display Methods
function displayErrorMessage(message) {
  errorMessage.textContent = message;
}

function clearErrorMessage() {
  errorMessage.textContent = "";
}


// Data Storage Methods
function saveData() {
  localStorage.setItem("taskInternalData", JSON.stringify(taskListData));
  localStorage.setItem("taskCounterData", JSON.stringify(taskCounter));
  localStorage.setItem("taskDisplayData", listContainer.innerHTML);
}

function loadData() {
  const storedTaskData = localStorage.getItem("taskInternalData");
  const storedTaskCounterData = localStorage.getItem("taskCounterData");
  if (storedTaskData) {
    taskListData = JSON.parse(storedTaskData);
  }
  if (storedTaskCounterData) {
    taskCounter = JSON.parse(storedTaskCounterData);
  }
  listContainer.innerHTML = localStorage.getItem("taskDisplayData");
}

// Data Handling Methods
function incrementTaskCounter() {
  taskCounter++;
  updateCounters();
}

function decrementTaskCounter() {
  taskCounter--;
  updateCounters();
}

function incrementCompleteTaskCounter() {
  completeTaskCounter++;
  updateCounters();
}

function decrementCompleteTaskCounter() {
  completeTaskCounter--;
  updateCounters();
}

function incrementIncompleteTaskCounter() {
  incompleteTaskCounter++;
  updateCounters();
}

function decrementIncompleteTaskCounter() {
  incompleteTaskCounter--;
  updateCounters();
}

function incrementPriority() {
  priority++;
}
function decrementPriority() {
  priority--;
}

function incrementID() {
  id++;
}
function decrementID() {
  id--;
}

function clearData() {
  localStorage.clear();
  refreshPage();
}

// Page Handling Methods
function refreshPage() {
  location.reload();
}

loadData();
