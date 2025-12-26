// Игра "Собери код" для IT-ВУЗ
document.addEventListener('DOMContentLoaded', function() {
    // Создаем контейнер для игры
    const gameContainer = document.createElement('div');
    gameContainer.className = 'code-game-container';
    gameContainer.innerHTML = `
        <div class="code-game">
            <div class="game-header">
                <h3><i class="fas fa-code"></i> Игра: Собери код</h3>
                <div class="game-stats">
                    <div class="stat">
                        <span class="stat-label">Очки:</span>
                        <span class="score">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Время:</span>
                        <span class="timer">60</span>с
                    </div>
                    <div class="stat">
                        <span class="stat-label">Уровень:</span>
                        <span class="level">1</span>
                    </div>
                </div>
            </div>
            
            <div class="game-content">
                <div class="game-instructions">
                    <p>Перетащите фрагменты кода в правильном порядке для создания рабочей функции!</p>
                </div>
                
                <div class="game-area">
                    <div class="code-blocks-container">
                        <h4>Фрагменты кода:</h4>
                        <div class="code-blocks" id="codeBlocks">
                            <!-- Блоки кода будут генерироваться здесь -->
                        </div>
                    </div>
                    
                    <div class="code-solution-container">
                        <h4>Соберите решение:</h4>
                        <div class="code-solution" id="codeSolution">
                            <!-- Сюда перетаскиваются блоки -->
                            <div class="solution-placeholder">Перетащите блоки кода сюда</div>
                        </div>
                    </div>
                </div>
                
                <div class="game-controls">
                    <button class="btn btn-primary start-game">
                        <i class="fas fa-play"></i> Начать игру
                    </button>
                    <button class="btn btn-secondary check-solution">
                        <i class="fas fa-check"></i> Проверить
                    </button>
                    <button class="btn btn-secondary reset-game">
                        <i class="fas fa-redo"></i> Сбросить
                    </button>
                    <button class="btn btn-secondary show-hint">
                        <i class="fas fa-lightbulb"></i> Подсказка
                    </button>
                </div>
                
                <div class="game-feedback" id="gameFeedback"></div>
            </div>
            
            <div class="game-hint hidden">
                <h4><i class="fas fa-lightbulb"></i> Подсказка:</h4>
                <p id="hintText"></p>
            </div>
        </div>
    `;

    // Добавляем игру после раздела "Отзывы"
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        testimonialsSection.insertAdjacentElement('afterend', gameContainer);
    } else {
        // Если секция не найдена, добавляем перед футером
        const footer = document.querySelector('footer');
        if (footer) {
            footer.insertAdjacentElement('beforebegin', gameContainer);
        }
    }

    // Данные игры
    const gameData = {
        currentLevel: 1,
        score: 0,
        timeLeft: 60,
        timer: null,
        isPlaying: false,
        
        levels: [
            {
                id: 1,
                name: "Python Function",
                blocks: [
                    "def calculate_sum(a, b):",
                    "    result = a + b",
                    "    return result",
                    "print(calculate_sum(5, 3))"
                ],
                solution: ["def calculate_sum(a, b):", "    result = a + b", "    return result", "print(calculate_sum(5, 3))"],
                hint: "Функция должна начинаться с def, затем идут операции, и заканчиваться return"
            },
            {
                id: 2,
                name: "React Component",
                blocks: [
                    "import React from 'react';",
                    "function Welcome() {",
                    "  return <h1>Hello, World!</h1>;",
                    "}",
                    "export default Welcome;"
                ],
                solution: ["import React from 'react';", "function Welcome() {", "  return <h1>Hello, World!</h1>;", "}", "export default Welcome;"],
                hint: "Сначала импорт, затем функция компонента, и экспорт в конце"
            },
            {
                id: 3,
                name: "JavaScript Array Methods",
                blocks: [
                    "const numbers = [1, 2, 3, 4, 5];",
                    "const doubled = numbers.map(num => num * 2);",
                    "const even = numbers.filter(num => num % 2 === 0);",
                    "const sum = numbers.reduce((acc, num) => acc + num, 0);"
                ],
                solution: ["const numbers = [1, 2, 3, 4, 5];", "const doubled = numbers.map(num => num * 2);", "const even = numbers.filter(num => num % 2 === 0);", "const sum = numbers.reduce((acc, num) => acc + num, 0);"],
                hint: "Сначала создаем массив, затем применяем методы map, filter и reduce"
            },
            {
                id: 4,
                name: "CSS Grid Layout",
                blocks: [
                    ".container {",
                    "  display: grid;",
                    "  grid-template-columns: repeat(3, 1fr);",
                    "  gap: 20px;",
                    "}"
                ],
                solution: [".container {", "  display: grid;", "  grid-template-columns: repeat(3, 1fr);", "  gap: 20px;", "}"],
                hint: "Начинаем с селектора, затем display: grid, и настройки колонок"
            },
            {
                id: 5,
                name: "Dockerfile",
                blocks: [
                    "FROM python:3.9-slim",
                    "WORKDIR /app",
                    "COPY requirements.txt .",
                    "RUN pip install -r requirements.txt",
                    "COPY . .",
                    "CMD [\"python\", \"app.py\"]"
                ],
                solution: ["FROM python:3.9-slim", "WORKDIR /app", "COPY requirements.txt .", "RUN pip install -r requirements.txt", "COPY . .", "CMD [\"python\", \"app.py\"]"],
                hint: "Dockerfile начинается с базового образа, затем настройка рабочей директории и команд"
            }
        ]
    };

    // DOM элементы
    const codeBlocksContainer = document.getElementById('codeBlocks');
    const codeSolutionContainer = document.getElementById('codeSolution');
    const gameFeedback = document.getElementById('gameFeedback');
    const hintText = document.getElementById('hintText');
    const scoreElement = document.querySelector('.score');
    const timerElement = document.querySelector('.timer');
    const levelElement = document.querySelector('.level');
    const startButton = document.querySelector('.start-game');
    const checkButton = document.querySelector('.check-solution');
    const resetButton = document.querySelector('.reset-game');
    const hintButton = document.querySelector('.show-hint');
    const hintContainer = document.querySelector('.game-hint');

    // Инициализация игры
    function initGame() {
        // Сброс состояния
        codeBlocksContainer.innerHTML = '';
        codeSolutionContainer.innerHTML = '<div class="solution-placeholder">Перетащите блоки кода сюда</div>';
        gameFeedback.innerHTML = '';
        hintContainer.classList.add('hidden');
        
        // Получаем текущий уровень
        const level = gameData.levels.find(l => l.id === gameData.currentLevel);
        if (!level) {
            gameData.currentLevel = 1;
            return initGame();
        }
        
        // Обновляем отображение уровня
        levelElement.textContent = gameData.currentLevel;
        
        // Перемешиваем блоки
        const shuffledBlocks = [...level.blocks].sort(() => Math.random() - 0.5);
        
        // Создаем перетаскиваемые блоки
        shuffledBlocks.forEach((block, index) => {
            const codeBlock = document.createElement('div');
            codeBlock.className = 'code-block';
            codeBlock.draggable = true;
            codeBlock.dataset.id = index;
            codeBlock.dataset.content = block;
            codeBlock.textContent = block;
            codeBlock.style.backgroundColor = getRandomColor();
            
            // Добавляем обработчики drag & drop
            codeBlock.addEventListener('dragstart', handleDragStart);
            codeBlock.addEventListener('dragend', handleDragEnd);
            
            codeBlocksContainer.appendChild(codeBlock);
        });
        
        // Устанавливаем подсказку
        hintText.textContent = level.hint;
    }

    // Drag & Drop функции
    let draggedBlock = null;

    function handleDragStart(e) {
        if (!gameData.isPlaying) return;
        draggedBlock = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        
        // Создаем прозрачный дубликат для визуального эффекта
        setTimeout(() => {
            this.classList.add('dragging-active');
        }, 0);
    }

    function handleDragEnd() {
        if (!gameData.isPlaying) return;
        this.classList.remove('dragging', 'dragging-active');
        draggedBlock = null;
    }

    // Настройка drop зоны
    codeSolutionContainer.addEventListener('dragover', function(e) {
        if (!gameData.isPlaying) return;
        e.preventDefault();
        this.classList.add('drag-over');
        return false;
    });

    codeSolutionContainer.addEventListener('dragenter', function(e) {
        if (!gameData.isPlaying) return;
        e.preventDefault();
        this.classList.add('drag-over');
    });

    codeSolutionContainer.addEventListener('dragleave', function() {
        if (!gameData.isPlaying) return;
        this.classList.remove('drag-over');
    });

    codeSolutionContainer.addEventListener('drop', function(e) {
        if (!gameData.isPlaying || !draggedBlock) return;
        e.preventDefault();
        this.classList.remove('drag-over');
        
        // Убираем placeholder если он есть
        const placeholder = this.querySelector('.solution-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        // Создаем копию блока в зоне решения
        const clone = draggedBlock.cloneNode(true);
        clone.classList.remove('dragging', 'dragging-active');
        clone.addEventListener('click', function() {
            // При клике удаляем блок из зоны решения
            this.remove();
            
            // Если зона решения пуста, показываем placeholder
            if (codeSolutionContainer.children.length === 0) {
                const newPlaceholder = document.createElement('div');
                newPlaceholder.className = 'solution-placeholder';
                newPlaceholder.textContent = 'Перетащите блоки кода сюда';
                codeSolutionContainer.appendChild(newPlaceholder);
            }
        });
        
        this.appendChild(clone);
        
        // Удаляем оригинальный блок из зоны блоков
        draggedBlock.remove();
        
        // Воспроизводим звуковой эффект
        playSound('drop');
    });

    // Функция проверки решения
    function checkSolution() {
        if (!gameData.isPlaying) {
            showFeedback('Начните игру сначала!', 'warning');
            return;
        }
        
        const level = gameData.levels.find(l => l.id === gameData.currentLevel);
        const solutionBlocks = Array.from(codeSolutionContainer.querySelectorAll('.code-block'));
        
        if (solutionBlocks.length === 0) {
            showFeedback('Добавьте блоки кода в зону решения!', 'warning');
            return;
        }
        
        const userSolution = solutionBlocks.map(block => block.dataset.content);
        const isCorrect = JSON.stringify(userSolution) === JSON.stringify(level.solution);
        
        if (isCorrect) {
            // Правильное решение
            gameData.score += 100;
            scoreElement.textContent = gameData.score;
            
            showFeedback('✅ Отлично! Код собран правильно!', 'success');
            playSound('success');
            
            // Переход на следующий уровень
            setTimeout(() => {
                if (gameData.currentLevel < gameData.levels.length) {
                    gameData.currentLevel++;
                    initGame();
                    showFeedback(`🎉 Уровень ${gameData.currentLevel}!`, 'success');
                } else {
                    showFeedback('🎊 Вы прошли все уровни! Игра окончена.', 'success');
                    endGame();
                }
            }, 1500);
        } else {
            // Неправильное решение
            showFeedback('❌ Не совсем правильно. Попробуйте еще раз!', 'error');
            playSound('error');
        }
    }

    // Функция старта игры
    function startGame() {
        if (gameData.isPlaying) return;
        
        gameData.isPlaying = true;
        gameData.timeLeft = 60;
        gameData.score = 0;
        
        scoreElement.textContent = gameData.score;
        timerElement.textContent = gameData.timeLeft;
        
        startButton.disabled = true;
        startButton.innerHTML = '<i class="fas fa-play"></i> Игра идет...';
        
        // Запускаем таймер
        gameData.timer = setInterval(() => {
            gameData.timeLeft--;
            timerElement.textContent = gameData.timeLeft;
            
            if (gameData.timeLeft <= 0) {
                endGame();
            }
            
            // Меняем цвет таймера при малом времени
            if (gameData.timeLeft <= 10) {
                timerElement.style.color = 'var(--danger-color)';
                timerElement.style.animation = 'pulse 1s infinite';
            }
        }, 1000);
        
        initGame();
        showFeedback('🚀 Игра началась! Соберите код за 60 секунд!', 'info');
    }

    // Функция завершения игры
    function endGame() {
        clearInterval(gameData.timer);
        gameData.isPlaying = false;
        
        startButton.disabled = false;
        startButton.innerHTML = '<i class="fas fa-redo"></i> Начать заново';
        timerElement.style.color = '';
        timerElement.style.animation = '';
        
        showFeedback(`🏁 Игра окончена! Ваш счет: ${gameData.score} очков`, 'info');
        
        // Сбрасываем уровень
        gameData.currentLevel = 1;
    }

    // Функция сброса игры
    function resetGame() {
        if (gameData.isPlaying) {
            clearInterval(gameData.timer);
        }
        
        gameData.score = 0;
        gameData.timeLeft = 60;
        gameData.currentLevel = 1;
        gameData.isPlaying = false;
        
        scoreElement.textContent = gameData.score;
        timerElement.textContent = gameData.timeLeft;
        levelElement.textContent = gameData.currentLevel;
        
        startButton.disabled = false;
        startButton.innerHTML = '<i class="fas fa-play"></i> Начать игру';
        
        initGame();
        showFeedback('🔄 Игра сброшена!', 'info');
    }

    // Функция показа подсказки
    function showHint() {
        if (!gameData.isPlaying) {
            showFeedback('Начните игру сначала!', 'warning');
            return;
        }
        
        hintContainer.classList.toggle('hidden');
        
        if (!hintContainer.classList.contains('hidden')) {
            // Штраф за подсказку
            gameData.score = Math.max(0, gameData.score - 20);
            scoreElement.textContent = gameData.score;
            gameData.timeLeft = Math.max(10, gameData.timeLeft - 5);
            timerElement.textContent = gameData.timeLeft;
            
            showFeedback('💡 Использована подсказка! -20 очков, -5 секунд', 'warning');
        }
    }

    // Вспомогательные функции
    function showFeedback(message, type) {
        gameFeedback.innerHTML = '';
        gameFeedback.className = 'game-feedback';
        gameFeedback.classList.add(type);
        
        const feedback = document.createElement('div');
        feedback.innerHTML = message;
        gameFeedback.appendChild(feedback);
        
        gameFeedback.style.opacity = '0';
        gameFeedback.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            gameFeedback.style.transition = 'all 0.3s ease';
            gameFeedback.style.opacity = '1';
            gameFeedback.style.transform = 'translateY(0)';
        }, 10);
        
        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            gameFeedback.style.opacity = '0';
            gameFeedback.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                gameFeedback.innerHTML = '';
                gameFeedback.className = 'game-feedback';
            }, 300);
        }, 3000);
    }

    function playSound(type) {
        // В реальном приложении здесь можно добавить звуковые эффекты
        console.log(`Play sound: ${type}`);
    }

    function getRandomColor() {
        const colors = [
            'rgba(59, 130, 246, 0.1)',
            'rgba(16, 185, 129, 0.1)',
            'rgba(245, 158, 11, 0.1)',
            'rgba(239, 68, 68, 0.1)',
            'rgba(139, 92, 246, 0.1)',
            'rgba(236, 72, 153, 0.1)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Назначаем обработчики событий
    startButton.addEventListener('click', startGame);
    checkButton.addEventListener('click', checkSolution);
    resetButton.addEventListener('click', resetGame);
    hintButton.addEventListener('click', showHint);

    // Инициализируем игру при загрузке
    initGame();
    
    // Анимация для таймера
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
});