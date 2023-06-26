import { Address } from '../entities/address.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty()
  country: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  line1: string;

  @ApiProperty()
  line2?: string;

  public static createFromEntity(address: Address): AddressDto {
    const dto = new AddressDto();
    dto.country = address.country;
    dto.city = address.city;
    dto.postalCode = address.postalCode;
    dto.line1 = address.line1;
    dto.line2 = address.line2;

    return dto;
  }
}
