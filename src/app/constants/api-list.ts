export class ApiList {

    /* Listings label */
    public static readonly LISTINGS_HOT_LABEL: string = 'Hot';
    public static readonly LISTINGS_BEST_LABEL: string = 'Best';
    public static readonly LISTINGS_NEW_LABEL: string = 'New';
    public static readonly LISTINGS_RISING_LABEL: string = 'Rising';

    /* Listtings APIs */
    public static readonly LISTINGS_HOT: string = '/hot';
    public static readonly LISTINGS_BEST: string = '/best';
    public static readonly LISTINGS_NEW: string = '/new';
    public static readonly LISTINGS_RISING: string = '/rising';
    public static readonly LISTINGS_RANDOM: string = '/random';
    public static readonly LISTINGS_TOP: string = '/top';
    public static readonly LISTINGS_CONTROVERSIAL: string = '/controversial';
    public static readonly LISTINGS_SORT: string = '/sort';
    public static readonly LISTINGS_TRENDING_SUB: string = '/api/trending_subreddits';
    public static readonly LISTINGS_BY_ID: string = '/by_id';
    public static readonly LISTINGS_COMMENTS: string = '/comments';

    /* Get user info */
    public static readonly USER_INFO: string = '/api/v1/me';
    public static readonly USER_OVERVIEW: string = '/overview';
    public static readonly USER_POSTS: string = '/submitted';
    public static readonly USER_COMMENTS: string = '/comments';
    public static readonly USER_UPVOTED: string = '/upvoted';
    public static readonly USER_DOWNVOTED: string = '/downvoted';
    public static readonly USER_HIDDEN: string = '/hidden';
    public static readonly USER_SAVED: string = '/saved';
}