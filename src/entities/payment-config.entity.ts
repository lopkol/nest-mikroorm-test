import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { PaymentMethodConfig } from './payment-method-config.entity';

@Entity()
export class PaymentConfig {
  @PrimaryKey()
  ownerUuid: string;

  @PrimaryKey()
  provider: string;

  [PrimaryKeyType]?: [string, string];

  @Property({ nullable: true })
  walletReference?: string;

  @OneToMany({
    entity: () => PaymentMethodConfig,
    mappedBy: 'paymentConfig',
    orphanRemoval: true,
  })
  methodConfigs = new Collection<PaymentMethodConfig>(this, [], true);

  // ...
}
