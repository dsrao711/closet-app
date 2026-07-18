import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Icon from '../components/Icon';
import HomeScreen from '../screens/HomeScreen';
import OutfitsScreen from '../screens/OutfitsScreen';
import AddScreen from '../screens/AddScreen';
import AddItemScreen from '../screens/AddItemScreen';
import CreateOutfitScreen from '../screens/CreateOutfitScreen';
import EditItemScreen from '../screens/EditItemScreen';
import EditOutfitScreen from '../screens/EditOutfitScreen';
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

function WardrobeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WardrobeList" component={WardrobeScreen} />
      <Stack.Screen name="EditItem" component={EditItemScreen} />
    </Stack.Navigator>
  );
}

function OutfitsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OutfitsList" component={OutfitsScreen} />
      <Stack.Screen name="EditOutfit" component={EditOutfitScreen} />
    </Stack.Navigator>
  );
}

function TabIcon({ label, iconName, focused }) {
  const c = focused ? colors.ink : '#B4B1AC';
  return (
    <View style={ic.wrap}>
      <Icon name={iconName} size={22} color={c} />
      <Text
        style={[ic.label, { color: c, fontFamily: focused ? fonts.mono700 : fonts.mono }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    </View>
  );
}

function AddTabIcon() {
  return (
    <View style={ic.addCircle}>
      <Icon name="plus" size={24} color={colors.white} strokeWidth={2} />
    </View>
  );
}

const ic = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', gap: 4, width: '100%' },
  label: { fontSize: 8, letterSpacing: 0.3, textTransform: 'uppercase' },
  addCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center',
    marginTop: -18,
    shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
});

export default function AppNavigator() {
  const insets = useSafeAreaInsets();

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
            height: 58 + insets.bottom,
            paddingTop: 9,
            paddingBottom: insets.bottom,
          },
          tabBarItemStyle: { paddingTop: 0 },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="HOME" iconName="home" focused={focused} /> }}
        />
        <Tab.Screen
          name="Outfits"
          component={OutfitsStack}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="OUTFITS" iconName="outfits" focused={focused} /> }}
        />
        <Tab.Screen
          name="Add"
          component={AddStack}
          options={{ tabBarIcon: () => <AddTabIcon /> }}
        />
        <Tab.Screen
          name="Planner"
          component={PlannerScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="PLANNER" iconName="planner" focused={focused} /> }}
        />
        <Tab.Screen
          name="Wardrobe"
          component={WardrobeStack}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="WARDROBE" iconName="wardrobe" focused={focused} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
