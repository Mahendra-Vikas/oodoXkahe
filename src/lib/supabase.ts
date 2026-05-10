import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function uploadImage(
  file: File,
  folder: 'covers' | 'avatars' | 'activities' = 'covers'
): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from('traveloop-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('traveloop-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function deleteImage(url: string): Promise<void> {
  const path = url.split('/traveloop-images/')[1]
  if (!path) return
  await supabase.storage.from('traveloop-images').remove([path])
}
