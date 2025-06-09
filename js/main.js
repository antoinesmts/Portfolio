document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Check for saved theme preference or default to 'light' mode
    const currentTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-moon';
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    });

    // Mobile navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        burger.classList.toggle('toggle');
    });

    // Chargement des projets depuis les fichiers Markdown
    loadProjects();

    // Filtrage des projets
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
});

// Fonction pour charger les projets
async function loadProjects() {
    try {
        const response = await fetch('projets/index.json');
        const projects = await response.json();
        
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
    }
}

// Fonction pour créer une carte de projet
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    // Conserver les catégories originales avec espaces pour l'affichage
    // et créer une version normalisée pour le filtrage
    const categoriesForFiltering = project.categories.map(cat => cat.replace(/\s+/g, '-')).join(' ');
    card.setAttribute('data-categories', project.categories.join(' '));
    card.setAttribute('data-filter-categories', categoriesForFiltering);
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'project-image';
    
    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.title;
    imageContainer.appendChild(img);
    
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'project-tags';
    
    project.categories.forEach(category => {
        const tag = document.createElement('span');
        tag.className = `project-tag tag-${category.toLowerCase()}`;
        tag.textContent = category;
        tagsContainer.appendChild(tag);
    });
    
    imageContainer.appendChild(tagsContainer);
    card.appendChild(imageContainer);
    
    const content = document.createElement('div');
    content.className = 'project-content';
    
    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;
    content.appendChild(title);
    
    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.description;
    content.appendChild(description);
    
    const link = document.createElement('a');
    link.href = 'projets/' + project.url;
    link.className = 'btn primary';
    link.textContent = 'Voir le projet';
    content.appendChild(link);
    
    card.appendChild(content);
    
    return card;
}

// Fonction pour filtrer les projets
function filterProjects(filter) {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        if (filter === 'all') {
            project.style.display = 'block';
        } else {
            // Normaliser le filtre (minuscules et remplacer espaces par tirets)
            const filterNormalized = filter.toLowerCase().replace(/\s+/g, '-');
            
            // Récupérer les catégories originales et normalisées
            const categoriesAttr = project.getAttribute('data-categories');
            const filterCategoriesAttr = project.getAttribute('data-filter-categories');
            
            // Vérifier si le filtre correspond à une catégorie (original ou normalisé)
            const hasCategory = categoriesAttr.split(' ').some(category => 
                category.toLowerCase() === filter.toLowerCase()
            ) || filterCategoriesAttr.split(' ').some(category => 
                category.toLowerCase() === filterNormalized
            );
            
            if (hasCategory) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        }
    });
}

// Load related projects on project detail pages
function loadRelatedProjects() {
    const relatedContainer = document.getElementById('related-projects');
    if (!relatedContainer) return;
    
    // Get current project tags from the page
    const currentTags = Array.from(document.querySelectorAll('.project-tag')).map(tag => tag.textContent.trim());
    
    // Load projects data
    fetch('/projets/index.json')
        .then(response => response.json())
        .then(projects => {
            // Filter projects that share at least one tag with current project
            const relatedProjects = projects.filter(project => {
                return project.tags && project.tags.some(tag => currentTags.includes(tag));
            }).slice(0, 3); // Limit to 3 projects
            
            // Display related projects
            relatedContainer.innerHTML = relatedProjects.map(project => `
                <div class="project-card">
                    <div class="project-image">
                        <img src="${project.image || '/images/default-project.jpg'}" alt="${project.title}" loading="lazy">
                    </div>
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p class="project-description">${project.description || ''}</p>
                        <div class="project-tags">
                            ${project.tags ? project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('') : ''}
                        </div>
                        <a href="/${project.url}" class="btn btn-primary">Voir le projet</a>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Erreur lors du chargement des projets similaires:', error);
        });
}

// Initialize related projects on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadRelatedProjects);
} else {
    loadRelatedProjects();
}