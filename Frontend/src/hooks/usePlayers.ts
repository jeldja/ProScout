import { useQuery } from "@tanstack/react-query";
import { fetchPlayers } from "@/services/playerService";

export function usePlayers() {
  return useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    staleTime: 60 * 1000,
  });
}
