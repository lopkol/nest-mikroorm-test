import { Migration } from '@mikro-orm/migrations';

export class Migration20230908064235 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "payment_config" ("owner_uuid" varchar(255) not null, "provider" varchar(255) not null, "wallet_reference" varchar(255) null, constraint "payment_config_pkey" primary key ("owner_uuid", "provider"));');

    this.addSql('create table "payment_method_config" ("id" serial primary key, "owner_uuid" varchar(255) not null, "provider" varchar(255) not null, "method" varchar(255) not null, "network" varchar(255) null);');

    this.addSql('alter table "payment_method_config" add constraint "payment_method_config_owner_uuid_provider_foreign" foreign key ("owner_uuid", "provider") references "payment_config" ("owner_uuid", "provider") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "payment_method_config" drop constraint "payment_method_config_owner_uuid_provider_foreign";');

    this.addSql('drop table if exists "payment_config" cascade;');

    this.addSql('drop table if exists "payment_method_config" cascade;');
  }

}
