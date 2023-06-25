import { Component, OnInit } from '@angular/core';
import { baseLayerLuminance,StandardLuminance,Switch } from '@fluentui/web-components';
import { Combobox } from '@fluentui/web-components';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  sw01!: Switch;
  wsSelector!: Combobox;

  ngOnInit(): void {
    this.sw01 =  <Switch> document.getElementById("dark-mode-toggle");
    this.wsSelector = <Combobox> document.getElementById("websocket-selector");

    this.sw01.onclick = (event)=>{
      console.log(this.sw01.checked);
      this.toggleDarkMode();
    };
    
    // this.wsSelector.onchange = (event)=>{
    //   console.log((<Combobox>event.target).currentValue);
    // }
    
  }


  exampleTextField = '';
  

  onClick() {
    console.log(this.exampleTextField);
  }

  toggleDarkMode(){
    baseLayerLuminance.setValueFor(
      document.body,
      this.sw01.checked ? StandardLuminance.DarkMode : StandardLuminance.LightMode
    );
  }

  test(event:Event){
    console.log((<Combobox>event.target).currentValue);
  }
}
