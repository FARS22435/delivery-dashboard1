function sendMessage() {
    let message = document.getElementById("message").value;
    database.ref("messages").set({
        text: message
    });
    alert("تم إرسال الرسالة!");
}

// استقبال الرسائل في صفحة العمال
database.ref("messages").on("value", function(snapshot) {
    let message = snapshot.val().text || "لا توجد رسائل بعد.";
    document.getElementById("workerMessage").innerText = message;
});
