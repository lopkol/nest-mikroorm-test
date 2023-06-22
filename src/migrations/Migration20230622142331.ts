import { Migration } from '@mikro-orm/migrations';

export class Migration20230622142331 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "metadata" jsonb;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "metadata";');
  }

}
