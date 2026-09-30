import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ProdutoService, Produto } from '../../models/produto';

import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-tela',
  standalone: false,
  templateUrl: './tela.component.html',
  styleUrl: './tela.component.css'
})
export class TelaComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private keycloak = inject(Keycloak) as unknown as Keycloak;
  private cdr = inject(ChangeDetectorRef);

  nome: string = '';
  preco: number | null = null;
  produtos: Produto[] = [];
  idEditando: number | null = null;
  usuarioNome: string = '';

  async ngOnInit(): Promise<void> {
  try {
    // Inicializa o Keycloak e força o redirecionamento se não estiver autenticado
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false
    });

    if (authenticated) {
      const profile = await this.keycloak.loadUserProfile();
      this.usuarioNome = profile.firstName || profile.username || 'Usuário';
      this.carregarProdutos();
    }
  } catch (error) {
    console.error('Erro ao inicializar Keycloak:', error);
    // Tenta carregar os produtos mesmo se o Keycloak falhar
    this.carregarProdutos();
  } finally {
    // Força a atualização da interface no Web Component logo após resolver a promessa
    this.cdr.detectChanges();
  }
}

  carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: (dados: Produto[]) => { this.produtos = dados,
    this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erro ao buscar produtos:', err)
    });
  }

  salvar(): void {
  if (!this.nome || this.preco === null) {
    alert("Preencha o nome e o preço!");
    return;
  }

  const payload = { nome: this.nome, preco: this.preco };

  if (this.idEditando !== null) {
    // Lógica de Edição (PUT)
    this.produtoService.atualizarProduto(this.idEditando, payload).subscribe({
      next: () => {
        const index = this.produtos.findIndex(p => p.id === this.idEditando);
        if (index !== -1) {
          this.produtos[index] = { 
            id: this.idEditando!, 
            nome: this.nome, 
            preco: this.preco! 
          };
          this.produtos = [...this.produtos];
        }
        this.limparFormulario();
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erro ao atualizar produto:', err)
    });
  } else {
    // Lógica de Criação (POST) - ID Dinâmico Gerado Aqui
    this.produtoService.criarProduto(payload).subscribe({
      next: () => {
        // Gera um ID baseado no maior ID existente + 1 (ou usa timestamp para evitar duplicados)
        const novoId = this.produtos.length > 0 
          ? Math.max(...this.produtos.map(p => p.id ?? 0)) + 1 
          : 1;

        const novoProduto: Produto = {
          id: novoId,
          nome: this.nome,
          preco: this.preco!
        };

        // Adiciona à lista garantindo ID único
        this.produtos = [...this.produtos, novoProduto];
        this.limparFormulario();
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erro ao criar produto:', err)
    });
  }
}

  editar(produto: Produto): void {
    this.nome = produto.nome;
    this.preco = produto.preco;
    this.idEditando = produto.id ?? 1;
    this.cdr.detectChanges();
  }

  // 3. EXCLUSÃO: Filtra o array localmente sem rechamar this.carregarProdutos()
  deletar(id: number): void {
  this.produtoService.deletarProduto(id).subscribe({
    next: () => {
      // Usar Number() garante que a comparação funcione mesmo se o ID vier como string do template
      this.produtos = this.produtos.filter(p => Number(p.id) !== Number(id));
      this.cdr.detectChanges();
    },
    error: (err: any) => console.error('Erro ao deletar produto:', err)
  });
}

  logout(): void {
    this.keycloak.logout({
      redirectUri: 'http://localhost:4200'
    });
  }

  limparFormulario(): void {
    this.nome = '';
    this.preco = null;
    this.idEditando = null;
    this.cdr.detectChanges();
  }
}