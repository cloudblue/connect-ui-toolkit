import Button from './widget';

describe('Button widget', () => {
  let result;
  let component;

  describe('computed', () => {
    describe('#style', () => {
      it('returns the styles', () => {
        component = Button.setup(
          {
            backgroundColor: 'red',
            color: 'white'
          },
          {expose: () => 'mock reqired for composition api'}
        );

        result = component.style.value;

        expect(result).toEqual(`
  background-color: red;
  color: white;
`);
      });
    });
  });
});
