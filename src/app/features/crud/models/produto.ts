import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number;
  nome: string;
  preco: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:1080/api/produtos';

  // 1. GET - Buscar todos os produtos
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API_URL);
  }

  // 2. POST - Criar novo produto
  criarProduto(produto: Produto): Observable<any> {
    return this.http.post<any>(this.API_URL, produto);
  }

  // 3. PUT - Atualizar produto existente (id = 1 para bater com o mock)
  atualizarProduto(id: number, produto: Produto): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, produto);
  }

  // 4. DELETE - Remover produto (id = 1 para bater com o mock)
  deletarProduto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}