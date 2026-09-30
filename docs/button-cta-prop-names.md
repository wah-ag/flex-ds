# ButtonCTA — prop names

ButtonCTA's props are the Figma component properties of node 16:438, in
camelCase, as agreed with the owner on 2026-09-30.

| Figma property | Prop |
| --- | --- |
| `category` (variant: `primary`, `secondary`) | `category` |
| `size` (variant: `lg`, `md`, `sm`) | `size` |
| `state` (variant: `idle`, `hover`, `press`, `focus`, `disable`, `error`) | `state` |
| `button label` (text) | `buttonLabel` |
| `leading icon` (boolean) | `leadingIcon` |
| `trailing icon` (boolean) | `trailingIcon` |
| `swap icon` (instance swap) | `swapIcon` |

## Not from Figma: `type`

`type` is the HTML `<button type>` attribute (`button` | `submit` | `reset`),
passed straight to the element. It defaults to `button`, not the HTML default
`submit`, so a ButtonCTA inside a form never submits it unless asked to.

Earlier the Figma variant property was named `type`, which clashed with this
attribute, and the attribute was exposed as `htmlType`. Figma now names it
`category`, so there is no clash and `htmlType` is gone.
