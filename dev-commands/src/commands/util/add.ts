import { Command } from '@yuudachi/framework';
import type { ArgsParam, CommandMethod, InteractionParam, InteractionType, Runtime } from '@yuudachi/framework/types';
import AddCommand from '#interactions/commands/util/add.js';
import { createResponse } from '#util/respond.js';

export default class extends Command<typeof AddCommand, Runtime.Raw> {
	public readonly data = AddCommand;

	public override async chatInput(
		_: InteractionParam<CommandMethod.ChatInput, InteractionType.ApplicationCommand, Runtime.Raw>,
		args: ArgsParam<typeof AddCommand>,
	) {
		// eslint-disable-next-line no-param-reassign
		const sum = Object.values(args).reduce((acc, val) => (acc += val), 0);
		return createResponse(`The sum is ${sum}.`, true);
	}
}
