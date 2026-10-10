# BtnGroup — prop names (for review)

BtnGroup is the Figma component `CardContent/BtnGroup`, node 32:573. It is
built on `component/btn-group` as `src/components/BtnGroup/`.

## Figma properties

None. Figma gives BtnGroup no component properties and exposes no nested
instance property.

## Props with no Figma property (approved by the owner, 2026-10-10)

| Prop | Passes to | Why |
| --- | --- | --- |
| `shotActionProps` | `ShotAction` (`state`, `onClick`, `aria-*`) | ShotAction's `state` is owned by its parent, so the card must be able to set Save / Saved and hear the click. ShotAction's own look cannot be overridden. |
| `buttonCTAProps` | the Share `ButtonCTA` (`onClick`, `aria-*`) | The card must hear the Share click. The Share look (`category`, `size`, `state`, `buttonLabel`, icons) is fixed as Figma draws it and is set after the pass-through, so it cannot be overridden. |

Other HTML attributes pass through to the wrapping `<div>`. No prop was
renamed.

## Composition

BtnGroup imports, unchanged:

- `ShotAction` (Figma instance 32:353, `idle`), which brings `ButtonCTA`;
- `ButtonCTA` (Figma instance 32:517): `secondary`, `sm`, `idle`, leading
  icon only, label "Share".

It has no subcomponent of its own. In Figma it sits in CardHeader's header
slot inside CardContent/CardItem (32:651, instance 32:576).

## Owner rulings, 2026-10-10

- Props: the two pass-through props above.
- Share icon: Lucide `ExternalLink`. Figma's icon layer is named "share",
  but its path, scaled from 16 to 24, is Lucide `ExternalLink`'s exactly
  (`M15 3h6v6`, `M10 14 21 3`, and the same box), not Lucide `Share`.
- No interaction states on BtnGroup itself: it is not interactive. The two
  buttons keep their own (ButtonCTA hover, press, focus; ShotAction idle /
  active).

## Open, not ruled

- Both Figma instances bind `background/neutral/base`; ButtonCTA's
  `secondary` look draws no background. This is ButtonCTA's existing
  behaviour and is left as it is (BtnGroup does not restyle it). It shows
  only on a surface other than `background-neutral-base`.

## Tokens used by BtnGroup itself

| Figma variable | Built token |
| --- | --- |
| `spacing/gap/md` | `--spacing-gap-md` |

Every other value comes from the imported components.
