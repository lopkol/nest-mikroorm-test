import { UserDto } from './user.dto';
import { Post } from '../entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty()
  uuid?: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => UserDto })
  author?: UserDto;

  public static createFromEntity(post: Post): PostDto {
    const dto = new PostDto();
    dto.uuid = post.uuid;
    dto.title = post.title;
    dto.content = post.content;
    dto.createdAt = post.createdAt;

    return dto;
  }

  public static createFromEntityWithUser(post: Post): PostDto {
    const dto = PostDto.createFromEntity(post);
    if (post.author) {
      dto.author = UserDto.createFromEntity(post.author);
    }

    return dto;
  }

  public static createEntity(dto: PostDto): Post {
    const post = new Post();
    post.title = dto.title;
    post.content = dto.content;

    return post;
  }
}
