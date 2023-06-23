import { User } from '../entities/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

export class UserRepository extends EntityRepository<User> {
  public async getUserWithPosts(uuid: string): Promise<User | null> {
    return await this.findOne({ uuid }, { populate: ['posts', 'address'] });
  }
}
