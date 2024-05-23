import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';

import Auth from '../utils/auth';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
	const token = Auth.loggedIn() ? Auth.getToken() : null;
	const decoded = jwtDecode(token);
	const userId = decoded.data._id;

	console.log('Decoded: ', decoded);
	console.log('User ID: ', userId);

	const [userData, setUserData] = useState({});
	const { loading, data } = useQuery(GET_ME, {
		variables: { userId: userId },
	});

	useEffect(() => {
		if (data) {
			setUserData(data.me);
		}
	}, [data]);

	console.log('User Data: ', userData);

	// use this to determine if `useEffect()` hook needs to run again
	const userDataLength = Object.keys(userData).length;

	const [removeBook] = useMutation(REMOVE_BOOK);



	// create function that accepts the book's mongo _id value as param and deletes the book from the database
	const handleRemoveBook = async (bookId) => {
		try {
			const { data } = await removeBook({
				variables: { userId: userId, bookId: bookId },
			});

			console.log('Data: ', data);

			const updatedUser = data.removeBook;
			setUserData(updatedUser);
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

	return (
		<>
			<div fluid className="text-light bg-dark p-5">
				<Container>
					<h1>Viewing saved books!</h1>
				</Container>
			</div>
			<Container>
				<h2 className="pt-5">
					{userData.savedBooks.length
						? `Viewing ${userData.savedBooks.length} saved ${
								userData.savedBooks.length === 1 ? 'book' : 'books'
						  }:`
						: 'You have no saved books!'}
				</h2>
				<Row>
					{userData.savedBooks.map((book) => {
						return (
							<Col md="4">
								<Card key={book.bookId} border="dark">
									{book.image ? (
										<Card.Img
											src={book.image}
											alt={`The cover for ${book.title}`}
											variant="top"
										/>
									) : null}
									<Card.Body>
										<Card.Title>{book.title}</Card.Title>
										<p className="small">Authors: {book.authors}</p>
										<Card.Text>{book.description}</Card.Text>
										<Button
											onClick={() =>
												(window.location.href = `https://www.google.com/books/edition/_/${book.bookId}`)
											}
										>
											See on Google
										</Button>
										<Button
											className="btn-block btn-danger"
											onClick={() => handleRemoveBook(book.bookId)}
										>
											Delete this Book!
										</Button>
									</Card.Body>
								</Card>
							</Col>
						);
					})}
				</Row>
			</Container>
		</>
	);
};

export default SavedBooks;
