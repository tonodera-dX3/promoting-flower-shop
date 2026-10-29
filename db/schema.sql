-- promoting-flower-shop テーブル定義（documents/spec.md「DB テーブル」に基づく）
-- 手動で実行する: psql -h <host> -U <user> -d <database> -f db/schema.sql
-- gen_random_uuid() は PostgreSQL 13 以降で標準搭載（拡張不要）
-- 空文字は NULL ではなく空文字列として格納する

-- アカウント
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  user_id       text unique not null default '',  -- ユーザーID（大文字・小文字を区別）
  user_name     text not null default '',         -- ユーザー名
  user_password text not null default '',         -- パスワード（bcryptjs のハッシュ値）
  slug          text unique not null default ''   -- 公開ページURLの slug（ユーザーIDと同じ値）
);

-- ニュース用画像・ニュース・ご案内（1ユーザーにつき1行）
create table if not exists shop_news (
  id             uuid primary key not null default gen_random_uuid(),
  users_id       uuid unique not null references users(id) on delete cascade,
  news_image_url text not null default '',  -- ニュース用画像 オブジェクトパス
  content_type   text not null default '',  -- news_image_url の content-type（image/jpeg または image/png）
  news_text      text not null default '',  -- ニュース
  information    text not null default ''   -- ご案内
);

-- スライドショー用画像
create table if not exists shop_slideshow (
  id            uuid primary key not null default gen_random_uuid(),
  users_id      uuid not null references users(id) on delete cascade,
  seqno         integer not null default 0,  -- 表示順
  slideshow_url text not null default '',    -- スライドショー用画像 オブジェクトパス
  content_type  text not null default '',    -- slideshow_url の content-type（image/jpeg または image/png）
  unique (users_id, seqno)
);

-- 店内画像
create table if not exists shop_images (
  id             uuid primary key not null default gen_random_uuid(),
  users_id       uuid not null references users(id) on delete cascade,
  seqno          integer not null default 0,  -- 表示順
  shop_image_url text not null default '',    -- 店内画像 オブジェクトパス
  content_type   text not null default '',    -- shop_image_url の content-type（image/jpeg または image/png）
  unique (users_id, seqno)
);
