// Environment Values
import {crypt_str} from "@/assets/js/crypt.js";

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

export function post_login(username, password) {
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
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_draft(id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/draft/${id}`)
            .then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_draft_all() {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/draft/null`)
            .then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function post_draft(username, password, title, draft, id) {
    return new Promise(resolve => {
        crypt_str(password).then(hash => {
            fetch(`${prefix}/blog/draft/${id}`, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                    name: username,
                    hash: hash,
                    title: title,
                    draft: draft
                })
            }).then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
        });
    });
}

export function post_blog(username, password, title, blog, id, catId, blogDes) {
    return new Promise(resolve => {
        crypt_str(password).then(hash => {
            fetch(`${prefix}/blog/${id}`, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                    name: username,
                    hash: hash,
                    title: title,
                    blog: blog,
                    cat_id: catId,
                    blog_des: blogDes
                })
            }).then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
        });
    });
}