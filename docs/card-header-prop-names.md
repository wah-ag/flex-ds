# CardHeader — prop names (for review)

CardHeader is the Figma component `CardContent/CardHeader`, node 32:346. It
is built on `component/card-header` as `src/components/CardHeader/`.

## Figma properties

| Figma property | Prop | Values |
| --- | --- | --- |
| `showHeaderSlot` (boolean) | `showHeaderSlot` | boolean (default `true`) |
| header slot (slot, 32:344) | `children` | any React node (default `null`) |

The names are as the Figma MCP reports them, and the owner confirmed them on
2026-10-09. Their exact spelling in the Figma panel could not be read through
the API, so the Designer should confirm them. No prop was renamed.

## Props with no Figma property (approved by the owner, 2026-10-09)

| Prop | Passes to | Why |
| --- | --- | --- |
| `employerProfileProps` | `EmployerProfile` (`employerTitle`, `postedTime`, `showHelperText`, `avatarProps`, ...) | The employer content changes per card. |
| `jobPositionProps` | `JobPosition` (`jobTitle`, `showLabel`, `openingsText`, `openingsIcon`, `genderText`, `genderIcon`, ...) | The job content changes per card. |

Other HTML attributes pass through to the wrapping `<div>`.

## Composition

CardHeader imports, unchanged:

- `EmployerProfile` (Figma instance 32:338), which brings `Avatar`;
- `JobPosition` (Figma instance 32:286), which brings two `Label`s.

It has no subcomponent of its own.

## Owner rulings, 2026-10-09

- Width: the row fills its parent. Figma's unbound 439 is not built.
- The content column and the header slot keep at least `spacing-gap-lg`
  between them. Figma binds no gap there.
- The header slot hugs its content and sits at the top. Figma's unbound
  40 height is not built.
- JobPosition's title-to-pills gap: the CardHeader instance uses
  `spacing/gap/xs` (4), the JobPosition main component `spacing/gap/xxs` (2).
  This is a Figma mismatch the Designer fixes in Figma. JobPosition is
  imported as it is and renders `spacing-gap-xxs`.
- EmployerProfile hugs its content inside CardHeader; Figma's instance width
  of 252 is not built.
- The pills keep Label md padding (`spacing-padding-sm`), per the 2026-10-09
  Label ruling.
- No interaction states: CardHeader is not interactive. The slot content
  brings its own states.
- DM Sans renders at `opsz` 12 on the 12px texts instead of Figma's 14;
  accepted.

## Tokens used by CardHeader itself

| Figma variable | Built token |
| --- | --- |
| `spacing/gap/lg` | `--spacing-gap-lg` |

The minimum gap between the column and the slot also uses
`--spacing-gap-lg` (owner ruling above). Every other value comes from the
imported components.
