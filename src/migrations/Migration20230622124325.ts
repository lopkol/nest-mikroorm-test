import { Migration } from '@mikro-orm/migrations';

export class Migration20230622124325 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" alter column "phone" type varchar(255) using ("phone"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" alter column "phone" type int using ("phone"::int);');
  }

}
