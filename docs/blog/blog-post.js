import { renderMarkdown } from '../script.js';

// Renders a single post: docs/blog/post.html?post=<slug>. The slug is looked
// up against posts.json (the manifest) before anything is fetched or shown,
// so an unknown/garbage slug never reaches a fetch() call or the DOM.
async function loadPost() {
    const headerElement = document.getElementById('blog-post-header');
    const contentElement = document.getElementById('blog-post-content');
    if (!headerElement || !contentElement) return;

    const showError = (message) => {
        headerElement.innerHTML = '';
        contentElement.innerHTML = '';
        const errorBox = document.createElement('div');
        errorBox.className = 'error-message';
        errorBox.textContent = message;
        contentElement.appendChild(errorBox);
    };

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('post');
    if (!slug) {
        showError('No post specified.');
        return;
    }

    let posts;
    try {
        const manifestResponse = await fetch('posts.json');
        if (!manifestResponse.ok) {
            throw new Error(`HTTP ${manifestResponse.status}: ${manifestResponse.statusText}`);
        }
        posts = await manifestResponse.json();
    } catch (error) {
        console.error('Error loading posts.json:', error);
        showError('Sorry, unable to load the post list right now.');
        return;
    }

    const post = Array.isArray(posts) ? posts.find(p => p.slug === slug) : undefined;
    // Unpublished posts 404 the same as unknown slugs, so an unlisted draft
    // isn't reachable just by guessing/remembering its URL.
    if (!post || post.published !== true) {
        showError('Post not found.');
        return;
    }

    document.title = `${post.title} - Blog`;

    headerElement.innerHTML = '';
    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = post.title;
    headerElement.appendChild(title);

    const date = document.createElement('div');
    date.className = 'blog-post-date';
    date.textContent = post.date;
    headerElement.appendChild(date);

    try {
        const postResponse = await fetch(`posts/${encodeURIComponent(post.slug)}.md`);
        if (!postResponse.ok) {
            throw new Error(`HTTP ${postResponse.status}: ${postResponse.statusText}`);
        }
        const markdown = await postResponse.text();
        const html = await renderMarkdown(markdown);
        contentElement.innerHTML = html;
        if (typeof window.applyBHoverEffect === 'function') {
            window.applyBHoverEffect(contentElement);
        }
    } catch (error) {
        console.error(`Error loading post "${post.slug}":`, error);
        showError('Sorry, unable to load this post right now.');
    }
}

document.addEventListener('DOMContentLoaded', loadPost);
