import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
    private _routesToCache: string[] = ['home', ':subreddit'];
    private _subredditsToCache: string[];

    private _storedRouteHandles = new Map<string, DetachedRouteHandle>();

    // Decides if the route should be stored
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        if (!route.routeConfig) return false;

        return this._routesToCache.indexOf(route.routeConfig.path) > -1;
    }

    //Store the information for the route we're destructing
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {

        if (route.routeConfig.path === ':subreddit') {
            this._storedRouteHandles.set(this._buildSubredditRoute(route.params.subreddit), handle);
        } else {
            this._storedRouteHandles.set(route.routeConfig.path, handle);
        }
    }

    //Return true if we have a stored route object for the next route
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        if (!route.routeConfig) return false;
        if (route.routeConfig.path === ':subreddit') {
            return this._storedRouteHandles.has(this._buildSubredditRoute(route.params.subreddit));
        } else {
            return this._storedRouteHandles.has(route.routeConfig.path);
        }
    }

    //If we returned true in shouldAttach(), now return the actual route data for restoration
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (route.routeConfig.path === ':subreddit') {
            return this._storedRouteHandles.get(this._buildSubredditRoute(route.params.subreddit));
        } else {
            return this._storedRouteHandles.get(route.routeConfig.path);
        }
    }

    //Reuse the route if we're going to and from the same route
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        if (!!future.routeConfig && !!curr.routeConfig) {
            if (future.routeConfig.path === ':subreddit' && curr.routeConfig.path === ':subreddit') {
                return future.params.subreddit === curr.params.subreddit;
            }
            return future.routeConfig === curr.routeConfig;
        }
        return false;
    }

    private _buildSubredditRoute(subreddit: string): string {
        return `r/${subreddit}`;
    }
}