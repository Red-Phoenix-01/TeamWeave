// app.js (updated — replace your current file with this)

 // Application State
let currentUser = null;
let currentProject = null;
let currentScreen = 'login';
let editingTask = null;

// Sample data (same as before)
const sampleData = {
  users: [
    {"id": 1, "name": "Alex Rivera", "email": "alex@teamweave.com", "avatar": "AR", "role": "Project Manager"},
    {"id": 2, "name": "Sarah Chen", "email": "sarah@teamweave.com", "avatar": "SC", "role": "Designer"},
    {"id": 3, "name": "Marcus Johnson", "email": "marcus@teamweave.com", "avatar": "MJ", "role": "Developer"},
    {"id": 4, "name": "Elena Kowalski", "email": "elena@teamweave.com", "avatar": "EK", "role": "Marketing Lead"}
  ],
  projects: [
    {
      "id": 1,
      "name": "Website Redesign",
      "description": "Complete overhaul of company website with modern design and improved UX",
      "color": "#2563EB",
      "members": [1, 2, 3],
      "totalTasks": 12,
      "completedTasks": 7,
      "dueDate": "2025-10-15",
      "progress": 58
    },
    {
      "id": 2,
      "name": "Mobile App Launch",
      "description": "Develop and launch iOS/Android mobile application",
      "color": "#10B981",
      "members": [1, 3, 4],
      "totalTasks": 18,
      "completedTasks": 11,
      "dueDate": "2025-11-30",
      "progress": 61
    },
    {
      "id": 3,
      "name": "Marketing Campaign Q4",
      "description": "Holiday season marketing campaign across all channels",
      "color": "#F59E0B",
      "members": [1, 4],
      "totalTasks": 8,
      "completedTasks": 2,
      "dueDate": "2025-12-01",
      "progress": 25
    }
  ],
  tasks: [
    {
      "id": 1,
      "projectId": 1,
      "title": "Design Homepage Mockup",
      "description": "Create wireframes and high-fidelity mockups for the new homepage design including mobile responsive layouts",
      "assigneeId": 2,
      "dueDate": "2025-09-15",
      "status": "In Progress",
      "priority": "High",
      "tags": ["Design", "Frontend"]
    },
    {
      "id": 2,
      "projectId": 1,
      "title": "Content Strategy Meeting",
      "description": "Plan content structure, copy requirements, and SEO strategy for new website",
      "assigneeId": 1,
      "dueDate": "2025-09-10",
      "status": "Done",
      "priority": "Medium",
      "tags": ["Content", "Strategy"]
    },
    {
      "id": 3,
      "projectId": 1,
      "title": "Frontend Development",
      "description": "Implement responsive design using modern CSS and JavaScript frameworks",
      "assigneeId": 3,
      "dueDate": "2025-09-25",
      "status": "To Do",
      "priority": "High",
      "tags": ["Development", "Frontend"]
    },
    {
      "id": 4,
      "projectId": 2,
      "title": "Setup CI/CD Pipeline",
      "description": "Configure automated build and deployment pipeline for mobile app releases",
      "assigneeId": 3,
      "dueDate": "2025-09-20",
      "status": "To Do",
      "priority": "High",
      "tags": ["DevOps", "Mobile"]
    },
    {
      "id": 5,
      "projectId": 2,
      "title": "User Authentication Module",
      "description": "Implement secure user registration, login, and password recovery features",
      "assigneeId": 3,
      "dueDate": "2025-09-18",
      "status": "In Progress",
      "priority": "Critical",
      "tags": ["Security", "Backend"]
    },
    {
      "id": 6,
      "projectId": 3,
      "title": "Social Media Calendar",
      "description": "Create comprehensive social media posting calendar for Q4 campaign",
      "assigneeId": 4,
      "dueDate": "2025-09-25",
      "status": "In Progress",
      "priority": "Medium",
      "tags": ["Marketing", "Social Media"]
    },
    {
      "id": 7,
      "projectId": 3,
      "title": "Brand Guidelines Update",
      "description": "Refresh brand guidelines for holiday campaign consistency",
      "assigneeId": 2,
      "dueDate": "2025-09-20",
      "status": "Review",
      "priority": "Medium",
      "tags": ["Branding", "Design"]
    }
  ]
};

