import { Factory, Faker } from '@mikro-orm/seeder';
import { User } from '../entities/user.entity';

export class UserFactory extends Factory<User> {
  model = User;

  definition(faker: Faker): Partial<User> {
    return {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      createdAt: faker.date.past(3),
    };
  }
}
