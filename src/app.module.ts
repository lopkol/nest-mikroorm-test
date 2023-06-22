import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import mikroOrmConfig from './mikro-orm.config';
import { MikroORM } from '@mikro-orm/core';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      // autoLoadEntities: true,
      ...mikroOrmConfig,
    }),
    MikroOrmModule.forFeature([User]),
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
