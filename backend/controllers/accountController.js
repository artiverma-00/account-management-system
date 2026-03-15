const supabase = require("../config/supabaseClient");

async function attachPartyNames(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return transactions || [];
  }

  const ids = [
    ...new Set(
      transactions.flatMap((transaction) => [
        transaction.sender_id,
        transaction.receiver_id,
      ]),
    ),
  ];

  if (ids.length === 0) {
    return transactions;
  }

  const { data: users, error } = await supabase
    .from("users")
    .select("id, name, email")
    .in("id", ids);

  if (error || !users) {
    return transactions;
  }

  const userMap = new Map(users.map((user) => [user.id, user]));

  return transactions.map((transaction) => ({
    ...transaction,
    receiver_name:
      userMap.get(transaction.receiver_id)?.name ||
      userMap.get(transaction.receiver_id)?.email ||
      null,
    sender_name:
      userMap.get(transaction.sender_id)?.name ||
      userMap.get(transaction.sender_id)?.email ||
      null,
  }));
}

exports.getBalance = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("balance")
    .eq("id", req.user.id)
    .single();

  if (error) return res.status(400).json({ message: error.message });

  res.json(data);
};

exports.getStatement = async (req, res) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ message: error.message });

  res.json(await attachPartyNames(data));
};

exports.transfer = async (req, res) => {
  const { receiverId, amount } = req.body;

  if (!receiverId || !amount || amount <= 0)
    return res
      .status(400)
      .json({ message: "receiverId and a positive amount are required" });

  const senderId = req.user.id;

  const { data: sender, error: senderErr } = await supabase
    .from("users")
    .select("*")
    .eq("id", senderId)
    .single();

  if (senderErr || !sender)
    return res.status(400).json({ message: "Sender not found" });

  if (sender.balance < amount)
    return res.status(400).json({ message: "Insufficient balance" });

  const { data: receiver, error: receiverErr } = await supabase
    .from("users")
    .select("*")
    .eq("id", receiverId)
    .single();

  if (receiverErr || !receiver)
    return res.status(404).json({ message: "Receiver not found" });

  const { error: debitErr } = await supabase
    .from("users")
    .update({ balance: sender.balance - amount })
    .eq("id", senderId);

  if (debitErr) return res.status(500).json({ message: debitErr.message });

  const { error: creditErr } = await supabase
    .from("users")
    .update({ balance: receiver.balance + amount })
    .eq("id", receiverId);

  if (creditErr) return res.status(500).json({ message: creditErr.message });

  await supabase.from("transactions").insert([
    {
      sender_id: senderId,
      receiver_id: receiverId,
      amount,
      transaction_type: "debit",
    },
    {
      sender_id: senderId,
      receiver_id: receiverId,
      amount,
      transaction_type: "credit",
    },
  ]);

  res.json({ message: "Transfer successful" });
};
