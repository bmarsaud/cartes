import {defineCollection, z} from "astro:content";
import fs from 'node:fs';

const MAPS_PATH = './src/pages/cartes/';
const maps = defineCollection({
    loader: () => {
        const fileNames: string[] = fs.readdirSync(MAPS_PATH);
        return fileNames.map((fileName: string) => {
           const content: string = fs.readFileSync(MAPS_PATH + fileName, 'utf8');
           return {
               id: fileName.split('.')[0],
               ...JSON.parse('{' + content.split('const map = {')[1].split('}')[0] + '}'),
           }
        });
    },
    schema: z.object({
        title: z.string(),
        abstract: z.string(),
        description: z.string(),
        date: z.string()
    }),
});

export const collections = { maps };
