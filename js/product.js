(() => {
    "use strict";

    const api = window.EmporioAPI;
    const status = document.getElementById("productStatus");
    const content = document.getElementById("productContent");
    const form = document.getElementById("productForm");
    const quantityInput = document.getElementById("quantity");
    const mainImage = document.getElementById("mainImage");
    const thumbs = document.getElementById("galleryThumbs");
    const whatsappNumber = "5581986836253";
    let product = null;
    let currentPrice = null;

    function showError(message, error) {
        status.hidden = false;
        status.textContent = message;
        content.hidden = true;
        if (error) console.error(error);
    }

    function renderGallery(item) {
        const paths = [...new Set([item.thumb_url, ...(item.gallery_urls || [])].filter(Boolean))];
        thumbs.replaceChildren();
        if (!paths.length) {
            mainImage.removeAttribute("src");
            mainImage.alt = "Imagem indisponível";
            return;
        }

        mainImage.src = api.assetUrl(paths[0]);
        mainImage.alt = item.name;
        paths.forEach((path, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `product-gallery__thumb${index === 0 ? " is-active" : ""}`;
            button.setAttribute("aria-label", `Ver imagem ${index + 1} de ${item.name}`);
            const image = document.createElement("img");
            image.src = api.assetUrl(path);
            image.alt = `${item.name}, imagem ${index + 1}`;
            button.appendChild(image);
            button.addEventListener("click", () => {
                mainImage.src = image.src;
                thumbs.querySelectorAll(".product-gallery__thumb").forEach(thumb => thumb.classList.remove("is-active"));
                button.classList.add("is-active");
            });
            thumbs.appendChild(button);
        });
    }

    function renderProduct(item, offer) {
        product = item;
        currentPrice = offer && offer.promo_price < item.price ? offer.promo_price : item.price;
        document.title = `${item.name} — Empório GE`;
        document.getElementById("breadcrumbName").textContent = item.name;
        document.getElementById("productCategory").textContent = item.category;
        document.getElementById("productName").textContent = item.name;
        document.getElementById("productDescription").textContent = item.description;
        document.getElementById("currentPrice").textContent = api.formatBRL(currentPrice);
        document.getElementById("priceUnit").textContent = `/ ${item.unit}`;
        document.getElementById("quantityLabel").textContent = `Quantidade (${item.unit})`;

        const priceElement = document.getElementById("productPrice");
        const original = document.getElementById("originalPrice");
        if (currentPrice < item.price) {
            priceElement.classList.add("product-info__price--offer");
            original.textContent = api.formatBRL(item.price);
            original.hidden = false;
        } else {
            priceElement.classList.remove("product-info__price--offer");
            original.hidden = true;
        }

        const select = document.getElementById("cutType");
        select.replaceChildren(...(item.options || []).map(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            return option;
        }));
        document.getElementById("optionField").hidden = !item.options?.length;
        document.getElementById("optionLabel").textContent = item.category === "Pescado Fresco" ? "Corte" : "Opção";
        renderGallery(item);
        status.hidden = true;
        content.hidden = false;
    }

    document.querySelectorAll(".product-form__qty-btn").forEach(button => {
        button.addEventListener("click", () => {
            const value = Number(quantityInput.value) || 1;
            const change = button.dataset.action === "plus" ? 1 : -1;
            quantityInput.value = String(Math.min(20, Math.max(1, value + change)));
        });
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (!product || !Number.isFinite(currentPrice) || currentPrice <= 0) return;
        const quantity = Number.parseInt(quantityInput.value, 10);
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return;
        const option = document.getElementById("cutType").value || "Padrão";
        const order = {
            id: product.id,
            nome: product.name,
            preco: currentPrice / 100,
            corte: option,
            quantidade: quantity,
            unidade: product.unit,
            imagem: mainImage.src || ""
        };

        if (event.submitter?.dataset.action === "whatsapp") {
            try {
                const [freshProduct, offers] = await Promise.all([
                    api.getProduct(product.id), api.listOffers()
                ]);
                const offer = api.activeOffers(offers).get(freshProduct.id);
                const freshPrice = offer && offer.promo_price < freshProduct.price
                    ? offer.promo_price : freshProduct.price;
                if (freshPrice !== currentPrice || freshProduct.name !== product.name ||
                    freshProduct.unit !== product.unit) {
                    renderProduct(freshProduct, offer);
                    status.textContent = "Os dados do produto mudaram. Revise o preço e clique novamente para encomendar.";
                    status.hidden = false;
                    return;
                }
            } catch (error) {
                status.textContent = "Não foi possível confirmar o preço. Tente novamente.";
                status.hidden = false;
                console.error(error);
                return;
            }

            const message = [
                "Olá, Empório GE! Gostaria de fazer uma encomenda:",
                "",
                `Produto: ${order.nome}`,
                `Opção: ${order.corte}`,
                `Quantidade: ${order.quantidade} (${order.unidade})`,
                `Preço unitário: ${api.formatBRL(currentPrice)}`,
                `Subtotal: ${api.formatBRL(currentPrice * quantity)}`,
                "",
                "Poderiam confirmar a disponibilidade?"
            ].join("\n");
            window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
            return;
        }

        if (event.submitter?.dataset.action === "cart") {
            if (typeof window.addToCart !== "function" || !window.addToCart(order)) {
                alert("Não foi possível adicionar o produto ao carrinho.");
                return;
            }
            const button = event.submitter;
            button.disabled = true;
            window.setTimeout(() => { button.disabled = false; }, 1000);
        }
    });

    async function loadProduct() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        const legacyName = params.get("name");
        if (!id && !legacyName) {
            showError("Produto não informado. Volte ao catálogo e escolha um produto.");
            return;
        }

        try {
            const [item, offers] = await Promise.all([
                id ? api.getProduct(id) : api.listProducts().then(items => items.find(product => product.name === legacyName)),
                api.listOffers()
            ]);
            if (!item) {
                showError("Produto não encontrado.");
                return;
            }
            renderProduct(item, api.activeOffers(offers).get(item.id));
        } catch (error) {
            showError("Não foi possível carregar o produto. Atualize a página para tentar novamente.", error);
        }
    }

    loadProduct();
})();
