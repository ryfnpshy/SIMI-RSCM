-- ============================================================================
-- SIMI-RSCM :: 04 data awal (referensi + demo)
-- Data referensi wajib: peran, unit, matriks transisi status.
-- Data demo: 4 akun (1 per peran), 10 alat, transaksi, 3 batch sterilisasi.
-- Kata sandi demo: Admin123! / Inventori123! / Unit123! / Cssd123!
-- ============================================================================

-- --------------------------------------------------------------- referensi
insert into public.roles (id, nama) values
  ('admin_inventori',    'Admin Inventori'),
  ('petugas_inventori',  'Petugas Inventori'),
  ('petugas_unit_medis', 'Petugas Unit Medis'),
  ('petugas_sterilisasi','Petugas Sterilisasi')
on conflict (id) do update set nama = excluded.nama;

insert into public.units (id, kode, nama, tipe) values
  ('11111111-1111-1111-1111-111111111111', 'GDG',  'Gudang Inventori Sentral', 'gudang'),
  ('22222222-2222-2222-2222-222222222222', 'CSSD', 'Instalasi CSSD',           'cssd'),
  ('33333333-3333-3333-3333-333333333333', 'OK',   'Kamar Bedah Utama',        'unit_medis'),
  ('44444444-4444-4444-4444-444444444444', 'IGD',  'Instalasi Gawat Darurat',  'unit_medis'),
  ('55555555-5555-5555-5555-555555555555', 'ICU',  'Intensive Care Unit',      'unit_medis'),
  ('66666666-6666-6666-6666-666666666666', 'RWI',  'Rawat Inap Melati',        'unit_medis')
on conflict (id) do nothing;

-- matriks transisi status (modul 4.3.5)
insert into public.transisi_status (dari, ke) values
  ('tersedia', 'di_unit'),
  ('tersedia', 'dalam_proses_sterilisasi'),
  ('tersedia', 'perlu_resterilisasi'),
  ('tersedia', 'rusak'),
  ('tersedia', 'dalam_perbaikan'),
  ('di_unit', 'tersedia'),
  ('di_unit', 'dalam_proses_sterilisasi'),
  ('di_unit', 'perlu_resterilisasi'),
  ('di_unit', 'rusak'),
  ('di_unit', 'dalam_perbaikan'),
  ('dalam_proses_sterilisasi', 'tersedia'),
  ('dalam_proses_sterilisasi', 'perlu_resterilisasi'),
  ('dalam_proses_sterilisasi', 'rusak'),
  ('perlu_resterilisasi', 'tersedia'),
  ('perlu_resterilisasi', 'dalam_proses_sterilisasi'),
  ('perlu_resterilisasi', 'rusak'),
  ('perlu_resterilisasi', 'dalam_perbaikan'),
  ('rusak', 'tersedia'),
  ('rusak', 'dalam_perbaikan'),
  ('dalam_perbaikan', 'tersedia'),
  ('dalam_perbaikan', 'rusak')
on conflict do nothing;

-- ------------------------------------------------------- akun demo (auth)
do $$
declare
  r record;
  v_users jsonb := '[
    {"id":"00000000-0000-4000-a000-000000000001","email":"admin@rscm.local","nama":"Ratna Sari, S.Kep","role":"admin_inventori","unit":null,"pass":"Admin123!","nip":"199001012015012001"},
    {"id":"00000000-0000-4000-a000-000000000002","email":"inventori@rscm.local","nama":"Budi Santoso","role":"petugas_inventori","unit":"11111111-1111-1111-1111-111111111111","pass":"Inventori123!","nip":"199203022016021002"},
    {"id":"00000000-0000-4000-a000-000000000003","email":"unit@rscm.local","nama":"Dewi Kartika, A.Md.Kep","role":"petugas_unit_medis","unit":"33333333-3333-3333-3333-333333333333","pass":"Unit123!","nip":"199505052018052003"},
    {"id":"00000000-0000-4000-a000-000000000004","email":"cssd@rscm.local","nama":"Agus Prasetyo","role":"petugas_sterilisasi","unit":"22222222-2222-2222-2222-222222222222","pass":"Cssd123!","nip":"198807072012072004"}
  ]'::jsonb;
