/* =========================================================
   CARROSSEL AUTOMÁTICO DAS OFERTAS
   ========================================================= */

   const carrossel = document.querySelector(".carrossel");

   if (carrossel) {
       let velocidade = 1;
       let pausado = false;
   
       function moverCarrossel() {
           if (pausado) return;
   
           carrossel.scrollBy({ left: velocidade, behavior: 'instant' });
   
           if (carrossel.scrollLeft + carrossel.clientWidth >= carrossel.scrollWidth - 1) {
               velocidade = -1;
           }
   
           if (carrossel.scrollLeft <= 0) {
               velocidade = 1;
           }
       }
   
       setInterval(moverCarrossel, 30);
   
       // Pausa o auto-scroll quando o usuário interage
       carrossel.addEventListener("mouseenter", () => { pausado = true; });
       carrossel.addEventListener("mouseleave", () => { pausado = false; });
       carrossel.addEventListener("touchstart", () => { pausado = true; });
       carrossel.addEventListener("touchend", () => { pausado = false; });
   }
   
   /* =========================================================
      CATÁLOGO DE PRODUTOS
      ========================================================= */
   
   const produtos = [
       { 
           nome: "Atum", 
           preco: "R$ 22,00", 
           unidade: "500g", 
           imagem: "images/atum.jpg", 
           link: "page products/Atum.html" 
       },
       { 
           nome: "Corvina", 
           preco: "R$ 19,00", 
           unidade: "kg", 
           imagem: "images/Corvina.webp", 
           link: "page products/Corvina.html" 
       },
       { 
           nome: "Filé Tilápia", 
           preco: "R$ 20,00", 
           unidade: "kg", 
           imagem: "images/fileti.webp", 
           link: "page products/fileti.html" 
       },
       { 
           nome: "Tilápia", 
           preco: "R$ 15,00", 
           unidade: "kg", 
           imagem: "images/tilapia.jpg", 
           link: "page products/tilapia.html" 
       },
       { 
           nome: "Sardinha", 
           preco: "R$ 10,00", 
           unidade: "800g", 
           imagem: "images/Sardinha.jpg", 
           link: "page products/Sardinha.html" 
       },
       { 
           nome: "Camarão", 
           preco: "R$ 45,00", 
           unidade: "kg", 
           imagem: "images/Camarao.jpg", 
           icone: "fa-shrimp", 
           link: "page products/camarao.html" 
       },
       { 
           nome: "Ovos", 
           preco: "R$ 20,00", 
           unidade: "dúzia", 
           imagem: "images/Eggs.jpg", 
           icone: "fa-egg", 
           link: "page products/ovos.html" 
       },
       { 
           nome: "Chimichurri", 
           preco: "R$ 3,00", 
           unidade: "Pacote", 
           imagem: "images/Chimichurri.jpg", 
           icone: "fa-mortar-pestle", 
           link: "page products/chimichurri.html" 
       },
       { 
           nome: "Páprica", 
           preco: "R$ 3,00", 
           unidade: "Pacote", 
           imagem: "images/Páprica.jpg", 
           icone: "fa-pepper-hot", 
           link: "page products/paprica.html" 
       },
       { 
           nome: "Colorau", 
           preco: "R$ 2,00", 
           unidade: "Pacote", 
           imagem: "images/Colorau.jpg", 
           icone: "fa-pepper-hot", 
           link: "page products/colorau.html" 
       },
       { 
           nome: "Lemon Pepper", 
           preco: "R$ 14,00", 
           unidade: "pote", 
           imagem: "images/Lemon-Peper.avif", 
           icone: "fa-lemon", 
           link: "page products/lemon-pepper.html" 
       },
       { 
           nome: "Açafrão", 
           preco: "R$ 3,00", 
           unidade: "Pacote", 
           imagem: "images/acafrao.avif", 
           icone: "fa-mortar-pestle", 
           link: "page products/acafrao.html" 
       },
       { 
           nome: "Pasta de Brilho", 
           preco: "R$ 3,00", 
           unidade: "Pote", 
           imagem: "images/pasta-brilho.jpeg", 
           icone: "fa-pasta-brilho", 
           link: "page products/pasta-brilho.html"
       }   

   ];
   
   const listaProdutos = document.getElementById("listaProdutos");
   
   function mostrarProdutos(lista) {
       listaProdutos.innerHTML = "";
   
       lista.forEach((produto, index) => {
           const card = document.createElement("article");
           card.classList.add("produto");
           card.style.animationDelay = `${index * 0.06}s`;
   
           // Define a unidade padrão como "kg" caso não esteja especificada
           const unidade = produto.unidade || "kg";
   
           // Se tiver imagem, usa a imagem. Se não, usa o ícone.
           const conteudoImagem = produto.imagem
               ? `<img src="${produto.imagem}" alt="${produto.nome}">`
               : `<div class="produto-sem-imagem">
                      <i class="fa-solid ${produto.icone || 'fa-fish'}"></i>
                  </div>`;
   
           card.innerHTML = `
               <div class="produto-imagem">
                   ${conteudoImagem}
               </div>
               <div class="produto-info">
                   <h3 class="produto-nome">${produto.nome}</h3>
                   <p class="produto-preco">${produto.preco} <span>/ ${unidade}</span></p>
                   <a href="${produto.link}" class="produto-botao">
                       Comprar
                       <i class="fa-solid fa-arrow-right"></i>
                   </a>
               </div>
           `;
   
           listaProdutos.appendChild(card);
       });
   }
   
   mostrarProdutos(produtos);
   
   /* =========================================================
      PESQUISA
      ========================================================= */
   
   const abrirPesquisa = document.getElementById("abrirPesquisa");
   const fecharPesquisa = document.getElementById("fecharPesquisa");
   const searchOverlay = document.getElementById("searchOverlay");
   const campoPesquisa = document.getElementById("campoPesquisa");
   
   abrirPesquisa.addEventListener("click", () => {
       searchOverlay.classList.add("ativo");
       campoPesquisa.focus();
   });
   
   fecharPesquisa.addEventListener("click", () => {
       searchOverlay.classList.remove("ativo");
   });
   
   campoPesquisa.addEventListener("input", () => {
       const texto = campoPesquisa.value.toLowerCase().trim();
   
       const resultados = produtos.filter(produto =>
           produto.nome.toLowerCase().includes(texto)
       );
   
       mostrarProdutos(resultados);
   });
   
   document.addEventListener("keydown", (e) => {
       if (e.key === "Escape" && searchOverlay.classList.contains("ativo")) {
           searchOverlay.classList.remove("ativo");
       }
   });