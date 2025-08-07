const translations = {
    en: {
        title: 'Le Renard - Conversational AI',
        online: 'Online',
        new_chat: 'New Chat',
        history: 'History',
        guest: 'Guest',
        home_subtitle: 'Your premium AI assistant for smart, natural conversations',
        home_card1_title: 'Fast and efficient',
        home_card1_desc: 'Instant answers with the latest AI models',
        home_card2_title: 'Advanced technology',
        home_card2_desc: 'Uses the latest models like Mistral, Llama, and others',
        home_card3_title: 'Private conversations',
        home_card3_desc: 'Your data remains confidential and secure',
        start_chat_btn: 'Start a conversation',
        chat_placeholder: 'Ask Le Renard your question...',
        disclaimer: 'Le Renard may make mistakes. Verify important information.',
        model_select_title: 'Select a model',
        model_confirm_btn: 'Confirm',
        rename_title: 'Rename conversation',
        rename_btn: 'Rename',
        delete_btn: 'Delete',
        cancel_btn: 'Cancel',
        save_btn: 'Save',
        delete_confirm_title: 'Are you sure?',
        delete_confirm_desc: 'This action cannot be undone.',
        delete_confirm_btn: 'Delete',
        empty_history: 'Le Renard, Talk to me now!',
        toast_renamed: 'Conversation renamed.',
        toast_deleted: 'Conversation deleted.'
    },
    fr: {
        title: 'Le Renard - IA Conversationnelle',
        online: 'En ligne',
        new_chat: 'Nouvelle discussion',
        history: 'Historique',
        guest: 'Invité',
        home_subtitle: 'Votre assistant IA haut de gamme pour des conversations intelligentes et naturelles',
        home_card1_title: 'Rapide et efficace',
        home_card1_desc: 'Réponses instantanées avec les derniers modèles d\'IA',
        home_card2_title: 'Technologie avancée',
        home_card2_desc: 'Utilise les modèles Mistral, Llama et autres derniers cris',
        home_card3_title: 'Conversations privées',
        home_card3_desc: 'Vos données restent confidentielles et sécurisées',
        start_chat_btn: 'Commencer une conversation',
        chat_placeholder: 'Pose ta question à Le Renard...',
        disclaimer: 'Le Renard peut faire des erreurs. Vérifiez les informations importantes.',
        model_select_title: 'Sélectionnez un modèle',
        model_confirm_btn: 'Confirmer',
        rename_title: 'Renommer la conversation',
        rename_btn: 'Renommer',
        delete_btn: 'Supprimer',
        cancel_btn: 'Annuler',
        save_btn: 'Enregistrer',
        delete_confirm_title: 'Êtes-vous sûr ?',
        delete_confirm_desc: 'Cette action est irréversible.',
        delete_confirm_btn: 'Supprimer',
        empty_history: 'Le Renard, parle-moi !',
        toast_renamed: 'Conversation renommée.',
        toast_deleted: 'Conversation supprimée.'
    }
};

let currentLang = 'en';
let currentConversationToRename = null;

const state = {
    currentModel: '@cf/mistral/mistral-7b-instruct-v0.2',
    currentConversation: null,
    conversations: []
};

const elements = {
    sidebarToggle: document.getElementById('sidebar-toggle'),
    sidebar: document.getElementById('sidebar'),
    themeToggle: document.getElementById('theme-toggle'),
    messageInput: document.getElementById('message-input'),
    sendButton: document.getElementById('send-button'),
    chatContainer: document.getElementById('chat-container'),
    homePage: document.getElementById('home-page'),
    chatPage: document.getElementById('chat-page'),
    startChat: document.getElementById('start-chat'),
    homeButton: document.getElementById('home-button'),
    newChat: document.getElementById('new-chat'),
    conversationList: document.getElementById('conversation-list'),
    conversations: document.getElementById('conversations'),
    emptyHistoryMessage: document.getElementById('empty-history-message'),
    modelSelector: document.getElementById('model-selector'),
    modelModal: document.getElementById('model-modal'),
    closeModelModal: document.getElementById('close-model-modal'),
    modelList: document.getElementById('model-list'),
    confirmModel: document.getElementById('confirm-model'),
    langFr: document.getElementById('lang-fr'),
    langEn: document.getElementById('lang-en'),
    renameModal: document.getElementById('rename-modal'),
    renameInput: document.getElementById('rename-input'),
    renameSave: document.getElementById('rename-save'),
    renameCancel: document.getElementById('rename-cancel'),
    toastContainer: document.getElementById('toast-container')
};

