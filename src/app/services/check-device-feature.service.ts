import { Injectable } from '@angular/core';

@Injectable()
export class CheckDeviceFeatureService {

    private _isTouchScreen: boolean;

    constructor() {
        this.checkTouchScreen();
    }

    public get isTouchScreen() {
        return this._isTouchScreen;
    }

    public isMobile() {
        return window.innerWidth <750 && this._isTouchScreen;
    }

    /*  Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent */
    private checkTouchScreen() {

        if ("maxTouchPoints" in navigator) {
            this._isTouchScreen = navigator['maxTouchPoints'] > 0;
        } else if ("msMaxTouchPoints" in navigator) {
            this._isTouchScreen = navigator['msMaxTouchPoints'] > 0;
        } else {
            let mQ = window.matchMedia && matchMedia("(pointer:coarse)");
            if (mQ && mQ.media === "(pointer:coarse)") {
                this._isTouchScreen = !!mQ.matches;
            } else if ('orientation' in window) {
                this._isTouchScreen = true; // deprecated, but good fallback
            } else {
                // Only as a last resort, fall back to user agent sniffing
                let userAgent = navigator['userAgent'];
                this._isTouchScreen = (/\b(BlackBerry|webOS|iPhone|IEMobile|Android|Windows Phone|iPad|iPod)\b/i.test(userAgent));
            }
        }
            
    }

    isAppleDevices() {
        return /apple/i.test(navigator['vendor']);
    }
}