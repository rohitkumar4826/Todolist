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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  useEffect(() => {
    fetch("http://localhost:3001/todos")
      .then((response) => response.json())
      .then((data) => setAllTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const filteredTodos = isCompletedScreen
    ? completedTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

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
        setIsSectionVisible(!isSectionVisible);
      })
      .catch((error) => console.error("Error adding todo:", error));
  };

  const handleToDoDelete = (id) => {
    const requestOptions = {
      method: "DELETE",
    };

    fetch(`http://localhost:3001/todos/${id}`, requestOptions)
      .then((response) => response.json())
      .then(() => setAllTodos(allTodos.filter((todo) => todo._id !== id)))
      .catch((error) => console.error("Error deleting todo:", error));
  };

  const handleComplete = (id) => {
    const date = new Date();
    const completedOn =
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

  const handleCompletedTodoDelete = (id) => {
    const requestOptions = {
      method: "DELETE",
    };

    fetch(`http://localhost:3001/completedTodos/${id}`, requestOptions)
      .then((response) => response.json())
      .then(() => {
        setCompletedTodos(completedTodos.filter((todo) => todo._id !== id));
      })
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
        <div className="wrapper">
          <h1>To-Do List</h1>

          {/* Button to toggle the visibility */}
          <button
            className="primbtn"
            onClick={() => setIsSectionVisible(!isSectionVisible)}
          >
            New Task
          </button>

          {/* Section for new task input, initially hidden */}
          {isSectionVisible && (
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
          )}
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

        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Todos..."
          />
        </div>

        <div className="todo-list">
          {filteredTodos.map((item) => (
            <div className="todo-list-item" key={item._id}>
              <div>
                <h3>{isCompletedScreen ? "🎉" : "📌"}</h3>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.completedOn && (
                  <p>
                    <i>Completed at: {item.completedOn}</i>
                  </p>
                )}
              </div>
              <div>
                <AiOutlineDelete
                  title="Delete?"
                  className="icon"
                  onClick={() =>
                    isCompletedScreen
                      ? handleCompletedTodoDelete(item._id)
                      : handleToDoDelete(item._id)
                  }
                />
                {!isCompletedScreen && (
                  <BsCheckLg
                    title="Completed?"
                    className="check-icon"
                    onClick={() => handleComplete(item._id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
