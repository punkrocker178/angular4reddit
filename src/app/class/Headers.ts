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
}