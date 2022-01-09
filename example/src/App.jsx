import React from 'react';

import Posts from './Posts';
import Comments from './Comments';

const App = () => {
	return (
		<div className='w-100p h-screen flex-c bg-warmGray-100'>
			<Posts />
			<Comments />
		</div>
	);
};

export default App;
