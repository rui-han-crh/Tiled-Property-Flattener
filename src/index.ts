import minimist from 'minimist';
import * as TiledProjectParser from './parsers/tiled_project_parser.js';
import * as TiledMapParser from './parsers/tiled_map_parser.js';
import * as fs from 'fs';

// Read in the arguments.
const args = minimist(process.argv.slice(2));

console.log(args);

// Get the project file.
const projectFile = args.projectFile ?? args.p;

const USAGE_PROMPT = 'Usage: node parse -p <PROJECT_FILE_PATH> -m <MAP_FILE_PATH> -o <OUTPUT_FILE>';

if (projectFile === undefined) {
    console.log('No project file specified.');
    console.log(USAGE_PROMPT);
    process.exit(1);
}

// Get the map file.
const mapFile = args.mapFile ?? args.m;

if (mapFile === undefined) {
    console.log('No map file specified.');
    console.log(USAGE_PROMPT);
    process.exit(1);
}

// Get the output file.

const outputFile = args.output ?? args.o;

if (outputFile === undefined) {
    console.log('No output file specified.');
    console.log(USAGE_PROMPT);
    process.exit(1);
}

// Read in the project file data and convert it to JSON.
const projectFileData = JSON.parse(fs.readFileSync(projectFile, 'utf8'));

// Parse the project file, so we can reference the classes and enums defined in it.
const projectParsedResult = TiledProjectParser.parse(projectFileData);

// Then, parse the map file, referencing the project parsed result.
const mapFileData = JSON.parse(fs.readFileSync(mapFile, 'utf8'));

const mapParsedResult = TiledMapParser.parse(mapFileData, projectParsedResult);

// Write the parsed result to the output file.
fs.writeFileSync(outputFile, mapParsedResult.toJson());

console.log('Done!');
