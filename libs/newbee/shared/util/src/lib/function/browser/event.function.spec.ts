import { ignoreMouseEvent } from './event.function';

describe('EventFunction', () => {
  let mouseEvent: MouseEvent;

  beforeEach(() => {
    mouseEvent = new MouseEvent('mousedown');
    jest.spyOn(mouseEvent, 'preventDefault');
  });

  describe('ignoreMouseEvent', () => {
    it('should call prevent default', () => {
      ignoreMouseEvent(mouseEvent);
      expect(mouseEvent.preventDefault).toHaveBeenCalledTimes(1);
    });
  });
});
