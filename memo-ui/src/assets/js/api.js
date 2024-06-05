// Environment Values
import {crypt_str} from "@/assets/js/crypt.js";

let protocol = window.location.protocol;
let hostname = window.location.hostname;
let port = window.location.port;
if (port === null || port === undefined || port === "")
    port = null;

const prefix = `${protocol}//${hostname}${port != null ? `:${8080}` : ""}`;

export function basic_info() {
    return new Promise(resolve => {
        fetch(`${prefix}/basic_info`).then(r =>
            resolve(r.json())
        ).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_blog_all() {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/null`).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_blog(id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/${id}`).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_blog_content(id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/content/${id}`).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function post_login(username, password) {
    return new Promise(resolve => {
        crypt_str(password).then(hash => {
            fetch(`${prefix}/login`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: hash,
                })
            }).then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
        });
    });
}

export function get_draft(token, id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/draft/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_draft_all(token) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/draft/null`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function post_draft(token, title, draft, id = null) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/draft/${id}`, {
            method: "POST",
            mode: "cors",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
                draft: draft
            })
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function post_blog(token, title, blog, catId, blogDes, id = null) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/${id}`, {
            method: "POST",
            mode: "cors",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
                blog: blog,
                cat_id: catId,
                blog_des: blogDes
            })
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function post_img(token, file, id = null) {
    return new Promise(resolve => {
        const form = new FormData();
        form.append("file", file);

        fetch(`${prefix}/img/${id}`, {
            method: "POST",
            mode: "cors",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: form
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function post_category(token, categoryName, id = null) {
    return new Promise(resolve => {
        fetch(`${prefix}/cat/${id}`, {
            method: "POST",
            mode: "cors",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                catName: categoryName,
            })
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_category(id) {
    return new Promise(resolve => {
        fetch(`${prefix}/cat/${id}`)
            .then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_category_all() {
    return new Promise(resolve => {
        fetch(`${prefix}/cat/null`)
            .then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_category_number(id) {
    return new Promise(resolve => {
        fetch(`${prefix}/cat/number/${id}`)
            .then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}