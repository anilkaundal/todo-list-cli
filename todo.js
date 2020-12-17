#!/usr/bin/env node

const fs = require("fs");

const args = process.argv;

// usage represents the help guide
const usage = function () {
  const usageText = `
  Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics
  `;

  console.log(usageText);
};

// list all pending todos
const listTodo = function () {
  fs.readFile("todo.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    let todoItems = data.split("\n");
    todoItems = todoItems.filter((item) => item);
    if (todoItems.lastIndexOf !== 0) {
      for (let i = todoItems.length - 1; i >= 0; i--) {
        console.log("[" + (i + 1) + "] " + todoItems[i]);
      }
      return;
    }
  });
  console.log("There are no pending todos!");
};

// add a new todo
const addTodo = function (todoItem) {
  if (todoItem) {
    fs.appendFile("todo.txt", todoItem + "\n", function (err) {
      if (err) return console.log(err);
      console.log("Added todo: " + '"' + todoItem + '"');
    });
  } else {
    console.log("Error: Missing todo string. Nothing added!");
  }
};

// delete a todo item
const deleteTodo = function (todoItemNo) {
  if (todoItemNo > 0) {
    fs.readFile("todo.txt", "utf8", function (err, data) {
      if (err) {
        console.error(err);
        return;
      }
      const todoItems = data.split("\n");
      todoItems.pop();
      if (todoItemNo <= todoItems.length && data != null) {
        todoItems.splice(todoItemNo - 1, 1);
        fs.writeFile("todo.txt", todoItems.join("\n") + "\n", function (err) {
          if (err) console.log("error", err);
        });
        console.log("Deleted todo #" + todoItemNo);
      } else {
        console.log(
          "Error: todo #" + todoItemNo + " does not exist. Nothing deleted."
        );
      }
    });
  } else if (!todoItemNo) {
    console.log("Error: Missing NUMBER for deleting todo.");
  } else {
    console.log(
      "Error: todo #" + todoItemNo + " does not exist. Nothing deleted."
    );
  }
};

// date when the todo is marked as completed
const getDate = function () {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var dateString = year + "-" + month + "-" + day;

  return dateString;
};

// mark a todo item as completed
const completeTodo = function (todoItemNo) {
  if (todoItemNo != 0) {
    fs.readFile("todo.txt", "utf8", function (err, data) {
      if (err) {
        console.error(err);
        return;
      }
      const todoItems = data.split("\n");
      todoItems.pop();
      if (todoItemNo < todoItems.length && data != null) {
        if (todoItemNo > -1) {
          const completeItem = todoItems.splice(todoItemNo - 1, 1);

          fs.appendFile(
            "done.txt",
            "x " + getDate() + " " + completeItem + "\n",
            function (err) {
              if (err) console.log("error", err);
            }
          );

          fs.writeFile("todo.txt", todoItems.join("\n") + "\n", function (err) {
            if (err) console.log("error", err);
          });
          console.log("Marked todo #" + todoItemNo + " as done.");
        }
      } else {
        console.log("Error: Missing NUMBER for marking todo as done.");
      }
    });
  } else {
    console.log("Error: todo #" + todoItemNo + " does not exist.");
  }
};

// generate a report
const generateReport = function () {
  var itemsInTodo = (itemsInDone = 0);
  fs.readFile("todo.txt", "utf8", (err1, data1) => {
    fs.readFile("done.txt", "utf8", (err2, data2) => {
      if (err1 || err2) {
        throw new Error();
        return;
      }
      itemsInTodo = data1.split("\n").length - 1;
      itemsInDone = data2.split("\n").length - 1;
      console.log(
        getDate() + " Pending : " + itemsInDone + " Completed : " + itemsInTodo
      );
    });
  });
};

// check the passed in command
switch (args[2]) {
  case "add":
    addTodo(args[3]);
    break;
  case "ls":
    listTodo();
    break;
  case "del":
    deleteTodo(args[3]);
    break;
  case "done":
    completeTodo(args[3]);
    break;
  case "help":
    usage();
    break;
  case "report":
    generateReport();
    break;
  default:
    usage();
}
