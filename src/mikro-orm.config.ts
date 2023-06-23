import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Address } from './entities/address.entity';

export default defineConfig({
  driver: PostgreSqlDriver,
  dbName: 'mikroorm-test',
  host: 'localhost',
  port: 5432,
  user: 'dbadmin',
  password: 'UltimateDevPassword',
  debug: true,
  // for now, we have to import entities manually to make CLI work...
  // solution: write our own CLI which can use the config we construct in the code
  // -> so we can use autoLoadEntities
  entities: [User, Post, Comment, Address],
  migrations: {
    tableName: 'migrations_history',
  },
});
