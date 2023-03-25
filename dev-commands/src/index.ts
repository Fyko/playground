import 'reflect-metadata';

import crypto from 'node:crypto';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import process from 'node:process';
import { REST } from '@discordjs/rest';
import { container, createCommands, kCommands, transformApplicationInteractionRaw } from '@yuudachi/framework';
import type { APIGuildInteraction, APIInteraction, RESTGetAPIUserResult } from 'discord-api-types/v10';
import { InteractionType } from 'discord-api-types/v10';
import { verify } from 'discord-verify/node';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastify from 'fastify';
import type { Command } from './structures/Command.js';
import { loadCommands } from './util/index.js';
import { logger } from '#logger';
import { isGuildAutocomplete, isGuildChatInput } from '#util/guards.js';
import { createResponse } from '#util/respond.js';

createCommands();

declare global {
	namespace NodeJS {
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface ProcessEnv {
			DISCORD_APPLICATION_ID: string;
			DISCORD_DEV_SERVER_ID: string;
			DISCORD_PUBLIC_KEY: string;
			DISCORD_TOKEN: string;
			PORT: string;
		}
	}
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

async function verifyWebhook(req: FastifyRequest, reply: FastifyReply, done: () => void) {
	const signature = req.headers['x-signature-ed25519'];
	const timestamp = req.headers['x-signature-timestamp'];
	const rawBody = JSON.stringify(req.body);

	if (!signature || !timestamp) return reply.status(401).send();

	const isValid = await verify(
		rawBody,
		signature as string,
		timestamp as string,
		process.env.DISCORD_PUBLIC_KEY,
		crypto.webcrypto.subtle,
	);

	if (!isValid) return reply.status(401).send();

	const initial = req.body as APIInteraction;
	if (initial.type === InteractionType.Ping) {
		return reply.status(200).header('Content-Type', 'application/json').send({ type: InteractionType.Ping });
	}

	if (!('guild_id' in initial)) {
		return createResponse('This bot can only be used in servers.', true)(reply);
	}

	done();
}

async function start() {
	logger.debug('Starting...');
	await loadCommands();

	const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify();
	const commands = container.resolve<Map<string, Command>>(kCommands);

	server.post('/api/interactions', { preHandler: verifyWebhook }, async (req, res) => {
		try {
			const interaction = req.body as APIGuildInteraction;

			if (isGuildChatInput(interaction)) {
				const name = interaction.data.name;
				const command = commands.get(name);
				if (command?.chatInput) {
					const user = interaction.member.user;
					const info = `command "${name}"; triggered by ${user?.username}#${user?.discriminator} (${user?.id})`;
					logger.info(`Executing ${info}`);

					try {
						await (
							await command.chatInput(
								interaction,
								transformApplicationInteractionRaw(interaction.data.options!),
								interaction.locale,
							)
						)(res);
						logger.info(`Successfully executed ${info}`);
					} catch (error) {
						logger.error(`Failed to execute ${info}`);
						logger.error(error);
						logger.error(interaction);
					}
				}
			}

			if (isGuildAutocomplete(interaction)) {
				const name = interaction.data.name;
				const command = commands.get(name);
				if (command?.autocomplete) {
					const user = interaction.member.user;
					const info = `command "${name}"; triggered by ${user?.username}#${user?.discriminator} (${user?.id})`;
					logger.info(`Executing ${info}`);

					try {
						await (
							await command.autocomplete(
								interaction,
								transformApplicationInteractionRaw(interaction.data.options),
								interaction.locale,
							)
						)(res);
						logger.info(`Successfully executed ${info}`);
					} catch (error) {
						logger.error(`Failed to execute ${info}`);
						logger.error(error);
						logger.error(interaction);
					}
				}
			}
		} catch {}
	});

	const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 2_399;

	const me = (await rest.get('/users/@me')) as RESTGetAPIUserResult;

	const address = await server.listen({ port, host: '0.0.0.0' });
	logger.info(`Server started at ${address}`);
	logger.info(`token provided for ${me.username}#${me.discriminator} (${me.id})`);
}

void start();
