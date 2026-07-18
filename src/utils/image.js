import * as ImageManipulator from 'expo-image-manipulator';

// Downscales + compresses a picked photo before it's stored/uploaded —
// camera captures can be 10+ MB at full resolution, which is wasteful
// to upload and slow to re-download just to render a small thumbnail.
export async function resizeForUpload(uri) {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1000 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}
