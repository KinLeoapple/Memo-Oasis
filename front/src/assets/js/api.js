export function basic_info(prefix = "") {
    return new Promise(resolve => {
        fetch(`${prefix}/basic_info`).then(r =>
            resolve(r.json())
        );
    });
}

export function get_blog_content(id, prefix = "") {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/content/${id}`).then(r => {
                resolve(r.json())
            }
        );
    });
}