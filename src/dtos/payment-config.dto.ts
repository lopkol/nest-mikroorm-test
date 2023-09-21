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
  gateway: string;

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
    dto.gateway = paymentMethodConfig.gateway.name;
    dto.method = paymentMethodConfig.methodConfig.method;
    dto.provider = paymentMethodConfig.methodConfig.provider;
    dto.providerMethodName =
      paymentMethodConfig.methodConfig.providerMethodName;
    dto.minAmount = paymentMethodConfig.methodConfig.minAmount;

    return dto;
  }
}
