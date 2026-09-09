import SavedConfirmation from '@/components/saved-confirmation';
import { savedItems } from '@/db/schema';
import { COLORS } from '@/utils/Colors';
import { useUser } from '@clerk/clerk-expo';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as Crypto from 'expo-crypto';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

export default function AddUrlPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { intent } = useLocalSearchParams<{ intent: string }>();
  const [url, setUrl] = useState(intent || '');
  const { user } = useUser();

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const handleSave = async () => {
    if (!url.trim()) return;

    setIsLoading(true);

    try {
      // Generate ID for the saved item
      const itemId = Crypto.randomUUID();

      // First, save the URL immediately with basic info
      await drizzleDb.insert(savedItems).values({
        id: itemId,
        url: url.trim(),
        user_id: user?.id || '1',
        parsing_status: 'pending',
      });

      // Then parse the content in the background
      const response = await fetch('/api/parse-url', {
        method: 'POST',
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await response.json();
      if (result.success) {
        // Update the saved item with parsed content
        await drizzleDb
          .update(savedItems)
          .set({
            title: result.data.title,
            excerpt: result.data.description,
            image_url: result.data.image,
            domain: result.data.domain,
            site_name: result.data.siteName,
            author: result.data.author,
            word_count: result.data.wordCount,
            reading_time: result.data.readingTime,
            content: result.data.content,
            parsing_status: 'parsed',
            extracted_at: result.data.extractedAt,
          })
          .where(eq(savedItems.id, itemId));
      } else {
        // Mark as failed if parsing didn't work
        await drizzleDb
          .update(savedItems)
          .set({ parsing_status: 'failed' })
          .where(eq(savedItems.id, itemId));
      }

      setIsSaved(true);
    } catch (error) {
      console.error('Failed to save URL:', error);
      // Could show error message to user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.dismiss();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <>
              {!isSaved ? (
                <TouchableOpacity onPress={() => router.dismiss()}>
                  <Text style={{ color: COLORS.secondary, fontSize: 16, fontWeight: 500 }}>
                    Close
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </>
          ),
        }}
      />
      {isSaved && <SavedConfirmation onDismiss={handleCancel} />}

      {!isSaved && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Add a URL</Text>

            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="e.g. https://galaxies.dev"
              placeholderTextColor={COLORS.textLight}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.saveButton, (!url.trim() || isLoading) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!url.trim() || isLoading}>
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Parsing content...' : 'Save to Pocket'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: COLORS.itemBackground,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 30,
    minHeight: 52,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 16,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: COLORS.textDark,
    borderRadius: 10,
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: COLORS.textDark,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});