// Application data (mutable copy)
let appData = {
  users: [...sampleData.users],
  projects: [...sampleData.projects],
  tasks: [...sampleData.tasks]
};

// Utility Functions
function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function formatDate(dateString) {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

function isOverdue(dateString) {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}

function getUserById(id) {
  return appData.users.find(user => user.id === id);
}

function getProjectById(id) {
  return appData.projects.find(project => project.id === id);
}

function getTasksByProject(projectId) {
  return appData.tasks.filter(task => task.projectId === projectId);
}

function updateProjectStats(projectId) {
  const tasks = getTasksByProject(projectId);
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const project = getProjectById(projectId);
  if (project) {
    project.totalTasks = totalTasks;
    project.completedTasks = completedTasks;
    project.progress = progress;
  }
}

// Screen Management
function showScreen(screenId) {
  console.log('Showing screen:', screenId);

  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('hidden');
  });

  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    targetScreen.classList.add('fade-in');
    currentScreen = screenId;
  }

  updateMobileNav(screenId);
}

function updateMobileNav(activeScreen) {
  const mobileNav = document.getElementById('mobileNav');
  if (currentUser && (activeScreen === 'dashboardScreen' || activeScreen === 'projectDetailScreen')) {
    mobileNav.classList.remove('hidden');
  } else {
    mobileNav.classList.add('hidden');
  }

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  if (activeScreen === 'dashboardScreen') {
    const homeNav = document.querySelector('.nav-item[data-screen="dashboard"]');
    if (homeNav) homeNav.classList.add('active');
  }
}

// Authentication
function handleLogin(event) {
  event.preventDefault();
  console.log('Login attempt');

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (email === 'demo@teamweave.com' && password === 'demo123') {
    currentUser = {
      id: 999,
      name: 'Demo User',
      email: 'demo@teamweave.com',
      avatar: 'DU',
      role: 'Team Member'
    };

    updateUserDisplay();
    showScreen('dashboardScreen');
    renderDashboard();
  } else {
    alert('Invalid credentials. Use demo@teamweave.com / demo123');
  }
}

function handleSignup(event) {
  event.preventDefault();
  console.log('Signup attempt');

  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  if (name && email && password) {
    const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);

    currentUser = {
      id: generateId(),
      name: name,
      email: email,
      avatar: initials,
      role: 'Team Member'
    };

    updateUserDisplay();
    showScreen('dashboardScreen');
    renderDashboard();
  }
}

function updateUserDisplay() {
  if (currentUser) {
    const userNameEl = document.getElementById('userName');
    const userAvatarEl = document.getElementById('userAvatar');
    const userAvatar2El = document.getElementById('userAvatar2');

    if (userNameEl) userNameEl.textContent = currentUser.name;
    if (userAvatarEl) userAvatarEl.textContent = currentUser.avatar;
    if (userAvatar2El) userAvatar2El.textContent = currentUser.avatar;

    // Update profile modal
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileRole = document.getElementById('profileRole');

    if (profileAvatar) profileAvatar.textContent = currentUser.avatar;
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profileRole) profileRole.textContent = currentUser.role;
  }
}

function handleLogout() {
  currentUser = null;
  currentProject = null;
  showScreen('loginScreen');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  if (loginForm) loginForm.reset();
  if (signupForm) signupForm.reset();

  closeProfileModal();
}

