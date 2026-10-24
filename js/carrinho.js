(function () {
    "use strict";

    // Links relativos partem da raiz ou de uma página em subdiretório.
    const currentPath = decodeURIComponent(window.location.pathname);

    const isProductPage = currentPath.includes("/page products/");
    const isCartPage = currentPath.endsWith("/carrinho/carrinho.html");

    const basePath = (isProductPage || isCartPage) ? "../" : "";

    const cartPageUrl = `${basePath}carrinho/carrinho.html`;
    const catalogUrl = `${basePath}index.html#catalogo`;

    const storageKey = "emporioGE_cart";


    function loadCart() {
        try {
            const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
            if (!Array.isArray(saved)) return [];
            return saved.filter(item =>
                item && typeof item.nome === "string" && item.nome.trim() &&
                Number.isFinite(Number(item.preco)) && Number(item.preco) > 0
            ).map(item => ({
                id: typeof item.id === "string" ? item.id : "",
                nome: item.nome.trim(),
                preco: Number(item.preco),
                corte: String(item.corte || "Padrão"),
                unidade: String(item.unidade || "unidade"),
                quantidade: Math.max(1, Number.parseInt(item.quantidade, 10) || 1),
                imagem: typeof item.imagem === "string" ? item.imagem : "",
                unavailable: item.unavailable === true
            }));
        } catch (error) {
            return [];
        }
    }

    let cart = loadCart();

    const formatBRL = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const totalItems = () => cart.reduce((sum, item) => sum + item.quantidade, 0);
    const totalPrice = () => cart.reduce((sum, item) => sum + (item.unavailable ? 0 : item.preco * item.quantidade), 0);

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
            const name = document.createElement("span");
            name.className = "cart-drawer__item-name";
            name.textContent = `${item.quantidade} × ${item.nome}`;
            const price = document.createElement("strong");
            price.textContent = item.unavailable ? "Indisponível" : formatBRL(item.preco * item.quantidade);
            row.append(name, price);
            previewItemsEl.appendChild(row);
        });

        if (cart.length > 3) {
            const more = document.createElement("p");
            more.className = "cart-drawer__more";
            more.textContent = `E mais ${cart.length - 3} produto(s).`;
            previewItemsEl.appendChild(more);
        }
    }

    function renderCartPage() {
        const container = document.getElementById("cartItemsContainer");
        if (!container) return;

        const totalElement = document.getElementById("cartTotalPrice");
        const checkout = document.getElementById("checkoutBtn");
        container.replaceChildren();

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <p>Seu carrinho está vazio.</p>
                    <a href="${catalogUrl}" style="color:goldenrod; text-decoration:none;">Ver produtos</a>
                </div>`;
            if (totalElement) totalElement.textContent = formatBRL(0);
            if (checkout) checkout.disabled = true;
            return;
        }

        cart.forEach((item, index) => {
            const row = document.createElement("article");
            row.className = "cart-item";

            const image = document.createElement(item.imagem ? "img" : "div");
            image.className = "cart-item__img";
            if (item.imagem) {
                image.src = item.imagem;
                image.alt = item.nome;
                image.loading = "lazy";
            }

            const option = item.corte && !["Padrão", "Oferta"].includes(item.corte) ? ` • ${item.corte}` : item.corte === "Oferta" ? " • Oferta" : "";

            const info = document.createElement("div");
            info.className = "cart-item__info";
            const name = document.createElement("h4");
            name.textContent = item.nome;
            const details = document.createElement("span");
            details.textContent = `${item.quantidade} × ${item.unidade}${option}`;
            info.append(name, details);

            const price = document.createElement("div");
            price.className = "cart-item__price";
            price.textContent = item.unavailable ? "Indisponível" : formatBRL(item.preco * item.quantidade);

            const removeButton = document.createElement("button");
            removeButton.className = "cart-item__remove";
            removeButton.type = "button";
            removeButton.setAttribute("aria-label", "Remover");
            removeButton.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i>';
            removeButton.addEventListener("click", () => window.removeFromCart(index));

            row.append(image, info, price, removeButton);
            container.appendChild(row);
        });

        if (totalElement) totalElement.textContent = formatBRL(totalPrice());
        if (checkout) checkout.disabled = cart.length === 0 || cart.some(item => item.unavailable);
    }

    function refresh() { renderWidget(); renderCartPage(); }

    window.addToCart = function (product) {
        if (!product || typeof product.nome !== "string" || !product.nome.trim() ||
            !Number.isFinite(Number(product.preco)) || Number(product.preco) <= 0) return false;

        const item = {
            id: typeof product.id === "string" ? product.id : "",
            nome: product.nome.trim(),
            preco: Number(product.preco),
            corte: String(product.corte || "Padrão"),
            unidade: String(product.unidade || "unidade"),
            quantidade: Math.max(1, Number.parseInt(product.quantidade, 10) || 1),
            imagem: typeof product.imagem === "string" ? product.imagem : "",
            unavailable: false
        };

        const existing = cart.find(saved => 
            (saved.id && item.id ? saved.id === item.id : saved.nome === item.nome) &&
            saved.corte === item.corte && saved.unidade === item.unidade
        );

        if (existing) {
            existing.quantidade += item.quantidade;
            existing.id = item.id || existing.id;
            existing.preco = item.preco;
            existing.imagem = item.imagem;
            existing.unavailable = false;
        }
        else cart.push(item);

        saveCart();
        refresh();
        return true;
    };
    window.removeFromCart = function (index) {
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            saveCart();
            refresh();
            if (cartStatus && !cart.some(item => item.unavailable)) cartStatus.textContent = "";
        }
    };

    const checkoutButton = document.getElementById("checkoutBtn");
    const cartStatus = document.getElementById("cartStatus");

    async function syncCartWithAPI() {
        if (!cart.length) return { available: true, changed: false };
        const api = window.EmporioAPI;
        if (!api) throw new Error("API não configurada.");

        const [products, offers] = await Promise.all([api.listProducts(), api.listOffers()]);
        const byId = new Map(products.map(product => [product.id, product]));
        const byName = new Map(products.map(product => [product.name, product]));
        const activeOffers = api.activeOffers(offers);
        let changed = false;
        let unavailable = false;

        cart = cart.map(item => {
            const product = byId.get(item.id) || byName.get(item.nome);
            if (!product || !Number.isFinite(product.price) || product.price <= 0) {
                unavailable = true;
                return { ...item, unavailable: true };
            }
            const offer = activeOffers.get(product.id);
            const priceCents = offer && offer.promo_price < product.price ? offer.promo_price : product.price;
            const price = priceCents / 100;
            if (item.preco !== price) changed = true;
            return {
                ...item,
                id: product.id,
                nome: product.name,
                preco: price,
                corte: item.corte === "Oferta" ? "Padrão" : item.corte,
                unidade: product.unit,
                imagem: api.assetUrl(product.thumb_url),
                unavailable: false
            };
        });
        saveCart();
        refresh();
        if (cartStatus) {
            cartStatus.textContent = unavailable
                ? "Remova os produtos indisponíveis para finalizar o pedido."
                : changed ? "Os preços foram atualizados conforme o catálogo atual." : "";
        }
        return { available: !unavailable, changed };
    }

    if (checkoutButton) {
        syncCartWithAPI().catch(error => {
            if (cartStatus) cartStatus.textContent = "Não foi possível confirmar os preços. Tente novamente antes de finalizar.";
            console.error(error);
        });
        checkoutButton.addEventListener("click", async () => {
            if (cart.length === 0) return alert("Carrinho vazio!");
            checkoutButton.disabled = true;
            try {
                const result = await syncCartWithAPI();
                if (!result.available) return;
                if (!cart.length) return alert("Carrinho vazio!");
                if (result.changed) {
                    if (cartStatus) cartStatus.textContent = "Os preços mudaram. Revise o total e clique novamente para finalizar.";
                    return;
                }
            } catch (error) {
                if (cartStatus) cartStatus.textContent = "Não foi possível confirmar os preços. Tente novamente.";
                console.error(error);
                return;
            } finally {
                checkoutButton.disabled = cart.some(item => item.unavailable);
            }

            let msg = "Olá, Empório GE! Gostaria de fazer o seguinte pedido:\n\n";
            cart.forEach(item => {
                const option = item.corte && !["Padrão", "Oferta"].includes(item.corte) ? ` (${item.corte})` : "";
                msg += `• ${item.nome}${option}\n`;
                msg += `  Qtd: ${item.quantidade} ${item.unidade} | Subtotal: ${formatBRL(item.preco * item.quantidade)}\n\n`;
            });
            msg += `*TOTAL DO PEDIDO: ${formatBRL(totalPrice())}*`;
            
            window.location.assign(`https://wa.me/5581986836253?text=${encodeURIComponent(msg)}`);
        });
    }

    window.addEventListener("storage", (event) => {
        if (event.key === storageKey) { cart = loadCart(); refresh(); }
    });

    refresh();
})();
