const express = require('express');
const app = express();
const pool = require('./db')

app.use(express.json()) 

// ROUTES

// Get all todos

app.get('/todos/all', async(req, res) => {
	try {
		const todos = await pool.query(
			"SELECT * FROM todo;"
		);

		res.json(todos.rows)
	} catch (err) {
		console.error(err.message);
	};
})

// Get one todo

app.get('/todos/:id', async(req, res) => {
	const { id } = req.params;
	try {
		const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1',
			[id]);

		res.json(todo.rows[0])

	} catch (err) {
		console.error(err.message);
	};
})

// Create a todo

app.post('/todos', async(req, res) => {
	try {
		const { description } = req.body;
		const newTodo = await pool.query(
			"INSERT INTO todo (todo_description) VALUES ($1) RETURNING * ;", 
			[description]
		);

		res.json(newTodo);

	} catch (err) {
		console.error(err.message);
	};
})

// Update a todo

app.post('/todos/:id', async(req, res) => {
	const { id } = req.params;
	const { description } = req.body;

	try {
		const updatedToDo = await pool.query(
			"UPDATE todo SET todo_description = $1 WHERE todo_id = $2 RETURNING *;",
			[description, id]);

		res.json(updatedToDo);

	} catch(err) {
		console.error(err.message);
	};
})

// Delete a todo

app.put('/todos/:id', async(req, res) => {
	const { id } = req.params;

	try {
		const deletedToDo = await pool.query(
			"DELETE FROM todo WHERE todo_id = $1;",
			[id])

		res.json(`Deleted To-Do with ${id}`)
	} catch(err) {
		console.error(err.message);
	};
})

app.listen(5000, () => {
	console.log('Listening on port 5000.')
});