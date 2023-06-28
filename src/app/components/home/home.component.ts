import { Component, OnInit } from '@angular/core';
import { baseLayerLuminance, Button, StandardLuminance, Switch } from '@fluentui/web-components';
import { Combobox } from '@fluentui/web-components';
import { WebClientDetail } from 'src/app/models/webClientDetail';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  sw01!: Switch;
  wsHost!: Combobox;
  wsCName!: Combobox;
  wsChannel!: Combobox;

  ws: WebSocket | null = null;
  wsIconState: string = "red";
  wsButton!: Button;

  sqBodyText!: HTMLParagraphElement;
  sqBodyTextContainer!: HTMLDivElement;
  wsClient: WebClientDetail = new WebClientDetail();

  ngOnInit(): void {
    this.sw01 = <Switch>document.getElementById("dark-mode-toggle");
    this.wsHost = <Combobox>document.getElementById("websocket-host-selector");
    this.wsCName = <Combobox>document.getElementById("websocket-client-selector");
    this.wsChannel = <Combobox>document.getElementById("websocket-channel-selector");
    this.sqBodyText = <HTMLParagraphElement>document.getElementById("sq-body-text");
    this.sqBodyTextContainer = <HTMLParagraphElement>document.getElementById("sq-body-text-container");
    this.wsButton = <Button>document.getElementById("connect-button");
    
    this.wsButton.textContent = "Connect";
    
    this.sqBodyText.innerHTML = ">Hello Command<br>";
       
    this.sw01.onclick = (event) => {
      console.log(this.sw01.checked);
      this.toggleDarkMode();
    };




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

  socketConnect() {
    this.wsClient.webSocketHost = this.wsHost.currentValue;
    this.wsClient.webClientName = this.wsCName.currentValue;
    this.wsClient.webSecretChannel = this.wsChannel.currentValue;
    console.log(this.wsClient.empty());
    if (this.ws?.readyState !== WebSocket.OPEN) {

      try {
        this.ws = new WebSocket(this.wsClient.wsUrl());

        this.ws.onclose = (ev: CloseEvent) => {
          this.wsIconState = "red";
          this.sqBodyText.innerHTML += `<span style="color: red;  font-family: monospace;">>WebSocket Closed</span><br>`;
        }
        this.ws.onopen = (event: Event) => {
          this.wsIconState = "green";
          this.wsButton.textContent = "Disconnect";
          this.sqBodyText.innerHTML = `<span style="color: green;  font-family: monospace;">>WebSocket Opened</span><br>`;
        }
        this.ws.onmessage = (event: MessageEvent) => {
          console.log(event.data);
          this.sqBodyText.innerHTML += `<span style="font-family: monospace;">>${event.data}</span><br>`;
          this.sqBodyTextContainer.scrollTop = this.sqBodyTextContainer.scrollHeight;
        }

      } catch (error) {
        alert(error);
      }

    }else{
      this.ws?.close();
      this.wsButton.textContent = "Connect";
    }

  }




}
