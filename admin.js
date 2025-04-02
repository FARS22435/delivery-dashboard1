// عرض قائمة المستخدمين
firebase.database().ref("users").on("value", (snapshot) => {
    let userList = document.getElementById("user-list");
    userList.innerHTML = ""; // مسح القائمة الحالية
    snapshot.forEach(childSnapshot => {
        let user = childSnapshot.val();
        let li = document.createElement("li");
        li.textContent = `البريد الإلكتروني: ${user.email} | الدور: ${user.role}`;
        userList.appendChild(li);
    });
});
