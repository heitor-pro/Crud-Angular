import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideKeycloak,
  includeBearerTokenInterceptor,
  AutoRefreshTokenService,
  UserActivityService,
  withAutoRefreshToken,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG // 👈 Importe esta configuração
} from 'keycloak-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([includeBearerTokenInterceptor])
    ),
    provideKeycloak({
      config: {
        url: 'http://localhost/auth',
        realm: 'squad-arquitetura',
        clientId: 'meu-crud'
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      },
      features: [
        withAutoRefreshToken()
      ],
      providers: [
        AutoRefreshTokenService, 
        UserActivityService,
        // 💡 REGISTRE A CONFIGURAÇÃO DO INTERCEPTOR AQUI:
        {
          provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
          useValue: [
            {
              urlPattern: /^(http:\/\/localhost:1080\/api\/.*)/i,
              httpMethods: ['GET', 'POST', 'PUT', 'DELETE']
            }
          ]
        }
      ]
    })
  ]
};