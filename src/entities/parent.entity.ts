import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  PrimaryKeyType,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Child } from './child.entity';

@Entity()
export class Parent {
  @PrimaryKey()
  id: number;

  [PrimaryKeyType]?: number;

  @Property()
  @Unique()
  uniqueProp: string;

  @OneToMany({ entity: () => Child, mappedBy: 'parent' })
  children: Collection<Child> = new Collection<Child>(this, [], true);

  @Property()
  data: string;
}
