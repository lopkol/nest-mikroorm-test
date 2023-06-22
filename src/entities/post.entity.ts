import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  TextType,
  Unique,
} from '@mikro-orm/core';
import { User } from './user.entity';

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

  @ManyToOne(() => User)
  author: User;
}
