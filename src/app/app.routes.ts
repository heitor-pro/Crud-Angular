import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { App } from './app';

const authGuard = async () => {
  const keycloak = inject(Keycloak);

  if (!keycloak.authenticated) {
    await keycloak.login();
    return false;
  }
  return true;
};

export const routes: Routes = [
  {
    path: '',
    component: App,
    canActivate: [authGuard]
  }
];