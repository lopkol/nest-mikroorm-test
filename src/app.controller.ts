import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './dtos/user.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { PostDto } from './dtos/post.dto';
import { EntityManager } from '@mikro-orm/core';
import { Comment } from './entities/comment.entity';
import {
  CreatePaymentConfigDto,
  CreatePaymentMethodConfigDto,
} from './dtos/create-payment-config.dto';
import { PaymentConfig } from './entities/payment-config.entity';
import { PaymentMethodConfig } from './entities/payment-method-config.entity';

@Controller()
export class AppController {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user/:uuid')
  @ApiParam({ name: 'uuid', type: String })
  async getUser(@Param('uuid') uuid: string): Promise<UserDto> {
    const user = await this.userRepository.getUserWithPosts(uuid);
    if (!user) {
      throw new NotFoundException();
    }

    return UserDto.createFromEntityWithPosts(user);
  }

  @Post('user/:uuid/post')
  @ApiParam({ name: 'uuid', type: String })
  @ApiBody({ type: PostDto })
  async createPost(
    @Param('uuid') userUuid: string,
    @Body() postDto: PostDto,
  ): Promise<PostDto> {
    const user = await this.userRepository.findOne(
      { uuid: userUuid },
      { populate: ['address'] },
    );
    if (!user) {
      throw new NotFoundException();
    }

    const newPost = PostDto.createEntity(postDto);
    await user.posts.init();
    user.posts.add(newPost);

    // random other stuff to test transaction:
    const newComment = new Comment();
    newComment.author = user;
    newComment.post = newPost;
    newComment.content = 'test comment';
    this.entityManager.persist(newComment);

    await this.entityManager.flush();

    return PostDto.createFromEntityWithUser(newPost);
  }

  @Post('payment-config')
  @ApiBody({ type: CreatePaymentConfigDto })
  async createPaymentConfig(
    @Body() createPaymentConfigDto: CreatePaymentConfigDto,
  ): Promise<void> {
    const paymentConfig = new PaymentConfig();
    paymentConfig.ownerUuid = createPaymentConfigDto.ownerUuid;
    paymentConfig.provider = createPaymentConfigDto.provider;
    paymentConfig.walletReference = createPaymentConfigDto.walletReference;

    createPaymentConfigDto.methodConfigs.forEach(
      (methodConfigDto: CreatePaymentMethodConfigDto) => {
        const methodConfig = new PaymentMethodConfig();
        methodConfig.method = methodConfigDto.method;
        methodConfig.network = methodConfigDto.network;

        paymentConfig.methodConfigs.add(methodConfig);
        this.entityManager.persist(methodConfig);
      },
    );
    await this.entityManager.persistAndFlush(paymentConfig);
  }

  @Delete('payment-config/:ownerUuid/:provider')
  @ApiParam({ type: String, name: 'ownerUuid' })
  @ApiParam({ type: String, name: 'provider' })
  async deletePaymentConfig(
    @Param('ownerUuid') ownerUuid: string,
    @Param('provider') provider: string,
  ): Promise<void> {
    const paymentConfig = await this.entityManager.findOne(
      PaymentConfig,
      {
        ownerUuid,
        provider,
      },
      { populate: ['methodConfigs'] },
    );

    if (paymentConfig) {
      await paymentConfig.methodConfigs.init();
      paymentConfig.methodConfigs
        .getItems()
        .forEach((methodConfig: PaymentMethodConfig) => {
          this.entityManager.remove(methodConfig);
        });

      await this.entityManager.remove(paymentConfig).flush();
    }
  }
}
