// Função utilitária para verificar se uma cor HSL é escura
export function isHslDark(hsl: string): boolean {
  // hsl esperado no formato "h s% l%"
  const match = hsl.match(/\d+\s+(\d+)%\s+(\d+)%/);
  if (!match) return false;
  const l = parseInt(match[2], 10);
  // Luminância abaixo de 50% é considerado escuro
  return l < 50;
}

// Função para decidir a cor do texto (preto ou branco) para contraste
export function getContrastTextColor(hsl: string): string {
  return isHslDark(hsl) ? "#fff" : "#000";
}
