// Environment Values
const is_dev = true; // Remember to set to false before build
const prefix = is_dev ? "http://127.0.0.1:8080" : "";

export function basic_info() {
    return new Promise(resolve => {
        fetch(`${prefix}/basic_info`).then(r =>
            resolve(r.json())
        ).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_blog_content(id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/content/${id}`).then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function post_login(username, password, salt) {
    return new Promise(resolve => {
        fetch(`${prefix}/login`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        }).then(r => {
            resolve(r.json())
        }).catch(error => resolve(new Promise(() => resolve(null))));
    });
}