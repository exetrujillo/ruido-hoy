async function loadNews(categoryId = null, searchQuery = null) {
    try {
        let url = '/api/news';
        if (categoryId) url += `?categoryId=${categoryId}`;

        const response = await fetch(url);
        let news = await response.json();

        if (searchQuery) {
            news = Busqueda.filterNews(news, searchQuery);
        }

        const newsGrid = document.getElementById('news-grid');
        const newsCount = document.getElementById('news-count');
        if (!newsGrid) return;

        newsGrid.innerHTML = '';
        if (newsCount) newsCount.innerText = `${news.length} noticia(s) encontrada(s)`;

        if (news.length === 0) {
            newsGrid.innerHTML = `
                <div class="col-12 text-center py-5 border border-secondary rounded">
                    <h4 class="text-secondary">No se encontraron noticias.</h4>
                    <p class="text-body-secondary small">Intenta con otros términos.</p>
                </div>
            `;
            return;
        }


        news.forEach(item => {
            const date = new Date(item.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
            const card = `
                <div class="col-md-6 col-lg-4 d-flex align-items-stretch">
                    <div class="card news-card w-100 shadow-sm border-secondary-subtle">
                        ${item.imageUrl ? `<img src="${item.imageUrl}" class="card-img-top" alt="${item.title}" style="height: 220px; object-fit: cover; filter: grayscale(100%); transition: filter 0.3s ease;">` : ''}
                        <div class="card-body d-flex flex-column">
                            <span class="category-badge mb-2 d-inline-block px-2 py-1 bg-dark text-body-secondary small">${item.category?.name || 'CATEGORÍA'}</span>
                            <h5 class="card-title fw-bold">
                                <a href="news-detail.html?id=${item.id}" class="text-decoration-none text-light stretched-link">${item.title}</a>
                            </h5>
                            <div class="card-text text-body-secondary small mb-4">
                                ${MarkdownParser.truncate(item.content, 100)}
                            </div>
                            <div class="mt-auto pt-3 border-top border-secondary-subtle d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <div class="rounded-circle bg-secondary me-2" style="width: 24px; height: 24px;"></div>
                                    <span class="text-body-secondary small">${item.author?.name || 'Ruido Hoy'}</span>
                                </div>
                                <span class="text-body-secondary small">${date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            newsGrid.innerHTML += card;
        });

        updateUIState(categoryId, searchQuery);

    } catch (err) {
        console.error('Error loading news:', err);
    }
}

function updateUIState(categoryId, searchQuery) {
    const titleHeader = document.getElementById('current-category');

    if (searchQuery) {
        if (titleHeader) titleHeader.innerText = `Resultados de búsqueda para "${searchQuery}"`;
    } else if (categoryId) {
        const categoryLink = document.querySelector(`[data-category-id="${categoryId}"]`);
        const catName = categoryLink ? categoryLink.innerText : 'Categoría';
        if (titleHeader) titleHeader.innerText = catName;
    } else {
        if (titleHeader) titleHeader.innerText = 'Noticias Destacadas';
    }
}

async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        const dropdown = document.getElementById('categories-dropdown');
        if (!dropdown) return;

        categories.forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<a class="dropdown-item" href="#" data-category-id="${cat.id}" onclick="loadNews(${cat.id})">${cat.name}</a>`;
            dropdown.appendChild(li);
        });
    } catch (err) {
        console.error('Error al cargar categorías:', err);
    }
}

async function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('searchInput').value;
    loadNews(null, query);
}

function checkLoginState() {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const userNav = document.getElementById('user-nav');
    const adminNav = document.getElementById('admin-upload-nav');
    const commentForm = document.getElementById('comment-form');
    const authReminder = document.getElementById('auth-reminder');

    if (user && userNav) {
        userNav.innerHTML = `
            <div class="dropdown">
                <a class="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${user.name}
                </a>
                <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                    <li><a class="dropdown-item small" href="#" onclick="logout()">Cerrar Sesión</a></li>
                </ul>
            </div>
        `;

        // Admin visibility
        if (user.role === 'admin' && adminNav) {
            adminNav.style.display = 'block';
        }

        if (commentForm) commentForm.style.display = 'block';
        if (authReminder) authReminder.style.display = 'none';
    } else {
        if (userNav) {
            userNav.innerHTML = `
                <a href="auth.html" class="btn btn-outline-light btn-sm text-uppercase fw-bold ls-1 px-3">Iniciar Sesión</a>
            `;
        }
        if (adminNav) adminNav.style.display = 'none';
        if (commentForm) commentForm.style.display = 'none';
        if (authReminder) authReminder.style.display = 'block';
    }
}

