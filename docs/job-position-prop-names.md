# JobPosition — prop names (for review)

JobPosition is the Figma component `CardContent/JobPosition`, node 32:258.
It is built on `component/job-position` as `src/components/JobPosition/`.

## Figma properties

| Figma property | Prop | Values |
| --- | --- | --- |
| `jobTitle` (text) | `jobTitle` | string (default `"Senior Product Designer"`) |
| `showLabel` (boolean) | `showLabel` | `true` / `false` (default `true`); hides the row of pills |

The names are as the Figma MCP reports them. Their exact spelling in the
Figma panel could not be read through the API, so the Designer should
confirm them.

## Pill props: added, by owner decision (2026-10-09)

Figma has no component property for the two pills' text or icon; they are
instance overrides. The owner ruled that the texts and icons are sample
defaults that must change per use, so they are props. The names below are
**suggestions for review**. Each maps onto Label's own props (`labelText`,
`swapIcon`).

| Suggested prop | Passed to | Default |
| --- | --- | --- |
| `openingsText` | first Label's `labelText` | `"3 openings"` |
| `openingsIcon` | first Label's `swapIcon` (a Lucide component) | `UsersRound` |
| `genderText` | second Label's `labelText` | `"opens to male"` |
| `genderIcon` | second Label's `swapIcon` (a Lucide component) | `VenusAndMars` |

If the Designer adds properties for these to 32:258, the props should follow
Figma's names. Other HTML attributes pass through to the wrapping `<div>`.

## Composition

| Figma instance | Component | As drawn |
| --- | --- | --- |
| 32:239 `Label` | `Label` | `category=brand`, `size=md`, `state=idle` |
| 32:247 `Label` | `Label` | `category=brand`, `size=md`, `state=idle` |

Label is imported as it is. Nothing of it is restyled.

## Pill padding: owner-accepted difference (2026-10-09)

Figma's two instances override Label md's horizontal padding to
`spacing-padding-xs` (4px). Label md uses `spacing-padding-sm` (8px). The
owner ruled: "build JobPosition now according to that completed label". The
pills therefore render at Label's own 8px, and the 4px override is not
built. A token-driven padding setting on Label is planned for Label's own
round; once it exists, JobPosition's pills can pass `xs`.

## Default icons: settled by the Figma vectors (2026-10-09)

Figma's "people" glyph in 32:239 is Lucide `UsersRound`, and its "gender"
glyph in 32:247 is Lucide `VenusAndMars`: their paths, doubled to Lucide's
24 grid, match Lucide's exactly (QA finding on staging 8bf77fe). The first
build used `Users` and `Mars`; the repair round switched the defaults. Both
icons are in the installed `lucide-react` (1.48.0).

## Icon stroke: resolved in Label (PR #77)

Figma binds the pill icons' stroke to 1 unit (`border-width-default` on these
instances; `border-width-icon-default` on the Label md master). Label's fix
(PR #77, merged to `staging` 2026-10-09) draws md and sm icons at
`border-width-icon-default`, which resolves to the same `border-width-md` as
`border-width-default`. JobPosition builds on that Label and overrides
nothing.

## Layout: owner rulings (2026-10-09)

- **Width.** Figma binds no width. The component hugs its content and never
  grows past its parent.
- **Long title.** The title stays on one line and ends in an ellipsis when
  the parent limits the width; the full title is also set as the `title`
  attribute. This replaces the earlier ruling that the title wraps. The
  owner said: "when job position title is longer, I want dots". Figma's
  text layer is fill-width and wraps; this ruling knowingly replaces that,
  as for EmployerProfile. At the sample title the two look the same.
- **Pill row.** Laid out as Figma draws it: one row, no wrap, Labels at
  their own size. In a parent narrower than the two pills, the row
  overflows the parent. The owner accepted this: "overflow is fine".

## States: none, by owner decision (2026-10-09)

Figma designs no states for 32:258, and the content is not interactive. No
hover, press, focus, disabled or destructive look is built for JobPosition,
and none should be tested as missing. Each Label keeps its own pointer hover.

## Note: DM Sans optical size (owner-accepted, 2026-10-09)

Figma renders the pill text with DM Sans at `"opsz" 14`. The browser's
automatic optical sizing uses 12 for 12px text. The owner accepted this.

## Tokens used

| Figma variable | Built token |
| --- | --- |
| `spacing/gap/xxs` | `--spacing-gap-xxs` |
| `spacing/gap/sm` | `--spacing-gap-sm` |
| `title/md` (text style) | `--title-md` |
| `text/neutral/bold` | `--text-neutral-bold` |

Label's variables are resolved in Label's own CSS.
