import { TemplateRef } from '@angular/core';

export interface Toast {
  textOrTpl: string | TemplateRef<unknown>;
  classname?: string;
  delay?: number;
  autohide?: boolean;
}

export type ToastOptions = Omit<Toast, 'textOrTpl'>;
