import { COLORS } from '@/utils/Colors'
import { Stack } from 'expo-router'
import React from 'react'


export default function SettingsLayout() {

    return (
        <Stack 
            screenOptions={{ 
                contentStyle:{
                    backgroundColor: COLORS.white
                }
            }}> 
                <Stack.Screen
                name='index'
                options={{ 
                    title:"Settings",
                    headerLargeTitle:true,
                    headerLargeTitleShadowVisible:false
                }}
                />

            </Stack>
    )


}
