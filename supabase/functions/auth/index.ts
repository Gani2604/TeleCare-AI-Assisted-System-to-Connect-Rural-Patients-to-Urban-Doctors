
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { method } = req
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )

  // Get the user if they exist
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  if (method === 'POST') {
    try {
      const { action, email, password, name, role } = await req.json()
      
      if (action === 'signup') {
        const { data, error } = await supabaseClient.auth.signUp({
          email, 
          password,
          options: {
            data: {
              name,
              role
            }
          }
        })
        
        if (error) throw error
        
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
          status: 201
        })
      } else if (action === 'login') {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        })
      } else {
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        })
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      })
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 405
  })
})
