/*
*  Storage is currently not used. It may later
*  be used to manage query cache, but not yet.
*  It'll stay here until we decide otherwise.
*/

class Storage {
	key: string;

	constructor(key: string) {
		this.key = key;
	}

	#exists = () => {
		return window !== undefined && localStorage !== undefined;
	}

	#set = (v: any) => localStorage.setItem(this.key, v);

	get = () => {
		return this.#exists() ? localStorage.getItem(this.key) : undefined;
	}

	set = (v: any) => {
		if (this.#exists()) {
			typeof v === 'object' ? (
				this.#set(JSON.stringify(v))
			) : (
				this.#set(v)
			)

			return true;
		} else {
			return undefined;
		}
	}
};

export default Storage;