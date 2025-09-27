import { supabase } from './supabase';

// Example database operations
export const database = {
  // Example: Get all posts
  async getPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Example: Create a new post
  async createPost(title: string, content: string, author_id: string) {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          content,
          author_id,
          created_at: new Date().toISOString(),
        }
      ])
      .select();
    return { data, error };
  },

  // Example: Update a post
  async updatePost(id: string, updates: { title?: string; content?: string }) {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Example: Delete a post
  async deletePost(id: string) {
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    return { data, error };
  },

  // Example: Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Example: Update user profile
  async updateUserProfile(userId: string, updates: { name?: string; bio?: string; avatar_url?: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    return { data, error };
  }
};
