export type Plan = "free" | "pro";

export type BackgroundType = "image" | "gif" | "video";

export type BioThemeId =
  | "classic"
  | "dark_luxury"
  | "neon_purple"
  | "ice_blue"
  | "red_shadow"
  | "gold_premium"
  | "cyber_green";

export type EffectType = "none" | "particles" | "rain" | "snow" | "stars";

export type CursorEffect = "none" | "trail";

export type ProfileAnimation = "none" | "fade" | "scale" | "slide";

export type UsernameEffect = "none" | "glow" | "pulse" | "glitch" | "sparkle";

export type AvatarAnimation = "none" | "float" | "pulse" | "rotate-slow";

export type PageTransition = "fade" | "zoom" | "slide" | "none";

export type ProfileEffects = {
  particles: boolean;
  glass: boolean;
  glow: boolean;
  entrance: boolean;
};

export type SocialNetwork =
  | "instagram"
  | "tiktok"
  | "snapchat"
  | "twitch"
  | "discord"
  | "youtube"
  | "facebook"
  | "website"
  | "telegram"
  | "twitter"
  | "github";

export type User = {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string;
  location: string;
  theme: string;
  plan: Plan;
  audio_url: string | null;
  audio_title: string | null;
  volume: number;
  audio_loop: boolean;
  background_url: string | null;
  background_type: BackgroundType | null;
  background_blur: number;
  background_opacity: number;
  cursor_url: string | null;
  profile_opacity: number;
  profile_blur: number;
  border_radius: number;
  card_width: number;
  avatar_size: number;
  effects_enabled: ProfileEffects | null;
  effect_type: EffectType;
  background_effect: EffectType;
  cursor_effect: CursorEffect;
  profile_animation: ProfileAnimation;
  username_effect: UsernameEffect;
  avatar_animation: AvatarAnimation;
  page_transition: PageTransition;
  accent_color: string | null;
  text_color: string | null;
  background_color: string | null;
  icon_color: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  gradient_enabled: boolean;
  glow_color: string | null;
  button_color: string | null;
  button_text_color: string | null;
  views: number;
  created_at?: string;
  updated_at?: string;
};

export type Link = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  clicks: number;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "created_at" | "updated_at" | "views"> & {
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<User, "id">>;
        Relationships: [];
      };
      links: {
        Row: Link;
        Insert: Omit<Link, "id" | "created_at" | "clicks"> & {
          id?: string;
          clicks?: number;
          created_at?: string;
        };
        Update: Partial<Omit<Link, "id" | "user_id">>;
        Relationships: [
          {
            foreignKeyName: "links_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_profile_views: {
        Args: { profile_user_id: string };
        Returns: void;
      };
      increment_link_clicks: {
        Args: { link_id: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
