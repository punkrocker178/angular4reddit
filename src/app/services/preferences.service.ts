import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '../model/preferences.interface';
import { LocalStorageService } from './localStorage.service';

@Injectable()
export class PreferencesService {
    _preferences: BehaviorSubject<Preferences> = new BehaviorSubject(null);

    get preference() {
        return this._preferences.asObservable();
    }

    get preferenceValue() {
        return this._preferences.getValue();
    }

    constructor(private localStorage: LocalStorageService) {}

    initPreference() {
        if (!this.localStorage.get('prefs')) {
            const prefs = {
                safeBrowsing: true,
                theme: 'dark',
                useMarkdown: false
            }

            this._preferences.next(prefs);

            this.localStorage.set('prefs',prefs);
        } else {
            this._preferences.next(this.localStorage.get('prefs'));
        }
    }

    setPreference(setting: string, value) {
        let prefs = this._preferences.value;
        prefs[setting] = value;
        this._preferences.next(prefs);
        this.localStorage.set('prefs', prefs);
    }
}