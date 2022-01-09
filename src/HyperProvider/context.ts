import { createContext } from 'react';

import { defaultConfig } from './config';

import type { THyperContext } from './types';

const HyperContext = createContext<THyperContext>({
	config: defaultConfig,
	setConfig: () => { }
});

export { HyperContext };