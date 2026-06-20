import { taskSchema, updateSchema } from '../utils/validation.js';

// ── In-memory store ───────────────────────────
let tasks = [];
let currentId = 1;

// ── Helpers ───────────────────────────────────
const findTask = (id) => tasks.find(t => t.id === id);
const findIndex = (id) => tasks.findIndex(t => t.id === id);

// ── GET /api/tasks ────────────────────────────
export const getTasks = (req, res) => {
  const { completed, search } = req.query;

  let result = [...tasks];

  // Filter by completion status
  if (completed !== undefined) {
    const isDone = completed === 'true';
    result = result.filter(t => t.completed === isDone);
  }

  // Search by text
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(t => t.text.toLowerCase().includes(q));
  }

  res.status(200).json({
    count: result.length,
    tasks: result
  });
};

// ── GET /api/tasks/:id ────────────────────────
export const getTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const task = findTask(id);
  if (!task) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  res.status(200).json(task);
};

// ── POST /api/tasks ───────────────────────────
export const createTask = (req, res) => {
  const result = taskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  const { text, completed = false } = result.data;

  const newTask = {
    id: currentId++,
    text: text.trim(),
    completed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

// ── PUT /api/tasks/:id ────────────────────────
export const updateTask = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const idx = findIndex(id);
  if (idx === -1) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  const result = updateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  const { text, completed } = result.data;

  tasks[idx] = {
    ...tasks[idx],
    ...(text !== undefined && { text: text.trim() }),
    ...(completed !== undefined && { completed }),
    updatedAt: new Date().toISOString()
  };

  res.status(200).json(tasks[idx]);
};

// ── DELETE /api/tasks/:id ─────────────────────
export const deleteTask = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const idx = findIndex(id);
  if (idx === -1) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  tasks.splice(idx, 1);
  res.status(204).end();
};

// ── DELETE /api/tasks (clear completed) ───────
export const clearCompleted = (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter(t => !t.completed);
  const removed = before - tasks.length;
  res.status(200).json({ message: `Deleted ${removed} completed task(s)` });
};
