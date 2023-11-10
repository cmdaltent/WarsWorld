import { coSchema } from "server/schemas/co";
import { emitEvent } from "server/emitter/event-emitter";
import {
  getNextAvailablePlayerSlot,
  getPlayerEntryInMatch,
} from "server/match-logic/server-match-logic";
import {
  getMatches,
  getMatchesOfPlayer,
} from "server/match-logic/server-match-states";
import { z } from "zod";
import { prisma } from "../prisma/prisma-client";
import {
  matchBaseProcedure,
  playerBaseProcedure,
  publicBaseProcedure,
  router,
} from "../trpc/trpc-setup";
import { createMatchProcedure } from "./match/create";
import {
  PlayerInMatch,
  BackendMatchState,
} from "shared/types/server-match-state";
import { armySchema } from "../schemas/army";
import { MatchStatus } from "@prisma/client";

const updateServerState = async (
  matchState: BackendMatchState,
  newPlayersState: PlayerInMatch[],
  matchStatus: MatchStatus = matchState.status
) => {
  await prisma.match.update({
    where: {
      id: matchState.id,
    },
    data: {
      status: matchStatus,
      playerState: newPlayersState,
    },
  });
  matchState.players = newPlayersState;
  matchState.status = matchStatus;
};

const throwIfMatchNotInSetupState = (match: BackendMatchState) => {
  if (match.status !== "setup") {
    throw new Error(
      "This action requires the match to be in 'setup' state, but it isn't"
    );
  }
};

const matchStateToFrontend = (match: BackendMatchState) => ({
  id: match.id,
  map: {
    id: match.map.id,
    name: match.map.name,
    numberOfPlayers: match.map.numberOfPlayers,
  },
  players: match.players,
  state: match.status,
  turn: match.turn,
});

export const matchRouter = router({
  create: createMatchProcedure,
  // TODO: pagination
  getAll: publicBaseProcedure.query(() =>
    getMatches().map(matchStateToFrontend)
  ),
  getPlayerMatches: playerBaseProcedure.query(({ ctx }) =>
    getMatchesOfPlayer(ctx.currentPlayer.id).map(matchStateToFrontend)
  ),
  full: matchBaseProcedure.query(async ({ ctx }) => {
    // TODO: By default show no hidden units
    //       and FoW is completely dark and empty
    // TODO: If the user has a session and has a player in this match
    //       it needs to be checked and some information revealed accordingly
    return ctx.match;
  }),
  join: matchBaseProcedure
    .input(
      z.object({
        selectedCO: coSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      throwIfMatchNotInSetupState(ctx.match);

      if (getPlayerEntryInMatch(ctx.match, ctx.currentPlayer.id) !== null) {
        throw new Error("You've already joined this match!");
      }

      const nextAvailablePlayerSlot = getNextAvailablePlayerSlot(ctx.match);

      await updateServerState(ctx.match, [
        ...ctx.match.players,
        {
          playerId: ctx.currentPlayer.id,
          slot: nextAvailablePlayerSlot,
          ready: false,
          co: input.selectedCO,
          funds: 0,
          powerMeter: 0,
          army: "orange-star",
          COPowerState: "no-power",
        },
      ]);

      emitEvent({
        type: "player-joined",
        matchId: ctx.match.id,
        player: ctx.currentPlayer,
        playerSlot: nextAvailablePlayerSlot,
      });
    }),
  leave: matchBaseProcedure.mutation(async ({ ctx }) => {
    throwIfMatchNotInSetupState(ctx.match);

    if (getPlayerEntryInMatch(ctx.match, ctx.currentPlayer.id) === null) {
      throw new Error("You can't leave this match because you haven't joined");
    }

    await updateServerState(
      ctx.match,
      ctx.match.players.filter((e) => e.playerId !== ctx.currentPlayer.id)
    );

    emitEvent({
      matchId: ctx.match.id,
      type: "player-left",
      player: ctx.currentPlayer,
    });
  }),
  setReady: matchBaseProcedure
    .input(
      z.object({
        readyState: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      throwIfMatchNotInSetupState(ctx.match);

      if (getPlayerEntryInMatch(ctx.match, ctx.currentPlayer.id) === null) {
        throw new Error("You haven't joined this match");
      }

      let readycount = 0;
      ctx.match.players.forEach((player) => {
        if (player.ready) readycount++;
        else if (player.playerId == ctx.currentPlayer.id && input.readyState)
          readycount++;
      });
      await updateServerState(
        ctx.match,
        ctx.match.players.map((e) => ({
          ...e,
          ready:
            e.playerId === ctx.currentPlayer.id ? input.readyState : e.ready,
        })),
        readycount == 2 ? "playing" : ctx.match.status
      );

      emitEvent({
        type: "player-changed-ready-status",
        matchId: ctx.match.id,
        player: ctx.currentPlayer,
        ready: input.readyState,
      });
    }),
  switchCO: matchBaseProcedure
    .input(
      z.object({
        selectedCO: coSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      throwIfMatchNotInSetupState(ctx.match);

      console.log(ctx.match.players[0]);
      const findPlayer = ctx.match.players.find(
        (player) => player.playerId === ctx.currentPlayer.id
      );
      if (findPlayer) findPlayer.co = input.selectedCO;

      await updateServerState(ctx.match, ctx.match.players);
      emitEvent({
        type: "player-picked-co",
        co: input.selectedCO,
        matchId: ctx.match.id,
        player: ctx.currentPlayer,
      });
    }),
  switchArmy: matchBaseProcedure
    .input(
      z.object({
        selectedArmy: armySchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      throwIfMatchNotInSetupState(ctx.match);
      const findPlayer = ctx.match.players.find(
        (player) => player.playerId === ctx.currentPlayer.id
      );
      if (findPlayer) findPlayer.army = input.selectedArmy;

      await updateServerState(ctx.match, ctx.match.players);
      emitEvent({
        type: "player-picked-army",
        army: input.selectedArmy,
        matchId: ctx.match.id,
        player: ctx.currentPlayer,
      });
    }),
});
