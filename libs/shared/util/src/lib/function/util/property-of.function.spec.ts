import { OffsetAndLimit } from '../../interface';
import { propertyOf, proxiedPropertiesOf } from './property-of.function';

interface A {
  a?: string | null | undefined;
}

describe('propertyOf functions', () => {
  describe('propertyOf', () => {
    it('should get the property name of an object type', () => {
      expect(propertyOf<OffsetAndLimit>('offset')).toEqual('offset');
      expect(propertyOf<OffsetAndLimit>('limit')).toEqual('limit');
    });
  });

  describe('proxiedPropertiesOf', () => {
    it(`should create an object of the type's properties`, () => {
      const offsetAndLimitProperties = proxiedPropertiesOf<OffsetAndLimit>();
      expect(offsetAndLimitProperties.offset).toEqual('offset');
      expect(offsetAndLimitProperties.limit).toEqual('limit');

      const aProperties = proxiedPropertiesOf<A>();
      expect(aProperties.a).toEqual('a');
    });
  });
});
