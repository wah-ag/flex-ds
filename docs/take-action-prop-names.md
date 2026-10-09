# TakeAction — prop names and provisional decisions (for review)

TakeAction is the Figma component `CardContent/TakeAction`, node 32:652. It
is built on `component/take-action` as `src/components/TakeAction/`.

The registry has two Components rows named CardContent/TakeAction, both
pointing at node 32:652: `recOOCMvCVRYkRdac` (ATOMS) and `recgFTUGQVi3i9NOj`
(MOLECULES). The owner said to build for the ATOMS row, and the Developer
writes only to that one. The MOLECULES row is the Designer's to resolve.

## Provisional, awaiting owner confirmation

Figma leaves these open. The owner has not ruled on each one, so the build
uses the defaults below. A reviewer can reject any of them before the pull
request is merged.

1. **Component width.** Figma fixes the frame at an unbound width of 454.
   The component fills its parent's width instead.
2. **Button width.** Figma's ButtonCTA instance (32:628) has an unbound
   fixed width of 124. ButtonCTA keeps its own content width; TakeAction
   overrides none of its styles. A fixed or full-width button would need a
   ButtonCTA option, in ButtonCTA's own round.
3. **Time text width.** Figma fixes the text (32:620) at an unbound width of
   111. It hugs its content, stays on one line, and ends in an ellipsis
   when it overflows.
4. **Prop names.** Figma reports no component properties for 32:652. The
   props are `timeRemaining` (from the layer name "Time Remaining") and
   `buttonLabel` (ButtonCTA's own prop name for its label).
5. **`buttonProps`.** It passes through to the ButtonCTA (for example
   `onClick`, `state`, `type`, `aria-*`), so the button can act. This follows
   the `avatarProps` pattern approved for EmployerProfile, which was ruled for
   that component only.
6. **States.** One default story. TakeAction has no states of its own; the
   button's hover, press, focus and disabled states are ButtonCTA's, through
   real input or `buttonProps.state`.
7. **Clock and text group.** Figma's "Closing Time" frame (32:627) is a
   plain frame, not a Label instance, and it is built inside TakeAction. It
   is not extracted as a subcomponent. Label lg info looks similar, but it
   has a pill background, padding and hover, so importing it would need
   style overrides.

## Props

| Prop | Source | Values |
| --- | --- | --- |
| `timeRemaining` | text layer "Time Remaining" (32:620) | string (default `"Closes in 12 days"`) |
| `buttonLabel` | ButtonCTA `button label` on 32:628 | string (default `"Apply Now"`) |
| `buttonProps` | not from Figma | object, spread onto ButtonCTA before `buttonLabel` |

Other HTML attributes pass through to the wrapping `<div>`. No Figma name
was renamed.

## Composition

TakeAction imports **ButtonCTA** unchanged, as Figma's instance sets it:
`category="primary"`, `size="md"`, `leadingIcon={false}`,
`trailingIcon={false}`. `buttonProps` may override these. The icon is Lucide
`Clock`, matching Figma's layer "Clock" (32:623). TakeAction has no
code-only subcomponent.

## Note: DM Sans optical size

Figma renders the 14px time text and the button label at `"opsz" 14`, which
is what the browser picks automatically at 14px, so they match.

## Tokens used

| Figma variable | Built token |
| --- | --- |
| `border/neutral/base` | `--border-neutral-base` |
| `border-width-divider` | `--border-width-divider` |
| `spacing/padding/sm` | `--spacing-padding-sm` |
| `spacing/gap/xs` | `--spacing-gap-xs` |
| `label/lg` (text style) | `--label-lg` |
| `text/interactive/info` | `--text-interactive-info` |
| `icon/interactive/info` | `--icon-interactive-info` |
| `size/icon/sm` | `--size-icon-sm` |
| `border-width-icon-bold` | `--border-width-icon-bold` |

The button's tokens (`background/interactive/brand-idle`,
`text/neutral/inverse`, `body/cta`, `spacing/padding/md`, `size/control/md`,
`border-radius-control-xs`) come from ButtonCTA md primary.
