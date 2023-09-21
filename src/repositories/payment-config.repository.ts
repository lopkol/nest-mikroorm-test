import { EntityRepository } from '@mikro-orm/postgresql';
import { PaymentConfig } from '../entities/payment-config.entity';

export class PaymentConfigRepository extends EntityRepository<PaymentConfig> {
  async findOneWithMethods(ownerUuid: string, provider: string) {
    return this.findOne(
      { ownerUuid, provider },
      {
        populate: [
          'methods',
          'methods.gateway',
          'methods.methodConfig',
          'methods.methodConfig.supportedGateways',
        ],
      },
    );
  }
}
