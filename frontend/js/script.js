//1. В HTML файле создана верстка элементов, которые будут статичны(неизменны).
(() => {
  let clientsArray = [];
  let arrFilter = [];
  let countContacts = 0;
  //2. Загрузка информации о списке клиентов с сервера, слушатель событий на кнопку добавления клиента
  async function download() {
    document.querySelector('.dummy').style.display = 'flex';
    const response = await fetch('http://localhost:3000/api/clients');
    const clients = await response.json();

    if (clients.length !== 0) {
      document.querySelector('.dummy').style.display = 'none';
      clientsArray = clients;
      renderClientsTable(clientsArray);
    }

    linkLoad();

    document.querySelector('.btn-secondary').addEventListener('click', renderAddClient);
  }
  //3. Функция вывода одного клиента в таблицу, слушатели событий на кнопки изменить, удалить
  function getClientsItem(clientsObj) {
    let tableBody = document.querySelector('tbody');

    let row = document.createElement('tr');
    row.className = 'table-row';
    row.setAttribute('id', clientsObj.id);
    tableBody.append(row);

    let col1 = document.createElement('td');
    col1.className = 'col-title--1 table-text--col1';
    col1.textContent = clientsObj.id.slice(5, 11);
    row.append(col1);

    let col2 = document.createElement('td');
    col2.className = 'col-title--2  table-text';
    row.append(col2);

    let cardClient = document.createElement('a');
    cardClient.setAttribute('href', `#${clientsObj.id}`);
    cardClient.textContent = clientsObj.surname + ' ' + clientsObj.name + ' ' + clientsObj.lastName;
    col2.append(cardClient);

    let col3 = document.createElement('td');
    let arrDate1 = clientsObj.createdAt.slice(0, 10).split('-');
    let date = arrDate1[2] + '.' + arrDate1[1] + '.' + arrDate1[0];
    col3.className = 'col-title--3  table-text';
    col3.textContent = date;
    row.append(col3);

    let timeSpan1 = document.createElement('span')
    let arrTime1 = clientsObj.createdAt.split('T')
    timeSpan1.textContent = arrTime1[1].slice(0, 5);
    col3.append(timeSpan1);

    let col4 = document.createElement('td');
    let arrDate2 = clientsObj.updatedAt.slice(0, 10).split('-');
    let date2 = arrDate2[2] + '.' + arrDate2[1] + '.' + arrDate2[0];
    col4.className = 'col-title--4  table-text';
    col4.textContent = date2;
    row.append(col4);

    let timeSpan2 = document.createElement('span')
    let arrTime2 = clientsObj.updatedAt.split('T')
    timeSpan2.textContent = arrTime2[1].slice(0, 5);
    col4.append(timeSpan2);

    let col5 = document.createElement('td');
    col5.className = 'col-title--5 col-contacts';
    let count = 0;
    const maxIcon = 4;
    clientsObj.contacts.forEach(element => {
      if (count === maxIcon) {
        let iconButton = document.createElement('button');
        iconButton.className = 'btn-reset btn-icon';
        col5.append(iconButton);
        iconButton.insertAdjacentHTML('beforeend', `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="7.5" stroke="#9873FF"/>
        </svg>`);
        ++count;

        iconButton.addEventListener('click', () => {
          col5.querySelectorAll('.contacts-icon').forEach(e => {
            e.style.display = 'block';
            iconButton.style.display = 'none';
          })
        })
      }

      if (element.type === 'Телефон') {
        col5.insertAdjacentHTML('beforeend', `<svg class="contacts-icon" data-tippy-content="${element.value}" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7"><circle cx="8" cy="8" r="8" fill="#9873FF"/>
        <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
        </g>
        </svg>`);
        ++count;
      };
      if (element.type === 'Email') {
        col5.insertAdjacentHTML('beforeend', `<svg class="contacts-icon" data-tippy-content="${element.value}" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
        </g>
        </svg>`);
        ++count;
      };
      if (element.type === 'Facebook') {
        col5.insertAdjacentHTML('beforeend', `<svg class="contacts-icon" data-tippy-content="${element.value}" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
        <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
        </g>
        </svg>`);
        ++count;
      };
      if (element.type === 'VK') {
        col5.insertAdjacentHTML('beforeend', `<svg class="contacts-icon" data-tippy-content="${element.value}" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
        <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
        </g>
        </svg>`);
        ++count;
      };
      if (element.type === 'Другое') {
        col5.insertAdjacentHTML('beforeend', `<svg class="contacts-icon" data-tippy-content="${element.value}" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
        </g>
        </svg>`);
        ++count;
      };
    });

    if ((count - 5) > 0) {
      let countIcon = document.createElement('span');
      let iconButton = col5.querySelector('.btn-icon');
      countIcon.className = 'contacts-count';
      countIcon.textContent = '+' + (count - 5);
      iconButton.append(countIcon);
    };
    row.append(col5);

    tippy('.contacts-icon', { animation: 'scale-extreme' });

    let col6 = document.createElement('td');
    col6.className = 'col-title--6';
    row.append(col6);

    let updatedButton = document.createElement('button');
    updatedButton.className = 'btn-reset table-text btn-up';
    updatedButton.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d = "M0 10.5002V13.0002H2.5L9.87333 5.62687L7.37333 3.12687L0 10.5002ZM11.8067 3.69354C12.0667 3.43354 12.0667 3.01354 11.8067 2.75354L10.2467 1.19354C9.98667 0.933535 9.56667 0.933535 9.30667 1.19354L8.08667 2.41354L10.5867 4.91354L11.8067 3.69354Z" fill = "#9873FF" />
    </svg> Изменить`;
    col6.append(updatedButton);

    let deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-path', 'delClient');
    deleteButton.className = 'btn-reset table-text btn-delet';
    deleteButton.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#F06A4D" />
    </svg> Удалить`;
    col6.append(deleteButton);

    deleteButton.addEventListener('click', () => {
      renderDelClient(clientsObj, deleteButton);
      deleteButton.querySelector('svg').remove();
      deleteButton.textContent = '';
      deleteButton.className = 'btn-reset table-text btn-delet btn-delet--load';
      deleteButton.insertAdjacentHTML('beforeend', `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#F06A4D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
      </svg> Удалить`);
    });

    updatedButton.addEventListener('click', async () => {
      updatedButton.querySelector('svg').remove();
      updatedButton.textContent = '';
      updatedButton.className = 'btn-reset table-text btn-up btn-up--load';
      updatedButton.insertAdjacentHTML('beforeend', `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#9873FF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
      </svg> Изменить`);

      const response = await fetch('http://localhost:3000/api/clients');
      const clients = await response.json();

      clientsArray = clients;
      clientsArray.forEach(el => {
        if (el.id === clientsObj.id) renderUpClient(el, updatedButton, deleteButton);
      });
    });
  }
  //4. Отрисовка таблицы клиентов, слушатели событий формы поиска, кнопок сортировки
  function renderClientsTable(arr) {
    arr.forEach(clientsObj => {
      getClientsItem(clientsObj);
    });

    const waitTime = 300;
    let headerForm = document.querySelector('.header-form');
    let searсhInput = document.querySelector('.header-form__input');
    let timeout;
    let autocompleteList = document.createElement('div');

    searсhInput.addEventListener('input', () => {
      arrFilter = [];
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        autocompleteList.replaceChildren();

        arr.forEach(el => {
          let arrDate1 = el.createdAt.slice(0, 10).split('-');
          let date = arrDate1[2] + '.' + arrDate1[1] + '.' + arrDate1[0];
          let arrDate2 = el.updatedAt.slice(0, 10).split('-');
          let date2 = arrDate2[2] + '.' + arrDate2[1] + '.' + arrDate2[0];
          let str = el.name + el.surname + el.lastName + el.id + date + date2;
          str = str.toLowerCase();
          if (str.includes(searсhInput.value.trim().toLowerCase()) && searсhInput.value !== '') arrFilter.push(el);
        })

        if (arrFilter.length !== 0) {
          autocompleteList.setAttribute('class', 'autocomplete-items');
          headerForm.append(autocompleteList);

          arrFilter.forEach(el => {
            let autocompleteBtn = document.createElement('button');
            autocompleteBtn.classList.add('autocomplete-btn', 'btn-reset');
            autocompleteBtn.setAttribute('data-path', el.id);
            autocompleteBtn.textContent = el.surname + ' ' + el.name;
            autocompleteList.append(autocompleteBtn);

            autocompleteBtn.addEventListener('click', () => {
              let scroll = document.getElementById(el.id);
              scroll.scrollIntoView({ behavior: "smooth" });

              let focusItem = document.querySelector('.focus');
              if (focusItem !== null) focusItem.classList.remove('focus');
              scroll.querySelector('.col-title--2').classList.add('focus');
            })
          });
        } else {
          autocompleteList.remove();

          let focusItem = document.querySelector('.focus');
          if (focusItem !== null) focusItem.classList.remove('focus');
        }

        let currentFocus = -1;
        searсhInput.addEventListener("keydown", (e) => {
          let x = document.querySelector('.autocomplete-items');
          if (x) x = x.getElementsByTagName("button");
          if (e.keyCode == 40) {
            /* Если нажата клавиша со стрелкой вниз,
            увеличение текущей переменной фокуса: */
            currentFocus++;
            /* и сделать текущий элемент более видимым: */
            addActive(x);
          } else if (e.keyCode == 38) { //вверх
            /* Если нажата клавиша со стрелкой вверх,
            уменьшите текущую переменную фокуса: */
            currentFocus--;
            /* и сделать текущий элемент более видимым: */
            addActive(x);
          }
          else if (e.keyCode == 13) {
            /* Если нажата клавиша ENTER, предотвратите отправку формы, */
            e.preventDefault();
            if (currentFocus > -1) {
              /* и имитировать щелчок по элементу "active": */
              if (x) x[currentFocus].click();
            }
          };
          function addActive(x) {
            /*функция для классификации элемента как " активного":*/
            if (!x) return false;
            /*начните с удаления "активного" класса на всех элементах:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*добавить класс "autocomplete-active":*/
            x[currentFocus].classList.add("active");
          };
          function removeActive(x) {
            /*функция для удаления класса "active" из всех элементов автозаполнения:*/
            for (let i = 0; i < x.length; i++) {
              x[i].classList.remove("active");
            }
          };
        });
      }, waitTime);
    });

    let countClick1 = 0;
    btnCol1 = document.querySelector('.btn-col-title--1');
    btnCol1.addEventListener('click', () => {
      ++countClick1;
      let rowDel = document.querySelectorAll('.table-row');
      rowDel.forEach((el) => el.remove());
      (arrFilter.length > 0) ? clientsArray = arrFilter : clientsArray = arr;

      if (countClick1 % 2 == 0) {
        clientsArray.sort(byFieldUp('id'));
        btnCol1.querySelector('svg').style.transform = 'rotate(0deg)';
      } else {
        clientsArray.sort(byFieldDown('id'));
        btnCol1.querySelector('svg').style.transform = 'rotate(180deg)';
      }
      clientsArray.forEach(clientsObj => getClientsItem(clientsObj));
    });

    let countClick2 = 0;
    btnCol2 = document.querySelector('.btn-col-title--2');
    btnCol2.addEventListener('click', () => {
      ++countClick2;
      let rowDel = document.querySelectorAll('.table-row');
      rowDel.forEach((el) => el.remove());
      (arrFilter.length > 0) ? clientsArray = arrFilter : clientsArray = arr;

      if (countClick2 % 2 == 0) {
        clientsArray.sort((a, b) => a.surname + a.name + a.lastName > b.surname + b.name + b.lastName ? 1 : -1);
        btnCol2.querySelector('svg').style.transform = 'rotate(0deg)';
      } else {
        clientsArray.sort((a, b) => a.surname + a.name + a.lastName < b.surname + b.name + b.lastName ? 1 : -1);
        btnCol2.querySelector('svg').style.transform = 'rotate(180deg)';
      }
      clientsArray.forEach(clientsObj => getClientsItem(clientsObj));
    });

    let countClick3 = 0;
    btnCol3 = document.querySelector('.btn-col-title--3');
    btnCol3.addEventListener('click', () => {
      ++countClick3;
      let rowDel = document.querySelectorAll('.table-row');
      rowDel.forEach((el) => el.remove());
      (arrFilter.length > 0) ? clientsArray = arrFilter : clientsArray = arr;

      if (countClick3 % 2 == 0) {
        clientsArray.sort(byFieldDown('createdAt'));
        btnCol3.querySelector('svg').style.transform = 'rotate(0deg)';
      } else {
        clientsArray.sort(byFieldUp('createdAt'));
        btnCol3.querySelector('svg').style.transform = 'rotate(180deg)';
      }
      clientsArray.forEach(clientsObj => getClientsItem(clientsObj));
    });

    let countClick4 = 0;
    btnCol4 = document.querySelector('.btn-col-title--4');
    btnCol4.addEventListener('click', () => {
      ++countClick4;
      let rowDel = document.querySelectorAll('.table-row');
      rowDel.forEach((el) => el.remove());
      (arrFilter.length > 0) ? clientsArray = arrFilter : clientsArray = arr;

      if (countClick4 % 2 == 0) {
        clientsArray.sort(byFieldDown('updatedAt'));
        btnCol4.querySelector('svg').style.transform = 'rotate(0deg)';
      } else {
        clientsArray.sort(byFieldUp('updatedAt'));
        btnCol4.querySelector('svg').style.transform = 'rotate(180deg)';
      }
      clientsArray.forEach(clientsObj => getClientsItem(clientsObj));
    });
  }
  //5. Отрисовка модального окна добавления клиента, слушатели событий форм ввода, кнопок закрытия, добавления контакта, сохранения, отмены
  function renderAddClient() {
    countContacts = 0;

    document.body.classList.toggle('stop-scroll')

    let mainContainer = document.querySelector('.main__container');
    let modals = document.createElement('div');
    modals.classList.add('modals');
    mainContainer.append(modals);

    let modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    modals.append(modalOverlay);

    let modal = document.createElement('div');
    modal.classList.add('modal');
    modalOverlay.append(modal);

    let exitButton = document.createElement('button');
    exitButton.classList.add('modal__btn', 'btn-reset', 'exit');
    exitButton.innerHTML = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd"d="M16.2332 1.73333L15.2665 0.766664L8.49985 7.53336L1.73318 0.766696L0.766515 1.73336L7.53318 8.50003L0.766542 15.2667L1.73321 16.2333L8.49985 9.46669L15.2665 16.2334L16.2332 15.2667L9.46651 8.50003L16.2332 1.73333Z"/></svg>`;
    modal.append(exitButton);

    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modal.append(modalContent);

    let modalTitle = document.createElement('h2');
    modalTitle.classList.add('modal__title', 'title');
    modalTitle.textContent = 'Новый клиент'
    modalContent.append(modalTitle);

    let modalForm = document.createElement('form');
    modalForm.classList.add('modal__form', 'flex');
    modalForm.setAttribute('id', 'form');
    modalContent.append(modalForm);

    let formLabel1 = document.createElement('label');
    formLabel1.classList.add('form-label', 'form-label--1');
    formLabel1.setAttribute('for', 'surname');
    modalForm.append(formLabel1);

    let inputSurname = document.createElement('input');
    inputSurname.classList.add('form-input');
    inputSurname.setAttribute('id', 'surname');
    inputSurname.setAttribute('name', 'surname');
    inputSurname.setAttribute('type', 'text');
    inputSurname.addEventListener("focusin", () => {
      formLabel1.classList.add('form-label1--focus');
      inputSurname.style.borderColor = '';
      validateText.textContent = '';
    });
    inputSurname.addEventListener("focusout", () => { if (inputSurname.value === '') formLabel1.classList.remove('form-label1--focus') });
    formLabel1.append(inputSurname);

    let formLabel2 = document.createElement('label');
    formLabel2.classList.add('form-label', 'form-label--2');
    formLabel2.setAttribute('for', 'surname');
    modalForm.append(formLabel2);

    let inputName = document.createElement('input');
    inputName.classList.add('form-input');
    inputName.setAttribute('id', 'name');
    inputName.setAttribute('name', 'name');
    inputName.setAttribute('type', 'text');
    inputName.addEventListener("focusin", () => {
      formLabel2.classList.add('form-label2--focus');
      inputName.style.borderColor = '';
      validateText.textContent = '';
    });
    inputName.addEventListener("focusout", () => { if (inputName.value === '') formLabel2.classList.remove('form-label2--focus') });
    formLabel2.append(inputName);

    let formLabel3 = document.createElement('label');
    formLabel3.classList.add('form-label', 'form-label--3');
    formLabel3.setAttribute('for', 'surname');
    modalForm.append(formLabel3);

    let inputLastname = document.createElement('input');
    inputLastname.classList.add('form-input');
    inputLastname.setAttribute('id', 'lastname');
    inputLastname.setAttribute('name', 'lastname');
    inputLastname.setAttribute('type', 'text');
    inputLastname.addEventListener("focusin", () => formLabel3.classList.add('form-label3--focus'));
    inputLastname.addEventListener("focusout", () => { if (inputLastname.value === '') formLabel3.classList.remove('form-label3--focus') });
    formLabel3.append(inputLastname);

    let contacts = document.createElement('div');
    contacts.classList.add('contacts');
    modal.append(contacts);

    let contactsContent = document.createElement('div');
    contactsContent.classList.add('contacts-content');
    contacts.append(contactsContent);

    let addContact = document.createElement('button');
    addContact.classList.add('btn-contact', 'btn-reset', 'flex');
    addContact.insertAdjacentHTML('beforeend', `<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.629 7.65963C13.629 11.3406 10.6449 14.3246 6.96395 14.3246C3.28297 14.3246 0.29895 11.3406 0.29895 7.65963C0.29895 3.97865 3.28297 0.994629 6.96395 0.994629C10.6449 0.994629 13.629 3.97865 13.629 7.65963Z" stroke="none"/>
<path d="M13.631 7.665C13.631 11.346 10.647 14.33 6.966 14.33C3.28502 14.33 0.301001 11.346 0.301001 7.665C0.301001 3.98402 3.28502 1 6.966 1C10.647 1 13.631 3.98402 13.631 7.665ZM1.60149 7.665C1.60149 10.6277 4.00326 13.0295 6.966 13.0295C9.92874 13.0295 12.3305 10.6277 12.3305 7.665C12.3305 4.70226 9.92874 2.30049 6.966 2.30049C4.00326 2.30049 1.60149 4.70226 1.60149 7.665Z" fill="#9873FF" stroke="none"/>
<path d="M6.99951 5.20068V7.69922M6.99951 7.69922V10.2007M6.99951 7.69922H4.50012M6.99951 7.69922H9.50012" stroke-width="1.5" stroke-linecap="round"/>
</svg>Добавить контакт`);
    contacts.append(addContact);

    let validateText = document.createElement('p');
    validateText.classList.add('validate-text');
    modal.append(validateText);

    let saveButton = document.createElement('button');
    saveButton.classList.add('btn-primary', 'btn-reset', 'btn-save', 'flex');
    saveButton.textContent = 'Сохранить';
    modal.append(saveButton);

    let cancelButton = document.createElement('button');
    cancelButton.classList.add('btn-cancel', 'btn-reset', 'flex', 'exit');
    cancelButton.textContent = 'Отмена';
    modal.append(cancelButton);

    let buttons = document.querySelectorAll('.exit');
    buttons.forEach((elem) => {
      elem.addEventListener('click', () => {
        modals.remove();
        document.body.classList.remove('stop-scroll')
      })
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target == modalOverlay) {
        modals.remove();
        document.body.classList.remove('stop-scroll')
      }
    });

    saveButton.addEventListener('click', () => {
      save(method = 'POST', clientsObj = 'noneId', inputSurname, inputName, inputLastname, validateText, contactsContent);
    });

    let count = 0;
    addContact.addEventListener('click', () => {
      ++countContacts;
      ++count;
      if (countContacts === 10) {
        addContact.style.display = 'none';
      }
      getContact(count, key = '', value = '');
    })
  }
  //6. Отрисовка модального окна изменения клиента, слушатели событий форм ввода, кнопок закрытия, добавления контакта, 
  function renderUpClient(clientsObj, btnUp, btnDel) {

    countContacts = 0;
    document.body.classList.toggle('stop-scroll')

    let mainContainer = document.querySelector('.main__container');
    let modals = document.createElement('div');
    modals.classList.add('modals');
    mainContainer.append(modals);

    let modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    modals.append(modalOverlay);

    let modal = document.createElement('div');
    modal.classList.add('modal');
    modalOverlay.append(modal);

    let exitButton = document.createElement('button');
    exitButton.classList.add('modal__btn', 'btn-reset', 'exit');
    exitButton.innerHTML = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd"d="M16.2332 1.73333L15.2665 0.766664L8.49985 7.53336L1.73318 0.766696L0.766515 1.73336L7.53318 8.50003L0.766542 15.2667L1.73321 16.2333L8.49985 9.46669L15.2665 16.2334L16.2332 15.2667L9.46651 8.50003L16.2332 1.73333Z"/></svg>`;
    modal.append(exitButton);

    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modal.append(modalContent);

    let modalTitle = document.createElement('h2');
    modalTitle.classList.add('modal__title', 'title');
    modalTitle.textContent = 'Изменить данные';
    modalTitle.innerHTML = `Изменить данные<span class="modal__title--id">ID: ${clientsObj.id.slice(0, 6)}</span>`;
    modalContent.append(modalTitle);

    let modalForm = document.createElement('form');
    modalForm.classList.add('modal__form', 'flex');
    modalForm.setAttribute('id', 'form');
    modalContent.append(modalForm);

    let formLabel1 = document.createElement('label');
    formLabel1.classList.add('form-label', 'form-label--1');
    formLabel1.setAttribute('for', 'surname');
    modalForm.append(formLabel1);

    let inputSurname = document.createElement('input');
    inputSurname.classList.add('form-input');
    inputSurname.setAttribute('id', 'surname');
    inputSurname.setAttribute('name', 'surname');
    inputSurname.setAttribute('type', 'text');
    inputSurname.value = clientsObj.surname;
    if (inputSurname.value !== '') formLabel1.classList.toggle('form-label1--focus');
    inputSurname.addEventListener("focusin", () => formLabel1.classList.add('form-label1--focus'));
    inputSurname.addEventListener("focusout", () => { if (inputSurname.value === '') formLabel1.classList.remove('form-label1--focus') });
    formLabel1.append(inputSurname);

    let formLabel2 = document.createElement('label');
    formLabel2.classList.add('form-label', 'form-label--2');
    formLabel2.setAttribute('for', 'surname');
    modalForm.append(formLabel2);

    let inputName = document.createElement('input');
    inputName.classList.add('form-input');
    inputName.setAttribute('id', 'name');
    inputName.setAttribute('name', 'name');
    inputName.setAttribute('type', 'text');
    inputName.value = clientsObj.name;
    if (inputName.value !== '') formLabel2.classList.toggle('form-label2--focus');
    inputName.addEventListener("focusin", () => formLabel2.classList.add('form-label2--focus'));
    inputName.addEventListener("focusout", () => { if (inputName.value === '') formLabel2.classList.remove('form-label2--focus') });
    formLabel2.append(inputName);

    let formLabel3 = document.createElement('label');
    formLabel3.classList.add('form-label', 'form-label--3');
    formLabel3.setAttribute('for', 'surname');
    modalForm.append(formLabel3);

    let inputLastname = document.createElement('input');
    inputLastname.classList.add('form-input');
    inputLastname.setAttribute('id', 'lastname');
    inputLastname.setAttribute('name', 'lastname');
    inputLastname.setAttribute('type', 'text');
    inputLastname.value = clientsObj.lastName;
    if (inputLastname.value !== '') formLabel3.classList.toggle('form-label3--focus');
    inputLastname.addEventListener("focusin", () => formLabel3.classList.add('form-label3--focus'));
    inputLastname.addEventListener("focusout", () => { if (inputLastname.value === '') formLabel3.classList.remove('form-label3--focus') });
    formLabel3.append(inputLastname);

    let contacts = document.createElement('div');
    contacts.classList.add('contacts');
    modal.append(contacts);

    let contactsContent = document.createElement('div');
    contactsContent.classList.add('contacts-content');
    contacts.append(contactsContent);

    let addContact = document.createElement('button');
    addContact.classList.add('btn-contact', 'btn-reset', 'flex');
    addContact.insertAdjacentHTML('beforeend', `<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.629 7.65963C13.629 11.3406 10.6449 14.3246 6.96395 14.3246C3.28297 14.3246 0.29895 11.3406 0.29895 7.65963C0.29895 3.97865 3.28297 0.994629 6.96395 0.994629C10.6449 0.994629 13.629 3.97865 13.629 7.65963Z" stroke="none"/>
    <path d="M13.631 7.665C13.631 11.346 10.647 14.33 6.966 14.33C3.28502 14.33 0.301001 11.346 0.301001 7.665C0.301001 3.98402 3.28502 1 6.966 1C10.647 1 13.631 3.98402 13.631 7.665ZM1.60149 7.665C1.60149 10.6277 4.00326 13.0295 6.966 13.0295C9.92874 13.0295 12.3305 10.6277 12.3305 7.665C12.3305 4.70226 9.92874 2.30049 6.966 2.30049C4.00326 2.30049 1.60149 4.70226 1.60149 7.665Z" fill="#9873FF" stroke="none"/>
    <path d="M6.99951 5.20068V7.69922M6.99951 7.69922V10.2007M6.99951 7.69922H4.50012M6.99951 7.69922H9.50012" stroke-width="1.5" stroke-linecap="round"/>
    </svg>Добавить контакт`);
    contacts.append(addContact);

    let validateText = document.createElement('p');
    validateText.classList.add('validate-text');
    modal.append(validateText);

    let saveButton = document.createElement('button');
    saveButton.classList.add('btn-primary', 'btn-reset', 'btn-save', 'flex');
    saveButton.textContent = 'Сохранить';
    modal.append(saveButton);

    let deletButton = document.createElement('button');
    deletButton.classList.add('btn-cancel', 'btn-reset', 'flex', 'exit');
    deletButton.textContent = 'Удалить клиента';
    modal.append(deletButton);

    exitButton.addEventListener('click', () => {
      modals.remove();
      document.body.classList.remove('stop-scroll')
      btnUp.querySelector('svg').remove();
      btnUp.className = 'btn-reset table-text btn-up';
      btnUp.textContent = '';
      btnUp.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d = "M0 10.5002V13.0002H2.5L9.87333 5.62687L7.37333 3.12687L0 10.5002ZM11.8067 3.69354C12.0667 3.43354 12.0667 3.01354 11.8067 2.75354L10.2467 1.19354C9.98667 0.933535 9.56667 0.933535 9.30667 1.19354L8.08667 2.41354L10.5867 4.91354L11.8067 3.69354Z" fill = "#9873FF" />
    </svg> Изменить`;
      history.pushState("", document.title, window.location.pathname);
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target == modalOverlay) {
        modals.remove();
        document.body.classList.remove('stop-scroll')
        btnUp.querySelector('svg').remove();
        btnUp.className = 'btn-reset table-text btn-up';
        btnUp.textContent = '';
        btnUp.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d = "M0 10.5002V13.0002H2.5L9.87333 5.62687L7.37333 3.12687L0 10.5002ZM11.8067 3.69354C12.0667 3.43354 12.0667 3.01354 11.8067 2.75354L10.2467 1.19354C9.98667 0.933535 9.56667 0.933535 9.30667 1.19354L8.08667 2.41354L10.5867 4.91354L11.8067 3.69354Z" fill = "#9873FF" />
    </svg> Изменить`;
        history.pushState("", document.title, window.location.pathname);
      }
    });

    deletButton.addEventListener('click', () => {
      modals.remove();
      document.body.classList.remove('stop-scroll')
      btnUp.querySelector('svg').remove();
      btnUp.className = 'btn-reset table-text btn-up';
      btnUp.textContent = '';
      btnUp.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d = "M0 10.5002V13.0002H2.5L9.87333 5.62687L7.37333 3.12687L0 10.5002ZM11.8067 3.69354C12.0667 3.43354 12.0667 3.01354 11.8067 2.75354L10.2467 1.19354C9.98667 0.933535 9.56667 0.933535 9.30667 1.19354L8.08667 2.41354L10.5867 4.91354L11.8067 3.69354Z" fill = "#9873FF" />
    </svg> Изменить`;

      btnDel.querySelector('svg').remove();
      btnDel.textContent = '';
      btnDel.className = 'btn-reset table-text btn-delet btn-delet--load';
      btnDel.insertAdjacentHTML('beforeend', `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#F06A4D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
    </svg> Удалить`);
      renderDelClient(clientsObj, btnDel);

    });

    saveButton.addEventListener('click', () => {
      save(method = 'PATCH', clientsObj, inputSurname, inputName, inputLastname, validateText, contactsContent);
    });

    renderContacts(clientsObj);
  }
  //7. Функция вывода одного контакта в модальное окно изменения клиента, слушатели событий форм ввода контакта, кнопки удаления контакта
  function getContact(count, key, value) {
    ++count;
    let contactsContent = document.querySelector('.contacts-content');

    let contactForm = document.createElement('div');
    contactForm.classList.add('contact-form', 'flex');
    contactsContent.append(contactForm);

    let customSelect = document.createElement('div');
    customSelect.classList.add('select-custom');
    customSelect.setAttribute('id', `select-${count}`);
    contactForm.append(customSelect);

    if (key === '') key = 'Телефон';

    new ItcCustomSelect(`#select-${count}`, {
      name: 'contacts', // значение атрибута name у кнопки
      targetValue: key, // значение по умолчанию
      options: [['Телефон', 'Телефон'], ['Email', 'Email'], ['Facebook', 'Facebook'], ['VK', 'VK'], ['Другое', 'Другое']], // опции
    });

    let formLabel = document.createElement('label');
    formLabel.classList.add('form-label', 'form-label--contact');
    contactForm.append(formLabel);

    let inputContact = document.createElement('input');
    inputContact.classList.add('form-input', 'form-input--contact');
    inputContact.setAttribute('placeholder', 'Введите данные контакта');
    inputContact.setAttribute('type', 'text');
    inputContact.value = value;
    formLabel.append(inputContact);

    let delButton = document.createElement('button');
    delButton.classList.add('btn-reset', 'btn-del--contact');
    delButton.insertAdjacentHTML('beforeend', `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill=""/>
    </svg>`);
    contactForm.append(delButton);

    if (value === '') delButton.style.display = 'none';

    inputContact.addEventListener('change', () => {
      if (inputContact.value !== '') delButton.style.display = 'block';
    })

    delButton.addEventListener('click', () => {
      contactForm.remove();
      --countContacts;

      let addContact = document.querySelector('.btn-contact');
      addContact.style.display = 'flex';
    })
  }
  //8. Отрисовка списка контактов в модальном окне изменения клиента, слушатели событий добавления контакта
  function renderContacts(clientsObj) {
    let count = 0;
    let addContact = document.querySelector('.btn-contact');
    for (const el of clientsObj.contacts) {
      let key = el.type;
      let value = el.value;
      getContact(count, key, value)
      ++count;
      ++countContacts;

      if (countContacts === 10) {
        addContact.style.display = 'none';
      }
    }

    addContact.addEventListener('click', () => {
      ++countContacts;
      ++count;
      if (countContacts === 10) {
        addContact.style.display = 'none';
      }
      getContact(count, key = '', value = '');
      tippy('.btn-del--contact', {
        content: 'Удалить контакт',
        animation: 'scale-extreme',
      });
    });

    tippy('.btn-del--contact', {
      content: 'Удалить контакт',
      animation: 'scale-extreme',
    });
  }
  //9. Отрисовка модального окна удаления клиента
  function renderDelClient(clientsObj, btnDel) {
    document.body.classList.toggle('stop-scroll')

    let mainContainer = document.querySelector('.main__container');
    let modals = document.createElement('div');

    modals.classList.add('modals');
    mainContainer.append(modals);

    let modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    modals.append(modalOverlay);

    let modal = document.createElement('div');
    modal.classList.add('modal');
    modalOverlay.append(modal);

    let exitButton = document.createElement('button');
    exitButton.classList.add('modal__btn', 'btn-reset', 'exit');
    exitButton.innerHTML = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd"d="M16.2332 1.73333L15.2665 0.766664L8.49985 7.53336L1.73318 0.766696L0.766515 1.73336L7.53318 8.50003L0.766542 15.2667L1.73321 16.2333L8.49985 9.46669L15.2665 16.2334L16.2332 15.2667L9.46651 8.50003L16.2332 1.73333Z"/></svg>`;
    modal.append(exitButton);

    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modal.append(modalContent);

    let modalTitle = document.createElement('h2');
    modalTitle.classList.add('modal__title', 'title', 'modal__title--del');
    modalTitle.textContent = 'Удалить клиента'
    modalContent.append(modalTitle);

    let rowText1 = document.createElement('p');
    rowText1.classList.add('modal-text');
    rowText1.textContent = 'Вы действительно хотите удалить данного клиента?'
    modalContent.append(rowText1);

    let delButton = document.createElement('button');
    delButton.classList.add('btn-primary', 'btn-reset', 'btn-del', 'flex');
    delButton.textContent = 'Удалить';
    modal.append(delButton);

    let cancelButton = document.createElement('button');
    cancelButton.classList.add('btn-cancel', 'btn-reset', 'flex', 'exit');
    cancelButton.textContent = 'Отмена';
    modal.append(cancelButton);

    let buttons = document.querySelectorAll('.exit');
    buttons.forEach((e) => {
      e.addEventListener('click', () => {
        modals.remove();
        document.body.classList.remove('stop-scroll')
        btnDel.querySelector('svg').remove();
        btnDel.textContent = '';
        btnDel.className = 'btn-reset table-text btn-delet';
        btnDel.insertAdjacentHTML('beforeend', `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#F06A4D" />
        </svg> Удалить`);
        history.pushState("", document.title, window.location.pathname);
      })
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target == modalOverlay) {
        modals.remove();
        document.body.classList.remove('stop-scroll')
        btnDel.querySelector('svg').remove();
        btnDel.textContent = '';
        btnDel.className = 'btn-reset table-text btn-delet';
        btnDel.insertAdjacentHTML('beforeend', `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#F06A4D" />
        </svg> Удалить`);
        history.pushState("", document.title, window.location.pathname);
      }
    });

    delButton.addEventListener('click', () => {
      fetch(`http://localhost:3000/api/clients/${clientsObj.id}`, {
        method: 'DELETE',
      });
      history.pushState("", document.title, window.location.pathname);
      location.reload();
    });
  }
  //10. Функция сохранения клиента, сохранения изменений клиента
  async function save(method, clientsObj, inputSurname, inputName, inputLastname, validateText, contactsContent) {
    const text = 'Поле обязательно для заполнения!'
    let contactsForm = contactsContent.querySelectorAll('.contact-form');
    let contactsUp = [];

    if (inputSurname.value.trim() === '') {
      inputSurname.style.borderColor = 'rgba(240, 106, 77, 0.5)';
      validateText.textContent = text;
    }
    else if (inputName.value.trim() === '') {
      inputSurname.style.borderColor = '';
      inputName.style.borderColor = 'rgba(240, 106, 77, 0.5)';
      validateText.textContent = text;
    } else {


      if (contactsForm.length !== '') {
        for (const iterator of contactsForm) {
          let contactType = iterator.querySelector('.itc-select__toggle');
          let contactValue = iterator.querySelector('.form-input--contact');

          if (contactValue.value.trim() === '') {
            inputSurname.style.borderColor = '';
            inputName.style.borderColor = '';
            contactValue.style.border = '1px solid';
            contactValue.style.borderColor = 'rgba(240, 106, 77, 0.5)';
            validateText.textContent = text;
          } else {
            contactsUp.push({ type: contactType.value, value: contactValue.value });
            contactValue.style.border = '';
            contactValue.style.borderColor = '';
          }
        }

        if (contactsForm.length === contactsUp.length) {
          let clientObj = {
            name: inputName.value,
            surname: inputSurname.value,
            lastName: inputLastname.value,
            contacts: contactsUp
          }

          let url;
          (clientsObj === 'noneId') ? url = 'http://localhost:3000/api/clients' : url = `http://localhost:3000/api/clients/${clientsObj.id}`;

          await fetch(url, {
            method: method,
            body: JSON.stringify(clientObj),
            headers: {
              'Content-Type': 'application/json',
            }
          }).then(function (response) {
            if (!response.ok) {
              response.json().then(function (json) {
                if (json.errors !== '') {
                  json.errors.forEach(e => validateText.textContent = e.message)
                } else validateText.textContent = 'Что-то пошло не так...';
              })
            } else {
              history.pushState("", document.title, window.location.pathname);
              location.reload();
            }
          });
        }
      }
    }
  }
  //11. Функция восходящий сортировки
  function byFieldUp(field) {
    return (a, b) => a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1;
  }
  //12. Функция нисходящей сортировки
  function byFieldDown(field) {
    return (a, b) => a[field].toLowerCase() < b[field].toLowerCase() ? 1 : -1;
  }
  // 13. Функция открытия модального окна при изменении hash - части пути страницы
  function linkLoad() {
    clientsArray.forEach(clientsObj => {
      if (clientsObj.id === location.hash.slice(1)) {
        let row = document.getElementById(location.hash.slice(1));
        let updatedButton = row.querySelector('.btn-up');
        let deleteButton = row.querySelector('.btn-delet');

        renderUpClient(clientsObj, updatedButton, deleteButton);
        updatedButton.querySelector('svg').remove();
        updatedButton.textContent = '';
        updatedButton.className = 'btn-reset table-text btn-up btn-up--load';
        updatedButton.insertAdjacentHTML('beforeend', `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#9873FF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
          </svg> Изменить`);
      }
    });
  }
  //14. Загрузка в DOM
  document.addEventListener('DOMContentLoaded', download);
  //15. Слушатель событий изменения hash-части пути страницы
  window.addEventListener('hashchange', linkLoad);
})();