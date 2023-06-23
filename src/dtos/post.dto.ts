import { UserDto } from './user.dto';
import { Post } from '../entities/post.entity';

export class PostDto {
  uuid: string;
  title: string;
  content: string;
  createdAt: Date;
  author?: UserDto;

  public static createFromEntity(post: Post): PostDto {
    const dto = new PostDto();
    dto.uuid = post.uuid;
    dto.title = post.title;
    dto.content = post.content;
    dto.createdAt = post.createdAt;

    return dto;
  }
}
