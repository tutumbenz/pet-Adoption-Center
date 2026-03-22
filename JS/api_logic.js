(function() {
    const form = document.getElementById('animalForm');
    const animalsList = document.getElementById('animalsList');

    function fetchAnimals() {
        fetch('api.php')
            .then(function(response) {
                return response.json();
            })
            .then(function(animals) {
                renderAnimals(animals);
            })
            .catch(function(error) {
                console.error('Error fetching animals:', error);
            });
    }

    function renderAnimals(animals) {
        animalsList.innerHTML = '';
        
        animals.forEach(function(animal) {
            var row = document.createElement('tr');
            row.setAttribute('data-id', animal.id);
            
            var healthClass = animal.health_status === 'Healthy' ? 'style="color: green;"' : 'style="color: orange;"';
            
            row.innerHTML = 
                '<td>' + animal.id + '</td>' +
                '<td>' + escapeHtml(animal.name) + '</td>' +
                '<td>' + escapeHtml(animal.species) + '</td>' +
                '<td>' + escapeHtml(animal.color) + '</td>' +
                '<td>' + animal.age + '</td>' +
                '<td>' + escapeHtml(animal.gender) + '</td>' +
                '<td ' + healthClass + '>' + escapeHtml(animal.health_status) + '</td>' +
                '<td>' +
                    '<select onchange="updateAnimalStatus(' + animal.id + ', this.value)" style="margin-right: 5px;">' +
                        '<option value="Healthy"' + (animal.health_status === 'Healthy' ? ' selected' : '') + '>Healthy</option>' +
                        '<option value="Under Treatment"' + (animal.health_status === 'Under Treatment' ? ' selected' : '') + '>Under Treatment</option>' +
                    '</select>' +
                    '<button onclick="deleteAnimal(' + animal.id + ')">Remove</button>' +
                '</td>';
            
            animalsList.appendChild(row);
        });
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        
        var formData = {
            name: document.getElementById('animalName').value,
            species: document.getElementById('animalSpecies').value,
            color: document.getElementById('animalColor').value,
            age: parseInt(document.getElementById('animalAge').value, 10),
            gender: document.getElementById('animalGender').value,
            health_status: document.getElementById('animalHealth').value
        };

        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                form.reset();
                fetchAnimals();
            } else {
                alert('Error adding animal: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(function(error) {
            console.error('Error adding animal:', error);
            alert('Failed to add animal');
        });
    }

    window.updateAnimalStatus = function(id, healthStatus) {
        fetch('api.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                health_status: healthStatus
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                fetchAnimals();
            } else {
                alert('Error updating status: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(function(error) {
            console.error('Error updating animal status:', error);
            alert('Failed to update status');
        });
    };

    window.deleteAnimal = function(id) {
        if (!confirm('Are you sure you want to remove this animal?')) {
            return;
        }

        fetch('api.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                fetchAnimals();
            } else {
                alert('Error deleting animal: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(function(error) {
            console.error('Error deleting animal:', error);
            alert('Failed to delete animal');
        });
    };

    form.addEventListener('submit', handleFormSubmit);

    fetchAnimals();
})();
