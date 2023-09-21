import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePaymentConfigDto {
  @ApiProperty()
  walletReference?: string;

  @ApiProperty({ type: () => [UpdatePaymentMethodConfigDto] })
  @ValidateNested()
  @Type(() => UpdatePaymentMethodConfigDto)
  methods: UpdatePaymentMethodConfigDto[];
}

export class UpdatePaymentMethodConfigDto {
  @ApiProperty()
  method: string;

  @ApiProperty()
  gateway: string;

  @ApiProperty({ required: false })
  providerConfig?: Record<string, unknown>;
}
