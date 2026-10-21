
(function () {
    "use strict";

    const mainImage = document.getElementById("mainImage");
    const thumbs = document.querySelectorAll(".product-gallery__thumb");
    const qtyInput = document.getElementById("quantity");
    const form = document.getElementById("productForm");

    const whatsappNumber = "5581986836253";

    // ============================================================
    // 1. TROCA DA IMAGEM PRINCIPAL
    // ============================================================

    thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            const newSrc = thumb.dataset.image;

            if (!newSrc || !mainImage) return;

            mainImage.style.opacity = "0";

            window.setTimeout(() => {
                mainImage.src = newSrc;
                mainImage.style.opacity = "1";
            }, 150);

            thumbs.forEach((item) => {
                item.classList.remove("is-active");
            });

            thumb.classList.add("is-active");
        });
    });

    // ============================================================
    // 2. CONTROLES DE QUANTIDADE (+ E -)
    // ============================================================

    if (qtyInput) {
        document.querySelectorAll(".product-form__qty-btn")
            .forEach((button) => {
                button.addEventListener("click", () => {
                    const min = Number(qtyInput.min) || 1;
                    const max = Number(qtyInput.max) || 99;
                    const current = Number(qtyInput.value) || min;

                    if (button.dataset.action === "minus") {
                        qtyInput.value = String(
                            Math.max(min, current - 1)
                        );
                    }

                    if (button.dataset.action === "plus") {
                        qtyInput.value = String(
                            Math.min(max, current + 1)
                        );
                    }
                });
            });
    }

    // Se a página não tiver formulário de produto, encerra.
    if (!form) return;

    // ============================================================
    // 3. FORMATAÇÃO DE PREÇOS
    // ============================================================

    const formatBRL = (value) => {
        return Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };

    // ============================================================
    // 4. IDENTIFICAÇÃO DA AÇÃO DO BOTÃO
    // ============================================================

    function getButtonAction(button) {
        if (!button) {
            return "cart";
        }

        // Primeiro, verifica o atributo data-action.
        const declaredAction = button.dataset.action;

        if (
            declaredAction === "whatsapp" ||
            declaredAction === "cart"
        ) {
            return declaredAction;
        }

        // Alternativa para páginas em que o atributo ainda
        // não tenha sido adicionado ao botão.
        const buttonText = (
            button.textContent + " " +
            (button.querySelector("i")?.className || "")
        ).toLocaleLowerCase("pt-BR");

        if (
            buttonText.includes("whatsapp") ||
            buttonText.includes("encomendar")
        ) {
            return "whatsapp";
        }

        if (
            buttonText.includes("carrinho") ||
            buttonText.includes("cart-shopping")
        ) {
            return "cart";
        }

        return null;
    }

    // ============================================================
    // 5. COLETA DOS DADOS DO PRODUTO
    // ============================================================

    function getOrderData() {
        const nameElement =
            document.getElementById("productName");

        const priceElement =
            document.getElementById("productPrice");

        const optionElement =
            document.getElementById("cutType");

        const quantityLabel =
            form.querySelector('label[for="quantity"]');

        const quantity = Math.max(
            1,
            Number.parseInt(qtyInput?.value, 10) || 1
        );

        // O valor de data-price deve ser sempre o preço que
        // será cobrado: o preço promocional, quando houver.
        const price = Number(priceElement?.dataset.price);

        // Obtém a unidade do preço, por exemplo "/ kg",
        // "/ 500g" ou "/ dúzia".
        const priceUnitElement = priceElement?.querySelector(
            ".product-info__price-unit"
        );

        const priceUnit = priceUnitElement
            ? priceUnitElement.textContent
                .replace(/^\s*\/\s*/, "")
                .trim()
            : "";

        // Para páginas sem o novo elemento de unidade,
        // tenta usar o texto do rótulo da quantidade.
        const unitMatch = quantityLabel?.textContent.match(
            /\((.*?)\)/
        );

        const unit = priceUnit ||
            (unitMatch ? unitMatch[1].trim() : "unidade");

        return {
            nome: nameElement?.textContent.trim() || "Produto",
            preco: Number.isFinite(price) && price > 0
                ? price
                : null,
            corte: optionElement?.value || "Padrão",
            quantidade: quantity,
            unidade: unit,
            imagem: mainImage?.src || ""
        };
    }

    // ============================================================
    // 6. ENVIO DO FORMULÁRIO
    // ============================================================

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const order = getOrderData();
        const action = getButtonAction(event.submitter);

        // Não permite enviar ou adicionar um produto sem
        // um preço válido configurado no HTML.
        if (
            !Number.isFinite(order.preco) ||
            order.preco <= 0
        ) {
            alert(
                "O preço deste produto não está configurado " +
                "corretamente. Confira o preço na página do produto."
            );

            return;
        }

        // ========================================================
        // 6.1. ENCOMENDAR SOMENTE O PRODUTO ATUAL NO WHATSAPP
        // ========================================================

        if (action === "whatsapp") {
            const subtotal = order.preco * order.quantidade;

            const message = [
                "Olá, Empório GE! Gostaria de fazer uma encomenda:",
                "",
                `Produto: ${order.nome}`,
                `Opção: ${order.corte}`,
                `Quantidade: ${order.quantidade} (${order.unidade})`,
                `Preço unitário: ${formatBRL(order.preco)}`,
                `Subtotal: ${formatBRL(subtotal)}`,
                "",
                "Poderiam confirmar a disponibilidade?"
            ].join("\n");

            window.open(
                `https://wa.me/${whatsappNumber}?text=${
                    encodeURIComponent(message)
                }`,
                "_blank",
                "noopener,noreferrer"
            );

            return;
        }

        // ========================================================
        // 6.2. ADICIONAR O PRODUTO AO CARRINHO
        // ========================================================

        if (action === "cart") {
            if (typeof window.addToCart !== "function") {
                alert(
                    "O carrinho não carregou. " +
                    "Atualize a página e tente novamente."
                );

                return;
            }

            const added = window.addToCart(order);

            if (!added) {
                alert(
                    "Não foi possível adicionar o produto ao carrinho."
                );

                return;
            }

            // Feedback visual para confirmar a adição.
            const button = event.submitter;

            if (button) {
                const originalText = button.innerHTML;

                button.innerHTML =
                    '<i class="fa-solid fa-check"></i> Adicionado!';

                window.setTimeout(() => {
                    button.innerHTML = originalText;
                }, 1500);
            }

            return;
        }

        // Se o botão não tiver uma ação reconhecida, avisa.
        alert(
            "Não foi possível identificar a ação do botão. " +
            "Confira os atributos data-action no HTML."
        );
    });
})();
