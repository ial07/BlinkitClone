import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient | null = null;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;

    if (url && key && url !== 'https://your-project-id.supabase.co') {
      // Polyfill WebSocket for Node.js < 22 if not present
      if (typeof global.WebSocket === 'undefined') {
        (global as any).WebSocket = ws;
      }
      this.client = createClient(url, key);
      console.log('✅ Supabase client initialized');
    } else {
      console.log('ℹ️  Supabase not configured — using in-memory/JSON fallback');
    }
  }

  getClient(): SupabaseClient | null {
    return this.client;
  }

  isConnected(): boolean {
    return this.client !== null;
  }
}
