// Добавьте эту функцию в ваш sw.js
async function addBackButtonToHtml(response, requestUrl) {
    const html = await response.text();
    
    // Проверяем, не главная ли страница
    const isMainPage = requestUrl.includes('/SMP/index.html') || 
                       requestUrl.endsWith('/SMP/') ||
                       requestUrl.endsWith('/SMP');
    
    if (!isMainPage && requestUrl.endsWith('.html')) {
        // Кнопка "Назад" с текстом, которая не мешает контенту
        const backButtonScript = `
<style>
/* Стили для кнопки "Назад" */
.emhelp-back-button {
    position: fixed;
    top: 80px;
    left: 20px;
    z-index: 9999;
    cursor: pointer;
    background: linear-gradient(135deg, #0f1446 0%, #1a2260 100%);
    color: white;
    padding: 10px 18px;
    border-radius: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
    border: none;
    backdrop-filter: blur(0px);
    letter-spacing: 0.3px;
}

.emhelp-back-button:hover {
    transform: translateX(-3px);
    background: linear-gradient(135deg, #1a2260 0%, #0f1446 100%);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* Адаптация для мобильных устройств */
@media (max-width: 768px) {
    .emhelp-back-button {
        top: 70px;
        left: 15px;
        padding: 8px 15px;
        font-size: 14px;
        gap: 6px;
    }
}

/* Если есть фиксированный хедер - подстраиваемся */
@media (max-width: 600px) {
    .emhelp-back-button {
        top: 10px;
        left: 10px;
        padding: 8px 14px;
        font-size: 13px;
        background: rgba(15,20,70,0.95);
        backdrop-filter: blur(5px);
    }
}

/* Для страниц с маленьким контентом - кнопка не перекрывает */
body {
    padding-top: 0 !important;
}

/* Добавляем отступ для контента на мобильных */
@media (max-width: 600px) {
    .header, .menu, .content {
        position: relative;
        z-index: 1;
    }
}
</style>

<script>
(function() {
    // Проверяем, что это не главная страница
    if (!window.location.pathname.includes('/SMP/index.html') && 
        !window.location.pathname.endsWith('/SMP/') && 
        !window.location.pathname.endsWith('/SMP')) {
        
        // Ждем загрузки DOM
        function addButton() {
            // Проверяем, нет ли уже кнопки
            if (document.querySelector('.emhelp-back-button')) return;
            
            // Создаем кнопку
            const button = document.createElement('div');
            button.className = 'emhelp-back-button';
            button.innerHTML = '← Назад';
            
            // Функция возврата
            button.onclick = function(e) {
                e.stopPropagation();
                // Пробуем вернуться назад, если нет истории - идем на главную
                if (document.referrer && document.referrer.includes(window.location.hostname)) {
                    history.back();
                } else {
                    window.location.href = '/SMP/index.html';
                }
            };
            
            // Добавляем кнопку в body
            document.body.appendChild(button);
            
            // Проверяем, не перекрывает ли кнопка важные элементы
            setTimeout(() => {
                const header = document.querySelector('.header');
                if (header) {
                    const buttonRect = button.getBoundingClientRect();
                    const headerRect = header.getBoundingClientRect();
                    if (buttonRect.bottom > headerRect.top + 50) {
                        button.style.top = (headerRect.bottom + 10) + 'px';
                    }
                }
            }, 100);
        }
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addButton);
        } else {
            addButton();
        }
    }
})();
</script>`;
        
        // Вставляем перед </body>
        const modifiedHtml = html.replace('</body>', backButtonScript + '</body>');
        
        return new Response(modifiedHtml, {
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache, must-revalidate'
            }
        });
    }
    
    return response;
}

// Измените обработчик fetch
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(async response => {
                if (response && event.request.url.endsWith('.html')) {
                    return addBackButtonToHtml(response, event.request.url);
                }
                
                if (response) {
                    return response;
                }
                
                const fetchResponse = await fetch(event.request);
                if (fetchResponse && event.request.url.endsWith('.html')) {
                    return addBackButtonToHtml(fetchResponse, event.request.url);
                }
                
                return fetchResponse;
            })
            .catch(() => {
                if (event.request.headers.get('accept') && 
                    event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/SMP/index.html');
                }
                return new Response('Нет соединения с интернетом', { status: 503 });
            })
    );
});
