import Parse from '../config/parse';

// Create a Parse class for Posts if it doesn't exist
const Post = Parse.Object.extend('Post');

// Posts API calls using Back4App
export const postsAPI = {
  getAllPosts: async () => {
    try {
      const query = new Parse.Query(Post);
      query.descending('createdAt');
      const posts = await query.find();
      return posts.map(post => ({
        id: post.id,
        title: post.get('title'),
        content: post.get('content'),
        category: post.get('category'),
        image: post.get('image')?.url(),
        author: post.get('author') || 'Admin',
        createdAt: post.get('createdAt')
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  getPostById: async (id) => {
    try {
      const query = new Parse.Query(Post);
      const post = await query.get(id);
      return {
        id: post.id,
        title: post.get('title'),
        content: post.get('content'),
        category: post.get('category'),
        image: post.get('image')?.url(),
        author: post.get('author') || 'Admin',
        createdAt: post.get('createdAt')
      };
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      const post = new Post();
      
      // Handle image upload if present
      if (postData.image instanceof File) {
        const parseFile = new Parse.File(postData.image.name, postData.image);
        await parseFile.save();
        post.set('image', parseFile);
      }

      // Set other post data
      post.set('title', postData.title);
      post.set('content', postData.content);
      post.set('category', postData.category);
      post.set('author', 'Admin'); // Since this is admin-only
      
      // Save the post
      await post.save();
      
      return {
        id: post.id,
        title: post.get('title'),
        content: post.get('content'),
        category: post.get('category'),
        image: post.get('image')?.url(),
        author: post.get('author'),
        createdAt: post.get('createdAt')
      };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const query = new Parse.Query(Post);
      const post = await query.get(id);

      // Handle image upload if present
      if (postData.image instanceof File) {
        const parseFile = new Parse.File(postData.image.name, postData.image);
        await parseFile.save();
        post.set('image', parseFile);
      }

      // Update other post data
      post.set('title', postData.title);
      post.set('content', postData.content);
      post.set('category', postData.category);
      
      // Save the post
      await post.save();
      
      return {
        id: post.id,
        title: post.get('title'),
        content: post.get('content'),
        category: post.get('category'),
        image: post.get('image')?.url(),
        author: post.get('author'),
        createdAt: post.get('createdAt')
      };
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const query = new Parse.Query(Post);
      const post = await query.get(id);
      await post.destroy();
      return { id };
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
}; 