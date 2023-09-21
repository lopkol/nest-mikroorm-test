import { Migration } from '@mikro-orm/migrations';

export class Migration20230921091741 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "payment_config" ("id" serial primary key, "owner_uuid" varchar(255) not null, "provider" varchar(255) not null, "wallet_reference" varchar(255) null);');
    this.addSql('alter table "payment_config" add constraint "payment_config_owner_uuid_provider_unique" unique ("owner_uuid", "provider");');

    this.addSql('create table "provider_method_config" ("provider" varchar(255) not null, "method" varchar(255) not null, "provider_method_name" varchar(255) not null, "min_amount" int not null, constraint "provider_method_config_pkey" primary key ("provider", "method"));');

    this.addSql('create table "payment_method_config" ("payment_config_id" int not null, "provider" varchar(255) not null, "method" varchar(255) not null, "provider_config" jsonb null, constraint "payment_method_config_pkey" primary key ("payment_config_id", "provider", "method"));');

    this.addSql('alter table "payment_method_config" add constraint "payment_method_config_payment_config_id_foreign" foreign key ("payment_config_id") references "payment_config" ("id") on update cascade;');
    this.addSql('alter table "payment_method_config" add constraint "payment_method_config_provider_method_foreign" foreign key ("provider", "method") references "provider_method_config" ("provider", "method") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "payment_method_config" drop constraint "payment_method_config_payment_config_id_foreign";');

    this.addSql('alter table "payment_method_config" drop constraint "payment_method_config_provider_method_foreign";');

    this.addSql('drop table if exists "payment_config" cascade;');

    this.addSql('drop table if exists "provider_method_config" cascade;');

    this.addSql('drop table if exists "payment_method_config" cascade;');
  }

}
