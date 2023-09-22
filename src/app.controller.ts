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
import { ProviderMethodConfig } from './entities/provider-method-config.entity';
import {
  UpdatePaymentConfigDto,
  UpdatePaymentMethodConfigDto,
} from './dtos/update-payment-config.dto';
import { PaymentConfigRepository } from './repositories/payment-config.repository';
import { ProviderMethodConfigRepository } from './repositories/provider-method-config.repository';
import { Parent } from './entities/parent.entity';

@Controller()
export class AppController {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(PaymentConfig)
    private readonly paymentConfigRepository: PaymentConfigRepository,
    @InjectRepository(ProviderMethodConfig)
    private readonly methodConfigRepository: ProviderMethodConfigRepository,
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

    createPaymentConfigDto.methods.map(
      (methodConfigDto: CreatePaymentMethodConfigDto) => {
        const paymentMethodConfig = new PaymentMethodConfig();
        paymentMethodConfig.providerConfig = methodConfigDto.providerConfig;
        paymentMethodConfig.providerMethodConfig =
          this.entityManager.getReference<ProviderMethodConfig>(
            ProviderMethodConfig,
            [createPaymentConfigDto.provider, methodConfigDto.method],
          );

        paymentConfig.methods.add(paymentMethodConfig);
        this.entityManager.persist(paymentMethodConfig);
      },
    );
    await this.entityManager.persistAndFlush(paymentConfig);
  }

  @Post('payment-config/:owner/:provider')
  @ApiParam({ name: 'provider', type: String })
  @ApiParam({ name: 'owner', type: String })
  // @ApiBody({ type: UpdatePaymentConfigDto })
  async updatePaymentConfig(
    @Param('provider') provider: string,
    @Param('owner') owner: string,
    // @Body() updatePaymentConfigDto: UpdatePaymentConfigDto,
  ) {
    // const providerMethodConfigs =
    //   await this.methodConfigRepository.findByProvider(provider);

    const paymentConfig0 = await this.paymentConfigRepository.findOne({
      ownerUuid: owner,
      provider,
    });
    if (!paymentConfig0) {
      throw new NotFoundException();
    }
    paymentConfig0.walletReference = 'ABC';
    await this.entityManager.flush();

    const paymentConfig = await this.paymentConfigRepository.findOneWithMethods(
      owner,
      provider,
    );
    if (!paymentConfig) {
      throw new NotFoundException();
    }
    paymentConfig.methods.getItems()[0].providerConfig = { enabled: true };
    await this.entityManager.flush();

    // const paymentMethodConfigs = paymentConfig.methods.getItems();
    // for (const providerMethodConfig of providerMethodConfigs) {
    //   const existingPaymentMethodConfig = paymentMethodConfigs.find(
    //     (pmc: PaymentMethodConfig) =>
    //       pmc.providerMethodConfig.method === providerMethodConfig.method &&
    //       pmc.providerMethodConfig.provider === providerMethodConfig.provider,
    //   );
    //   const updatePaymentMethodConfigDto = updatePaymentConfigDto.methods.find(
    //     (upmc: UpdatePaymentMethodConfigDto) =>
    //       upmc.method === providerMethodConfig.method,
    //   );
    //
    //   if (updatePaymentMethodConfigDto) {
    //     if (existingPaymentMethodConfig) {
    //       // update existing payment method config
    //       existingPaymentMethodConfig.providerConfig =
    //         updatePaymentMethodConfigDto.providerConfig;
    //       this.entityManager.persist(existingPaymentMethodConfig);
    //     } else {
    //       // create new payment method config
    //       const paymentMethodConfig = new PaymentMethodConfig();
    //       paymentMethodConfig.providerConfig =
    //         updatePaymentMethodConfigDto.providerConfig;
    //       paymentMethodConfig.providerMethodConfig = providerMethodConfig;
    //
    //       paymentConfig.methods.add(paymentMethodConfig);
    //       this.entityManager.persist(paymentMethodConfig);
    //     }
    //   }
    // }
    //
    // await this.entityManager.flush();
  }

  @Post('parent/:id')
  @ApiParam({ name: 'id', type: Number })
  async updateParent(@Param('id') id: number) {
    const parent = await this.entityManager.findOneOrFail(Parent, {
      uniqueProp: 'aaa',
    });

    parent.data = 'ppppppppppp';
    await this.entityManager.flush();

    const sameParent = await this.entityManager.findOneOrFail(
      Parent,
      { uniqueProp: 'aaa' },
      { populate: ['children', 'children.type'] },
    );

    sameParent.children.getItems()[0].data = 'eeeeeeeeeeee';
    sameParent.children.getItems()[1].data = 'wwwwwwwwwwww';
    await this.entityManager.flush();
  }
}
