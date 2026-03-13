'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDomain(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const apex_domain = formData.get('apex_domain') as string

  const { error } = await supabase.from('allowed_signup_domains').insert({ apex_domain })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/allowed-domains')
  return { success: true }
}

export async function updateDomain(id: number, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const apex_domain = formData.get('apex_domain') as string

  const { error } = await supabase
    .from('allowed_signup_domains')
    .update({
      apex_domain,
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/allowed-domains')
  return { success: true }
}

export async function deleteDomain(id: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('allowed_signup_domains').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/allowed-domains')
  return { success: true }
}
