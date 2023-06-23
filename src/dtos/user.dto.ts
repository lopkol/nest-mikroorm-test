import { AddressDto } from './address.dto';
import { PostDto } from './post.dto';
import { User } from '../entities/user.entity';

export class UserDto {
  uuid: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  address?: AddressDto;
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
