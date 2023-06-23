import {
  Collection,
  Entity,
  EntityRepositoryType,
  LoadStrategy,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  TextType,
  Unique,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { PostRepository } from '../repositories/post.repository';

@Entity({ customRepository: () => PostRepository })
export class Post {
  [EntityRepositoryType]?: PostRepository;

  @PrimaryKey()
  id: number;

  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  @Unique()
  uuid: string;

  @Property()
  title: string;

  @Property({ type: TextType })
  content: string;

  @Property()
  createdAt: Date = new Date();

  @ManyToOne({
    entity: () => User,
    strategy: LoadStrategy.JOINED,
    comment: 'The author of the post',
  })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments = new Collection<Comment>(this);
}
