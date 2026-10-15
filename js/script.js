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
           preco: "R$ 10,00",
           imagem: "images/atum.jpg"
       },
       {
           nome: "Corvina",
           preco: "R$ 35,00",
           imagem: "images/Corvina.webp"
       },
       {
           nome: "Filé Tilápia",
           preco: "R$ 24,00",
           imagem: "images/fileti.webp"
       },
       {
           nome: "Tilápia",
           preco: "R$ 25,00",
           imagem: "images/tilapia.jpg"
       },
       {
           nome: "Sardinha",
           preco: "R$ 25,00",
           imagem: "images/Sardinha.jpg"
       }
   ];
   
   const listaProdutos = document.getElementById("listaProdutos");
   
   function mostrarProdutos(lista) {
       listaProdutos.innerHTML = "";
   
       lista.forEach((produto, index) => {
           const card = document.createElement("article");
           card.classList.add("produto");
           card.style.animationDelay = `${index * 0.06}s`;
   
           card.innerHTML = `
               <div class="produto-imagem">
                   <img src="${produto.imagem}" alt="${produto.nome}">
               </div>
               <div class="produto-info">
                   <h3 class="produto-nome">${produto.nome}</h3>
                   <p class="produto-preco">${produto.preco} <span>/ kg</span></p>
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