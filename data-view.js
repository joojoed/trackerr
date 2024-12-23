let currentIndex = 0;
let dataList = [];
let filteredList = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://script.google.com/macros/s/AKfycby2fn5QkxTs1BJfpd6KzLBG4NG0wIylAqBNw3M9h0AxFvtQR6LTTD6d-7AD6WWqByQ3LQ/exec')
        .then(response => response.json())
        .then(data => {
            dataList = data.slice(1); // Skip headers if your sheet has them
            filteredList = [...dataList];
            displayEntry(currentIndex);
        })
        .catch(error => console.error('Error fetching data:', error));

    document.getElementById('nextButton').addEventListener('click', () => {
        if (currentIndex < filteredList.length - 1) {
            currentIndex++;
            displayEntry(currentIndex);
        }
    });

    document.getElementById('backButton').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayEntry(currentIndex);
        }
    });

    document.getElementById('editButton').addEventListener('click', () => {
        enterEditMode();
    });

    document.getElementById('cancelButton').addEventListener('click', () => {
        exitEditMode();
    });

    document.getElementById('saveButton').addEventListener('click', () => {
        saveChanges();
    });
});

function displayEntry(index) {
    if (filteredList.length > 0) {
        const entry = filteredList[index];
        document.getElementById('name').textContent = `Name: ${entry[0]}`;
        document.getElementById('email').textContent = `Email: ${entry[1]}`;
        document.getElementById('message').textContent = `Message: ${entry[2]}`;
        exitEditMode();
    } else {
        document.getElementById('name').textContent = 'No data available';
        document.getElementById('email').textContent = '';
        document.getElementById('message').textContent = '';
    }
}

function enterEditMode() {
    const entry = filteredList[currentIndex];
    document.getElementById('editName').value = entry[0];
    document.getElementById('editEmail').value = entry[1];
    document.getElementById('editMessage').value = entry[2];
    
    document.getElementById('displayArea').classList.add('hidden');
    document.getElementById('editArea').classList.remove('hidden');
}

function exitEditMode() {
    document.getElementById('displayArea').classList.remove('hidden');
    document.getElementById('editArea').classList.add('hidden');
}

function saveChanges() {
    const updatedEntry = {
        row: currentIndex, // Assuming rows start at 0 for JavaScript logic
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        message: document.getElementById('editMessage').value
    };

    fetch('https://script.google.com/macros/s/AKfycby2fn5QkxTs1BJfpd6KzLBG4NG0wIylAqBNw3M9h0AxFvtQR6LTTD6d-7AD6WWqByQ3LQ/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEntry),
    }).then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              alert('Changes saved successfully');
              filteredList[currentIndex] = [updatedEntry.name, updatedEntry.email, updatedEntry.message];
              displayEntry(currentIndex);
          } else {
              alert('Failed to save changes');
          }
      }).catch(error => console.error('Error saving changes:', error));
}
