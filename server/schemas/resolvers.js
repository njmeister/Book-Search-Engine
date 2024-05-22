const { saveBook } = require('../controllers/user-controller');
const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
	Query: {
		me: async (parent, { userId }) => {
			return User.findOne({ _id: userId });
		},
		users: async () => {
			return User.find();
		},
	},

	Mutation: {
		addUser: async (parent, { username, email, password }) => {
			console.log(`username: ${username}, email: ${email}, password: ${password}`)

			try {
				const user = await User.create({ username, email, password });
				console.log('user created: ', user)
				const token = signToken(user);
				console.log('token created: ', token);

				return { token, user };
			} catch (err) {
				console.log(err.message);
				throw err
			}
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
				return updatedUser;
			} catch (err) {
				console.log(err);
				throw new Error('Could not save book');
			}
		},

		removeBook: async (parent, { user, params }) => {
			const updatedUser = await User.findOneAndUpdate(
				{ _id: user._id },
				{ $pull: { savedBooks: { bookId: params.bookId } } },
				{ new: true }
			);
			if (!updatedUser) {
				throw new Error('Could not find user with this id!');
			}
			return updatedUser;
		},
	}
};

module.exports = resolvers;