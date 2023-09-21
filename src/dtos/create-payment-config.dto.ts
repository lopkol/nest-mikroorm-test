import { ApiProperty } from '@nestjs/swagger';
import { PaymentConfig } from '../entities/payment-config.entity';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentConfigDto {
  @ApiProperty()
  ownerUuid: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  walletReference?: string;

  @ApiProperty({ type: () => [CreatePaymentMethodConfigDto] })
  @ValidateNested()
  @Type(() => CreatePaymentMethodConfigDto)
  methods: CreatePaymentMethodConfigDto[];

  public createEntity(): PaymentConfig {
    const paymentConfig = new PaymentConfig();
    paymentConfig.ownerUuid = this.ownerUuid;
    paymentConfig.provider = this.provider;
    paymentConfig.walletReference = this.walletReference;

    return paymentConfig;
  }
}

export class CreatePaymentMethodConfigDto {
  @ApiProperty()
  method: string;

  @ApiProperty()
  gateway: string;

  @ApiProperty({ required: false })
  providerConfig?: Record<string, unknown>;
}
