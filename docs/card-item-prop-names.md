# CardItem — prop names (for review)

CardItem is the Figma component `CardContent/CardItem`, node 32:651. It is
built on `component/card-item` as `src/components/CardItem/`.

## Figma properties

| Figma property | Prop | Values |
| --- | --- | --- |
| `showSlot` (boolean) | `showSlot` | boolean (default `true`) |
| Slot (slot, 32:647) | `children` | any React node (default `null`) |

The names are as the Figma MCP reports them. Their exact spelling in the
Figma panel could not be read through the API, so the Designer should
confirm them. No prop was renamed.

## Props with no Figma property (approved by the owner, 2026-10-10)

| Prop | Passes to | Why |
| --- | --- | --- |
| `targets` | one `Target` per entry, in order (`targetName`, `targetValue`, ...) | The Target row's content and count change per card. Default: the three Figma draws (Experience / 5 - 7 Years, Job Type / Full - Time, Salary / 15 - 20 Lakh). |
| `employerProfileProps` | `CardHeader` → `EmployerProfile` | The employer content changes per card. |
| `jobPositionProps` | `CardHeader` → `JobPosition` | The job content changes per card. |
| `shotActionProps` | `BtnGroup` → `ShotAction` (`state`, `onClick`, `aria-*`) | The card's parent owns Save / Saved and hears the click. |
| `buttonCTAProps` | `BtnGroup` → the Share `ButtonCTA` (`onClick`, `aria-*`) | The card's parent hears the Share click. BtnGroup fixes the Share look. |

BtnGroup is fixed content in CardHeader's header slot, as Figma draws it,
with no slot prop of its own. Other HTML attributes pass through to the
wrapping `<div>`.

## Composition

CardItem imports, unchanged:

- `CardHeader` (Figma instance 32:541), which brings `EmployerProfile` and
  `JobPosition`;
- `BtnGroup` (Figma instance 32:576, in CardHeader's header slot), which
  brings `ShotAction` and `ButtonCTA`;
- `Target` (three Figma instances in "Container" 32:285).

It has no subcomponent of its own and no code-only subcomponent.

## Owner rulings, 2026-10-10

- Width: the root fills its parent. Figma's fixed 454 is not built.
- The bottom Slot (32:647) fills the width and hugs its content height.
  Figma's fixed 57 is not built.
- The Target row ("Container" 32:285) hugs its content height. Figma's fixed
  48 is not built. It keeps Figma's space-between distribution.
- CardHeader is imported unchanged. Figma's instance overrides (the 252-wide
  EmployerProfile, the 4px JobPosition gap) are not rebuilt, per the
  CardHeader rulings of 2026-10-09.
- No interaction states on CardItem itself: it is not interactive. The
  buttons in BtnGroup keep their own (ButtonCTA hover, press, focus;
  ShotAction idle / active). Stories cover `showSlot` on and off, plus
  content examples.

## Ruled 2026-10-10: minimum gap between Targets

- Figma binds no gap between the Targets in "Container" 32:285, only
  space-between. The owner ruled on 2026-10-10 that the Targets keep at
  least `--spacing-gap-md` apart ("gap-md min gap"), and the row keeps
  space-between. Target values still never wrap (Target's own rule), so in
  a narrow parent the row can overflow, but the Targets no longer touch.

## Tokens used by CardItem itself

| Figma variable | Built token | Where |
| --- | --- | --- |
| `spacing/gap/sm` | `--spacing-gap-sm` | Root column: content above Slot |
| `spacing/gap/lg` | `--spacing-gap-lg` | Content column: CardHeader above the Target row |
| none (owner ruling 2026-10-10) | `--spacing-gap-md` | Target row: minimum gap between Targets |

Every other value comes from the imported components.
