import { Factory, Faker } from '@mikro-orm/seeder';
import { Address } from '../entities/address.entity';

export class AddressFactory extends Factory<Address> {
  model = Address;

  definition(faker: Faker): Partial<Address> {
    return {
      country: faker.address.country(),
      city: faker.address.city(),
      postalCode: faker.address.zipCode(),
      line1: faker.address.streetAddress(),
    };
  }
}
