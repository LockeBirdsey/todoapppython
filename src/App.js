import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [allTasks, setAllTasks] = useState(0);
  var currentTasks = [];
  var completedTasks = [];
  function UpdateData() {
    currentTasks = [];
    completedTasks = [];
    useEffect(() => {
      fetch("/tasks")
        .then((res) => res.json())
        .then((data) => {
          setAllTasks(data);
        });
    }, []);
    const allTasksArr = Array.from(allTasks);
    allTasksArr.forEach((element) => {
      if (element.taskcomplete) {
        completedTasks.push(element);
      } else {
        currentTasks.push(element);
      }
    });
  }
  function refreshPage() {
    window.location.reload();
  }
  UpdateData();
  function Tasks(props) {
    const onCheckboxChange = (event) => {
      var taskid = event.target.id.replace("_checkbox", "");
      var taskcomplete = event.target.checked;
      fetch("/update", {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskid: taskid,
          taskcomplete: taskcomplete,
        }),
      })
        .then((response) => {
          response.json();
        })
        .then((json) => {});
    };

    const renderUpdateButton = (complete) => {
      if (!complete) {
        return <button onClick={refreshPage}>Update!</button>;
      } else {
        return "";
      }
    };

    const renderCompleteHeader = (complete) => {
      if (!complete) {
        return <th>Complete Task?</th>;
      } else {
        return "";
      }
    };

    const renderTaskCompleter = (complete, id) => {
      if (!complete) {
        return (
          <td>
            <input
              type="checkbox"
              id={id + "_checkbox"}
              onChange={onCheckboxChange}
            />
          </td>
        );
      } else {
        return "";
      }
    };

    const taskData = props.tasks;
    const todoTable = (
      <table>
        <tr>
          <th>Task Name</th>
          <th>Task Description</th>
          <th>Task Due</th>
          {renderCompleteHeader(props.completed)}
        </tr>
        {taskData.map((task) => (
          <tr key={task.taskid}>
            <td>{task.taskname}</td>
            <td>{task.taskdescription}</td>
            <td>{task.taskdue_str}</td>
            {renderTaskCompleter(props.completed, task.taskid)}
          </tr>
        ))}
      </table>
    );

    return (
      <div>
        {todoTable}
        {renderUpdateButton(props.completed)}
      </div>
    );
  }

  function AddTask(props) {
    const [startDate, setStartDate] = useState(new Date());
    const [task, setTask] = useState({
      taskName: "",
      taskDescription: "",
      taskDue: "",
    });

    const inputChanged = (event) => {
      setTask({ ...task, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
      // alert(`Task is ${task.taskName} ${task.taskDescription}`);

      fetch("/add", {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName: task.taskName,
          taskDescription: task.taskDescription,
          taskDue: startDate,
        }),
      })
        .then((response) => {
          response.json();
        })
        .then((json) => {});
    };

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label>Task Name</label>
          <input
            type="text"
            name="taskName"
            onChange={inputChanged}
            value={task.taskName}
          />
          <br />
          <label>Task Description</label>
          <input
            type="text"
            name="taskDescription"
            onChange={inputChanged}
            value={task.taskDescription}
          />
          <br />
          <label>Task Due</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
          />
          <br />
          <input type="submit" value="Add Task" />
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      <h3>Tasks</h3>
      <Tasks tasks={currentTasks} completed={false} />
      <hr />
      <h3>Completed Tasks</h3>
      <Tasks tasks={completedTasks} completed={true} />
      <hr />
      <h3>Add Task</h3>
      <AddTask />
    </div>
  );
}

export default App;
