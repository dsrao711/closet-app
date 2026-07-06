import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

const CAT_EMOJI = {
  top: '👕', bottom: '👖', skirt: '🩱', dress: '👗',
  shoes: '👟', bag: '👜', accessory: '💍', outerwear: '🧥',
};

export default function GarmentThumbnail({ item, size = 46, round = true }) {
  const borderRadius = round ? size / 2 : Math.round(size * 0.22);

  const photoUri = item?.imageUri || item?.imageUrl;
  if (photoUri) {
    return (
      <Image
        source={{ uri: photoUri }}
        style={{ width: size, height: size, borderRadius }}
      />
    );
  }

  return (
    <View style={[
      styles.placeholder,
      { width: size, height: size, borderRadius },
    ]}>
      <Text style={{ fontSize: Math.round(size * 0.44) }}>
        {CAT_EMOJI[item?.category] || '👗'}
      </Text>
    </View>
  );
}

// Overlapping row of thumbnails — for outfit cards
export function ThumbnailRow({ itemIds, items, size = 46, overlap = 14 }) {
  const outfitItems = itemIds
    .map(id => items.find(i => i.id === id))
    .filter(Boolean)
    .slice(0, 5);

  return (
    <View style={{ flexDirection: 'row', height: size }}>
      {outfitItems.map((item, idx) => (
        <View
          key={item.id}
          style={[
            styles.thumbWrap,
            { width: size, height: size, borderRadius: size / 2, marginLeft: idx === 0 ? 0 : -overlap },
          ]}
        >
          <GarmentThumbnail item={item} size={size} round />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.garmentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbWrap: {
    borderWidth: 2,
    borderColor: colors.white,
    overflow: 'hidden',
    backgroundColor: colors.garmentBg,
  },
});
