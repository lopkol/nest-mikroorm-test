import { Migration } from '@mikro-orm/migrations';

export class Migration20230921100905 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "child_type" ("foo" varchar(255) not null, "boo" varchar(255) not null, "data" varchar(255) not null, constraint "child_type_pkey" primary key ("foo", "boo"));');

    this.addSql('create table "parent" ("id" serial primary key, "unique_prop" varchar(255) not null, "data" varchar(255) not null);');
    this.addSql('alter table "parent" add constraint "parent_unique_prop_unique" unique ("unique_prop");');

    this.addSql('create table "child" ("parent_id" int not null, "type_foo" varchar(255) not null, "type_boo" varchar(255) not null, "data" varchar(255) not null, constraint "child_pkey" primary key ("parent_id", "type_foo", "type_boo"));');

    this.addSql('alter table "child" add constraint "child_parent_id_foreign" foreign key ("parent_id") references "parent" ("id") on update cascade;');
    this.addSql('alter table "child" add constraint "child_type_foo_type_boo_foreign" foreign key ("type_foo", "type_boo") references "child_type" ("foo", "boo") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "child" drop constraint "child_type_foo_type_boo_foreign";');

    this.addSql('alter table "child" drop constraint "child_parent_id_foreign";');

    this.addSql('drop table if exists "child_type" cascade;');

    this.addSql('drop table if exists "parent" cascade;');

    this.addSql('drop table if exists "child" cascade;');
  }

}
