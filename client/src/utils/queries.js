import { gql } from '@apollo/client';

export const GET_ME = gql`
	query me ($userId: String!) {
		me(userId: $userId) {
			_id
			username
			email
			bookCount
			savedBooks {
				bookId
				authors
				description
				title
				image
				link
			}
		}
	}
`;
