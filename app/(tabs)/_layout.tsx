import { COLORS } from '@/utils/Colors';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
export default function TabLayout() {
  return (
    <NativeTabs blurEffect='systemChromeMaterial' tintColor={COLORS.textDark}>
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon sf={{ default:'house', selected:'house.fill' }} drawable="home_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="saves">
        <Label>Saves</Label>
        <Icon sf={{ default:'heart', selected:'heart.fill' }} drawable="saves_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default:"gearshape" ,selected:'gearshape.fill'}} 
        drawable="settings_drawable" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
