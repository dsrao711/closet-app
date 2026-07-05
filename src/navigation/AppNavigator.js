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
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack wrapper for Add flow so AddItem / CreateOutfit push on top
function AddStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddChoice" component={AddScreen} />
      <Stack.Screen name="AddItem" component={AddItemScreen} />
      <Stack.Screen name="CreateOutfit" component={CreateOutfitScreen} />
    </Stack.Navigator>
  );
}

function TabIcon({ icon, label, focused }) {
  return (
    <View style={iconStyles.wrap}>
      <Text style={[iconStyles.icon, focused && iconStyles.iconFocused]}>{icon}</Text>
      <Text style={[iconStyles.label, focused && iconStyles.labelFocused]}>{label}</Text>
    </View>
  );
}

const iconStyles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 6 },
  icon: { fontSize: 22, opacity: 0.35 },
  iconFocused: { opacity: 1 },
  label: { fontSize: 10, color: colors.textTertiary, marginTop: 2, fontWeight: '500' },
  labelFocused: { color: colors.textPrimary, fontWeight: '700' },
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
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 0,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} /> }}
        />
        <Tab.Screen
          name="Outfits"
          component={OutfitsScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon icon="✨" label="Outfits" focused={focused} /> }}
        />
        <Tab.Screen
          name="Add"
          component={AddStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={addIconStyles.circle}>
                <Text style={addIconStyles.plus}>＋</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Planner"
          component={PlannerScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📅" label="Planner" focused={focused} /> }}
        />
        <Tab.Screen
          name="Wardrobe"
          component={WardrobeScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon icon="👗" label="Wardrobe" focused={focused} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const addIconStyles = StyleSheet.create({
  circle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.black,
    alignItems: 'center', justifyContent: 'center',
    marginTop: -10,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  plus: { color: colors.white, fontSize: 24, fontWeight: '300' },
});
