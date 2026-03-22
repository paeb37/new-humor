'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTerm(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const term = formData.get('term') as string
  const definition = formData.get('definition') as string
  const example = formData.get('example') as string
  const priority = parseInt(formData.get('priority') as string, 10)
  const term_type_idRaw = formData.get('term_type_id') as string
  const term_type_idParsed = parseInt(term_type_idRaw ?? '', 10)
  const term_type_id =
    term_type_idRaw === '' || term_type_idRaw === null || isNaN(term_type_idParsed)
      ? null
      : term_type_idParsed

  const { error } = await supabase.from('terms').insert({
    term,
    definition,
    example,
    priority,
    term_type_id,
    created_by_user_id: user.id,
    modified_by_user_id: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/terms')
  return { success: true }
}

export async function updateTerm(id: number, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const term = formData.get('term') as string
  const definition = formData.get('definition') as string
  const example = formData.get('example') as string
  const priority = parseInt(formData.get('priority') as string, 10)
  const term_type_idRaw = formData.get('term_type_id') as string
  const term_type_idParsed = parseInt(term_type_idRaw ?? '', 10)
  const term_type_id =
    term_type_idRaw === '' || term_type_idRaw === null || isNaN(term_type_idParsed)
      ? null
      : term_type_idParsed

  const { error } = await supabase
    .from('terms')
    .update({
      term,
      definition,
      example,
      priority,
      term_type_id,
      modified_by_user_id: user.id,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/terms')
  return { success: true }
}

export async function deleteTerm(id: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('terms').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/terms')
  return { success: true }
}
