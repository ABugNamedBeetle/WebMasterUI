import { Component, OnInit } from '@angular/core';
import { baseLayerLuminance,StandardLuminance,Switch } from '@fluentui/web-components';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  sw01!: Switch;

  ngOnInit(): void {
    this.sw01 =  <Switch> document.getElementById("dark-mode-toggle");
    this.sw01.onclick = (event)=>{
      console.log(this.sw01.checked);
      this.toggleDarkMode();

    };
    
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
}
