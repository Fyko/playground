import { ApplicationCommandOptionType } from 'discord-api-types/v10';

const AddCommand = {
	name: 'add',
	description: 'Adds numbers together.',
	options: [
		{
			name: 'first',
			description: 'A number to include in the sum.',
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
		{
			name: 'second',
			description: 'Another number to include in the sum.',
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
		{
			name: 'third',
			description: 'Another number to include in the sum.',
			type: ApplicationCommandOptionType.Integer,
			required: false,
		},
		{
			name: 'fourth',
			description: 'Another number to include in the sum.',
			type: ApplicationCommandOptionType.Integer,
			required: false,
		},
		{
			name: 'fifth',
			description: 'Another number to include in the sum.',
			type: ApplicationCommandOptionType.Integer,
			required: false,
		},
	],
} as const;

export default AddCommand;
