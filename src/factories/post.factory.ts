import { Factory, Faker } from '@mikro-orm/seeder';
import { Post } from '../entities/post.entity';

export class PostFactory extends Factory<Post> {
  model = Post;

  definition(faker: Faker): Partial<Post> {
    return {
      title: faker.lorem.words(faker.datatype.number({ min: 1, max: 10 })),
      content: faker.lorem.paragraphs(
        faker.datatype.number({ min: 5, max: 15 }),
      ),
      createdAt: faker.date.past(3),
    };
  }
}
