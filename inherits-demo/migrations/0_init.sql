create extension if not exists pgcrypto;

create table if not exists base_user (
  id uuid primary key NOT NULL DEFAULT gen_random_uuid(),
  email text
);

create table if not exists administrator (
  permissions BIGINT,
  CONSTRAINT administrator_pkey PRIMARY KEY (id)
) INHERITS (base_user);
