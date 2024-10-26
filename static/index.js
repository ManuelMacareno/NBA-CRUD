document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('player-form');
    const playerTable = document.querySelector('#player-table tbody');
    let editingPlayerId = null;

    // Función para obtener todos los jugadores del backend
    async function getPlayers() {
        const response = await fetch('http://127.0.0.1:5000/players');
        const players = await response.json();
        renderPlayers(players);
    }

    // Renderizar jugadores en la tabla
    function renderPlayers(players) {
        playerTable.innerHTML = '';
        players.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.name}</td>
                <td>${player.team}</td>
                <td>${player.number !== null ? player.number : ''}</td>
                <td>
                    <button onclick="editPlayer(${player.id})">Editar</button>
                    <button onclick="deletePlayer(${player.id})">Eliminar</button>
                </td>
            `;
            playerTable.appendChild(row);
        });
    }

    // Agregar o actualizar un jugador
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const team = document.getElementById('team').value;
        const number = document.getElementById('number').value;

        const playerData = { name, team, number: number || null };

        if (editingPlayerId === null) {
            // Crear un nuevo jugador
            await fetch('http://127.0.0.1:5000/players', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(playerData)
            });
        } else {
            // Actualizar jugador existente
            await fetch(`http://127.0.0.1:5000/players/${editingPlayerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(playerData)
            });
            editingPlayerId = null;
        }

        form.reset();
        getPlayers();
    });

    // Editar jugador
    window.editPlayer = async (id) => {
        const response = await fetch(`http://127.0.0.1:5000/players/${id}`);
        const player = await response.json();
        document.getElementById('name').value = player.name;
        document.getElementById('team').value = player.team;
        document.getElementById('number').value = player.number || '';
        editingPlayerId = id;
    };

    // Eliminar jugador
    window.deletePlayer = async (id) => {
        await fetch(`http://127.0.0.1:5000/players/${id}`, {
            method: 'DELETE'
        });
        getPlayers();
    };

    // Cargar jugadores al cargar la página
    getPlayers();
});
