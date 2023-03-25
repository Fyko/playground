import { extname } from 'node:path';
import { URL, fileURLToPath, pathToFileURL } from 'node:url';
import { commandInfo, dynamicImport, kCommands } from '@yuudachi/framework';
import { scan } from 'fs-nextra';
import { container } from 'tsyringe';
import { logger } from './logger.js';
import type { Command } from '#structures';

export async function walk(path: string) {
	return (
		await scan(path, {
			filter: (stats, path) => stats.isFile() && ['.js', '.ts'].includes(extname(stats.name)) && !path.includes('sub'),
		})
	).keys();
}

export async function loadCommands() {
	const files = await walk(fileURLToPath(new URL('../commands', import.meta.url)));

	const commands = container.resolve<Map<string, Command>>(kCommands);

	for (const file of files) {
		const cmdInfo = commandInfo(file);

		if (!cmdInfo) {
			continue;
		}

		const dynamic = dynamicImport<new () => Command>(async () => import(pathToFileURL(file).href));
		const command = container.resolve<Command>((await dynamic()).default);
		logger.info(
			`Registering command: ${command.name?.join(", ") ?? cmdInfo.name}`,
		);

		if (command.name) {
			for (const name of command.name) {
				commands.set(name.toLowerCase(), command);
			}
		} else {
			commands.set(cmdInfo.name.toLowerCase(), command);
		}
	}

	return true;
}
