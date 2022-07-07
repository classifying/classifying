const parserRequest = (_test) => {
    const measureRegex = /(\w+)-\[(\w*)?(0\.\w+(\%)?)?\]$/g
    const colorRegex = /(\w+)-\[(\#(\d{6})?(a|b|c|d|e|f{6})?)?(rgb\((\d*){1,3},(\d*){1,3},(\d*){1,3}\))?\]$/g
    const exadecimalColorRegex = /(\w+)-(\[(#(\w+))?\])$/g
    let _value = ''

    switch (true) {
        case measureRegex.test(_test):
        case colorRegex.test(_test):
        case exadecimalColorRegex.test(_test):
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