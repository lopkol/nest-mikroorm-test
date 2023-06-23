import { Migration } from '@mikro-orm/migrations';

export class Migration20230623124055 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "address" ("id" serial primary key, "country" varchar(120) not null, "postal_code" varchar(120) not null, "city" varchar(500) not null, "line1" varchar(1000) not null, "line2" varchar(1000) not null);');

    this.addSql('create table "comment" ("id" serial primary key, "uuid" uuid not null default uuid_generate_v4(), "content" text not null, "created_at" timestamptz(0) not null, "author_id" int not null, "post_id" int null, "parent_id" int null);');
    this.addSql('comment on column "comment"."author_id" is \'The author of the comment\';');
    this.addSql('alter table "comment" add constraint "comment_uuid_unique" unique ("uuid");');

    this.addSql('alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade on delete set null;');
    this.addSql('alter table "comment" add constraint "comment_parent_id_foreign" foreign key ("parent_id") references "comment" ("id") on update cascade on delete set null;');

    this.addSql('alter table "user" add column "address_id" int null;');
    this.addSql('comment on column "user"."address_id" is \'The postal address of the user\';');
    this.addSql('alter table "user" add constraint "user_address_id_foreign" foreign key ("address_id") references "address" ("id") on update cascade on delete set null;');
    this.addSql('alter table "user" add constraint "user_address_id_unique" unique ("address_id");');

    this.addSql('alter table "post" add column "created_at" timestamptz(0) not null;');
    this.addSql('comment on column "post"."author_id" is \'The author of the post\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_address_id_foreign";');

    this.addSql('alter table "comment" drop constraint "comment_parent_id_foreign";');

    this.addSql('drop table if exists "address" cascade;');

    this.addSql('drop table if exists "comment" cascade;');

    this.addSql('alter table "user" drop constraint "user_address_id_unique";');
    this.addSql('alter table "user" drop column "address_id";');

    this.addSql('alter table "post" drop column "created_at";');
    this.addSql('comment on column "post"."author_id" is null;');
  }

}
