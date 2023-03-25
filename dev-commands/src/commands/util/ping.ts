import { Command } from '@yuudachi/framework';
import type { CommandMethod, InteractionParam, InteractionType, Runtime } from '@yuudachi/framework/types';
import type PingCommand from '#interactions/commands/util/ping.js';
import { createResponse } from '#util/respond.js';

export default class extends Command<typeof PingCommand, Runtime.Raw> {
	public override async chatInput(
		_: InteractionParam<CommandMethod.ChatInput, InteractionType.ApplicationCommand, Runtime.Raw>,
	) {
		const pongs = [
			'Uhh, hello?',
			"What can I do ya' for?",
			'Why are you bothering me?',
			'Mhm?',
			'Yea?',
			"What's with you puny humans and the constant desire to bother me?",
			'Out of everyone here, you chose to bother me?',
			'So *this* is the meaning of life?',
			'Can we just get this over with?? I have stuff to do.',
			"That's all?",
			'Pong!',
			'Do it again. I dare you.',
		];

		const content = pongs[Math.floor(Math.random() * pongs.length)];

		return createResponse(content, true);
	}
}
