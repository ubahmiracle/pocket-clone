import { COLORS } from '@/utils/Colors'
import { Stack } from 'expo-router'
import React from 'react'

export default function HomeLayout() {

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
                    title:"Home",
                    headerLargeTitle:true,
                    headerLargeTitleShadowVisible:false
                }}
                />

            </Stack>
    )


}
