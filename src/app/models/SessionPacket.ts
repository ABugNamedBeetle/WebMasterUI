export class SessionPacket {
    private sessionID: string;
    private peer: string = "";
    private stateCode: number = 0; //0 conecting (default) | 1 connected | 2 failed
    private statusMessage: string = "";
    private healthCycle: number = 2*60; // ping pong health in SECONDS, default every two minutes

    constructor() {
        this.sessionID = this.generateHashKey(8);
    }
    setPeerName(name: string) {
        this.peer = name;
        return this;
    }
    
    getPeerName() {
        return this.peer;
    }
    getStateCode() {
        return this.stateCode;
    }

    getStatusMessage(){
        return this.statusMessage;
    }

    getHealthTimeOut(){
        return this.healthCycle;
    }
    private validatePacket(){
        if(this.peer === ""){
            throw new Error("Peer name is Empty, Validation Failed");
        }
        return this;
    }

    preparePacket(){
        this.validatePacket();
        return JSON.stringify(this);
    }

    setHealthTimeout(minutes: number){
        this.healthCycle = minutes * 60;
        return this;
    }

    static parseJSON(validJSON: string){
        let obj = <SessionPacket>JSON.parse(validJSON);
        let n = new SessionPacket();
        n.sessionID = obj.sessionID;
        n.peer = obj.peer;
        n.stateCode = obj.stateCode;
        n.statusMessage = obj.statusMessage;
        n.healthCycle = obj.healthCycle;
        return n;
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