import useLocalStorage from "use-local-storage";
import { PLAYER_KEY, type Player } from "../models/player";

export default function UsePlayer() {
  const [players, setPlayers] = useLocalStorage<Player[]>(PLAYER_KEY, []);

  function deletePlayer(id: string) {
    setPlayers(players.filter((player) => player.id !== id));
  }

  function updatePlayer(updated: Player) {
    setPlayers(players.map((p) => (p.id === updated.id ? updated : p)));
  }

  return {
    deletePlayer,
    updatePlayer,
  };
}
