# IconButton — prop names

IconButton's props are the Figma component properties of node 45:324, in
camelCase, following the convention agreed for ButtonCTA on 2026-09-30
(`docs/button-cta-prop-names.md`). They are proposed here for review.

| Figma property | Prop |
| --- | --- |
| `state` (variant: `idle`, `hover`, `press`, `disable`) | `state` |
| instance swap on the icon (default: the bell, Lucide `Bell`) | `swapIcon` |

The Figma MCP reports the instance-swap property as `swapIcon`; its exact
spelling in the Figma panel (ButtonCTA's is `swap icon`) was not readable
through the API and should be confirmed by the Designer.

IconButton has one size in Figma (48 × 48, `size/control/lg`) and no `size`
property, so it has no `size` prop.

## Not in Figma, by owner decision: `focus` and `error`

Figma has no `focus` or destructive (`error`) state for IconButton, and the
owner has decided both are out of scope. The owner was told that keyboard
users get no visible focus indicator and accepted it. `state` therefore has
no `focus` or `error` value.

## Not from Figma: `type`

`type` is the HTML `<button type>` attribute (`button` | `submit` | `reset`),
passed straight to the element. It defaults to `button`, not the HTML default
`submit`, so an IconButton inside a form never submits it unless asked to.

## Not from Figma: `aria-label`

An icon-only button has no visible text, so it needs an accessible name. It
is the native `aria-label` attribute, passed straight to the element, not a
new prop. The stories pass `aria-label="Notifications"` for the bell.
