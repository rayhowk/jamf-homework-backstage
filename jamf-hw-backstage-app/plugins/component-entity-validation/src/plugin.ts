import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

import ComponentEntityValidationCustomPage from './ComponentEntityValidationCustomPage';

export const componentEntityValidationPlugin = createPlugin({
  id: 'component-entity-validation',
  routes: {
    root: rootRouteRef,
  },
});

export const ComponentEntityValidationPage = componentEntityValidationPlugin.provide(
  createRoutableExtension({
    name: 'ComponentEntityValidationPage',
    component: () =>
      Promise.resolve(ComponentEntityValidationCustomPage),
    mountPoint: rootRouteRef,
  }),
);
