// @ts-nocheck
import {preprocessMeltUI, sequence} from "@melt-ui/pp";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';


const config = {
    kit: {
      adapter: adapter(),
      prerender: {
        handleHttpError?: 'ignore',
        entries?: Array<'*' | `/${string}`>
      },
      paths: {
        base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
      }
    },
    preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
}

export default config;
// 