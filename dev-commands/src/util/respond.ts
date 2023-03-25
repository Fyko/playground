import type {
	AllowedMentionsTypes,
	APIActionRowComponent,
	APIActionRowComponentTypes,
	APIApplicationCommandAutocompleteResponse,
	APIApplicationCommandOptionChoice,
	APIEmbed,
	APIInteractionResponseChannelMessageWithSource,
	APIInteractionResponseDeferredChannelMessageWithSource,
} from 'discord-api-types/v10';
import { InteractionResponseType } from 'discord-api-types/v10';
import type { FastifyReply } from 'fastify';

export function createAutocompleteResponse(choices: APIApplicationCommandOptionChoice<number | string>[]) {
	return (res: FastifyReply) => {
		const data = {
			type: InteractionResponseType.ApplicationCommandAutocompleteResult,
			data: {
				choices,
			},
		} as APIApplicationCommandAutocompleteResponse;
		console.dir(data);
		return res.status(200).send(data);
	}
}

export function createResponse(
	content: string,
	ephemeral = false,
	{
		components,
		embeds,
		users,
		parse,
	}: {
		components?: APIActionRowComponent<APIActionRowComponentTypes>[];
		embeds?: APIEmbed[];
		parse?: AllowedMentionsTypes[];
		users?: string[];
	} = {},
) {
	return (res: FastifyReply) =>
		res.status(200).send({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				components,
				content,
				embeds,
				flags: ephemeral ? 64 : 0,
				allowed_mentions: { parse, users },
			},
		} as APIInteractionResponseChannelMessageWithSource);
}

export function defer() {
	return (res: FastifyReply) =>
		res.status(200).send({
			type: InteractionResponseType.DeferredChannelMessageWithSource,
			data: {
				flags: 64,
			},
		} as APIInteractionResponseDeferredChannelMessageWithSource);
}
