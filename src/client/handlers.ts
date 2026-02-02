import type { ArmyMove } from "../internal/gamelogic/gamedata.js";
import type { GameState, PlayingState } from "../internal/gamelogic/gamestate.js";
import { handleMove, MoveOutcome } from "../internal/gamelogic/move.js";
import { handlePause } from "../internal/gamelogic/pause.js";
import { AckType } from "../internal/pubsub/subscribeJSON.js";

export function handlerPause(gs: GameState): (ps: PlayingState) => AckType {
    return (ps: PlayingState) => {
        handlePause(gs, ps);
        process.stdout.write("> ");
        return AckType.Ack;
    };
}

export function handlerMove(gs: GameState): (mv: ArmyMove) => AckType {
    return (mv: ArmyMove) => {
        const outcome = handleMove(gs, mv);
        process.stdout.write("> ");
        if (outcome === MoveOutcome.MakeWar || outcome === MoveOutcome.Safe) return AckType.Ack;
        return AckType.NackDiscard;
    };
}
