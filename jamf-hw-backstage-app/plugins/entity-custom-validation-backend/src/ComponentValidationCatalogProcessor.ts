import { Entity } from '@backstage/catalog-model';
import { CatalogProcessor } from '@backstage/plugin-catalog-node';
import { JsonObject } from '@backstage/types';
import { EntityType } from './enums/EntityType';
import { LifecycleType } from './enums/LifecycleType';

interface ComponentEntityValidation {
  isComponentLifcycleValid: boolean;
  isRegionValid: boolean;
  hasAdditionalAttributes: boolean;
}

export class ComponentValidationCatalogProcessor implements CatalogProcessor {
  private readonly extraEntityAttributes = ['region'];

  getProcessorName(): string {
    return 'ComponentValidationCatalogProcessor';
  }

  async preProcessEntity(entity: Entity): Promise<Entity> {
    if (entity?.kind === EntityType.Component) {
      const componentEntityValidation: ComponentEntityValidation = this.getComponentEntityValidation(entity);
      const isValid = this.isComponentEntityValid(componentEntityValidation);

      if (!isValid) {
        const errorMessage: string = this.getErrorMessage(componentEntityValidation);

        throw new Error(`Validation failed for Component entity.\nReason: ${errorMessage}`);
      }

      return entity;
    }

    return entity;
  }

  private isComponentEntityValid(componentEntityValidation: ComponentEntityValidation): boolean {
    return !componentEntityValidation.hasAdditionalAttributes
      && componentEntityValidation.isComponentLifcycleValid
      && componentEntityValidation.isRegionValid;
  }

  private getComponentEntityValidation(entity: Entity): ComponentEntityValidation {
    return {
      isComponentLifcycleValid: this.isComponentLifcycleValid(entity.spec?.lifecycle as string),
      isRegionValid: this.isRegionValid(entity.spec?.region as string),
      hasAdditionalAttributes: this.hasAdditionalAttributes(entity.spec),
    };
  }

  private isComponentLifcycleValid(lifecycle?: string): boolean {
    if (!lifecycle)
      return true;
    
    const enumValues: string[] = Object.values(LifecycleType);

    return enumValues.includes(lifecycle);
  }

  private isRegionValid(region?: string): boolean {
    if (!region)
      return true;

    const regex = /^(?:[a-z]{2}-)?(central|east|west|north|south)(-(\d+))?$/;

    return regex.test(region);
  }

  private hasAdditionalAttributes<T extends JsonObject>(spec?: T): boolean {
    if (!spec)
      return true;

    const currentEntityAttributes = Object.keys(spec) as (keyof T)[];
    const entityDefaultAttributes: string[] = this.getDefaultEntityComponentSpecAttributes();
    const validEntityAttributes = [...entityDefaultAttributes, ...this.extraEntityAttributes];

    return currentEntityAttributes.some(attribute => !validEntityAttributes.includes(attribute.toString()));
  }

  private getDefaultEntityComponentSpecAttributes(): string[] {
    // NOTE: this shouldn't be hard coded 
    return [
      'type',
      'lifecycle',
      'owner',
      'providesApis',
      'consumesApis'
    ];
  }

  private getErrorMessage(componentEntityValidation: ComponentEntityValidation): string {
    let errorMessage: string = '';

    // NOTE: error messages could be concatenated if necessary -> update if needed
    if (!componentEntityValidation.isComponentLifcycleValid) {
      errorMessage = 'Component attribute spec contains invalid valude for lifecycle attribute.';
    }

    if (!componentEntityValidation.isRegionValid) {
      errorMessage = 'Component attribute spec contains invalid valude for region attribute.';
    }

    if (componentEntityValidation.hasAdditionalAttributes) {
      errorMessage = 'Component attribute spec contains additional attribute.';
    }

    return errorMessage;
  }

}

