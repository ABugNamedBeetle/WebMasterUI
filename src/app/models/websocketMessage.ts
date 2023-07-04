
import { Buffer } from "buffer";
import { AES, enc, SHA256 } from "crypto-js";

export class SocketMessageInit {
    static secretKeyHash: string = '';
    static hashPresent: boolean = false;
    static initSecretKeyHash(key: string) {
        if (key.trim().length > 0) {
            this.secretKeyHash = enc.Base64.stringify(enc.Utf8.parse(key));
            console.log(this.secretKeyHash);
            this.hashPresent = true;
        }
    }

}

export class SocketMessage {


    type: MessageType;
    private message: string | null = null;
    private destination: string;
    private origin: string;
    private integrity: string = '';
    private correlationID: string | null = null;

    constructor(_type: MessageType, _destination: string, _origin: string) {
        this.type = _type;
        this.destination = _destination;
        this.origin = _origin;
    }

    setDestination(destination: string) {
        this.destination = destination;
        return this;
    }

    setMessage(msg: string) {
        this.message = msg;
    }

    getMessage() {

    }

    preparePacket() {

        if (SocketMessageInit.hashPresent) {


            if (this.message !== null && this.message.trim().length > 0) {

                this.message = enc.Base64.stringify(enc.Utf8.parse(this.message));
                this.integrity = this.encryptMessage(SocketMessageInit.secretKeyHash, this.message!);
                this.correlationID = this.generateHashKeyFromTime(Math.floor(Date.now()));
                 return JSON.stringify(this);

            } else {
                throw new Error("Massage Failed to Valid text.")

            }
        } else {
            throw new Error("Secret Hash is Not Present.")
        }
        
    }





    encryptMessage(secretKeyHash: string, encodedMessage: string): string {

        const combinedStr = secretKeyHash + encodedMessage;

        return SHA256(combinedStr).toString(enc.Hex).slice(0, 12);
    }

    private generateHashKeyFromTime(utcTimeInSeconds: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const characterLength = characters.length;

        let hashKey = '';
        let remainingTime = utcTimeInSeconds;

        while (hashKey.length < 16) {
            const index = remainingTime % characterLength;
            hashKey += characters.charAt(index);
            remainingTime = Math.ceil((remainingTime / characterLength)*Math.random()*100);
             
        }

        return hashKey;
    }





}

export enum MessageType {
    HEALTH = "health",
    //input types
    REQUEST = "request",
    BROADCAST = "broadcast",
    //output types
    RESPONSE = "response"
}



