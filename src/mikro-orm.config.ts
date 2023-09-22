import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Address } from './entities/address.entity';
import { PaymentConfig } from './entities/payment-config.entity';
import { PaymentMethodConfig } from './entities/payment-method-config.entity';
import { LoadStrategy } from '@mikro-orm/core';
import { ProviderMethodConfig } from './entities/provider-method-config.entity';
import { Parent } from './entities/parent.entity';
import { Child } from './entities/child.entity';
import { ChildType } from './entities/child-type.entity';

export default defineConfig({
  driver: PostgreSqlDriver,
  dbName: 'mikroorm-test',
  host: 'localhost',
  port: 5432,
  user: 'dbadmin',
  password: 'UltimateDevPassword',
  debug: true,
  loadStrategy: LoadStrategy.JOINED,
  // for now, we have to import entities manually to make CLI work...
  // solution: write our own CLI which can use the config we construct in the code
  // -> so we can use autoLoadEntities
  entities: [
    User,
    Post,
    Comment,
    Address,
    PaymentConfig,
    PaymentMethodConfig,
    ProviderMethodConfig,
    Parent,
    Child,
    ChildType,
  ],
  migrations: {
    tableName: 'migrations_history',
  },
});
