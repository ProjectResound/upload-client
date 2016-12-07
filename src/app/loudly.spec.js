import { TestBed, async } from '@angular/core/testing';
import { LoudlyComponent } from './loudly';
import { DropzoneComponent } from './dropzone/dropzone'

describe('Loudly component', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoudlyComponent,
        DropzoneComponent
      ]
    });
    TestBed.compileComponents();
  }));

  it('should have dropzone markup', () => {
    const fixture = TestBed.createComponent(LoudlyComponent);
    fixture.detectChanges();
    const loudly = fixture.nativeElement;
    expect(loudly.querySelector('dropzone').innerText).toMatch('browse for files');
  });
});
