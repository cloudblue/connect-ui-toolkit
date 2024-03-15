import { cpus } from 'node:os';

import componentsConfig from './components/webpack.config.js';
import toolsConfig from './tools/webpack.config.js';

// Calculate how many parallel builds can be done. Minimum is 1, otherwise it's the amount of cores
// available, maxing at 4.
const cpuCount = cpus().length || 1;
const parallelBuildsNum = Math.min(cpuCount, 4);

export default [componentsConfig, toolsConfig];
export const parallelism = parallelBuildsNum;
