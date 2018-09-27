import Typography from 'typography'
import theme from 'typography-theme-wordpress-2016'

theme.baseFontSize = '18px';
theme.scaleRatio = 1.50;
theme.headerFontFamily.splice(theme.headerFontFamily.length - 1, 0, 'Nanum Barun Gothic');
theme.bodyFontFamily.splice(theme.bodyFontFamily.length - 1, 0, 'Jeju Myeongjo');

const proxy = theme.overrideStyles;
theme.overrideStyles = (data, rhythm) => {
  const result = proxy(data, rhythm);
  return {
    ...result,
    ul: {
      listStyle: 'square',
      paddingLeft: '1.5rem',
    },
    li: {
      marginBottom: 'initial',
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
    }
  }
}

const typography = new Typography(theme);

const { rhythm, scale } = typography
export { rhythm, scale, typography as default }
