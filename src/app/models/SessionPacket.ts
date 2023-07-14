export class SessionPacket {
    private sessionID: string;
    private peer: string = "";
    private stateCode: number = 3; //3 conecting 2 connected 1 failed
    private statusMessage: string = "";

    constructor() {
        this.sessionID = this.generateHashKey(8);
    }
    setPeerName(name: string) {
        this.peer = name;
        return this;
    }
    setStateCode(code: number) {
        this.stateCode = code;
        return this;
    }

    getPeerName() {
        return this.peer;
    }
    getStateCode() {
        return this.stateCode;
    }

    validatePacket(){
        if(this.peer === ""){
            throw new Error("Peer name is Empty, Validation Failed");
        }
        return this;
    }


    private generateHashKey(hashLength: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const characterLength = characters.length;

        let hashKey = '';
        let remainingTime = Math.floor(Date.now());

        while (hashKey.length < hashLength) {
            const index = remainingTime % characterLength;
            hashKey += characters.charAt(index);
            remainingTime = Math.ceil((remainingTime / characterLength) * Math.random() * 100);

        }

        return hashKey;
    }
}