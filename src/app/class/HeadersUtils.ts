import { environment } from 'src/environments/environment';

export class HeadersUtils {

    public static buildUrl(segment: string, requestJson?: boolean) {
        const url = `${environment.functionUrl}/oauth${segment}`;
        return url;
    }

    public static buildPushshiftUrl(path: string) {
        return `${environment.functionUrl}/pushshift${path}`;
    }
}