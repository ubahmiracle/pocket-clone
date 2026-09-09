import { COLORS } from '@/utils/Colors';
import { useSSO } from '@clerk/clerk-expo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { OAuthStrategy } from '@clerk/types';
// import Sentry from '@sentry/react-native';

export default function LoginScreen() {
  const { startSSOFlow } = useSSO();

  const openLink = () => {
    WebBrowser.openBrowserAsync('https://galaxies.dev');
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: provider as OAuthStrategy,
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            // router.replace('/(tabs)/home');
          },
        });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={'padding'}
      keyboardVerticalOffset={400}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Image source={require('@/assets/images/pocket-logo.png')} style={styles.logoIcon} />
        </View>
        <Text style={styles.title}>Log In</Text>
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.button} onPress={() => handleSocialLogin('oauth_apple')}>
          <AntDesign name="apple" size={20} color="#000000" />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleSocialLogin('oauth_google')}>
          <AntDesign name="google" size={20} color="#000000" />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.emailSection}>
        <TextInput
          style={styles.emailInput}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
        <Link href="/(tabs)/home" asChild replace>
          <TouchableOpacity style={{ marginTop: 16, alignSelf: 'center' }}>
            <Text style={{ color: '#4A90E2', fontWeight: 'bold' }}>Skip for now</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.footer}>
        <Text style={styles.termsText}>
          By proceeding, you agree to:{'\n'}
          Pocket's{' '}
          <Text style={styles.link} onPress={() => openLink()}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={() => openLink()}>
            Privacy Notice
          </Text>
          .{'\n'}
          Mozilla Accounts{' '}
          <Text style={styles.link} onPress={() => openLink()}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={() => openLink()}>
            Privacy Notice
          </Text>
          .
        </Text>
        {/* <Button
          title="Test Sentry"
          onPress={() => Sentry.captureException(new Error('Test error'))}
        /> */}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 30,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logoIcon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  buttonSection: {
    gap: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderColor: COLORS.border,
  },
  buttonText: {
    fontSize: 16,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  orText: {
    marginHorizontal: 16,
    color: COLORS.textLight,
    fontSize: 14,
  },
  emailSection: {
    marginBottom: 30,
  },
  emailInput: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
  },
  termsText: {
    fontSize: 12,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});