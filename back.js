(function() {
    // Не показываем на главной странице
    if (window.location.pathname === '/SMP/' || 
        window.location.pathname === '/SMP/index.html' ||
        window.location.pathname.endsWith('/SMP/')) {
        return;
    }
    
    // Создаем контейнер для кнопки (максимально прижато к левому верхнему углу)
    const backWrapper = document.createElement('div');
    backWrapper.style.cssText = `
        padding: 0;
        margin: 0;
        text-align: left;
        line-height: 0;
    `;
    
    // Создаем маленькую кнопку с градиентом
    const backButton = document.createElement('button');
    backButton.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 3px;">
            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Назад
    `;
    backButton.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        background: linear-gradient(135deg, #0f1446 0%, #800000 100%);
        color: white;
        border: none;
        padding: 6px 10px;
        border-radius: 30px;
        font-size: 11px;
        font-weight: 500;
        font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        margin: 4px 0 0 4px;
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
