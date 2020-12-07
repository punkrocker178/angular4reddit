import { environment } from 'src/environments/environment';

export class HeadersUtils {

    public static buildUrl(isLoggedIn, segment: string, requestJson?: boolean) {
        return environment.functionUrl 
        + (isLoggedIn ? '/oauth' + segment: segment)
        + (requestJson ? '/.json' : '');
    }
}