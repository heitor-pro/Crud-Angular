import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// Ajuste o caminho da importação caso seu arquivo esteja em outro local
import { ProdutoService, Produto } from '../models/produto';

describe('ProdutoService', () => {
  let service: ProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProdutoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProdutoService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });
});