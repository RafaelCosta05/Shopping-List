//Theme dark or light
const themeToggler = document.querySelector('.theme-toggler');

// Function to set theme based on localStorage value
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode-variables');
        themeToggler.querySelector('.light-mode').classList.remove('active');
        themeToggler.querySelector('.dark-mode').classList.add('active');
    } else {
        document.body.classList.remove('dark-mode-variables');
        themeToggler.querySelector('.dark-mode').classList.remove('active');
        themeToggler.querySelector('.light-mode').classList.add('active');
    }
}

// SAVE THEME WHEN CHANGE PAGE
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}

// TOGGLE THEME
if (themeToggler) {
    themeToggler.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode-variables');
        const newTheme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    });
}