const supabase = require("../config/supabaseClient");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from("users").insert([
    {
      name,
      email,
      password: hashedPassword,
    },
  ]);

  if (error) return res.status(400).json(error);

  res.json({ message: "User created successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!data) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, data.password);

  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = generateToken(data);

  res.json({ token });
};
