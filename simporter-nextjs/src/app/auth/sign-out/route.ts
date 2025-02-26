import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const POST = async () => {
  const supabase = await createClient();

  // Sign out logic here
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ message: 'Sign out failed', error }, { status: 500 });
  }

  // return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
  return NextResponse.redirect('/');
};

export const GET = async () => {
  const supabase = await createClient();

  // Sign out logic here
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ message: 'Sign out failed', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
};

export const signOut = async () => {
  const supabase = await createClient();

  // Sign out logic here
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { message: 'Sign out failed', error };
  }

  return { message: 'Signed out successfully' };
}