import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class AdminService {
  constructor(private supabase: SupabaseService) {}

  async getStats() {
    const client = this.supabase.getClient();

    const { count: destinations } = await client
      .from('destinations').select('*', { count: 'exact' }).eq('status', 'PUBLISHED');

    const { count: pendingBookings } = await client
      .from('bookings').select('*', { count: 'exact' }).eq('status', 'PENDING');

    const { data: payments } = await client
      .from('payments').select('amount').eq('status', 'SUCCESS');

    const revenue = (payments || []).reduce((sum, p) => sum + p.amount, 0);

    const { count: users } = await client
      .from('users').select('*', { count: 'exact' });

    return {
      data: { destinations, pendingBookings, revenue, users },
      message: 'Statistiques récupérées',
    };
  }

  async getUsers() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('users').select('id, name, email, role, avatar, phone, created_at')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, message: 'Utilisateurs récupérés' };
  }

  async updateUserRole(userId: string, role: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('users').update({ role }).eq('id', userId)
      .select('id, email, role').single();

    if (error) throw new Error(error.message);
    return { data, message: `Rôle mis à jour : ${role}` };
  }
}
