import { createClient } from '@supabase/supabase-js'

// Supabase 项目配置
const supabaseUrl = 'https://lsaisfboboyiqanywydt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzYWlzZmJvYm95aXFhbnl3eWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0Njk5OTgsImV4cCI6MjA5ODA0NTk5OH0.F3CpP5lrkJVIUuQgBzjmBX7difP8aY7XHY5y4pTT7QA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
