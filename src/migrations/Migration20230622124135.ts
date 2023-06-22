import { Migration } from '@mikro-orm/migrations';

export class Migration20230622124135 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "phone" int;');
    this.addSql('alter table "user" alter column "firstname" type varchar(255) using ("firstname"::varchar(255));');
    this.addSql('alter table "user" alter column "firstname" drop not null;');
    this.addSql('alter table "user" alter column "lastname" type varchar(255) using ("lastname"::varchar(255));');
    this.addSql('alter table "user" alter column "lastname" drop not null;');
    this.addSql('alter table "user" alter column "email" type varchar(255) using ("email"::varchar(255));');
    this.addSql('alter table "user" alter column "email" drop not null;');
    this.addSql('alter table "user" add constraint "user_uuid_unique" unique ("uuid");');
    this.addSql('create index "user_email_index" on "user" ("email");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" alter column "firstname" type varchar(255) using ("firstname"::varchar(255));');
    this.addSql('alter table "user" alter column "firstname" set not null;');
    this.addSql('alter table "user" alter column "lastname" type varchar(255) using ("lastname"::varchar(255));');
    this.addSql('alter table "user" alter column "lastname" set not null;');
    this.addSql('alter table "user" alter column "email" type varchar(255) using ("email"::varchar(255));');
    this.addSql('alter table "user" alter column "email" set not null;');
    this.addSql('alter table "user" drop constraint "user_uuid_unique";');
    this.addSql('drop index "user_email_index";');
    this.addSql('alter table "user" drop column "phone";');
  }

}
