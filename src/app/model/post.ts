export interface MediaResolution {
  url: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export interface PreviewImage {
  source?: MediaResolution;
  s?: MediaResolution;
  resolutions?: MediaResolution[];
  variants?: {
    gif?: { source?: MediaResolution; resolutions?: MediaResolution[] };
    [key: string]: unknown;
  };
  metadata?: Record<string, unknown>;
}

export interface PostPreview {
  enabled: boolean;
  images: PreviewImage[];
}

export interface RedditVideo {
  hls_url: string;
  dash_url: string;
  fallback_url: string;
  [key: string]: unknown;
}

export interface OEmbed {
  html: string;
  [key: string]: unknown;
}

export interface PostMedia {
  type?: string;
  oembed?: OEmbed;
  reddit_video?: RedditVideo;
  [key: string]: unknown;
}

export interface MediaMetadataItem {
  status: string;
  s?: { u: string; [key: string]: unknown };
  p?: { u: string; [key: string]: unknown }[];
  [key: string]: unknown;
}

export interface GalleryItem {
  media_id: string;
  metadata?: unknown;
  source?: string;
  [key: string]: unknown;
}

export interface GalleryData {
  items: GalleryItem[];
}

export interface PostReplies {
  kind: string;
  data: {
    children: Post[];
    [key: string]: unknown;
  };
}

export interface FlairRichtextPart {
  e: string;
  t?: string;
  u?: string;
}

export interface FlairData {
  flair_text?: string;
  flair_richtext?: FlairRichtextPart[];
  flair_background_color?: string;
}

export interface AwardIcon {
  url: string;
}

export interface Award {
  icon_url: string;
  resized_icons?: AwardIcon[];
  [key: string]: unknown;
}

export interface PostData {
  id: string;
  name: string;
  title?: string;
  selftext?: string;
  selftext_html?: string;
  author: string;
  subreddit: string;
  subreddit_name_prefixed?: string;
  score: number;
  ups: number;
  downs: number;
  url?: string;
  permalink: string;
  num_comments: number;
  created_utc: number;
  thumbnail?: string;
  domain?: string;
  is_video?: boolean;
  is_gallery?: boolean;
  is_self?: boolean;
  is_reddit_media_domain?: boolean;
  media?: PostMedia;
  media_metadata?: Record<string, MediaMetadataItem>;
  preview?: PostPreview;
  gallery_data?: GalleryData;
  over_18?: boolean;
  stickied?: boolean;
  saved?: boolean;
  likes?: boolean | null;
  link_flair_text?: string;
  link_flair_richtext?: FlairRichtextPart[];
  link_flair_background_color?: string;
  awards?: Award[];
  archived?: boolean;
  parent_id?: string;
  children?: string[];
  replies?: PostReplies | '';
  crosspost_parent_list?: Post[];
  all_awardings: unknown[];
  [key: string]: unknown;
}

export class Post {
  kind!: string;
  data!: PostData;
}
