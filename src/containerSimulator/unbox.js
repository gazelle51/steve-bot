const _ = require('lodash');
const embeds = require('../utils/embeds').container;
const { User } = require('discord.js');
const { isCase, isCollection, randomCase, randomCollection } = require('./containers');
const { unboxCase } = require('./unboxCase');
const { unboxCollection } = require('./unboxCollection');

/**
 * Unbox a container.
 * @param {string} containerName - name of container to open
 * @param {User} user - user who initiated unboxing
 * @returns {Promise<import('../typedefs/container').UnboxResult>}
 */
async function unbox(containerName, user) {
  let containerType;

  // Get container type and name details
  switch (containerName) {
    // No container name - randomly select a case or collection
    case undefined:
    case null:
    case '':
      containerType = _.sample(['case', 'collection']);
      containerName = containerType === 'case' ? randomCase() : randomCollection();
      break;

    // Special containers
    case 'box':
    case 'laura':
    case 'bella':
    case 'bellaPoarch':
    case 'margot':
    case 'margotRobbie':
    case 'megan':
    case 'meganFox':
    case 'ander':
    case 'aron':
    case 'aronPiper':
    case 'ester':
    case 'esterExposito':
      containerType = containerName;
      break;

    // Default
    default:
      if (isCase(containerName)) containerType = 'case';
      else if (isCollection(containerName)) containerType = 'collection';
      break;
  }

  // Handle each container type
  switch (containerType) {
    // Non-configured containers
    case undefined:
    case null:
    case '':
      return {
        content: `I am not configured to open ${containerName} containers`,
        ephemeral: true,
      };

    // Case
    case 'case':
      const caseWeapon = await unboxCase(containerName);
      return {
        embeds: [embeds.weapon(caseWeapon, user)],
        fetchReply: true,
        weaponColour: caseWeapon.colour,
      };

    // Collection
    case 'collection':
      const collectionWeapon = await unboxCollection(containerName);
      return {
        embeds: [embeds.weapon(collectionWeapon, user)],
        fetchReply: true,
        weaponColour: collectionWeapon.colour,
      };

    // Box
    case 'box':
      return {
        embeds: [
          embeds.image(
            'Ducky',
            'https://media.giphy.com/media/26his8ERHOSxKuWw8/giphy.gif?cid=ecf05e477mcpzpur95w1wm4t66zkh06t17j8lgc6nwq5f5c3&rid=giphy.gif&ct=g',
            user,
            'Box'
          ),
        ],
      };

    // Laura
    case 'laura':
      return {
        embeds: [
          embeds.image(
            'Laura Chan ローラ',
            'https://media.giphy.com/media/xTiTngxCg9CQfe1lfi/giphy.gif?cid=ecf05e470c34hd6qgfsc775871j0uvnvt78sxm4oqst947yh&rid=giphy.gif&ct=g',
            user,
            'Laura'
          ),
        ],
      };

    // Bella Poarch
    case 'bella':
    case 'bellaPoarch':
      const imageBP = _.sample([
        'https://c.tenor.com/arG5K2c3qNEAAAAC/bellapoarch.gif',
        'https://c.tenor.com/-JVTHLlHG5cAAAAd/alyanessa-bella-poarch.gif',
        'https://c.tenor.com/pPcu9o8zANsAAAAd/bella-poarch-bella-poarch-reface.gif',
        'https://c.tenor.com/WqGSp6QuYqoAAAAd/alyanessa.gif',
        'https://c.tenor.com/hngl-1gpKwYAAAAC/utku-bella.gif',
        'https://c.tenor.com/N_prfhod85YAAAAd/bella-bellisima.gif',
        'https://c.tenor.com/YFk8yS0T5nYAAAAC/bella-poarch.gif',
        'https://c.tenor.com/LDti-9NG0MUAAAAd/girl-cute.gif',
        'https://c.tenor.com/bkGvJ9Bdx9AAAAAC/stay-tiktok.gif',
        'https://c.tenor.com/c9447NJxpgAAAAAd/bella.gif',
        'https://c.tenor.com/qUfLe8Z-6aYAAAAd/bella-poarch-tik-tok.gif',
        'https://c.tenor.com/-bqu5U4z1OQAAAAd/abell46s-reface.gif',
        'https://c.tenor.com/uGEmIhJousYAAAAd/bella-poarch-sexy.gif',
        'https://c.tenor.com/JygljlcLws0AAAAd/regalcelestia-bella-poarch.gif',
      ]);
      return {
        embeds: [embeds.image('Bella Poarch', imageBP, user, 'Bella Poarch')],
      };

    // Margot Robbie
    case 'margot':
    case 'margotRobbie':
      const imageMR = _.sample([
        'https://c.tenor.com/yHD9BHuzyEAAAAAC/margot-robbie-focus.gif',
        'https://c.tenor.com/7BDC8-g9cOgAAAAd/darthmall75-margot-robbie.gif',
        'https://c.tenor.com/AUbVd435RM0AAAAC/margot-robbie.gif',
        'https://c.tenor.com/YDeHrwIF2j0AAAAd/margot-robbie.gif',
        'https://c.tenor.com/P7HXEGtH-awAAAAC/linda-margot-robbie.gif',
        'https://c.tenor.com/E4Tvl_cXoI4AAAAC/margot-robbie-flirty.gif',
        'https://c.tenor.com/2F0flShs6XgAAAAd/harley-adam.gif',
        'https://c.tenor.com/7fUYRfVxdjUAAAAC/margot-robbie-smile.gif',
        'https://c.tenor.com/WdZuesT813kAAAAd/linda-margot-robbie.gif',
        'https://c.tenor.com/CZlZqx55taAAAAAd/margot-robbie.gif',
        'https://c.tenor.com/L9mSel9iOVsAAAAd/margot-robbie-chewing-gum.gif',
      ]);
      return {
        embeds: [embeds.image('Margot Robbie', imageMR, user, 'Margot Robbie')],
      };

    // Megan Fox
    case 'megan':
    case 'meganFox':
      const imageMF = _.sample([
        'https://c.tenor.com/ASjQCLz-rNwAAAAC/megan-fox-kiss.gif',
        'https://c.tenor.com/NEeNq8JzqfkAAAAC/megan-fox-kiss.gif',
        'https://c.tenor.com/32QBMToQ6zkAAAAC/checkdemon-megan-fox.gif',
        'https://c.tenor.com/s1M6rHFyppcAAAAC/megan-meganfox.gif',
        'https://c.tenor.com/g1qoOkmZodgAAAAC/megan-megan-fox.gif',
        'https://c.tenor.com/kLGP3-9ng8MAAAAd/meganfox.gif',
        'https://c.tenor.com/AarxVnRlaDUAAAAC/megan-fox-jennifers-body.gif',
        'https://c.tenor.com/dkNJOdDo9SQAAAAC/megan-fox-jennifers-body.gif',
        'https://c.tenor.com/WkAEcHR0DxUAAAAC/megan-fox-staring.gif',
        'https://c.tenor.com/tIx8P7b1DooAAAAC/megan-fox.gif',
        'https://c.tenor.com/3XfUwzT1du4AAAAC/linda-morena.gif',
        'https://c.tenor.com/MaNZ8E8vKS8AAAAd/megan-fox-hot.gif',
        'https://c.tenor.com/bnIuhzTi5iQAAAAC/megan-megan-fox.gif',
        'https://c.tenor.com/bzNPuThY8HAAAAAC/megan-fox-bikini.gif',
      ]);
      return {
        embeds: [embeds.image('Megan Fox', imageMF, user, 'Megan Fox')],
      };

    // Aron Piper
    case 'ander':
    case 'aron':
    case 'aronPiper':
      const imageAP = _.sample([
        'https://c.tenor.com/ejQcfYvNPUEAAAAd/refrescarse-ander-munoz.gif',
        'https://c.tenor.com/sWrgpl-WFUMAAAAC/ni-idea-ander-munoz.gif',
        'https://c.tenor.com/8udJ9QeAiJUAAAAC/a-mira-ander-munoz.gif',
        'https://c.tenor.com/2KTKxkc3FYIAAAAd/ander.gif',
        'https://c.tenor.com/dkg7RRKspq0AAAAC/ar%C3%B3n-piper-handsome.gif',
        'https://c.tenor.com/LITSq7WsojkAAAAC/aron-piper.gif',
        'https://c.tenor.com/OM0J3Dq9rbMAAAAd/aron-piper.gif',
        'https://c.tenor.com/eOAQD_r33cAAAAAC/ar%C3%B3n-piper-handsome.gif',
        'https://media4.giphy.com/media/pKo9kWWbjJY1YZmv7M/giphy.gif?cid=790b761149c1de54a84b80aa043c40a669ab33e2b1da8960&rid=giphy.gif&ct=g',
        'https://media1.giphy.com/media/2ytQGuauENGZHwRCkU/giphy.gif?cid=790b761188344e084f03633fea4d92f3414b26bca64b58ed&rid=giphy.gif&ct=g',
        'https://media2.giphy.com/media/VIc7xNLuy6ntw4pmeR/giphy.gif?cid=790b7611bede67fa992cc72d244a6d19896cdbcec3fdeee9&rid=giphy.gif&ct=g',
        'https://media4.giphy.com/media/eKPYEme2PFJ0AOIkPI/giphy.gif?cid=790b7611f4c2bc63fb3d4b1c976b588bd104d794bfc0eb4a&rid=giphy.gif&ct=g',
      ]);
      return {
        embeds: [embeds.image('Aron Piper', imageAP, user, 'Aron Piper')],
      };

    // Ester Exposito
    case 'ester':
    case 'esterExposito':
      const imageEP = _.sample([
        'https://c.tenor.com/-42kEF-2WgwAAAAd/ester-exp%C3%B3sito-carla.gif',
        'https://c.tenor.com/iGzIy_IqVsEAAAAC/carla-roson-elite.gif',
        'https://c.tenor.com/KPJmxDxzVhMAAAAC/carla-elite.gif',
        'https://c.tenor.com/mm7LggU7ussAAAAC/ester-exp%C3%B3sito-carla.gif',
        'https://c.tenor.com/zNQLc_cV5AYAAAAd/%C3%A9lite-ester-exp%C3%B3sito.gif',
        'https://c.tenor.com/W3-3yTOJk3UAAAAd/ester-exp%C3%B3sito-carla-ros%C3%B3n-caleruega.gif',
        'https://c.tenor.com/MxsWEFfJBZMAAAAd/ester-exp%C3%B3sito-carla.gif',
        'https://c.tenor.com/72wuGTZtTm8AAAAC/ester-exposito-ester.gif',
        'https://c.tenor.com/eHlH8LHWxiAAAAAd/ester-exposito-elite.gif',
        'https://c.tenor.com/UHQ2HR9d4WYAAAAd/excited-bemyvalentine.gif',
        'https://c.tenor.com/GZlFxnlFi8gAAAAd/elite-carla.gif',
        'https://c.tenor.com/cBzXNH0Yu5EAAAAd/ester-exp%C3%B3sito-pout.gif',
        'https://c.tenor.com/KY0KMBl40zoAAAAd/%C3%A9lite-ester-exp%C3%B3sito.gif',
        'https://c.tenor.com/W9X_CZiKuCUAAAAd/ester-exp%C3%B3sito-pretty.gif',
        'https://c.tenor.com/nmNxl4N4sC0AAAAd/carla-elite.gif',
      ]);
      return {
        embeds: [embeds.image('Ester Exposito', imageEP, user, 'Ester Exposito')],
      };
  }

  return { content: `I don't know what to do :(`, ephemeral: true };
}

module.exports = { unbox };
