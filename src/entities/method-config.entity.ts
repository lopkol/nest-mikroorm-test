import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { MethodConfigRepository } from '../repositories/method-config.repository';
import { Gateway } from './gateway.entity';

@Entity({ customRepository: () => MethodConfigRepository })
export class MethodConfig {
  [EntityRepositoryType]?: MethodConfigRepository;

  @PrimaryKey()
  provider: string;

  @PrimaryKey()
  method: string;

  [PrimaryKeyType]?: [string, string];

  @ManyToMany(() => Gateway)
  supportedGateways: Collection<Gateway> = new Collection<Gateway>(
    this,
    [],
    true,
  );

  @Property()
  providerMethodName: string;

  @Property()
  minAmount: number;
}
