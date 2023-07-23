const mongoose = require("mongoose");
const createError = require("http-errors");
const client = require("../configs/redis.config");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const { isObjectId } = require("../middlewares/validate");
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, tags, picture, pictureKey, isDel } = req.body;
    if (isDel === true) {
      await Post.deleteMany({});
    }
    const author = req.user._id;
    const post = await Post.create({
      title,
      content,
      tags,
      picture: picture,
      author,
      pictureKey: pictureKey,
    });
    const cache = await post.populate("author", "username picture");
    await client.rpush("posts", JSON.stringify(cache));

    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    next(err);
  }
};
exports.getPosts = async (req, res, next) => {
  try {
    const postsCache = await client.lrange("posts", 0, -1);
    if (postsCache.length > 0) {
      return res.status(200).json({
        message: "Posts fetched successfully",
        posts: postsCache.map((post) => JSON.parse(post)),
      });
    }
    const posts = await Post.find({}).populate("author", "username picture");
    if (posts.length > 0) {
      await client.rpush("posts", ...posts.map((post) => JSON.stringify(post)));
    }
    res.status(200).json({ message: "Posts fetched successfully", posts });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const postCache = await client.get(`post:${id}`);
    if (postCache) {
      return res.status(200).json({
        message: "Post fetched successfully",
        post: JSON.parse(postCache),
      });
    }
    const post = await Post.findById(id).populate("author", "username picture");
    if (!post) throw next(createError.NotFound("Post not found"));
    await client.set(`post:${id}`, JSON.stringify(post));
    res.status(200).json({ message: "Post fetched successfully", post });
  } catch (err) {
    next(err);
  }
};
exports.updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content, tags, imgUrl } = req.body;
    const author = req.user._id;

    if (!isObjectId(postId))
      throw next(createError.NotFound(`No post with id: ${postId}`));
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, author: author },
      { title, content, tags, imgUrl },
      { new: true }
    );

    if (!updatedPost)
      throw next(createError.NotFound(`No post found with id: ${postId}`));

    if (updatedPost.author.toString() !== author)
      throw next(createError.Unauthorized());

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const author = req.user._id;
    if (!isObjectId(postId))
      throw next(createError.NotFound(`No post with id: ${postId}`));
    const post = await Post.findOneAndDelete({ _id: postId, author: author });
    if (!post) throw next(createError.NotFound("Post not found"));
    if (post.author.toString() !== author)
      throw next(createError.Unauthorized());
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};
exports.likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!isObjectId(postId))
      throw createError.NotFound(`No post with id: ${postId}`);

    let message;

    const post = await Post.findById(postId);
    if (!post) throw createError.NotFound(`No post with id: ${postId}`);

    const hasLiked = post.likes.includes(userId);
    const hasDisliked = post.dislikes.includes(userId);

    if (hasDisliked) {
      post.dislikes.pull(userId);
      post.likes.push(userId);
      message = "Post liked successfully";
    } else if (hasLiked) {
      post.likes.pull(userId);
      message = "Post unliked successfully";
    } else {
      post.likes.push(userId);
      message = "Post liked successfully";
    }

    const updatedPost = await post.save();

    res.status(200).json({ message, updatedPost });
  } catch (err) {
    next(err);
  }
};
exports.dislikePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!isObjectId(postId))
      throw createError.NotFound(`No post with id: ${postId}`);

    let message;
    const post = await Post.findById(postId);
    if (!post) throw createError.NotFound(`No post with id: ${postId}`);

    const hasLiked = post.likes.includes(userId);
    const hasDisliked = post.dislikes.includes(userId);
    if (hasLiked) {
      post.likes.pull(userId);
      post.dislikes.push(userId);
      message = "Post disliked successfully";
    } else if (hasDisliked) {
      post.dislikes.pull(userId);
      message = "Post undisliked successfully";
    } else {
      post.dislikes.push(userId);
      message = "Post disliked successfully";
    }
    const updatedPost = await post.save();
    res.status(200).json({ message, updatedPost });
  } catch (err) {
    next(err);
  }
};
exports.favoritePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!isObjectId(postId))
      return res.status(404).send(`No post with id: ${postId}`);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send(`No user with id: ${userId}`);
    }

    const isPostFavorited = user.favorites.includes(postId);

    const update = isPostFavorited
      ? { $pull: { favorites: postId } }
      : { $push: { favorites: postId } };

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
      upsert: true,
    });

    const message = isPostFavorited
      ? "Post unfavorited successfully"
      : "Post favorited successfully";

    res.status(200).json({ message, updatedUser });
  } catch (err) {
    throw err;
  }
};
exports.getFavoritePosts = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(404).send(`No user with id: ${userId}`);
    const user = await User.findById(userId);
    const posts = await Post.find({ _id: { $in: user.favorites } });
    res
      .status(200)
      .json({ message: "Favorite posts fetched successfully", posts });
  } catch (err) {
    throw err;
  }
};
exports.getUserPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ author: { $in: userId } });
    res.status(200).json({ message: "Posts fetched successfully", posts });
  } catch (err) {
    throw err;
  }
};