function init() {
    setupEventListeners();
    loadModels();
    loadConversations();
    showHomePage();

    const savedLang = localStorage.getItem('lang') || 'en';
    setLanguage(savedLang);

    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768 &&
            elements.sidebar.classList.contains('sidebar-visible') &&
            !elements.sidebar.contains(e.target) &&
            e.target !== elements.sidebarToggle) {
            elements.sidebar.classList.remove('sidebar-visible');
        }
    });
}

function setupEventListeners() {
    elements.sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.sidebar.classList.toggle('sidebar-visible');
    });

    elements.themeToggle.addEventListener('click', toggleTheme);

    elements.messageInput.addEventListener('input', autoResizeTextarea);

    elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    elements.sendButton.addEventListener('click', sendMessage);

    elements.startChat.addEventListener('click', startNewChat);
    elements.newChat.addEventListener('click', startNewChat);
    elements.homeButton.addEventListener('click', showHomePage);

    elements.modelSelector.addEventListener('click', showModelModal);
    elements.closeModelModal.addEventListener('click', hideModelModal);
    elements.confirmModel.addEventListener('click', hideModelModal);

    elements.langFr.addEventListener('click', () => setLanguage('fr'));
    elements.langEn.addEventListener('click', () => setLanguage('en'));

    elements.renameCancel.addEventListener('click', () => {
        elements.renameModal.classList.add('hidden');
        currentConversationToRename = null;
    });
    elements.renameSave.addEventListener('click', () => {
        const newTitle = elements.renameInput.value.trim();
        if (newTitle && currentConversationToRename) {
            renameConversation(currentConversationToRename, newTitle);
        }
        elements.renameModal.classList.add('hidden');
        currentConversationToRename = null;
    });
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    if (lang === 'fr') {
        elements.langFr.classList.add('bg-accent-purple', 'text-white');
        elements.langFr.classList.remove('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-200', 'dark:hover:bg-dark-700');
        elements.langEn.classList.remove('bg-accent-purple', 'text-white');
        elements.langEn.classList.add('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-200', 'dark:hover:bg-dark-700');
        document.documentElement.lang = 'fr';
    } else {
        elements.langEn.classList.add('bg-accent-purple', 'text-white');
        elements.langEn.classList.remove('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-200', 'dark:hover:bg-dark-700');
        elements.langFr.classList.remove('bg-accent-purple', 'text-white');
        elements.langFr.classList.add('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-200', 'dark:hover:bg-dark-700');
        document.documentElement.lang = 'en';
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    if (translations[lang] && translations[lang]['title']) {
        document.title = translations[lang]['title'];
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');

    const icon = elements.themeToggle.querySelector('svg');
    if (document.documentElement.classList.contains('dark')) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
    } else {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
    }

    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

function autoResizeTextarea() {
    elements.messageInput.style.height = 'auto';
    elements.messageInput.style.height = `${elements.messageInput.scrollHeight}px`;
}

function showHomePage() {
    elements.homePage.classList.remove('hidden');
    elements.chatPage.classList.add('hidden');
    setTimeout(() => {
        elements.homePage.classList.add('page-enter-active');
    }, 10);
}

function showChatPage() {
    elements.homePage.classList.add('hidden');
    elements.chatPage.classList.remove('hidden');
    setTimeout(() => {
        elements.messageInput.focus();
    }, 100);
}

function loadConversations() {
    const storedConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    state.conversations = storedConversations;
    renderConversationList();
}

function renderConversationList() {
    elements.conversations.innerHTML = '';
    if (state.conversations.length === 0) {
        elements.emptyHistoryMessage.classList.remove('hidden');
        elements.conversations.classList.add('hidden');
        elements.conversationList.querySelector('h3').classList.add('hidden');
    } else {
        elements.emptyHistoryMessage.classList.add('hidden');
        elements.conversations.classList.remove('hidden');
        elements.conversationList.querySelector('h3').classList.remove('hidden');
        state.conversations.forEach(conv => addConversationToList(conv.id, conv.title));
    }
}

function saveConversations() {
    localStorage.setItem('conversations', JSON.stringify(state.conversations));
    renderConversationList();
}

function startNewChat() {
    const newChatId = `conv-${Date.now()}`;
    const newConversation = {
        id: newChatId,
        title: translations[currentLang].new_chat,
        messages: []
    };
    state.conversations.unshift(newConversation);
    saveConversations();

    state.currentConversation = newChatId;
    elements.chatContainer.innerHTML = '';
    showChatPage();

    setTimeout(() => {
        addMessageToChat(getWelcomeMessage(), 'assistant', true);
    }, 500);
}

function getWelcomeMessage() {
    const modelName = state.models?.find(m => m.id === state.currentModel)?.name || 'Mistral';

    if (currentLang === 'fr') {
        return `Bonjour ! Je suis Le Renard, votre assistant IA basé sur ${modelName}.

Je peux vous aider avec :
- Réponses à vos questions
- Génération de contenu
- Analyse de texte
- Et bien plus encore !

Comment puis-ce vous aider aujourd'hui ?`;
    } else {
        return `Hello! I am Le Renard, your AI assistant based on ${modelName}.

I can help you with:
- Answering your questions
- Content generation
- Text analysis
- And much more!

How can I help you today?`;
    }
}

function addConversationToList(id, title) {
    const li = document.createElement('li');
    li.dataset.id = id;
    li.innerHTML = `
        <div class="relative group">
            <div class="flex items-center px-4 py-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer conversation-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span class="flex-1 min-w-0 truncate">${title}</span>
                <button class="ml-auto opacity-0 group-hover:opacity-100 transition conversation-actions-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
            </div>
            <div class="absolute right-4 top-10 z-10 hidden bg-white dark:bg-dark-700 rounded-md shadow-lg p-1 conversation-actions-menu">
                <button class="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-md rename-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span data-i18n="rename_btn">Rename</span>
                </button>
                <button class="w-full text-left flex items-center px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-md delete-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.013 21H7.987a2 2 0 01-1.92-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span data-i18n="delete_btn">Delete</span>
                </button>
            </div>
        </div>
    `;
    elements.conversations.prepend(li);
    setLanguage(currentLang);

    li.querySelector('.conversation-item').addEventListener('click', (e) => {
        if (!e.target.closest('.conversation-actions-toggle') && !e.target.closest('.conversation-actions-menu')) {
            loadConversation(id);
        }
    });

    li.querySelector('.conversation-actions-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = li.querySelector('.conversation-actions-menu');
        document.querySelectorAll('.conversation-actions-menu').forEach(m => {
            if (m !== menu) m.classList.add('hidden');
        });
        menu.classList.toggle('hidden');
    });

    li.querySelector('.rename-btn').addEventListener('click', () => {
        showRenameModal(id, li.querySelector('.truncate').textContent);
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
        deleteConversation(id);
    });
}

