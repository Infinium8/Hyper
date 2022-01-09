import React, { useEffect } from 'react';
import useHyper from '@infinium/hyper';

const Card = ({ title, author }) => (
	<div className='j-card'>
		<div className="j-card-content">
			<h5>{title}</h5>
			<p>{author}</p>
		</div>
	</div>
);

const Posts = () => {
	const { status, data, error, req } = useHyper('/posts');

	useEffect(() => {
		console.log({ status });
	}, [status]);

	useEffect(() => {
		console.log({ data });
	}, [data]);

	useEffect(() => {
		console.log({ req });

		req && req.then(data => console.log('data', data))
	}, [req]);

	if (error) {
		return <p>ERROR!!!</p>
	}

	if (!data) {
		return <p>Loading...</p>;
	}

	return (
		<div className='container'>
			<h2>Posts</h2>
			<div className="grid grid-5">
				{data.map(e => <Card key={e.id} title={e.title} author={e.author} />)}
			</div>
		</div>
	);
};

export default Posts;
