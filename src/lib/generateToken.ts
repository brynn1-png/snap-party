const TOKEN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateToken(length = 32): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += TOKEN_CHARS.charAt(Math.floor(Math.random() * TOKEN_CHARS.length));
  }
  return result;
}
