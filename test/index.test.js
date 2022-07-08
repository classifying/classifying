import * as PARSER from './../src/parser.json'

const classParser = (style) => {
    // Use a JSON to handle default module creation
    let _stylesToApply = '' // This is what will be returned, as a set of styles all separated by ; and ' '
    let styles = null

    if (style.includes(' ')) {
        styles = style.split(' ')
    } else {
        styles = style
    }

    if (Array.isArray(styles)) {
        styles.forEach(style => {
            _stylesToApply += classToStyle(style) + '; '
        })
    } else {
        _stylesToApply = classToStyle(styles)
    }
    return _stylesToApply
}

const classToStyle = (_singleStyle) => {
    const moduleParser = PARSER
    let parsed = moduleParser[_singleStyle.split('-')[0]]

    // If the value of a key is another key, use the value as key for another key:
    /*^
     * px: [p] -> px: padding as [p] is a key for padding
     */
    if (parsed != undefined && /(\d*\w*.*)/.test(parsed)) {
        let container = ''
        let _pas = []

        if (parsed.includes(' ')){
            _pas = parsed.split(' ')
            container = ': '
        } else {
            _pas = parsed.split('-')
            container = '-'
        }

        // Array of values, first being the needed key -> [m] | [p] | [...]
        _pas.forEach(_pa => {
            if (/\[(\w*)\]/g.test(_pa)) {
                parsed=(moduleParser[
                                        _pa.replace(/\[/, '')
                                        .replace(/\]/, '')
                                    ]
                        )
                _pas.shift()
                parsed += ( container + _pas.join(' ') )
            }
        })
    }


    if (parsed && parsed !== undefined) {
        // style element has to contain both the value and the unit of measure for being a valid input
        if (parsed.includes('!val') && parsed.includes('0!um')) {
            const value = parserRequest(_singleStyle)
            const um = reqUm(value)

            return parsed.replace('!val', value).replace('!um', um)
        }

        return parsed + ': ' +  parserRequest(_singleStyle)
    } else {
        return ''
    }
}

const parserRequest = (_test) => {
    const measureRegex = /(\w+)-\[(\w*)?(0\.\w+(\%)?)?\]$/g
    const colorRegex = /(\w+)-\[(\#(\d{6})?(a|b|c|d|e|f{6})?)?(rgb\((\d*){1,3},(\d*){1,3},(\d*){1,3}\))?\]$/g
    const hexadecimalColorRegex = /(\w+)-(\[(#(\w+))?\])$/g
    let _value = ''

    switch (true) {
        case measureRegex.test(_test):
        case colorRegex.test(_test):
        case hexadecimalColorRegex.test(_test):
            _value = _test.split('-')[1].replace(/\[/, '')
                                        .replace(/\]/, '')
            break;
        default:
            _value = _test
            break;
    }

    return _value
}

const reqUm = (_test) => {
    // I split by number, this means that I split every number and use it to get the UM
    let unit = _test.split(/(\d*((\.(\d*))?))/)[1]
    return _test.split(unit)[1]
}

describe('Style parser', () => {
    it('Should return a the unit of measure', () => {
        expect(reqUm('10px')).toBe('px')
    })

    it('Should return the value without parenthesis', () => {
        expect(parserRequest('p-[10px]')).toBe('10px')
    })
})

describe('Class to style', () => {
    it('Should convert a class to a style, if there is a single class', () => {
        expect(classToStyle('p-[10px]')).toBe('padding: 10px')
    })
})

describe('Class parser', () => {
    it('Should convert a class to a style, if there is a single class', () => {
        expect(classParser('p-[10px]')).toBe('padding: 10px')
    })

    it('Should convert a class to a style, if there are multiple classes', () => {
        expect(classParser('m-[10px] p-[15px]')).toBe('margin: 10px; padding: 15px; ')
    })
})