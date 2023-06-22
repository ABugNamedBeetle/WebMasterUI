import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideFluentDesignSystem, 
        fluentCard,
        fluentButton,
        fluentTextField,
        fluentSwitch,
        fluentSelect,
        fluentOption,
        fluentSlider,
        fluentSliderLabel,
        PaletteRGB,
        accentPalette,
        SwatchRGB,
        baseLayerLuminance,StandardLuminance, allComponents, accentForegroundActive, neutralStrokeControlActive, neutralBaseColor
       
        
        
     } from '@fluentui/web-components';

import { parseColorHexRGB } from '@microsoft/fast-colors';
import { AppModule } from './app/app.module';
import { style } from '@angular/animations';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));




  
let ds = provideFluentDesignSystem().register(allComponents                               
                                      
  );
  
                        
let r = parseColorHexRGB("#00FFE1")!.r; 
let g = parseColorHexRGB("#00FFE1")!.g; 
let b = parseColorHexRGB("#00FFE1")!.b;                                     
accentPalette.setValueFor(
 
  document.body,
  PaletteRGB.from(SwatchRGB.from({r,g,b}))
);

