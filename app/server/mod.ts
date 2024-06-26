import { load } from './src/main.ts';
import { load as loadEnv } from 'loadenv';

await loadEnv();
await load();
