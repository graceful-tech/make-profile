export interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}
