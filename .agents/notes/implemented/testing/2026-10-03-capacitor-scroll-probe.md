# Android host for the nested diff scroll probe

Status: implemented
Date: 2026-10-03
Translation: current

[中文](2026-10-03-capacitor-scroll-probe.zh.md)

## Abstract

Browser wheel evidence confirmed a nested modal pointer-scope problem, but the
reported failure concerns Android touch input. A separate synthetic Capacitor
host now imports the real drawer implementations and switches between the body
portal and fixed container in fresh modal trees. A fork-only workflow builds a
debug APK without product credentials or release signing keys. This enables
device investigation without claiming to recreate the complete Lody mobile app;
actual Android observations remain pending.

## Decision

The public repository contains Capacitor-aware shared UI but not the mobile
application host. The probe belongs under components tests, uses an isolated npm
closure for pinned Capacitor 8.0.0, and generates its Android project. No private
application source or new root workspace package is introduced. Root workspace
dependencies provide React, Vite, StyleX, Tailwind, and the real drawer graph.

The user-visible mode picker creates a fresh session modal for each comparison.
Only the inner content component changes: `Drawer.Content` before, and
`SessionMobileDiffDrawerContent` after. Scroll positions and effective pointer
events can be read without modifying hit testing. Diagnostic controls are
outside the diff but inside the outer session modal.

The workflow is scoped to `scbizu/Lody` and the dedicated test branch, uses
read-only repository permissions, and uploads a debug APK with its source SHA
and checksum. It neither changes the upstream fix branch nor publishes releases.
Generated Android sources and local/build artifacts remain ignored.

The owning [portal fix](../bug-fix/2026-10-03-mobile-diff-portal-scope.md) and
[probe instructions](../../../../packages/components/tests/capacitor-scroll-probe/README.md)
describe the evidence and device procedure.

## Verification

The production web bundle, probe typecheck, changed-file lint/format, and generated
Android configuration pass locally. The owning drawer suite passes 17 cases.
Root `pnpm format` passes; root `pnpm check` and boundary/docs checks remain
limited by uninitialized unrelated ACP submodules, without changed-file docs errors.
Computer Use cannot obtain a Lody/Dia window in this run, so the new host's browser
interaction is not claimed verified. APK compilation runs in GitHub Actions because the local machine lacks
an Android SDK/JDK. A successfully built APK does not establish touch behavior;
the reported Android 16 / WebView 155 environment still needs manual validation.
