import amqp from "amqplib";
import { getInput, printServerHelp } from "../internal/gamelogic/gamelogic.js";
import type { PlayingState } from "../internal/gamelogic/gamestate.js";
import { publishJSON } from "../internal/pubsub/publishJSON.js";
import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";

async function main() {
    console.log("Starting Peril server...");
    const connectionString = "amqp://guest:guest@localhost:5672/";
    const connection = await amqp.connect(connectionString);
    const confirmChannel = await connection.createConfirmChannel();
    const playingState: PlayingState = { isPaused: true };
    // const [logChannel, logQueue] = await declareAndBind(connection, ExchangePerilTopic, GameLogSlug, `${GameLogSlug}.*`, "durable");
    console.log("Connection to confirm channel successful");
    printServerHelp();
    let loop = true;
    while (loop) {
        let input = await getInput("> ");
        if (input.length === 0) continue;
        switch (input[0]) {
            case "pause":
                playingState.isPaused = true;
                console.log("Sending a pause message");
                publishJSON(confirmChannel, ExchangePerilDirect, PauseKey, playingState);
                break;
            case "resume":
                playingState.isPaused = false;
                console.log("Sending a resume message");
                publishJSON(confirmChannel, ExchangePerilDirect, PauseKey, playingState);
                break;
            case "quit":
                console.log("Exiting");
                loop = false;
                return;
            case "help":
                printServerHelp();
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
