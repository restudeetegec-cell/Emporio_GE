(function () {
    // Troca de Imagem na Galeria
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

    // Botões de + e - da Quantidade
    const qtyInput = document.getElementById("quantity");
    const qtyButtons = document.querySelectorAll(".product-form__qty-btn");

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

    // Envio pro WhatsApp
    const form = document.getElementById("productForm");
    
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const produto = document.getElementById("productName").textContent.trim();
            const preco = document.getElementById("productPrice").textContent.trim();
            const corte = document.getElementById("cutType").value;
            const quantidade = qtyInput.value;

            const mensagem =
                `Olá! Gostaria de encomendar:%0A%0A` +
                `*${produto}*%0A` +
                `Corte: ${corte}%0A` +
                `Quantidade: ${quantidade} un%0A` +
                `Preço: ${preco}`;

            window.open(`https://wa.me/55SEUNUMERO?text=${mensagem}`, "_blank");
        });
    }
})();