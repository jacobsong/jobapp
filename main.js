// listen for form submit
document.getElementById("submit-button").addEventListener("click", saveApp);

document.body.onload = function() {
    setMaxDate();
    fetchApps();
}

function setMaxDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    } 
    if (mm < 10) {
        mm = '0' + mm
    } 
    today = yyyy+'-'+mm+'-'+dd;
    document.getElementById("appdate").setAttribute("max", today);
}

function validateForm(comp, req, title, email, date) {
    if (comp === "" || req === "" || title === "" || date === "") {
        alert("You must fill out Company Name, Req ID, Job Title, URL To Job Posting, and Date");
        return false;
    }
    if (email != "") {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) {
            alert("You must enter a valid email format");
            return false;
        }
    }
    return true;
}

function generateUniqueId() {
    var rtnVal = 0;

    if (localStorage.getItem("id") === null) {
        localStorage.setItem("id", "1");
        rtnVal = 1;
    }
    else {
        var id = parseInt(localStorage.getItem("id"));
        id++;
        rtnVal = id;
        id = id.toString();
        localStorage.setItem("id", id);
    }
    return rtnVal;
}

function saveApp() {
    var company = document.getElementById("company").value;
    var reqid = document.getElementById("reqid").value;
    var jobtitle = document.getElementById("jobtitle").value;
    var joburl = document.getElementById("joburl").value;
    var email = document.getElementById("email").value;
    var appdate = document.getElementById("appdate").value;
    var status = document.getElementById("status").value;

    if (!validateForm(company, reqid, jobtitle, email, appdate)) {
        return false;
    }

    var uniqueId = generateUniqueId();

    // put form data in object
    var jobApp = {
        id: uniqueId,
        company: company,
        req: reqid,
        title: jobtitle,
        url: joburl,
        email: email,
        date: appdate,
        status: status
    }

    if (localStorage.getItem("apps") === null) {
        // init storage array
        var apps = [];
        // add form data to array
        apps.push(jobApp);
        // store array locally
        localStorage.setItem("apps", JSON.stringify(apps));
    }
    else {
        // fetch existing storage array
        var apps = JSON.parse(localStorage.getItem("apps"));
        // add form data to existing storage array
        apps.push(jobApp);
        // store array locally
        localStorage.setItem("apps", JSON.stringify(apps));
    }
    document.getElementById("form-input").reset();
    fetchApps();
}

function deleteApp(id) {
    var apps = JSON.parse(localStorage.getItem("apps"));
    for (var i = 0; i < apps.length; i++) {
        if (apps[i].id == id) {
            apps.splice(i, 1);
        }
    }
    localStorage.setItem("apps", JSON.stringify(apps));
    fetchApps();
}

function editApp(id) {
    // fetch the data to be edited
    var apps = JSON.parse(localStorage.getItem("apps"));

    // find the item to be edited
    for (var i = 0; i < apps.length; i++) {
        if (apps[i].id == id) {
            var url = apps[i].url;
            var date = apps[i].date;
            var status = apps[i].status;
        }
    }
    // change the row to be input forms
    var row = document.getElementById("jobid" + id);
    for (var i = 0; i <= 3; i++) {
        var cellValue = row.cells[i].innerHTML;
        row.cells[i].innerHTML = 
            "<input type='text' id='cell" + i + "jobid" + id + "' value='" + cellValue + "'>";
    }
    // date cell needs different formatting
    row.cells[4].innerHTML =
        "<input type='text' id='cell" + 4 + "jobid" + id + "' value='" + date + 
        "' min='1899-01-01' max='2200-12-12' onfocus='(this.type='date')' onblur='(this.type='text')'>";
    
    // status cell needs to be a dropdown
    var statusHTML =
        "<select name='edit-status'id='cell" + 5 + "jobid" + id + "'>" +
            "<option value='Application Pending'>Application Pending</option>" +
            "<option value='Phone Interview Completed'>Phone Interview Completed</option>" +
            "<option value='Phone Interview Scheduled'>Phone Interview Scheduled</option>" +
            "<option value='Onsite Interview Scheduled'>Onsite Interview Scheduled</option>" +
            "<option value='Onsite Interview Completed'>Onsite Interview Completed</option>" +
            "<option value='Not Selected'>Not Selected</option>" +
            "<option value='Received Offer'>Received Offer</option>" +
        "</select>";
    statusHTML = statusHTML.replace("'" + status + "'", "'" + status + "'" + " selected");
    row.cells[5].innerHTML = statusHTML;

    // url cell
    row.cells[6].innerHTML = "<input type='text' id='cell" + 6 + "jobid" + id + "' value='" + url + "'>";
    
    // change edit button to save button
    row.cells[7].innerHTML = "<button class='table-btn btn-edit-save' id='btn-edit-save" + id + "' onclick='saveEdit(" + id + ")'>Save</button>";
}

function saveEdit(id) {
    // retrieve form data
    var company = document.getElementById("cell" + 0 + "jobid" + id).value;
    var reqid = document.getElementById("cell" + 1 + "jobid" + id).value;
    var jobtitle = document.getElementById("cell" + 2 + "jobid" + id).value;
    var email = document.getElementById("cell" + 3 + "jobid" + id).value;
    var appdate = document.getElementById("cell" + 4 + "jobid" + id).value;
    var status = document.getElementById("cell" + 5 + "jobid" + id).value;
    var joburl = document.getElementById("cell" + 6 + "jobid" + id).value;

    // validate data
    if (!validateForm(company, reqid, jobtitle, email, appdate)) {
        return false;
    }
    
    // find the item to be edited
    var apps = JSON.parse(localStorage.getItem("apps"));
    for (var i = 0; i < apps.length; i++) {
        if (apps[i].id == id) {
            apps[i].company = company;
            apps[i].title = jobtitle;
            apps[i].req = reqid;
            apps[i].url = joburl;
            apps[i].email = email;
            apps[i].date = appdate;
            apps[i].status = status;
        }
    }

    // save edits to local storage
    localStorage.setItem("apps", JSON.stringify(apps));

    // refresh table
    fetchApps();
}

function fetchApps() {
    var apps = JSON.parse(localStorage.getItem("apps"));
    var data = document.getElementById("data");
    data.innerHTML = "";

    if (apps != null) {
        for (var i = 0; i < apps.length; i++) {
            var id = apps[i].id;
            var company = apps[i].company;
            var req = apps[i].req;
            var title = apps[i].title;
            var url = apps[i].url;
            var email = apps[i].email;
            var date = apps[i].date;
            var status = apps[i].status;
            data.innerHTML += 
                "<tr id='jobid" + id + "'>" + 
                    "<td>" + company + "</td>" +
                    "<td>" + req + "</td>" +
                    "<td>" + title + "</td>" +
                    "<td>" + email + "</td>" +
                    "<td>" + date + "</td>" +
                    "<td>" + status + "</td>" +
                    "<td><a class='table-btn' id='url' href='" + url + "' target='_blank'>Link</a></td>" +
                    "<td><button class='table-btn btn-edit-save' id='btn-edit-save" + id + "' onclick='editApp(" + id + ")'>Edit</button></td>" +
                    "<td><button class='table-btn' id='btn-delete' onclick='deleteApp(" + id + ")'>Delete</button></td>" +
                "</tr>"
                ;
        }
    }
}