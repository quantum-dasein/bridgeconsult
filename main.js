// main.js - Логика сайта

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Инициализация анимаций (если элементы есть на странице)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic',
        });
    }

    // 2. Умная шапка (сжимается при скролле)
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
                header.classList.replace('bg-white/95', 'bg-white');
            } else {
                header.classList.remove('header-scrolled');
                header.classList.replace('bg-white', 'bg-white/95');
            }
        });
    }
});
// Буттери-смуф анимация для аккордеона (60fps)
document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion-btn');

    accordions.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.accordion-item');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.vertical-line');
            
            // Логика закрытия всех остальных вкладок
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('is-open')) {
                    otherItem.classList.remove('is-open');
                    otherItem.querySelector('.accordion-content').style.gridTemplateRows = '0fr';
                    otherItem.querySelector('.vertical-line').style.transform = 'scaleY(1)';
                    otherItem.classList.remove('border-bridge-taupe');
                }
            });

            // Открытие / Закрытие текущей вкладки
            if (item.classList.contains('is-open')) {
                // Закрываем
                item.classList.remove('is-open');
                content.style.gridTemplateRows = '0fr';
                icon.style.transform = 'scaleY(1)';
                item.classList.remove('border-bridge-taupe');
            } else {
                // Открываем
                item.classList.add('is-open');
                content.style.gridTemplateRows = '1fr';
                icon.style.transform = 'scaleY(0)'; // Красиво убираем вертикальную палочку (плюс превращается в минус)
                item.classList.add('border-bridge-taupe');
            }
        });
    });
});