// Dashboard
function renderDashboard() {
  console.log('Rendering dashboard');
  const projectsGrid = document.getElementById('projectsGrid');

  if (!projectsGrid) {
    console.error('Projects grid not found');
    return;
  }

  // Update stats
  const totalTasks = appData.tasks.length;
  const completedTasks = appData.tasks.filter(task => task.status === 'Done').length;

  const totalProjectsEl = document.getElementById('totalProjects');
  const totalTasksEl = document.getElementById('totalTasks');
  const completedTasksEl = document.getElementById('completedTasks');

  if (totalProjectsEl) totalProjectsEl.textContent = appData.projects.length;
  if (totalTasksEl) totalTasksEl.textContent = totalTasks;
  if (completedTasksEl) completedTasksEl.textContent = completedTasks;

  // Render project cards
  projectsGrid.innerHTML = '';

  // Sort projects by due date ascending for nice UX
  const sorted = [...appData.projects].sort((a, b) => new Date(a.dueDate || '2100-01-01') - new Date(b.dueDate || '2100-01-01'));

  sorted.forEach(project => {
    updateProjectStats(project.id);

    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.style.cursor = 'pointer';

    projectCard.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Project clicked:', project.id);
      openProject(project.id);
    });

    const members = project.members.map(memberId => getUserById(memberId)).filter(Boolean);
    const membersHtml = members.map(member =>
      `<div class="user-avatar" style="background: ${project.color}">${member.avatar}</div>`
    ).join('');

    const dueDate = project.dueDate ? new Date(project.dueDate) : null;
    const isUrgent = dueDate ? ((dueDate - new Date()) < (7 * 24 * 60 * 60 * 1000)) : false;

    projectCard.innerHTML = `
      <div class="project-header">
        <div class="project-color" style="background: ${project.color}"></div>
        <h3>${project.name}</h3>
      </div>
      <p class="project-description">${project.description || ''}</p>
      <div class="project-members">
        ${membersHtml}
        <span style="margin-left: auto; font-size: var(--font-size-sm); color: var(--color-text-secondary);">
          ${members.length} member${members.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div class="project-progress">
        <div class="progress-info">
          <span>${project.completedTasks} of ${project.totalTasks} tasks completed</span>
          <span>${project.progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${project.progress}%; background: ${project.color}"></div>
        </div>
      </div>
      <div class="project-stats">
        <span>Due ${formatDate(project.dueDate)}</span>
        <span style="color: ${isUrgent ? 'var(--color-error)' : 'var(--color-text-secondary)'}">
          ${isUrgent ? '🔥 Urgent' : '📅 On Track'}
        </span>
      </div>
    `;

    projectsGrid.appendChild(projectCard);
  });
}

// Project Detail
function openProject(projectId) {
  console.log('Opening project:', projectId);
  currentProject = getProjectById(projectId);
  if (!currentProject) {
    console.error('Project not found:', projectId);
    return;
  }

  const projectTitle = document.getElementById('projectTitle');
  const projectDescription = document.getElementById('projectDescription');

  if (projectTitle) projectTitle.textContent = currentProject.name;
  if (projectDescription) projectDescription.textContent = currentProject.description;

  updateProjectStats(projectId);
  const projectProgressText = document.getElementById('projectProgressText');
  const projectProgressPercent = document.getElementById('projectProgressPercent');
  const projectProgressFill = document.getElementById('projectProgressFill');

  if (projectProgressText) {
    projectProgressText.textContent = `${currentProject.completedTasks} of ${currentProject.totalTasks} tasks completed`;
  }
  if (projectProgressPercent) projectProgressPercent.textContent = `${currentProject.progress}%`;
  if (projectProgressFill) projectProgressFill.style.width = `${currentProject.progress}%`;

  const membersContainer = document.getElementById('projectMembers');
  if (membersContainer) {
    const members = currentProject.members.map(memberId => getUserById(memberId)).filter(Boolean);
    membersContainer.innerHTML = members.map(member =>
      `<div class="user-avatar" style="background: ${currentProject.color}" title="${member.name}">${member.avatar}</div>`
    ).join('');
  }

  renderTaskBoard();
  showScreen('projectDetailScreen');
}

