import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
    private localStorage: Storage;

    constructor() {
        this.localStorage = window.localStorage;
    }

    set(key: string, value: any) {
        if (this.isSupportLocalStorage()) {
            this.localStorage.setItem(key, JSON.stringify(value));
            return true;
        }
        return false;

    }

    get(key: string) {
        if (this.isSupportLocalStorage()) {
            return JSON.parse(this.localStorage.getItem(key));
        }
        return false;
    }

    remove(key:string) {
        if (this.isSupportLocalStorage()) {
            this.localStorage.removeItem(key);
            return true;
        }
        return false;
    }

    isSupportLocalStorage() {
        return !!this.localStorage;
    }
}