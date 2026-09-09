import migrations from '@/drizzle/migrations'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { drizzle } from "drizzle-orm/expo-sqlite"
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { Stack } from 'expo-router'
import { openDatabaseAsync, openDatabaseSync, SQLiteProvider } from 'expo-sqlite'
import React, { Suspense } from 'react'
import { ActivityIndicator } from 'react-native'
import { KeyboardProvider } from 'react-native-keyboard-controller'
const DATABASE_NAME = 'pocket';

const Layout =() =>{
  const db = openDatabaseAsync(DATABASE_NAME);
  useDrizzleStudio(db);
  return(
    <Stack>
        <Stack.Screen name='index' options={{headerShown:false}} />
        <Stack.Screen name='(tabs)' options={{headerShown:false}} />
        <Stack.Screen name='(modal)/success' 
        options={{ 
          presentation:"formSheet",
          sheetAllowedDetents: [0.5,1],
          sheetGrabberVisible:false,
          headerShadowVisible:false,
          title:"",
          contentStyle:{
            height:"100%"
          }
          }}/>
    </Stack>
  )
}

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const {success, error} = useMigrations(db,migrations);

  return (
    <ClerkProvider tokenCache={tokenCache}>
    <KeyboardProvider>
      <Suspense fallback={<ActivityIndicator/>}> 
          <SQLiteProvider useSuspense 
            databaseName={DATABASE_NAME} 
            options={{ enableChangeListener:true }}>
            <Layout/>
          </SQLiteProvider>
      </Suspense>
    </KeyboardProvider>
    </ClerkProvider>
  )
}