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
        },
        li: {
            marginBottom: 'initial',
        },
        'li p': {
            margin: '0',
        },
        'ul ul': {
            marginTop: '0'
        }
    }
}

const typography = new Typography(theme);

const { rhythm, scale } = typography
export { rhythm, scale, typography as default }
