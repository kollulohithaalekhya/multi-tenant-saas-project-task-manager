export async function logout(req, res) {
  // JWT-only logout
  // Client removes token
  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
}
