import { AddressDto } from './address.dto';
import { PostDto } from './post.dto';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  firstname?: string;

  @ApiProperty()
  lastname?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  address?: AddressDto;

  @ApiProperty({ type: () => [PostDto] })
  posts?: PostDto[];

  public static createFromEntity(user: User): UserDto {
    const dto = new UserDto();
    dto.uuid = user.uuid;
    dto.firstname = user.firstname;
    dto.lastname = user.lastname;
    dto.email = user.email;
    dto.phone = user.phone;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    dto.address = AddressDto.createFromEntity(user.address);

    return dto;
  }

  public static async createFromEntityWithPosts(user: User): Promise<UserDto> {
    const dto = UserDto.createFromEntity(user);
    const postEntities = await user.posts.loadItems();
    dto.posts = postEntities.map(PostDto.createFromEntity);

    return dto;
  }
}