function showRenameModal(id, title) {
    currentConversationToRename = id;
    elements.renameInput.value = title;
    elements.renameModal.classList.remove('hidden');
    elements.renameInput.focus();
}

function renameConversation(id, newTitle) {
    const conversation = state.conversations.find(c => c.id === id);
    if (conversation) {
        conversation.title = newTitle;
        saveConversations();
        showToast(translations[currentLang].toast_renamed);
    }
}

function deleteConversation(id) {
    const conversationIndex = state.conversations.findIndex(c => c.id === id);
    if (conversationIndex > -1) {
        state.conversations.splice(conversationIndex, 1);
        saveConversations();
        showToast(translations[currentLang].toast_deleted);
    }
}

function loadConversation(id) {
    state.currentConversation = id;
    const conversation = state.conversations.find(c => c.id === id);
    if (conversation) {
        elements.chatContainer.innerHTML = '';
        conversation.messages.forEach(msg => {
            addMessageToChat(msg.content, msg.role);
        });
    }
    showChatPage();
}

function showModelModal() {
    elements.modelModal.classList.remove('hidden');
}

function hideModelModal() {
    elements.modelModal.classList.add('hidden');
}

function loadModels() {
    const mockModels = [
        { id: '@cf/google/gemma-7b-it-lora', name: 'Gemma 7B IT Lora', description_en: 'Gemma model from Google with Lora tuning', description_fr: 'Modèle Gemma de Google avec réglage Lora', max_length: 8192 },
        { id: '@cf/mistral/mistral-7b-instruct-v0.2', name: 'Mistral 7B Instruct v0.2', description_en: 'Mistral instruct model', description_fr: 'Modèle instruct de Mistral', max_length: 8192 },
        { id: '@cf/mistral/mistral-7b-instruct-v0.1', name: 'Mistral 7B Instruct v0.1', description_en: 'Mistral instruct model', description_fr: 'Modèle instruct de Mistral', max_length: 8192 },
        { id: '@cf/meta-llama/meta-llama-3-8b-instruct', name: 'Llama 3 8B Instruct', description_en: 'The latest Llama model from Meta, optimized for instructions', description_fr: 'Le dernier modèle Llama de Meta, optimisé pour les instructions', max_length: 8192 }
    ];

    state.models = mockModels;
    renderModels(mockModels);
}

