import { readdirSync } from 'node:fs';
import { render } from './render.js';

const pageFolderPath = './pages/';
const postFolderPath = './posts/';
const pageFiles = readdirSync(pageFolderPath);
const postFiles = readdirSync(postFolderPath);

pageFiles.forEach(fileName => render(pageFolderPath + fileName));
postFiles.forEach(fileName => render(postFolderPath + fileName));
