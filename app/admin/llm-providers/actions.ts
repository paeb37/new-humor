'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProvider(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string

  const { error } = await supabase.from('llm_providers').insert({ name })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/llm-providers')
  return { success: true }
}

export async function updateProvider(id: number, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string

  const { error } = await supabase
    .from('llm_providers')
    .update({
      name,
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/llm-providers')
  return { success: true }
}

export async function deleteProvider(id: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('llm_providers').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/llm-providers')
  return { success: true }
}
