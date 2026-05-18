import { supabase } from "./supabaseClient";
import API_BASE_URL from "../config/apiConfig";

export const handleSignUp = async (userEmail: string, userPassword: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: userEmail,
    password: userPassword,
  });
  if (error) {
    console.error(error.message)
    throw new Error(error.message); 
  }

  if (data.user && data.session) {
    const token = data.session.access_token;

    // 2. Call your Express backend to create the row in 'user_profiles'
    await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        id: data.user.id, // Use the ID Supabase just generated
        email: userEmail 
      })
    });
  }

  console.log('User signed up!', data.user);
};

export const handleSignIn = async (userEmail: string, userPassword: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: userPassword,
  });

  if (error) throw new Error(error.message);
  console.log('Logged in successfully! Token:', data.session.access_token);
  return data;
};

// OAuth methods
export const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error(`OAuth sign in error with ${provider}:`, error.message);
    throw new Error(`Failed to sign in with ${provider}: ${error.message}`);
  }

  return data;
};

export const handleOAuthCallback = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('OAuth callback error:', error.message);
    throw new Error(error.message);
  }

  if (session && session.user) {
    const token = session.access_token;
    const user = session.user;

    // Call your Express backend to create the row in 'user_profiles'
    try {
      await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          id: user.id,
          email: user.email 
        })
      });
      console.log('User profile created from OAuth:', user.email);
    } catch (err) {
      console.error('Failed to create user profile:', err);
    }
  }

  return session;
};

export async function getUserData() {
  const {data: {session}, error} = await supabase.auth.getSession();

  if (!session) {
    console.log('User is not logged in!');
    return;
  }

  const token = session.access_token;

  const response = await fetch(`${API_BASE_URL}/api/secure-route`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    }
  });

  const responseData = await response.json();
  return responseData;
}

export async function logOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error signing out:', error);
  else console.log('Signed out successfully');
}