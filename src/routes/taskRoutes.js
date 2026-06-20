import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  clearCompleted
} from '../controllers/taskController.js';

const router = Router();

// /api/tasks  or  /api/v1/tasks
router.route('/')
  .get(getTasks)
  .post(createTask)
  .delete(clearCompleted);   // DELETE all completed

// /api/tasks/:id
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;
