import React, { useEffect } from 'react';
import useHyper from '@infinium/hyper';

const Comments = () => {
	const { status, data, error, req } = useHyper('/comments', { revalidateOnFocus: true });

	if (error) {
		return <p>ERROR!!!</p>
	}

	if (!data) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			{data.map(e => <p key={e.id}>{e.body}</p>)}
		</div>
	);
};

export default Comments;