function renderModels(models) {
    elements.modelList.innerHTML = '';

    models.forEach(model => {
        const div = document.createElement('div');
        div.className = `p-4 rounded-lg cursor-pointer transition ${state.currentModel === model.id ? 'bg-gray-100 dark:bg-dark-700 border border-accent-purple' : 'bg-gray-100 dark:bg-dark-700/50 hover:bg-gray-200 dark:hover:bg-dark-700'}`;
        div.dataset.id = model.id;
        div.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                    <div class="w-4 h-4 rounded-full border-2 ${state.currentModel === model.id ? 'border-accent-purple bg-accent-purple' : 'border-gray-400 dark:border-gray-500'} flex items-center justify-center">
                        ${state.currentModel === model.id ? '<div class="w-2 h-2 rounded-full bg-white"></div>' : ''}
                    </div>
                </div>
                <div class="ml-3">
                    <h4 class="font-medium text-gray-800 dark:text-gray-200">${model.name}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${currentLang === 'fr' ? model.description_fr : model.description_en}</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">Max tokens: ${model.max_length}</p>
                </div>
            </div>
        `;

        div.addEventListener('click', () => {
            document.querySelectorAll('#model-list > div').forEach(el => {
                el.classList.remove('bg-gray-100', 'dark:bg-dark-700', 'border', 'border-accent-purple');
                el.classList.add('bg-gray-100', 'dark:bg-dark-700/50', 'hover:bg-gray-200', 'dark:hover:bg-dark-700');
                el.querySelector('.rounded-full').classList.remove('border-accent-purple', 'bg-accent-purple');
                el.querySelector('.rounded-full').classList.add('border-gray-400', 'dark:border-gray-500');
                if (el.querySelector('.rounded-full > div')) {
                    el.querySelector('.rounded-full > div').remove();
                }
            });

            div.classList.add('bg-gray-100', 'dark:bg-dark-700', 'border', 'border-accent-purple');
            div.classList.remove('bg-gray-100', 'dark:bg-dark-700/50', 'hover:bg-gray-200', 'dark:hover:bg-dark-700');
            div.querySelector('.rounded-full').classList.add('border-accent-purple', 'bg-accent-purple');
            div.querySelector('.rounded-full').classList.remove('border-gray-400', 'dark:border-gray-500');
            div.querySelector('.rounded-full').innerHTML = '<div class="w-2 h-2 rounded-full bg-white"></div>';

            state.currentModel = model.id;
        });

        elements.modelList.appendChild(div);
    });
}

async function sendMessage() {
    const message = elements.messageInput.value.trim();
    if (message && state.currentConversation) {
        addMessageToChat(message, 'user');
        elements.messageInput.value = '';
        elements.messageInput.style.height = 'auto';

        const conversation = state.conversations.find(c => c.id === state.currentConversation);
        if (conversation) {
            conversation.messages.push({ role: 'user', content: message });
            saveConversations();
        }

        addTypingIndicator();

        try {
            const workerUrl = 'https://renardai.seyzperly.workers.dev/api/chat';
            const messagesForWorker = conversation.messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const payload = {
                messages: messagesForWorker,
                model: state.currentModel,
                stream: false
            };

            const response = await fetch(workerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            removeTypingIndicator();

            if (response.ok) {
                if (data.response) {
                    addMessageToChat(data.response, 'assistant');
                } else {
                    addMessageToChat(`Error: Unexpected API response format.`, 'assistant');
                    console.error('Unexpected API response format:', data);
                }
            } else {
                const errorMessage = data.error || 'Unknown error from worker';
                addMessageToChat(`Error: ${errorMessage}`, 'assistant');
                console.error('Worker API error:', data);
            }
        } catch (error) {
            removeTypingIndicator();
            console.error('Error fetching AI response from worker:', error);
            addMessageToChat(`An error occurred while fetching the response from the AI.`, 'assistant');
        }
    }
}

function addMessageToChat(message, sender, isWelcome = false) {
    const conversation = state.conversations.find(c => c.id === state.currentConversation);

    if (!isWelcome && conversation) {
        conversation.messages.push({
            role: sender,
            content: message
        });
        saveConversations();
    }

    const messageElement = document.createElement('div');
    messageElement.className = 'message-enter';

    if (sender === 'user') {
        messageElement.innerHTML = `
            <div class="flex space-x-3 max-w-3xl mx-auto justify-end">
                <div class="flex-1 min-w-0 flex justify-end">
                    <div class="bg-gray-200 dark:bg-dark-600 rounded-2xl rounded-tr-none p-4 max-w-2xl">
                        <p class="text-sm text-gray-800 dark:text-gray-200">${message}</p>
                        <div class="mt-2 flex items-center justify-end space-x-3 text-xs text-gray-500">
                            <span>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <button class="hover:text-accent-purple transition copy-btn" data-content="${encodeURIComponent(message)}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
            </div>
        `;
    } else {
        messageElement.innerHTML = `
            <div class="flex space-x-3 max-w-3xl mx-auto">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-mint flex items-center justify-center text-white font-bold">
                        🦊
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="bg-gray-100 dark:bg-dark-700 rounded-2xl rounded-tl-none p-4">
                        <p class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">${message}</p>
                        <div class="mt-2 flex items-center space-x-3 text-xs text-gray-500">
                            <span>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <button class="hover:text-accent-purple transition copy-btn" data-content="${encodeURIComponent(message)}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                            </button>
                            <button class="hover:text-green-500 transition like-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                            </button>
                            <button class="hover:text-red-500 transition dislike-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    elements.chatContainer.appendChild(messageElement);
    elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;

    setTimeout(() => {
        messageElement.classList.add('message-enter-active');
    }, 10);

    messageElement.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const content = decodeURIComponent(btn.dataset.content);
            document.execCommand('copy');
            const originalInnerHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            `;
            setTimeout(() => {
                btn.innerHTML = originalInnerHTML;
            }, 2000);
        });
    });

    if (sender === 'assistant') {
        messageElement.querySelector('.like-btn').addEventListener('click', (e) => {
            e.target.closest('button').classList.toggle('text-green-500');
        });

        messageElement.querySelector('.dislike-btn').addEventListener('click', (e) => {
            e.target.closest('button').classList.toggle('text-red-500');
        });
    }
}

function showToast(message) {
    const toastElement = document.createElement('div');
    toastElement.className = 'toast bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3';
    toastElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>${message}</span>
    `;
    elements.toastContainer.appendChild(toastElement);
    setTimeout(() => {
        toastElement.remove();
    }, 3500);
}

function addTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'flex space-x-3 max-w-3xl mx-auto';
    typingElement.innerHTML = `
        <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-mint flex items-center justify-center text-white font-bold">
                🦊
            </div>
        </div>
        <div class="flex-1 min-w-0">
            <div class="bg-gray-100 dark:bg-dark-700 rounded-2xl rounded-tl-none p-4">
                <div class="typing-indicator flex space-x-1">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    elements.chatContainer.appendChild(typingElement);
    elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicators = document.querySelectorAll('.typing-indicator');
    if (typingIndicators.length > 0) {
        typingIndicators[typingIndicators.length - 1].parentElement.parentElement.parentElement.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        elements.themeToggle.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
    } else {
        document.documentElement.classList.remove('dark');
        elements.themeToggle.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
    }
});
