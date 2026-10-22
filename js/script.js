(() => {
    "use strict";

    const formatBRL = (value) => Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // Carrossel
    const carrossel = document.querySelector(".carrossel");
    if (carrossel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        let direction = 1;
        let paused = false;
        const moveCarousel = () => {
            if (paused || carrossel.scrollWidth <= carrossel.clientWidth + 2) return;
            carrossel.scrollLeft += direction;
            if (carrossel.scrollLeft + carrossel.clientWidth >= carrossel.scrollWidth - 1) direction = -1;
            else if (carrossel.scrollLeft <= 0) direction = 1;
        };
        window.setInterval(moveCarousel, 30);
        ["mouseenter", "focusin", "touchstart"].forEach(e => carrossel.addEventListener(e, () => paused = true));
        ["mouseleave", "focusout", "touchend"].forEach(e => carrossel.addEventListener(e, () => paused = false));
    }

    // Catálogo (Adicionei os caminhos dos temperos e botões de carrinho direto)
    const produtos = [
        { nome: "Atum", preco: 22, unidade: "kg", imagem: "images/atum.jpg", link: "page products/Atum.html" },
        { nome: "Corvina", preco: 19, unidade: "kg", imagem: "images/Corvina.webp", link: "page products/Corvina.html" },
        { nome: "Filé Tilápia", preco: 20, unidade: "kg", imagem: "images/fileti.webp", link: "page products/Filé-Tilápia.html" },
        { nome: "Tilápia", preco: 15, unidade: "kg", imagem: "images/tilapia.jpg", link: "page products/tilapia.html" },
        { nome: "Sardinha", preco: 10, unidade: "pacote de 800g", imagem: "images/Sardinha.jpg", link: "page products/Sardinha.html" },
        { nome: "Camarão", preco: 32, unidade: "kg", imagem: "images/Camarao.jpg", link: "page products/camarao.html" },
        { nome: "Ovos", preco: 20, unidade: "dúzia", imagem: "images/Eggs.jpg", link: "page products/ovos.html" },
        { nome: "Chimichurri", preco: 3, unidade: "pacote", imagem: "images/Chimichurri.jpg", link: "page products/Chimichurri.html" },
        { nome: "Páprica", preco: 3, unidade: "pacote", imagem: "images/Páprica.jpg", link: "page products/Paprica.html" },
        { nome: "Colorau", preco: 2, unidade: "pacote", imagem: "images/Colorau.jpg", link: "page products/Colorau.html" },
        { nome: "Lemon Pepper", preco: 4, unidade: "pote", imagem: "images/Lemon-Peper.avif", link: "page products/Lemon.html" },
        { nome: "Açafrão", preco: 3, unidade: "pacote", imagem: "images/acafrao.avif", link: "page products/Acafrao.html" },
        { nome: "Pasta de Brilho", preco: 8, unidade: "pote", imagem: "images/Pasta-brilho.jpeg", link: "page products/Pasta.html" }
    ];

    const listaProdutos = document.getElementById("listaProdutos");

    function adicionarAoCarrinho(produto) {
        if (typeof window.addToCart !== "function") return alert("Carrinho carregando...");
        window.addToCart({
            nome: produto.nome,
            preco: produto.preco,
            corte: "Padrão",
            unidade: produto.unidade,
            quantidade: 1,
            imagem: produto.imagem ? new URL(produto.imagem, document.baseURI).href : ""
        });
    }

    function mostrarProdutos(lista) {
        if (!listaProdutos) return;
        listaProdutos.replaceChildren();

        lista.forEach((produto, index) => {
            const card = document.createElement("article");
            card.className = "produto";
            card.style.animationDelay = `${index * 0.06}s`;

            const img = produto.imagem ? `<img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">` : `<div class="produto-sem-imagem"><i class="fa-solid ${produto.icone || 'fa-fish'}"></i></div>`;
            
            const btn = produto.link 
                ? `<a href="${produto.link}" class="produto-botao">Comprar <i class="fa-solid fa-arrow-right"></i></a>`
                : `<button type="button" class="produto-botao produto-botao--cart">Adicionar <i class="fa-solid fa-cart-shopping"></i></button>`;

            card.innerHTML = `
                <div class="produto-imagem">${img}</div>
                <div class="produto-info">
                    <h3 class="produto-nome">${produto.nome}</h3>
                    <p class="produto-preco">${formatBRL(produto.preco)} <span>/ ${produto.unidade}</span></p>
                    ${btn}
                </div>
            `;

            const cartBtn = card.querySelector(".produto-botao--cart");
            if (cartBtn) cartBtn.addEventListener("click", () => adicionarAoCarrinho(produto));

            listaProdutos.appendChild(card);
        });
    }

    mostrarProdutos(produtos);

    // Pesquisa
    const abrirPesquisa = document.getElementById("abrirPesquisa");
    const fecharPesquisa = document.getElementById("fecharPesquisa");
    const searchOverlay = document.getElementById("searchOverlay");
    const campoPesquisa = document.getElementById("campoPesquisa");

    if (abrirPesquisa) abrirPesquisa.addEventListener("click", () => { searchOverlay.classList.add("ativo"); campoPesquisa.focus(); });
    if (fecharPesquisa) fecharPesquisa.addEventListener("click", () => searchOverlay.classList.remove("ativo"));

    if (campoPesquisa) {
        campoPesquisa.addEventListener("input", () => {
            const query = campoPesquisa.value.toLowerCase().trim();
            mostrarProdutos(produtos.filter(p => p.nome.toLowerCase().includes(query)));
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && searchOverlay?.classList.contains("ativo")) searchOverlay.classList.remove("ativo");
    });
})();