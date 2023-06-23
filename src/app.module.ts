import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { MikroORM } from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Address } from './entities/address.entity';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      // autoLoadEntities: true,
      ...mikroOrmConfig,
    }),
    MikroOrmModule.forFeature([User, Post, Comment, Address]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    // if the db doesn't exist then we get the error 'MikroORM failed to connect to database mikroorm-test'
    // try {
    //   await this.orm
    //     .getSchemaGenerator()
    //     .createDatabase(mikroOrmConfig.dbName ?? '');
    // } catch (ignored) {
    //   // do nothing, this means that db already exists
    // }

    // Run migrations at app start:
    await this.orm.getMigrator().up();
  }
}
