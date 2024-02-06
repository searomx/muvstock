export default class CompleteString {
  static formatarPadString(value: string, totalWidth: number, paddingChar?: string) {
    return value.padStart(totalWidth, paddingChar || "0");
  }
}