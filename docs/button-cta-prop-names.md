# ButtonCTA — prop names for review

ButtonCTA's props use the Figma component property names as written in
camelCase, as agreed with the owner on 2026-09-30: `type`, `size`, `state`,
`buttonLabel`, `leadingIcon`, `trailingIcon`, `swapIcon`.

## Conflict: `type`

Figma's `type` (`primary` | `secondary`) has the same name as the HTML
`<button>` attribute `type` (`button` | `submit` | `reset`). The Figma property
keeps the name `type`. The HTML attribute is exposed under a new name.

| Figma property | Prop | Conflicts with | Suggested name for the other side | Status |
| --- | --- | --- | --- | --- |
| `type` | `type` (unchanged) | HTML `<button type>` | `htmlType`, default `button` | For review |

Alternatives, if `htmlType` is not wanted: `buttonType`, `nativeType`.

The default is `button`, not the HTML default `submit`, so a ButtonCTA inside a
form never submits it unless asked to.
