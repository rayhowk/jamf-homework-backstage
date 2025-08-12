# jamf-homework-backstage

## custom plugins
### component-entity-validation
- frontend plugin that integrates *entity-validation* comunity plugin
- it was supposed to be able to extend community plugin somehow, but currently it just calls plugin page
- this step could be skipped and community plugin *entity-validation* could be installed in application (and not in custom plugin)

### entity-custom-validation-backend
- backend plugin which should validate entity type Component
- plugin contains custom processor *ComponentValidationCatalogProcessor* that handles validation
- it was supposed to keep validation separate from application, so it can be used in another application or current application can use different validator

