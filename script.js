// JavaScript для вертикального макета с улучшениями
document.addEventListener('DOMContentLoaded', function() {
    // Переключение темы
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    // Устанавливаем начальную тему
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    } else if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }

    // Обработчик переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = document.body.classList.contains('dark-theme');
            
            if (isDark) {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
            
            // Анимация кнопки
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Обновляем aria-label кнопки в зависимости от темы
    function updateThemeButtonLabel() {
        if (themeToggle) {
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.setAttribute('aria-label', 
                isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'
            );
        }
    }

    // Вызываем при загрузке и при изменении
    updateThemeButtonLabel();
    if (themeToggle) {
        themeToggle.addEventListener('click', updateThemeButtonLabel);
    }

    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Скрываем preloader через 1.5 секунды
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    }
    
    // Кнопка "Наверх"
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
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
                menuToggle.setAttribute('aria-expanded', 'false');
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
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
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
                
                // Обновляем фокус для доступности
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                setTimeout(() => targetElement.removeAttribute('tabindex'), 1000);
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
                    
                    // Сообщение об ошибке для доступности
                    input.setAttribute('aria-invalid', 'true');
                    input.setAttribute('aria-describedby', 'error-' + input.name);
                } else {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    input.style.animation = '';
                    input.removeAttribute('aria-invalid');
                    input.removeAttribute('aria-describedby');
                }
            });
            
            if (isValid) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                submitBtn.disabled = true;
                submitBtn.setAttribute('aria-label', 'Идет отправка формы');
                
                // Создаем красивый контейнер для уведомления
                const notification = document.createElement('div');
                notification.setAttribute('role', 'alert');
                notification.setAttribute('aria-live', 'assertive');
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
                    <i class="fas fa-check-circle" style="font-size: 24px;" aria-hidden="true"></i>
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
                    submitBtn.setAttribute('aria-label', 'Заказать демо');
                    
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
    document.querySelectorAll('.module-card, .advantage-card, .tech-item, .stat-item, .tech-category, .testimonial-card').forEach(el => {
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
                        const finalValue = parseInt(stat.textContent.replace(',', ''));
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
                                stat.textContent = finalValue.toLocaleString();
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
        
        // Очищаем существующие элементы
        document.querySelectorAll('.floating-element').forEach(el => el.remove());
        
        for (let i = 0; i < 5; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.setAttribute('aria-hidden', 'true');
            element.style.cssText = `
                position: absolute;
                background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.1));
                border-radius: ${i % 2 === 0 ? '50%' : '30%'};
                animation: float-delayed ${6 + i * 2}s ease-in-out infinite;
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
            ripple.setAttribute('aria-hidden', 'true');
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
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
    
    // Копирование email по клику
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.href.replace('mailto:', '');
            navigator.clipboard.writeText(email).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
    }
    
    // Ленивая загрузка изображений
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Сохранение позиции скролла
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('scrollPosition', window.pageYOffset);
    });
    
    // Восстановление позиции скролла
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition && savedPosition > 0) {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('scrollPosition');
    }
    
    // Микро-взаимодействия для карточек
    document.querySelectorAll('.module-card, .advantage-card, .testimonial-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // Индикатор прогресса чтения
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--success-color));
        width: 0%;
        z-index: 999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
});

// ========== TEAM CARDS FUNCTIONALITY ==========

// Функция для переворота карточки
function flipTeamCard(card) {
    const inner = card.querySelector('.team-card-inner');
    inner.classList.toggle('flipped');
    
    // Сбрасываем 3D трансформацию при возврате
    if (!inner.classList.contains('flipped')) {
        inner.style.transform = 'rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    }
}

// Инициализация карточек команды
function initTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    if (teamCards.length === 0) return;
    
    teamCards.forEach(card => {
        const inner = card.querySelector('.team-card-inner');
        
        // Клик на ВСЕЙ карточке - только для мобильных
        card.addEventListener('click', function(e) {
            // Проверяем, был ли клик по элементам, которые имеют свою логику
            if (e.target.closest('.team-avatar') || 
                e.target.closest('.team-social') || 
                e.target.closest('.flip-back-title') ||
                e.target.closest('.social-link')) {
                return;
            }
            
            // Только для мобильных
            if (window.innerWidth <= 768) {
                flipTeamCard(this);
            }
        });

        // 3D эффект при наведении - только для десктопа и неперевернутых карточек
        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768 && !inner.classList.contains('flipped')) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                inner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale3d(1.02, 1.02, 1.02)`;
            }
        });

        card.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768 && !inner.classList.contains('flipped')) {
                inner.style.transform = 'rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
            }
        });
    });
    
    // Клик на иконке аватара - переворачивает карточку
    document.querySelectorAll('.team-avatar').forEach(avatar => {
        avatar.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const teamCard = this.closest('.team-card');
            if (teamCard) {
                flipTeamCard(teamCard);
            }
        });
    });
    
    // Клик на заголовке "О разработчике/дизайнере" - переворачивает обратно
    document.querySelectorAll('.flip-back-title').forEach(title => {
        title.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const teamCard = this.closest('.team-card');
            if (teamCard) {
                flipTeamCard(teamCard);
            }
        });
    });
    
    // Социальные ссылки - просто открывают ссылки, не переворачивают
    document.querySelectorAll('.team-social .social-link').forEach(link => {
        // Убираем любую обработку клика кроме стандартного поведения браузера
        link.addEventListener('click', function(e) {
            // Разрешаем переход по ссылке в новой вкладке
            // Не делаем ничего дополнительного
        });
    });
    
    // Анимация появления карточек команды
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Анимация прогресса навыков
                    if (entry.target.classList.contains('team-card')) {
                        const skillLevels = entry.target.querySelectorAll('.skill-level');
                        skillLevels.forEach(level => {
                            const width = level.style.width;
                            level.style.width = '0%';
                            setTimeout(() => {
                                level.style.transition = 'width 1.5s ease-in-out';
                                level.style.width = width;
                            }, 500);
                        });
                    }
                }, index * 300);
            }
        });
    }, { threshold: 0.2 });
    
    // Наблюдаем за карточками команды
    document.querySelectorAll('.team-card, .team-message').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        teamObserver.observe(el);
    });
    
    // Анимация кольцевых аватаров
    function animateAvatars() {
        const avatars = document.querySelectorAll('.team-avatar');
        avatars.forEach(avatar => {
            const rings = avatar.querySelectorAll('.avatar-ring');
            rings.forEach((ring, index) => {
                ring.style.animationDelay = `${index * 0.5}s`;
                ring.style.animationPlayState = 'running';
            });
        });
    }
    
    // Запускаем анимацию аватаров при загрузке
    setTimeout(animateAvatars, 1000);
}

// Инициализируем карточки команды после загрузки DOM
document.addEventListener('DOMContentLoaded', initTeamCards);