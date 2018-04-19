// listen for form submit
document.getElementById("submit-button").addEventListener("click", saveApp);

document.body.onload = function() {
    var today = getMaxDate();
    document.getElementById("appdate").setAttribute("max", today);
    fetchApps();
}

function getMaxDate() {
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
    return today;
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
        email: email,
        date: appdate,
        status: status,
        url: joburl
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
            var company = apps[i].company;
            var req = apps[i].req;
            var title = apps[i].title;
            var email = apps[i].email;
            var date = apps[i].date;
            var status = apps[i].status;
            var url = apps[i].url;
        }
    }
    // change the row to be input forms
    var row = document.getElementById("jobid" + id);
    for (var i = 0; i <= 7; i++) {
        var cellValue;
        var cellId =  "cell" + i + "jobid" + id;
        var newHTML;
        
        switch (i) { // use cellValue to prepopulate inputs with existing values
            case 0: cellValue = company; break;
            case 1: cellValue = req; break;
            case 2: cellValue = title; break;
            case 3: cellValue = email; break;
            case 4: cellValue = date; break;
            case 5: cellValue = status; break;
            case 6: cellValue = url; break;
            case 7: cellValue = ""; break;
        }

        if (i <= 3 || i === 6) { // company, req, title, email, url are text inputs
            newHTML = document.createElement("input");
            newHTML.setAttribute("type", "text");
            newHTML.setAttribute("id", cellId);
            newHTML.setAttribute("value", cellValue);
        }

        else if (i === 4) { // date cell needs different formatting
            newHTML = document.createElement("input");
            newHTML.setAttribute("type", "text");
            newHTML.setAttribute("id", cellId);
            newHTML.setAttribute("value", cellValue);
            newHTML.setAttribute("min", "1899-01-01");
            newHTML.setAttribute("max", getMaxDate());
            newHTML.setAttribute("onfocus", "this.type='date'");
            newHTML.setAttribute("onblur", "this.type='text'");
        }

        else if (i === 5) { // status cell needs to be a dropdown
            var options = ["Application Pending", "Phone Interview Scheduled", "Phone Interview Completed", 
                "Onsite Interview Scheduled", "Onsite Interview Completed", "Not Selected", "Received Offer"]
            
            newHTML = document.createElement("select");
            newHTML.setAttribute("id", "cell" + i + "jobid" + id);

            for(var val of options) {
                var option = document.createElement("option");
                option.setAttribute("value", val);
                option.textContent = val;
                if (val === status) {
                    option.setAttribute("selected", "selected");
                }
                newHTML.appendChild(option);
            }
        }

        else if (i === 7) { // change edit button to save button
            newHTML = document.createElement("button");
            newHTML.setAttribute("class", "table-btn btn-edit-save");
            newHTML.setAttribute("id", "btn-edit-save" + id);
            newHTML.setAttribute("onclick", "saveEdit(" + id + ")");
            newHTML.textContent = "Save";
        }

        while (row.cells[i].firstChild) { // remove existing children then add new child
            row.cells[i].removeChild(row.cells[i].firstChild);
        }
        row.cells[i].appendChild(newHTML);
    }
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
    
    while (data.firstChild) { // remove existing children then add new child
        data.removeChild(data.firstChild);
    }

    if (apps != null) {
        for (var app of apps) {
            var rowHTML = document.createElement("tr");
            rowHTML.setAttribute("id", "jobid" + app["id"]);
            for (var property in app) {
                if (property === "id") {
                    // do nothing
                }
                else if (property === "url") {
                    var cellHTML = document.createElement("td");
                    var linkHTML = document.createElement("a");
                    linkHTML.setAttribute("rel", "external");
                    linkHTML.setAttribute("class", "table-btn");
                    linkHTML.setAttribute("id", "url");
                    linkHTML.setAttribute("href", app[property]);
                    linkHTML.setAttribute("target", "_blank");
                    linkHTML.textContent = "Link";
                    cellHTML.appendChild(linkHTML);
                    rowHTML.appendChild(cellHTML);
                }
                else {
                    var cellHTML = document.createElement("td");
                    cellHTML.textContent = app[property];
                    rowHTML.appendChild(cellHTML);
                }
            }
            var editHTML = document.createElement("td");
            var deleteHTML = document.createElement("td");
            var editBtn = document.createElement("button");
            var deleteBtn = document.createElement("button");

            editBtn.setAttribute("class", "table-btn btn-edit-save");
            editBtn.setAttribute("id", "btn-edit-save" + app["id"]);
            editBtn.setAttribute("onclick", "editApp('" + app["id"] + "')");
            editBtn.textContent = "Edit";

            deleteBtn.setAttribute("class", "table-btn");
            deleteBtn.setAttribute("id", "btn-delete");
            deleteBtn.setAttribute("onclick", "deleteApp('" + app["id"] + "')");
            deleteBtn.textContent = "Delete";

            editHTML.appendChild(editBtn);
            rowHTML.appendChild(editHTML);

            deleteHTML.appendChild(deleteBtn);
            rowHTML.appendChild(deleteHTML);

            data.appendChild(rowHTML);
        }
    }
}