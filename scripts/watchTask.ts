import path from 'path';
import sane from 'sane';
import { buildFn } from './buildFn';

const watcher = sane(path.join(__dirname, '../src'), { glob: ['**/*.ts'] });
watcher.on('ready', buildFn);
watcher.on('change', buildFn);
