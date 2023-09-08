import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodConfig } from '../entities/payment-method-config.entity';
import { PaymentConfig } from '../entities/payment-config.entity';

export class PaymentConfigDto {
  @ApiProperty()
  ownerUuid: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  walletReference?: string;

  @ApiProperty({ type: () => [PaymentMethodConfigDto] })
  methodConfigs: PaymentMethodConfigDto[];

  public static async createFromEntity(
    paymentConfig: PaymentConfig,
  ): Promise<PaymentConfigDto> {
    const dto = new PaymentConfigDto();
    dto.ownerUuid = paymentConfig.ownerUuid;
    dto.provider = paymentConfig.provider;
    dto.walletReference = paymentConfig.walletReference;

    const methodConfigEntities = await paymentConfig.methodConfigs.loadItems();
    dto.methodConfigs = methodConfigEntities.map(
      PaymentMethodConfigDto.createFromEntity,
    );

    return dto;
  }
}

export class PaymentMethodConfigDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ownerUuid: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  network?: string;

  public static createFromEntity(
    paymentMethodConfig: PaymentMethodConfig,
  ): PaymentMethodConfigDto {
    const dto = new PaymentMethodConfigDto();
    dto.id = paymentMethodConfig.id;
    // dto.ownerUuid = paymentMethodConfig.ownerUuid;
    // dto.provider = paymentMethodConfig.provider;
    dto.method = paymentMethodConfig.method;
    dto.network = paymentMethodConfig.network;

    return dto;
  }
}
