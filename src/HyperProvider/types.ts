import React, { Dispatch, SetStateAction } from 'react';

import type { Config } from '../types';

interface THyperProvider {
	config: Config;
	children: React.ReactNode;
}

interface THyperContext {
	config: Config;
	setConfig: Dispatch<SetStateAction<Config>>
}

export type {
	THyperProvider,
	THyperContext,
}