import express from 'express';
import { sql } from '../config/db.js';
import {
  getTasksByUserId,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/tasksController.js';

const router = express.Router();

export default router;
