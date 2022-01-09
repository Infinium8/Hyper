import React, { useState } from 'react';

import { HyperContext } from './context';
import { defaultConfig } from './config';

import type { THyperContext, THyperProvider } from './types';
import type { Config } from '../types';

const HyperProvider = ({ config, children }: THyperProvider) => {
	const [hyperConfig, setHyperConfig] = useState<Config>({
		...defaultConfig,
		...config
	});

	const value: THyperContext = {
		config: hyperConfig,
		setConfig: setHyperConfig
	};

	return (
		<HyperContext.Provider value={value}>
			{children}
		</HyperContext.Provider>
	);
};

export { HyperProvider };
