document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('player-form');
    const playerTable = document.querySelector('#player-table tbody');
    let players = [];
    let editingIndex = -1;

    function addPlayer(name, team, number) {
        players.push({ name, team, number });
        renderPlayers();
    }

    function updatePlayer(index, name, team, number) {
        players[index] = { name, team, number };
        renderPlayers();
    }

    function renderPlayers() {
        playerTable.innerHTML = '';  
        players.forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.name}</td>
                <td>${player.team}</td>
                <td>${player.number}</td>
                <td>
                    <button onclick="editPlayer(${index})">Edit</button>
                    <button onclick="deletePlayer(${index})">Delete</button>
                </td>
            `;
            playerTable.appendChild(row);
        });
    }

    window.deletePlayer = function (index) {  
        players.splice(index, 1); 
        renderPlayers();  
    };

    window.editPlayer = function (index) { 
        const player = players[index];
        document.getElementById('name').value = player.name;
        document.getElementById('team').value = player.team;
        document.getElementById('number').value = player.number;

        editingIndex = index; 
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const team = document.getElementById('team').value;
        const number = document.getElementById('number').value;

        if (name && team && number) {
            if (editingIndex === -1) {
                addPlayer(name, team, number);
            } else {
                updatePlayer(editingIndex, name, team, number);
                editingIndex = -1; 
            }
        } else {
            alert('Please fill out all fields');
        }

        form.reset(); 
    });
});
