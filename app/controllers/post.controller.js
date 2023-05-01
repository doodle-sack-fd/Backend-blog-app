import PostModel from '../models/Post.js';

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
			message: 'Failed to create an article',
		});
	}
};

export const getAllPosts = async (req, res) => {
	try {
		/* .populate().exec()  communication with the user */
		const posts = await PostModel.find().populate('user').exec();

		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to find an articles',
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
				new: 'true',
			},
		).populate('user');

		if (!updatePost) {
			return res.status(404).json({ message: 'Статья не найдена' });
		}

		res.json(updatePost);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to find an articles',
		});
	}
};

export const removePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const remove = await PostModel.findOneAndDelete({
			_id: postId,
		});

		res.json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to find an articles',
		});
	}
};

export const updatePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const update = await PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags,
			},
		);

		res.json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to update a article',
		});
	}
};

export const getTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();

		const tags = posts
			.map(obj => obj.tags)
			.flat()
			.slice(0, 5);

		res.json(tags);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to find an articles',
		});
	}
};
