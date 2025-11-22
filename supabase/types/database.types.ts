export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      banners: {
        Row: {
          created_at: string;
          id: string;
          image: string;
          is_active: boolean;
          name: string;
          updated_at: string;
          url: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
          url?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          image?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
          url?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          id: string;
          image: string | null;
          is_active: boolean;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image?: string | null;
          is_active?: boolean;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image?: string | null;
          is_active?: boolean;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          amount: number;
          code: string;
          created_at: string;
          id: string;
          is_active: boolean;
          max_redeemable_amount: number | null;
          min_purchase_amount: number;
          type: string;
          updated_at: string;
          usage_count: number;
          usage_limit: number;
          valid_from: string;
          valid_until: string;
        };
        Insert: {
          amount: number;
          code: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          max_redeemable_amount?: number | null;
          min_purchase_amount?: number;
          type: string;
          updated_at?: string;
          usage_count?: number;
          usage_limit?: number;
          valid_from: string;
          valid_until: string;
        };
        Update: {
          amount?: number;
          code?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          max_redeemable_amount?: number | null;
          min_purchase_amount?: number;
          type?: string;
          updated_at?: string;
          usage_count?: number;
          usage_limit?: number;
          valid_from?: string;
          valid_until?: string;
        };
        Relationships: [];
      };
      delivery_service_types: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      delivery_zones: {
        Row: {
          created_at: string;
          delivery_service_type_id: string;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          delivery_service_type_id: string;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          delivery_service_type_id?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'delivery_zones_delivery_service_type_id_fkey';
            columns: ['delivery_service_type_id'];
            isOneToOne: false;
            referencedRelation: 'delivery_service_types';
            referencedColumns: ['id'];
          },
        ];
      };
      dosage_forms: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      features: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image: string;
          is_active: boolean;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image: string;
          is_active?: boolean;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image?: string;
          is_active?: boolean;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      galleries: {
        Row: {
          bucket: string;
          created_at: string;
          etag: string | null;
          file_name: string;
          file_path: string;
          file_url: string;
          id: string;
          updated_at: string;
          version_id: string | null;
        };
        Insert: {
          bucket: string;
          created_at?: string;
          etag?: string | null;
          file_name: string;
          file_path: string;
          file_url: string;
          id?: string;
          updated_at?: string;
          version_id?: string | null;
        };
        Update: {
          bucket?: string;
          created_at?: string;
          etag?: string | null;
          file_name?: string;
          file_path?: string;
          file_url?: string;
          id?: string;
          updated_at?: string;
          version_id?: string | null;
        };
        Relationships: [];
      };
      generics: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_payment_requests: {
        Row: {
          code: string | null;
          created_at: string;
          id: string;
          is_active: boolean;
          order_id: string;
          payment_reference: string | null;
          updated_at: string;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          order_id: string;
          payment_reference?: string | null;
          updated_at?: string;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          order_id?: string;
          payment_reference?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'order_payment_requests_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
        ];
      };
      order_returns: {
        Row: {
          code: string | null;
          created_at: string;
          created_by_id: string | null;
          id: string;
          is_active: boolean;
          note: string | null;
          order_id: string;
          products: Json | null;
          updated_at: string;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          created_by_id?: string | null;
          id?: string;
          is_active?: boolean;
          note?: string | null;
          order_id: string;
          products?: Json | null;
          updated_at?: string;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          created_by_id?: string | null;
          id?: string;
          is_active?: boolean;
          note?: string | null;
          order_id?: string;
          products?: Json | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'order_returns_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_returns_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          code: string | null;
          created_at: string;
          created_by_id: string | null;
          customer_id: string;
          delivery_charge: number | null;
          delivery_zone_id: string;
          due_amount: number | null;
          grand_total_amount: number | null;
          id: string;
          is_active: boolean;
          is_draft: boolean;
          note: string | null;
          pay_amount: number | null;
          payment_method_id: string | null;
          payment_reference: string | null;
          payment_status: string | null;
          products: Json | null;
          redeem_amount: number | null;
          round_off_amount: number | null;
          status: string | null;
          sub_total_amount: number | null;
          tax_amount: number | null;
          updated_at: string;
          updated_by_id: string | null;
          vat_amount: number | null;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          created_by_id?: string | null;
          customer_id: string;
          delivery_charge?: number | null;
          delivery_zone_id: string;
          due_amount?: number | null;
          grand_total_amount?: number | null;
          id?: string;
          is_active?: boolean;
          is_draft?: boolean;
          note?: string | null;
          pay_amount?: number | null;
          payment_method_id?: string | null;
          payment_reference?: string | null;
          payment_status?: string | null;
          products?: Json | null;
          redeem_amount?: number | null;
          round_off_amount?: number | null;
          status?: string | null;
          sub_total_amount?: number | null;
          tax_amount?: number | null;
          updated_at?: string;
          updated_by_id?: string | null;
          vat_amount?: number | null;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          created_by_id?: string | null;
          customer_id?: string;
          delivery_charge?: number | null;
          delivery_zone_id?: string;
          due_amount?: number | null;
          grand_total_amount?: number | null;
          id?: string;
          is_active?: boolean;
          is_draft?: boolean;
          note?: string | null;
          pay_amount?: number | null;
          payment_method_id?: string | null;
          payment_reference?: string | null;
          payment_status?: string | null;
          products?: Json | null;
          redeem_amount?: number | null;
          round_off_amount?: number | null;
          status?: string | null;
          sub_total_amount?: number | null;
          tax_amount?: number | null;
          updated_at?: string;
          updated_by_id?: string | null;
          vat_amount?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_delivery_zone_id_fkey';
            columns: ['delivery_zone_id'];
            isOneToOne: false;
            referencedRelation: 'delivery_zones';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_payment_method_id_fkey';
            columns: ['payment_method_id'];
            isOneToOne: false;
            referencedRelation: 'payment_methods';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_updated_by_id_fkey';
            columns: ['updated_by_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      pages: {
        Row: {
          content: string | null;
          created_at: string;
          id: string;
          is_active: boolean;
          type: string;
          updated_at: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          type: string;
          updated_at?: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payment_methods: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image: string | null;
          is_active: boolean;
          is_default: boolean;
          name: string;
          reference_type: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image?: string | null;
          is_active?: boolean;
          is_default?: boolean;
          name: string;
          reference_type: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image?: string | null;
          is_active?: boolean;
          is_default?: boolean;
          name?: string;
          reference_type?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      permission_types: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          permission_type_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          permission_type_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          permission_type_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'permissions_permission_type_id_fkey';
            columns: ['permission_type_id'];
            isOneToOne: false;
            referencedRelation: 'permission_types';
            referencedColumns: ['id'];
          },
        ];
      };
      product_categories: {
        Row: {
          category_id: string;
          created_at: string;
          id: string;
          is_active: boolean;
          product_id: string;
          updated_at: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          product_id: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          product_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_categories_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_categories_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      product_variations: {
        Row: {
          color: string | null;
          cost_price: number;
          created_at: string;
          discount: Json | null;
          exp: string | null;
          id: string;
          is_active: boolean;
          mfg: string | null;
          product_id: string;
          quantity: number;
          sale_price: number;
          size: string | null;
          updated_at: string;
          weight: string | null;
        };
        Insert: {
          color?: string | null;
          cost_price?: number;
          created_at?: string;
          discount?: Json | null;
          exp?: string | null;
          id?: string;
          is_active?: boolean;
          mfg?: string | null;
          product_id: string;
          quantity: number;
          sale_price?: number;
          size?: string | null;
          updated_at?: string;
          weight?: string | null;
        };
        Update: {
          color?: string | null;
          cost_price?: number;
          created_at?: string;
          discount?: Json | null;
          exp?: string | null;
          id?: string;
          is_active?: boolean;
          mfg?: string | null;
          product_id?: string;
          quantity?: number;
          sale_price?: number;
          size?: string | null;
          updated_at?: string;
          weight?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_variations_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          created_at: string;
          description: string | null;
          dosage_form_id: string | null;
          durability: string;
          generic_id: string | null;
          id: string;
          images: Json | null;
          is_active: boolean;
          is_recommend: boolean;
          medicine_type: string | null;
          name: string;
          quantity: number;
          rack: string | null;
          slug: string;
          specification: string | null;
          supplier_id: string | null;
          type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          dosage_form_id?: string | null;
          durability: string;
          generic_id?: string | null;
          id?: string;
          images?: Json | null;
          is_active?: boolean;
          is_recommend?: boolean;
          medicine_type?: string | null;
          name: string;
          quantity?: number;
          rack?: string | null;
          slug: string;
          specification?: string | null;
          supplier_id?: string | null;
          type: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          dosage_form_id?: string | null;
          durability?: string;
          generic_id?: string | null;
          id?: string;
          images?: Json | null;
          is_active?: boolean;
          is_recommend?: boolean;
          medicine_type?: string | null;
          name?: string;
          quantity?: number;
          rack?: string | null;
          slug?: string;
          specification?: string | null;
          supplier_id?: string | null;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_dosage_form_id_fkey';
            columns: ['dosage_form_id'];
            isOneToOne: false;
            referencedRelation: 'dosage_forms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'products_generic_id_fkey';
            columns: ['generic_id'];
            isOneToOne: false;
            referencedRelation: 'generics';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'products_supplier_id_fkey';
            columns: ['supplier_id'];
            isOneToOne: false;
            referencedRelation: 'suppliers';
            referencedColumns: ['id'];
          },
        ];
      };
      reviews: {
        Row: {
          comment: string;
          created_at: string;
          id: string;
          image: string | null;
          is_active: boolean;
          product_id: string | null;
          rate: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          comment: string;
          created_at?: string;
          id?: string;
          image?: string | null;
          is_active?: boolean;
          product_id?: string | null;
          rate: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          comment?: string;
          created_at?: string;
          id?: string;
          image?: string | null;
          is_active?: boolean;
          product_id?: string | null;
          rate?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      role_permissions: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          permission_id: string;
          role_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          permission_id: string;
          role_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          permission_id?: string;
          role_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_permissions_permission_id_fkey';
            columns: ['permission_id'];
            isOneToOne: false;
            referencedRelation: 'permissions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'role_permissions_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
      roles: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          created_at: string;
          email: Json | null;
          id: string;
          identity: Json | null;
          is_active: boolean;
          s3: Json | null;
          sms: Json | null;
          tax: Json | null;
          tracking_codes: Json | null;
          updated_at: string;
          vat: Json | null;
        };
        Insert: {
          created_at?: string;
          email?: Json | null;
          id?: string;
          identity?: Json | null;
          is_active?: boolean;
          s3?: Json | null;
          sms?: Json | null;
          tax?: Json | null;
          tracking_codes?: Json | null;
          updated_at?: string;
          vat?: Json | null;
        };
        Update: {
          created_at?: string;
          email?: Json | null;
          id?: string;
          identity?: Json | null;
          is_active?: boolean;
          s3?: Json | null;
          sms?: Json | null;
          tax?: Json | null;
          tracking_codes?: Json | null;
          updated_at?: string;
          vat?: Json | null;
        };
        Relationships: [];
      };
      suppliers: {
        Row: {
          address: string | null;
          created_at: string;
          email: string | null;
          id: string;
          is_active: boolean;
          name: string;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          amount: number;
          code: string;
          created_at: string;
          created_by_id: string | null;
          id: string;
          is_active: boolean;
          note: string | null;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          code: string;
          created_at?: string;
          created_by_id?: string | null;
          id?: string;
          is_active?: boolean;
          note?: string | null;
          type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          code?: string;
          created_at?: string;
          created_by_id?: string | null;
          id?: string;
          is_active?: boolean;
          note?: string | null;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          role_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          role_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          role_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_roles_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_roles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          is_active: boolean;
          is_admin: boolean;
          is_default_customer: boolean;
          is_system_generated: boolean;
          is_verified: boolean;
          name: string;
          password: string | null;
          phone: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          is_admin?: boolean;
          is_default_customer?: boolean;
          is_system_generated?: boolean;
          is_verified?: boolean;
          name: string;
          password?: string | null;
          phone: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          is_admin?: boolean;
          is_default_customer?: boolean;
          is_system_generated?: boolean;
          is_verified?: boolean;
          name?: string;
          password?: string | null;
          phone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users_info: {
        Row: {
          balance: number | null;
          birthday: string | null;
          blood_group: string | null;
          created_at: string;
          id: string;
          is_active: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          balance?: number | null;
          birthday?: string | null;
          blood_group?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          balance?: number | null;
          birthday?: string | null;
          blood_group?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'users_info_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      settings_view: {
        Row: {
          created_at: string | null;
          id: string | null;
          identity: Json | null;
          is_active: boolean | null;
          tax: Json | null;
          tracking_codes: Json | null;
          updated_at: string | null;
          vat: Json | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string | null;
          identity?: Json | null;
          is_active?: boolean | null;
          tax?: Json | null;
          tracking_codes?: Json | null;
          updated_at?: string | null;
          vat?: Json | null;
        };
        Update: {
          created_at?: string | null;
          id?: string | null;
          identity?: Json | null;
          is_active?: boolean | null;
          tax?: Json | null;
          tracking_codes?: Json | null;
          updated_at?: string | null;
          vat?: Json | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      create_multiple_permission_mappings: {
        Args: { source_permissions: string[]; target_permission: string };
        Returns: undefined;
      };
      create_permission_dependency_policy: {
        Args: {
          actions: string[];
          dependent_permissions: string[];
          table_name: string;
        };
        Returns: undefined;
      };
      create_permission_mapping: {
        Args: { source_permission: string; target_permission: string };
        Returns: undefined;
      };
      create_table_permissions: {
        Args: {
          permission_actions?: string[];
          permission_type_name: string;
          table_name: string;
        };
        Returns: undefined;
      };
      create_table_rls_policies: {
        Args: {
          dependent_permissions?: string[];
          id_column?: string;
          permission_prefix?: string;
          table_name: string;
        };
        Returns: undefined;
      };
      current_user_has_permission: {
        Args: { permission_name: string };
        Returns: boolean;
      };
      current_user_has_permission_with_dependencies: {
        Args: { dependent_permissions?: string[]; permission_name: string };
        Returns: boolean;
      };
      current_user_is_super_admin: { Args: never; Returns: boolean };
      get_current_user_id: { Args: never; Returns: string };
      get_expired_products: {
        Args: never;
        Returns: {
          created_at: string;
          description: string | null;
          dosage_form_id: string | null;
          durability: string;
          generic_id: string | null;
          id: string;
          images: Json | null;
          is_active: boolean;
          is_recommend: boolean;
          medicine_type: string | null;
          name: string;
          quantity: number;
          rack: string | null;
          slug: string;
          specification: string | null;
          supplier_id: string | null;
          type: string;
          updated_at: string;
        }[];
        SetofOptions: {
          from: '*';
          to: 'products';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_non_expired_products: {
        Args: never;
        Returns: {
          created_at: string;
          description: string | null;
          dosage_form_id: string | null;
          durability: string;
          generic_id: string | null;
          id: string;
          images: Json | null;
          is_active: boolean;
          is_recommend: boolean;
          medicine_type: string | null;
          name: string;
          quantity: number;
          rack: string | null;
          slug: string;
          specification: string | null;
          supplier_id: string | null;
          type: string;
          updated_at: string;
        }[];
        SetofOptions: {
          from: '*';
          to: 'products';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      setup_table_security: {
        Args: {
          dependent_permissions?: string[];
          id_column?: string;
          permission_actions?: string[];
          permission_prefix?: string;
          permission_type_name: string;
          table_name: string;
        };
        Returns: undefined;
      };
      user_has_permission: {
        Args: { permission_name: string; user_uuid: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
