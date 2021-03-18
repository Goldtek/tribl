import {useTheme} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  Animated,
  TouchableOpacity,
  SectionList,
  StyleSheet,
} from 'react-native';
// import {SCText} from './SCText';
// import * as Haptics from 'expo-haptics';
// import {groupedSupportedReactions} from '../utils/supportedReactions';

// import EmojiSelector, { Categories } from "react-native-emoji-selector";
import EmojiBoard from 'react-native-emoji-board';


export const ReactionPicker = (props) => {
  const {dismissReactionPicker, handleReaction, reactionPickerVisible} = props;
  const {colors} = useTheme();
  const _dismissReactionPicker = () => {

      dismissReactionPicker();

  };

  const _handleReaction = (type: any) => {
    handleReaction(type.name);
		_dismissReactionPicker();
  };



  return (
    <Modal
      animationType="fade"
      onRequestClose={_dismissReactionPicker}
      transparent
      visible={reactionPickerVisible}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => {
          _dismissReactionPicker();
        }}
      >

        <View
          style={[
            {
              backgroundColor: colors.background,
            },
            styles.pickerContainer,
          ]}>
          <View style={styles.listContainer}>
            <View style={{height: 300, minWidth: '100%', }}>
                {/* <Text style={{height: 300, minWidth: '100%',}}> */}
								<EmojiBoard showBoard={true} onClick={_handleReaction} />
								{/* </Text> */}
            </View>
          </View>
        </View>
				</TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
		width: '100%',
    // alignSelf: 'flex-end',
    // alignItems: 'flex-start',
		alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  animatedContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
		justifyContent:'center',
		alignItems: 'center'

  },
  pickerContainer: {
    flexDirection: 'column',
    borderRadius: 15,
    padding: 10,
		// marginBottom: 300, 
		// overflow: 'scroll'
  },
  listContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  groupTitle: {
    padding: 10,
    paddingLeft: 13,
    fontWeight: '200',
  },
  reactionsRow: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 3,
  },
  reactionsItemContainer: {
    alignItems: 'center',
    marginTop: -5,
  },
  reactionsItem: {
    fontSize: 35,
    margin: 5,
    marginVertical: 5,
  },
});
