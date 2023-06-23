import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { AddressRepository } from '../repositories/address.repository';

@Entity({ customRepository: () => AddressRepository })
export class Address {
  [EntityRepositoryType]?: AddressRepository;

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

  @Property({ length: 1000, nullable: true })
  line2?: string;
}
