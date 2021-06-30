import { Injectable } from "@angular/core";
import { PreferencesService } from "./preferences.service";

@Injectable()
export class ThemeService {
    constructor(
        private preferenceService: PreferencesService
    ) {}

    themes = {
        light: 'light',
        candy: 'candy-theme',
        dark: 'dark-theme',
        steam: 'steam-theme'
    }

    changeTheme(theme: string) {
        if (theme) {
            const themeClass = this.themes[theme];
            document.body.className = '';
            document.body.classList.add(themeClass);
        } else {
            document.body.className = '';
            document.body.classList.add('dark');
        }
        
        this.preferenceService.setPreference('theme', theme);
    }
}