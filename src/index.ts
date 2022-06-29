global.Promise = require('promise')

import './styles/style.scss'
import * as PARSER from './parser.json'

export default function ApplyClassifying () {
    const page = document
    const _root = page.getElementsByTagName('body')

    console.log('%c Classes', 'color: red;')
    handleNextChildren(_root)
}

const handleNextChildren = (_element: HTMLCollection) => {
    let _next: HTMLCollection | undefined // Next HTMLCollection Element

    const arr = [].slice.call(_element);

    // If my DOM element exists, I will loop over the collection for its children to identify nesting and apply classes
    if (_element) {
        if (_element.length > 0) {
            // Looping over the collection
            for (let i = 0; i < _element.length; i++) {
                // Before entering an iteration, I'll read the class of the element I am into right now
                readClassName(_element[i])

                // Then I'll get the _next element as children at i's position
                _next = _element[i].children
                handleNextChildren(_next)
            }
        }
    } else {
        _next = undefined
    }

    return _next
}

const readClassName = (_child: any) => {
    let className: string = ''
    _child.style = styleEnhancer(_child.className)

    return className
}

const styleEnhancer = (_class: string) => {
    let style:string | undefined = ''
    // From the style, I check if it contains any pixel related class, like margin, padding or top/bottom, etc

    const tester = /(\w+)-\d+(\w*)(\%)*/g

    if (!tester.test(_class)) {
        style = classParser(_class)
    }

    return style
}

const classParser = (style: string) => {
    // Use a JSON to handle default module creation
    let _stylesToApply: string = '' // This is what will be returned, as a set of styles all separated by ; and ' '
    let styles: Array<string> | string | null = null

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

const classToStyle = (_singleStyle: string) => {
    const moduleParser: object = PARSER
    let parsed:any = moduleParser[_singleStyle.split('-')[0] as keyof object]


    if (parsed && parsed !== undefined) {
        // style element has to contain both the value and the unit of measure for being a valid input
        if (parsed.includes('!val') && parsed.includes('0!um')) {
            const value = parserRequest(_singleStyle)
            const um = reqUm(value)

            return parsed.replace('!val', value).replace('!um', um)
        }

        return parsed + ' ' +  parserRequest(_singleStyle)
    } else {
        return ''
    }
}

const parserRequest = (_test: string) => {
    const measureRegex: RegExp = /(\w+)-\[(\w*)?(0\.\w+(\%)?)?\]$/g
    const colorRegex: RegExp = /(\w+)-\[(\#(\d{6})?(a|b|c|d|e|f{6})?)?(rgb\((\d*){1,3},(\d*){1,3},(\d*){1,3}\))?\]$/g
    const exadecimalColorRegex: RegExp = /(\w+)-(\[(#(\w+))?\])$/g
    let _value: string = ''

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

    console.log('_value ' + _value)
    return _value
}

const reqUm = (_test: string) => {
    // I split by number, this means that I split every number and use it to get the UM
    let unit = _test.split(/(\d*((\.(\d*))?))/)[1]
    return _test.split(unit)[1]
}

ApplyClassifying ()
