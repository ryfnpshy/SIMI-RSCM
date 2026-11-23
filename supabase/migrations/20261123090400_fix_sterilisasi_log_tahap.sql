-- Perbaikan: tahap akhir siklus CSSD 'terdistribusi' tidak boleh tersimpan di
-- sterilisasi_log karena CHECK constraint-nya belum memuat nilai itu, sehingga
-- api_majukan_batch selalu gagal (23514) saat memajukan batch ke terdistribusi.
-- Idempoten: aman dijalankan ulang.

alter table public.sterilisasi_log drop constraint if exists sterilisasi_log_tahap_check;
alter table public.sterilisasi_log add constraint sterilisasi_log_tahap_check check (tahap = any (array[
  'penerimaan_kotor', 'pencucian', 'pengemasan',
  'sterilisasi', 'pendinginan', 'penyimpanan', 'terdistribusi'
]::text[]));
