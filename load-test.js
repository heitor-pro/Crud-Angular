import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Função para autenticar no Keycloak e obter o Token
function getAuthToken() {
  const url = 'http://localhost/auth/realms/squad-arquitetura/protocol/openid-connect/token';
  const payload = {
    grant_type: 'password',
    client_id: 'meu-crud',
    username: 'heitor', // seu usuário de teste no Keycloak
    password: '123'    // sua senha de teste
  };

  const params = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };

  const res = http.post(url, payload, params);
  
  if (res.status === 200) {
    return res.json().access_token;
  }
  return null;
}

// 2. Execução do teste com o Header de Autorização
export default function () {
  const token = getAuthToken();

  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const url = __ENV.TARGET_URL || 'http://localhost/mock/produtos';
  const res = http.get(url, params);

  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);
}