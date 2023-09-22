import { Parent } from './parent.entity';
import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { ChildType } from './child-type.entity';

@Entity()
export class Child {
  @ManyToOne({ entity: () => Parent, primary: true })
  parent: Parent;

  @ManyToOne({ entity: () => ChildType, primary: true })
  type: ChildType;

  [PrimaryKeyType]?: [Parent, ChildType];

  @Property()
  data: string;
}
