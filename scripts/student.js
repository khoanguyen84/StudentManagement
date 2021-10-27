class Student {
    constructor(id, fn, dob, email, gender, avatar) {
        this.id = id;
        this.fullname = fn;
        this.dob = dob;
        this.email = email;
        this.gender = gender;
        this.avatar = avatar;
    }
}

const students_key = "c0921G1";
const page_index_default = 1;
const page_size_default = 5;
let intervalId = 0;
let students = [];

function init() {
    if (getLocalStorage(students_key) == null) {
        students = [
            new Student(1, "Khoa", "2000-10-10", "khoa@gmail.com", true, "images/avatar.jpg"),
            new Student(2, "Quang", "2000-10-10", "quang@gmail.com", true, "images/avatar.jpg"),
            new Student(3, "Hiệp", "2000-10-10", "hiep@gmail.com", true, "images/avatar.jpg"),
            new Student(4, "Phương", "2000-10-10", "phuong@gmail.com", true, "images/avatar.jpg"),
        ];
        setLocalStorage(students_key, students);
    }
    else {
        students = getLocalStorage(students_key);
    }
}

function getLocalStorage(key) {
    return JSON.parse(window.localStorage.getItem(key));
}

function setLocalStorage(key, data) {
    window.localStorage.setItem(key, JSON.stringify(data));
}

function showStudent(page_index, page_size) {
    let tbody = document.getElementById('tbStudent');
    tbody.innerHTML = '';
    students.sort(function (std1, std2) {
        return std2.id - std1.id;
    })
    data = students.slice((page_index - 1) * page_size, page_size * page_index);
    data.forEach(function (student, index) {
        tbody.innerHTML += `
                    <tr id='tr_${student.id}'>
                        <td class="text-center">${student.id}</td>
                        <td>${student.fullname}</td>
                        <td class='text-center'>
                            <img class='img-sm img-circle' src='${student.avatar}' />
                        </td>
                        <td class='text-center'>${student.dob}</td>
                        <td>${student.email}</td>
                        <td class='text-center'>${student.gender ? "Male" : "Female"}</td>
                        <td class='text-right'>
                            <a href='javascript:;' class='btn btn-success btn-sm' onclick='edit(${student.id})'>Edit</a>
                            <a href='javascript:;' class='btn btn-warning btn-sm d-none' onclick='update(${student.id})'>Save</a>
                            <a href='javascript:;' class='btn btn-dark btn-sm d-none' onclick='cancel(${student.id})'>Cancel</a>
                            <a href='javascript:;' class='btn btn-danger btn-sm' onclick='remove(${student.id})'>Remove</a>
                        </td>
                    </tr>
        `
    })
}

function createStudent() {
    let fn = document.getElementById('fullname').value;
    let dob = document.getElementById('dob').value;
    let email = document.getElementById('email').value;
    let gender = document.getElementsByName('gender')[0].checked;
    let avatar = "images/avatar.jpg"; //document.getElementById("avatar").value;
    let id = students[0].id + 1;
    students.push(new Student(id, fn, dob, email, gender, avatar));
    setLocalStorage(students_key, students);
    showStudent(page_index_default, page_size_default);
    buildPagination(page_index_default);
    showMessage('Product has been created successfully!');
    reset();
}

function reset() {
    document.getElementById('fullname').value = "";
    document.getElementById('dob').value = "";
    document.getElementById('email').value = "";
    document.getElementsByName('gender')[0].checked = true;
    document.getElementById('avatar').value = "images/avatar.jpg";
}

function remove(id) {
    let confirmed = window.confirm('Are you sure to want to remove this product?');
    if (confirmed) {
        let position = students.findIndex(function (student, index) {
            return student.id == id;
        });
        students.splice(position, 1);
        setLocalStorage(students_key, students);
        showStudent(page_index_default, page_size_default);
        buildPagination(page_index_default);
        // alert('Product has been removed successfully!');
        showMessage('Product has been removed successfully!');
    }
}

function edit(id) {
    let tr = document.getElementById(`tr_${id}`);
    tr.children[6].children[0].classList.add('d-none');
    tr.children[6].children[1].classList.remove('d-none');
    tr.children[6].children[2].classList.remove('d-none');

    let student = students.find(function (student, index) {
        return student.id == id;
    });
    tr.children[1].innerHTML = `<input class='form-control' id='fn_${id}' type="text" value='${student.fullname}'>`;
    tr.children[2].innerHTML = `<input class='form-control' id='avatar_${id}' type="url" value='${student.avatar}'>`;
    tr.children[3].innerHTML = `<input class='form-control' id='dob_${id}' type="date" value='${student.dob}'>`;
    tr.children[4].innerHTML = `<input class='form-control' id='email_${id}' type="email" value='${student.email}'>`;
}

function cancel(id) {
    let tr = document.getElementById(`tr_${id}`);
    tr.children[6].children[0].classList.remove('d-none');
    tr.children[6].children[1].classList.add('d-none');
    tr.children[6].children[2].classList.add('d-none');

    let student = students.find(function (student, index) {
        return student.id == id;
    });
    tr.children[1].innerHTML = `${student.fullname}`;
    tr.children[2].innerHTML = `<img class='img-sm img-circle' src='${student.avatar}' />`;
    tr.children[3].innerHTML = `${student.dob}`;
    tr.children[4].innerHTML = `${student.email}`;
}

function update(id) {
    let tr = document.getElementById(`tr_${id}`);
    let fn = document.getElementById(`fn_${id}`).value;
    let dob = document.getElementById(`dob_${id}`).value;
    let email = document.getElementById(`email_${id}`).value;
    let avatar = document.getElementById(`avatar_${id}`).value;

    let student = students.find(function (student, index) {
        return student.id == id;
    });
    student.fullname = fn;
    student.dob = dob;
    student.email = email;
    student.avatar = avatar;

    setLocalStorage(students_key, students);
    showStudent(page_index_default, page_size_default);

    //reset elements
    cancel(id);
}

function buildPagination(page_index) {
    let pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    let page_number = Math.ceil(students.length / page_size_default);
    for (let i = 1; i <= page_number; i++) {
        pagination.innerHTML += `<li><button onclick='paging(${i})' class='${i == page_index ? 'page-item active' : 'page-item'}'>${i}</button></li>`
    }
}

function paging(page_index) {
    buildPagination(page_index);
    showStudent(page_index, page_size_default);
}

function ready() {
    init();
    showStudent(page_index_default, page_size_default);
    buildPagination(page_index_default);
}

function showMessage(msg, type = 1) {
    let message = document.getElementsByClassName('message')[0];
    message.children[0].innerText = msg;
    message.classList.remove('d-none');
    autoCloseMessage();
}

function closeMessage() {
    let message = document.getElementsByClassName('message')[0];
    message.children[0].innerText = "";
    message.classList.add('d-none');
    clearInterval(intervalId);
}

function autoCloseMessage() {
    intervalId = setInterval(closeMessage, 5 * 1000);
}

ready();

