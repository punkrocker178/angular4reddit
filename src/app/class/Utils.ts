export class Utils {
    static stringCharacters = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Weak method
    public static generateRandomString() {
        let stringLen = this.randomNumbers(4,6);
        let result = '';
        for (let i = 0; i < stringLen; i++) {
            result += this.stringCharacters[Math.floor(Math.random() * this.stringCharacters.length)];
        }
        return result;
    }

    static randomNumbers(min: number, max: number) {
        let random = 0;

        while (true) {
            random = 1 + Math.floor(Math.random() * max);
            if (random >= min && random <= max) {
                break;
            }
        }

        return random;
    }

    static clearUrl(url: string) {
        return url.replace(/amp;/g, '');
    }
}