import emojiSource from 'emoji-datasource';
import _ from 'lodash';
require('string.fromcodepoint');

export const toEmoji = code => {
  return String.fromCodePoint(...code.split('-').map(u => '0x' + u));
};

export const IconType = {
  material: 'material',
  fontAwesome: 'fontAwesome'
};

export const defaultProps = {
  categories: [
    {
      name: 'Smileys & Emotion',
      iconType: IconType.material,
      icon: 'sticker-emoji'
    },
    {
      name: 'People & Body',
      iconType: IconType.material,
      icon: 'hail'
    },
    {
      name: 'Animals & Nature',
      iconType: IconType.material,
      icon: 'dog'
    },
    {
      name: 'Food & Drink',
      iconType: IconType.material,
      icon: 'food'
    },
    {
      name: 'Activities',
      iconType: IconType.material,
      icon: 'soccer'
    },
    {
      name: 'Travel & Places',
      iconType: IconType.material,
      icon: 'train-car'
    },
    {
      name: 'Objects',
      iconType: IconType.material,
      icon: 'lightbulb-outline'
    },
    {
      name: 'Symbols',
      iconType: IconType.material,
      icon: 'music-note'
    },
    {
      name: 'Flags',
      iconType: IconType.material,
      icon: 'flag-variant-outline'
    }
  ],
  blackList: ['white_frowning_face']
};



const handleDefaultEmoji = (data, blackList) => {
  const filteredData = data.filter(e => !_.includes(blackList, e.short_name));
  const sortedData = _.orderBy(filteredData, 'sort_order');
  const groupedData = _.groupBy(sortedData, 'category');

  const transformData = _.mapValues(groupedData, group =>
    group.map(value => {
      return {
        icon: toEmoji(value.unified),
        id: value.short_name,
      };
    })
  );
  return transformData;
};

const emojiCategory = handleDefaultEmoji(emojiSource, defaultProps.blackList)
const values = Object.values(emojiCategory)

let emojiData = [];
for (const value of values) {
  emojiData.push(...value)
}

export const getSupportedReactions = emojiData;