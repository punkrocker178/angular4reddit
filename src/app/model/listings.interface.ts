import { Post } from './post';

export interface Listings {
    kind: string;
    after: string;
    children: Post[];

}