import plugin from './bus-vue-plugin';

describe('bus-vue-plugin', () => {
  it('should call provide a bus as $bus', () => {
    const app = { provide: jest.fn() };
    const bus = 'BUS';
    plugin(bus)(app);
    expect(app.provide).toHaveBeenCalledWith('$bus', 'BUS');
  });
});