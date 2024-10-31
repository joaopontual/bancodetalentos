let members = JSON.parse(localStorage.getItem('members')) || [];

function saveToLocalStorage() {
    localStorage.setItem('members', JSON.stringify(members));
}

function createCard(member, index) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
        <div class="card-photo">
            ${member.photo ? `<img src="${member.photo}" alt="Foto de ${member.name}">` : 'Sem Foto'}
        </div>
        <div class="card-content">
            <div><span>Nome:</span> ${member.name}</div>
            <div><span>Idade:</span> ${member.age}</div>
            <div><span>Habilidades:</span> ${member.skills}</div>
            <div><span>Experiência:</span> ${member.experience}</div>
            <div><span>Telefone:</span> ${member.phone}</div>
            <div><span>Email:</span> ${member.email}</div>
            <div><span>Área de Interesse:</span> ${member.interestArea}</div>
            <div><span>LinkedIn:</span> <a href="${member.linkedin}" target="_blank">${member.linkedin}</a></div>
            <div><span>Currículo:</span> ${member.pdf ? `<a href="${member.pdf}" download="Curriculo_${member.name}.pdf">Baixar PDF</a>` : 'Não disponível'}</div>
        </div>
        <div class="buttons">
            <button onclick="removeMember(${index})">Remover</button>
        </div>
    `;

    document.getElementById('cardsContainer').appendChild(card);
}

function displayMembers(filterFn = null) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';
    
    members
        .filter(member => (filterFn ? filterFn(member) : true))
        .forEach((member, index) => createCard(member, index));
}

function applyFilters() {
    const ageFilter = parseInt(document.getElementById('ageFilter').value) || null;
    const interestFilter = document.getElementById('interestFilter').value.toLowerCase();
    const skillsFilter = document.getElementById('skillsFilter').value.toLowerCase();

    displayMembers(member => {
        return (!ageFilter || member.age === ageFilter) &&
               (!interestFilter || member.interestArea.toLowerCase().includes(interestFilter)) &&
               (!skillsFilter || member.skills.toLowerCase().includes(skillsFilter));
    });
}

document.getElementById('search').addEventListener('input', () => {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    displayMembers(member => member.name.toLowerCase().includes(searchTerm));
});

document.getElementById('ageFilter').addEventListener('input', applyFilters);
document.getElementById('interestFilter').addEventListener('input', applyFilters);
document.getElementById('skillsFilter').addEventListener('input', applyFilters);

// Toggle form visibility
document.getElementById('addButton').addEventListener('click', () => {
    const form = document.getElementById('formContainer');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

function addMember() {
    const name = document.getElementById('nameInput').value;
    const age = parseInt(document.getElementById('ageInput').value);
    const skills = document.getElementById('skillsInput').value;
    const experience = document.getElementById('experienceInput').value;
    const phone = document.getElementById('phoneInput').value;
    const email = document.getElementById('emailInput').value;
    const interestArea = document.getElementById('interestInput').value;
    const linkedin = document.getElementById('linkedinInput').value;
    const photoInput = document.getElementById('photoInput').files[0];
    const pdfInput = document.getElementById('pdfInput').files[0];

    let photoUrl = "";
    let pdfUrl = "";

    if (photoInput) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoUrl = e.target.result;

            if (pdfInput) {
                const pdfReader = new FileReader();
                pdfReader.onload = function(e) {
                    pdfUrl = e.target.result;
                    members.push({ name, age, skills, experience, phone, email, interestArea, linkedin, photo: photoUrl, pdf: pdfUrl });
                    saveToLocalStorage();
                    displayMembers();
                };
                pdfReader.readAsDataURL(pdfInput);
            } else {
                members.push({ name, age, skills, experience, phone, email, interestArea, linkedin, photo: photoUrl, pdf: null });
                saveToLocalStorage();
                displayMembers();
            }
        };
        reader.readAsDataURL(photoInput);
    } else {
        if (pdfInput) {
            const pdfReader = new FileReader();
            pdfReader.onload = function(e) {
                pdfUrl = e.target.result;
                members.push({ name, age, skills, experience, phone, email, interestArea, linkedin, photo: null, pdf: pdfUrl });
                saveToLocalStorage();
                displayMembers();
            };
            pdfReader.readAsDataURL(pdfInput);
        } else {
            members.push({ name, age, skills, experience, phone, email, interestArea, linkedin, photo: null, pdf: null });
            saveToLocalStorage();
            displayMembers();
        }
    }

    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('formContainer').reset();
}

function removeMember(index) {
    members.splice(index, 1);
    saveToLocalStorage();
    displayMembers();
}

// Carrega os membros do Local Storage ao inicializar a página
displayMembers();
