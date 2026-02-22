import { supabase } from '../supabase/client';
import { Pattern } from '../types';

interface PatternResponse {
  patterns: Pattern[];
  totalCount: number;
}

interface UploadUrlResponse {
  url: string;
  key: string;
}

interface DownloadUrlResponse {
  url: string;
}

interface ToggleLikeResponse {
  id: string;
  likes_count: number;
}

async function callR2Function(body: Record<string, string>): Promise<any> {
  const { data, error } = await supabase.functions.invoke('r2-storage', {
    body,
  });
  if (error) throw error;
  return data;
}

export async function fetchPatterns(
  limit: number,
  offset: number,
  orderBy: string,
  userId?: string | null
): Promise<PatternResponse> {
  const { data, error } = await supabase.rpc('get_patterns', {
    p_limit: limit,
    p_offset: offset,
    p_order_by: orderBy,
    p_user_id: userId || null,
  });
  if (error) throw error;
  return data as PatternResponse;
}

export async function fetchUserPatterns(
  userId: string,
  limit: number,
  offset: number,
  orderBy: string
): Promise<PatternResponse> {
  const { data, error } = await supabase.rpc('get_user_patterns', {
    p_user_id: userId,
    p_limit: limit,
    p_offset: offset,
    p_order_by: orderBy,
  });
  if (error) throw error;
  return data as PatternResponse;
}

export async function fetchLikedPatterns(
  userId: string,
  limit: number,
  offset: number,
  orderBy: string
): Promise<PatternResponse> {
  const { data, error } = await supabase.rpc('get_liked_patterns', {
    p_user_id: userId,
    p_limit: limit,
    p_offset: offset,
    p_order_by: orderBy,
  });
  if (error) throw error;
  return data as PatternResponse;
}

export async function toggleLike(
  patternId: string,
  userId: string
): Promise<ToggleLikeResponse> {
  const { data, error } = await supabase.rpc('toggle_like', {
    p_pattern_id: patternId,
    p_user_id: userId,
  });
  if (error) throw error;
  return data as ToggleLikeResponse;
}

export async function createPattern(input: {
  name: string;
  description: string;
  storage_key: string;
  creator_id: string;
  creator_display_name: string;
}): Promise<Pattern> {
  const { data, error } = await supabase
    .from('patterns')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Pattern;
}

export async function deletePattern(patternId: string): Promise<void> {
  // Get the storage key before deleting
  const { data: pattern, error: fetchError } = await supabase
    .from('patterns')
    .select('storage_key')
    .eq('id', patternId)
    .single();
  if (fetchError) throw fetchError;

  // Delete from database (cascade deletes likes)
  const { error: deleteError } = await supabase
    .from('patterns')
    .delete()
    .eq('id', patternId);
  if (deleteError) throw deleteError;

  // Delete from R2 (best effort)
  try {
    await callR2Function({ action: 'delete', key: pattern.storage_key });
  } catch (err) {
    console.error('R2 deletion failed:', err);
  }
}

export async function getUploadUrl(
  filename: string,
  folder: string
): Promise<UploadUrlResponse> {
  return callR2Function({ action: 'upload', filename, folder });
}

export async function getDownloadUrl(
  storageKey: string
): Promise<DownloadUrlResponse> {
  return callR2Function({ action: 'download', key: storageKey });
}
