import {
  Collection,
  Entity,
  Index,
  JsonType,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Post } from './post.entity';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  @Unique()
  uuid: string;

  @Property({ nullable: true })
  firstname: string;

  @Property({ nullable: true })
  lastname: string;

  @Property({ nullable: true })
  @Index({
    name: 'user_email_index',
    expression:
      'create index "user_email_index" on "user" ("email") where "email" is not null',
  })
  email: string;

  @Property({ nullable: true })
  phone: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: JsonType, nullable: true })
  metadata: Record<string, unknown>;

  @OneToMany(() => Post, (post) => post.author)
  posts = new Collection<Post>(this);
}
