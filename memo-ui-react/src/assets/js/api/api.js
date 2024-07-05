import {crypt_str} from "@/assets/js/crypt/crypt.js";
import {api_prefix} from "@/assets/js/api/api_prefix.js";
import {MAX_PER_PAGE} from "@/assets/js/data/static.js";

const prefix = api_prefix();

export function basic_info() {
    return new Promise(resolve => {
        fetch(`${prefix}/basic_info`, {
            method: "GET",
            credentials: "include"
        }).then(r =>
            resolve(r.json())
        ).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function post_login(username, password) {
    return new Promise(resolve => {
        crypt_str(password).then(hash => {
            fetch(`${prefix}/login`, {
                method: "POST",
                mode: "cors",
                credentials: "include",
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

export function post_token_login(token) {
    return new Promise(resolve => {
        fetch(`${prefix}/login/token`, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

/*
Blog
 */

export function get_blog_total() {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/total`, {
            method: "GET",
            credentials: "include"
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_blog_all(offset = 0, size = MAX_PER_PAGE) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/null?offset=${offset}&size=${size}`, {
            method: "GET",
            credentials: "include"
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_blog(id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/${id}`, {
            method: "GET",
            credentials: "include"
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_blog_content(id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/content/${id}`, {
            method: "GET",
            credentials: "include"
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
            credentials: "include",
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

export function delete_blog(token, id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog`, {
            method: "DELETE",
            mode: "cors",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                blog_id: id,
            })
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

/*
 Draft
 */

export function get_draft(token, id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/draft/${id}`, {
            method: "GET",
            credentials: "include",
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
            credentials: "include",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_draft_content(token, id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/draft/content/${id}`, {
            method: "GET",
            credentials: "include",
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
            credentials: "include",
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

export function delete_draft(token, id) {
    return new Promise(resolve => {
        fetch(`${prefix}/blog/draft`, {
            method: "DELETE",
            mode: "cors",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                draft_id: id,
            })
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

/*
 Image
 */

export function post_img(token, file, id = null) {
    return new Promise(resolve => {
        const form = new FormData();
        form.append("file", file);

        fetch(`${prefix}/img/${id}`, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: form
        }).then(r => {
            resolve(r.json())
        }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

/*
 Category
 */

export function post_category(token, categoryName, id = null) {
    return new Promise(resolve => {
        fetch(`${prefix}/cat/${id}`, {
            method: "POST",
            mode: "cors",
            credentials: "include",
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
        fetch(`${prefix}/cat/${id}`, {
            method: "GET",
            credentials: "include"
        })
            .then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_category_all() {
    return new Promise(resolve => {
        fetch(`${prefix}/cat/null`, {
            method: "GET",
            credentials: "include"
        })
            .then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

export function get_category_number(id) {
    return new Promise(resolve => {
        fetch(`${prefix}/cat/number/${id}`, {
            method: "GET",
            credentials: "include"
        })
            .then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

/*
 RSA Key
 */

export function get_key() {
    return new Promise(resolve => {
        fetch(`${prefix}/key`, {
            method: "GET",
            credentials: "include"
        })
            .then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}

/*
 Search
 */

export function get_search_blog(keyword, offset = 0, size = MAX_PER_PAGE) {
    return new Promise(resolve => {
        fetch(`${prefix}/search/blog?keyword=${keyword}&offset=${offset}&size=${size}`, {
            method: "GET",
            credentials: "include",
        })
            .then(r => {
                resolve(r.json())
            }).catch(_ => resolve(new Promise(() => resolve(null))));
    });
}