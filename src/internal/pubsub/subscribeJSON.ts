import amqp from "amqplib";
import { declareAndBind, type SimpleQueueType } from "./declareAndBind.js";

export async function subscribeJSON<T>(
    conn: amqp.ChannelModel,
    exchange: string,
    queueName: string,
    key: string,
    queueType: SimpleQueueType,
    handler: (data: T) => void,
): Promise<void> {
    const [channel, queue] = await declareAndBind(conn, exchange, queueName, key, queueType);
    channel.consume(queue.queue, (message: amqp.ConsumeMessage | null) => {
        if (message === null) return;
        let data = JSON.parse(message.content.toString());
        handler(data);
        channel.ack(message);
    });
}