function renderTaskBoard() {
  console.log('Rendering task board');
  if (!currentProject) return;

  const tasks = getTasksByProject(currentProject.id);
  const statusColumns = [
    { status: 'To Do', id: 'todoList', countId: 'todoCount' },
    { status: 'In Progress', id: 'progressList', countId: 'progressCount' },
    { status: 'Review', id: 'reviewList', countId: 'reviewCount' },
    { status: 'Done', id: 'doneList', countId: 'doneCount' }
  ];

  statusColumns.forEach(column => {
    const statusTasks = tasks.filter(task => task.status === column.status);
    const listElement = document.getElementById(column.id);
    const countElement = document.getElementById(column.countId);

    if (countElement) countElement.textContent = statusTasks.length;
    if (!listElement) {
      console.error('List element not found:', column.id);
      return;
    }

    listElement.innerHTML = '';

    statusTasks.forEach(task => {
      const assignee = getUserById(task.assigneeId);
      const isTaskOverdue = isOverdue(task.dueDate);

      const taskCard = document.createElement('div');
      taskCard.className = 'task-card';
      taskCard.style.cursor = 'pointer';
      taskCard.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openTaskModal(task);
      });

      taskCard.innerHTML = `
        <div class="task-meta">
          <div class="task-assignee">
            ${assignee ? `<div class="user-avatar">${assignee.avatar}</div><span>${assignee.name}</span>` : '<span>Unassigned</span>'}
          </div>
          <div class="task-priority ${task.priority.toLowerCase()}">${task.priority}</div>
        </div>
        <h4>${task.title}</h4>
        <p class="task-description">${task.description}</p>
        <div class="task-due-date ${isTaskOverdue ? 'overdue' : ''}">
          Due ${formatDate(task.dueDate)} ${isTaskOverdue ? '(Overdue)' : ''}
        </div>
      `;

      listElement.appendChild(taskCard);
    });
  });
}

// Task Management
function openTaskModal(task = null) {
  console.log('Opening task modal', task ? 'for editing' : 'for new task');
  editingTask = task;
  const modal = document.getElementById('taskModal');
  const modalTitle = document.getElementById('taskModalTitle');
  const form = document.getElementById('taskForm');

  if (modalTitle) modalTitle.textContent = task ? 'Edit Task' : 'Add New Task';

  // Populate assignee dropdown
  const assigneeSelect = document.getElementById('taskAssignee');
  if (assigneeSelect) {
    assigneeSelect.innerHTML = '<option value="">Unassigned</option>';

    if (currentProject) {
      const projectMembers = currentProject.members.map(id => getUserById(id)).filter(Boolean);
      projectMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.name;
        assigneeSelect.appendChild(option);
      });
    }
  }

  if (task) {
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDescription');
    const assigneeInput = document.getElementById('taskAssignee');
    const priorityInput = document.getElementById('taskPriority');
    const dueDateInput = document.getElementById('taskDueDate');
    const statusInput = document.getElementById('taskStatus');

    if (titleInput) titleInput.value = task.title;
    if (descInput) descInput.value = task.description;
    if (assigneeInput) assigneeInput.value = task.assigneeId || '';
    if (priorityInput) priorityInput.value = task.priority;
    if (dueDateInput) dueDateInput.value = task.dueDate;
    if (statusInput) statusInput.value = task.status;
  } else {
    if (form) form.reset();
    const statusInput = document.getElementById('taskStatus');
    const priorityInput = document.getElementById('taskPriority');
    if (statusInput) statusInput.value = 'To Do';
    if (priorityInput) priorityInput.value = 'Medium';
  }

  if (modal) modal.classList.remove('hidden');
}

