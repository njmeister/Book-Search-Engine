const handleRemoveBook = async (bookId) => {
	const token = Auth.loggedIn() ? Auth.getToken() : null;

	if (!token) {
		return false;
	}

	try {
		const { data, errors } = await removeBook({
			variables: { bookId: bookId },
		});

		if (errors) {
			throw new Error('something went wrong!');
		}

		setUserData(data.removeBook);
		// upon success, remove book's id from localStorage
		removeBookId(bookId);
	} catch (err) {
		console.error(err);
	}
};

// if data isn't here yet, say so
if (!userDataLength) {
	return <h2>LOADING...</h2>;
}