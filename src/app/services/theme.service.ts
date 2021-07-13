import { Injectable } from "@angular/core";
import { Theme } from "../model/theme.interface";
import { PreferencesService } from "./preferences.service";

@Injectable()
export class ThemeService {
    constructor(
        private preferenceService: PreferencesService
    ) { }

    private _themes: Theme[] = [
        {
            name: 'Light',
            themeClass: 'light',
            description: 'Light theme'
        },
        {
            name: 'Dark',
            themeClass: 'dark-theme',
            description: 'Dark theme'
        },
        {
            name: 'Steam',
            themeClass: 'steam-theme',
            description: 'Your favourite water vapor game store'
        },
        // This theme needs more work
        // {
        //     name: 'Candy',
        //     themeClass: 'candy-theme',
        //     description: 'Mmmmm Candy'
        // }
    ];

    get themes(): Theme[] {
        return this._themes;
    }

    changeTheme(themeName: string) {
        if (themeName) {
            const themeClass = this._themes.find((theme: Theme) => theme.name.toLowerCase() === themeName.toLowerCase()).themeClass;
            document.body.className = '';
            document.body.classList.add(themeClass);
        } else {
            document.body.className = '';
            document.body.classList.add('dark');
        }

        this.preferenceService.setPreference('theme', themeName);
    }
}