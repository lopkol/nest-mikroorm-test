import { Migration } from '@mikro-orm/migrations';

export class Migration20230621160847 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "firstname" varchar(255) not null, "lastname" varchar(255) not null, "email" varchar(255) not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
