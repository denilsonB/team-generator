import useLocalStorage from "use-local-storage";
import { PLAYER_KEY, type Player } from "../models/player";
import React from "react";

export default function UsePlayers() { 
  const [playersData] = useLocalStorage<Player[]>(PLAYER_KEY,[]);
  const [players, setPlayers] = useLocalStorage<Player[]>(PLAYER_KEY, []);

  function fetchPlayers(){
    return setPlayers(playersData)
  }
  
  function addPlayers(newPlayers: Player[]) {
    const updatedPlayers = [...players, ...newPlayers];
    setPlayers(updatedPlayers);
  }

  function deletePlayer(id: string) {
    setPlayers(players.filter((player) => player.id !== id));
  }

  function updatePlayer(updated: Player) {
    setPlayers(players.map((p) => (p.id === updated.id ? updated : p)));
  }

  function toggleEnabled(id: string) {
    setPlayers(
      players.map(p =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      )
    );
  }

  React.useEffect(() => {
    fetchPlayers();
  }, [playersData])

  return {
    players,
    deletePlayer,
    updatePlayer,
    addPlayers,
    toggleEnabled
  }
}