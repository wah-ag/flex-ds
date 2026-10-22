# Variant intent drafts

Draft text for the "What each variant is for" section of each component's
docs page, written 2026-10-22 for the Designer to review. **These are
proposals, not intent.** Nothing here goes into an intent file directly.

How to use this file:

1. The Designer reviews each line: keep it, rewrite it, or delete it.
2. The agreed lines go into each component's Figma documentation frame, as a
   "Variants" section with one line per value (`value: sentence`).
3. doc-generator Job A transposes them from Figma into `variant_intent`
   (`component-intent` skill), and the docs site picks them up on the next
   build.

Legend:

- ✅ restates something the code or Figma already shows (the evidence is
  given in brackets).
- Unmarked lines are proposals. Confirm or rewrite them.

Interaction states that happen by themselves (hover, press, focus, active,
typing) get no line. Only states a developer sets on purpose are drafted.

## Avatar

**size**

- `2xl`: the largest avatar, for profile and company detail pages where the
  person or company is the main subject.
- `xl`: cards and navigation. ✅ (EmployerProfile on job cards and NavItems
  in the top bar both use `xl`.)
- `lg`: list rows and comment threads that need a recognisable face.
- `md`: dense lists and table rows.
- `sm`: inline with text, such as mentions, or stacked avatar groups.

**category**

- `rectangle image`: companies and brands. ✅ (EmployerProfile uses it for
  the employer logo.)
- `circle image`: people. ✅ (NavItems uses it for the signed-in user.)
- `icon`: when there is no photo or logo, or for an entity without one, such
  as a job category. ✅ (The Figma component description, node 32:315,
  mentions "job category".)

## ButtonCTA

**category**: already in the intent file (primary, secondary).

**size**

- `lg`: the main action of a page or form, such as Submit at the end of a
  form.
- `md`: the default size, for actions inside cards, dialogs and sections.
- `sm`: compact areas such as card footers, table rows and toolbars.

**state**

- `disable`: the action isn't available yet, for example while a required
  field is empty. Explain nearby why it's disabled.
- `error`: destructive actions such as Delete or Withdraw application.

## CardContainer

**state**

- `active`: the card that is currently selected or open. *Designer: confirm
  what "active" means here, since it might be "pressed" instead.*

## IconButton

**category**: Figma currently has one shared sentence for all three values.
Proposed replacement:

- `stroke`: actions in the app header, such as notifications and mail. ✅
  (NavItems uses it.)
- `default-fill`: row actions in back-office tables, such as View or Edit.
- `error-fill`: destructive row actions in tables, such as Delete.

**state**

- `disable`: the action isn't available for that item.

## Label

**category**

- `brand`: highlights key attributes in the brand colour. ✅ (JobPosition
  uses it for the job-detail pills.)
- `info`: neutral information or updates.
- `success`: a positive or finished status, such as Hired or Active.
- `error`: a failed or blocked status, such as Rejected or Expired.
- `warning`: something that needs attention soon, such as Closing soon or
  Pending.
- `normal`: a plain tag with no status meaning.

**size**

- `lg`: standalone on detail pages.
- `md`: the default size, on cards. ✅ (JobPosition uses `md`.)
- `sm`: dense tables and lists.

## TextField

**size**

- `lg`: standard forms.
- `sm`: compact places such as filters, table toolbars and back-office
  screens.

**state**

- `error`: the value failed validation. Always show an error message with
  it.
- `disable`: the field can't be edited right now.

## PasswordField

**state**

- `passwordVisible` / `passwordInvisible`: the user has shown or hidden the
  password with the eye toggle.
- `errorVisible` / `errorInvisible`: validation failed, with the password
  shown or hidden. Always show an error message with it.
- `disable`: the field can't be edited right now.

## SearchField

**state**

- `error`: the search can't run, for example because the query is invalid.
  Show a message saying why.
- `disable`: search isn't available in the current context.

## TextArea

**state**

- `disable`: the field can't be edited right now.

## EmployerProfile and JobPosition

No variant property in Figma, so there is nothing to draft.
