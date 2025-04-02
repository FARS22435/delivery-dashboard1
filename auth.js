// دالة إنشاء حساب المشرف
function register() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            let userId = user.uid;

            // حفظ بيانات المستخدم في قاعدة البيانات
            firebase.database().ref("users/" + userId).set({
                email: email,
                role: role
            }).then(() => {
                alert("تم إنشاء الحساب بنجاح!");
                if (role === "admin") {
                    window.location.href = "admin.html"; // توجيه المشرف إلى لوحة التحكم
                } else {
                    window.location.href = "worker.html"; // توجيه العامل إلى صفحته
                }
            });
        })
        .catch(error => {
            document.getElementById("error-message").innerText = error.message;
        });
}

// دالة تسجيل الدخول
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            let user = firebase.auth().currentUser;
            let userId = user.uid;
            firebase.database().ref("users/" + userId).once("value", (snapshot) => {
                let userData = snapshot.val();
                if (userData.role === "admin") {
                    window.location.href = "admin.html"; // إذا كان المستخدم مشرفًا
                } else {
                    window.location.href = "worker.html"; // إذا كان المستخدم عاملًا
                }
            });
        })
        .catch(error => {
            document.getElementById("error-message").innerText = error.message;
        });
}

// دالة تسجيل الخروج
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html"; // العودة إلى صفحة تسجيل الدخول
    });
}

// التحقق من حالة المستخدم عند فتح الصفحات المحمية
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        let userId = user.uid;
        firebase.database().ref("users/" + userId).once("value", (snapshot) => {
            let userData = snapshot.val();
            if (userData.role === "admin" && window.location.pathname !== "/admin.html") {
                window.location.href = "admin.html";
            } else if (userData.role === "worker" && window.location.pathname !== "/worker.html") {
                window.location.href = "worker.html";
            }
        });
    } else {
        if (window.location.pathname !== "/login.html") {
            window.location.href = "login.html";
        }
    }
});