begin
  for r in
    select * from jsonb_to_recordset(v_users)
      as x(id uuid, email text, nama text, role text, unit uuid, pass text, nip text)
  loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', r.id, 'authenticated', 'authenticated',
      r.email, extensions.crypt(r.pass, extensions.gen_salt('bf')), now(),
      jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
      jsonb_build_object('nama', r.nama, 'role_id', r.role, 'unit_id', r.unit, 'nip', r.nip),
      now(), now(), '', '', '', ''
    )
    on conflict (id) do nothing;

    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), r.id,
      jsonb_build_object('sub', r.id::text, 'email', r.email),
      'email', r.id::text, now(), now(), now()
    )
    on conflict do nothing;

    -- trigger handle_new_user sudah membuat profil; pastikan peran/status final
    update public.users
       set role_id = r.role,
           unit_id = r.unit,
           status  = 'aktif'
     where id = r.id;
  end loop;
end $$;

-- ------------------------------------------------------------ data alat
insert into public.alat (
  id, kode_unik, nama, kategori, jenis, satuan, merek,
  jumlah_minimum_stok, limit_siklus, masa_simpan_hari, catatan
) values
  ('00000000-0000-4000-8000-000000000001','ALT-BDH-001','Pinset Sirurgis 14cm','Instrumen Bedah','reusable','unit','Aesculap',20,200,30,'Grade medis AISI 420 • bedah umum'),
  ('00000000-0000-4000-8000-000000000002','ALT-STR-014','Autoclave Pouch Set Mayo','Instrumen Sterilisasi','reusable','set',null,5,150,30,'Tray set steril • indikator strip kelas 4'),
  ('00000000-0000-4000-8000-000000000003','ALT-ICU-089','Defibrillator Monitor Biphasic','Peralatan Rawat Intensif','aset','unit','Philips',2,null,365,'Kalibrasi berkala elektromedis'),
  ('00000000-0000-4000-8000-000000000004','ALT-BDH-045','Gunting Jaringan Metzenbaum Curved','Instrumen Bedah','reusable','unit','Aesculap',15,200,30,'Panjang 18cm • ujung tumpul halus'),
  ('00000000-0000-4000-8000-000000000005','ALT-POLI-012','Otoscope Fiber Optic Diagnostic','Perangkat Diagnostik','aset','unit','Heine',5,null,365,'Poli THT • penggantian lampu xenon pending'),
  ('00000000-0000-4000-8000-000000000006','ALT-BDH-077','Klem Hemostatik Pean Lurus 14cm','Instrumen Bedah','reusable','unit','Geister',25,200,30,'Bedah minor & mayor • stainless anti karat'),
  ('00000000-0000-4000-8000-000000000007','ALT-ICU-102','Infusion Pump Terumo SS700','Peralatan Rawat Intensif','aset','unit','Terumo',6,null,365,'Mikro & makro drip • baterai lithium cadangan'),
  ('00000000-0000-4000-8000-000000000008','ALT-STR-003','Kaset Sterilisasi Kaca Optik Laparoscopy','Instrumen Sterilisasi','reusable','set',null,4,50,30,'Segel silicon • dalam uji mutu CSSD'),
  ('00000000-0000-4000-8000-000000000009','ALT-BDH-091','Retractor Langenbeck Set (Pair)','Instrumen Bedah','reusable','set','Martin',8,150,30,'Blade 40x11mm & 30x10mm • ortopedi/umum'),
  ('00000000-0000-4000-8000-000000000010','ALT-BDH-019','Needle Holder Mayo-Hegar 16cm Tungsten','Instrumen Bedah','reusable','unit','Aesculap',20,200,30,'TC gold ring • grip cross-serrated')
on conflict (id) do nothing;

-- ------------------------------------------------------- mapping alias unit
insert into public.alias_alat (alat_id, unit_id, alias) values
  ('00000000-0000-4000-8000-000000000001','33333333-3333-3333-3333-333333333333','Pinset bedah'),
  ('00000000-0000-4000-8000-000000000004','33333333-3333-3333-3333-333333333333','Gunting bedah'),
  ('00000000-0000-4000-8000-000000000007','55555555-5555-5555-5555-555555555555','Infus pump'),
  ('00000000-0000-4000-8000-000000000003','44444444-4444-4444-4444-444444444444','Defib')
on conflict do nothing;

-- ------------------------------------------------- transaksi masuk (UC-06)
-- Nomor eksplisit agar bisa dirujuk di bawah, sequence disetel ulang di akhir.
insert into public.transaksi_masuk
  (nomor, alat_id, unit_tujuan_id, jumlah, tanggal, sumber, nomor_bast, dicatat_oleh)
