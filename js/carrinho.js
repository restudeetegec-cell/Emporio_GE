(function () {
    "use strict";

    // Verifica se estamos na pasta "page products" para voltar um nível.
    // Se for a página do carrinho, ela também está na raiz, então não volta.
    
    const currentPath = decodeURIComponent(window.location.pathname);

    const isProductPage = currentPath.includes("/page products/");
    const isCartPage = currentPath.endsWith("/carrinho/carrinho.html");

    const basePath = (isProductPage || isCartPage) ? "../" : "";

    const cartPageUrl = `${basePath}carrinho/carrinho.html`;
    const catalogUrl = `${basePath}index.html#catalogo`;

    const storageKey = "emporioGE_cart"


    function loadCart() {
        try {
            const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
            if (!Array.isArray(saved)) return [];
            return saved.filter(item => item && typeof item.nome === "string").map(item => ({
                nome: item.nome,
                preco: Number(item.preco) || 0,
                corte: String(item.corte || "Padrão"),
                unidade: String(item.unidade || "unidade"),
                quantidade: Math.max(1, Number.parseInt(item.quantidade, 10) || 1),
                imagem: typeof item.imagem === "string" ? item.imagem : ""
            }));
        } catch (error) {
            return [];
        }
    }

    let cart = loadCart();

    const formatBRL = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const totalItems = () => cart.reduce((sum, item) => sum + item.quantidade, 0);
    const totalPrice = () => cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

    // Cria o Widget (Botão + Gaveta de prévia)
    const widget = document.createElement("div");
    widget.className = "cart-widget";
    widget.innerHTML = `
        <a href="${cartPageUrl}" class="cart-float" aria-label="Abrir carrinho">
            <i class="fa-solid fa-basket-shopping" aria-hidden="true"></i>
            <span class="cart-float__count" id="cartCount">0</span>
        </a>
        <aside class="cart-drawer" id="cartDrawer" aria-label="Prévia do carrinho">
            <div class="cart-drawer__header">
                <strong>Seu carrinho</strong>
                <span id="cartPreviewCount">0 itens</span>
            </div>
            <div class="cart-drawer__items" id="cartPreviewItems"></div>
            <div class="cart-drawer__total">
                <span>Total parcial</span>
                <strong id="cartPreviewTotal">R$ 0,00</strong>
            </div>
            <a class="cart-drawer__checkout" href="${cartPageUrl}">
                Comprar agora <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>
        </aside>
    `;
    document.body.appendChild(widget);

    const cartCountEl = widget.querySelector("#cartCount");
    const previewCountEl = widget.querySelector("#cartPreviewCount");
    const previewItemsEl = widget.querySelector("#cartPreviewItems");
    const previewTotalEl = widget.querySelector("#cartPreviewTotal");

    function saveCart() {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(cart));
        } catch (error) { console.warn("Erro ao salvar carrinho."); }
    }

    function renderWidget() {
        cartCountEl.textContent = String(totalItems());
        previewCountEl.textContent = `${totalItems()} ${totalItems() === 1 ? "item" : "itens"}`;
        previewTotalEl.textContent = formatBRL(totalPrice());
        previewItemsEl.replaceChildren();

        if (cart.length === 0) {
            previewItemsEl.innerHTML = '<p class="cart-drawer__empty">Seu carrinho está vazio.</p>';
            return;
        }

        cart.slice(0, 3).forEach((item) => {
            const row = document.createElement("div");
            row.className = "cart-drawer__item";
            row.innerHTML = `
                <span class="cart-drawer__item-name">${item.quantidade} × ${item.nome}</span>
                <strong>${formatBRL(item.preco * item.quantidade)}</strong>
            `;
            previewItemsEl.appendChild(row);
        });

        if (cart.length > 3) {
            previewItemsEl.innerHTML += `<p class="cart-drawer__more">E mais ${cart.length - 3} produto(s).</p>`;
        }
    }

    function renderCartPage() {
        const container = document.getElementById("cartItemsContainer");
        if (!container) return;

        const totalElement = document.getElementById("cartTotalPrice");
        container.replaceChildren();

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <p>Seu carrinho está vazio.</p>
                    <a href="${catalogUrl}" style="color:goldenrod; text-decoration:none;">Ver produtos</a>
                </div>`;
            if (totalElement) totalElement.textContent = formatBRL(0);
            return;
        }

        cart.forEach((item, index) => {
            const row = document.createElement("article");
            row.className = "cart-item";

            const imgHtml = item.imagem ? `<img src="${item.imagem}" class="cart-item__img" alt="${item.nome}" loading="lazy">` : `<div class="cart-item__img"></div>`;
            
            const option = item.corte && !["Padrão", "Oferta"].includes(item.corte) ? ` • ${item.corte}` : item.corte === "Oferta" ? " • Oferta" : "";

            row.innerHTML = `
                ${imgHtml}
                <div class="cart-item__info">
                    <h4>${item.nome}</h4>
                    <span>${item.quantidade} × ${item.unidade}${option}</span>
                </div>
                <div class="cart-item__price">${formatBRL(item.preco * item.quantidade)}</div>
                <button class="cart-item__remove" onclick="removeFromCart(${index})" aria-label="Remover">
                    <i class="fa-solid fa-trash" aria-hidden="true"></i>
                </button>
            `;
            container.appendChild(row);
        });

        if (totalElement) totalElement.textContent = formatBRL(totalPrice());
    }

    function refresh() { renderWidget(); renderCartPage(); }

    window.addToCart = function (product) {
        if (!product || !product.nome) return false;

        const item = {
            nome: product.nome.trim(),
            preco: Number(product.preco),
            corte: String(product.corte || "Padrão"),
            unidade: String(product.unidade || "unidade"),
            quantidade: Math.max(1, Number.parseInt(product.quantidade, 10) || 1),
            imagem: typeof product.imagem === "string" ? product.imagem : ""
        };

        const existing = cart.find(saved => 
            saved.nome === item.nome && saved.corte === item.corte && saved.unidade === item.unidade
        );

        if (existing) existing.quantidade += item.quantidade;
        else cart.push(item);

        saveCart();
        refresh();
        return true;
    };
// Adiciona as ofertas da página inicial ao carrinho.
document.querySelectorAll("[data-add-offer]").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".oferta");
        if (!card) return;

        const nameElement = card.querySelector(".oferta__nome");
        const priceElement = card.querySelector(".oferta__preco");
        const imageElement = card.querySelector(".oferta__imagem img");

        if (!nameElement || !priceElement) return;

        // Converte, por exemplo, "R$ 22,00" para 22.00.
        const priceMatch = priceElement.textContent.match(
            /R\$\s*([\d.]+,\d{2})/
        );

        if (!priceMatch) {
            alert("Não foi possível identificar o preço da oferta.");
            return;
        }

        const price = Number(
            priceMatch[1].replace(/\./g, "").replace(",", ".")
        );

        const unitElement = priceElement.querySelector("span");
        const unit = unitElement
            ? unitElement.textContent.replace("/", "").trim()
            : "unidade";

        const added = window.addToCart({
            nome: nameElement.textContent.trim(),
            preco: price,
            corte: "Oferta",
            unidade: unit,
            quantidade: 1,
            imagem: imageElement ? imageElement.src : ""
        });

        if (added) {
            const originalText = button.innerHTML;
            button.innerHTML =
                'Adicionado! <i class="fa-solid fa-check"></i>';

            button.disabled = true;

            window.setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 1200);
        }
    });
});

    window.removeFromCart = function (index) {
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            saveCart();
            refresh();
        }
    };

    const checkoutButton = document.getElementById("checkoutBtn");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            if (cart.length === 0) return alert("Carrinho vazio!");
            
            let msg = "Olá, Empório GE! Gostaria de fazer o seguinte pedido:\n\n";
            cart.forEach(item => {
                const option = item.corte && !["Padrão", "Oferta"].includes(item.corte) ? ` (${item.corte})` : "";
                msg += `• ${item.nome}${option}\n`;
                msg += `  Qtd: ${item.quantidade} ${item.unidade} | Subtotal: ${formatBRL(item.preco * item.quantidade)}\n\n`;
            });
            msg += `*TOTAL DO PEDIDO: ${formatBRL(totalPrice())}*`;
            
            window.open(`https://wa.me/5581986836253?text=${encodeURIComponent(msg)}`, "_blank");
        });
    }

    window.addEventListener("storage", (event) => {
        if (event.key === storageKey) { cart = loadCart(); refresh(); }
    });

    refresh();
})();