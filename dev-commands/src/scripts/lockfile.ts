import 'reflect-metadata';

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { walk } from '#util/index.js';

export async function generateCommandsArray(): Promise<Record<string, unknown>[]> {
	const path = fileURLToPath(new URL('../interactions/commands', import.meta.url));
	const files = await walk(path);

	const commands: Record<string, unknown>[] = [];
	for (const file of files) {
		const { default: command } = await import(file);
		commands.push(command);
	}

	return commands;
}

export async function write(content: Record<string, unknown>[]) {
	return writeFile(join(process.cwd(), 'commands.lock.json'), JSON.stringify(content, null, 2));
}

async function main() {
	const commands = (await generateCommandsArray()).filter((cmd) => !cmd.dev);
	return write(commands);
}

void main();
