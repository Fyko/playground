import { ApplicationCommandType, InteractionType, ApplicationCommandOptionType } from 'discord-api-types/v10';
import type {
	APIContextMenuGuildInteraction,
	APIPingInteraction,
	APIApplicationCommandAutocompleteGuildInteraction,
	APIChatInputApplicationCommandGuildInteraction,
	APIGuildInteraction,
	APIInteraction,
	APIModalSubmitGuildInteraction,
} from 'discord-api-types/v10';

export function isPing(interaction: APIInteraction): interaction is APIPingInteraction {
	return interaction.type === InteractionType.Ping;
}

export function isGuild(interaction: APIInteraction): interaction is APIGuildInteraction {
	return Reflect.has(interaction, 'guild_id');
}

export function isGuildAutocomplete(
	interaction: APIGuildInteraction,
): interaction is APIApplicationCommandAutocompleteGuildInteraction {
	return interaction.type === InteractionType.ApplicationCommandAutocomplete;
}

export function isGuildChatInput(
	interaction: APIGuildInteraction,
): interaction is APIChatInputApplicationCommandGuildInteraction {
	return (
		interaction.type === InteractionType.ApplicationCommand &&
		interaction.data.type === ApplicationCommandType.ChatInput
	);
}

// if its a root command, that means none of the options of the command are any of the SubCommand or SubCommandGroup types
export function isGuildRootChatInput(interaction: APIChatInputApplicationCommandGuildInteraction): boolean {
	const options = interaction.data.options;
	if (!options) return true;
	return options.every(
		(option) =>
			![ApplicationCommandOptionType.Subcommand, ApplicationCommandOptionType.SubcommandGroup].includes(option.type),
	);
}

export function isGuildModalSubmit(interaction: APIGuildInteraction): interaction is APIModalSubmitGuildInteraction {
	return interaction.type === InteractionType.ModalSubmit;
}

export function isGuildContextMenu(interaction: APIGuildInteraction): interaction is APIContextMenuGuildInteraction {
	return (
		interaction.type === InteractionType.ApplicationCommand && interaction.data.type === ApplicationCommandType.User
	);
}
