// The package's only public surface. A component is exported here only once
// its Release Verdict in the registry reads Cleared: the release agent asks
// the Developer to add its line, by pull request into staging, after the
// verdict is written. FieldControl and FieldLabel stay internal: they have no
// Figma node of their own and exist so TextField, PasswordField, SearchField
// and TextArea can share them (docs/field-control-prop-names.md).
//
// No component is Cleared yet (registry read 2026-10-13), so nothing is
// exported, and `npm test` refuses to pass ("src/index.ts exports nothing").
// That refusal is the guard: no package publishes before a component clears.
//
// Styles are not imported here. Load `@wah-ag/flex-ds/tokens.css` and
// `@wah-ag/flex-ds/styles.css` once, at the app root.
export {};
