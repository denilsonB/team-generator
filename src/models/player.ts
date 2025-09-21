export const PLAYER_KEY = "players";

export interface Player {
  id: string;
  name: string;
  level: number;
  enabled: boolean;
}