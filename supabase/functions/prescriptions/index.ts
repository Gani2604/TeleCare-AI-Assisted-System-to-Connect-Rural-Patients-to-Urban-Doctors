
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

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 401,
    })
  }
  
  // Get user role from metadata
  const userRole = user.user_metadata?.role
  
  if (method === 'GET') {
    // Get prescription ID from URL if present
    const url = new URL(req.url)
    const prescriptionId = url.searchParams.get('id')
    
    if (prescriptionId) {
      // Get specific prescription
      const { data, error } = await supabaseClient
        .from('prescriptions')
        .select('*, doctor:doctor_id(*), patient:patient_id(*)')
        .eq('id', prescriptionId)
        .single()
      
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        })
      }
      
      // Check if user has access to this prescription
      if (userRole === 'doctor' && data.doctor_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 403,
        })
      } else if (userRole === 'patient' && data.patient_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 403,
        })
      }
      
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      // Get all prescriptions for the user based on role
      let query = supabaseClient
        .from('prescriptions')
        .select('*, doctor:doctor_id(*), patient:patient_id(*)')
      
      if (userRole === 'doctor') {
        query = query.eq('doctor_id', user.id)
      } else if (userRole === 'patient') {
        query = query.eq('patient_id', user.id)
      }
      
      const { data, error } = await query.order('issue_date', { ascending: false })
      
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        })
      }
      
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } else if (method === 'POST') {
    // Only doctors can create prescriptions
    if (userRole !== 'doctor') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 403,
      })
    }
    
    try {
      const { patientId, medications, notes, followUpDate } = await req.json()
      
      // Insert prescription
      const { data, error } = await supabaseClient
        .from('prescriptions')
        .insert({
          patient_id: patientId,
          doctor_id: user.id,
          medications,
          notes,
          follow_up_date: followUpDate,
          issue_date: new Date().toISOString().split('T')[0],
        })
        .select()
      
      if (error) throw error
      
      return new Response(JSON.stringify(data[0]), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 405,
  })
})
