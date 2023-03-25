import { ApplicationCommandOptionType } from 'discord-api-types/v10';

const SqrtCommand = {
	name: 'sqrt',
	description: 'Finds the square root of a number.',
	options: [
		{
			name: 'number',
			description: 'The number to find the square root of.',
			type: ApplicationCommandOptionType.Integer,
			required: true,
			autocomplete: true,
		},
	],
} as const;

export default SqrtCommand;
