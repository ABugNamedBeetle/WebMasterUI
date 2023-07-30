import { Component, OnInit } from '@angular/core';
import { baseLayerLuminance, Button, Listbox, StandardLuminance, Switch, switchStyles, TextField, TreeItem, TreeView } from '@fluentui/web-components';

import { Combobox } from '@fluentui/web-components';
import { SessionPacket } from 'src/app/models/SessionPacket';
import { SQIconType, SQMessageType, SQText } from 'src/app/models/sqText';
import { WebClientDetail } from 'src/app/models/webClientDetail';
import { MessageSubType, MessageType, SocketMessage, SocketMessageInit } from 'src/app/models/websocketMessage';
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

  // sqBodyText!: HTMLParagraphElement; //p tag
  sqBodyTextContainer!: HTMLDivElement;
  wsClient: WebClientDetail = new WebClientDetail();
  sqUnAttndCount: number = 0;
  sqtbody: Array<SQText> = [];  //select query text message body that records req and resp
  peerList: Array<string> = [];

  cPeerStatusConnected: boolean = false;
  cPeerName = "Connect Peer";
  cLastHealth = "00:00AM";
  cHealthTimeOut = 0;
  healthIntervalID: number = -1;
  peerOnChnlList!: TreeView;


  ngOnInit(): void {
    console.log("isProd : " + environment.production);
    this.sw01 = <Switch>document.getElementById("dark-mode-toggle");
    this.wsHost = <Combobox>document.getElementById("websocket-host-selector");
    this.wsCName = <Combobox>document.getElementById("websocket-client-selector");
    this.wsChannel = <Combobox>document.getElementById("websocket-channel-selector");
    // this.sqBodyText = <HTMLParagraphElement>document.getElementById("sq-body-text");
    this.sqBodyTextContainer = <HTMLParagraphElement>document.getElementById("sq-body-text-container");
    this.wsButton = <Button>document.getElementById("connect-button");
    this.wsSecretKey = <TextField>document.getElementById("websocket-secretkey")
    this.wsSecretKeyTogggleShow = <Button>document.getElementById("websocket-secretkey-toggle");
    this.peerOnChnlList = <TreeView>document.getElementById("peer-tree-view-list");
    console.log(this.webSocketList);
    this.wsButton.textContent = "Connect";

    //this.sqBodyText.innerHTML = ">Hello Command<br>";

    this.sw01.onclick = (event) => {
      console.log(this.sw01.checked);
      this.toggleDarkMode();
    };

    SocketMessageInit.initSecretKeyHash(this.wsSecretKey.currentValue);
    this.sqtbody.push(new SQText("Hello Command", SQIconType.SELF, SQIconType.SELF.toLowerCase()));
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
    console.log(this.sqBodyTextContainer.checkVisibility);
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

  onWSSecretKeyToggle() {

    this.wsSecretKey.type = this.wsSecretKey.type === "text" ? "password" : "text";
  }

  SaveSecretKey() {

  }
  socketConnect() {
    this.wsClient.webSocketHost = this.wsHost.currentValue;
    this.wsClient.webClientName = this.wsCName.currentValue;
    this.wsClient.webSecretChannel = this.wsChannel.currentValue;
    console.log(this.wsClient.empty());
    if (this.ws?.readyState !== WebSocket.OPEN) {

      try {
        this.ws = new WebSocket(this.wsClient.wsUrl(environment.production ? true : false));

        this.ws.onclose = (ev: CloseEvent) => {
          this.wsIconState = "red";
          this.wsButton.textContent = "Connect";
          if (this.cPeerStatusConnected) {
            this.cPeerStatusConnected = false;
            this.cHealthTimeOut = 0;
            this.cPeerName = "Connect Peer";
            this.cLastHealth = "00:00AM"
          }

          clearInterval(this.healthIntervalID); //clear session session scheduler 

          this.sqtbody.push(this.createSQMessage(SQMessageType.SELF, "WebSocket Closed", "red"));
        }
        this.ws.onopen = (event: Event) => {
          this.wsIconState = "green";
          this.wsButton.textContent = "Disconnect";
          this.sqtbody.push(this.createSQMessage(SQMessageType.SELF, "WebSocket Opened", "green"));
        }
        this.ws.onmessage = (event: MessageEvent) => {
          console.log(event.data);
          this.messageWorker(event.data);
        }

      } catch (error) {
        alert(error);
      }

    } else {
      this.ws?.close();
      this.wsButton.textContent = "Connect";
    }

  }

  sendWSMessage() {
    let msg = new SocketMessage(MessageType.REQUEST, 'slaveCommander', this.wsClient.webClientName);
    msg.setMessage("start c @ /// ehco \"hello\" sldnfale aekl owe f");

    console.log(msg);
    this.ws?.send(msg.preparePacket());
  }


  createSQMessage(sqmt: SQMessageType, stringText: string, color: string | null = null) {
    let typeString = "";
    let colorString = "";
    let cssSuffix = "";
    switch (sqmt) {
      case SQMessageType.PEER_REQ:
        typeString = "PEER";
        cssSuffix = "req"
        break;

      case SQMessageType.PEER_RES:
        typeString = "PEER"
        cssSuffix = "res"
        break;

      case SQMessageType.SERVER:
        typeString = "SRVR";
        cssSuffix = "srvr";
        break;

      default:
        typeString = "SELF";
        cssSuffix = "self";
        break;
    }

    return new SQText(stringText, typeString, cssSuffix, color);

  }


  //RESPONSE message Worker
  messageWorker(data: string) {
    let sm: SocketMessage = SocketMessage.parseJSON(data);
    console.log(sm);

    switch (sm.type) {

      case MessageType.RESPONSE:
        this.responseMessageWorker(sm);
        break;
      default:
        break;
    }


    setTimeout(() => {
      this.sqBodyTextContainer.scrollTop = this.sqBodyTextContainer.scrollHeight;
    }, 250);
  }

  responseMessageWorker(sm: SocketMessage) {
    switch (sm.subType) {
      case MessageSubType.PEERLIST: {

        //empty old peer
        this.peerList = [];
        //update the peer list
        this.peerList.push(...<Array<string>>JSON.parse(sm.getMessage()));
        //SQ body for the response that the peer list receive from server
        this.sqtMessageWorker(this.createSQMessage(SQMessageType.SERVER, `${this.peerList.length} Peer Updated`));
        console.log("PEER LIST" + this.peerList)
        break;
      }

      case MessageSubType.SESSIONCREATED: {

        this.sqtMessageWorker(this.createSQMessage(SQMessageType.PEER_RES, `Session Accepted from ${sm.getOrigin()}`));
        let sp: SessionPacket = SessionPacket.parseJSON(sm.getMessage());
        if (sp.getStateCode() === 2) {
          if (sp.getPeerName().trim() === this.wsClient.webClientName.trim()) { //same rec and clinet name

            this.cPeerName = sm.getOrigin();
            this.cPeerStatusConnected = true;
            this.cHealthTimeOut = sp.getHealthTimeOut();
            //send first session health
            this.sendSessionHealth();
            //and start 
            this.healthIntervalID = window.setInterval(() => {
              this.sendSessionHealth();
              console.log(Date.now());
            }, this.cHealthTimeOut * 1000);


          }
        }


        break;
      }

      case MessageSubType.SESSIONHEALTH: { //when recived session health
        let options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric", hour12: true }

        this.cLastHealth = new Date().toLocaleTimeString('en-US', options);
        console.log(this.cLastHealth);

        //login for failing
        break;
      }

      default:

        this.sqtMessageWorker(this.createSQMessage(SQMessageType.SERVER, sm.getMessage()));

        break;
        break;

    }
  }


  //will add message to Select Query Text windows, if not visible then add to counter badge
  sqtMessageWorker(sqt: SQText) {
    if (this.sqBodyTextContainer.checkVisibility()) {
      this.sqtbody.push(sqt);
    } else {
      this.sqUnAttndCount += 1;
      this.sqtbody.push(sqt);
    }
  }

  ///request Funcitons
  loadPeers() {
    try {
      clearInterval(this.healthIntervalID); //clear session session scheduler 
    } finally {

      this.requestMessageWorker("LIST-PEER");
    }
  }
  sendPeerSessionRequest() {
    try {

      clearInterval(this.healthIntervalID); //clear session session scheduler 
    } finally {

      this.requestMessageWorker("CREATE-SESSION");
    }
  }
  sendSessionHealth() {
    this.requestMessageWorker("SESSION-HEALTH");
  }


  requestMessageWorker(requestType: string) {

    switch (requestType) {
      case "CREATE-SESSION": {
        let selectedPeerName = this.peerOnChnlList.currentSelected?.textContent?.trim();
        console.log(selectedPeerName);
        if (selectedPeerName !== undefined && selectedPeerName !== null && this.ws?.readyState === WebSocket.OPEN) {
          let createSessionMsg = new SocketMessage(MessageType.REQUEST, selectedPeerName, this.wsClient.webClientName);
          createSessionMsg.setMessageSubType(MessageSubType.CREATESESSION);
          //create session packet
          let sp = new SessionPacket().setPeerName(selectedPeerName).setHealthTimeout(1);
          createSessionMsg.setMessage(sp.preparePacket());
          console.log(createSessionMsg);


          this.sqtMessageWorker(this.createSQMessage(SQMessageType.PEER_REQ, `Session Sent to ${selectedPeerName}`));
          this.ws?.send(createSessionMsg.preparePacket());

        }
      }

        break;


      case "LIST-PEER": {
        console.log("in load peer");
        let msg = new SocketMessage(MessageType.REQUEST, "server", this.wsClient.webClientName);
        msg.setMessage("List Peer request");
        msg.setMessageSubType(MessageSubType.LISTPEER)
        console.log(msg);
        this.ws?.send(msg.preparePacket());
        break;
      }
      case "SESSION-HEALTH": {

        let sHmsg = new SocketMessage(MessageType.REQUEST, this.cPeerName, this.wsClient.webClientName);
        sHmsg.setMessageSubType(MessageSubType.SESSIONHEALTH);
        sHmsg.setMessage("-SESSION-HEALTH-OK-");
        console.log(sHmsg);
        this.ws?.send(sHmsg.preparePacket());
        break;
      }


      default:
        break;
    }
  }



}