async function fetchNewsDetail(id) {

    try {
        const response = await fetch(`/api/news/${id}`);
        const news = await response.json();
        const contentDiv = document.getElementById('news-content');
        if (!contentDiv) return;

        const date = new Date(news.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });

        contentDiv.innerHTML = `
            <span class="category-badge mb-3 bg-dark text-body-secondary px-2 py-1 small">${news.category?.name || 'CATEGORÍA'}</span>
            <h1 class="display-3 fw-bold my-4 font-playfair">${news.title}</h1>
            <div class="d-flex align-items-center mb-5 text-body-secondary small border-bottom border-secondary-subtle pb-3">
                <div class="rounded-circle bg-secondary me-2" style="width: 32px; height: 32px;"></div>
                <span class="fw-bold text-light">${news.author?.name || 'Ruido Hoy'}</span>
                <span class="mx-2">&bull;</span>
                <span>${date}</span>
                <span class="mx-2">&bull;</span>
                <span>${Number((news.content.length / 600).toFixed(1))} minutos de lectura</span>
            </div>
            ${news.imageUrl ? `<img src="${news.imageUrl}" class="img-fluid w-100 mb-5 shadow-lg" alt="${news.title}" style="filter: grayscale(100%); border-radius: 4px;">` : ''}
            <div class="news-body lead lh-lg mb-5" style="color: #ccc; font-size: 1.15rem;">
                ${MarkdownParser.parse(news.content)}
            </div>

        `;

        loadComments(news.comments);
        checkLoginState();
    } catch (err) {
        console.error('Error al cargar la noticia:', err);
    }
}

// Load comments (same logic, updated UI)
function loadComments(comments) {
    const list = document.getElementById('comments-list');
    if (!list) return;

    list.innerHTML = '';
    if (!comments || comments.length === 0) {
        list.innerHTML = '<p class="text-body-secondary fst-italic">No hay comentarios.</p>';
        return;
    }

    comments.forEach(c => {
        const date = new Date(c.createdAt).toLocaleDateString('es-CL', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        list.innerHTML += `
            <div class="comment-box border-bottom border-dark py-4 px-3 bg-transparent">
                <div class="d-flex justify-content-between mb-2">
                    <span class="comment-author">${c.user?.name || 'Invitado'}</span>
                    <span class="small text-body-secondary">${date}</span>
                </div>
                <div class="comment-text text-light-emphasis" style="font-size: 0.95rem;">${c.content}</div>
            </div>
        `;
    });

}

// Same as before
async function postComment(event) {
    event.preventDefault();
    const content = document.getElementById('commentContent').value;
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');
    const token = localStorage.getItem('token');

    if (!token) return alert('Debes iniciar sesión para comentar');

    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content, newsId })
        });

        if (response.ok) {
            document.getElementById('commentContent').value = '';
            fetchNewsDetail(newsId);
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (err) {
        console.error('Error al publicar el comentario:', err);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

async function loadLayout() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    const promises = [];

    if (navbarPlaceholder) {
        promises.push(
            fetch('components/navbar.html')
                .then(res => res.text())
                .then(html => {
                    navbarPlaceholder.innerHTML = html;
                })
        );
    }

    if (footerPlaceholder) {
        promises.push(
            fetch('components/footer.html')
                .then(res => res.text())
                .then(html => {
                    footerPlaceholder.innerHTML = html;
                })
        );
    }

    await Promise.all(promises);
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadLayout();
    checkLoginState();
    loadCategories();

    if (document.getElementById('news-grid')) {
        loadNews();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');
    if (newsId && document.getElementById('news-content')) {
        fetchNewsDetail(newsId);
    }
});

