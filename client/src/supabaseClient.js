import { createClient } from '@supabase/supabase-js'

// Yahan apni Supabase ki details dalein
// Yeh aapko Supabase Dashboard -> Project Settings -> API mein milengi
const supabaseUrl = 'https://elmnecniaeypahgwetpc.supabase.co'
const supabaseKey = 'sb_publishable_DQkjnSNXrt5Gzm-0-CgfJQ_-77LJx-w'

export const supabase = createClient(supabaseUrl, supabaseKey)