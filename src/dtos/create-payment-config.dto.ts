import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodConfig } from '../entities/payment-method-config.entity';
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
  methodConfigs: CreatePaymentMethodConfigDto[];

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
  network?: string;

  public createEntity(): PaymentMethodConfig {
    const paymentMethodConfig = new PaymentMethodConfig();
    paymentMethodConfig.method = this.method;
    paymentMethodConfig.network = this.network;

    return paymentMethodConfig;
  }
}
