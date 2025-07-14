import { sql } from '../config/db.js';

// GET /routines/:userId/:date
export async function getRoutineByDate(req, res) {
  const { userId, date } = req.params;
  try {
    const result = await sql`
      SELECT * FROM routines WHERE user_id = ${userId} AND date = ${date}
    `;
    if (result.length === 0) {
      return res.status(404).json({ message: 'Routine non trouvée.' });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erreur getRoutineByDate', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// POST /routines
export async function upsertRoutine(req, res) {
  const { user_id, date, energy_level } = req.body;
  if (!user_id || !date || typeof energy_level !== 'number') {
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }
  try {
    const result = await sql`
      INSERT INTO routines (user_id, date, energy_level)
      VALUES (${user_id}, ${date}, ${energy_level})
      ON CONFLICT (user_id, date)
      DO UPDATE SET energy_level = ${energy_level}
      RETURNING *
    `;
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erreur upsertRoutine', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}