values
  ('TM-2026-0001','00000000-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111',48,current_date - 21,'Pemasok Aesculap','BAST/2026/0001','00000000-0000-4000-a000-000000000002'),
  ('TM-2026-0002','00000000-0000-4000-8000-000000000002','11111111-1111-1111-1111-111111111111',12,current_date - 20,'Pemasok Medis Sejahtera','BAST/2026/0002','00000000-0000-4000-a000-000000000002'),
  ('TM-2026-0003','00000000-0000-4000-8000-000000000003','11111111-1111-1111-1111-111111111111', 4,current_date - 19,'Pemasok Philips','BAST/2026/0003','00000000-0000-4000-a000-000000000002'),
  ('TM-2026-0004','00000000-0000-4000-8000-000000000004','11111111-1111-1111-1111-111111111111',35,current_date - 18,'Pemasok Aesculap','BAST/2026/0004','00000000-0000-4000-a000-000000000002'),
  ('TM-2026-0005','00000000-0000-4000-8000-000000000005','11111111-1111-1111-1111-111111111111', 3,current_date - 17,'Pemasok Heine','BAST/2026/0005','00000000-0000-4000-a000-000000000002'),
  ('TM-2026-0006','00000000-0000-4000-8000-000000000006','11111111-1111-1111-1111-111111111111',60,current_date - 16,'Pemasok Geister','BAST/2026/0006','00000000-0000-4000-a000-000000000002'),
  ('TM-2026-0007','00000000-0000-4000-8000-000000000007','11111111-1111-1111-1111-111111111111',18,current_date - 15,'Pemasok Terumo','BAST/2026/0007','00000000-0000-4000-a000-000000000002'),
  ('TM-2026-0008','00000000-0000-4000-8000-000000000008','11111111-1111-1111-1111-111111111111', 2,current_date - 14,'Pemasok Medis Sejahtera','BAST/2026/0008','00000000-0000-4000-a000-000000000002'),
  ('TM-2026-0009','00000000-0000-4000-8000-000000000009','11111111-1111-1111-1111-111111111111',22,current_date - 13,'Pemasok Martin','BAST/2026/0009','00000000-0000-4000-a000-000000000002'),
  ('TM-2026-0010','00000000-0000-4000-8000-000000000010','11111111-1111-1111-1111-111111111111',50,current_date - 12,'Pemasok Aesculap','BAST/2026/0010','00000000-0000-4000-a000-000000000002');

-- ---------------------------------------------- distribusi keluar (UC-07)
insert into public.transaksi_keluar
  (nomor, alat_id, unit_asal_id, unit_tujuan_id, jumlah, tanggal, nomor_bast, dicatat_oleh)
values
  ('TK-2026-0001','00000000-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333333',12,current_date - 8,'BAST/D/2026/0001','00000000-0000-4000-a000-000000000002'),
  ('TK-2026-0002','00000000-0000-4000-8000-000000000006','11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333333',20,current_date - 7,'BAST/D/2026/0002','00000000-0000-4000-a000-000000000002'),
  ('TK-2026-0003','00000000-0000-4000-8000-000000000010','11111111-1111-1111-1111-111111111111','55555555-5555-5555-5555-555555555555',10,current_date - 5,'BAST/D/2026/0003','00000000-0000-4000-a000-000000000002'),
  ('TK-2026-0004','00000000-0000-4000-8000-000000000007','11111111-1111-1111-1111-111111111111','55555555-5555-5555-5555-555555555555', 5,current_date - 4,'BAST/D/2026/0004','00000000-0000-4000-a000-000000000002'),
  ('TK-2026-0005','00000000-0000-4000-8000-000000000004','11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222',35,current_date - 3,'BAST/D/2026/0005','00000000-0000-4000-a000-000000000002'),
  ('TK-2026-0006','00000000-0000-4000-8000-000000000009','11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222',22,current_date - 3,'BAST/D/2026/0006','00000000-0000-4000-a000-000000000002'),
  ('TK-2026-0007','00000000-0000-4000-8000-000000000008','11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222', 2,current_date - 2,'BAST/D/2026/0007','00000000-0000-4000-a000-000000000002'),
  ('TK-2026-0008','00000000-0000-4000-8000-000000000002','11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222',12,current_date - 2,'BAST/D/2026/0008','00000000-0000-4000-a000-000000000002');

-- ------------------------------------- konfirmasi penerimaan (UC-09)
-- TK-0001 diterima penuh; TK-0002 selisih 2; TK-0004 diterima penuh;
-- TK-0005..0008 ke CSSD diterima penuh; TK-0003 dibiarkan menunggu.
insert into public.konfirmasi_penerimaan
  (transaksi_keluar_id, jumlah_diterima, kondisi, keterangan, dikonfirmasi_oleh)
