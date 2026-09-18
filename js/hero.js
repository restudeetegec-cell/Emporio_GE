const slides = document.querySelectorAll('.hero-slide');

let currentIndex = 0;
const intervalTime = 5000; // Muda a cada 5 segundos (5000 milissegundos)

function nextSlide() {
    // Remove a classe 'active' do slide atual
    slides[currentIndex].classList.remove('active');

    // 1 2 3
    // 1 % 3
    // 2 % 3
    // 4 % 3 => 1
    // Incrementa o índice para o próximo slide
    currentIndex = (currentIndex + 1) % slides.length;

    // Adiciona a classe 'active' ao próximo slide
    slides[currentIndex].classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    //Inicia o loop de slides
if (slides.length > 0) {
    setInterval(nextSlide, intervalTime);
    }
});
