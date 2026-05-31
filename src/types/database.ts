export type Plan = "free" | "pro";

export type BackgroundType = "image" | "gif" | "video";

export type BioThemeId =
  | "classic"
  | "dark_luxury"
  | "neon_purple"
  | "ice_blue"
  | "red_shadow";

export type EffectType = "none" | "particles" | "rain" | "snow" | "stars";

export type CursorEffect = "none" | "trail";

export type ProfileAnimation = "none" | "fade" | "scale" | "slide";

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
  /** Preset theme id */
  theme: string;
  plan: Plan;
  audio_url: string | null;
  audio_title: string | null;
  volume: number;
  background_url: string | null;
  background_type: BackgroundType | null;
  background_blur: number;
  background_opacity: number;
  effects_enabled: ProfileEffects | null;
  effect_type: EffectType;
  cursor_effect: CursorEffect;
  profile_animation: ProfileAnimation;
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
