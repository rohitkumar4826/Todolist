const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname+"/build"));
mongoose
  .connect(process.env.Mongo_Url)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Database not connected:", error);
  });

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completedOn: String,
});

const Todo = mongoose.model("Todo", todoSchema);
const comp = mongoose.model("compl", todoSchema);

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/completedTodos", async (req, res) => {
  try {
    const compl = await comp.find();
    res.json(compl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  const todo = new Todo({ title, description });
  try {
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, completedOn } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, completedOn },
      { new: true }
    );
    console.log("updated", updatedTodo);
    let insertcompleted = new comp({
      _id: updatedTodo._id,
      title: updatedTodo.title,
      description: updatedTodo.description,
      completedOn: updatedTodo.completedOn,
    });
    let respo = await insertcompleted.save();
    console.log("respo", respo);
    if (respo) res.json(updatedTodo);
    else {
      res.status(300).json({ message: "not inserted in completed todo" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/completedTodos/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  try {
    let responce = await comp.findByIdAndDelete(id);
    console.log(responce);
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("*",(req,res)=>
{
    res.sendFile(__dirname+"/build/index.html");
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
