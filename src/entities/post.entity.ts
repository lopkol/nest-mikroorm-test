import {
  Collection,
  Entity,
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

@Entity()
export class Post {
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