import { supabase } from './supabase';

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })

  if (error) {
    return error;
  }

  return data
}

export const signInWithMicrosoft = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'openid profile email', // Include required scopes
    },
  });

  if (error) {
    return error;
  }

  return data;
};

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin + '/home'
    }
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  console.log('signOut error:', error);
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user || null;
}

export async function ensureAuthenticated() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;

  if (!session) {
    throw new Error('Authentication required');
  }

  return session.user;
}

export async function handleAuthStateChange(callback: (user: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      callback(session?.user || null);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });

  return () => subscription.unsubscribe();
}