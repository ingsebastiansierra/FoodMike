import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://twyzwzagzzimbkblgpes.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eXp3emFnenppbWJrYmxncGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNDY2MDAsImV4cCI6MjA3MTkyMjYwMH0.SFN2mGlTUSRCKX23nF-b6srVEgER9STXXlg1N7jusNo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    }
})
