// pages/api/products/delete-product.ts
import { supabase } from '../../../lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkUserRole } from '../../api/utils/checkRole';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Only DELETE requests are allowed' });
  }

  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ message: 'Missing user_id or product_id' });
  }

  // Jogosultság ellenőrzése
  const hasPermission = await checkUserRole(user_id, ['admin', 'sales_manager']);

  if (!hasPermission) {
    return res.status(403).json({ message: 'You do not have permission to delete products.' });
  }

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product_id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
}
