const supabase = require("../config/supabaseClient");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "name, email and password are required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase
    .from("users")
    .insert([{ name, email, password: hashedPassword }]);

  if (error) return res.status(400).json({ message: error.message });

  res.json({ message: "User created successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "email and password are required" });

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data)
    return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, data.password);

  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = generateToken(data);

  res.json({ token });
};
