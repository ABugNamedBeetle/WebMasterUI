
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
        this.message = enc.Base64.stringify(enc.Utf8.parse(msg));;
    }
    //refactor for valid message, is ValidBAse64 and throw error

    getMessage() {
        if(this.message !== null){

            return enc.Utf8.stringify(enc.Base64.parse(this.message));
        }else{
            throw  new Error("Massage Failed to Valid text.");
        }
    }

    preparePacket() {

        if (SocketMessageInit.hashPresent) {


            if (this.message !== null && this.message.trim().length > 0) {

                
                this.integrity = this.generateHash(SocketMessageInit.secretKeyHash, this.message!);
                this.correlationID = this.generateHashKeyFromTime(Math.floor(Date.now()));
                 return JSON.stringify(this);

            } else {
                throw new Error("Massage Failed to Valid text.")

            }
        } else {
            throw new Error("Secret Hash is Not Present.")
        }
        
    }





    private generateHash(secretKeyHash: string, encodedMessage: string): string {

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


     static parseJSON(validJSON: string){
        let obj = <SocketMessage>JSON.parse(validJSON);
        let n = new SocketMessage(obj.type, obj.destination, obj.origin);
        n.message = obj.message;
        n.integrity = obj.integrity;
        n.correlationID = obj.correlationID;
        return n;
    }



}

export enum MessageType {
    HEALTH = "health",
    
    LISTPEER="listpeer",  //list all peer
    CREATESESSION = "createsession", //create sesison with peer in message type
    SESSIONCREATED = "sessioncreated",
    SESSIONHEALTH = "sessionhealth",
    //input types
    REQUEST = "request",
    BROADCAST = "broadcast",
    //output types
    RESPONSE = "response"
}



