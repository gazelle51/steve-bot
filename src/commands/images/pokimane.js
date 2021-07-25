/**
 * Execute pokimane command.
 * @param {Object} message - Received message
 * @param {*} args
 */
function execute(message, args) {
  message.channel.send('', {
    files: [
      'https://www.theloadout.com/wp-content/uploads/2021/01/rust-twitch-drops-pokimane-900x506.jpg',
    ],
  });
}

module.exports = {
  name: 'pokimane',
  description: 'Show the garage door',
  execute,
};
