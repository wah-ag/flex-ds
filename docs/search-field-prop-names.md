# SearchField — prop and state names (for review)

SearchField is the Figma component set `SearchBarItem/SearchField`, node
199:102 (registry row "SearchBarItem/SearchField"). It is built on
`component/search-field` and lives in `src/components/SearchField/`.

## Subcomponent

SearchField is FieldControl (`src/components/FieldControl/`), imported as it
is, with no edits and no style overrides. FieldControl is a **code-only
subcomponent**: it has **no Figma node of its own** (see
`docs/field-control-prop-names.md`). Components that import it: TextField,
PasswordField and, with this branch, SearchField.

The Designer aligned SearchField's box to FieldControl's on 2026-10-10
(side padding `spacing/padding/md`, typing icon `icon/interactive/brand-idle`,
error background `background/neutral/base`, typing border
`border/interactive/brand-idle`). SearchField therefore has no CSS file.

## Props

Props are the Figma component properties in camelCase, following the
convention agreed for ButtonCTA (`docs/button-cta-prop-names.md`).

| Figma property | Prop | Default |
| --- | --- | --- |
| `state` (variant, 6 values) | `state` | `idle` |
| label text (text, default "Search 250+ Jobs") | `labelText` | `Search 250+ Jobs` |
| show leading (boolean) | `showLeading` | `true` |

`labelText` is the input's placeholder and also its `aria-label` (owner
ruling, 2026-10-10). There is no separate prop for the accessible name, and
no visible label: Figma draws none.

Figma has no size property (it is `size/control/md` tall only, which is
FieldControl's `size="sm"`), no icon swap (the icon is Lucide `Search`), and
no trailing action. SearchField has none of these props.

### Not from Figma

The input's own HTML attributes (`value`, `defaultValue`, `onChange`, `name`,
`id`, `onFocus`, `onBlur`, …) pass through to the `<input>`. It is a plain
`type="text"` input with the standard `value`/`onChange`; there is no submit
prop (owner ruling, 2026-10-10).

## `state` values

| Figma `state` | Meaning | FieldControl look |
| --- | --- | --- |
| `idle` | At rest. | `idle` |
| `hover` | Pointer over the field (real hover; passing it pins the look). Border `border/interactive/brand-hover`, through FieldControl's `hoverBorder="brand-hover"`. | `hover` |
| `typing` | Focused (real focus and input; passing it pins the look). Border and icon brand-idle, brand caret. | `typing` (FieldControl shows the same look as `active` while the field is empty) |
| `focus` | Keyboard focus: the ring is drawn outside the box, so the height never changes (owner ruling). Leading icon stays `icon/neutral/primary`, FieldControl's default `focusLeadingIcon="neutral"`. | `focus` |
| `error` | Held error. | `error` |
| `disable` | Held; the input is really disabled. | `disable` |

Owner rulings, 2026-10-10: no pressed state, no clear or trailing button;
width fills the container (Figma's fixed 352 is ignored); typing semantics
and the typed-text colour follow FieldControl; Figma's `opsz 14` is handled
as FieldControl handles it.

No name was changed from Figma, so there is nothing else to review here.
