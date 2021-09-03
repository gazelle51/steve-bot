async function executeCommand() {
  // Do nothing if a blocked user tried to interact with bot
  if (JSON.parse(process.env.BLOCKED_USERS).includes(message.author.id)) {
    console.log(
      `${message.author.username} (${message.author.id}) tried to execute '${message.content}' but is blocked`
    );
    return;
  }
}
