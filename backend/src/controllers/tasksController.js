import { sql } from '../config/db.js';

export async function getTasksByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
        SELECT * FROM tasks WHERE user_id = ${userId} ORDER BY created_at DESC
      `;

    res.status(200).json(transactions);
  } catch (error) {
    console.log('Error getting the transactions', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createTask(req, res) {
  try {
    const { title, category, user_id, priority } = req.body;

    if (!title || !user_id || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const task = await sql`
      INSERT INTO tasks(user_id, title, category, priority)
      VALUES (${user_id}, ${title}, ${category}, ${priority || 1})
      RETURNING *
    `;

    console.log(task);
    res.status(201).json(task[0]);
  } catch (error) {
    console.log('Error creating the task', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const result = await sql`
      DELETE FROM tasks WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.log('Error deleting the task', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        message: 'Le champ completed est requis et doit être un booléen.',
      });
    }

    const result = await sql`
      UPDATE tasks SET completed = ${completed}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: 'Tâche non trouvée.' });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.log('Erreur lors de la mise à jour de la tâche', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}
