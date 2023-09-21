import {
  Entity,
  JsonType,
  ManyToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { PaymentConfig } from './payment-config.entity';
import { ProviderMethodConfig } from './provider-method-config.entity';

@Entity()
export class PaymentMethodConfig {
  @ManyToOne(() => PaymentConfig, { primary: true })
  paymentConfig: PaymentConfig;

  @ManyToOne({
    entity: () => ProviderMethodConfig,
    referencedColumnNames: ['provider', 'method'],
    joinColumns: ['provider', 'method'],
    primary: true,
  })
  providerMethodConfig: ProviderMethodConfig;

  [PrimaryKeyType]?: [PaymentConfig, ProviderMethodConfig];

  @Property({ type: JsonType, nullable: true })
  providerConfig?: Record<string, unknown>;

  // ...
}
