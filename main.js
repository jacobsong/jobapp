// listen for form submit
document.getElementById("jobform").addEventListener("submit", saveApp);

function saveApp() {
    var reqid = document.getElementById('reqid').value;
    var jobtitle = document.getElementById('jobtitle').value;
    var appdate = document.getElementById('appdate').value;

    // put form data in object
    var jobApp = {
        req: reqid,
        title: jobtitle,
        date: appdate
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