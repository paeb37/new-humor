'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

const IMAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET ||
  process.env.SUPABASE_IMAGE_BUCKET ||
  'images'

async function resolveImageUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  existingUrl?: string | null
) {
  const uploadedFile = formData.get('image_file')

  if (uploadedFile instanceof File && uploadedFile.size > 0) {
    const extension = uploadedFile.name.split('.').pop() || 'bin'
    const filePath = `admin/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(filePath, uploadedFile, {
        contentType: uploadedFile.type || undefined,
      })

    if (uploadError) {
      return { error: uploadError.message }
    }

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filePath)
    return { url: data.publicUrl }
  }

  const url = (formData.get('url') as string | null)?.trim()

  if (url) {
    return { url }
  }

  if (existingUrl) {
    return { url: existingUrl }
  }

  return { error: 'Provide an image URL or upload a file.' }
}

export async function createImage(formData: FormData) {
  const supabase = await createClient()

  const description = formData.get('description') as string
  const isPublic = formData.get('is_public') === 'true'
  const isCommonUse = formData.get('is_common_use') === 'true'

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const imageSource = await resolveImageUrl(supabase, formData)
  if (imageSource.error) {
    return { error: imageSource.error }
  }

  const { data, error } = await supabase
    .from('images')
    .insert({
      url: imageSource.url,
      image_description: description,
      is_public: isPublic,
      is_common_use: isCommonUse,
      profile_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/images')
  return { success: true, data }
}

export async function updateImage(imageId: string, formData: FormData) {
  const supabase = await createClient()

  const description = formData.get('description') as string
  const isPublic = formData.get('is_public') === 'true'
  const isCommonUse = formData.get('is_common_use') === 'true'

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: existingImage, error: existingImageError } = await supabase
    .from('images')
    .select('url')
    .eq('id', imageId)
    .single()

  if (existingImageError) {
    return { error: existingImageError.message }
  }

  const imageSource = await resolveImageUrl(supabase, formData, existingImage.url)
  if (imageSource.error) {
    return { error: imageSource.error }
  }

  const { data, error } = await supabase
    .from('images')
    .update({
      url: imageSource.url,
      image_description: description,
      is_public: isPublic,
      is_common_use: isCommonUse,
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq('id', imageId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/images')
  return { success: true, data }
}

export async function deleteImage(imageId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('images').delete().eq('id', imageId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/images')
  return { success: true }
}
