import { Migration } from '@mikro-orm/migrations';

export class Migration20230622132027 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "test" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "test" ("id" serial primary key, "name" varchar(255) not null);');
  }

}
