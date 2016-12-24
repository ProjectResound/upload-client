import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { LoudlyComponent } from './loudly';
import { DropzoneComponent } from './dropzone/dropzone';
import { FileUploadComponent } from './dropzone/file-upload';
import { durationPipe } from './duration-pipe';

describe('Loudly component', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        LoudlyComponent,
        DropzoneComponent,
        FileUploadComponent,
        durationPipe
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
