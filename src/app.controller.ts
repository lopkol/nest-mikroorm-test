import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './dtos/user.dto';
import { ApiParam } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { InjectRepository } from '@mikro-orm/nestjs';

@Controller()
export class AppController {
  constructor(
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
}
