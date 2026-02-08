import amqp, { type Channel } from "amqplib";

export enum SimpleQueueType {
    durable,
    transient,
}

export async function declareAndBind(
    conn: amqp.ChannelModel,
    exchange: string,
    queueName: string,
    key: string,
    queueType: SimpleQueueType,
): Promise<[Channel, amqp.Replies.AssertQueue]> {
    const channel = await conn.createConfirmChannel();
    const queue = await channel.assertQueue(queueName, {
        durable: queueType === SimpleQueueType.durable,
        autoDelete: queueType === SimpleQueueType.transient,
        exclusive: queueType === SimpleQueueType.transient,
        arguments: {
            "x-dead-letter-exchange": "peril_dlx",
        },
    });
    channel.bindQueue(queueName, exchange, key);
    return [channel, queue];
}
