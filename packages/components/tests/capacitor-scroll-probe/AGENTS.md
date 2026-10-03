# Capacitor scroll probe

This is a synthetic shared-component test host, not the Lody mobile application.
Use the real legacy drawer, `@lody/ui` drawer, and session diff wrapper. Do not
copy their implementations, override pointer events on the diff, or introduce
product credentials, real conversations, hosted backends, or Electron IPC.

Keep its npm closure outside the root pnpm workspace. Android sources, built
assets, local SDK paths, and signing keys are generated and ignored. The APK
uses a distinct application ID and debug signing. Browser wheel evidence does
not establish Android touch behavior; record the actual device result separately.

Each mode starts with a fresh modal tree. Do not switch implementations while
the inner modal is open: mixed modal cleanup can obscure the original pointer
scope failure.
