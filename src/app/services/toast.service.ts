import { Injectable, TemplateRef } from '@angular/core';
import { Toast, ToastOptions } from '../model/toast.interface';

@Injectable()
export class ToastService {
  toasts: Toast[] = [];

  show(textOrTpl: string | TemplateRef<unknown>, options: ToastOptions = {}): void {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: Toast): void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
