export const generateDbId = (): string => {
    return `${parseInt((Date.now() + Math.random()).toString())}`
}