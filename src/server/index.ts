import amqp from "amqplib";

async function main() {
    console.log("Starting Peril server...");
    const connectionString = "amqp://guest:guest@localhost:5672/";
    const connection = await amqp.connect(connectionString);
    console.log("Connection successful");
    process.on("exit", code => {
        console.log("Process exit event with code: ", code);
        connection.close();
    });
}

main().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
