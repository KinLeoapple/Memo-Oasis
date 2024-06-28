export function distance_to_top(tag) {
    const element = document.querySelector(tag);
    return element.getBoundingClientRect().top;
}