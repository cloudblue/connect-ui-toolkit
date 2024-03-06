import Icon from './widget';

describe('Icon', () => {
  let result;

  describe('computed', () => {
    describe('#icon', () => {
      it('should return icon based on iconName', () => {
        const component = Icon.setup(
          { iconName: 'googleSnowboardingBaseline' },
          { expose: () => 'mock reqired for composition api' },
        );
        result = component.icon.value;

        expect(result).toEqual(
          '<svg>This replaces import of files from @cloudblueconnect/material-svg in .spec.js files to optimize the run time of all unit tests</svg>',
        );
      });
    });

    describe('#styles', () => {
      it('should return styles based on props', () => {
        const component = Icon.setup(
          {
            color: 'blue',
            size: '12',
          },
          { expose: () => 'mock reqired for composition api' },
        );
        result = component.styles.value;

        expect(result).toEqual({
          color: 'blue',
          height: '12px',
          width: '12px',
        });
      });
    });
  });

  describe('methods', () => {
    describe('#addUnits', () => {
      it('should add "px" if size prop is passed as Number', () => {
        const component = Icon.setup(
          { size: '12' },
          { expose: () => 'mock reqired for composition api' },
        );
        result = component.addUnits(12);

        expect(result).toEqual('12px');
      });

      it('should add px if size prop is passed as String, but without "px"', () => {
        const component = Icon.setup({ size: '12' }, { expose: (x) => x });
        result = component.addUnits(12);

        expect(result).toEqual('12px');
      });

      it('shouldn\'t add px if size prop is passed as String with "px"', () => {
        const component = Icon.setup(
          { size: '12px' },
          { expose: () => 'mock reqired for composition api' },
        );
        result = component.addUnits(12);

        expect(result).toEqual('12px');
      });
    });
  });
});
