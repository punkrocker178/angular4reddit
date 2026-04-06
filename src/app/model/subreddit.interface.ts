export interface SubredditAbout {
  kind: string;
  data: SubredditData;
}

export interface SubredditData {
  display_name: string;
  title: string;
  public_description: string;
  subscribers: number;
  over18: boolean;
  banner_img: string;
  banner_background_image: string;
  community_icon: string;
  icon_img: string;
  header_img: string;
  name: string;
  subreddit_type: string;
  created_utc: number;
  [key: string]: unknown;
}

export interface SubredditRule {
  short_name: string;
  description: string;
  description_html: string;
  kind: string;
  priority: number;
}

export interface SubredditRulesResponse {
  rules: SubredditRule[];
}

export interface FlairRichtext {
  e: string;
  t?: string;
}

export interface LinkFlair {
  id: string;
  text: string;
  text_color: string;
  background_color: string;
  richtext: FlairRichtext[];
}
