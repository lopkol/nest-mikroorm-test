import { Migration } from '@mikro-orm/migrations';

export class Migration20230623145119 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "address" alter column "line2" type varchar(1000) using ("line2"::varchar(1000));');
    this.addSql('alter table "address" alter column "line2" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "address" alter column "line2" type varchar(1000) using ("line2"::varchar(1000));');
    this.addSql('alter table "address" alter column "line2" set not null;');
  }

}
