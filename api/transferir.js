import { createClient } from "@supabase/supabase-js";

const SUPA_URL = "https://lpkhscatjrllfscqmxka.supabase.co";
const SUPA_KEY = "CHAVE DO SUPABASE";

const supa = createClient(SUPA_URL, SUPA_KEY);

// URL DA API DO PTC
const PTC_URL = "https://seu-ptc.onrender.com/api/receberTransferencia";

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Método não permitido" });

    const { valor, userPTC } = req.body;

    const userQuantum = 1; // ← VOCÊ AJUSTA ISSO (pega do login real)

    // Buscar usuário Quantum
    const { data: dados, error } = await supa
        .from("banco")
        .select("*")
        .eq("id", userQuantum)
        .single();

    if (error || !dados)
        return res.status(400).json({ error: "Usuário Quantum inválido" });

    if (dados.saldo < valor)
        return res.status(400).json({ error: "Saldo insuficiente" });

    const novoSaldo = dados.saldo - valor;

    // Gerar chave
    const transacao = "QPTC-" + Date.now();

    // 1) ATUALIZA SALDO QUANTUM
    await supa
        .from("banco")
        .update({ saldo: novoSaldo })
        .eq("id", userQuantum);

    // 2) REGISTRA OPENBANK (QUANTUM)
    await supa.from("openbank").insert({
        usuario_quantum: userQuantum,
        usuario_ptc: userPTC,
        valor,
        metodo: "saldo",
        tipo: "transferencia",
        status: "ok",
        transacao,
        descricao: "Quantum → PTC"
    });

    // 3) ENVIAR PARA O PTC
    const send = await fetch(PTC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userPTC,
            userQuantum,
            valor,
            transacao
        })
    });

    const retornoPTC = await send.json();

    if (!send.ok)
        return res.status(400).json({ error: retornoPTC.error });

    res.json({ ok: true, transacao });
}
