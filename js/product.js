(function () {
    /* ---------- TROCA DE IMAGEM NA GALERIA ---------- */
    const mainImage = document.getElementById("mainImage");
    const thumbs = document.querySelectorAll(".product-gallery__thumb");

    thumbs.forEach(thumb => {
        thumb.addEventListener("click", () => {
            const newSrc = thumb.dataset.image;
            if (!newSrc || !mainImage) return;

            mainImage.style.opacity = "0";
            setTimeout(() => {
                mainImage.src = newSrc;
                mainImage.style.opacity = "1";
            }, 150);

            thumbs.forEach(t => t.classList.remove("is-active"));
            thumb.classList.add("is-active");
        });
    });

    /* ---------- BOTÕES DE + E - DA QUANTIDADE ---------- */
    const qtyInput = document.getElementById("quantity");
    const qtyButtons = document.querySelectorAll(".product-form__qty-btn");

    if (qtyInput) {
        qtyButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const action = btn.dataset.action;
                const current = parseInt(qtyInput.value, 10) || 1;
                const min = parseInt(qtyInput.min, 10) || 1;
                const max = parseInt(qtyInput.max, 10) || 99;

                if (action === "minus" && current > min) qtyInput.value = current - 1;
                if (action === "plus"  && current < max) qtyInput.value = current + 1;
            });
        });
    }

    /* ---------- ADICIONAR AO CARRINHO ---------- */
    const form = document.getElementById("productForm");
    
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Impede a página de recarregar

            // 1. Pega o nome do produto
            const nome = document.getElementById("productName").textContent.trim();
            
            // 2. Pega o preço usando o atributo data-price que é mais seguro
            const precoFloat = parseFloat(document.getElementById("productPrice").getAttribute("data-price"));
            
            // 3. Pega o corte e a quantidade
            const corte = document.getElementById("cutType").value;
            const quantidade = parseInt(qtyInput.value, 10);
            
            // 4. Pega a imagem principal
            const imagemSrc = document.getElementById("mainImage") ? document.getElementById("mainImage").src : "";

            // 5. Monta o objeto do produto
            const produto = {
                nome: nome,
                preco: precoFloat,
                corte: corte,
                quantidade: quantidade,
                imagem: imagemSrc
            };

            // 6. Envia para o carrinho
            if (typeof window.addToCart === 'function') {
                window.addToCart(produto);
            } else {
                alert("Erro: O carrinho não foi carregado. Verifique se o cart.js está no HTML.");
            }
        });
    }
})();