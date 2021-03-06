# steve-bot

Steve is a multipurpose Discord bot. He is able to play music, act as a soundboard, send messages in a channel and simulate opening CS: GO containers.

This document describes how you can get edit Steve and get him up and running in your own Discord server. I have assumed that you may want to edit some of his code base so we're going to cover how to run him locally on your computer as well as running him in the Cloud.

## Table of contents

1. [Table of contents](#table-of-contents)
2. [Prerequisites](#prerequisites)
3. [Creating a bot application](#creating-a-bot-application)
4. [Inviting a bot to your server](#inviting-a-bot-to-your-server)
5. [Running Steve's code](#running-steves-code)
   1. [Set up](#set-up)
   2. [Deployment of slash commands](#deployment-of-slash-commands)
   3. [Running Steve locally](#running-steve-locally)
   4. [Running Steve on the Cloud](#running-steve-on-the-cloud)
6. [What does Steve do?](#what-does-steve-do)
   1. [Playing music and sounds](#playing-music-and-sounds)
   2. [Sending messages](#sending-messages)
   3. [Simulating CS: GO container openings](#container-openings)
7. [Configuration](#configuration)
   1. [Command prefix](#command-prefix)
   1. [Default command cooldown](#default-command-cooldown)
   1. [Disabling commands and events](#disabling-commands-and-events)
   1. [Embed colour](#embed-colour)
   1. [Emojis](#emojis)
   1. [Blocking users](#blocking-users)

<a name="prerequisites"></a>

## Prerequisites

Before we begin make sure you have the following installed:

1. [Node.js](https://nodejs.org/en/) v16.6.0 or higher and npm (but that comes with Node.js)
2. [Git](https://git-scm.com/downloads) - you can skip this if you would rather download the repository straight from GitHub
3. [Visual Studio Code](https://code.visualstudio.com/download) or another text editor

You will also need a [Discord](https://discord.com/app) account.

All commands mentioned in this tutorial should be run from the Terminal on Mac. You can also run them from the Command Prompt on Windows however some of the commands may need to be updated.

<a name="creating-a-bot-application"></a>

## Creating a bot application

To get Steve in your Discord server you need to start by creating a bot application in the Discord developer portal. Follow the steps below to do this.

1. Go to the [Discord developer portal](https://discord.com/developers/docs/intro) and log in.
2. Navigate to "Applications" in the left hand panel.
3. Click "New Application" in the top right corner, give your application a name and click "Create".
4. Navigate to "Bot" in the left hand panel.
5. Click "Add Bot" and confirm the pop up.
6. Note down the token from this page - be careful not to share this token with anyone, it's basically like a password so that code can run on you bot. If you want to know more information about the token read [this](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token).
7. If you like, give Steve a custom avatar on this page.
8. I also set the "Public Bot" setting to off so that only I can invite him to servers.

![Bot settings](./images/bot-settings.png)

<a name="inviting-a-bot-to-your-server"></a>

## Inviting a bot to your server

Now that you've created a bot application you'll want to invite it to your Discord server. To add the bot to your Discord server follow the steps below.

1. Navigate to "OAuth2" in the left hand panel.
2. Select the `bot` and `applications.commands` scopes as shown below. This will allow Steve to be a bot and update slash commands.
   ![Bot scopes](./images/bot-scopes.png)
3. Select the `Administrator` permission as shown below. I haven't gone through the code yet and fleshed out which exact permissions are needed so just gave Steve access to everything. Perhaps I'll go through the list and update this one day.
   ![Bot permissions](./images/bot-permissions.png)
4. Copy the URL in the scopes box and navigate to it. This URL is an invite link for you bot based on the scopes and permissions selected.
5. Select the server you want to add your bot to and follow all the prompts.

You should now see your bot as a member in your Discord server. We are now ready to get Steve's code up and running.

<a name="running-steves-code"></a>

## Running Steve's code

For Steve to actually run and act as a bot you need to run his code. You have two options to do this - running the code locally on your computer or running the code on a server. If the code is not running Steve will not do anything.

In addition to running the code you will need to deploy the slash commands to your Discord server. We are going to do this from your computer.

<a name="set-up"></a>

### Set up

1. Pull the repository from GitHub (or download it using the website).
   ```bash
   git pull https://github.com/gazelle51/steve-bot.git
   ```
2. Navigate into the folder.
   ```bash
   cd steve-bot
   ```
3. Install all dependencies.
   ```bash
   npm install
   ```
4. Duplicate the `.sample-env` file and rename it `.env`. This file is going to contain all sensitive information (such as the token from before). Do not share this file with anyone and do not upload it to the web.
   ```bash
   cp .sample-env .env
   ```
5. Edit the newly created `.env` file using your text editor and update all the values.

<a name="deployment-of-slash-commands"></a>

### Deployment of slash commands

Slash commands need to be deployed before they are registered by your bot. You can deploy the slash commands to a single Discord server or to your bot globally. Two scripts have been provided to perform both of these tasks. If you decide to deploy the slash commands to a single Discord server ensure that the `GUILD_ID` environment variable in the `.env` file is correct.

To deploy to a single server use the command below. This will update instantly.

```bash
npm run deploy-guild
```

To deploy the slash commands globally use the command below. It could take up to one hour for these changes to take effect.

```bash
npm run deploy-global
```

It is recommended to only deploy to a single Discord server while you are developing. Otherwise deploy the slash commands globally as this will ensure all servers using your bot are up to date.

<a name="running-steve-locally"></a>

### Running Steve locally

Now that you are all set up and have Steve's slash commands deployed you can run his code. We are now going to go through how you can run Steve's code locally on your computer. If you decide to do this, the bot will only work when you have the code running.

Since the repository is already downloaded, dependencies are installed and the environment variables are updated you just need to run the command below to get the code going.

```bash
npm start
```

Alternatively, you can run the code in development mode. This is handy when you're developing as the application will restart every time you save changes to one of the files in the code base.

```bash
npm run dev
```

<a name="running-steve-on-the-cloud"></a>

### Running Steve on the Cloud

If you want Steve to work 24/7 and you don't want to leave your computer on you will need Steve to run in the Cloud. To do this you need to have access to a server then deploy and run the code base on that server.

You need to pay for most servers however there are also some free options out there. The service I usually use is [Heroku](https://dashboard.heroku.com/login) which gives you a free server for a certain amount of Dyno hours. This means that Steve will run until your free credits expire for the month. Once the month ends, Steve will start up again.

Follow [these instructions](https://www.studytonight.com/post/how-to-deploy-a-discord-bot-to-heroku) if you want to deploy to Heroku. A Procfile has been included in this repository if you decide to go down that path.

<a name="what-does-steve-do"></a>

## What does Steve do?

Steve's main features are:

- Playing music and sounds
- Sending messages
- Simulating CS: GO container openings

These features are described in more detail below. Alternatively you can use the command `/help` to get a description of every command defined for Steve.

<a name="playing-music-and-sounds"></a>

### Playing music and sounds

Steve can be used as a music and soundboard bot in your Discord server.

Steve already has some preconfigured sounds from [Voicy](https://www.voicy.network/) such as Borat, Dr DisRespect and E-Girl. You can add more sounds by updating or creating new files in `src/sounds` and `src/slashCommands/sounds`. Voicy also allows you to create sounds based on YouTube videos so you have flexibility to play whatever sound you want.

As a music bot Steve can play songs from YouTube by either searching for keywords or playing from a provided YouTube link. The functionality for this can be found in `src/slashCommands/music`. Steve keeps a queue of all requested music and will play them one by one.

<a name="sending-messages"></a>

### Sending messages

Steve can send messages to any channel that he has access to using the slash commands defined in `src/slashCommands/message`. When telling Steve to send a message, make sure that you use the command from within the server the channel exists in.

<a name="container-openings"></a>

### Simulating CS: GO container openings

Steve can simulate opening of containers (cases and collections to be precise) from the game CS: GO. If you don't know much about unboxing in CS: GO check out [this](https://counterstrike.fandom.com/wiki/Container) link. The code and data for this feature is contained in `src/containerSimulator`.

The metadata for each container and the weapons within them are scraped from [CS: GO Stash](https://csgostash.com/) using a predefined script. The data is collected for each container mentioned in `src/containerSimulator/caseData.json` and `src/containerSimulator/collectionData.json`. A weapon, grade, rarity and other information is selected based on the known odds and then the price for that weapon is collected in real time from the same website.

<a name="configuration"></a>

## Configuration

Some features of Steve can be easily configured to your own setting. Most of these configurations are done in the `src/config.js` file. The sections below highlight which options can be configured and how to configure them.

<a name="command-prefix"></a>

### Command prefix

The default prefix for commands used in a message is `~`. To change this, update the `prefix` variable in `src/config.js`.

<a name="default-command-cooldown"></a>

### Default command cooldown

The default command cooldown is 0.1 seconds. To change this, update the `defaultCooldown` variable in `src/config.js` (the unit of this variable is in seconds). A lower cooldown means a user can send a command more often. A higher cooldown can prevent spam.

<a name="disabling-commands-and-events"></a>

### Disabling commands and events

By default all commands and events are enabled. Commands and events can be disabled by updating the `disabledCommands` and `disabledEvents` variables in `src/config.js`. These variables expect an array of command/event names. For example, to disable the "skip" command you would set `disabledCommands = ['skip']`.

<a name="embed-colour"></a>

### Embed colour

The default embed colour is a bright turquoise. To change this, update the `embedColour` variable in `src/config.js` (this variable expects a hex colour code).

<a name="emojis"></a>

### Emojis

A number of emojis are used by Steve and are defined in the `emoji` variable in `src/config.js`. You can update the values in this variable to change the emojis.

<a name="blocking users"></a>

### Blocking users

If you want to block a user from using Steve, this needs to be configured in an environment variable. The `BLOCKED_USERS` environment variable is used to hold a stringified JSON array of blocked user IDs. For example, to block a user with ID `123` set the environment variable to `BLOCKED_USERS=["123"]`. Remember when an environment variable is changed the bot must be restarted for the changed to take effect.
