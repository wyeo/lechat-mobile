export default function ellipsis(str: string, maxLength: number) {
  return str.length > maxLength ? str.substring(0, maxLength - 3) + "..." : str;
}
