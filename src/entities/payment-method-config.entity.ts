import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { PaymentConfig } from './payment-config.entity';

@Entity()
export class PaymentMethodConfig {
  @PrimaryKey()
  id: number;

  ownerUuid: string;

  provider: string;

  @ManyToOne({
    entity: () => PaymentConfig,
    referencedColumnNames: ['owner_uuid', 'provider'],
    joinColumns: ['owner_uuid', 'provider'],
  })
  paymentConfig: PaymentConfig;

  @Property()
  method: string;

  @Property({ nullable: true })
  network?: string;

  // ...
}
