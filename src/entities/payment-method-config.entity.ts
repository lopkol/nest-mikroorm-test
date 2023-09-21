import {
  Entity,
  JsonType,
  ManyToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { PaymentConfig } from './payment-config.entity';
import { MethodConfig } from './method-config.entity';
import { Gateway } from './gateway.entity';

@Entity()
export class PaymentMethodConfig {
  @ManyToOne(() => PaymentConfig, { primary: true })
  paymentConfig: PaymentConfig;

  @ManyToOne({
    entity: () => MethodConfig,
    referencedColumnNames: ['provider', 'method'],
    joinColumns: ['provider', 'method'],
    primary: true,
  })
  methodConfig: MethodConfig;

  @ManyToOne(() => Gateway, { primary: true })
  gateway: Gateway;

  [PrimaryKeyType]?: [PaymentConfig, MethodConfig, Gateway];

  @Property({ type: JsonType, nullable: true })
  providerConfig?: Record<string, unknown>;

  // ...
}
