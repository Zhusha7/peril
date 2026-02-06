import { encode } from "@msgpack/msgpack";
import type { ConfirmChannel } from "amqplib";

export async function publishJSON<T>(
    ch: ConfirmChannel,
    exchange: string,
    routingKey: string,
    value: T,
): Promise<void> {
    const content = Buffer.from(JSON.stringify(value), "utf-8");
    ch.publish(exchange, routingKey, content, { contentType: "application/json" });
}
export async function publishMsgPack<T>(
    ch: ConfirmChannel,
    exchange: string,
    routingKey: string,
    value: T,
): Promise<void> {
    const encodedValue = encode(value);
    const content = Buffer.from(encodedValue.buffer, encodedValue.byteOffset, encodedValue.byteLength);
    ch.publish(exchange, routingKey, content, { contentType: "application/x-msgpack" });
}
