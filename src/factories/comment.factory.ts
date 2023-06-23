import { Factory, Faker } from '@mikro-orm/seeder';
import { Comment } from '../entities/comment.entity';

export class CommentFactory extends Factory<Comment> {
  model = Comment;

  definition(faker: Faker): Partial<Comment> {
    return {
      content: faker.lorem.sentences(
        faker.datatype.number({ min: 1, max: 10 }),
      ),
      createdAt: faker.date.past(3),
    };
  }
}
