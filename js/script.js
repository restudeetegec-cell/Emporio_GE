const carrossel = document.querySelector(".carrossel");

let velocidade = 1;  // Variação do outro código no caso essa velocidade aqui possivelmente vai sair né Victor?

function moverCarrossel()  {
    // Aplica o movimento na direção atual da velocidade
    carrossel.scrollLeft += velocidade;

    // 1. Se bater na borda da DIREITA, muda a velocidade para NEGATIVA (começa a voltar)
    // O "- 1" previne travamentos por conta de arredondamento de pixels nos navegadores
    if (carrossel.scrollLeft + carrossel.clientWidth >= carrossel.scrollWidth - 1) {
        velocidade = -5;
    }

    // 2. Se bater na borda da ESQUERDA (chegar no zero), muda a velocidade para POSITIVA (avança de novo)
    if (carrossel.scrollLeft <= 0) {
        velocidade = 5;
    }
}
// Faz moverw a cada 20 milissegundo
setInterval(moverCarrossel, 20); 


// CATÁLOGO
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
        nome: "Fileti",
        preco: "R$ 24,00",
        imagem: "images/fileti.webp"
    },

    {
        nome: "Tilápia",
        preco: "R$25.00",
        imagem: "images/tilapia.jpg"
    },

    {
        nome: "Sardinha",
        preco: "R$25.00",
        imagem: "images/Sardinha.jpg"
    }
]

const listaProdutos = document.getElementById("listaProdutos");

function mostrarProdutos(lista) {
    listaProdutos.innerHTML = "";
    lista.forEach(produto => {

        const card = document.createElement("article");
        card.classList.add("produto");

        card.innerHTML = `
            <div class="produto-imagem">

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

            </div>

            <h3>${produto.nome}</h3>

            <p class="produto-preco">
                ${produto.preco}
            </p>
        `;

        listaProdutos.appendChild(card);
        
    });
}

mostrarProdutos(produtos);

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

    campoPesquisa.value = "";

    mostrarProdutos(produtos);

});

campoPesquisa.addEventListener("input", () => {

    const texto = campoPesquisa.value
        .toLowerCase()
        .trim();


    const resultados = produtos.filter(produto =>

        produto.nome
            .toLowerCase()
            .includes(texto)

    );


    mostrarProdutos(resultados);

});