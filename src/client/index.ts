import amqp from "amqplib";
import { clientWelcome, commandStatus, getInput, printClientHelp, printQuit } from "../internal/gamelogic/gamelogic.js";
import { GameState } from "../internal/gamelogic/gamestate.js";
import { commandMove } from "../internal/gamelogic/move.js";
import { commandSpawn } from "../internal/gamelogic/spawn.js";
import { declareAndBind } from "../internal/pubsub/declareAndBind.js";
import { subscribeJSON } from "../internal/pubsub/subscribeJSON.js";
import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";
import { handlerPause } from "./handlers.js";

async function main() {
    console.log("Starting Peril client...");
    const connectionString = "amqp://guest:guest@localhost:5672/";
    const connection = await amqp.connect(connectionString);
    const username = await clientWelcome();
    const [channel, queue] = await declareAndBind(
        connection,
        ExchangePerilDirect,
        `${PauseKey}.${username}`,
        PauseKey,
        "transient",
    );
    const gamestate = new GameState(username);
    subscribeJSON(connection, ExchangePerilDirect, queue.queue, PauseKey, "transient", handlerPause(gamestate));
    let loop = true;
    while (loop) {
        let input = await getInput("> ");
        switch (input[0]) {
            case "spawn":
                try {
                    commandSpawn(gamestate, input);
                } catch (e: any) {
                    console.error(e.message);
                }
                break;
            case "move":
                try {
                    const result = commandMove(gamestate, input);
                    if (result) console.log("Moved successfully");
                } catch (e: any) {
                    console.error(e.message);
                }
                break;
            case "status":
                await commandStatus(gamestate);
                break;
            case "help":
                printClientHelp();
                break;
            case "spam":
                console.log("Spamming not allowed yet!");
                break;
            case "quit":
                printQuit();
                loop = false;
                break;
            default:
                console.log("Unknown command, try again");
                break;
        }
    }
    process.on("exit", code => {
        console.log("Process exit event with code: ", code);
        connection.close();
    });
}

main().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
