import { writeLog, type GameLog } from "../internal/gamelogic/logs.js";
import { AckType } from "../internal/pubsub/consume.js";

export function handlerLog(): (gl: GameLog) => Promise<AckType> {
    return async (gl: GameLog): Promise<AckType> => {
        try {
            await writeLog(gl);
            return AckType.Ack;
        } catch (error) {
            console.log("Error logging ", error);
            return AckType.NackRequeue;
        } finally {
            process.stdout.write("> ");
        }
    };
}
