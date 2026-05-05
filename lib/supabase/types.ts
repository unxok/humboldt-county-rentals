export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  hcr: {
    Tables: {
      listings: {
        Row: {
          address_city: string | null
          address_state: string | null
          address_street: string | null
          address_street2: string | null
          address_zip: string | null
          available_date: string | null
          bathrooms: number | null
          bedrooms: number | null
          cover_url: string | null
          created_at: string
          deposit_price: number | null
          id: number
          is_admin_hidden: boolean
          is_cats_allowed: boolean | null
          is_dogs_allowed: boolean | null
          is_listed: boolean
          listing_id: string
          listing_url: string | null
          long_description: string | null
          photo_urls: string[] | null
          property_owner_id: number
          rent_price: number | null
          short_description: string | null
          square_feet: number | null
          updated_at: string
        }
        Insert: {
          address_city?: string | null
          address_state?: string | null
          address_street?: string | null
          address_street2?: string | null
          address_zip?: string | null
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          cover_url?: string | null
          created_at?: string
          deposit_price?: number | null
          id?: number
          is_admin_hidden: boolean
          is_cats_allowed?: boolean | null
          is_dogs_allowed?: boolean | null
          is_listed: boolean
          listing_id: string
          listing_url?: string | null
          long_description?: string | null
          photo_urls?: string[] | null
          property_owner_id: number
          rent_price?: number | null
          short_description?: string | null
          square_feet?: number | null
          updated_at?: string
        }
        Update: {
          address_city?: string | null
          address_state?: string | null
          address_street?: string | null
          address_street2?: string | null
          address_zip?: string | null
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          cover_url?: string | null
          created_at?: string
          deposit_price?: number | null
          id?: number
          is_admin_hidden?: boolean
          is_cats_allowed?: boolean | null
          is_dogs_allowed?: boolean | null
          is_listed?: boolean
          listing_id?: string
          listing_url?: string | null
          long_description?: string | null
          photo_urls?: string[] | null
          property_owner_id?: number
          rent_price?: number | null
          short_description?: string | null
          square_feet?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_property_owner_id_fkey"
            columns: ["property_owner_id"]
            isOneToOne: false
            referencedRelation: "property_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      listings_likes: {
        Row: {
          created_at: string
          id: number
          listing_id: number
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          listing_id: number
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: number
          listing_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_likes_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      property_owners: {
        Row: {
          branding_color: string
          created_at: string
          home_url: string | null
          id: number
          listings_url: string | null
          logo_url: string | null
          name: string
          scraper_name: string | null
          text_color: string
        }
        Insert: {
          branding_color: string
          created_at?: string
          home_url?: string | null
          id?: number
          listings_url?: string | null
          logo_url?: string | null
          name: string
          scraper_name?: string | null
          text_color?: string
        }
        Update: {
          branding_color?: string
          created_at?: string
          home_url?: string | null
          id?: number
          listings_url?: string | null
          logo_url?: string | null
          name?: string
          scraper_name?: string | null
          text_color?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_listings_filter_info: {
        Args: never
        Returns: {
          bathrooms: number[]
          bedrooms: number[]
          cities: string[]
          owner_ids: number[]
          owner_names: string[]
        }[]
      }
      toggle_listing_like: {
        Args: { p_listing_id: number; p_profile_id: string }
        Returns: boolean
      }
      unlist_scraped_listings: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          id: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          username?: string
        }
        Update: {
          created_at?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
      username_animal_options: {
        Row: {
          animal_name: string
          created_at: string
          id: number
        }
        Insert: {
          animal_name: string
          created_at?: string
          id?: number
        }
        Update: {
          animal_name?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      username_color_options: {
        Row: {
          color_name: string
          created_at: string
          id: number
        }
        Insert: {
          color_name: string
          created_at?: string
          id?: number
        }
        Update: {
          color_name?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_username_exists: {
        Args: { username_input: string }
        Returns: boolean
      }
      delete_logged_in_user: { Args: never; Returns: undefined }
      generate_pretty_username: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  hcr: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
