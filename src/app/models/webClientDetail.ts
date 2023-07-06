export class WebClientDetail {
    webSocketHost:string = ''
    webClientName: string =''
    webSecretChannel: string = ''
    isAutoReconnect: boolean = false;

    empty(): boolean{
        
        return this.webSocketHost === '' && 
               this.webClientName === '' &&
               this.webSecretChannel === '';
    }

    wsUrl(isSecured: boolean): string{
        if(!this.empty()){
            return ` ${isSecured?"wss":"ws"}://${this.webSocketHost}/${this.webClientName}?channel=${this.webSecretChannel}&type=MASTER`;
        }else{
            throw new Error("WebClient is Invalid");
        }
    }
}