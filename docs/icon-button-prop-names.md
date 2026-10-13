# IconButton — prop names

IconButton's props are the Figma component properties of node 45:324, in
camelCase, following the convention agreed for ButtonCTA on 2026-09-30
(`docs/button-cta-prop-names.md`). They are proposed here for review.

Rebuilt from scratch on 2026-10-13 at the owner's request, from the node as
it reads that day. Figma added the `category` variant property since the
first build.

| Figma property | Prop | Values |
| --- | --- | --- |
| `category` (variant) | `category` | `stroke` (default), `default-fill`, `error-fill` |
| `state` (variant) | `state` | `idle` (default), `hover`, `press`, `disable` |
| instance swap on the icon (default: the ringing bell, Lucide `BellRing`) | `swapIcon` | any Lucide icon component |

The Figma MCP reports the instance-swap property as `swapIcon`; its exact
spelling in the Figma panel (ButtonCTA's is `swap icon`) was not readable
through the API and should be confirmed by the Designer.

`category` and `state` keep Figma's spelling exactly, including the hyphen in
`default-fill` and `error-fill`, and `disable` (not `disabled`).

IconButton has one size in Figma (48 × 48, `size/control/lg`) and no `size`
property, so it has no `size` prop.

`category` defaults to `stroke`, the Figma default, so every IconButton
already in use (NavItems, the CardHeader stories) renders exactly as before
without a change.

## Not in Figma, by owner decision: `focus`

Figma has no `focus` state for IconButton, in any category, and the owner has
decided it is out of scope (first build). The owner was told that keyboard
users get no designed focus indicator and accepted it. The browser's own
focus outline is left in place, not suppressed. `state` has no `focus` value.

The destructive case, ruled out at the first build, now exists in Figma as
`category="error-fill"`, and is built.

## Not from Figma: `type`

`type` is the HTML `<button type>` attribute (`button` | `submit` | `reset`),
passed straight to the element. It defaults to `button`, not the HTML default
`submit`, so an IconButton inside a form never submits it unless asked to.

## Not from Figma: `disabled`

The native `disabled` attribute, passed straight to the element. It disables
the button exactly as `state="disable"` does. `state="disable"` is the Figma
name and the one the stories use.

## Not from Figma: `aria-label`

An icon-only button has no visible text, so it needs an accessible name. It
is the native `aria-label` attribute, passed straight to the element, not a
new prop. The stories pass `aria-label="Notifications"` for the bell.
