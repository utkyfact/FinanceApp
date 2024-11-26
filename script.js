document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const tableBody = document.querySelector('#data-table tbody');

    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    let rowToDelete = null;

    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    let rowToEdit = null;


    const gelenToplamElement = document.getElementById('gelen-toplam');
    const gidenToplamElement = document.getElementById('giden-toplam');
    const guncelToplamElement = document.getElementById('guncel-toplam');

    // Load data from localStorage
    loadTableData();
    updateSummary();

    form.addEventListener('submit', (e) => {
        e.preventDefault();


        const tarih = document.getElementById('tarih').value;
        const isim = document.getElementById('isim').value;
        const gelen = parseFloat(document.getElementById('gelen').value) || 0;
        const giden = parseFloat(document.getElementById('giden').value) || 0;
        const toplam = gelen - giden;
        const banka = document.getElementById('banka').value;
        const imza = document.getElementById('imza').value;


        const row = document.createElement('tr');
        row.classList.add = ('d-flex')
        row.innerHTML = `
        <td>${tarih}</td>
        <td>${isim}</td>
        <td>${gelen}</td>
        <td>${giden}</td>
        <td>${toplam}</td>
        <td>${banka}</td>
        <td>${imza}</td>
        <td><button class="btn btn-warning btn-sm edit-btn">Düzenle</button></td>
        <td><button class="btn btn-danger btn-sm delete-btn">Sil</button></td>
      `;


        tableBody.appendChild(row);


        saveTableData();
        updateSummary();


        form.reset();
    });


    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            rowToDelete = e.target.closest('tr');
            modal.show();
        } else if (e.target.classList.contains('edit-btn')) {
            rowToEdit = e.target.closest('tr');
            const cells = rowToEdit.querySelectorAll('td');

            document.getElementById('edit-tarih').value = cells[0].textContent;
            document.getElementById('edit-isim').value = cells[1].textContent;
            document.getElementById('edit-gelen').value = cells[2].textContent;
            document.getElementById('edit-giden').value = cells[3].textContent;
            document.getElementById('edit-banka').value = cells[5].textContent;
            document.getElementById('edit-imza').value = cells[6].textContent;

            editModal.show();
        }
    });

    // Confirm delete
    confirmDeleteButton.addEventListener('click', () => {
        if (rowToDelete) {
            rowToDelete.remove();
            saveTableData();
            updateSummary();
            modal.hide();
            rowToDelete = null;
        }
    });

    // Edit form
    document.getElementById('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();

        if (rowToEdit) {
            const gelen = parseFloat(document.getElementById('edit-gelen').value) || 0;
            const giden = parseFloat(document.getElementById('edit-giden').value) || 0;
            const toplam = gelen - giden;

            const cells = rowToEdit.querySelectorAll('td');
            cells[0].textContent = document.getElementById('edit-tarih').value;
            cells[1].textContent = document.getElementById('edit-isim').value;
            cells[2].textContent = gelen;
            cells[3].textContent = giden;
            cells[4].textContent = toplam;
            cells[5].textContent = document.getElementById('edit-banka').value;
            cells[6].textContent = document.getElementById('edit-imza').value;

            saveTableData();
            updateSummary();
            editModal.hide();
            rowToEdit = null;
        }
    });

    function saveTableData() {
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        const data = rows.map(row => {
            const cells = row.querySelectorAll('td');
            return {
                tarih: cells[0].textContent,
                isim: cells[1].textContent,
                gelen: parseFloat(cells[2].textContent) || 0,
                giden: parseFloat(cells[3].textContent) || 0,
                toplam: parseFloat(cells[4].textContent) || 0,
                banka: cells[5].textContent,
                imza: cells[6].textContent
            };
        });
        localStorage.setItem('financeTable', JSON.stringify(data));
    }

    function loadTableData() {
        const data = JSON.parse(localStorage.getItem('financeTable')) || [];
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
          <td>${item.tarih}</td>
          <td>${item.isim}</td>
          <td>${item.gelen}</td>
          <td>${item.giden}</td>
          <td>${item.toplam}</td>
          <td>${item.banka}</td>
          <td>${item.imza}</td>
          <td><button class="btn btn-warning btn-sm edit-btn">Düzenle</button></td>
          <td><button class="btn btn-danger btn-sm delete-btn">Sil</button></td>
        `;
            tableBody.appendChild(row);
        });
    }

    function updateSummary() {
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        let gelenToplam = 0, gidenToplam = 0;

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            gelenToplam += parseFloat(cells[2].textContent) || 0;
            gidenToplam += parseFloat(cells[3].textContent) || 0;
        });

        gelenToplamElement.textContent = gelenToplam;
        gidenToplamElement.textContent = gidenToplam;
        guncelToplamElement.textContent = gelenToplam - gidenToplam;
    }
});
