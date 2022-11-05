export const DIRECTIVE_NAMES = {
    SHOW: 'show',
    CONTENT: 'content',
    ATTR: 'attr'
}

export const DIRECTIVES = [
    ...Object.values(DIRECTIVE_NAMES),
];

export const META_DIRECTIVE_NAMES = {
    EVENT: 'event'
}
export const META_DIRECTIVES = [
    ...Object.values(META_DIRECTIVE_NAMES),
];

export const DIRECTIVE_SEPARATORS = {
    ATTR: '_',
    EVENT: '_'
}