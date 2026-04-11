(function() {
    // Не показываем на главной странице
    if (window.location.pathname === '/SMP/' || 
        window.location.pathname === '/SMP/index.html' ||
        window.location.pathname.endsWith('/SMP/')) {
        return;
    }
    
    // Создаем контейнер для кнопки с полным сбросом стилей
    const backWrapper = document.createElement('div');
    backWrapper.setAttribute('id', 'custom-back-button-wrapper');
    backWrapper.style.cssText = `
        all: initial !important;
        display: block !important;
        text-align: left !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        position: static !important;
        clear: both !important;
    `;
    
    // Создаем кнопку с полным сбросом стилей
    const backButton = document.createElement('button');
    backButton.setAttribute('id', 'custom-back-button');
    backButton.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 3px; vertical-align: middle;">
            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Назад
    `;
    
    // Сбрасываем ВСЕ возможные стили и применяем свои
    backButton.style.cssText = `
        all: initial !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
        background: linear-gradient(135deg, #0f1446 0%, #800000 100%) !important;
        color: white !important;
        border: none !important;
        padding: 6px 10px !important;
        border-radius: 30px !important;
        font-size: 11px !important;
        font-weight: 500 !important;
        font-family: 'Segoe UI', Roboto, system-ui, sans-serif !important;
        cursor: pointer !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15) !important;
        margin: 4px 0 0 4px !important;
        text-align: center !important;
        line-height: 1 !important;
        vertical-align: baseline !important;
        position: relative !important;
        left: 0 !important;
        right: auto !important;
        top: auto !important;
        float: none !important;
        transform: none !important;
        width: auto !important;
        height: auto !important;
        min-width: 0 !important;
        max-width: none !important;
    `;
    
    backButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
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
