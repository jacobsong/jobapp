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
        alert("You must fill out Company Name, Req ID, Job Title, and Date");
        return false;
    }
    else if (date != "") {
        
    }
    else if (email != "") {

    }
    else {
        return true;
    }
}

function saveApp() {
    var company = document.getElementById('company').value;
    var reqid = document.getElementById('reqid').value;
    var jobtitle = document.getElementById('jobtitle').value;
    var email = document.getElementById('email').value;
    var appdate = document.getElementById('appdate').value;
    var status = document.getElementById('status').value;

    if (!validateForm(company, reqid, jobtitle, email, appdate)) {
        return false;
    }

    // put form data in object
    var jobApp = {
        company: company,
        req: reqid,
        title: jobtitle,
        email: email,
        date: appdate,
        status: status
    }

    if (localStorage.getItem('apps') === null) {
        // init storage array
        var apps = [];
        // add form data to array
        apps.push(jobApp);
        // store array locally
        localStorage.setItem('apps', JSON.stringify(apps));
    }
    else {
        // fetch existing storage array
        var apps = JSON.parse(localStorage.getItem('apps'));
        // add form data to existing storage array
        apps.push(jobApp);
        // store array locally
        localStorage.setItem('apps', JSON.stringify(apps));
    }
}

function fetchApps() {
    var apps = JSON.parse(localStorage.getItem('apps'));
    console.log(apps);
}