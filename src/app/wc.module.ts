import { Injector, NgModule, DoBootstrap } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import Keycloak from 'keycloak-js';
import { TelaComponent } from './features/crud/pages/tela/tela.component';

// Instância do Keycloak com as configurações do seu servidor
const keycloakInstance = new Keycloak({
  url: 'http://localhost/auth', // Ajuste para a URL do seu Keycloak (ex: http://localhost:8080)
  realm: 'squad-arquitetura',           // Ajuste para o nome do seu Realm
  clientId: 'meu-crud'     // Ajuste para o Client ID configurado no Keycloak
});

@NgModule({
  declarations: [TelaComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    // Isso ensina ao Angular o que entregar quando o TelaComponent pedir inject(Keycloak)
    { provide: Keycloak, useValue: keycloakInstance }
  ]
})
export class WCModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const el = createCustomElement(TelaComponent, { injector: this.injector });
    
    if (!customElements.get('meu-widget')) {
      customElements.define('meu-widget', el);
    }
  }
}