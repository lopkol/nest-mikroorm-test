import { EntityRepository } from '@mikro-orm/postgresql';
import { ProviderMethodConfig } from '../entities/provider-method-config.entity';

export class ProviderMethodConfigRepository extends EntityRepository<ProviderMethodConfig> {
  findByProvider(provider: string) {
    return this.find({ provider });
  }
}
