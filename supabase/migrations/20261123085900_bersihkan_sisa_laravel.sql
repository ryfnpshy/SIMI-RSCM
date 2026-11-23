-- ============================================================================
-- SIMI-RSCM :: 00 bersihkan sisa skeleton Laravel
-- Project Supabase ini sebelumnya pernah dipakai `php artisan migrate` (tabel
-- default Laravel, satu baris "Test User"). Tidak ada tabel domain di dalamnya.
-- Dihapus supaya public dipakai penuh oleh SIMI-RSCM.
-- Aman diulang: semua pakai if exists.
-- ============================================================================

drop table if exists
  public.failed_jobs,
  public.job_batches,
  public.jobs,
  public.cache_locks,
  public.cache,
  public.sessions,
  public.password_reset_tokens,
  public.migrations,
  public.users
cascade;