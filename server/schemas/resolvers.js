const { saveBook } = require('../controllers/user-controller');
const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
	Query: {
		me: async (parent, { userId }) => {
			return User.findOne({ _id: userId });
		},
	},

	Mutation: {
		createUser: async (parent, { username, email, password }) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);

			return { token, user };
		},

		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw AuthenticationError;
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw AuthenticationError;
			}

			const token = signToken(user);
			return { token, user };
		},

		saveBook: async (parent, { user, body }) => {
			console.log(user);
			try {
				const updatedUser = await User.findOneAndUpdate(
					{ _id: user._id },
					{ $addToSet: { savedBooks: body } },
					{ new: true, runValidators: true }
				);
				return res.json(updatedUser);
			} catch (err) {
				console.log(err);
				return res.status(400).json(err);
			}
		},

		removeBook: async (parent, { user, params }) => {
			const updatedUser = await User.findOneAndUpdate(
				{ _id: user._id },
				{ $pull: { savedBooks: { bookId: params.bookId } } },
				{ new: true }
			);
			if (!updatedUser) {
				return res.status(404).json({ message: "Couldn't find user with this id!" });
			}
			return res.json(updatedUser);
		},
	}
};