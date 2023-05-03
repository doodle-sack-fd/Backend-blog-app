import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import {
	getMe,
	login,
	register,
} from '../server/app/controllers/user.controller.js';
import {
	createPost,
	getAllPosts,
	getOnePost,
	getTags,
	removePost,
	updatePost,
} from './app/controllers/post.controller.js';

import checkAuth from './app/utils/check-auth.middleware.js';
import handleValidation from './app/utils/handle.validation.js';

import { loginValidation, registerValidation } from './app/validations/auth.js';
import { PostCreateValidation } from './app/validations/post.js';

dotenv.config();

mongoose
	.connect(process.env.BASE_URL)
	.then(() => console.log('ok'))
	.catch(error => console.log('not ok', error));

const app = express();

/* Where save and state.filename */
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({
	storage,
});
/* Cors for disabled blocked port  */
app.use(express.json());
app.use(cors());
/* For open file.img */
app.use('/uploads', express.static('uploads'));

async function main() {
	app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
		res.json({
			/* Take path */
			url: `/uploads/${req.file.originalname}`,
		});
	});

	/* TODO:   Auth user  */

	app.post('/login', loginValidation, handleValidation, login);

	/* TODO:   Register user  */
	app.post('/register', registerValidation, handleValidation, register);

	/* TODO: Get info about us */
	app.get('/me', checkAuth, getMe);

	/* TODO: CreatePost */
	app.post(
		'/posts',
		checkAuth,
		PostCreateValidation,
		handleValidation,
		createPost,
	);

	/* TODO: GetAllPosts */
	app.get('/posts', getAllPosts);

	/* TODO: GetTags */
	app.get('/tags', getTags);

	/* TODO: GetTags */
	app.get('posts/tags', getTags);

	/* TODO: GetOnePost */
	app.get('/posts/:id', getOnePost);

	/* TODO: DeletePost */
	app.delete('/posts/:id', checkAuth, removePost);

	/* TODO: UpdatePost */
	app.patch(
		'/posts/:id',
		checkAuth,
		PostCreateValidation,
		handleValidation,
		updatePost,
	);

	const PORT = process.env.PORT || 4000;

	app.listen(PORT, err => {
		if (err) {
			return console.log(err);
		}
		console.log(`🚀 Server running in mode on port ${PORT}`);
	});
}

main();
