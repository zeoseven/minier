import core from './core.js';
import { initConfig } from './more.js';

const minier = async (config) => {
  await core(
    initConfig(config || {})
  );
};

export default minier;