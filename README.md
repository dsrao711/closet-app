# Divya's Closet

Wardrobe & weekly outfit planner. Expo (React Native), Firebase (Firestore + Storage + Auth), pinned to **Expo SDK 54** — the App Store version of Expo Go only supports up to SDK 54, so don't upgrade the Expo SDK without checking Expo Go's current supported version first.

## Running it on a new device

Everything the app needs (Firebase config, EAS project id, update URL) is already committed — no console setup or logins required just to run it.

```
git clone https://github.com/dsrao711/closet-app.git
cd closet-app
./run.sh
```

`run.sh` installs dependencies if needed and starts the dev server in Expo Go mode. Scan the printed QR / enter the `exp://` URL in the **Expo Go** app (free, App Store).

Alternatively, skip the dev server entirely and open the latest published build directly in Expo Go via:
https://expo.dev/accounts/divyarao0712/projects/closet-app/updates/930773ff-a76e-4376-b986-c3950e3a8b1a

## If you also want to push/publish changes from this device

These are per-device logins and intentionally **can't** be carried over via git (baking credentials into a shared repo would be a security problem, not a convenience):

- Git push access to this repo (SSH key or GitHub credentials configured on this machine)
- `npx eas-cli login` — one-time, logs into the same Expo account (divyarao0712) so `eas update --branch preview --message "..."` can publish

## Publishing an update after a change

```
eas update --branch preview --message "what changed"
```

Then reload the app in Expo Go (shake → Reload) to fetch it.
