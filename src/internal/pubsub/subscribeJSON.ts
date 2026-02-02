import amqp from "amqplib";
import { declareAndBind, type SimpleQueueType } from "./declareAndBind.js";

export enum AckType {
    Ack,
    NackRequeue,
    NackDiscard,
}

export async function subscribeJSON<T>(
    conn: amqp.ChannelModel,
    exchange: string,
    queueName: string,
    key: string,
    queueType: SimpleQueueType,
    handler: (data: T) => AckType,
): Promise<void> {
    const [channel, queue] = await declareAndBind(conn, exchange, queueName, key, queueType);
    channel.consume(queue.queue, (message: amqp.ConsumeMessage | null) => {
        if (message === null) return;
        let data = JSON.parse(message.content.toString());
        const ackType = handler(data);
        switch (ackType) {
            case AckType.Ack:
                channel.ack(message);
                console.log("Message acknowledged");
                break;
            case AckType.NackRequeue:
                channel.nack(message, false, true);
                console.log("Message not acknowledged, requeueing");
                break;
            case AckType.NackDiscard:
                channel.nack(message, false, false);
                console.log("Message not acknowledged, discarding");
                break;
            default:
                throw new Error("Unknown ack callback");
        }
    });
}
