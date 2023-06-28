export class RequestMessage {
    constructor(message: string) {
        this.message = message;
    }

    message: string|null = null;
    
    
    
    isValid(){
        return this.message === null;
    }

}

export class ReponseMessage {
    constructor(message: string) {
        this.message = message;
    }

    message: string|null = null;
    
    
    
    isValid(){
        return this.message === null;
    }
}