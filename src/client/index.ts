import amqp from "amqplib";
import { clientWelcome } from "../internal/gamelogic/gamelogic.js";
import { declareAndBind } from "../internal/pubsub/declareAndBind.js";
import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";

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

    process.on("exit", code => {
        console.log("Process exit event with code: ", code);
        connection.close();
    });
}

main().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
