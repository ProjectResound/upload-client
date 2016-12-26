import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { dispatchEvent } from '@angular/platform-browser/testing/browser_util';
import { By } from '@angular/platform-browser/src/dom/debug/by';

import { DropzoneComponent } from './dropzone';
import { FileUploadComponent } from './file-upload';
import { durationPipe } from '../duration-pipe';

describe('Dropzone component', () => {
  let dropzone,
    fileName,
    fixture,
    file,
    mockEvent,
    dropzoneView;

  // Use the same AudioContext for each test because we're limited to only 6 and each spec creates a new one.
  let audioContext = new AudioContext();

  beforeEach(async(() => {
    spyOn(window, 'AudioContext').and.callFake(() => {
      return audioContext;
    });

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        DropzoneComponent,
        FileUploadComponent,
        durationPipe
      ]
    });
    TestBed.compileComponents();

    fileName = 'someFileName.wav';

    // class fakeFlow {
    //   constructor() {
    //   }
    //   upload(file) {
    //     this.emit('fileProgress',
    //       {
    //         name: fileName,
    //         progress: () => { return 0.2; }
    //       }
    //     );
    //   }
    // }

    fixture = TestBed.createComponent(DropzoneComponent);
    file = new File([''], fileName, {type: 'audio/wav'});
    mockEvent = {
      srcElement: {
        files: [
          file
        ]
      }
    };
    dropzone = fixture.componentInstance;
    dropzone.onInputChange(mockEvent);
    fixture.detectChanges();
    dropzoneView = fixture.nativeElement;

  }));

  it('should show title form when adding a file to the queue is triggered', () => {
    expect(dropzone.dropzoneQueueKeysArray().length).toBe(1);
    expect(dropzone.dropzoneQueue[fileName]).not.toBeNull();
    expect(dropzoneView.querySelector('label').innerText).
    toMatch('Title');
  });

  it('should disable upload button when form is not valid', () => {
    expect(dropzoneView.querySelector('button[type="submit"][ng-reflect-disabled="true"].upload-button')).not.toBeNull();
  });

  it('should show upload button when form is valid', () => {
    const titleInput = fixture.debugElement.query(By.css('input.title'));
    titleInput.nativeElement.value = 'some title';
    dispatchEvent(titleInput.nativeElement, 'input');
    const contributorInput = fixture.debugElement.query(By.css('input.contributor'));
    contributorInput.nativeElement.value = 'some contributor';
    dispatchEvent(contributorInput.nativeElement, 'input');
    fixture.detectChanges();
    expect(dropzoneView.querySelector('button[type="submit"][ng-reflect-disabled="false"].upload-button')).not.toBeNull();
  });

  describe('flow', () => {

    beforeEach(() => {
      const titleInput = fixture.debugElement.query(By.css('input.title'));
      titleInput.nativeElement.value = 'some title';
      dispatchEvent(titleInput.nativeElement, 'input');
      const contributorInput = fixture.debugElement.query(By.css('input.contributor'));
      contributorInput.nativeElement.value = 'some contributor';
      dispatchEvent(contributorInput.nativeElement, 'input');
      fixture.detectChanges();
      dropzoneView.querySelector('button.upload-button').click();
    });

    it('should show progress view when flow updates progress', () => {
      dropzone.flow.fire('fileProgress',
        {
          name: fileName,
          progress: () => { return 0.2; }
        }
      );
      fixture.detectChanges();
      expect(dropzoneView.querySelector('.uploading-container')).not.toBeNull();
      expect(dropzoneView.querySelector('.progress').innerText).toBe('Loading (20%)');
    });

    it('should show error view when upload failed', () => {
      dropzone.flow.fire('error',
        { name: fileName },
        'Fake error message'
      );
      fixture.detectChanges();
      expect(dropzoneView.querySelector('.failed-container')).not.toBeNull();
    });

    it('should show paused view when upload is paused', () => {
      fixture.detectChanges();
      dropzoneView.querySelector('.upload-pause').click();
      fixture.detectChanges();
      expect(dropzoneView.querySelector('.paused-container')).not.toBeNull();
      dropzoneView.querySelector('.resume').click();
      fixture.detectChanges();
      expect(dropzoneView.querySelector('.uploading-container')).not.toBeNull();
    });

    it('should show completed view when upload is successful', () => {
      const fakeFileSize = 123;
      dropzone.flow.fire('fileSuccess',
        { name: fileName, size: fakeFileSize },
        `{ "fileSize": ${fakeFileSize}}`
      );
      fixture.detectChanges();
      expect(dropzoneView.querySelector('.success-container')).not.toBeNull();
    });
  });
});
