import { Migration } from '@mikro-orm/migrations';

export class Migration20230622125605 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop index "user_email_index";');
  }

  async down(): Promise<void> {
    this.addSql('create index "user_email_index" on "user" ("email");');
  }

}
