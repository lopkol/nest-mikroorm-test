import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Address {
  @PrimaryKey()
  id: number;

  @Property({ length: 120 })
  country: string;

  @Property({ length: 120 })
  postalCode: string;

  @Property({ length: 500 })
  city: string;

  @Property({ length: 1000 })
  line1: string;

  @Property({ length: 1000 })
  line2: string;
}
