import PostModel from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to create an article",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    /* .populate().exec()  communication with the user */
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to find an articles",
    });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;

    /*  Find post and increment */
    const updatePost = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {
          viewsCount: 1,
        },
      },
      {
        /* After refresh count - return new Doc */
        new: "true",
      }
    );

    if (!updatePost) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    res.json(updatePost);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to find an articles",
    });
  }
};
