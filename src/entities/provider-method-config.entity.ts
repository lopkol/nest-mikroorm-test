import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { ProviderMethodConfigRepository } from '../repositories/provider-method-config.repository';

@Entity({ customRepository: () => ProviderMethodConfigRepository })
export class ProviderMethodConfig {
  [EntityRepositoryType]?: ProviderMethodConfigRepository;

  @PrimaryKey()
  provider: string;

  @PrimaryKey()
  method: string;

  [PrimaryKeyType]?: [string, string];

  @Property()
  providerMethodName: string;

  @Property()
  minAmount: number;
}
