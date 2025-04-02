// عند تغيير حالة المستخدم (مستخدم مسجل الدخول أو لا)
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        let userId = user.uid;
        firebase.database().ref("users/" + userId).once("value", (snapshot) => {
            let userData = snapshot.val();
            if (userData && userData.role === "admin") {
                console.log("مرحبًا، لديك صلاحية دخول المشرف.");
            } else {
                alert("ليس لديك صلاحية دخول لوحة التحكم!");
                firebase.auth().signOut().then(() => {
                    window.location.href = "login.html";
                });
            }
        });
    } else if (window.location.pathname.includes("admin.html")) {
        window.location.href = "login.html"; // إعادة التوجيه إذا لم يكن المستخدم مسجلًا
    }
});

// دالة إنشاء حساب المشرف
function register() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            let userId = user.uid;

            // حفظ بيانات المشرف في قاعدة البيانات
            firebase.database().ref("users/" + userId).set({
                email: email,
                role: "admin"
            }).then(() => {
                alert("تم إنشاء الحساب بنجاح!");
                window.location.href = "admin.html"; // توجيه المشرف للوحة التحكم
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
            window.location.href = "admin.html"; // انتقال للأدمن بعد تسجيل الدخول
        })
        .catch(error => {
            document.getElementById("error-message").innerText = error.message;
        });
}

// دالة تسجيل الخروج
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html";
    });
}
