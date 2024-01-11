import { TotalAndOffset } from '../../interface';
import { propertyOf, proxiedPropertiesOf } from './property-of.function';

interface A {
  a?: string | null | undefined;
}

describe('propertyOf functions', () => {
  describe('propertyOf', () => {
    it('should get the property name of an object type', () => {
      expect(propertyOf<TotalAndOffset>('total')).toEqual('total');
      expect(propertyOf<TotalAndOffset>('offset')).toEqual('offset');
    });
  });

  describe('proxiedPropertiesOf', () => {
    it(`should create an object of the type's properties`, () => {
      const totalAndOffsetProperties = proxiedPropertiesOf<TotalAndOffset>();
      expect(totalAndOffsetProperties.total).toEqual('total');
      expect(totalAndOffsetProperties.offset).toEqual('offset');

      const aProperties = proxiedPropertiesOf<A>();
      expect(aProperties.a).toEqual('a');
    });
  });
});
