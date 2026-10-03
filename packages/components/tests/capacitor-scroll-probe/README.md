# Android scroll probe

Synthetic review-diff test host for [#1223](https://github.com/LodyAI/Lody/issues/1223).
It imports the real legacy session drawer, Base UI drawer, and
`SessionMobileDiffDrawerContent` from this checkout. It contains no Lody account,
workspace, daemon, real conversation, or product backend. It does not test the
complete file-viewer flow.

## Build

Install the root workspace first, then run from this directory:

```sh
npm ci --ignore-scripts
npm run build
npm run android:prepare
cd android
./gradlew assembleDebug
```

Android sources are generated from pinned Capacitor 8.0.0 and ignored. The
`android:prepare` command is for a fresh checkout; use `npx cap sync android`
when the generated Android directory already exists. The build requires Node
22+, JDK 21, and Android SDK platform/build-tools 36. It uses the distinct ID
`io.github.scbizu.lodyscrollprobe` and a debug signature.

The fork-only `Capacitor scroll probe APK` workflow runs on pushes to
`test/capacitor-diff-scroll`. Download the `lody-scroll-probe-*` artifact;
it contains the APK, source revision, and checksum. No release keys are used.

For a local browser preview, run `npm run preview -- --port 6110` after building.

## Device procedure

1. Install the APK on the Android device using the reported WebView version.
2. Choose **修复前**, then **打开 review diff**. Read the current state, scroll
   vertically over the code area, and read again. Record chat/diff positions.
3. Close the diff, return to the mode picker, and choose **修复后**. Repeat.
   Scrolling in either direction should move the diff without moving chat.
4. Check line selection and the diff's close button in the fixed mode. Closing
   the diff should leave the session drawer open.
5. Note Android and WebView versions, source revision, and observations. The
   environment panel shows the WebView user agent; it does not change its version.

Each mode uses a fresh modal tree to avoid conflating cleanup interactions with
portal placement. The diagnostic controls belong to the outer session drawer
and do not override pointer events on the diff. Only styling and synthetic
content differ from the product. Browser wheel testing and device touch testing
must be reported separately.
