import Typography from 'typography'
import theme from 'typography-theme-wordpress-2016'
import { MOBILE_MEDIA_QUERY } from 'typography-breakpoint-constants'

theme.baseFontSize = '18px'
theme.scaleRatio = 1.5
theme.headerFontFamily.splice(
  theme.headerFontFamily.length - 1,
  0,
  'Nanum Barun Gothic'
)
theme.bodyFontFamily.splice(theme.bodyFontFamily.length - 1, 0, 'Jeju Myeongjo')

const proxy = theme.overrideStyles
theme.overrideStyles = (data, options) => {
  const result = proxy(data, options)

  result[MOBILE_MEDIA_QUERY]['ul,ol'] = {}
  result[MOBILE_MEDIA_QUERY]['ol'] = {
    marginLeft: data.rhythm(1),
  }

  delete result[`ul,ol`]

  return {
    ...result,
    ul: {
      listStyle: 'square',
      paddingLeft: '1.5rem',
      marginLeft: 0,
    },
    li: {
      marginBottom: 'initial',
    },
    ol: {
      marginLeft: data.rhythm(1),
    },
    'li p': {
      margin: '0',
    },
    'ul ul': {
      marginTop: '0',
      paddingLeft: '0',
    },
    'h1 + h2, h2 + h3, h3 + h4, h4 + h5': {
      marginTop: '1rem',
    },
  }
}

const typography = new Typography(theme)

const { rhythm, scale } = typography
export { rhythm, scale, typography as default }
