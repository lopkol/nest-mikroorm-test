import { EntityRepository } from '@mikro-orm/postgresql';
import { Post } from '../entities/post.entity';

export class PostRepository extends EntityRepository<Post> {}
