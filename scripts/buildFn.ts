import { buildSync, BuildOptions } from 'esbuild';

export const buildFn = (): void => {
    const buildOptions: BuildOptions = {
        platform: 'browser',
        entryPoints: ['src/index.ts'],
        outfile: 'dist/index.js',
        bundle: true,
    };

    buildSync(buildOptions);
};
