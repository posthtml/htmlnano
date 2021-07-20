const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'htmlnano',
  tagline: 'Modular HTML minifier',
  url: 'https://htmlnano.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  organizationName: 'posthtml',  
  projectName: 'htmlnano', 
  trailingSlash: false,
  themeConfig: {
    navbar: {
      title: 'htmlnano',
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          href: 'https://github.com/posthtml/htmlnano',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', 
          editUrl:
            'https://github.com/posthtml/htmlnano/edit/master/docs/',
        },
      },
    ],
  ],
};
