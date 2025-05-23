
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

  if (method === 'GET') {
    // Get document type from URL
    const url = new URL(req.url)
    const documentType = url.searchParams.get('type') || 'all'
    
    let query = supabaseClient
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
    
    if (documentType !== 'all') {
      query = query.eq('document_type', documentType)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } else if (method === 'POST') {
    try {
      const { name, documentType, fileName, fileSize, fileType, category } = await req.json()
      
      // Insert document metadata
      const { data, error } = await supabaseClient
        .from('documents')
        .insert({
          name,
          document_type: documentType,
          file_name: fileName,
          file_size: fileSize,
          file_type: fileType,
          category,
          user_id: user.id,
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
  } else if (method === 'DELETE') {
    try {
      const { id } = await req.json()
      
      // Delete document
      const { error } = await supabaseClient
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      return new Response(JSON.stringify({ success: true }), {
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