select id, 12, 'baik', null, '00000000-0000-4000-a000-000000000003'
  from public.transaksi_keluar where nomor = 'TK-2026-0001';

insert into public.konfirmasi_penerimaan
  (transaksi_keluar_id, jumlah_diterima, kondisi, keterangan, dikonfirmasi_oleh)
select id, 18, 'baik', 'Kemasan 2 unit rusak saat pengiriman, dikembalikan ke gudang',
       '00000000-0000-4000-a000-000000000003'
  from public.transaksi_keluar where nomor = 'TK-2026-0002';

insert into public.konfirmasi_penerimaan
  (transaksi_keluar_id, jumlah_diterima, kondisi, keterangan, dikonfirmasi_oleh)
select id, 5, 'baik', null, '00000000-0000-4000-a000-000000000004'
  from public.transaksi_keluar where nomor = 'TK-2026-0004';

insert into public.konfirmasi_penerimaan
  (transaksi_keluar_id, jumlah_diterima, kondisi, keterangan, dikonfirmasi_oleh)
select id, 35, 'baik', null, '00000000-0000-4000-a000-000000000004'
  from public.transaksi_keluar where nomor = 'TK-2026-0005';

insert into public.konfirmasi_penerimaan
  (transaksi_keluar_id, jumlah_diterima, kondisi, keterangan, dikonfirmasi_oleh)
select id, 22, 'baik', null, '00000000-0000-4000-a000-000000000004'
  from public.transaksi_keluar where nomor = 'TK-2026-0006';

insert into public.konfirmasi_penerimaan
  (transaksi_keluar_id, jumlah_diterima, kondisi, keterangan, dikonfirmasi_oleh)
select id, 2, 'baik', null, '00000000-0000-4000-a000-000000000004'
  from public.transaksi_keluar where nomor = 'TK-2026-0007';

insert into public.konfirmasi_penerimaan
  (transaksi_keluar_id, jumlah_diterima, kondisi, keterangan, dikonfirmasi_oleh)
select id, 12, 'baik', null, '00000000-0000-4000-a000-000000000004'
  from public.transaksi_keluar where nomor = 'TK-2026-0008';

-- --------------------------------------------- batch sterilisasi (modul 10/11)
-- Batch 1: lulus mutu sampai penyimpanan (pengembalian steril ke CSSD)
insert into public.batch_sterilisasi (id, nomor, mesin, dibuat_oleh, catatan)
values ('00000000-0000-4000-9000-000000000001','BATCH-2026-0001','Autoclave B1',
        '00000000-0000-4000-a000-000000000004','Instrumen bedah umum');

insert into public.sterilisasi_log (batch_id, alat_id, tahap, petugas_id)
values
  ('00000000-0000-4000-9000-000000000001','00000000-0000-4000-8000-000000000004','penerimaan_kotor','00000000-0000-4000-a000-000000000004'),
  ('00000000-0000-4000-9000-000000000001','00000000-0000-4000-8000-000000000009','penerimaan_kotor','00000000-0000-4000-a000-000000000004');

update public.batch_sterilisasi set tahap = 'pencucian'
 where id = '00000000-0000-4000-9000-000000000001';
insert into public.sterilisasi_log (batch_id, tahap, petugas_id)
values ('00000000-0000-4000-9000-000000000001','pencucian','00000000-0000-4000-a000-000000000004');

update public.batch_sterilisasi set tahap = 'pengemasan'
 where id = '00000000-0000-4000-9000-000000000001';
insert into public.sterilisasi_log (batch_id, tahap, petugas_id)
values ('00000000-0000-4000-9000-000000000001','pengemasan','00000000-0000-4000-a000-000000000004');

update public.batch_sterilisasi set tahap = 'sterilisasi'
 where id = '00000000-0000-4000-9000-000000000001';
insert into public.sterilisasi_log (batch_id, tahap, petugas_id, catatan)
values ('00000000-0000-4000-9000-000000000001','sterilisasi','00000000-0000-4000-a000-000000000004','134°C selama 4 menit');

update public.batch_sterilisasi
   set tahap = 'pendinginan',
       indikator_bowie_dick = true,
       indikator_biologis = true,
       hasil_verifikasi = 'lulus'
 where id = '00000000-0000-4000-9000-000000000001';
insert into public.sterilisasi_log (batch_id, tahap, petugas_id)
values ('00000000-0000-4000-9000-000000000001','pendinginan','00000000-0000-4000-a000-000000000004');

