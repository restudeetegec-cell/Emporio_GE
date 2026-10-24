(() => {
    "use strict";

    const api = window.EmporioAPI;
    const catalog = document.getElementById("listaProdutos");
    const offers = document.getElementById("offerList");
    const searchOverlay = document.getElementById("searchOverlay");
    const searchInput = document.getElementById("campoPesquisa");
    let products = [];

    function icon(className) {
        const element = document.createElement("i");
        element.className = className;
        element.setAttribute("aria-hidden", "true");
        return element;
    }

    function showStatus(container, message) {
        const status = document.createElement("p");
        status.className = "catalog-status";
        status.textContent = message;
        container.replaceChildren(status);
    }

    function productCard(product, index) {
        const card = document.createElement("article");
        card.className = "produto";
        card.style.animationDelay = `${index * 0.06}s`;

        const imageBox = document.createElement("div");
        imageBox.className = "produto-imagem";
        if (product.thumb_url) {
            const image = document.createElement("img");
            image.src = api.assetUrl(product.thumb_url);
            image.alt = product.name;
            image.loading = "lazy";
            imageBox.appendChild(image);
        }

        const info = document.createElement("div");
        info.className = "produto-info";
        const name = document.createElement("h3");
        name.className = "produto-nome";
        name.textContent = product.name;
        const price = document.createElement("p");
        price.className = "produto-preco";
        price.textContent = `${api.formatBRL(product.price)} `;
        const unit = document.createElement("span");
        unit.textContent = `/ ${product.unit}`;
        price.appendChild(unit);
        const link = document.createElement("a");
        link.className = "produto-botao";
        link.href = api.productUrl(product.id);
        link.append("Comprar ", icon("fa-solid fa-arrow-right"));
        info.append(name, price, link);
        card.append(imageBox, info);
        return card;
    }

    function renderProducts(list) {
        if (!list.length) {
            showStatus(catalog, products.length ? "Nenhum produto encontrado." : "Nenhum produto disponível.");
            return;
        }
        catalog.replaceChildren(...list.map(productCard));
    }

    function offerCard(product, offer) {
        const card = document.createElement("article");
        card.className = "oferta";
        const imageBox = document.createElement("div");
        imageBox.className = "oferta__imagem";
        if (offer.thumb_url) {
            const image = document.createElement("img");
            image.src = api.assetUrl(offer.thumb_url);
            image.alt = product.name;
            image.loading = "lazy";
            imageBox.appendChild(image);
        }
        const badge = document.createElement("span");
        badge.className = "oferta__badge";
        badge.textContent = `-${Math.round((1 - offer.promo_price / product.price) * 100)}%`;
        imageBox.appendChild(badge);

        const info = document.createElement("div");
        info.className = "oferta__info";
        const name = document.createElement("h3");
        name.className = "oferta__nome";
        name.textContent = product.name;
        const price = document.createElement("p");
        price.className = "oferta__preco";
        price.textContent = `${api.formatBRL(offer.promo_price)} `;
        const unit = document.createElement("span");
        unit.textContent = `/ ${product.unit}`;
        price.appendChild(unit);
        const link = document.createElement("a");
        link.className = "oferta__botao";
        link.href = api.productUrl(product.id);
        link.append("Ver oferta ", icon("fa-solid fa-arrow-right"));
        const button = document.createElement("button");
        button.type = "button";
        button.className = "oferta__botao oferta__botao--cart";
        button.append("Adicionar ao carrinho ", icon("fa-solid fa-cart-shopping"));
        button.addEventListener("click", () => {
            if (typeof window.addToCart !== "function") return;
            const added = window.addToCart({
                id: product.id,
                nome: product.name,
                preco: offer.promo_price / 100,
                corte: "Padrão",
                unidade: product.unit,
                quantidade: 1,
                imagem: api.assetUrl(offer.thumb_url)
            });
            if (added) {
                button.disabled = true;
                button.textContent = "Adicionado!";
                window.setTimeout(() => {
                    button.disabled = false;
                    button.replaceChildren("Adicionar ao carrinho ", icon("fa-solid fa-cart-shopping"));
                }, 1200);
            }
        });
        info.append(name, price, link, button);
        card.append(imageBox, info);
        return card;
    }

    function renderOffers(products, allOffers) {
        const byId = new Map(products.map(product => [product.id, product]));
        const active = [...api.activeOffers(allOffers).values()]
            .map(offer => [byId.get(offer.product_id), offer])
            .filter(([product, offer]) => product && offer.promo_price < product.price)
            .sort(([firstProduct, firstOffer], [secondProduct, secondOffer]) =>
                (1 - secondOffer.promo_price / secondProduct.price) -
                (1 - firstOffer.promo_price / firstProduct.price)
            );
        if (!active.length) {
            showStatus(offers, "Sem ofertas no momento.");
            return;
        }
        offers.replaceChildren(...active.map(([product, offer]) => offerCard(product, offer)));
    }

    function normalize(value) {
        return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
    }

    document.getElementById("abrirPesquisa")?.addEventListener("click", () => {
        searchOverlay.classList.add("ativo");
        searchInput.focus();
    });
    document.getElementById("fecharPesquisa")?.addEventListener("click", () => searchOverlay.classList.remove("ativo"));
    searchInput?.addEventListener("input", () => {
        const query = normalize(searchInput.value.trim());
        renderProducts(products.filter(product => normalize(product.name).includes(query)));
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") searchOverlay?.classList.remove("ativo");
    });

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        let direction = 1;
        let paused = false;
        window.setInterval(() => {
            if (paused || offers.scrollWidth <= offers.clientWidth + 2) return;
            offers.scrollLeft += direction;
            if (offers.scrollLeft + offers.clientWidth >= offers.scrollWidth - 1) direction = -1;
            else if (offers.scrollLeft <= 0) direction = 1;
        }, 30);
        ["mouseenter", "focusin", "touchstart"].forEach(event => offers.addEventListener(event, () => paused = true));
        ["mouseleave", "focusout", "touchend"].forEach(event => offers.addEventListener(event, () => paused = false));
    }

    Promise.allSettled([api.listProducts(), api.listOffers()]).then(([productResult, offerResult]) => {
        if (productResult.status === "fulfilled") {
            products = productResult.value;
            renderProducts(products);
        } else {
            showStatus(catalog, "Não foi possível carregar os produtos. Atualize a página para tentar novamente.");
            console.error(productResult.reason);
        }
        if (productResult.status === "fulfilled" && offerResult.status === "fulfilled") {
            renderOffers(products, offerResult.value);
        } else {
            showStatus(offers, "Não foi possível carregar as ofertas. Atualize a página para tentar novamente.");
            if (offerResult.status === "rejected") console.error(offerResult.reason);
        }
    });
})();
