export function api_prefix() {
    let protocol = window.location.protocol;
    let hostname = window.location.hostname;
    let port = window.location.port;
    if (port === null || port === undefined || port === "")
        port = null;

    return `${protocol}//${hostname}${port != null ? `:${8080}` : ""}`;
}