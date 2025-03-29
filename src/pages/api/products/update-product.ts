import { supabase } from '../../../lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkUserRole } from '../../api/utils/checkRole';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
      return res.status(405).json({ message: 'Only PUT requests are allowed' });
    }
  
    const { user_id, product_id, name, price, description, image, category_id } = req.body;
  
    // Ellenőrzés
    if (!user_id || !product_id || !name || !price || !description || !image || !category_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Jogosultság ellenőrzése
    const hasPermission = await checkUserRole(user_id, ['admin', 'sales_manager']);
  
    if (!hasPermission) {
      return res.status(403).json({ message: 'You do not have permission to update products.' });
    }
  
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name,
          price,
          description,
          image,
          category_id,
        })
        .eq('id', product_id);
  
      if (error) {
        return res.status(500).json({ message: 'Error updating product', error: error.message });
      }
  
      return res.status(200).json({ message: 'Product updated successfully' });
    } catch (err) {
      return res.status(500).json({ message: 'Unexpected error occurred' });
    }
}