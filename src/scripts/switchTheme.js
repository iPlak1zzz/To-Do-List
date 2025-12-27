export class ThemeSwitcher {
    selectors = {
        swithThemeButton: '[data-js-todo-switch-theme-button]'
    }
    
    themes = {
        dark: 'dark',
        ligth: 'light'
    }

    stateClasses = {
        isDarkTheme: 'is-dark-theme'
    }

    storageKey = 'theme'

    constructor() {
        this.switchThemeButtonElement = document.querySelector(this.selectors.swithThemeButton)
        this.setInitialTheme()
        this.bindEvents()
    }

    get isDarkThemeCached() {
        return localStorage.getItem(this.storageKey) === this.themes.dark
    }

    setInitialTheme() {
        document.documentElement.classList.toggle(this.stateClasses.isDarkTheme, this.isDarkThemeCached)
    }

    onClick = () => {
        localStorage.setItem(
            this.storageKey,
            this.isDarkThemeCached ? this.themes.ligth : this.themes.dark
        )

        document.documentElement.classList.toggle(this.stateClasses.isDarkTheme)
    }

    bindEvents() {
        this.switchThemeButtonElement.addEventListener('click', this.onClick)
    }
}