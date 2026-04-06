import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '../model/preferences.interface';
import { LocalStorageService } from './localStorage.service';

@Injectable()
export class PreferencesService {
    _preferences: BehaviorSubject<Preferences | null> = new BehaviorSubject<Preferences | null>(null);

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
                showNSFW: false,
                safeBrowsing: true,
                theme: 'dark',
                useMarkdown: false
            }

            this._preferences.next(prefs);

            this.localStorage.set('prefs',prefs);
        } else {
            this._preferences.next(this.localStorage.get('prefs')!);
        }
    }

    setPreference<K extends keyof Preferences>(setting: K, value: Preferences[K]) {
        let prefs = this._preferences.value;
        if (!prefs) return;
        prefs[setting] = value;
        this._preferences.next(prefs);
        this.localStorage.set('prefs', prefs);
    }
}
