
(function () {
    "use strict";

    const mainImage = document.getElementById("mainImage");
    const thumbs = document.querySelectorAll(".product-gallery__thumb");
    const qtyInput = document.getElementById("quantity");
    const form = document.getElementById("productForm");

    // Troca a imagem principal pelas miniaturas.
    thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            const newSrc = thumb.dataset.image;
            if (!newSrc || !mainImage) return;

            mainImage.style.opacity = "0";

            window.setTimeout(() => {
                mainImage.src = newSrc;
                mainImage.style.opacity = "1";
            }, 150);

            thumbs.forEach((item) => item.classList.remove("is-active"));
            thumb.classList.add("is-active");
        });
    });

    // Botões de aumentar e diminuir a quantidade.
    if (qtyInput) {
        document.querySelectorAll(".product-form__qty-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const min = Number(qtyInput.min) || 1;
                const max = Number(qtyInput.max) || 99;
                const current = Number(qtyInput.value) || min;

                if (button.dataset.action === "minus") {
                    qtyInput.value = String(Math.max(min, current - 1));
                } else if (button.dataset.action === "plus") {
                    qtyInput.value = String(Math.min(max, current + 1));
                }
            });
        });
    }

    if (!form) return;

    const formatBRL = (value) =>
        Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    function getOrderData() {
        const nameElement = document.getElementById("productName");
        const priceElement = document.getElementById("productPrice");
        const optionElement = document.getElementById("cutType");
        const quantityLabel = form.querySelector('label[for="quantity"]');

        const quantity = Math.max(
            1,
            Number.parseInt(qtyInput?.value, 10) || 1
        );

        const unitMatch = quantityLabel?.textContent.match(/\((.*?)\)/);
        const unit = unitMatch ? unitMatch[1].trim() : "unidade";

        return {
            nome: nameElement?.textContent.trim() || "Produto",
            preco: Number(priceElement?.dataset.price) || 0,
            corte: optionElement?.value || "Padrão",
            quantidade,
            unidade: unit,
            imagem: mainImage?.src || ""
        };
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const order = getOrderData();
        const action = event.submitter?.dataset.action;

        // Envia somente o produto atual para o WhatsApp.
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
                `https://wa.me/5581986836253?text=${encodeURIComponent(message)}`,
                "_blank",
                "noopener,noreferrer"
            );

            return;
        }

        // Adiciona o produto ao carrinho.
        if (action === "cart") {
            if (typeof window.addToCart !== "function") {
                alert("Carrinho não carregou. Atualize a página e tente novamente.");
                return;
            }

            const added = window.addToCart(order);

            if (!added) {
                alert("Não foi possível adicionar o produto ao carrinho.");
                return;
            }

            const button = event.submitter;

            if (button) {
                const originalText = button.innerHTML;
                button.innerHTML =
                    '<i class="fa-solid fa-check"></i> Adicionado!';

                window.setTimeout(() => {
                    button.innerHTML = originalText;
                }, 1500);
            }
        }
    });
})();
