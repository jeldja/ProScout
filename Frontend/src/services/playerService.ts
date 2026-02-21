import type { Player } from '@/types';
import { api } from './api';

// Mock data import — remove once backend endpoints are live
import { players as mockPlayers } from '@/data/playerData';

const USE_MOCK = true; // Set to false when backend is ready

export const playerService = {
  getAll: async (): Promise<Player[]> => {
    if (USE_MOCK) return mockPlayers;
    return api.get<Player[]>('/players');
  },

  getById: async (id: string): Promise<Player> => {
    if (USE_MOCK) {
      const player = mockPlayers.find((p) => p.id === id);
      if (!player) throw new Error(`Player ${id} not found`);
      return player;
    }
    return api.get<Player>(`/players/${id}`);
  },
};
