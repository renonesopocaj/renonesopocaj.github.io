// Populates the blog index (docs/blog/index.html) from posts.json.
// Deliberately uses textContent (not innerHTML) for every manifest field,
// since it's rendered directly with no markdown/HTML processing step.

async function loadPosts() {
    const listElement = document.getElementById('blog-list');
    if (!listElement) return;

    let posts;
    try {
        const response = await fetch('posts.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        posts = await response.json();
    } catch (error) {
        console.error('Error loading posts.json:', error);
        listElement.innerHTML = '';
        const errorBox = document.createElement('div');
        errorBox.className = 'error-message';
        errorBox.textContent = 'Sorry, unable to load the post list right now.';
        listElement.appendChild(errorBox);
        return;
    }

    const published = Array.isArray(posts) ? posts.filter(p => p.published === true) : [];

    if (published.length === 0) {
        listElement.innerHTML = '';
        const empty = document.createElement('p');
        empty.textContent = 'No posts yet - check back soon.';
        listElement.appendChild(empty);
        return;
    }

    const sorted = [...published].sort((a, b) => (a.date < b.date ? 1 : -1));

    const grid = document.createElement('div');
    grid.className = 'blog-grid';

    sorted.forEach(post => {
        const card = document.createElement('a');
        card.className = 'blog-card';
        card.href = `post.html?post=${encodeURIComponent(post.slug)}`;

        const title = document.createElement('h2');
        title.className = 'blog-card-title';
        title.textContent = post.title;
        card.appendChild(title);

        const date = document.createElement('div');
        date.className = 'blog-card-date';
        date.textContent = post.date;
        card.appendChild(date);

        if (post.excerpt) {
            const excerpt = document.createElement('p');
            excerpt.className = 'blog-card-excerpt';
            excerpt.textContent = post.excerpt;
            card.appendChild(excerpt);
        }

        if (Array.isArray(post.tags) && post.tags.length > 0) {
            const tags = document.createElement('div');
            tags.className = 'blog-card-tags';
            post.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag tag-default';
                tagSpan.textContent = tag;
                tags.appendChild(tagSpan);
            });
            card.appendChild(tags);
        }

        grid.appendChild(card);
    });

    listElement.innerHTML = '';
    listElement.appendChild(grid);
}

document.addEventListener('DOMContentLoaded', loadPosts);
