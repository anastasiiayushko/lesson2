

// import {PostService} from "./features/post/service/postService";
import {PostRepository} from "./features/post/infrastructure/repositories/postRepository";
// import {PostQueryRepository} from "./features/post/dal/postQueryRepository";
// import {BlogRepository} from "./features/blog/dal/blogRepository";
// import {BlogQueryRepository} from "./features/blog/dal/blogQueryRepository";
// import {BlogService} from "./features/blog/blogService";
// import {BlogController} from "./features/blog/controllers/blogController";
// import {PostController} from "./features/post/controllers/postController";
//
const objects: any[] = []
//
// const postRepository = new PostRepository();
// objects.push(postRepository);
//
// const postQueryRepository = new PostQueryRepository();
// objects.push(postQueryRepository);
//
// const blogRepository = new BlogRepository();
// objects.push(blogRepository);
//
// const blogQueryRepository = new BlogQueryRepository();
// objects.push(blogQueryRepository);
//
// const postService = new PostService(postRepository, postQueryRepository, blogRepository);
// objects.push(postService);
//
// const blogService = new BlogService(blogRepository);
// objects.push(blogService);
//
// const blogController = new BlogController(postService, blogService, postQueryRepository, blogQueryRepository);
// objects.push(blogController);
//
// const postController = new PostController(postService, postQueryRepository);
// objects.push(postController);

export const ioc = {
    getInstance<T>(ClassType: any) {
        const targetInstance: T = objects.find(o => o instanceof ClassType);
        return targetInstance as T;
    }
}


