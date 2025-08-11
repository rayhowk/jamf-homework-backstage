import { createDevApp } from '@backstage/dev-utils';
import { componentEntityValidationPlugin, ComponentEntityValidationPage } from '../src/plugin';

createDevApp()
  .registerPlugin(componentEntityValidationPlugin)
  .addPage({
    element: <ComponentEntityValidationPage />,
    title: 'Root Page',
    path: '/component-entity-validation',
  })
  .render();
