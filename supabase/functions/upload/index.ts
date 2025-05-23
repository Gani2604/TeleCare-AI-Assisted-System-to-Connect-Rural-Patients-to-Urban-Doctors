
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    })
  }
  
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

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string
    
    if (!file) {
      throw new Error('No file provided')
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.')
    }
    
    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.')
    }
    
    // Generate a unique filename
    const timestamp = new Date().getTime()
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}_${timestamp}.${fileExt}`
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabaseClient
      .storage
      .from(documentType === 'prescription' ? 'prescriptions' : 'documents')
      .upload(`${user.id}/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    
    // Get the public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from(documentType === 'prescription' ? 'prescriptions' : 'documents')
      .getPublicUrl(`${user.id}/${fileName}`)
    
    return new Response(
      JSON.stringify({
        success: true,
        filePath: data.path,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        publicUrl
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
