import crypto from "node:crypto";

const ALGORITMO = "aes-256-gcm";
const CHAVE_SEGREDO =
  process.env.DADOS_CRIPTOGRAFIA_CHAVE ?? process.env.ENCRYPTION_KEY;

function obterChave(): Buffer {
  if (!CHAVE_SEGREDO) {
    throw new Error(
      "Variável de ambiente ENCRYPTION_KEY (ou DADOS_CRIPTOGRAFIA_CHAVE) não definida.",
    );
  }

  return crypto.createHash("sha256").update(CHAVE_SEGREDO).digest();
}

export function criptografarTexto(texto: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITMO, obterChave(), iv);

  const criptografado = Buffer.concat([
    cipher.update(texto, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("base64")}:${authTag.toString("base64")}:${criptografado.toString("base64")}`;
}

export function descriptografarTexto(texto: string): string {
  try {
    const partes = texto.split(":");

    if (partes.length !== 3) {
      return texto;
    }

    const [ivBase64, authTagBase64, conteudoBase64] = partes;
    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");
    const conteudo = Buffer.from(conteudoBase64, "base64");

    const decipher = crypto.createDecipheriv(ALGORITMO, obterChave(), iv);
    decipher.setAuthTag(authTag);

    const descriptografado = Buffer.concat([
      decipher.update(conteudo),
      decipher.final(),
    ]);

    return descriptografado.toString("utf8");
  } catch {
    return texto;
  }
}
