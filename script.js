const usernameInput = document.getElementById('username');
const searchButton = document.getElementById('search-button');
const repoList = document.getElementById('repo-list');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const pageInfo = document.getElementById('page-info');
const reposPerPageSelect = document.getElementById('repos-per-page');
const loader = document.querySelector('.loader');

let currentPage = 1;
let reposPerPage = 10;
let currentUsername = '';

async function fetchUserInfo(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

async function fetchRepos(username, page, perPage) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

function displayUserInfo(user) {
    document.getElementById('username-info').innerText = user.name || user.login;
    document.getElementById('bio').innerText = user.bio || '';
    document.getElementById('location').innerText = user.location || '';
    document.getElementById('avatar').src = user.avatar_url || 'Unknown';
}

function displayRepos(repos) {
    repoList.innerHTML = '';
    for (const repo of repos) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">
                ${repo.name}
            </a>
            <p>${repo.description || ''}</p>
            <p>${repo.language || 'Unknown'}</p>
            <ul class="topics">
                ${repo.topics.map(topic => `<li>${topic}</li>`).join('')}
            </ul>
        `;
        repoList.appendChild(listItem);
    }
}

function updatePageInfo(page, totalPages) {
    pageInfo.innerText = `Page ${page} of ${totalPages}`;
}

async function fetchData(username) {
    currentUsername = username;
    loader.style.display = 'block';
    try {
        const userData = await fetchUserInfo(username);
        displayUserInfo(userData);
        const repoData = await fetchRepos(username, currentPage, reposPerPage);
        displayRepos(repoData);
        updatePageInfo(currentPage, Math.ceil(repoData.length / reposPerPage));
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching data. Please try again.');
    } finally {
        loader.style.display = 'none';
    }
}

searchButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        fetchData(username);
    }
});

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchData(currentUsername);
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    fetchData(currentUsername);
});

reposPerPageSelect.addEventListener('change', () => {
    reposPerPage = parseInt(reposPerPageSelect.value, 10);
    currentPage = 1;
    fetchData(currentUsername);
});
