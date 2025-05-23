
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
    // Get appointment ID from URL if present
    const url = new URL(req.url)
    const appointmentId = url.searchParams.get('id')
    const status = url.searchParams.get('status') || 'all'
    
    if (appointmentId) {
      // Get specific appointment
      const { data, error } = await supabaseClient
        .from('appointments')
        .select('*, doctor:doctor_id(*), patient:patient_id(*)')
        .eq('id', appointmentId)
        .single()
      
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        })
      }
      
      // Check if user has access to this appointment
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
      // Get all appointments for the user based on role
      let query = supabaseClient
        .from('appointments')
        .select('*, doctor:doctor_id(*), patient:patient_id(*)')
      
      if (userRole === 'doctor') {
        query = query.eq('doctor_id', user.id)
      } else if (userRole === 'patient') {
        query = query.eq('patient_id', user.id)
      }
      
      if (status !== 'all') {
        query = query.eq('status', status)
      }
      
      const { data, error } = await query.order('date', { ascending: true })
      
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
    try {
      const { doctorId, date, time, type, reason, symptoms } = await req.json()
      
      // Insert appointment
      const { data, error } = await supabaseClient
        .from('appointments')
        .insert({
          doctor_id: doctorId,
          patient_id: user.id,
          date,
          time,
          type,
          reason,
          symptoms,
          status: 'confirmed',
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
  } else if (method === 'PATCH') {
    try {
      const { id, status } = await req.json()
      
      // Get the appointment to check permissions
      const { data: appointment, error: fetchError } = await supabaseClient
        .from('appointments')
        .select('doctor_id, patient_id')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      
      // Check if user has permission to update this appointment
      if (userRole === 'doctor' && appointment.doctor_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 403,
        })
      } else if (userRole === 'patient' && appointment.patient_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 403,
        })
      }
      
      // Update appointment status
      const { data, error } = await supabaseClient
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
      
      if (error) throw error
      
      return new Response(JSON.stringify(data[0]), {
        headers: { 'Content-Type': 'application/json' },
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
