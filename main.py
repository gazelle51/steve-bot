from dotenv import load_dotenv


import discord
import os

load_dotenv()

client = discord.Client()


@client.event
async def on_ready():
    print("Logged in as {0.user}".format(client))


@client.event
async def on_message(message):
    if message.author == client.user:
        return

    print(message.author)
    print(message.author.id)
    print(message.author.name)
    print(message.author.discriminator)

    # if message.content.startswith("$hello"):
    #     await message.channel.send("Hello!")


client.run(os.getenv("TOKEN"))

