import { alias } from '@ember-decorators/object/computed';
import Controller from '@ember/controller';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';

export default class Submit extends Controller {
    @alias('model.taskInstance.value.provider') provider!: CollectionProvider;
    @alias('model.taskInstance.value.collection') collection!: Collection;
    @alias('model.taskInstance.value.collectedMetadatum') collectedMetadatum!: CollectedMetadatum;
}