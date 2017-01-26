import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ResoundComponent } from './resound';
import { DropzoneComponent } from './dropzone/dropzone';
import { FileUploadComponent } from './dropzone/file-upload';
import { durationPipe } from './duration-pipe';

describe('Resound component', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        ResoundComponent,
        DropzoneComponent,
        FileUploadComponent,
        durationPipe
      ]
    });
    TestBed.compileComponents();
  }));

  it('should have dropzone markup', () => {
    const fixture = TestBed.createComponent(ResoundComponent);
    fixture.detectChanges();
    const resound = fixture.nativeElement;
    expect(resound.querySelector('dropzone').innerText).toMatch('browse for files');
  });
});
