import React, { useState, Fragment } from 'react';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';
import UpdateModal from './widget';

// export default function checkAppUpdates () {
//   // Alert.alert(
//   //   'UPDATE CHECK',
//   //   'NOW CHECKING FOR UPDATE',
//   //   [
//   //     {
//   //       text: 'Ask me later',
//   //       onPress: () => console.log('Ask me later pressed')
//   //     },
//   //     {
//   //       text: 'Cancel',
//   //       onPress: () => console.log('Cancel Pressed'),
//   //       style: 'cancel'
//   //     },
//   //     { text: 'OK', onPress: () => console.log('OK Pressed') }
//   //   ],
//   //   { cancelable: true }
//   // );

//    const update = await Updates.checkForUpdateAsync();
//    return (
//      <Fragment></Fragment>
//    )
//   if (update.isAvailable) {
//     // await Updates.fetchUpdateAsync();
//     // Alert.alert('UPDATE AVAILABLE', 'DOWNLOADING UPDATES NOW...');
//     // ... notify user of update ...
//     // await Updates.reloadAsync();
//   }
//   // Prompt the user when an update is available
//   // and then display a "downloading" modal
// }

export default async function checkAppUpdates() {
  const update = await Updates.checkForUpdateAsync();
  return (
    <Fragment>
      {update.isAvailable ? <UpdateModal onPress={() => {}} /> : null}
    </Fragment>
  );
}
