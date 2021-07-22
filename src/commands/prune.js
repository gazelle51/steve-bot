/**
 * Execute prune command.
 * @param {Object} message - Received message
 * @param {*} args
 */
function execute(message, args) {
  // Number of messages to delete
  const amount = parseInt(args[0]) + 1;

  // Check number is valid
  if (isNaN(amount)) {
    return message.reply("that doesn't seem to be a valid number.");
  } else if (amount < 2 || amount > 100) {
    return message.reply('you need to input a number between 1 and 99.');
  }

  // Delete the messages
  message.channel.bulkDelete(amount, true).catch((err) => {
    console.error(err);
    message.channel.send('there was an error trying to prune messages in this channel!');
  });
}

module.exports = {
  name: 'prune',
  description: 'Delete / prune the last X messages',
  execute,
};
