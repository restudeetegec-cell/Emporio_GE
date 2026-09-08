const carrossel = document.querySelector(".carrossel");

let velocidade = 1;

function moverCarrossel() {
    carrossel.scrollLeft += velocidade;

    if (carrossel.scrollLeft + carrossel.clientWidth >= carrossel.scrollWidth) {
        carrossel.scrollLeft = 0;
    }
}

setInterval(moverCarrossel, 20);
