/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.base-content'),
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: theme('colors.primary-focus'),
              },
            },
            h1: {
              fontSize: theme('fontSize.4xl')[0],
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.12'),
              marginBottom: theme('spacing.8'),
              borderBottomWidth: '2px',
              borderBottomColor: theme('colors.base-300'),
              paddingBottom: theme('spacing.2'),
              color: theme('colors.primary'),
            },
            h2: {
              fontSize: theme('fontSize.3xl')[0],
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.10'),
              marginBottom: theme('spacing.6'),
              borderBottomWidth: '2px',
              borderBottomColor: theme('colors.base-300'),
              paddingBottom: theme('spacing.2'),
              color: theme('colors.secondary'),
            },
            h3: {
              fontSize: theme('fontSize.2xl')[0],
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.5'),
              borderBottomWidth: '2px',
              borderBottomColor: theme('colors.base-300'),
              paddingBottom: theme('spacing.2'),
              color: theme('colors.accent'),
            },
            'h1, h2, h3, h4, h5, h6': {
              scrollMarginTop: theme('spacing.20'),
            },
            ul: {
              listStyleType: 'disc',
              paddingLeft: theme('spacing.6'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              li: {
                paddingLeft: theme('spacing.2'),
                marginBottom: theme('spacing.2'),
                borderLeftWidth: '4px',
                borderLeftColor: theme('colors.accent/30'),
                paddingLeft: theme('spacing.3'),
                backgroundColor: theme('colors.base-100/50'),
                borderRadiusTopRight: theme('borderRadius.lg'),
                borderRadiusBottomRight: theme('borderRadius.lg'),
                marginLeft: `-${theme('spacing.2')}`,
                '&:hover': {
                  borderLeftColor: theme('colors.accent/60'),
                },
              },
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: theme('spacing.6'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              li: {
                paddingLeft: theme('spacing.2'),
                marginBottom: theme('spacing.2'),
                borderLeftWidth: '4px',
                borderLeftColor: theme('colors.accent/30'),
                paddingLeft: theme('spacing.3'),
                backgroundColor: theme('colors.base-100/50'),
                borderRadiusTopRight: theme('borderRadius.lg'),
                borderRadiusBottomRight: theme('borderRadius.lg'),
                marginLeft: `-${theme('spacing.2')}`,
                '&:hover': {
                  borderLeftColor: theme('colors.accent/60'),
                },
              },
            },
            p: {
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.4'),
              lineHeight: theme('lineHeight.relaxed'),
            },
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: theme('colors.primary'),
              backgroundColor: theme('colors.base-100/50'),
              paddingLeft: theme('spacing.6'),
              paddingRight: theme('spacing.4'),
              paddingTop: theme('spacing.4'),
              paddingBottom: theme('spacing.4'),
              borderRadiusTopRight: theme('borderRadius.lg'),
              borderRadiusBottomRight: theme('borderRadius.lg'),
              fontStyle: 'italic',
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
            },
            code: {
              backgroundColor: theme('colors.base-200'),
              color: theme('colors.accent'),
              padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
              borderRadius: theme('borderRadius.md'),
              fontSize: theme('fontSize.sm')[0],
              fontWeight: theme('fontWeight.medium'),
            },
            pre: {
              backgroundColor: theme('colors.base-200'),
              borderRadius: theme('borderRadius.lg'),
              padding: theme('spacing.4'),
              overflowX: 'auto',
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              borderLeftWidth: '4px',
              borderLeftColor: theme('colors.accent'),
              code: {
                backgroundColor: 'transparent',
                padding: '0',
                fontSize: theme('fontSize.sm')[0],
              },
            },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              backgroundColor: theme('colors.base-100/50'),
              borderRadius: theme('borderRadius.lg'),
              overflow: 'hidden',
            },
            'thead th': {
              backgroundColor: theme('colors.primary/10'),
              padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
              fontWeight: theme('fontWeight.semibold'),
              textAlign: 'left',
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.base-200'),
            },
            'tbody td': {
              padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.base-200'),
            },
            'tbody tr:last-child td': {
              borderBottomWidth: '0',
            },
          },
        },
        lg: {
          css: {
            h1: {
              fontSize: theme('fontSize.5xl')[0],
            },
            h2: {
              fontSize: theme('fontSize.4xl')[0],
            },
            h3: {
              fontSize: theme('fontSize.3xl')[0],
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}