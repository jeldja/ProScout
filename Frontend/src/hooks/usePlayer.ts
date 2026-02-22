import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { fetchPlayerById } from "@/services/playerService";
import type { Player } from "@/data/playerData";

export function usePlayer(id: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["player", id],
    queryFn: async (): Promise<Player | null> => {
      if (!id) return null;
      // Prefer player from cached list if available
      const cached = queryClient.getQueryData<Player[]>(["players"]);
      const fromList = cached?.find((p) => p.id === id);
      if (fromList) return fromList;
      return fetchPlayerById(id);
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}
