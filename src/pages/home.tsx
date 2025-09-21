import { useState } from "react";
import {
  Button,
  Container,
  Flex,
  Input,
  Textarea,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import PlayersList from "../components/players-list";
import UsePlayers from "../hooks/use-players";

interface Player {
  id: string;
  name: string;
  level: number;
  enabled: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function stdDev(numbers: number[]): number {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance =
    numbers.reduce((acc, n) => acc + (n - mean) ** 2, 0) / numbers.length;
  return Math.sqrt(variance);
}

function shuffleTeams(players: Player[], numEquipes: number): Player[][] {
  const buckets: Record<number, Player[]> = players.reduce((acc, p) => {
    if (!acc[p.level]) {
      acc[p.level] = [];
    }
    acc[p.level].push(p);
    return acc;
  }, {} as Record<number, Player[]>);

  const sortedLevels = Object.keys(buckets).map(Number).sort((a, b) => b - a);
  const shuffledPlayers: Player[] = sortedLevels.flatMap(level => shuffleArray(buckets[level]));

  const teams: Player[][] = Array.from({ length: numEquipes }, () => []);
  shuffledPlayers.forEach((player, idx) => {
    const teamIndex = idx % numEquipes;
    teams[teamIndex].push(player);
  });

  return teams;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [teams, setTeams] = useState<Player[][]>([]);
  const [numTeams, setNumTeams] = useState(2);
  const [teamSize, setTeamSize] = useState<number | null>(null);

  const { players, addPlayers } = UsePlayers();

  const handleAddPlayers = () => {
    const rows = input.split("\n").filter((l) => l.trim() !== "");
    const newPlayers = rows.map((row) => {
      const id = Math.random().toString(36).substring(2, 9);
      const [name, level] = row.trim().split("-");
      return { id, name: name.trim(), level: parseInt(level) || 0, enabled: true };
    });

    addPlayers(newPlayers);
    setInput("");
  };

  const handleShuffle = () => {
    if (players.length === 0 || numTeams <= 0) return;
    
    const enableds = players.filter((p) => p.enabled);
    
    let sortedTeams = shuffleTeams(enableds, numTeams);

    if (teamSize) {
      sortedTeams = sortedTeams.map((team) => team.slice(0, teamSize));
    }

    setTeams(sortedTeams);
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-b, gray.800, gray.900)" p={4}>
      <Container maxW="3xl" minH="100vh" py={50} centerContent bgGradient="linear(to-b, gray.800, gray.900)">
        <Flex w="100%" gap={4} align="center">
          <Textarea
            placeholder={`Digite: Nome - Nivel (um por linha)\nEx:\nJoão - 1\nMaria - 2`}
            size="lg"
            flex="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            minH="120px" 
            bg="gray.800"
            color="white"
            _placeholder={{ color: "gray.400" }}
          />
          <Button colorScheme="teal" onClick={handleAddPlayers} variant="solid">
            Adicionar
          </Button>
        </Flex>

        <PlayersList />

        <Flex gap={4} mt={6} align="center">
          <Text bg="gray.800"
                color="white">
            Quantidade de Equipes: 
          </Text>
          <Input
            type="number"
            size="sm"
            value={numTeams}
            onChange={(e) => setNumTeams(parseInt(e.target.value))}
            w="80px"
            color="white"
          />
          <Text bg="gray.800"
                color="white">
            Participantes por equipe: 
          </Text>
          <Input
            type="number"
            size="sm"
            value={teamSize ?? ""}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            w="80px"
            color="white"
          />
          <Button colorScheme="green" onClick={handleShuffle}>
            Sortear
          </Button>
        </Flex>

        {teams.length > 0 && (
          <VStack mt={8} spacing={6} align="stretch" w="100%">
            {teams.map((team, idx) => {
              const levels = team.map((p) => p.level);
              const avg =
                levels.reduce((acc, l) => acc + l, 0) / levels.length || 0;
              const deviation = stdDev(levels);

              return (
                <Box
                  key={idx}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  boxShadow="md"
                  bg="gray.700"
                  color="white"
                >
                  <Text fontWeight="bold">
                    Equipe {idx + 1} (Média {avg.toFixed(2)}, Desvio padrão {deviation.toFixed(2)})
                  </Text>
                  {team.map((p) => (
                    <Text key={p.id}>
                      {p.name}
                    </Text>
                  ))}
                </Box>
              );
            })}
          </VStack>
        )}
      </Container>
    </Box>
  );
}
