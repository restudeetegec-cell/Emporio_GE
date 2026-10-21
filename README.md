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

- **Página Inicial Dinâmica:** Hero slider, seções de ofertas, catálogo interativo e mapa de localização.
- **Catálogo Inteligente:** Filtro de busca em tempo real com atualização suave dos produtos.
- **Páginas Individuais de Produto:** Galeria de imagens (com thumbnails), seletores de corte, quantidade e descrições detalhadas.
- **Carrinho de Compras Global:**
  - Persistência de dados via `localStorage` (não perde o pedido ao trocar de página).
  - Widget flutuante com prévia lateral interativa (*hover*) e contador em tempo real.
  - Página dedicada para revisão do pedido e cálculo de subtotais.
- **Checkout via WhatsApp:** O carrinho gera uma mensagem pré-formatada e rica com todos os itens, quantidades, subtotais e o valor total da compra, enviada diretamente para o número da loja.
- **Design 100% Responsivo:** Layout adaptável para Desktop, Tablet e Mobile, com menu hambúrguer customizado.

## 🎨 UI/UX e Design System

- **Paleta de Cores:** Fundo escuro (quase preto) para destacar os produtos, com detalhes em Dourado (`Goldenrod`) que transmitem sofisticação e luxo.
- **Tipografia:** Contraste entre a fonte *Montserrat* (para títulos e textos) e *Courier New* (para preços), criando hierarquia visual.
- **Micro-interações:** Efeitos de hover suave nos cards de produtos, transições ao trocar imagens na galeria e animações no botão do carrinho.
- **Acessibilidade:** Uso de tags semânticas HTML5, atributos `aria-label` em botões de ícone e contraste de cores pensado para leitura confortável.

---

## 🛠️ Como rodar o projeto localmente

O projeto é construído apenas com tecnologias front-end nativas, sem a necessidade de *build steps* (Webpack, Vite, etc.).

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/restudeetegec-cell/Emporio_GE.git

2. **Acesse a pasta do projeto:**
    cd Emporio_GE

3. **Inicie um servidor local:**
    python -m http.server 5500

## 📁 Estrutura de Pastas

📦 Emporio_GE
 ┣ 📂 images/            # Assets visuais (fotos dos produtos, logo, backgrounds)
 ┣ 📂 js/                # Lógica JavaScript
 ┃ ┣ 📜 carrinho.js      # Gerenciamento global do carrinho (localStorage)
 ┃ ┣ 📜 header.js        # Lógica do menu mobile e acessibilidade
 ┃ ┣ 📜 hero.js          # Slider automático da página inicial
 ┃ ┣ 📜 product.js       # Lógica das páginas de produto (galeria e adicionar ao carrinho)
 ┃ ┗ 📜 script.js        # Geração do catálogo, busca e carrossel de ofertas
 ┣ 📂 page products/     # Páginas HTML individuais de cada produto
 ┣ 📂 style/             # Estilização
 ┃ ┣ 📜 main.css         # Estilos globais, variáveis e catálogo
 ┃ ┣ 📜 header.css       # Estilos da navegação (navbar flutuante)
 ┃ ┣ 📜 cart.css         # Estilos do carrinho e prévia lateral
 ┃ ┣ 📜 productStyle.css # Estilos das páginas de produto
 ┃ ┗ 📜 location.css     # Estilos da seção "Visite-nos" e mapa
 ┣ 📜 index.html         # Página principal
 ┣ 📜 carrinho.html      # Página de finalização do carrinho
 ┗ 📜 README.md

 ## 🗺️ Roadmap (Próximos Passos)

 O front-end está 100% concluído, mas o projeto está preparado para evoluir:

 ☑ Interface responsiva e acessível
 ☑ Carrinho de compras local com persistência
 ☑ Checkout integrado ao WhatsApp
 □ Integração com Backend (Node.js / Python / Firebase) para salvar histórico de pedidos.
 □ Painel Administrativo para gerenciar o catálogo e as ofertas.

 ## 🤝 Agradecimentos e Créditos

· @restudeetegec-cell — Idealizador do projeto

· Guilherme Pessoa (Santos-DevLab) 

· Davi Melo (melo-rs)

· James Veríssimo (JamesV500)

· Victor Baracho (vt-baracho)

· Referências Visuais — Inspirado no design premium e minimalista de sites como Rumorosa, Slate  
Cafe, Via Quadronno e ONIBUS COFFEE.

<div align="center"> <p>Feito com 🐟 e muito código para o <strong>Empório GE</strong>.</p> <p>&copy; 2026 Empório GE. Todos os direitos reservados.</p> </div> ```