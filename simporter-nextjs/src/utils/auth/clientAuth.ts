import { createClient } from '../supabase/client'

interface SignUpResponse {
    data: any;
    error: { message: string } | null;
}

export const signUp = async (email: string, password: string): Promise<any> => {
    const supabase = createClient()

    const { data, error }: SignUpResponse = await supabase.auth.signUp({
        email: email,
        password: password,
      })
      
    if (error) {
        throw new Error(error.message)
    }
    return data
}

export const signIn = async (email: string, password: string) => {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message)
  }

  return null
};

export const sendForgotPasswordRequest = async (email: string) => {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/auth/update-password',
  })

  if (error) {
    throw new Error(error.message)
  }

  return null
}

export const updatePassword = async (password: string) => {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw new Error(error.message)
  }

  return null
}


export const isUserLoggedIn = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.getUser();

  if (error) {
    return false;
  }

  return true;
};