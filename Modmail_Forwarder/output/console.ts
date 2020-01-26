import { Output } from './output';

export class Console implements Output.Provider {
    sendMessage(message: string) {
        return new Promise<void>((resolve, reject) => {
            try {
                console.log(message);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
