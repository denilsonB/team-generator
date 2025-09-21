import {
  Box,
  HStack,
  Text,
  IconButton,
  SimpleGrid,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { useState } from "react";
import UsePlayers from "../../hooks/use-players";

interface Player {
  id: string;
  name: string;
  level: number;
  enabled?: boolean;
}

export default function PlayersList() {
  const { players, deletePlayer, updatePlayer } = UsePlayers();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLevel, setEditLevel] = useState<number>(0);

  function handleDeletePlayer(player: Player) {
    deletePlayer(player.id);
  }

  function handleStartEdit(player: Player) {
    setEditingId(player.id);
    setEditName(player.name);
    setEditLevel(player.level);
  }

  function handleConfirmEdit(player: Player) {
    updatePlayer({ ...player, name: editName, level: editLevel });
    setEditingId(null);
  }

  function handleToggleEnabled(player: Player) {
    updatePlayer({ ...player, enabled: !player.enabled });
  }

  return (
    <SimpleGrid mt={6} spacing={4} minChildWidth="250px" w="100%">
      {players.map((player) => (
        <Box
          key={player.id}
          p={3}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          bg="gray.800"
          color="white"
          _hover={{ transform: "scale(1.03)", shadow: "2xl" }}
          transition="all 0.2s"
        >
          <HStack spacing={3} align="center">
            {/* Checkbox habilitar/desabilitar */}
            <Checkbox
              isChecked={player.enabled ?? true}
              onChange={() => handleToggleEnabled(player)}
            />

            {/* Texto ou Inputs */}
            {editingId === player.id ? (
              <HStack spacing={2} flex="1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  size="sm"
                  placeholder="Nome"
                  isDisabled={!(player.enabled ?? true)}
                />
                <Input
                  type="number"
                  value={editLevel}
                  onChange={(e) => setEditLevel(Number(e.target.value))}
                  size="sm"
                  placeholder="Nível"
                  w="80px"
                  isDisabled={!(player.enabled ?? true)}
                />
              </HStack>
            ) : (
              <Text

                flex="1"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                color={player.enabled ? "white" : "gray.400"}
              >
                {player.name} - Nível {player.level}
              </Text>
            )}

            {/* Botões */}
            <HStack>
              {editingId === player.id ? (
                <IconButton
                  aria-label="Confirmar edição"
                  icon={<FaCheck />}
                  colorScheme="green"
                  size="sm"
                  onClick={() => handleConfirmEdit(player)}
                  isDisabled={!(player.enabled ?? true)}
                />
              ) : (
                <IconButton
                  aria-label="Editar jogador"
                  icon={<FaEdit />}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => handleStartEdit(player)}
                  isDisabled={!(player.enabled ?? true)}
                />
              )}

              <IconButton
                aria-label="Excluir jogador"
                icon={<FaTrash />}
                colorScheme="red"
                size="sm"
                onClick={() => handleDeletePlayer(player)}
                isDisabled={!(player.enabled ?? true)}
              />
            </HStack>
          </HStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}
