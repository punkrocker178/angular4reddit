import { Injectable } from "@angular/core";

@Injectable()
export class ThemeService {
    constructor() {}

    themes = {
        candy: 'candy-theme',
        dark: 'dark-theme',
        steam: 'steam-theme'
    }

    changeTheme(theme: string) {
        const themeClass = this.themes[theme];
        document.body.className = '';
        document.body.classList.add(themeClass);
    }
}