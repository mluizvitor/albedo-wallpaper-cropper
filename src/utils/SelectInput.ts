export function selectSystemNameInput(inputID: string) {
  const input = document.getElementById(inputID) as HTMLInputElement;
  input.focus();
  input.select();
}