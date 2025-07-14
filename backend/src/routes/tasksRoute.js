import express from 'express';
import {
  getTasksByUserId,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/tasksController.js';

const router = express.Router();

router.get('/:userId', getTasksByUserId);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
