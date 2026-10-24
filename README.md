<div align="center">
  <img src="images/logo.png" alt="Empório GE Logo" width="150" />
  
  # 🐟 Empório GE
  
  **O melhor pescado da região, agora a um clique de distância.**
  
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)]()
  
  *Uma plataforma moderna de e-commerce para a peixaria Empório GE, focada em UX, acessibilidade e integração direta com WhatsApp.*
</div>

---

## 📑 Índice
- [Prévia do Site](#-prévia-do-site)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [UI/UX e Design System](#-uiux-e-design-system)
- [Como rodar o projeto localmente](#️-como-rodar-o-projeto-localmente)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Roadmap (Próximos Passos)](#-roadmap-próximos-passos)
- [Contribuidores](#-agradecimentos-e-contribuidores)
- [Licença](#-licença)

---

## 📸 Prévia do Site

<div align="center">
  <img src="images/previa.png" alt="Prévia da página inicial do Empório GE" width="100%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />
</div>

---

## 🚀 Sobre o Projeto

O **Empório GE** é um site institucional e de vendas desenvolvido para modernizar a experiência de compra de pescados e frutos do mar. O grande diferencial é o sistema de carrinho de compras nativo (construído do zero com Vanilla JavaScript), que permite aos clientes navegar, adicionar produtos e finalizar o pedido diretamente no WhatsApp da loja.

O design foi inspirado em referências de restaurantes premium, adotando um tema escuro (*Dark Mode*) com detalhes em dourado (`goldenrod`), utilizando a tipografia **Montserrat** para uma leitura limpa e sofisticada. O projeto foi feito sem a necessidade de frameworks pesados, provando que a base da web (HTML, CSS e JS puro) ainda é extremamente poderosa.

## ✨ Funcionalidades

- **🛍️ Navegação e Catálogo:**
- Página inicial: slider de destaque, ofertas e catálogo; os produtos e ofertas são carregados da API.
- Busca de produtos: filtro em tempo real para facilitar a localização dos itens.
- Página de produto: descrição, preço vigente, galeria e opções carregados da API.

- **🛒 Carrinho de Compras:**
- Persistência de dados: utilização do localStorage para manter os itens do carrinho durante a navegação entre páginas.
- Carrinho flutuante: visualização rápida dos itens, com prévia lateral interativa e contador atualizado em tempo real.
- Revisão do pedido: página dedicada que confirma preços e disponibilidade na API antes da finalização.

- **📲 Finalização e Responsividade:**
- Checkout via WhatsApp: geração de uma mensagem organizada com os produtos, as quantidades e os valores do pedido.
- Layout responsivo: interface adaptável para computadores, tablets e celulares.
- Menu mobile: navegação com menu hambúrguer personalizado.
- Acessibilidade: recursos para tornar a navegação mais clara e intuitiva.

## 🎨 UI/UX e Design System

- **Paleta de Cores:** Fundo escuro (quase preto) para destacar os produtos, com detalhes em Dourado (`Goldenrod`) que transmitem sofisticação e luxo.
- **Tipografia:** Contraste entre a fonte *Montserrat* (para títulos e textos) e *Courier New* (para preços), criando hierarquia visual.
- **Micro-interações:** Efeitos de hover suave nos cards de produtos, transições ao trocar imagens na galeria e animações no botão do carrinho.
- **Acessibilidade:** Uso de tags semânticas HTML5, atributos `aria-label` em botões de ícone e contraste de cores pensado para leitura confortável.

---

## 🛠️ Como rodar o projeto localmente

O front-end usa HTML, CSS e JavaScript sem etapa de build. Produtos e ofertas são lidos dos endpoints públicos `GET /v1/products` e `GET /v1/offers` do backend `man`; as rotas de escrita continuam exigindo autenticação.

1. No diretório do backend `man`, aplique as migrações, envie as imagens para a Blob store configurada e importe o catálogo inicial:

   ```bash
   .venv/bin/alembic upgrade head
   PYTHONPATH=. .venv/bin/python scripts/migrate_storefront_images.py
   PYTHONPATH=. .venv/bin/python scripts/seed_storefront.py
   ```

   A importação cria 13 produtos e sete ofertas com validade de sete dias a partir da execução. As 27 imagens dos produtos ficam na Vercel Blob pública configurada; o arquivo local `scripts/data/blob_urls.json` do backend associa cada imagem à sua URL e é gerado pela migração. Reexecutar esses comandos não duplica imagens, produtos nem ofertas ainda ativas. O backend precisa estar em execução na porta `8000`.

2. Neste diretório, inicie o servidor do front-end e abra `http://127.0.0.1:5500`:

   ```bash
   python -m http.server 5500
   ```

3. Para usar outra API, altere a URL absoluta em `js/config.js`. Os preços da API são inteiros em centavos; o front-end os formata em reais. As imagens de produtos e ofertas são URLs públicas retornadas pela API; logo e banners continuam locais.

## 📁 Estrutura de Pastas

A estrutura principal do projeto está organizada da seguinte forma:

```text
Emporio_GE/
├── images/                  # Imagens dos produtos, logo e backgrounds
├── js/                      # Scripts e funcionalidades JavaScript
│   ├── carrinho.js           # Gerenciamento do carrinho e localStorage
│   ├── api.js                # Cliente HTTP e utilitários do catálogo
│   ├── config.js             # URL da API
│   ├── header.js             # Menu mobile e recursos de acessibilidade
│   ├── hero.js               # Slider automático da página inicial
│   ├── product.js            # Página dinâmica de produto
│   └── script.js             # Catálogo, busca e ofertas da API
├── page products/            # Redirecionamentos dos endereços antigos
├── style/                    # Arquivos de estilização CSS
│   ├── main.css              # Estilos globais, variáveis e catálogo
│   ├── header.css            # Estilos da navegação
│   ├── cart.css              # Carrinho e prévia lateral
│   └── productStyle.css      # Estilos das páginas de produto
├── index.html                # Página inicial
├── produto.html              # Detalhes do produto por ID da API
├── carrinho/
│   └── carrinho.html         # Página do carrinho e finalização do pedido
└── README.md                 # Documentação do projeto
```

 # 🗺️ Roadmap (Próximos Passos)

O front-end já conta com as principais funcionalidades de navegação, catálogo e carrinho. As próximas etapas estão voltadas à expansão e à administração da plataforma.

 **✅ Funcionalidades Concluídas**

-  Interface responsiva para diferentes dispositivos.
-  Estrutura de navegação com recursos de acessibilidade.
-  Catálogo interativo com busca de produtos.
-  Páginas individuais com galeria de imagens.
-  Carrinho de compras com persistência via localStorage.
-  Prévia lateral e contador de itens do carrinho.
-  Checkout com geração do pedido para envio pelo WhatsApp.

 ## 🤝 Agradecimentos e Créditos

· Maick Ferreira (@restudeetegec-cell) — Idealizador do projeto

· Victor Baracho (vt-baracho)

· Davi Melo (melo-rs)

· James Veríssimo (JamesV500)
 
· Guilherme Pessoa (Santos-DevLab)

## 🎨 Referências Visuais:

A identidade visual foi inspirada em interfaces de estabelecimentos que valorizam o minimalismo, a sofisticação e a apresentação dos produtos, como Rumorosa, Slate Cafe, Via Quadronno e ONIBUS COFFEE.

## 📄 Licença:
Este projeto está identificado com a licença MIT. Consulte o arquivo LICENSE do repositório para conferir os termos completos de utilização, modificação e distribuição.

<div align="center">
<img src="images/logo.png" alt="Logo do Empório GE" width="90" />

🐟 Empório GE
Qualidade, frescor e praticidade em cada pedido.

Desenvolvido com dedicação, atenção aos detalhes e paixão pela tecnologia.

Transformando a experiência de comprar pescados em algo simples, moderno e acessível.

© 2026 Empório GE · Todos os direitos reservados.

</div>
