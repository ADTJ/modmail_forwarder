export module Output {
    export interface Provider {
        sendMessage(message: string): Promise<void>;
    }
}