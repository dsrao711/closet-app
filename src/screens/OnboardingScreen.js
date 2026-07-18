import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { saveProfile } from '../data/store';
import { colors, fonts, layout } from '../theme';

export default function OnboardingScreen({ onComplete }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Tell us what to call you.');
      return;
    }
    if (mobile.trim().replace(/\D/g, '').length < 7) {
      Alert.alert('Mobile number required', 'Enter a valid mobile number.');
      return;
    }
    setSaving(true);
    try {
      await saveProfile({ name: name.trim(), mobile: mobile.trim() });
      onComplete();
    } catch (err) {
      Alert.alert('Something went wrong', 'Could not save your details. Try again.');
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.header}>
        <Text style={s.subMono}>WELCOME TO</Text>
        <Text style={s.heading}>Divya's{'\n'}Closet</Text>
        <Text style={s.tagline}>Tell us a bit about you to get started.</Text>
      </View>

      <View style={s.form}>
        <Text style={s.monoLabel}>YOUR NAME</Text>
        <TextInput
          style={s.input}
          placeholder="e.g. Divya Rao"
          placeholderTextColor={colors.inkGhost}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Text style={s.monoLabel}>MOBILE NUMBER</Text>
        <TextInput
          style={s.input}
          placeholder="e.g. 98765 43210"
          placeholderTextColor={colors.inkGhost}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          returnKeyType="done"
        />
      </View>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.continueBtn, saving && { opacity: 0.6 }]}
          onPress={handleContinue}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color={colors.white} />
            : <Text style={s.continueBtnText}>Continue</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'space-between' },
  header: { paddingHorizontal: layout.px, paddingTop: 100 },
  subMono: {
    fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5,
    textTransform: 'uppercase', color: colors.inkGhost, marginBottom: 6,
  },
  heading: {
    fontFamily: fonts.serif, fontSize: 52, lineHeight: 58,
    color: colors.ink, letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: fonts.sans, fontSize: 15, color: colors.inkFaint,
    marginTop: 16, lineHeight: 21,
  },
  form: { paddingHorizontal: layout.px, marginTop: 36 },
  monoLabel: {
    fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1,
    textTransform: 'uppercase', color: colors.inkGhost,
    marginTop: 22, marginBottom: 10,
  },
  input: {
    height: 50, borderWidth: 1, borderColor: colors.lineStrong,
    borderRadius: 14, backgroundColor: colors.paperInput,
    paddingHorizontal: 16, fontFamily: fonts.sans, fontSize: 15,
    color: colors.ink,
  },
  footer: { padding: layout.px, paddingBottom: 40 },
  continueBtn: {
    backgroundColor: colors.ink, borderRadius: 16,
    height: 54, alignItems: 'center', justifyContent: 'center',
  },
  continueBtnText: { fontFamily: fonts.sans700, fontSize: 16, color: colors.white },
});
