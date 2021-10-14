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
    case 'mimi':
    case 'ruby':
    case 'johnny':
    case 'johnnySins':
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

    // Mimi Keene
    case 'mimi':
    case 'ruby':
      const imageMK = _.sample([
        'https://c.tenor.com/uI6OtH9Fj5MAAAAd/mimi-keene.gif',
        'https://c.tenor.com/UBeobHGKHjIAAAAC/ruby-matthews-sex-education.gif',
        'https://c.tenor.com/u-743qFHzKcAAAAC/ruby-matthews-mimi-keene.gif',
        'https://i2-prod.dailystar.co.uk/incoming/article19287441.ece/ALTERNATES/s615b/0_Cindy-Williams-in-EastEnders-1553369',
        'https://c.tenor.com/NFoxeRkZJJ4AAAAC/he-will-be-my-boyfriend-hes-mine.gif',
        'https://c.tenor.com/Oxnm45kLCEcAAAAd/sex-ed-sex-education.gif',
        'https://c.tenor.com/OzZFIsTr6UgAAAAC/sex-ed-sex-education.gif',
        'https://c.tenor.com/Teg0Mr_up2EAAAAC/sex-ed-sex-education.gif',
        'https://c.tenor.com/XdTPPvLpqkoAAAAC/rena-mimikeene.gif',
        'https://c.tenor.com/av25JR8EsqkAAAAC/sex-ed-sex-education.gif',
        'https://c.tenor.com/hLshMPCuJTMAAAAC/sex-education-patrick-pao.gif',
        'https://i.pinimg.com/736x/cb/b5/e6/cbb5e61eb3ce4a3aa9fa0dd52238c805.jpg',
        'https://www.thefamouspeople.com/profiles/images/mimi-keene-4.jpg',
        'https://media.glamourmagazine.co.uk/photos/614db62c3de8ee7a81e658ed/3:2/w_1920,h_1280,c_limit/Mimi%20Keene_240921_SE_303_Unit_00509_RT_SQ.jpg',
      ]);
      return {
        embeds: [embeds.image('Mimi Keene', imageMK, user, 'Mimi Keene')],
      };

    // Johnny Sins
    case 'johnny':
    case 'johnnySins':
      const imageJS = _.sample([
        'https://c.tenor.com/CBOjsCUCFOUAAAAC/jhonny-sins-reyiz-wink.gif',
        'https://c.tenor.com/q1DWp0dkpB8AAAAC/johnny-sins-friday.gif',
        'https://c.tenor.com/6D7KmYWYvhAAAAAC/johnny-sins-doctor.gif',
        'https://c.tenor.com/bKY8WtSsDaYAAAAd/johnny-sins-erik-dal%C4%B1-sins.gif',
        'https://c.tenor.com/mh5JI0xUbcUAAAAd/johnny-sins-brazzers.gif',
        'https://c.tenor.com/r7w27fbnRC4AAAAC/johnny-sins-shookt.gif',
        'https://c.tenor.com/V5lrrtPSNbcAAAAd/johnny-sins-sins.gif',
        'https://c.tenor.com/1Lz6z39MpE0AAAAd/johnny-sins-hungry.gif',
        'https://c.tenor.com/_fuG3xxBPXcAAAAC/johnny-sins-what.gif',
        'https://c.tenor.com/Y2fDljMXoH8AAAAd/john-fross-johnny-sins.gif',
        'https://media.giphy.com/media/XDaLiUu8VyreM/giphy.gif',
        'https://media.giphy.com/media/1I43BTfDMV1qo/giphy.gif',
        'https://media.giphy.com/media/PrvuQdqyO3kNa/giphy.gif',
        'https://media.giphy.com/media/bGv2OuHzkOMxO/giphy.gif',
        'https://i.pinimg.com/originals/74/7c/4f/747c4f29e2a113589636b1a8b10f9521.jpg',
        'https://pbs.twimg.com/profile_images/1353588121796038656/nJWN_2eD.jpg',
        'https://www.earlygame.com/uploads/images/_headerImage/johnny-sins-aidan-birthday-wish.jpg',
        'https://img-9gag-fun.9cache.com/photo/aZ0vdBp_460s.jpg',
      ]);
      return {
        embeds: [embeds.image('Johnny Sins', imageJS, user, 'Johnny Sins')],
      };
  }

  return { content: `I don't know what to do :(`, ephemeral: true };
}

module.exports = { unbox };
