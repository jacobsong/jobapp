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

function validateForm(comp, req, title, url, email, date) {
    if (comp === "" || req === "" || title === "" || url === "" || date === "") {
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
    if (url != "") {
        var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
            '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
            '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
            '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
            '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
            '(\#[-a-z\d_]*)?$','i'); // fragment locater
        if(!pattern.test(url)) {
            alert("Please enter a valid URL");
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

    if (!validateForm(company, reqid, jobtitle, joburl, email, appdate)) {
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
                "<tr>" + 
                    "<td>" + company + "</td>" +
                    "<td>" + req + "</td>" +
                    "<td>" + title + "</td>" +
                    "<td><a class='table-btn' id='url' href='" + url + "' target='_blank'>Link</a></td>" +
                    "<td>" + email + "</td>" +
                    "<td>" + date + "</td>" +
                    "<td>" + status + "</td>" +
                    "<td><button class='table-btn' id='btn-edit' onclick='editApp(" + id + ")'>Edit</button></td>" +
                    "<td><button class='table-btn' id='btn-delete' onclick='deleteApp(" + id + ")'>Delete</button></td>" +
                "</tr>"
                ;
        }
    }
}