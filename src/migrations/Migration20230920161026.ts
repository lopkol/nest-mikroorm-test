import { Migration } from '@mikro-orm/migrations';

export class Migration20230920161026 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "gateway" ("id" serial primary key, "name" varchar(255) not null);');
    this.addSql('alter table "gateway" add constraint "gateway_name_unique" unique ("name");');

    this.addSql('create table "method_config" ("provider" varchar(255) not null, "method" varchar(255) not null, "provider_method_name" varchar(255) not null, "min_amount" int not null, constraint "method_config_pkey" primary key ("provider", "method"));');

    this.addSql('create table "method_config_supported_gateways" ("method_config_provider" varchar(255) not null, "method_config_method" varchar(255) not null, "gateway_id" int not null, constraint "method_config_supported_gateways_pkey" primary key ("method_config_provider", "method_config_method", "gateway_id"));');

    this.addSql('create table "payment_config" ("id" serial primary key, "owner_uuid" varchar(255) not null, "provider" varchar(255) not null, "wallet_reference" varchar(255) null);');
    this.addSql('alter table "payment_config" add constraint "payment_config_owner_uuid_provider_unique" unique ("owner_uuid", "provider");');

    this.addSql('create table "payment_method_config" ("payment_config_id" int not null, "provider" varchar(255) not null, "method" varchar(255) not null, "gateway_id" int not null, "provider_config" jsonb null, constraint "payment_method_config_pkey" primary key ("payment_config_id", "provider", "method", "gateway_id"));');

    this.addSql('alter table "method_config_supported_gateways" add constraint "method_config_supported_gateways_method_config_pr_febe1_foreign" foreign key ("method_config_provider", "method_config_method") references "method_config" ("provider", "method") on update cascade on delete cascade;');
    this.addSql('alter table "method_config_supported_gateways" add constraint "method_config_supported_gateways_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "payment_method_config" add constraint "payment_method_config_payment_config_id_foreign" foreign key ("payment_config_id") references "payment_config" ("id") on update cascade;');
    this.addSql('alter table "payment_method_config" add constraint "payment_method_config_provider_method_foreign" foreign key ("provider", "method") references "method_config" ("provider", "method") on update cascade;');
    this.addSql('alter table "payment_method_config" add constraint "payment_method_config_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "method_config_supported_gateways" drop constraint "method_config_supported_gateways_gateway_id_foreign";');

    this.addSql('alter table "payment_method_config" drop constraint "payment_method_config_gateway_id_foreign";');

    this.addSql('alter table "method_config_supported_gateways" drop constraint "method_config_supported_gateways_method_config_pr_febe1_foreign";');

    this.addSql('alter table "payment_method_config" drop constraint "payment_method_config_provider_method_foreign";');

    this.addSql('alter table "payment_method_config" drop constraint "payment_method_config_payment_config_id_foreign";');

    this.addSql('drop table if exists "gateway" cascade;');

    this.addSql('drop table if exists "method_config" cascade;');

    this.addSql('drop table if exists "method_config_supported_gateways" cascade;');

    this.addSql('drop table if exists "payment_config" cascade;');

    this.addSql('drop table if exists "payment_method_config" cascade;');
  }

}
