import SavedItemCard from '@/components/saved-item-card';
import { savedItems, type SavedItem } from '@/db/schema';
import { COLORS } from '@/utils/Colors';
import { useUser } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { and, desc, eq, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { Stack, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, Share, StyleSheet, Text, View } from 'react-native';

export default function SavesScreen() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const loadSavedItems = async () => {
    try {
      const result = await drizzleDb
        .select()
        .from(savedItems)
        .where(
          and(
            eq(savedItems.is_deleted, false),
            or(eq(savedItems.user_id, user?.id || ''), eq(savedItems.user_id, '1'))
          )
        )
        .orderBy(desc(savedItems.created_at));

      setItems(result);
    } catch (error) {
      console.error('Failed to load saved items:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedItems();
    }, [])
  );

  const handleToggleFavorite = async (item: SavedItem) => {
    try {
      await drizzleDb
        .update(savedItems)
        .set({ is_favorite: !item.is_favorite })
        .where(eq(savedItems.id, item.id));

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_favorite: !i.is_favorite } : i))
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleShare = async (item: SavedItem) => {
    try {
      await Share.share({
        message: `${item.title || 'Check out this article'}\n${item.url}`,
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const handleMore = (item: SavedItem) => {
    // TODO: Implement more actions (archive, delete, etc.)
    console.log('More actions for:', item.title);
  };

  const renderItem = ({ item }: { item: SavedItem }) => (
    <SavedItemCard
      item={{
        ...item,
        onToggleFavorite: () => handleToggleFavorite(item),
        onShare: () => handleShare(item),
        onMore: () => handleMore(item),
      }}
    />
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: 'Search',
          },
        }}
      />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={() => (
          <>
            {loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Loading...</Text>
              </View>
            ) : items.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="heart" size={48} color={COLORS.textLight} />
                </View>
                <Text style={styles.emptyTitle}>No saves yet</Text>
                <Text style={styles.emptyDescription}>Your saved articles will appear here</Text>
              </View>
            ) : null}
          </>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContent: {
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginStart: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: COLORS.textGray,
    textAlign: 'center',
  },
});