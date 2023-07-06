import { Component, OnInit } from '@angular/core';
import { baseLayerLuminance, Button, Listbox, StandardLuminance, Switch, TextField} from '@fluentui/web-components';

import { Combobox } from '@fluentui/web-components';
import { SQIconType, SQMessageType, SQText } from 'src/app/models/sqText';
import { WebClientDetail } from 'src/app/models/webClientDetail';
import { MessageType, SocketMessage, SocketMessageInit } from 'src/app/models/websocketMessage';
import { environment, WEB_SOCKET_LIST } from 'src/environments/environment';
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  webSocketList: Map<string, boolean> = WEB_SOCKET_LIST;
  sw01!: Switch;
  wsHost!: Combobox;
  wsCName!: Combobox;
  wsChannel!: Combobox;

  ws: WebSocket | null = null;
  wsIconState: string = "red";
  wsButton!: Button;
  wsSecretKey!: TextField;
  wsSecretKeyTogggleShow!: Button;

  sqBodyText!: HTMLParagraphElement;
  sqBodyTextContainer!: HTMLDivElement;
  wsClient: WebClientDetail = new WebClientDetail();
  sqtbody: Array<SQText> = [];

  ngOnInit(): void {
    console.log("isProd : "+environment.production);
    this.sw01 = <Switch>document.getElementById("dark-mode-toggle");
    this.wsHost = <Combobox>document.getElementById("websocket-host-selector");
    this.wsCName = <Combobox>document.getElementById("websocket-client-selector");
    this.wsChannel = <Combobox>document.getElementById("websocket-channel-selector");
    this.sqBodyText = <HTMLParagraphElement>document.getElementById("sq-body-text");
    this.sqBodyTextContainer = <HTMLParagraphElement>document.getElementById("sq-body-text-container");
    this.wsButton = <Button>document.getElementById("connect-button");
    this.wsSecretKey = <TextField>document.getElementById("websocket-secretkey")
    this.wsSecretKeyTogggleShow = <Button>document.getElementById("websocket-secretkey-toggle");
    
    console.log(this.webSocketList);
    this.wsButton.textContent = "Connect";
    
    //this.sqBodyText.innerHTML = ">Hello Command<br>";
       
    this.sw01.onclick = (event) => {
      console.log(this.sw01.checked);
      this.toggleDarkMode();
    };

    SocketMessageInit.initSecretKeyHash(this.wsSecretKey.currentValue);
    this.sqtbody.push(new SQText("Hello Command",SQIconType.SELF,SQIconType.SELF.toLowerCase()));
    // this.webSocketList.forEach((isSelected: boolean, wsName: string)=>{
    //   if(isSelected){
        
    //     this.wsHost.options
    //   }aaa
    // })


  }


  exampleTextField = '';


  onClick() {
    console.log(this.exampleTextField);
  }

  toggleDarkMode() {
    baseLayerLuminance.setValueFor(
      document.body,
      this.sw01.checked ? StandardLuminance.DarkMode : StandardLuminance.LightMode
    );
  }

  test(event: Event) {
    console.log((<Combobox>event.target).currentValue);
  }

  onWSUrlChange(event: Event) {
    this.wsClient.webSocketHost = (<Combobox>event!.target).currentValue;

  }
  onWSClientChange(event: Event) {
    this.wsClient.webClientName = (<Combobox>event!.target).currentValue;
  }
  onWSChannelChange(event: Event) {
    this.wsClient.webSecretChannel = (<Combobox>event!.target).currentValue;
  }

  onWSSecretKeyToggle(){
    
    this.wsSecretKey.type = this.wsSecretKey.type === "text"? "password" : "text";
  }

  SaveSecretKey(){
    
  }
  socketConnect() {
    this.wsClient.webSocketHost = this.wsHost.currentValue;
    this.wsClient.webClientName = this.wsCName.currentValue;
    this.wsClient.webSecretChannel = this.wsChannel.currentValue;
    console.log(this.wsClient.empty());
    if (this.ws?.readyState !== WebSocket.OPEN) {

      try {
        this.ws = new WebSocket(this.wsClient.wsUrl(environment.production? true : false));

        this.ws.onclose = (ev: CloseEvent) => {
          this.wsIconState = "red";
          this.wsButton.textContent = "Connect";
          this.sqtbody.push(this.createSQMessage(SQMessageType.SELF,"WebSocket Closed", "red"));
        }
        this.ws.onopen = (event: Event) => {
          this.wsIconState = "green";
          this.wsButton.textContent = "Disconnect";          
          this.sqtbody.push(this.createSQMessage(SQMessageType.SELF,"WebSocket Opened", "green"));
        }
        this.ws.onmessage = (event: MessageEvent) => {
          console.log(event.data);
          let sm: SocketMessage = SocketMessage.parseJSON(event.data);
          
          console.log(sm);
          this.sqtbody.push(this.createSQMessage(SQMessageType.SERVER,sm.getMessage()));
          setTimeout(() => {
            
            this.sqBodyTextContainer.scrollTop = this.sqBodyTextContainer.scrollHeight;
          }, 250);
        }

      } catch (error) {
        alert(error);
      }

    }else{
      this.ws?.close();
      this.wsButton.textContent = "Connect";
    }

  }

  sendWSMessage(){
    let msg = new SocketMessage(MessageType.REQUEST, 'slaveCommander', this.wsClient.webClientName);
    msg.setMessage("start c @ /// ehco \"hello\" sldnfale aekl owe f");

    console.log(msg);
    this.ws?.send(msg.preparePacket());
  }

  createSQMessage(sqmt: SQMessageType, stringText: string, color: string| null = null){
    let typeString = "";
    let colorString = "";
    let cssSuffix = "";
    switch (sqmt) {
      case SQMessageType.PEER_REQ :
        typeString = "PEER";
        cssSuffix = "req"
        break;
    
        case SQMessageType.PEER_RES :
        typeString = "PEER"
        cssSuffix = "res"
        break;

        case SQMessageType.SERVER :
        typeString = "SRVR";
        cssSuffix = "srvr";
        break;
        
      default:
        typeString = "SELF";
        cssSuffix = "self";
        break;
    }

    return new SQText(stringText,typeString,cssSuffix,color );

  }




}

