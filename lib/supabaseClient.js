import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kotszobhtvvferpmjbgp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvdHN6b2JodHZ2ZmVycG1qYmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNjkzMTgsImV4cCI6MjA1NTc0NTMxOH0.AdWUbHNF7I8qLv0j7iZ0mIFA8FvChjJFLas86AdFTQ4'


export const supabase = createClient(supabaseUrl, supabaseAnonKey);