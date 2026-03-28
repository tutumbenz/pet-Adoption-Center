//IIFE _(Immediately Invoked Function Expression)_
const modal = document.getElementById("addpet-modal");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-modal");
const addPetsBtn = document.getElementById("addpets");
const petslistModal = document.getElementById("petslist-modal");
const managepetsModal = document.getElementById("managepets-modal");
const form = document.getElementById("addpet-form");

let allPets = [];

function openModal(modalEl) {
  modalEl.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modalEl) {
  modalEl.classList.remove("active");
  overlay.classList.remove("active");
}

function closeAddModal() {
  modal.classList.remove("active");
  overlay.classList.remove("active");
  form.reset();
}

addPetsBtn.addEventListener("click", function () {
  openModal(modal);
});
document.getElementById("close-modal").addEventListener("click", closeAddModal);
document.getElementById("petslists").addEventListener("click", function () {
  openModal(petslistModal);
  fetchPetsList();
});
document.getElementById("managepets").addEventListener("click", function () {
  openModal(managepetsModal);
  fetchManagePets();
});
document
  .getElementById("close-petslist")
  .addEventListener("click", function () {
    closeModal(petslistModal);
  });
document
  .getElementById("close-managepets")
  .addEventListener("click", function () {
    closeModal(managepetsModal);
  });
overlay.addEventListener("click", function () {
  closeModal(modal);
  closeModal(petslistModal);
  closeModal(managepetsModal);
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal(modal);
    closeModal(petslistModal);
    closeModal(managepetsModal);
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById("animalName").value,
    species: document.getElementById("animalSpecies").value,
    color: document.getElementById("animalColor").value,
    age: parseInt(document.getElementById("animalAge").value, 10),
    gender: document.getElementById("animalGender").value,
    health_status: document.getElementById("animalHealth").value,
    isAdopted: document.getElementById("isAdopted").checked ? 1 : 0,
  };

  fetch("api.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.success) {
        closeAddModal();
        alert("Pet added successfully!");
      } else {
        alert("Error: " + (data.error || "Unknown error"));
      }
    })
    .catch(function (error) {
      alert("Failed to add pet. Please try again.");
    });
});

function fetchPetsList() {
  fetch("api.php")
    .then(function (response) {
      return response.json();
    })
    .then(function (pets) {
      allPets = pets;
      renderPetsList(pets);
    })
    .catch(function (error) {
      console.error("Error fetching pets: ", error);
    });
}

function renderPetsList(pets) {
  const tbody = document.getElementById("petslist-body");
  const nameFilter = document.getElementById("filterName").value.toLowerCase();
  const speciesFilter = document.getElementById("filterSpecies").value;
  const healthFilter = document.getElementById("filterHealth").value;
  const adoptedFilter = document.getElementById(
    "filterAdoptedCheckBox"
  ).checked;

  console.log("Filtering... Show only adopted:", adoptedFilter); // to check

  const filtered = pets.filter(function (pet) {
    const matchName = pet.name.toLowerCase().includes(nameFilter);
    const matchSpecies = !speciesFilter || pet.species === speciesFilter;
    const matchHealth = !healthFilter || pet.health_status === healthFilter;
    const isAdopted = parseInt(pet.isAdopted) === 1;
    const matchAdopted = !adoptedFilter || isAdopted;
    return matchName && matchSpecies && matchHealth && matchAdopted;
  });

  if (filtered.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" style="text-align:center;">No pets found</td></tr>';
    return;
  }

  tbody.innerHTML = filtered
    .map(function (pet) {
      const healthClass =
        pet.health_status === "Healthy" ? "health-healthy" : "health-treatment";
      return (
        "<tr>" +
        "<td>" +
        escapeHtml(pet.name) +
        "</td>" +
        "<td>" +
        escapeHtml(pet.species) +
        "</td>" +
        "<td>" +
        escapeHtml(pet.color) +
        "</td>" +
        "<td>" +
        pet.age +
        "</td>" +
        "<td>" +
        escapeHtml(pet.gender) +
        "</td>" +
        '<td class="' +
        healthClass +
        '">' +
        escapeHtml(pet.health_status) +
        "</td>" +
        "<td>" +
        escapeHtml(parseInt(pet.isAdopted) === 1 ? "✅ Yes" : "❌ No") +
        "</td>" +
        "</tr>"
      );
    })
    .join("");
}

function fetchManagePets() {
  fetch("api.php")
    .then(function (response) {
      return response.json();
    })
    .then(function (pets) {
      renderManagePets(pets);
    })
    .catch(function (error) {
      console.error("Error fetching pets:", error);
    });
}

function renderManagePets(pets) {
  const container = document.getElementById("managepets-container");

  if (pets.length === 0) {
    container.innerHTML = '<p class="no-pets">No pets to manage</p>';
    return;
  }

  container.innerHTML = pets
    .map(function (pet) {
      return (
        '<div class="manage-card" data-id="' +
        pet.id +
        '">' +
        '<div class="manage-card-info">' +
        "<strong>" +
        escapeHtml(pet.name) +
        "</strong>" +
        "<span>" +
        escapeHtml(pet.species) +
        " | " +
        escapeHtml(pet.color) +
        " | " +
        pet.age +
        " yrs | " +
        escapeHtml(pet.gender) +
        "</span>" +
        "</div>" +
        '<div class="manage-card-actions">' +
        '<select onchange="updatePetStatus(' +
        pet.id +
        ', this.value)">' +
        '<option value="Healthy"' +
        (pet.health_status === "Healthy" ? " selected" : "") +
        ">Healthy</option>" +
        '<option value="Under Treatment"' +
        (pet.health_status === "Under Treatment" ? " selected" : "") +
        ">Under Treatment</option>" +
        "</select>" +
        '<button class="manage-btn manage-btn-delete" onclick="deletePet(' +
        pet.id +
        ')">Remove</button>' +
        "</div>" +
        "</div>"
      );
    })
    .join("");
}

window.updatePetStatus = function (id, healthStatus) {
  fetch("api.php", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id, health_status: healthStatus }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.success) {
        fetchManagePets();
      } else {
        alert("Error updating status: " + (data.error || "Unknown error"));
      }
    })
    .catch(function (error) {
      alert("Failed to update status");
    });
};

window.deletePet = function (id) {
  if (!confirm("Are you sure you want to remove this pet?")) return;

  fetch("api.php", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.success) {
        fetchManagePets();
      } else {
        alert("Error deleting pet: " + (data.error || "Unknown error"));
      }
    })
    .catch(function (error) {
      alert("Failed to delete pet");
    });
};

document.getElementById("filterName").addEventListener("input", function () {
  renderPetsList(allPets);
});
document
  .getElementById("filterSpecies")
  .addEventListener("change", function () {
    renderPetsList(allPets);
  });
document
  .getElementById("filterHealth")
  .addEventListener("change", function (){
    renderPetsList(allPets);
});

const adoptCheckbox = document.getElementById("filterAdoptedCheckBox");

if (adoptCheckbox) {
  adoptCheckbox.addEventListener("change", function () {
    renderPetsList(allPets);
  });
} else {
  console.error("Could not find element with ID: filterAdoptedCheckBox"); // Debugging
}
/* document
  .getElementById("filterAdoptedCheckBox")
  .getEventListener("checked", function(){      //had abug using this, why?
    renderPetsList(allPets);
  }); */

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
