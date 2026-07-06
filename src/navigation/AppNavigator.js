import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import OutfitsScreen from '../screens/OutfitsScreen';
import AddScreen from '../screens/AddScreen';
import AddItemScreen from '../screens/AddItemScreen';
import CreateOutfitScreen from '../screens/CreateOutfitScreen';
import PlannerScreen from '../screens/PlannerScreen';
import WardrobeScreen from '../screens/WardrobeScreen';
import { colors, fonts } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AddStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddChoice" component={AddScreen} />
      <Stack.Screen name="AddItem" component={AddItemScreen} />
      <Stack.Screen name="CreateOutfit" component={CreateOutfitScreen} />
    </Stack.Navigator>
  );
}

// SVG icons matching the design exactly
function HomeIcon({ color }) {
  return (
    <Text style={{ fontSize: 20, color }}>⌂</Text>
  );
}

function TabIcon({ label, icon, focused }) {
  const c = focused ? colors.ink : '#B4B1AC';
  return (
    <View style={ic.wrap}>
      <Text style={[ic.icon, { color: c }]}>{icon}</Text>
      <Text style={[ic.label, { color: c, fontFamily: focused ? fonts.mono700 : fonts.mono }]}>
        {label}
      </Text>
    </View>
  );
}

function AddTabIcon() {
  return (
    <View style={ic.addCircle}>
      <Text style={ic.addPlus}>+</Text>
    </View>
  );
}

const ic = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 4, gap: 4 },
  icon: { fontSize: 21 },
  label: { fontSize: 8.5, letterSpacing: 0.7, textTransform: 'uppercase' },
  addCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center',
    marginTop: -18,
    shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  addPlus: { color: colors.white, fontSize: 26, fontWeight: '300', lineHeight: 30, marginTop: -2 },
});

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: '#ECEAE7',
            borderTopWidth: 1,
            height: 84,
            paddingBottom: 0,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="HOME" icon="⌂" focused={focused} /> }}
        />
        <Tab.Screen
          name="Outfits"
          component={OutfitsScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="OUTFITS" icon="☰" focused={focused} /> }}
        />
        <Tab.Screen
          name="Add"
          component={AddStack}
          options={{ tabBarIcon: () => <AddTabIcon /> }}
        />
        <Tab.Screen
          name="Planner"
          component={PlannerScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="PLANNER" icon="▦" focused={focused} /> }}
        />
        <Tab.Screen
          name="Wardrobe"
          component={WardrobeScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="WARDROBE" icon="▭" focused={focused} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
