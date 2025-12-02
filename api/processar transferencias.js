import { createClient } from "@supabase/supabase-js";

const supa = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

async function processar() {
    const { data: pendentes } = await supa
        .from("openbank")
        .select("*")
        .eq("status", "pending")
        .eq("tipo", "ptc_to_quantum");

    for (const trans of pendentes) {

        // adiciona saldo no banco Quantum
        await supa.rpc("adicionar_saldo", {
            userid: trans.quantum_user,
            valor: trans.valor
        });

        // marca como concluído
        await supa
            .from("openbank")
            .update({ status: "confirmed" })
            .eq("id", trans.id);
    }
}
processar();
