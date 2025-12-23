[file name]: script.js
[file content begin]
// JavaScript для вертикального макета с улучшениями
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            
            if (window.innerWidth <= 768) {
                if (navLinks.style.display === 'flex') {
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '100%';
                    navLinks.style.left = '0';
                    navLinks.style.right = '0';
                    navLinks.style.background = 'rgba(255, 255, 255, 0.98)';
                    navLinks.style.backdropFilter = 'blur(10px)';
                    navLinks.style.padding = '30px 20px';
                    navLinks.style.boxShadow = 'var(--shadow-xl)';
                    navLinks.style.gap = '20px';
                    navLinks.style.zIndex = '1000';
                    navLinks.style.borderTop = '1px solid var(--border-color)';
                    
                    // Анимация появления
                    navLinks.style.opacity = '0';
                    navLinks.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        navLinks.style.transition = 'all 0.3s ease';
                        navLinks.style.opacity = '1';
                        navLinks.style.transform = 'translateY(0)';
                    }, 10);
                }
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'row';
                navLinks.style.position = 'static';
                navLinks.style.background = 'transparent';
                navLinks.style.padding = '0';
                navLinks.style.boxShadow = 'none';
                navLinks.style.backdropFilter = 'none';
            }
        });
    }
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });
    });
    
    // Активная навигация при скролле
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Плавная прокрутка с активным состоянием
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Удаляем активный класс у всех ссылок
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Добавляем активный класс к текущей ссылке
                this.classList.add('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Форма заявки с улучшениями
    const demoForm = document.getElementById('demoRequestForm');
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            const inputs = this.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'var(--danger-color)';
                    input.style.animation = 'shake 0.5s ease-in-out';
                    isValid = false;
                } else {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    input.style.animation = '';
                }
            });
            
            if (isValid) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                submitBtn.disabled = true;
                
                // Создаем красивый контейнер для уведомления
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, var(--success-color), #10b981);
                    color: white;
                    padding: 20px 30px;
                    border-radius: var(--radius);
                    box-shadow: var(--shadow-xl);
                    z-index: 9999;
                    transform: translateX(150%);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                `;
                notification.innerHTML = `
                    <i class="fas fa-check-circle" style="font-size: 24px;"></i>
                    <div>
                        <h4 style="margin: 0 0 5px 0; font-weight: 600;">Успешно отправлено!</h4>
                        <p style="margin: 0; opacity: 0.9; font-size: 14px;">Мы свяжемся с вами в течение 24 часов.</p>
                    </div>
                `;
                
                document.body.appendChild(notification);
                
                // Показываем уведомление
                setTimeout(() => {
                    notification.style.transform = 'translateX(0)';
                }, 100);
                
                // Симуляция отправки
                setTimeout(() => {
                    // Скрываем уведомление
                    notification.style.transform = 'translateX(150%)';
                    
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                    
                    demoForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Добавляем анимацию успеха
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Отправлено!';
                    submitBtn.style.background = 'linear-gradient(135deg, var(--success-color), #10b981)';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                    }, 2000);
                }, 2000);
            }
        });
    }
    
    // Анимация появления элементов с задержкой
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Добавляем задержку для каждого элемента
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Наблюдаем за элементами
    document.querySelectorAll('.module-card, .advantage-card, .tech-item, .stat-item, .tech-category').forEach(el => {
        observer.observe(el);
    });
    
    // Анимированная статистика
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    if (!stat.dataset.animated) {
                        const finalValue = parseInt(stat.textContent);
                        const duration = 2000;
                        const startTime = Date.now();
                        
                        const animate = () => {
                            const currentTime = Date.now();
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            
                            // Эффект замедления в конце
                            const easeProgress = 1 - Math.pow(1 - progress, 3);
                            const currentValue = Math.floor(easeProgress * finalValue);
                            
                            stat.textContent = currentValue.toLocaleString();
                            
                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            } else {
                                stat.dataset.animated = 'true';
                            }
                        };
                        
                        animate();
                    }
                });
            }
        });
    }, { threshold: 0.5 });
    
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Изменение шапки при скролле
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Плавающие элементы
    function createFloatingElements() {
        const container = document.querySelector('.hero');
        if (!container) return;
        
        for (let i = 0; i < 5; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.cssText = `
                position: absolute;
                background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.1));
                border-radius: ${i % 2 === 0 ? '50%' : '30%'};
                animation: float ${6 + i * 2}s ease-in-out infinite;
                animation-delay: ${i}s;
                z-index: 0;
                width: ${50 + Math.random() * 100}px;
                height: ${50 + Math.random() * 100}px;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                filter: blur(${10 + Math.random() * 10}px);
            `;
            container.appendChild(element);
        }
    }
    
    createFloatingElements();
    
    // Анимация при наведении на кнопки
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function(e) {
            const x = e.pageX - this.offsetLeft;
            const y = e.pageY - this.offsetTop;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = ripple.style.height = Math.max(this.offsetWidth, this.offsetHeight) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Добавляем стиль для анимации ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
    
    // Управление анимацией прогресса
    function animateProgressBars() {
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const width = bar.style.width || '0%';
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 2s ease-out';
                bar.style.width = width;
            }, 500);
        });
    }
    
    // Запускаем анимацию при загрузке
    setTimeout(animateProgressBars, 1000);
    
    // Обновляем текущий год в футере
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2025', currentYear);
    }
});
[file content end]