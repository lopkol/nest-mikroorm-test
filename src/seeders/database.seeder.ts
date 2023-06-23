import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PostFactory } from '../factories/post.factory';
import { UserFactory } from '../factories/user.factory';
import { CommentFactory } from '../factories/comment.factory';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { AddressFactory } from '../factories/address.factory';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = new UserFactory(em)
      .each((user) => {
        user.posts.set(new PostFactory(em).make(3));
        user.address = new AddressFactory(em).makeOne();
      })
      .make(10);

    const posts = await em.find(Post, {});

    const commentsOnPosts = new CommentFactory(em)
      .each((comment) => {
        comment.author = this.getRandomElement<User>(users);
        comment.post = this.getRandomElement<Post>(posts);
      })
      .make(50);

    new CommentFactory(em)
      .each((comment) => {
        comment.author = this.getRandomElement<User>(users);
        comment.parent = this.getRandomElement<Comment>(commentsOnPosts);
      })
      .make(60);
  }

  private getRandomElement<T>(arr: T[]): T {
    const index = this.getRandomInt(arr.length);
    return arr[index];
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
