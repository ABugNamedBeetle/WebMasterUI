export class WebClientDetail {
    webSocketUrl:string = ''
    webClientName: string =''
    webSecretChannel: string = ''
    isAutoReconnect: boolean = false;

    empty(): boolean{
        return this.webSocketUrl !== '' && 
               this.webClientName !== '' &&
               this.webSecretChannel !== '';
    }
}