// Environment Values
const is_dev = true; // Remember to set to false before build
const prefix = is_dev ? "http://127.0.0.1:8080" : "";

export function basic_info() {
    return new Promise(resolve => {
        fetch(`${prefix}/basic_info`).then(r =>
            resolve(r.json())
        );
    });
}

export function get_blog_content(id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/content/${id}`).then(r => {
                resolve(r.json())
            }
        );
    });
}