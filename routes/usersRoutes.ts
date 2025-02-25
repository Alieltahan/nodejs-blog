import UserController from "../controller/UserController";

const express = require("express");
const router = express.Router();

/**
 * @swagger
 * paths:
 * @route /api/users/signup
 * @get POST:
 * Summary: Gets list of blogs ( Optional filtration if passed query of category )
 * Responses:
 * 200:
 * description: A list of Blogs.
 * content:
 * application/json:
 * schema:
 * type: Array
 * data:
 * type: object
 * properties:
 * _id:
 * type: String
 * title:
 * type: string
 * content:
 * type: string
 * name:
 * category: string
 * createdAt:
 * type: Date
 * updatedAt:
 * type: Date
 */
router.route('/signup')
		.post(UserController.registerUser);

router.route('/auth')
		.post(UserController.authenticateUser);

module.exports = router;
