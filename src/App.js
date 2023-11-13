import React, { useState, useEffect } from "react";
import "./App.css";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

function App() {
  const [allTodos, setAllTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/todos")
      .then((response) => response.json())
      .then((data) => setAllTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  // Add new Todo list 
  const handleAddNewToDo = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTodoTitle,
        description: newDescription,
      }),
    };

    fetch("http://localhost:3001/todos", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setAllTodos([...allTodos, data]);
        setNewTodoTitle("");
        setNewDescription("");
      })
      .catch((error) => console.error("Error adding todo:", error));
  };

    // Delete any Todo list from the Todo
  const handleToDoDelete = (id) => {
    const requestOptions = {
      method: "DELETE",
    };

    fetch(`http://localhost:3001/todos/${id}`, requestOptions)
      .then((response) => response.json())
      .then(() => setAllTodos(allTodos.filter((todo) => todo._id !== id)))
      .catch((error) => console.error("Error deleting todo:", error));
  };


   // Move the Todo inside the completed Todo and delete from the Todo
  const handleComplete = (id) => {
    const date = new Date();
    const completedOn =            // Add the Date and Time when new Todo was moved to completed Todo
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      " at " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedOn }),
    };

    fetch(`http://localhost:3001/todos/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setCompletedTodos([...completedTodos, data]);
        handleToDoDelete(id);
      })
      .catch((error) => console.error("Error completing todo:", error));
  };

  // Delete the completed Todo
  const handleCompletedTodoDelete = (id) => {
    const requestOptions = {
      method: "DELETE",
    };

    fetch(`http://localhost:3001/completedTodos/${id}`, requestOptions)
      .then((response) => response.json())
      .then(() =>
        setCompletedTodos(completedTodos.filter((todo) => todo._id !== id))
      )
      .catch((error) => console.error("Error deleting completed todo:", error));
  };

  useEffect(() => {
    fetch("http://localhost:3001/completedTodos")
      .then((response) => response.json())
      .then((data) => setCompletedTodos(data))
      .catch((error) =>
        console.error("Error fetching completed todos:", error)
      );
  }, []);

  return (
    <div className="App">
      <h1>My Todos 📋</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>📝 Title:</label>
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="What's the title of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <label>📖 Description:</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the description of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <button
              className="primary-btn"
              type="button"
              onClick={handleAddNewToDo}
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${
              isCompletedScreen === false ? "active" : ""
            }`}
            onClick={() => setIsCompletedScreen(false)}
          >
            To Do
          </button>
          <button
            className={`secondaryBtn ${
              isCompletedScreen === true ? "active" : ""
            }`}
            onClick={() => setIsCompletedScreen(true)}
          >
            Completed
          </button>
        </div>
        <div className="todo-list">
          {isCompletedScreen === false &&
            allTodos.map((item) => (
              <div className="todo-list-item" key={item._id}>
                <div>
                  <h3>📌</h3>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div>
                  <AiOutlineDelete
                    title="Delete?"
                    className="icon"
                    onClick={() => handleToDoDelete(item._id)}
                  />
                  <BsCheckLg
                    title="Completed?"
                    className="check-icon"
                    onClick={() => handleComplete(item._id)}
                  />
                </div>
              </div>
            ))}
          {isCompletedScreen === true &&
            completedTodos.map((item) => (
              <div className="todo-list-item" key={item._id}>
                <div>
                  <h3>🎉</h3>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>
                    <i>Completed at: {item.completedOn}</i>
                  </p>
                </div>
                <div>
                  <AiOutlineDelete
                    className="icon"
                    onClick={() => handleCompletedTodoDelete(item._id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
