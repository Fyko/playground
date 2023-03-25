import process from 'node:process';
import { inlineCode } from '@discordjs/builders';
import { Command } from '@yuudachi/framework';
import type { ArgsParam, CommandMethod, InteractionParam, InteractionType, Runtime } from '@yuudachi/framework/types';
import { stripIndents } from 'common-tags';
import type { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';
import type SqrtCommand from '#interactions/commands/util/sqrt.js';
import { createAutocompleteResponse, createResponse } from '#util/respond.js';

export default class extends Command<typeof SqrtCommand, Runtime.Raw> {
	public override async autocomplete(_: APIApplicationCommandAutocompleteInteraction, args: ArgsParam<typeof SqrtCommand>) {
		if (!args.number) return createAutocompleteResponse([1, 3, 5, 7].map((value) => ({ name: `sqrt(${value}) (${Math.sqrt(value)})`, value })));
		const sqrt = Math.sqrt(args.number);

		return createAutocompleteResponse([{ name: `sqrt(${args.number}) (${sqrt})`, value: args.number }]);
	}

	public override async chatInput(
		_: InteractionParam<CommandMethod.ChatInput, InteractionType.ApplicationCommand, Runtime.Raw>,
		args: ArgsParam<typeof SqrtCommand>,
	) {
		const start = process.hrtime();
		const sqrt = Math.sqrt(args.number);
		const stop = process.hrtime(start);

		return createResponse(
			stripIndents`
			The square root of ${inlineCode(args.number.toString())} is ${inlineCode(sqrt.toString())}.
			Took ${inlineCode(`${(stop[0] * 1e9 + stop[1]) / 1e6}ms`)} to calculate.
		`,
			false,
		);
	}
}
