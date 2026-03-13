'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createWhitelistEmail(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const email_address = formData.get('email_address') as string

  const { error } = await supabase
    .from('whitelist_email_addresses')
    .insert({ email_address })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/whitelist-emails')
  return { success: true }
}

export async function updateWhitelistEmail(id: number, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const email_address = formData.get('email_address') as string

  const { error } = await supabase
    .from('whitelist_email_addresses')
    .update({
      email_address,
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/whitelist-emails')
  return { success: true }
}

export async function deleteWhitelistEmail(id: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('whitelist_email_addresses')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/whitelist-emails')
  return { success: true }
}
