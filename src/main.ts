import 'zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { WCModule } from './app/wc.module'; // Importa o módulo do Web Component

platformBrowserDynamic().bootstrapModule(WCModule, {
  ngZoneEventCoalescing: true,
})
.catch((err) => console.error(err));
