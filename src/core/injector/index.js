import Core from './core/Core';
import injectorFactory from './core/injectorFactory';
import launch from './core/launcher';

export default (options = {}) => {
  const core = new Core();
  const injector = injectorFactory(core);
  launch(injector, core, options);

  return injector;
}