import { Method } from 'axios';

type RequestError = undefined | boolean | Error;

type Status = 'success' | 'error' | 'pending' | 'idle';

// This is what the useHyper hook
// returns.
interface TUseHyperReturn {
	data: Object | undefined;
	status: Status;

	req: Promise<any> | undefined;
	error: RequestError;
	revalidate(): Promise<any>;
}

interface Config {
	prefix?: string;
	method?: Method;
	data?: any;
	revalidateOnFocus?: boolean;
	revalidateOnBlur?: boolean;
	maxRequests?: number;
	retries?: number;
	refreshInterval?: number;
}

type TUseHyper = (
	url: string,
	options: Config
) => TUseHyperReturn;

export type {
	RequestError,
	TUseHyper,
	TUseHyperReturn,
	Status,
	Config
}