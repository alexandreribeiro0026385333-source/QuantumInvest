async function transferir() {
    const valor = Number(document.getElementById("valor").value);
    const userPTC = document.getElementById("userPTC").value;

    if (!valor || valor <= 0) {
        msg("Valor inválido!", "red");
        return;
    }

    if (!userPTC) {
        msg("Digite o ID do usuário PTC!", "red");
        return;
    }

    const res = await fetch("/api/transferir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            valor,
            userPTC
        })
    });

    const data = await res.json();

    if (!res.ok) {
        msg(data.error, "red");
        return;
    }

    msg("Transferência concluída!", "green");
}

function msg(t, c) {
    let p = document.getElementById("msg");
    p.innerText = t;
    p.style.color = c;
}
