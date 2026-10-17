// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
// Both written by scripts/generate.mjs: the component pages that exist
// (Completed or Released, Release Verdict Cleared) and the site's sources.
import components from './src/generated/components.json' with { type: 'json' };
import site from './src/generated/site.json' with { type: 'json' };

// The sidebar is written out item by item, in the order the astro-page
// skill fixes. No autogenerate: a missing page fails the build instead of
// vanishing from the navigation.
export default defineConfig({
	site: site.docsUrl,
	// Token names and source text are shown as written: no `--` to en dash,
	// no straight quotes curled.
	markdown: { smartypants: false },
	integrations: [
		starlight({
			title: 'Flex DS',
			social: [{ icon: 'github', label: 'GitHub', href: site.github }],
			head: [
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
				{ tag: 'link', attrs: { rel: 'stylesheet', href: site.fonts } },
			],
			customCss: ['./src/generated/tokens.css', './src/generated/tokens-dark.css', './src/styles/flex.css'],
			sidebar: [
				{
					label: 'Get Started',
					items: [
						{ label: 'Changelog', slug: 'changelog' },
						{ label: 'Roadmap', slug: 'roadmap' },
						{ label: 'News', slug: 'news' },
						{ label: 'Versioning', slug: 'get-started/versioning' },
						{ label: 'Upgrading', slug: 'get-started/upgrading' },
					],
				},
				{ label: 'Designing', items: [{ label: 'Introduction', slug: 'designing/introduction' }] },
				{
					label: 'Developing',
					items: [
						{ label: 'Introduction', slug: 'developing/introduction' },
						{ label: 'React', slug: 'developing/react' },
						{ label: 'React Router', slug: 'developing/react-router' },
					],
				},
				{ label: 'Skills', items: [{ label: 'Knowledge skill', slug: 'skills/knowledge-skill' }] },
				{
					label: 'Core',
					items: [
						{
							label: 'Components',
							items: [{ label: 'All components', slug: 'components' }, ...components],
						},
						{ label: 'Tokens', slug: 'tokens' },
					],
				},
				{ label: 'Styling', items: [{ label: 'Theming', slug: 'styling/theming' }] },
				{
					label: 'Help',
					items: [
						{ label: 'FAQ', slug: 'help/faq' },
						{ label: 'Report a bug', slug: 'help/report-a-bug' },
						{ label: 'Request a feature', slug: 'help/request-a-feature' },
						{ label: 'Contributing', slug: 'help/contributing' },
						{ label: 'Embedding', slug: 'help/embedding' },
					],
				},
			],
		}),
	],
});
