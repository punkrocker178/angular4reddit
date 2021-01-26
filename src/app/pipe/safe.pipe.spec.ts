import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from './safe.pipe';

describe('SafePipe', () => {
  it('create an instance', () => {
    const pipe = new SafePipe(DomSanitizer.prototype);
    expect(pipe).toBeTruthy();
  });
});
