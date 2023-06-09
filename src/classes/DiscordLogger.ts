import { Client, TextChannel } from 'discord.js';

/**
 * Sends a message to the Discord channel.
 * @param channel The channel to send the message to.
 * @param message The final message to send.
 * @returns Whether the message was sent or not.
 */
const sendMessage = async (
  channel: TextChannel,
  message: string
): Promise<boolean> => {
  try {
    await channel.send(`\`\`\`yaml\n${message}\`\`\``);
    return true;
  } catch (err) {
    return false;
  }
};

/* eslint-disable no-control-regex */
const ANSI_REGEX = /\u001b\[[0-9]{1,2}m/gi;

/**
 * The LogLevel class, used to manage logs for per level.
 */
class LogLevel {
  private channel: TextChannel;
  private processing: boolean;
  private queue: string[];

  /**
   * Creates a new instance of the LogLevel class.
   * @param channel The channel to send the logs to.
   */
  public constructor(channel: TextChannel) {
    this.channel = channel;
    this.processing = false;
    this.queue = [];

    setInterval(() => {
      this.send();
    }, 1000 * 1);
  }

  /**
   * Adds a log message to the queue.
   * @param message The message to add to the queue.
   */
  public add(message: string): void {
    this.queue.push(message);
  }

  /**
   * Sends a chunk of log messages to the Discord channel.
   */
  private async send(): Promise<void> {
    if (!(this.queue.length > 0) || this.processing) return;

    this.processing = true;

    let logChunk = '';
    let chunkSent = false;

    // Add logs to the logChunk until the message is too long
    while (this.queue.length > 0 && !chunkSent) {
      const message = this.queue[0]?.replace(ANSI_REGEX, '') ?? '';

      // If the message/log is too long, remove it from the queue
      if (logChunk.length > 1500) {
        this.queue.shift();
        continue;
      }

      // If the message (with new log) is too long, send it (without new log) and continue
      if (logChunk.length + logChunk.length > 1500) {
        chunkSent = await sendMessage(this.channel, logChunk);
      }

      // Add the log to the message
      logChunk += `${message}\n`;

      // Remove the log from the queue
      this.queue.shift();
    }

    // Send any remaining logs
    if (!chunkSent && logChunk.length > 0) {
      await sendMessage(this.channel, logChunk);
    }

    this.processing = false;
  }
}

interface DiscordLoggerOptions {
  client: Client;
  channels: Record<string, string>;
}

/**
 * The DiscordLogger class, used to log console messages to a Discord channel.
 */
export default class DiscordLogger {
  private client: Client;
  private channels: Record<string, string>;
  private levels: Map<string, LogLevel>;
  private ready: boolean;

  /**
   * Creates a new instance of the DiscordLogger class.
   * @param options The options to use when creating the logger.
   * @param options.client The Discord client to use.
   * @param options.channels The channels to send logs to.
   */
  public constructor(options: DiscordLoggerOptions) {
    this.client = options.client;
    this.channels = options.channels;
    this.levels = new Map();
    this.ready = false;

    this.init();
  }

  /**
   * Initializes the logger.
   */
  private async init(): Promise<void> {
    for (const level of Object.keys(this.channels)) {
      if (typeof this.channels[level] !== 'string')
        throw new Error(
          `No log channel defined as a string for level: "${level}"`
        );

      const channel = await this.client.channels.fetch(
        this.channels[level] as string
      );

      // If the channel doesn't exist, throw an error
      if (!channel)
        throw new Error(`Failed to fetch channel for level: "${level}"`);

      // If the channel is not a text channel
      if (!(channel instanceof TextChannel))
        throw new Error(`Channel for level: "${level}" is not a text channel`);

      // Create a new log level instance and add it to the levels map
      const logLevel = new LogLevel(channel);
      this.levels.set(level, logLevel);
    }

    this.ready = true;
  }

  /**
   * Adds a log message to the queue.
   * @param level The level of the log.
   * @param message The message to log.
   */
  public send(level: string, message: string): void {
    const lvl = level.replace(ANSI_REGEX, '');

    if (!this.ready) setTimeout(() => this.send(lvl, message), 1000);

    if (!this.channels[lvl])
      throw new Error(`No log channel defined for level: "${lvl}"`);

    if (!this.levels.has(lvl)) throw new Error(`Invalid log level: "${lvl}"`);

    const logLevel = this.levels.get(lvl);

    if (!logLevel) return;

    logLevel.add(message);
  }
}
