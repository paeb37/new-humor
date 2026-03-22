'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCaptionExample(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const image_description = formData.get('image_description') as string
  const caption = formData.get('caption') as string
  const explanation = formData.get('explanation') as string
  const priority = parseInt(formData.get('priority') as string, 10) || 0
  const image_idRaw = formData.get('image_id') as string
  const image_id = image_idRaw?.trim() || null

  const { error } = await supabase.from('caption_examples').insert({
    image_description,
    caption,
    explanation,
    priority,
    image_id,
    created_by_user_id: user.id,
    modified_by_user_id: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/caption-examples')
  return { success: true }
}

export async function updateCaptionExample(id: number, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const image_description = formData.get('image_description') as string
  const caption = formData.get('caption') as string
  const explanation = formData.get('explanation') as string
  const priority = parseInt(formData.get('priority') as string, 10) || 0
  const image_idRaw = formData.get('image_id') as string
  const image_id = image_idRaw?.trim() || null

  const { error } = await supabase
    .from('caption_examples')
    .update({
      image_description,
      caption,
      explanation,
      priority,
      image_id,
      modified_by_user_id: user.id,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/caption-examples')
  return { success: true }
}

export async function deleteCaptionExample(id: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('caption_examples').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/caption-examples')
  return { success: true }
}
