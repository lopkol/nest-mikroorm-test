import { Entity, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core';

@Entity()
export class ChildType {
  @PrimaryKey()
  foo: string;

  @PrimaryKey()
  boo: string;

  [PrimaryKeyType]?: [string, string];

  @Property()
  data: string;
}
