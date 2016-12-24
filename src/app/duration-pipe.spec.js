import { TestBed, async } from '@angular/core/testing';
import { durationPipe } from './duration-pipe';

describe('Duration pipe', () => {
  let pipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: durationPipe}
      ]
    });
    TestBed.compileComponents(durationPipe);
    pipe = new durationPipe();
  }));


  it('should work when passed some integers', () => {
    expect(pipe.transform(33)).toEqual('00:00:33');
    expect(pipe.transform(67)).toEqual('00:01:07');
    expect(pipe.transform(4935)).toEqual('01:22:15');
    expect(pipe.transform(0)).toEqual('00:00:00');
  });

  it('should work when passed a string', () => {
    expect(pipe.transform('33')).toEqual('00:00:33');
  });
});
