(function() {
    // Не показываем на главной странице
    if (window.location.pathname === '/SMP/' || 
        window.location.pathname === '/SMP/index.html' ||
        window.location.pathname.endsWith('/SMP/')) {
        return;
    }
    
    // Создаем контейнер для кнопки (максимальное смещение в левый верхний угол)
    const backWrapper = document.createElement('div');
    backWrapper.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        padding: 12px 0 0 12px;
        margin: 0;
    `;
    
    // Создаем кнопку с градиентом (как кнопка "ГРИФАМ МСК")
    const backButton = document.createElement('button');
    backButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 4px;">
            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Назад
    `;
    backButton.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: linear-gradient(135deg, #0f1446 0%, #800000 100%);
        color: white;
        border: none;
        padding: 10px 18px;
        border-radius: 40px;
        font-size: 15px;
        font-weight: 500;
        font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    `;
    
    backButton.onclick = (e) => {
        e.preventDefault();
        history.back();
    };
    
    backWrapper.appendChild(backButton);
    
    // Вставляем в самое начало body
    if (document.body.firstChild) {
        document.body.insertBefore(backWrapper, document.body.firstChild);
    } else {
        document.body.appendChild(backWrapper);
    }
})();
