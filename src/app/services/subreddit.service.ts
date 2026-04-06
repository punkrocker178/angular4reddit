import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { environment } from 'src/environments/environment';
import { HeadersUtils } from '../class/HeadersUtils';
import { Observable, of, throwError } from 'rxjs';
import { Listings } from '../model/listings.interface';
import { catchError, map } from 'rxjs/operators';
import { SubredditAbout, SubredditRulesResponse, LinkFlair } from '../model/subreddit.interface';
import { Post } from '../model/post';

interface RedditListingApiResponse {
  kind: string;
  data: {
    after: string;
    children: Post[];
  };
}

@Injectable()
export class SubredditService {

  private path = environment.functionUrl + '/oauth/';
  constructor(private http: HttpClient,
    private authenticateService: RedditAuthenticateService) { }

  getSubredditAbout(subbreddit: string): Observable<SubredditAbout> {
    const aboutAPI = `${this.path}${subbreddit}/about`;
    return this.http.get<SubredditAbout>(aboutAPI);
  }

  subscribeSubreddit(action: string, fullname: string) {
    let payload = {
      action: action,
      action_source: 'o',
      sr: fullname
    }

    let body = new HttpParams();
    for (const field in payload) {
      body = body.set(field, payload[field]);
    }

    return this.http.post(HeadersUtils.buildUrl('/api/subscribe'), body.toString(),
      {
        headers:
        {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  }

  searchInSubreddit(term: string, subreddit: string, after?: string, sort?: string): Observable<Listings> {
    let payload: Record<string, string | boolean> = {
      q: term,
      restrict_sr: true,
    }

    if (after) {
      payload['after'] = after;
    }

    if (sort) {
      payload['sort'] = sort;
    }

    let param = new HttpParams();
    for (const field in payload) {
      param = param.set(field, String(payload[field]));
    }

    return this.http.get<RedditListingApiResponse>(HeadersUtils.buildUrl(`/r/${subreddit}/search`), {
      params: param
    }).pipe(map((data: RedditListingApiResponse) => {
      return {
        kind: data.kind,
        after: data.data.after,
        children: data.data.children
      }
    }));
  }

  getSubredditRules(subreddit: string): Observable<SubredditRulesResponse> {
    return this.http.get<SubredditRulesResponse>(HeadersUtils.buildUrl(`/r/${subreddit}/about/rules`));
  }

  getSubredditLinkFlairs(subreddit: string): Observable<LinkFlair[]> {
    return this.http.get<LinkFlair[]>(HeadersUtils.buildUrl(`/r/${subreddit}/api/link_flair_v2`)).pipe(
      map((data: LinkFlair[]) => {
        if ((data as unknown as { json?: { errors?: unknown[] } })?.json?.errors?.length > 0) {
          return throwError(() => (data as unknown as { json: unknown }).json) as unknown as LinkFlair[];
        }
        return data;
      }),
    );
  }
}
