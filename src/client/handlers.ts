import type { ConfirmChannel } from "amqplib";
import type { ArmyMove, RecognitionOfWar } from "../internal/gamelogic/gamedata.js";
import type { GameState, PlayingState } from "../internal/gamelogic/gamestate.js";
import { handleMove, MoveOutcome } from "../internal/gamelogic/move.js";
import { handlePause } from "../internal/gamelogic/pause.js";
import { handleWar, WarOutcome } from "../internal/gamelogic/war.js";
import { AckType } from "../internal/pubsub/consume.js";
import { publishJSON } from "../internal/pubsub/publish.js";
import { ExchangePerilTopic, WarRecognitionsPrefix } from "../internal/routing/routing.js";
import { publishGameLog } from "./index.js";

export function handlerPause(gs: GameState): (ps: PlayingState) => AckType {
    return (ps: PlayingState) => {
        handlePause(gs, ps);
        process.stdout.write("> ");
        return AckType.Ack;
    };
}

export function handlerMove(gs: GameState, ch: ConfirmChannel): (mv: ArmyMove) => Promise<AckType> {
    return async (mv: ArmyMove) => {
        const outcome = handleMove(gs, mv);
        process.stdout.write("> ");
        if (outcome === MoveOutcome.Safe || outcome === MoveOutcome.SamePlayer) return AckType.Ack;
        if (outcome === MoveOutcome.MakeWar) {
            const recognition: RecognitionOfWar = {
                attacker: mv.player,
                defender: gs.getPlayerSnap(),
            };
            try {
                await publishJSON(ch, ExchangePerilTopic, `${WarRecognitionsPrefix}.${gs.getUsername()}`, recognition);
                return AckType.Ack;
            } catch (err) {
                console.error("Error publishing war recognition:", err);
                return AckType.NackRequeue;
            }
        }
        return AckType.NackDiscard;
    };
}

export function handerWar(gs: GameState, ch: ConfirmChannel): (war: RecognitionOfWar) => Promise<AckType> {
    return async (war: RecognitionOfWar): Promise<AckType> => {
        try {
            const outcome = handleWar(gs, war);
            switch (outcome.result) {
                case WarOutcome.NotInvolved:
                    return AckType.NackRequeue;
                case WarOutcome.NoUnits:
                    return AckType.NackDiscard;
                case WarOutcome.YouWon:
                case WarOutcome.OpponentWon:
                    try {
                        publishGameLog(ch, gs.getUsername(), `${outcome.winner} won a war against ${outcome.loser}`);
                    } catch (error) {
                        console.log("Error publishing a game log: ", error);
                    }
                    return AckType.Ack;
                case WarOutcome.Draw:
                    try {
                        publishGameLog(
                            ch,
                            gs.getUsername(),
                            `${outcome.attacker} won a war against ${outcome.defender}`,
                        );
                    } catch (error) {
                        console.log("Error publishing a game log: ", error);
                        return AckType.NackRequeue;
                    }
                    return AckType.Ack;
                default:
                    const unreachable: never = outcome;
                    console.log("Unexpected war resolution: ", unreachable);
                    return AckType.NackDiscard;
            }
        } finally {
            process.stdout.write("> ");
        }
    };
}
