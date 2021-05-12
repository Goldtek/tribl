import React from 'react';
import { Text, View } from 'react-native';
import SimpleMarkdown from 'simple-markdown';
import { head, includes, map } from 'lodash';
import { MarkdownStyle } from 'stream-chat-expo';

const createMarkDownList = (node: any, output: any, { ...state }) => {
  const styles: MarkdownStyle = {};

  let numberIndex = 1;
  let items = map(node.items, function (item, i) {
    let bullet;
    state.withinList = false;

    if (node.ordered) {
      bullet = React.createElement(
        Text,
        { key: 0, style: styles.listItemNumber },
        numberIndex + '. '
      );
    } else {
      bullet = React.createElement(
        Text,
        { key: 0, style: styles.listItemBullet },
        '\u2022 '
      );
    }

    if (item.length > 1) {
      if (item[1].type == 'list') {
        state.withinList = true;
      }
    }

    let content = output(item, state);
    let listItem;
    if (
      includes(
        ['text', 'paragraph', 'strong'],
        (((head(item) as unknown) as any) || {}).type
      ) &&
      state.withinList == false
    ) {
      state.withinList = true;
      listItem = React.createElement(
        Text,
        {
          style: [styles.listItemText, { marginBottom: 0 }],
          key: 1
        },
        content
      );
    } else {
      listItem = React.createElement(
        View,
        {
          style: styles.listItemText,
          key: 1
        },
        content
      );
    }
    state.withinList = false;
    numberIndex++;

    return React.createElement(
      Text,
      {
        key: i,
        style: styles.listRow
      },
      [bullet, listItem]
    );
  });

  return React.createElement(
    View,
    { key: state.key, style: styles.list },
    items
  );
};

const makeMarkDownRules = (props: any) => {
  const markdownRules = props.theme
    ? {
        ...props.theme.message.content.markdown,
        heading: {
          match: SimpleMarkdown.blockRegex(
            /^ *(##{1,6}) *([^\n]+?) *#* *(?:\n *)+/
          )
        },
        list: { react: createMarkDownList }
      }
    : {};

  return markdownRules;
};

export default makeMarkDownRules;
