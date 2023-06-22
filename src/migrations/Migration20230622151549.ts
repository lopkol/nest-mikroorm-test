import { Migration } from '@mikro-orm/migrations';

export class Migration20230622151549 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "uuid" uuid not null default uuid_generate_v4(), "title" varchar(255) not null, "content" text not null, "author_id" int not null);');
    this.addSql('alter table "post" add constraint "post_uuid_unique" unique ("uuid");');

    this.addSql('alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "post" cascade;');
  }

}
