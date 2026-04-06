import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
    private localStorage: Storage;

    constructor() {
        this.localStorage = window.localStorage;
    }

    set<T>(key: string, value: T): boolean {
        if (this.isSupportLocalStorage()) {
            this.localStorage.setItem(key, JSON.stringify(value));
            return true;
        }
        return false;
    }

    has<T = unknown>(key: string): boolean {
        return this.get<T>(key) !== null;
    }

    get<T = unknown>(key: string): T | null {
        if (this.isSupportLocalStorage()) {
            const item = this.localStorage.getItem(key);
            return item ? JSON.parse(item) as T : null;
        }
        return null;
    }

    remove(key: string): boolean {
        if (this.isSupportLocalStorage()) {
            this.localStorage.removeItem(key);
            return true;
        }
        return false;
    }

    isSupportLocalStorage(): boolean {
        return !!this.localStorage;
    }
}
