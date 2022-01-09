import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import axios from 'axios';

import { useHyperProvider } from './HyperProvider';

import type {
	RequestError,
	TUseHyper,
	TUseHyperReturn,
	Status,
	Config
} from './types';

////////// Types

interface GoStateDispatchers {
	setStatus: Dispatch<SetStateAction<Status>>;
	setError: Dispatch<SetStateAction<RequestError>>;
	setData: Dispatch<SetStateAction<any>>;
}

interface TGo extends GoStateDispatchers {
	url: string;
	config: Config;
}

////////// Constants

const defaultConfig: Config = {
	method: 'get',
	data: {},
	revalidateOnFocus: true,
	revalidateOnBlur: false,
	maxRequests: 10,
	retries: 2,
};

////////// Methods

const withPrefix = (prefix: string | boolean = '', value: string) => {
	return prefix ? `${prefix}${value}` : value;
};

const go = ({
	url,
	config,

	setStatus,
	setError,
	setData
}: TGo) => axios({
	method: config.method,
	url: withPrefix(config.prefix, url),
	data: config.data
})
	.then(res => {
		if (res.data) {
			return res.data;
		} else {
			setStatus('error');
			setError(true);
			return {};
		}
	})
	.catch((err: Error) => {
		setStatus('error');
		setError(err);
		return err;
	})
	.then(data => {
		if (!(data instanceof Error)) {
			// Since the err is returned in the above
			// block, we need to double-check that it's
			// not an actual Error.
			setStatus('success');
			setData(data);
		}
		return data;
	});

//////////

const useHyper: TUseHyper = (
	url: string,
	instanceConfig: Config = {}
): TUseHyperReturn => {
	const { config: globalConfig } = useHyperProvider();

	// The global config object is a combination
	// of the default, global, and instance config
	// values.
	const config: Config = {
		...defaultConfig,
		...globalConfig,
		...instanceConfig
	};

	// This stores the current request. I don't know how
	// useful this will be to people, but whatever.
	const [req, setReq] = useState<Promise<any> | undefined>(undefined);

	// Arbitrarily the status of the request.
	const [status, setStatus] = useState<Status>('idle');

	// The data returned from the request.
	const [data, setData] = useState<any>(undefined);

	// If an error is thrown, this is populated with
	// the Error instance.
	const [error, setError] = useState<RequestError>(undefined);

	// The total number of requests in any given instance.
	// We use this value to potentially stop an infinite
	// loop of requests. This is particularly useful when
	// your browser tab becomes unresponsive due to the
	// frequency and quantity of requests.
	const [requestCount, setRequestCount] = useState(0);

	// The number of retries after an error.
	const [retryCount, setRetryCount] = useState(0);

	// Create a new base request object for the initial
	// request and for upcoming revalidations.
	const request = {
		url,
		config,
		setStatus,
		setError,
		setData
	};

	const revalidate = async () => {
		return go(request);
	};

	useEffect(() => {
		const max = config.retries || defaultConfig.retries || 2;

		if (error && status === 'error' && retryCount < max && max !== 0) {
			setRetryCount(retryCount + 1);
			setReq(go(request));
		}
	}, [error, status]);

	useEffect(() => {
		config.revalidateOnFocus && window.addEventListener('focus', revalidate);
		config.revalidateOnBlur && window.addEventListener('blur', revalidate);

		return () => {
			config.revalidateOnFocus && window.removeEventListener('focus', revalidate);
			config.revalidateOnBlur && window.removeEventListener('blur', revalidate);
		};
	}, []);

	useEffect(() => {
		const max = config.maxRequests || defaultConfig.maxRequests || 10;

		if (requestCount > max) {
			throw new Error(`Hyper: Request count exceeded ${max}. Make sure you are not calling useHyper infinitely.`);
		}

		setRequestCount(requestCount + 1);
		setReq(go(request));
	}, []);

	return {
		data,
		status,
		req,
		error,
		revalidate,
	};
};

export default useHyper;