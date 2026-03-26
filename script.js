const buttons = document.querySelectorAll('.menu-btn');
const sections = document.querySelectorAll('.section');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Снимаем активность со всех кнопок
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Показываем только соответствующий раздел
    const target = btn.getAttribute('data-target');
    sections.forEach(sec => {
      if(sec.id === target) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });
  });
});
