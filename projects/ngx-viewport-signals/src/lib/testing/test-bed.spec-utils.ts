import { Provider, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export function configureViewportTestBed(extraProviders: Provider[] = []): void {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), ...extraProviders],
  });
}
