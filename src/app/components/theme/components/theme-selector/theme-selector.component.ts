import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'events';
import { Theme } from 'src/app/model/theme.interface';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
    selector: 'app-theme-selector',
    templateUrl: './theme-selector.component.html'
})

export class ThemeSelectorComponent implements OnInit {
    themes: Theme[];
    selectedThemeIndex: boolean[];
    @Input() selectedTheme: string;
    @Output() themeEmitter: EventEmitter = new EventEmitter();

    constructor(private themeService: ThemeService) {}

    ngOnInit() {
        this.themes = this.themeService.themes.filter((theme: Theme) => (theme.name !== 'Light' && theme.name !== 'Dark'));
        const themeIndex = this.themes.findIndex((theme: Theme) => theme.name.toLowerCase() === this.selectedTheme.toLowerCase());
        this.selectedThemeIndex = new Array(this.themes.length).fill(false);

        if (themeIndex > -1) {
            this.selectedThemeIndex[themeIndex] = true;
        }
    }

    selectTheme(index: number) {
        this.selectedThemeIndex.forEach((value, idx) => {
            if (idx !== index) {
                this.selectedThemeIndex[idx] = false;
            }
        });

        this.selectedThemeIndex[index] = !this.selectedThemeIndex[index];

        const selectedTheme = this.selectedThemeIndex.findIndex(value => value === true);
        if (selectedTheme >= 0) {
            this.themeService.changeTheme(this.themes[selectedTheme].name);
        } else {
            this.themeService.changeTheme('dark');
        }

    }
}
