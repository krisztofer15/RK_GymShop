import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytydvrluotcuprnjrghj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0eWR2cmx1b3RjdXBybmpyZ2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNjk1MTgsImV4cCI6MjA1MTk0NTUxOH0.w3bk1iNo2gXuqxwW1wRGpCcnzKujj44SdrZtl-RnhJI';

export const supabase = createClient(supabaseUrl, supabaseKey);
