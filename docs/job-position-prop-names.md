# JobPosition — prop names

JobPosition is the Figma component `CardContent/JobPosition`, node 32:258.
It is built on `component/job-position` as `src/components/JobPosition/`.

## Figma properties

| Figma property | Prop | Values |
| --- | --- | --- |
| `jobTitle` (text) | `jobTitle` | string (default `"Senior Product Designer"`) |
| `show label` (boolean) | `showLabel` | `true` / `false` (default `true`); hides the row of pills |
| exposed instance `openingsLabel` (32:239, Label) | `openingsLabel` | object of Label props; see below |
| exposed instance `genderLabel` (32:247, Label) | `genderLabel` | object of Label props; see below |

The Figma panel spellings were read through the Plugin API on 2026-10-17
(see *Evidence*). `show label` becomes `showLabel` under the camelCase
convention agreed for ButtonCTA on 2026-09-30
(`docs/button-cta-prop-names.md`), the same way Label's `label text`,
`show icon` and `swap icon` are `labelText`, `showIcon` and `swapIcon`. No
name is renamed beyond that convention.

## Pill props: owner decision (2026-10-17)

The owner ruled on 2026-10-09 that the pill texts and icons are sample
defaults that change per use, so they are props. The first build named them
`openingsText`, `openingsIcon`, `genderText` and `genderIcon` as suggestions
for review. The release review of JobPosition at 2e7d9c7
(`reports/release-review/JobPosition-2e7d9c7.md`, PR #189) was Blocked on
gate 5 because those suggestions had no recorded decision.

The owner decided on 2026-10-17, quoted exactly:

> "I want different names for the JobPosition pill props; the Designer will
> add Figma properties on 32:258 first."

For the API shape the owner chose "Pass-through (Recommended)": one props
object per exposed Label instance, holding Label's own prop names, the same
pattern as BtnGroup's `buttonCTAProps` (`docs/btn-group-prop-names.md`).
After the Designer's change the owner said: "yes I update it check it". The
Figma check below confirms it.

The four suggested props are removed. They are replaced by:

| Prop | Figma instance | Spread onto | Default |
| --- | --- | --- | --- |
| `openingsLabel` | 32:239 `openingsLabel` | first `Label` | `{ category: 'brand', size: 'md', state: 'idle', labelText: '3 openings', swapIcon: UsersRound }` |
| `genderLabel` | 32:247 `genderLabel` | second `Label` | `{ category: 'brand', size: 'md', state: 'idle', labelText: 'opens to male', swapIcon: VenusAndMars }` |

Each object takes Label's own code props, which map to Label's Figma
properties as `docs/label-prop-names.md` records:

| Label Figma property | Label prop |
| --- | --- |
| `label text` | `labelText` |
| `swap icon` | `swapIcon` (a Lucide component) |
| `show icon` | `showIcon` |
| `size` | `size` |
| `state` | `state` |
| `category` | `category` |

The consumer's object is spread after the defaults, so any key it passes
overrides that default and every other key keeps it. With neither prop
passed, the render is the same as before. Other HTML attributes pass
through to the wrapping `<div>`.

Example: `<JobPosition openingsLabel={{ labelText: '1 opening' }}
genderLabel={{ labelText: 'opens to female', swapIcon: Venus }} />`.

### Evidence (Figma Plugin API, read-only, 2026-10-17)

Gathered by the main session through `use_figma` on file
`de4EKsCcP28lQPV2upHdAN`, and confirmed by the Developer through
`get_metadata` on 32:258 (the two instance names):

- 32:258 is a COMPONENT whose parent is the page. Its
  `componentPropertyDefinitions` are `show label#32:45` (BOOLEAN, default
  `true`) and `jobTitle#32:47` (TEXT, default "Senior Product Designer").
- 32:239 is named `openingsLabel`, with `isExposedInstance = true`. Its main
  component is Label "size=md, state=idle, category=brand". Its properties:
  `label text` = "3 openings", `swap icon` = 232:832, `show icon` = true,
  size md, state idle, category brand.
- 32:247 is named `genderLabel`, with `isExposedInstance = true`. It uses
  the same Label: `label text` = "opens to male", `swap icon` = 232:840,
  `show icon` = true, md / idle / brand.
- Label's property definitions are `label text`, `swap icon`, `show icon`,
  `size`, `state` and `category`.

Generated code from `get_design_context` does not list exposed nested
instances. That is a limit of the tool, not a disagreement with the
evidence above.

## Composition

| Figma instance | Component | As drawn |
| --- | --- | --- |
| 32:239 `openingsLabel` | `Label` | `category=brand`, `size=md`, `state=idle` |
| 32:247 `genderLabel` | `Label` | `category=brand`, `size=md`, `state=idle` |

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
