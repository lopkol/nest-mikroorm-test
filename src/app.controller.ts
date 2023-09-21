import {
  Body,
  Controller,
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
import { MethodConfig } from './entities/method-config.entity';
import {
  UpdatePaymentConfigDto,
  UpdatePaymentMethodConfigDto,
} from './dtos/update-payment-config.dto';
import { PaymentConfigRepository } from './repositories/payment-config.repository';
import { MethodConfigRepository } from './repositories/method-config.repository';
import { Gateway } from './entities/gateway.entity';

@Controller()
export class AppController {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(PaymentConfig)
    private readonly paymentConfigRepository: PaymentConfigRepository,
    @InjectRepository(MethodConfig)
    private readonly methodConfigRepository: MethodConfigRepository,
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
    const paymentConfig = createPaymentConfigDto.createEntity();

    await Promise.all(
      createPaymentConfigDto.methods.map(
        async (methodConfigDto: CreatePaymentMethodConfigDto) => {
          const paymentMethodConfig = new PaymentMethodConfig();
          paymentMethodConfig.providerConfig = methodConfigDto.providerConfig;
          paymentMethodConfig.methodConfig =
            this.entityManager.getReference<MethodConfig>(MethodConfig, [
              createPaymentConfigDto.provider,
              methodConfigDto.method,
            ]);
          const gateway = await this.entityManager.findOne<Gateway>(Gateway, {
            name: methodConfigDto.gateway,
          });
          if (gateway) {
            paymentMethodConfig.gateway = gateway;
          }

          paymentConfig.methods.add(paymentMethodConfig);
          this.entityManager.persist(paymentMethodConfig);
        },
      ),
    );
    await this.entityManager.persistAndFlush(paymentConfig);
  }

  @Post('payment-config/:owner/:provider')
  @ApiParam({ name: 'provider', type: String })
  @ApiParam({ name: 'owner', type: String })
  @ApiBody({ type: UpdatePaymentConfigDto })
  async updatePaymentConfig(
    @Param('provider') provider: string,
    @Param('owner') owner: string,
    @Body() updatePaymentConfigDto: UpdatePaymentConfigDto,
  ) {
    const methodConfigsForProvider =
      await this.methodConfigRepository.findByProvider(provider);

    const paymentConfig0 =
      await this.paymentConfigRepository.findOneWithMethods(owner, provider);
    if (paymentConfig0) {
      paymentConfig0.walletReference = 'ABC';
      await this.entityManager.flush();
    }

    const paymentConfig = await this.paymentConfigRepository.findOneWithMethods(
      owner,
      provider,
    );

    if (!paymentConfig) {
      throw new NotFoundException();
    }

    const paymentMethodConfigs = paymentConfig.methods.getItems();
    for (const methodConfig of methodConfigsForProvider) {
      for (const gateway of methodConfig.supportedGateways.getItems()) {
        const existingPaymentMethodConfig = paymentMethodConfigs.find(
          (pmc: PaymentMethodConfig) =>
            pmc.methodConfig.method === methodConfig.method &&
            pmc.methodConfig.provider === methodConfig.provider &&
            pmc.gateway === gateway,
        );
        const updatePaymentMethodConfigDto =
          updatePaymentConfigDto.methods.find(
            (upmc: UpdatePaymentMethodConfigDto) =>
              upmc.method === methodConfig.method &&
              upmc.gateway === gateway.name,
          );

        if (updatePaymentMethodConfigDto) {
          if (existingPaymentMethodConfig) {
            // update existing payment method config
            existingPaymentMethodConfig.providerConfig =
              updatePaymentMethodConfigDto.providerConfig;
            this.entityManager.persist(existingPaymentMethodConfig);
          } else {
            // create new payment method config
            const paymentMethodConfig = new PaymentMethodConfig();
            paymentMethodConfig.providerConfig =
              updatePaymentMethodConfigDto.providerConfig;
            paymentMethodConfig.methodConfig = methodConfig;
            paymentMethodConfig.gateway = gateway;

            paymentConfig.methods.add(paymentMethodConfig);
            this.entityManager.persist(paymentMethodConfig);
          }
        }
      }
    }

    await this.entityManager.flush();
  }
}
