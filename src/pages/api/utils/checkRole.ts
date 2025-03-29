// pages/api/utils/checkRole.ts
import { supabase } from '../../../lib/supabaseClient';

export async function checkUserRole(userId: string, allowedRoles: string[]): Promise<boolean> {
    const { data, error } = await supabase
        .from('user_roles')
        .select('roles (name)')
        .eq('user_id', userId);

    if (error || !data || data.length === 0) return false;

    const userRole = ((data[0].roles as unknown) as { name: string }).name;
    return allowedRoles.includes(userRole);
}