function closeTaskModal() {
  const modal = document.getElementById('taskModal');
  if (modal) modal.classList.add('hidden');
  editingTask = null;
}

function handleTaskSubmit(event) {
  event.preventDefault();
  console.log('Submitting task');

  const formData = {
    title: document.getElementById('taskTitle')?.value || '',
    description: document.getElementById('taskDescription')?.value || '',
    assigneeId: parseInt(document.getElementById('taskAssignee')?.value) || null,
    priority: document.getElementById('taskPriority')?.value || 'Medium',
    dueDate: document.getElementById('taskDueDate')?.value || '',
    status: document.getElementById('taskStatus')?.value || 'To Do'
  };

  if (editingTask) {
    Object.assign(editingTask, formData);
  } else {
    const newTask = {
      id: generateId(),
      projectId: currentProject.id,
      tags: [],
      ...formData
    };
    appData.tasks.push(newTask);
  }

  // Recalculate stats for this project
  if (currentProject) updateProjectStats(currentProject.id);

  renderTaskBoard();
  closeTaskModal();
}

// New Project Management
function openNewProjectModal() {
  console.log('Opening new project modal');
  const modal = document.getElementById('newProjectModal');
  if (!modal) return;
  // Populate members select
  populateProjectMembersSelect();
  // Prefill defaults
  document.getElementById('newProjectForm').reset();
  document.getElementById('projectColor').value = '#2563EB';
  modal.classList.remove('hidden');
}

function closeNewProjectModal() {
  const modal = document.getElementById('newProjectModal');
  if (modal) modal.classList.add('hidden');
}

function populateProjectMembersSelect() {
  const select = document.getElementById('projectMembersSelect');
  if (!select) return;
  select.innerHTML = '';
  appData.users.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.id;
    opt.textContent = `${u.name} (${u.role})`;
    select.appendChild(opt);
  });
}

function handleNewProjectSubmit(event) {
  event.preventDefault();
  console.log('Creating new project');

  const name = (document.getElementById('projectName')?.value || '').trim();
  const description = document.getElementById('projectDescriptionInput')?.value || '';
  const color = document.getElementById('projectColor')?.value || '#2563EB';
  const dueDate = document.getElementById('projectDueDate')?.value || '';
  const membersSelect = document.getElementById('projectMembersSelect');

  if (!name) {
    alert('Please provide a project name.');
    return;
  }

  // Collect selected members (convert values to numbers)
  const selectedMembers = [];
  if (membersSelect) {
    Array.from(membersSelect.selectedOptions).forEach(opt => selectedMembers.push(parseInt(opt.value)));
  }

  // Ensure currentUser is a member if logged in
  if (currentUser && !selectedMembers.includes(currentUser.id)) {
    selectedMembers.unshift(currentUser.id);
  }

  const newProject = {
    id: generateId(),
    name: name,
    description: description,
    color: color,
    members: selectedMembers.length ? selectedMembers : (currentUser ? [currentUser.id] : []),
    totalTasks: 0,
    completedTasks: 0,
    dueDate: dueDate,
    progress: 0
  };

  appData.projects.push(newProject);

  // Update UI
  renderDashboard();
  closeNewProjectModal();

  // Open the project immediately after creating
  openProject(newProject.id);
}

// Profile Modal
function openProfileModal() {
  console.log('Opening profile modal');
  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.remove('hidden');
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.add('hidden');
}

