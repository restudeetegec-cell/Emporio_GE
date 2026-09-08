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
