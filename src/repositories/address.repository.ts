import { EntityRepository } from '@mikro-orm/postgresql';
import { Address } from '../entities/address.entity';

export class AddressRepository extends EntityRepository<Address> {}
