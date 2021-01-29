#!/usr/bin/env bash
echo "Fix stream chat reaction picker"
cp -f src/libs/stream-chat-reaction-picker/bin/ReactionPicker.tsx node_modules/stream-chat-react-native-core/src/components/Reaction/
cp -f src/libs/stream-chat-reaction-picker/bin/ReactionPickerWrapper.tsx node_modules/stream-chat-react-native-core/src/components/Reaction/
echo "Done"
