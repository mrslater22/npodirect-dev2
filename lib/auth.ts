import { supabase } from './db';

export type UserRole = 'NONPROFIT' | 'SUPPORTER' | 'SPONSOR';

interface CreateUserParams {
  email: string;
  name: string;
  image?: string;
  emailVerified?: boolean;
}

export async function createUser(params: CreateUserParams) {
  const { data: user, error } = await supabase
    .from('users')
    .insert([{
      email: params.email,
      name: params.name,
      image: params.image,
      email_verified: params.emailVerified,
    }])
    .select()
    .single();

  if (error) throw error;
  return user;
}

export async function getUserByEmail(email: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*, user_roles(*)')
    .eq('email', email)
    .single();

  if (error) return null;
  return user;
}

export async function updateUserRoles(userId: string, roles: UserRole[]) {
  const { error: deleteError } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  if (roles.length > 0) {
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert(
        roles.map(role => ({
          user_id: userId,
          role: role
        }))
      );

    if (insertError) throw insertError;
  }

  return { success: true };
}