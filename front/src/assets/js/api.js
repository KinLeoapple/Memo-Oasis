export function basic_info(prefix = "") {
    return new Promise(resolve => {
        fetch(`${prefix}/basic_info`).then(r =>
            resolve(r.json())
        );
    });
}