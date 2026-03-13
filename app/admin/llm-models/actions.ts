'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createModel(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string
  const llm_provider_id = parseInt(formData.get('llm_provider_id') as string)
  const provider_model_id = formData.get('provider_model_id') as string
  const is_temperature_supported = formData.get('is_temperature_supported') === 'true'

  const { error } = await supabase.from('llm_models').insert({
    name,
    llm_provider_id,
    provider_model_id,
    is_temperature_supported,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/llm-models')
  return { success: true }
}

export async function updateModel(id: number, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string
  const llm_provider_id = parseInt(formData.get('llm_provider_id') as string)
  const provider_model_id = formData.get('provider_model_id') as string
  const is_temperature_supported = formData.get('is_temperature_supported') === 'true'

  const { error } = await supabase
    .from('llm_models')
    .update({
      name,
      llm_provider_id,
      provider_model_id,
      is_temperature_supported,
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/llm-models')
  return { success: true }
}

export async function deleteModel(id: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('llm_models').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/llm-models')
  return { success: true }
}
