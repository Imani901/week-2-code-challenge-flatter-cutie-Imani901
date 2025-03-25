document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const votesForm = document.getElementById("votes-form");
    const characterForm = document.getElementById("character-form");
    const resetVotesButton = document.getElementById("reset-btn");

    // Fetch characters from the API
    fetch("http://localhost:3000/characters")
        .then(response => response.json())
        .then(characters => {
            characters.forEach(character => {
                const span = document.createElement("span");
                span.textContent = character.name;
                span.dataset.id = character.id; // Store character ID
                span.classList.add("character-name");
                characterBar.appendChild(span);

                // Add click event to each character name
                span.addEventListener("click", () => {
                    displayCharacterDetails(character);
                });
            });
        });

    // Display character details
    function displayCharacterDetails(character) {
        detailedInfo.innerHTML = `
            <h2>${character.name}</h2>
            <img src="${character.image}" alt="${character.name}" />
            <p>Votes: <span id="vote-count">${character.votes}</span></p>
        `;
    }

    // Handle votes form submission
    votesForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const voteInput = event.target.elements["votes"];
        const votesToAdd = parseInt(voteInput.value);
        const currentVotes = parseInt(document.getElementById("vote-count").textContent);
        const newVoteCount = currentVotes + votesToAdd;

        // Update the displayed vote count
        document.getElementById("vote-count").textContent = newVoteCount;

        // Get the character ID from the displayed character
        const characterId = document.querySelector(".character-name.active")?.dataset.id;
        if (characterId) {
            // Update the server with the new vote count (for extra bonus)
            fetch(`http://localhost:3000/characters/${characterId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ votes: newVoteCount })
            });
        }

        // Clear the input field
        voteInput.value = "";
    });

    // Handle reset votes button
    resetVotesButton.addEventListener("click", () => {
        const characterId = document.querySelector(".character-name.active")?.dataset.id;
        if (characterId) {
            // Reset votes on the displayed character
            document.getElementById("vote-count").textContent = 0;

            // Reset the server (for extra bonus)
            fetch(`http://localhost:3000/characters/${characterId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ votes: 0 })
            });
        }
    });

    // Handle new character form submission
    characterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const nameInput = event.target.elements["name"];
        const imageInput = event.target.elements["image-url"]; // Ensure this matches the input name

        const newCharacter = {
            name: nameInput.value,
            image: imageInput.value,
            votes: 0
        };

        // Add new character to the character bar
        fetch("http://localhost:3000/characters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCharacter)
        })
        .then(response => response.json())
        .then(character => {
            const span = document.createElement("span");
            span.textContent = character.name;
            span.dataset.id = character.id; // Store character ID
            span.classList.add("character-name");
            characterBar.appendChild(span);

            // Display the new character's details immediately
            displayCharacterDetails(character);

            // Add click event to the new character name
            span.addEventListener("click", () => {
                displayCharacterDetails(character);
            });

            // Clear the input fields
            nameInput.value = "";
            imageInput.value = "";
        });
    });
});