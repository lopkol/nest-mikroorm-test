import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { PaymentMethodConfig } from './payment-method-config.entity';
import { PaymentConfigRepository } from '../repositories/payment-config.repository';

@Entity({ customRepository: () => PaymentConfigRepository })
@Unique({ properties: ['ownerUuid', 'provider'] })
export class PaymentConfig {
  [EntityRepositoryType]?: PaymentConfigRepository;

  @PrimaryKey()
  id: number;

  @Property()
  ownerUuid: string;

  @Property()
  provider: string;

  @Property({ nullable: true })
  walletReference?: string;

  @OneToMany({
    entity: () => PaymentMethodConfig,
    mappedBy: 'paymentConfig',
    orphanRemoval: true,
  })
  methods = new Collection<PaymentMethodConfig>(this, [], true);

  // ...
}
