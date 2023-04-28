import bcrypt from 'bcrypt';

import { generateToken } from '../utils/generate.token.js';

import UserModel from '../models/User.js';

/* TODO:   Register user  
   TODO:   ./register
*/
export const register = async (req, res) => {
	try {
		/* Encryption password */
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		/* Our password + algorithm */
		const hash = await bcrypt.hash(password, salt);

		/* Document for user */
		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		});
		/* Save doc in baseData */
		const user = await doc.save();

		/* Checking token */
		const token = generateToken(user._id);

		const { passwordHash, ...userData } = user._doc;
		res.json({
			...userData,
			token,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Registration error',
		});
	}
};

/* TODO:   Auth user  
   TODO:   ./login
*/

export const login = async (req, res) => {
	try {
		/* User in baseData? */
		const user = await UserModel.findOne({
			email: req.body.email,
		});

		if (!user) {
			return res.status(404).json({
				message: 'baseData is empty, user is not found',
			});
		}

		const isValidPassword = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash,
		);

		if (!isValidPassword) {
			return res.status(404).json({
				message: 'Password is not defined',
			});
		}

		const token = generateToken(user._id);

		const { passwordHash, ...userData } = user._doc;
		res.json({
			...userData,
			token,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Authorization error',
		});
	}
};

/* TODO:   Get me  
   TODO:   ./me
*/

export const getMe = async (req, res) => {
	const user = await UserModel.findById(req.userId);

	try {
		if (!user) {
			res.status(404).json({
				message: 'User is not find in baseData',
			});
		}

		const { passwordHash, ...userData } = user._doc;
		res.json({
			...userData,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'No access',
		});
	}
};
