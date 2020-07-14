import { environment } from 'src/environments/environment';

export class HeadersUtils {

    public static buildHeaders(data: any) {
        let headers = {
            'Content-Type': 'application/json'
        }

        if (data.bearerToken) {
            headers['Authorization'] = data.bearerToken;
        }

        return headers;

    }


    public static buildUrl(isLoggedIn: boolean, segment: string, requestJson?: boolean) {
        return environment.functionUrl 
        + (isLoggedIn ? '/oauth' + segment: segment)
        + (requestJson ? '/.json' : '');
    }
}