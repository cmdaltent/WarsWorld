import { Player } from "@prisma/client";
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useLocalStorage } from "frontend/utils/use-local-storage";
import { trpc } from "frontend/utils/trpc-client";

const playersContext = createContext<Player[] | undefined>(undefined);

export const ProvidePlayers = ({ children }: { children: ReactNode }) => {
  const { data } = trpc.user.me.useQuery();

  return (
    <playersContext.Provider value={data?.ownedPlayers}>
      {children}
    </playersContext.Provider>
  );
};

export const usePlayers = () => {
  // TODO make sure development_player0 is set by default - currently not.
  const ownedPlayers = useContext(playersContext);

  const [currentPlayerId, setCurrentPlayerId] = useLocalStorage(
    "currentPlayerId",
    null
  );
  const currentPlayer = ownedPlayers?.find((p) => p.id === currentPlayerId);
  const setCurrentPlayer = (player: Player) => setCurrentPlayerId(player.id);

  return {
    ownedPlayers,
    currentPlayer,
    setCurrentPlayer,
    areOwnedPlayersLoaded: Boolean(ownedPlayers),
  };
};
