class Student{
    constructor(id, fn, dob, email, gender, avatar){
        this.id = id;
        this.fullname = fn;
        this.dob = dob;
        this.email = email;
        this.gender = gender;
        this.avatar = avatar;
    }
}

const students_key = "c0921G1";
let students = [];

function init(){
    if(getLocalStorage(students_key) == null){
        students = [
            new Student(1, "Khoa", "10/10/2000", "khoa@gmail.com", true, "images/avatar.jpg"),
            new Student(2, "Quang", "10/10/2000", "quang@gmail.com", true, "images/avatar.jpg"),
            new Student(3, "Hiệp", "10/10/2000", "hiep@gmail.com", true, "images/avatar.jpg"),
            new Student(4, "Phương", "10/10/2000", "phuong@gmail.com", true, "images/avatar.jpg"),
        ];
        setLocalStorage(students_key, students);
    }
    else{
        students = getLocalStorage(students_key);
    }
}

function getLocalStorage(key){
    return JSON.parse(window.localStorage.getItem(key));
}

function setLocalStorage(key, data){
    window.localStorage.setItem(key, JSON.stringify(data));
}

function showStudent(){
    let tbody = document.getElementById('tbStudent');
    tbody.innerHTML = '';
    students.sort(function(std1, std2){
        return std2.id - std1.id;
    })
    students.forEach(function(student, index){
        tbody.innerHTML += `
                    <tr>
                        <td class="text-center">${student.id}</td>
                        <td>${student.fullname}</td>
                        <td class='text-center'>
                            <img class='img-sm img-circle' src='${student.avatar}' />
                        </td>
                        <td class='text-center'>${student.dob}</td>
                        <td>${student.email}</td>
                        <td class='text-center'>${student.gender ? "Male" : "Female"}</td>
                        <td class='text-right'>
                            <a href='javascript:;' class='btn btn-success btn-sm'>Edit</a>
                            <a href='javascript:;' class='btn btn-danger btn-sm'>Remove</a>
                        </td>
                    </tr>
        `
    })
}

function createStudent(){
    let fn = document.getElementById('fullname').value;
    let dob = document.getElementById('dob').value;
    let email = document.getElementById('email').value;
    let gender = document.getElementsByName('gender')[0].checked;
    let avatar = "images/avatar.jpg"; //document.getElementById("avatar").value;
    let id = students[0].id + 1;
    students.push(new Student(id, fn, dob, email, gender,avatar));
    setLocalStorage(students_key, students);
    showStudent();
}

function ready(){
    init();
    showStudent();
}

ready();
