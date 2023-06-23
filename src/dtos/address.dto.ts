import { Address } from '../entities/address.entity';

export class AddressDto {
  country: string;
  postalCode: string;
  city: string;
  line1: string;
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
