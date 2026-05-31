export type Plan = "free" | "pro";

export type BackgroundType = "image" | "gif" | "video";

export type ProfileEffects = {
  particles: boolean;
  glass: boolean;
  glow: boolean;
  entrance: boolean;
};

export type User = {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string;
  theme: string;
  plan: Plan;
  audio_url: string | null;
  background_url: string | null;
  background_type: BackgroundType | null;
  effects_enabled: ProfileEffects | null;
  volume: number;
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
  created_at?: string;
};

export type SocialNetwork =
  | "instagram"
  | "tiktok"
  | "snapchat"
  | "twitch"
  | "discord"
  | "youtube"
  | "facebook"
  | "website";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<User, "id">>;
        Relationships: [];
      };
      links: {
        Row: Link;
        Insert: Omit<Link, "id" | "created_at"> & {
          id?: string;
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
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
