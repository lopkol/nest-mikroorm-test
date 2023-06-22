import { Migration } from '@mikro-orm/migrations';

export class Migration20230622140551 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "created_at";');
    this.addSql('alter table "user" drop column "updated_at";');
  }

}
