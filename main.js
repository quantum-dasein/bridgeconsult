// Логика сайта

document.addEventListener('DOMContentLoaded', () => {
    // Умная шапка (сжимается при скролле)
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

// Плавная анимация для аккордеона
document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion-btn');

    accordions.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.accordion-item');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.vertical-line');
            
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('is-open')) {
                    otherItem.classList.remove('is-open');
                    otherItem.querySelector('.accordion-content').style.gridTemplateRows = '0fr';
                    otherItem.querySelector('.vertical-line').style.transform = 'scaleY(1)';
                    otherItem.classList.remove('border-bridge-taupe');
                }
            });

            if (item.classList.contains('is-open')) {
                item.classList.remove('is-open');
                content.style.gridTemplateRows = '0fr';
                icon.style.transform = 'scaleY(1)';
                item.classList.remove('border-bridge-taupe');
            } else {
                item.classList.add('is-open');
                content.style.gridTemplateRows = '1fr';
                icon.style.transform = 'scaleY(0)'; 
                item.classList.add('border-bridge-taupe');
            }
        });
    });
});

// Логика переключения мобильного меню
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('translate-x-0');
            if (isOpen) {
                mobileMenu.classList.replace('translate-x-0', 'translate-x-full');
                document.body.style.overflow = 'auto';
                
                document.querySelector('.burger-line-1').style.transform = 'none';
                document.querySelector('.burger-line-2').style.opacity = '1';
                document.querySelector('.burger-line-3').style.transform = 'none';
            } else {
                mobileMenu.classList.replace('translate-x-full', 'translate-x-0');
                document.body.style.overflow = 'hidden';
                
                document.querySelector('.burger-line-1').style.transform = 'rotate(45deg) scaleX(1.2)';
                document.querySelector('.burger-line-2').style.opacity = '0';
                document.querySelector('.burger-line-3').style.transform = 'rotate(-45deg) scaleX(1.2)';
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.replace('translate-x-0', 'translate-x-full');
                document.body.style.overflow = 'auto';
                document.querySelector('.burger-line-1').style.transform = 'none';
                document.querySelector('.burger-line-2').style.opacity = '1';
                document.querySelector('.burger-line-3').style.transform = 'none';
            });
        });
    }
});

// Анимация счетчиков
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 2500; 

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const startTime = performance.now();

            const step = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / animationDuration, 1);
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                
                counter.innerText = Math.floor(easeProgress * target);

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(step);
        });
    }

    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
});

// Анимация Прелоадера с жесткой защитой от зависания
const hidePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        document.body.style.overflow = 'auto';
    }
};

window.addEventListener('load', () => {
    const preloaderLogo = document.getElementById('preloader-logo');
    if (preloaderLogo) {
        setTimeout(() => {
            preloaderLogo.style.transform = 'translateY(0)';
            preloaderLogo.style.opacity = '1';
        }, 100);
    }
    setTimeout(hidePreloader, 1500); 
});

// Если окно грузится слишком долго (баг браузера), убиваем прелоадер через 2.5 секунды принудительно
setTimeout(hidePreloader, 2500);
// Автоматическое закрытие мобильного меню при клике на ссылку
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Закрываем меню (убираем класс translate-x-0 и возвращаем translate-x-full)
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('translate-x-full');
        });
    });
});
// --- ТЕМНАЯ ТЕМА (DARK MODE) ---
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
const themeToggleBtn = document.getElementById('theme-toggle');

// Проверяем, какая тема была сохранена
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
    document.documentElement.classList.add('dark-theme');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
}

themeToggleBtn.addEventListener('click', function() {
    // Меняем иконки
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // Если сейчас темная тема -> делаем светлую
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.remove('dark-theme');
        localStorage.setItem('color-theme', 'light');
    } else {
        // Если светлая -> делаем темную
        document.documentElement.classList.add('dark-theme');
        localStorage.setItem('color-theme', 'dark');
    }
});