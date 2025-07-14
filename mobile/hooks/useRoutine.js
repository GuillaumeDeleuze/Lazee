import { useState, useCallback } from 'react';

const API_URL = 'http://192.168.1.16:5001/api';

export function useRoutine(userId) {
  const [energyLevel, setEnergyLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  const fetchRoutine = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/routines/${userId}/${today}`);
      if (res.ok) {
        const data = await res.json();
        setEnergyLevel(data.energy_level);
      } else {
        setEnergyLevel(null);
      }
    } catch (e) {
      setEnergyLevel(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId, today]);

  const updateEnergyLevel = async (level) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/routines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          date: today,
          energy_level: level,
        }),
      });
      if (res.ok) {
        setEnergyLevel(level);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { energyLevel, isLoading, fetchRoutine, updateEnergyLevel };
}
