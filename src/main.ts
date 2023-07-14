import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideFluentDesignSystem, 
        
        PaletteRGB,
        accentPalette,
        SwatchRGB,
        allComponents,
        density,
        bodyFont
       
        
        
     } from '@fluentui/web-components';

import { parseColorHexRGB } from '@microsoft/fast-colors';
import { AppModule } from './app/app.module';
import { style } from '@angular/animations';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));




  
let ds = provideFluentDesignSystem().register(allComponents);
  
                        
let r = parseColorHexRGB("#00FFE1")!.r; 
let g = parseColorHexRGB("#00FFE1")!.g; 
let b = parseColorHexRGB("#00FFE1")!.b;    
// density.setValueFor(document.body, 0);
                    
accentPalette.setValueFor(
  document.body,
  PaletteRGB.from(SwatchRGB.from({r,g,b})) //, {preserveSource:true, stepContrastRamp: 0.03, stepContrast:1.03}
);

