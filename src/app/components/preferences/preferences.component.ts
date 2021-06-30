import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Preferences } from 'src/app/model/preferences.interface';
import { PreferencesService } from 'src/app/services/preferences.service';
@Component({
    selector: 'app-preferences',
    templateUrl: './preferences.component.html'
})

export class PreferencesComponent implements OnInit {

    constructor(private preferencesService: PreferencesService) { }
    destroy$: Subject<boolean> = new Subject();
    preferences: Preferences;

    ngOnInit() {
        this.preferencesService.preference.pipe(
            takeUntil(this.destroy$),
            tap(next => {
                this.preferences = next;
            })
        ).subscribe();
    }

    updateTogglePreference(setting: string, value: boolean) {
        this.preferencesService.setPreference(setting, value);
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}