import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export default async function checkAppUpdates() {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    Alert.alert('UPDATE AVAILABLE', 'DOWNLOADING UPDATES NOW...');
    // ... notify user of update ...
    await Updates.reloadAsync();
  }
  // Prompt the user when an update is available
  // and then display a "downloading" modal
}
