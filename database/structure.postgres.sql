-- Author: Heiler Nova
drop schema public cascade;
create schema public;

create extension pgcrypto;
create extension unaccent;

create domain cellphone as
varchar check (value ~* '^\+\d+ \d{3} \d{3} \d{4}$');

create domain email as varchar(100)
check (value ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');

create type runtime_environment as enum('Node.js', 'Python', 'PHP');
create type framework as enum('NestJS', 'Angular', 'FastAPI');
create type running_on as enum('PM2', 'Docker', 'LiteSpeed', 'Apache');
create type user_role as enum('admin', 'collaborator');

-- Table users
create table users
(
    "id" uuid primary key default gen_random_uuid(),
    "create_at" timestamp not null default now(),
    "role" user_role not null default 'collaborator',
    "lock" boolean not null default true,
    "username" varchar(30) not null,
    "email" email not null unique,
    "name" varchar(40) not null,
    "last_name" varchar(40) not null,
    "cellphone" cellphone,
    "password" text,
    constraint "uni_username" unique ("username"),
    constraint "uni_email" unique ("email")
);

create type user_log_action as enum('auth', 'update', 'password',  'lock');
create type user_log_state as enum('success', 'warning', 'error', 'bug');

create table users_log
(
    "id" uuid primary key default gen_random_uuid(),
    "create_at" timestamp not null default now(),
    "user_id" uuid not null references users("id"),
    "action" user_log_action not null,
    "state" user_log_state not null,
    "detail" varchar(80) not null
);

create table users_tokens
(
    "id" uuid default gen_random_uuid(),
    "create_at" timestamp not null default now(),
    "user_id" uuid not null references users("id"),
    "hostname" varchar(50) not null,
    "enable" boolean not null default true,
    constraint "pk_id_hostname" primary key ("user_id", "hostname")
);

create table applications
(
    "id" uuid primary key default gen_random_uuid(),
    "create_at" timestamp not null default now(),
    "update_at" timestamp not null default now(),
    "last_deploy_at" timestamp,
    "domain" varchar(100) not null,
    "name" varchar(50) not null,
    "version" varchar(10),
    "location" varchar(600) not null unique,
    "startup_file" varchar(20),
    "framework" framework,
    "running_on" running_on,
    "runtime_environment" runtime_environment,
    "url" varchar(100),
    "github" json,
    "env" json not null default '{}'::json,
    "ignore" text[] not null default array[]::text[],
    "observation" varchar(1000),
    constraint "uni_domain_name" unique ("domain", "name", "version")
);

create table applications_access
(
    "app_id" uuid not null references applications(id),
    "user_id" uuid not null references users(id),
    "role" user_role default 'collaborator',
    "edit" boolean not null default false,
    "deploy" boolean not null default false,
    constraint "pk_apps_user" primary key ("app_id", "user_id")
);

-- Function triggers
create function user_insert_or_update()
returns trigger
language plpgsql
as $$
begin
    new.email = lower(new.email);
    new.name = initcap(new.name);
    new.last_name = initcap(new.last_name);
    new.password = crypt(new.password, gen_salt('bf', 8));
    return new;
end;$$;

create trigger insert_or_update before insert or update on users
for each row execute function user_insert_or_update();

create function user_auth(varchar(100), varchar(50))
returns table(
    "id" uuid,
    "name" varchar,
    "last_name" varchar,
    "lock" boolean,
    "password_valid" boolean
)
language plpgsql
as $$
declare
    var_record record;
begin

    for var_record in 
        select t.id, t.name, t.last_name, t.lock, (t."password" = crypt($2, t."password")) as password_valid from users t where (case when $1 ilike '%@%' then t.email else t.username end) = $1
    loop
        "id" := var_record.id;
        "name" := var_record.name;
        "last_name" := var_record.last_name;
        "lock" := var_record.lock;
        "password_valid" := var_record.password_valid;
        
        insert into users_log("user_id", "action", "state", "detail")
        values(var_record.id, 'auth', (case when var_record.password_valid = true then 'success' else 'warning' end)::user_log_state, 'Authentication');
        
        return next;
    end loop;
end;$$;

create function user_password_valid(uuid, varchar(50))
returns boolean
language plpgsql
as $$
begin
    return (select t.password = crypt($2, t.password) from users t where t.id = $1);
end;$$;


create view vi_applications as
select
	b.user_id,
	json_build_object('edit', b.edit, 'deploy', b.deploy) as permits,
	a.*
from applications a 
inner join applications_access b on b.app_id = a.id;

insert into users values('83df765f-ea4e-4dff-815f-a953c74be04c', default, 'admin', false, 'heilernova', 'heilernova@gmail.com', 'heiler', 'nova', '+57 320 971 6145', 'admin');
insert into users_tokens(id, user_id, hostname) values('394954a7-8b98-48ce-8c00-968fc12f4c5e', '83df765f-ea4e-4dff-815f-a953c74be04c', 'Postman');