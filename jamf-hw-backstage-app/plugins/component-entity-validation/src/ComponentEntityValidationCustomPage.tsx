import { Entity } from '@backstage/catalog-model';
import { EntityValidationPage } from '@backstage/plugin-entity-validation';
import { useEntity } from '@backstage/plugin-catalog-react';
import { JsonObject } from '@backstage/types';
import ErrorMessage from './ErrorMessage';

interface ComponentEntityValidation {
    isComponentLifcycleValid: boolean;
    isRegionValid: boolean;
    hasAdditionalAttributes: boolean;
}

const extraEntityAttributes = ['region'];

const ComponentEntityValidationCustomPage = () => {

    const { entity } = useEntity();

    if (entity.kind === EntityType.Component) {
        const componentEntityValidation: ComponentEntityValidation = getComponentEntityValidation(entity);
        const isValid = isComponentEntityValid(componentEntityValidation);

      if (!isValid) {
        const errorMessage: string = 'Custom validation failed for Component entity.';
        const reason: string = getErrorMessage(componentEntityValidation);
        
        return <ErrorMessage
                errorMessage={errorMessage}
                reason={reason}
            />;
      }
    }

    return <EntityValidationPage />;

};

function isComponentEntityValid(componentEntityValidation: ComponentEntityValidation): boolean {
    return !componentEntityValidation.hasAdditionalAttributes
        && componentEntityValidation.isComponentLifcycleValid
        && componentEntityValidation.isRegionValid;
} 

function getComponentEntityValidation(entity: Entity): ComponentEntityValidation {
    return {
        isComponentLifcycleValid: isComponentLifcycleValid(entity.spec?.lifecycle as string),
        isRegionValid: isRegionValid(entity.spec?.region as string),
        hasAdditionalAttributes: hasAdditionalAttributes(entity.spec),
    };
}

function isComponentLifcycleValid(lifecycle?: string): boolean {
    if (!lifecycle)
        return true;
    
    return lifecycle in LifecycleType;
}

function isRegionValid(region?: string) {
    if (!region)
        return true;

    const regex = /^(?:[a-z]{2}-)?(central|east|west|north|south)(-(\d+))?$/;
    
    return regex.test(region);
}

function hasAdditionalAttributes<T extends JsonObject>(spec?: T): boolean {
    if (!spec)
        return true;

    const currentEntityAttributes = Object.keys(spec) as (keyof T)[];
    const entityDefaultAttributes: (keyof T)[] = Object.keys({} as T) as (keyof T)[];
    const validEntityAttributes = [...entityDefaultAttributes, ...extraEntityAttributes];

    return currentEntityAttributes.some(attribute => !validEntityAttributes.includes(attribute));
}

function getErrorMessage(componentEntityValidation: ComponentEntityValidation): string {
    let errorMessage: string = '';

    // NOTE: error messages could be concatenated if necessary - update if needed
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


export default ComponentEntityValidationCustomPage;
