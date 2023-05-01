import { body } from 'express-validator';

export const PostCreateValidation = [
	body('title', 'Set title, min: 3 chars').isLength({ min: 5 }).isString(),
	body('text', 'Set text').isLength({ min: 5 }).isString(),
	body('tags', 'Format, must be array').optional().isString(),
	body('imageUrl', "Link doesn't work").optional().isString(),
];
