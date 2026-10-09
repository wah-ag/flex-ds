# Target — prop names (for review)

Target is the Figma component `CardContent/Target`, node 32:273. It is built
on `component/target` as `src/components/Target/`.

## Figma properties

| Figma property | Prop | Values |
| --- | --- | --- |
| `targetName` (text) | `targetName` | string (default `"Experience"`) |
| `targetValue` (text) | `targetValue` | string (default `"5 - 7 Years"`) |

The names are as the Figma MCP reports them. Their exact spelling in the
Figma panel could not be read through the API, so the Designer should
confirm them. No prop was renamed. Other HTML attributes pass through to the
wrapping `<div>`.

## Composition

Target composes no other component. It has no subcomponent.

## Layout, as Figma draws it

- The frame hugs its content. Figma binds no width.
- The value (`32:268`) is set to no-wrap, so it stays on one line and sets
  the component's width.
- The name (`32:262`) fills that width and wraps inside it.

## States: none designed

Figma designs no variants, sizes or interaction states for 32:273, and the
content is not interactive. None are built. The owner should confirm that
none are wanted.

## Note: DM Sans optical size

Figma renders both lines with DM Sans at `"opsz" 14`. The browser's
automatic optical sizing uses the font size, so the 12px name renders at
`opsz` 12. The 14px value matches. No token carries an optical size, so this
is not built. The owner accepted the same difference for EmployerProfile and
JobPosition, but ruled on each case separately.

## Tokens used

| Figma variable | Built token |
| --- | --- |
| `spacing/gap/xs` | `--spacing-gap-xs` |
| `label/md` (text style) | `--label-md` |
| `body/md-bold` (text style) | `--body-md-bold` |
| `text/neutral/secondary` | `--text-neutral-secondary` |
| `text/neutral/bold` | `--text-neutral-bold` |
