// Основной JavaScript файл для системы IT-ВУЗ

document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Форма заявки
    const demoForm = document.querySelector('.demo-form');
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'var(--danger)';
                    isValid = false;
                } else {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }
            });
            
            if (isValid) {
                // В реальном приложении здесь был бы AJAX запрос
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                submitBtn.disabled = true;
                
                // Симуляция отправки
                setTimeout(() => {
                    alert('Спасибо за заявку! Мы свяжемся с вами в течение 24 часов.');
                    demoForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                alert('Пожалуйста, заполните все обязательные поля');
            }
        });
    }
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками
    document.querySelectorAll('.feature-card, .advantage-item, .tech-item, .stats-card').forEach(el => {
        observer.observe(el);
    });
    
    // Анимация статистики
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElements = entry.target.querySelectorAll('.stats-number');
                
                statElements.forEach(stat => {
                    const finalValue = parseInt(stat.textContent);
                    const suffix = stat.textContent.replace(/[0-9]/g, '');
                    let currentValue = 0;
                    const increment = finalValue / 50;
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            stat.textContent = finalValue + suffix;
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(currentValue) + suffix;
                        }
                    }, 30);
                });
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Наблюдаем за секцией с демо-статистикой
    const demoStats = document.querySelector('.demo-stats');
    if (demoStats) {
        statsObserver.observe(demoStats);
    }
    
    // Эффект параллакса для героя
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        
        // Изменение шапки при скролле
        const header = document.querySelector('.header');
        if (scrolled > 100) {
            header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.1)';
            header.style.padding = '10px 0';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
            header.style.padding = '15px 0';
        }
    });
    
    // Анимация dashboard
    const dashboard = document.querySelector('.dashboard-preview');
    if (dashboard) {
        dashboard.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.5s ease';
        });
    }
});