update public.batch_sterilisasi set tahap = 'penyimpanan'
 where id = '00000000-0000-4000-9000-000000000001';
insert into public.sterilisasi_log (batch_id, tahap, petugas_id)
values ('00000000-0000-4000-9000-000000000001','penyimpanan','00000000-0000-4000-a000-000000000004');

-- Batch 2: gagal verifikasi mutu -> alat perlu resterilisasi
insert into public.batch_sterilisasi (id, nomor, mesin, dibuat_oleh, catatan)
values ('00000000-0000-4000-9000-000000000002','BATCH-2026-0002','Autoclave B2',
        '00000000-0000-4000-a000-000000000004','Kaset laparoscopy');

insert into public.sterilisasi_log (batch_id, alat_id, tahap, petugas_id)
values ('00000000-0000-4000-9000-000000000002','00000000-0000-4000-8000-000000000008','penerimaan_kotor','00000000-0000-4000-a000-000000000004');

update public.batch_sterilisasi set tahap = 'pencucian'
 where id = '00000000-0000-4000-9000-000000000002';
insert into public.sterilisasi_log (batch_id, tahap, petugas_id)
values ('00000000-0000-4000-9000-000000000002','pencucian','00000000-0000-4000-a000-000000000004');

update public.batch_sterilisasi set tahap = 'pengemasan'
 where id = '00000000-0000-4000-9000-000000000002';
insert into public.sterilisasi_log (batch_id, tahap, petugas_id)
values ('00000000-0000-4000-9000-000000000002','pengemasan','00000000-0000-4000-a000-000000000004');

update public.batch_sterilisasi set tahap = 'sterilisasi'
 where id = '00000000-0000-4000-9000-000000000002';
insert into public.sterilisasi_log (batch_id, tahap, petugas_id)
values ('00000000-0000-4000-9000-000000000002','sterilisasi','00000000-0000-4000-a000-000000000004');

-- verifikasi: indikator biologis negatif -> gagal -> perangkat alat jadi perlu resterilisasi
update public.batch_sterilisasi
   set indikator_bowie_dick = true,
       indikator_biologis = false,
       catatan = 'Indikator biologis positif, batch tidak lulus'
 where id = '00000000-0000-4000-9000-000000000002';

update public.batch_sterilisasi
   set hasil_verifikasi = 'gagal',
       tahap = 'gagal'
 where id = '00000000-0000-4000-9000-000000000002';

-- Batch 3: masih berjalan di tahap pengemasan
insert into public.batch_sterilisasi (id, nomor, mesin, dibuat_oleh, catatan)
values ('00000000-0000-4000-9000-000000000003','BATCH-2026-0003','Autoclave C1',
        '00000000-0000-4000-a000-000000000004','Autoclave pouch set');

insert into public.sterilisasi_log (batch_id, alat_id, tahap, petugas_id)
values ('00000000-0000-4000-9000-000000000003','00000000-0000-4000-8000-000000000002','penerimaan_kotor','00000000-0000-4000-a000-000000000004');

update public.batch_sterilisasi set tahap = 'pencucian'
 where id = '00000000-0000-4000-9000-000000000003';
insert into public.sterilisasi_log (batch_id, tahap, petugas_id)
values ('00000000-0000-4000-9000-000000000003','pencucian','00000000-0000-4000-a000-000000000004');

update public.batch_sterilisasi set tahap = 'pengemasan'
 where id = '00000000-0000-4000-9000-000000000003';
insert into public.sterilisasi_log (batch_id, tahap, petugas_id)
values ('00000000-0000-4000-9000-000000000003','pengemasan','00000000-0000-4000-a000-000000000004');

-- ---------------------------------------------------- contoh baris laporan
insert into public.laporan
  (jenis, periode_mulai, periode_selesai, unit_id, kategori, filter, dibuat_oleh)
values
  ('stok', current_date - 30, current_date, null, null,
   '{"cakupan":"semua_unit"}'::jsonb, '00000000-0000-4000-a000-000000000001'),
  ('sterilisasi', current_date - 14, current_date, '22222222-2222-2222-2222-222222222222', null,
   '{"mesin":"Autoclave B1"}'::jsonb, '00000000-0000-4000-a000-000000000001');

-- --------------------------------------------------- sinkronkan sequence
select setval('public.transaksi_masuk_nomor_seq', 10, true);
select setval('public.transaksi_keluar_nomor_seq', 8, true);
select setval('public.batch_nomor_seq', 3, true);