import { Migration } from '@mikro-orm/migrations';

export class Migration20230622102849 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "uuid" uuid not null default uuid_generate_v4();');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "uuid";');
  }

}
