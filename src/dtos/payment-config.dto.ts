import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodConfig } from '../entities/payment-method-config.entity';
import { PaymentConfig } from '../entities/payment-config.entity';

export class PaymentConfigDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ownerUuid: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  walletReference?: string;

  @ApiProperty({ type: () => [PaymentMethodConfigDto] })
  methods: PaymentMethodConfigDto[];

  public static async createFromEntity(
    paymentConfig: PaymentConfig,
  ): Promise<PaymentConfigDto> {
    const dto = new PaymentConfigDto();
    dto.id = paymentConfig.id;
    dto.ownerUuid = paymentConfig.ownerUuid;
    dto.provider = paymentConfig.provider;
    dto.walletReference = paymentConfig.walletReference;

    const methodConfigEntities = await paymentConfig.methods.loadItems();
    dto.methods = methodConfigEntities.map(
      PaymentMethodConfigDto.createFromEntity,
    );

    return dto;
  }
}

export class PaymentMethodConfigDto {
  @ApiProperty()
  ownerUuid: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  providerMethodName: string;

  @ApiProperty()
  minAmount?: number;

  @ApiProperty({ required: false })
  providerConfig?: Record<string, unknown>;

  public static createFromEntity(
    paymentMethodConfig: PaymentMethodConfig,
  ): PaymentMethodConfigDto {
    const dto = new PaymentMethodConfigDto();
    dto.method = paymentMethodConfig.providerMethodConfig.method;
    dto.provider = paymentMethodConfig.providerMethodConfig.provider;
    dto.providerMethodName =
      paymentMethodConfig.providerMethodConfig.providerMethodName;
    dto.minAmount = paymentMethodConfig.providerMethodConfig.minAmount;

    return dto;
  }
}
