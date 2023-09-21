import { EntityRepository } from '@mikro-orm/postgresql';
import { MethodConfig } from '../entities/method-config.entity';

export class MethodConfigRepository extends EntityRepository<MethodConfig> {
  findByProvider(provider: string) {
    return this.find({ provider }, { populate: ['supportedGateways'] });
  }
}
