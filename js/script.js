const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

const settingsBtn = document.getElementById('settingsBtn');
const settingsOverlay = document.getElementById('settingsOverlay');
const closeSettings = document.getElementById('closeSettings');
const bulgeToggle = document.getElementById('bulgeToggle');

/* По умолчанию эффект выключен */
bulgeToggle.checked = false;
document.body.classList.remove('bulge-on');

bulgeToggle.addEventListener('change', () => {
    if (bulgeToggle.checked) {
        document.body.classList.add('bulge-on');
    } else {
        document.body.classList.remove('bulge-on');
    }
});

settingsBtn.addEventListener('click', () => {
    settingsOverlay.classList.add('active');
});

closeSettings.addEventListener('click', () => {
    settingsOverlay.classList.remove('active');
});

settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) {
        settingsOverlay.classList.remove('active');
    }
});

/* ============================================
   GITHUB REPOSITORIES
   ============================================ */
const GITHUB_USERNAME = 'botcott';

const projectList = document.getElementById('projectList');

async function loadRepositories() {
    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos = await response.json();

        if (!Array.isArray(repos) || repos.length === 0) {
            projectList.innerHTML = `<div class="project-loading">NO PUBLIC REPOSITORIES FOUND</div>`;
            return;
        }

        /* Сортируем: сначала с описанием, потом без */
        repos.sort((a, b) => {
            if (a.description && !b.description) return -1;
            if (!a.description && b.description) return 1;
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        projectList.innerHTML = '';

        repos.forEach(repo => {
            const item = document.createElement('div');
            item.className = 'project-item';

            const title = document.createElement('div');
            title.className = 'project-title';
            title.textContent = `> ${repo.name.toUpperCase()}`;

            const desc = document.createElement('div');
            desc.className = 'project-desc';
            desc.textContent = repo.description || 'NO DESCRIPTION PROVIDED.';

            const links = document.createElement('div');
            links.className = 'project-links';

            /* Кнопка GITHUB */
            const githubLink = document.createElement('a');
            githubLink.href = repo.html_url;
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
            githubLink.textContent = '[ GITHUB ]';
            links.appendChild(githubLink);

            /* Кнопка LIVE DEMO (только если включён GitHub Pages) */
            if (repo.has_pages) {
                const demoLink = document.createElement('a');
                /* Если в настройках репозитория указан свой homepage — используем его,
                   иначе стандартный GitHub Pages URL */
                const pagesUrl = (repo.homepage && repo.homepage.trim() !== '')
                    ? repo.homepage
                    : `https://${GITHUB_USERNAME}.github.io/${repo.name}/`;
                demoLink.href = pagesUrl;
                demoLink.target = '_blank';
                demoLink.rel = 'noopener noreferrer';
                demoLink.textContent = '[ LIVE DEMO ]';
                links.appendChild(demoLink);
            }

            item.appendChild(title);
            item.appendChild(desc);
            item.appendChild(links);

            projectList.appendChild(item);
        });
    } catch (error) {
        console.error('Failed to load repos:', error);
        projectList.innerHTML = `
            <div class="project-loading">
                FAILED TO LOAD REPOSITORIES<br>
                <span style="font-size: 0.9rem; opacity: 0.7;">ERROR: ${error.message}</span>
            </div>
        `;
    }
}

loadRepositories();