import { environment } from 'src/environments/environment';

export class HeadersUtils {

    public static buildUrl(isLoggedIn, segment: string, requestJson?: boolean) {
        const url = `${environment.functionUrl}${(isLoggedIn ? '/oauth' + segment: segment)}${ !isLoggedIn ? '/.json' : ''}`;
        if (!requestJson) {
            return url.replace('/.json', '');
        }
        return url;
    }
}