import { useContext } from 'react';
import { HyperContext } from './context';

const useHyperProvider = () => useContext(HyperContext);

export { useHyperProvider };