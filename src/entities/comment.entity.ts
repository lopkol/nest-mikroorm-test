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
import { Post } from './post.entity';
import { CommentRepository } from '../repositories/comment.repository';

@Entity({ customRepository: () => CommentRepository })
export class Comment {
  [EntityRepositoryType]?: CommentRepository;

  @PrimaryKey()
  id: number;

  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  @Unique()
  uuid: string;

  @Property({ type: TextType })
  content: string;

  @Property()
  createdAt: Date = new Date();

  @ManyToOne({
    entity: () => User,
    strategy: LoadStrategy.JOINED,
    comment: 'The author of the comment',
  })
  author: User;

  @ManyToOne({
    entity: () => Post,
    strategy: LoadStrategy.JOINED,
    nullable: true,
  })
  post: Post;

  @ManyToOne({
    entity: () => Comment,
    nullable: true,
  })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children = new Collection<Comment>(this);
}
