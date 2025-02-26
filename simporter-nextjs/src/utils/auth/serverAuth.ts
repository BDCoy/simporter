'use server'
import { createClient } from '@/utils/supabase/server'
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
  // sign in with google
  console.log("signInWithGoogle called from authmodal")
  const supabase = await createClient()

  const auth_callback_url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
  console.log("auth_callback_url", auth_callback_url)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: auth_callback_url,
    },
  })
  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url)
}

export const signInWithMicrosoft = async () => {
  const supabase = await createClient();
  const authCallbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`; // Ensure this matches your app's callback route
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'openid profile email', // Include required scopes
      redirectTo: authCallbackUrl, // Specify the custom callback route
    },
  });
  

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if (data) {
    redirect(data.url);
  }
};


export const isUserLoggedIn = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return false;
  }

  return true;
};

export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return encodedRedirect("error", "/auth/sign-out", error.message);
  }

  return redirect("/");
}