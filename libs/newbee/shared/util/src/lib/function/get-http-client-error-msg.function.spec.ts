import { getHttpClientErrorMsg } from './get-http-client-error-msg.function';

describe('getHttpClientErrorMsg', () => {
  it('should return an empty string if err is null', () => {
    expect(getHttpClientErrorMsg(null)).toEqual('');
  });

  it('should return the msg if messages is a string', () => {
    expect(getHttpClientErrorMsg({ status: 500, messages: 'error' })).toEqual(
      'error'
    );
    expect(
      getHttpClientErrorMsg({ status: 500, messages: 'error' }, 'a')
    ).toEqual('error');
  });

  it('should return the msg as bullets if messages is an array', () => {
    expect(getHttpClientErrorMsg({ status: 500, messages: ['error'] })).toEqual(
      '- error'
    );
    expect(
      getHttpClientErrorMsg({ status: 500, messages: ['error'] }, 'a')
    ).toEqual('- error');
  });

  it(`should return the corresponding msg if messages is an object and a key is specified, or an empty string if the key doesn't exist`, () => {
    expect(
      getHttpClientErrorMsg({ status: 500, messages: { a: 'error' } }, 'a')
    ).toEqual('error');
    expect(
      getHttpClientErrorMsg(
        { status: 500, messages: { a: ['some', 'error'] } },
        'a'
      )
    ).toEqual('- some\n- error');
    expect(
      getHttpClientErrorMsg({ status: 500, messages: { b: 'error' } }, 'a')
    ).toEqual('');
  });

  it('should return the msg as bullets if messages is an object and a key is not specified', () => {
    expect(
      getHttpClientErrorMsg({ status: 500, messages: { a: 'error' } })
    ).toEqual('- error');
    expect(
      getHttpClientErrorMsg({
        status: 500,
        messages: { a: ['some', 'error'], b: 'here' },
      })
    ).toEqual('- some\n- error\n- here');
  });
});