// Event Listeners Setup
function setupEventListeners() {
  console.log('Setting up event listeners');

  // Authentication forms
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (signupForm) signupForm.addEventListener('submit', handleSignup);

  // Auth screen toggles
  const showSignupLink = document.getElementById('showSignupLink');
  const showLoginLink = document.getElementById('showLoginLink');

  if (showSignupLink) {
    showSignupLink.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen('signupScreen');
    });
  }

  if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen('loginScreen');
    });
  }

  // Navigation
  const backBtn = document.getElementById('backToDashboardBtn');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen('dashboardScreen');
      renderDashboard();
    });
  }

  // User menu buttons - use event delegation to handle both
  document.addEventListener('click', function(e) {
    if (e.target.closest('#userMenuBtn') || e.target.closest('#userMenuBtn2')) {
      e.preventDefault();
      openProfileModal();
    }
  });

  // Task modal
  const addTaskBtn = document.getElementById('addTaskBtn');
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openTaskModal();
    });
  }

  const closeTaskModalBtn = document.getElementById('closeTaskModal');
  const taskModalOverlay = document.getElementById('taskModalOverlay');
  const cancelTaskBtn = document.getElementById('cancelTaskBtn');
  const taskForm = document.getElementById('taskForm');

  if (closeTaskModalBtn) closeTaskModalBtn.addEventListener('click', closeTaskModal);
  if (taskModalOverlay) taskModalOverlay.addEventListener('click', closeTaskModal);
  if (cancelTaskBtn) cancelTaskBtn.addEventListener('click', closeTaskModal);
  if (taskForm) taskForm.addEventListener('submit', handleTaskSubmit);

  // Profile modal
  const closeProfileModalBtn = document.getElementById('closeProfileModal');
  const profileModalOverlay = document.getElementById('profileModalOverlay');
  const logoutBtn = document.getElementById('logoutBtn');

  if (closeProfileModalBtn) closeProfileModalBtn.addEventListener('click', closeProfileModal);
  if (profileModalOverlay) profileModalOverlay.addEventListener('click', closeProfileModal);
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  // Mobile navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const screen = item.dataset.screen;
      if (screen === 'dashboard') {
        showScreen('dashboardScreen');
        renderDashboard();
      } else if (screen === 'profile') {
        openProfileModal();
      }
    });
  });

  // New project button - opens modal
  const newProjectBtn = document.getElementById('newProjectBtn');
  const newProjectModalOverlay = document.getElementById('newProjectModalOverlay');
  const closeNewProjectModalBtn = document.getElementById('closeNewProjectModal');
  const cancelNewProjectBtn = document.getElementById('cancelNewProjectBtn');
  const newProjectForm = document.getElementById('newProjectForm');

  if (newProjectBtn) {
    newProjectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openNewProjectModal();
    });
  }
  if (newProjectModalOverlay) newProjectModalOverlay.addEventListener('click', closeNewProjectModal);
  if (closeNewProjectModalBtn) closeNewProjectModalBtn.addEventListener('click', closeNewProjectModal);
  if (cancelNewProjectBtn) cancelNewProjectBtn.addEventListener('click', closeNewProjectModal);
  if (newProjectForm) newProjectForm.addEventListener('submit', handleNewProjectSubmit);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'n' && currentScreen === 'projectDetailScreen') {
        e.preventDefault();
        openTaskModal();
      }
    }

    if (e.key === 'Escape') {
      const taskModal = document.getElementById('taskModal');
      const profileModal = document.getElementById('profileModal');
      const newProjectModal = document.getElementById('newProjectModal');

      if (taskModal && !taskModal.classList.contains('hidden')) {
        closeTaskModal();
      }
      if (profileModal && !profileModal.classList.contains('hidden')) {
        closeProfileModal();
      }
      if (newProjectModal && !newProjectModal.classList.contains('hidden')) {
        closeNewProjectModal();
      }
    }
  });

  // Touch gestures for mobile
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  document.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (currentScreen === 'projectDetailScreen' && deltaX > 0) {
        showScreen('dashboardScreen');
        renderDashboard();
      }
    }

    touchStartX = 0;
    touchStartY = 0;
  });
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app');

  setupEventListeners();
  showScreen('loginScreen');

  // Pre-fill demo credentials for easier testing
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  if (emailInput) emailInput.value = 'demo@teamweave.com';
  if (passwordInput) passwordInput.value = 'demo123';

  console.log('App initialized');
});
