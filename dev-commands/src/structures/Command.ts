import { Command as YuuCommand } from '@yuudachi/framework';
import type { CommandPayload, Runtime } from '@yuudachi/framework/types';

export abstract class Command<
	C extends CommandPayload = CommandPayload,
	R extends Runtime = Runtime.Raw,
> extends YuuCommand<C, R> {}
