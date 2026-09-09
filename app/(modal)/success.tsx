import SavedConfirmation from '@/components/saved-confirmation';
import { COLORS } from '@/utils/Colors';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
const Page = () => {
  const router = useRouter();

  const handleCancel = () => {
    router.dismiss();
  };

  return (
    <View style={styles.container}>
      <SavedConfirmation onDismiss={handleCancel} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    height: '100%',
  },
});

export default Page;