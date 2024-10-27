document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('player-form');
    const playerTable = document.querySelector('#player-table tbody');
    let editingPlayerId = null;

    async function getPlayers() {
        try {
            const response = await fetch('http://127.0.0.1:5000/players');
            if (!response.ok) throw new Error('Error al obtener jugadores');
            const players = await response.json();
            renderPlayers(players);
        } catch (error) {
            console.error(error);
        }
    }

    function renderPlayers(players) {
        playerTable.innerHTML = '';

        const uniquePlayers = new Map();
        players.reverse().forEach(player => {
            const key = `${player.name}-${player.team}`;
            if (!uniquePlayers.has(key)) {
                uniquePlayers.set(key, player);
            }
        });

        for (let player of uniquePlayers.values()) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.name}</td>
                <td>${player.team}</td>
                <td>
                    <button onclick="editPlayer(${player.id})">Editar</button>
                    <button onclick="deletePlayer(${player.id})">Eliminar</button>
                </td>
            `;
            playerTable.appendChild(row);
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const team = document.getElementById('team').value;

        const playerData = { name, team };

        try {
            if (editingPlayerId === null) {
                const response = await fetch('http://127.0.0.1:5000/players', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(playerData)
                });
                if (!response.ok) throw new Error('Error al agregar jugador');
            } else {
                const response = await fetch(`http://127.0.0.1:5000/players/${editingPlayerId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(playerData)
                });
                if (!response.ok) throw new Error('Error al editar jugador');
                editingPlayerId = null;
            }

            form.reset();
            getPlayers();
        } catch (error) {
            console.error(error);
        }
    });

    window.editPlayer = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/players/${id}`);
            if (!response.ok) throw new Error('Error al obtener jugador');
            const player = await response.json();
            document.getElementById('name').value = player.name;
            document.getElementById('team').value = player.team;
            editingPlayerId = id;
        } catch (error) {
            console.error(error);
        }
    };

    window.deletePlayer = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/players/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error al eliminar jugador');
            getPlayers();
        } catch (error) {
            console.error(error);
        }
    };

    getPlayers();
});
