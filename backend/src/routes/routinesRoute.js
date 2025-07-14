import express from 'express';
import {
  getRoutineByDate,
  upsertRoutine,
} from '../controllers/routinesController.js';

const router = express.Router();

router.get('/:userId/:date', getRoutineByDate);
router.post('/', upsertRoutine);

export default router;
